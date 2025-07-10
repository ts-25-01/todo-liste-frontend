
console.log("JavaScript Datei geladen");

const APIURL = "https://686e0a5fc9090c49538803f9.mockapi.io/api/todos";
let todosList = [];

function showLoading() {
  document.getElementById("loadingSpinner").style.display = "block";
}
function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}
function setButtonLoading(isLoading) {
  const button = document.getElementById("addButton");
  const text = document.getElementById("addButtonText");
  const spinner = document.getElementById("addButtonSpinner");
  if (isLoading) {
    button.disabled = true;
    text.textContent = "Wird hinzugefügt";
    spinner.style.display = "inline-block";
  } else {
    button.disabled = false;
    text.textContent = "Hinzufügen";
    spinner.style.display = "none";
  }
}
function showError(message) {
  document.getElementById("errorText").textContent = message;
  document.getElementById("errorMessage").classList.add("show");
  setTimeout(() => {
    document.getElementById("errorMessage").classList.remove("show");
  }, 3000);
}

async function loadTodosFromAPI() {
  showLoading();
  try {
    const response = await fetch(APIURL);
    const todosFromAPI = await response.json();
    todosList = todosFromAPI;
    console.log("Todos geladen...", todosList);
  } catch (error) {
    console.error("Fehler beim Laden", error);
    showError("Todos konnten nicht geladen werden. Offline-Modus aktiviert");
    todosList = [
      { title: "waschen", completed: true, date: "02.07.2025" },
      { title: "putzen", completed: false, date: "03.07.2025" },
    ];
  } finally {
    renderTodos();
    hideLoading();
  }
}
loadTodosFromAPI();

async function changeStatus(index) {
  const todo = todosList[index];
  const newStatus = !todo.completed;
  todo.completed = newStatus;
  try {
    const response = await fetch(`${APIURL}/${todo.id}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ completed: newStatus }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    console.log("Status geändert");
  } catch (error) {
    console.error("Fehler beim Status ändern", error);
    showError("Status konnte nicht geändert werden.");
  }
  renderTodos();
}

function renderTodos() {
  const todoListElement = document.getElementById("todoList");
  todoListElement.innerHTML = "";
  for (let i = 0; i < todosList.length; i++) {
    const currentToDo = todosList[i];
    const isChecked = currentToDo.completed ? "checked" : "";
    const toDoHtml = `
      <li id="todoItem-${i}" class="list-group-item d-flex justify-content-between align-items-center fade-in">
        <input type="checkbox" class="form-check-input border-dark" onchange="changeStatus(${i})" ${isChecked}>
        <span id="todoText-${i}">${currentToDo.title}</span>
        <input id="editInput-${i}" class="form-control mx-5" value="${currentToDo.title}">
        <div class="d-flex">
          <button class="btn btn-lg mx-auto btn-success" onclick="saveEdit(${i})" id="saveButton-${i}">💾</button>
          <button class="btn btn-lg mx-auto btn-outline-danger" onclick="cancelEdit(${i})" id="cancelButton-${i}">❌</button>
          <button class="btn btn-lg mx-auto btn-warning" onclick="openEditMode(${i})" id="editButton-${i}">✏️</button>
          <button class="btn btn-lg mx-auto btn-danger" onclick="deleteToDoModal(${i})" id="deleteButton-${i}">🗑️</button>
        </div>
      </li>
    `;
    todoListElement.innerHTML += toDoHtml;
  }
}

async function addTodo() {
  const inputField = document.getElementById("todoInput");
  const inputFieldValue = inputField.value;
  if (inputFieldValue === "") {
    showError("Eingabe darf nicht leer sein");
    return;
  }
  setButtonLoading(true);
  try {
    const response = await fetch(APIURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputFieldValue, completed: false }),
    });
    const newTodoFromAPI = await response.json();
    inputField.value = "";
    todosList.push(newTodoFromAPI);
    renderTodos();
  } catch (error) {
    showError("Todo konnte nicht erstellt werden");
  } finally {
    setButtonLoading(false);
  }
}
renderTodos();


let deleteIndex = null;
function deleteToDoModal(index) {
  deleteIndex = index;
  // Text des zu löschenden Todos holen und im Modal anzeigen
  const todoText = todosList[index]?.title || "";
  const modalText = document.getElementById("deleteModalText");
  if (modalText) {
    modalText.textContent = `Möchtest du dieses Todo wirklich löschen?\n\n\"${todoText}\"`;
  }
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

// Neue, bereinigte saveEdit Funktion
async function saveEdit(index) {
    const inputElement = document.getElementById(`editInput-${index}`);
    const newTitle = inputElement.value.trim();

    if (newTitle === "") {
        showError("Titel darf nicht leer sein");
        return;
    }

    const todo = todosList[index];

    try {
        const response = await fetch(`https://686e0a5fc9090c49538803f9.mockapi.io/api/todos/${todo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: newTitle })
        });

        if (!response.ok) {
            throw new Error("Fehler beim Speichern");
        }

        // Erfolg: Titel lokal aktualisieren
        todo.title = newTitle;
        renderTodos(); // Liste neu anzeigen
    } catch (error) {
        showError(error.message);
    }
}

function openEditMode(index) {
  document.getElementById(`todoItem-${index}`).classList.add('editing');
}
function cancelEdit(index) {
  document.getElementById(`todoItem-${index}`).classList.remove('editing');
  document.getElementById(`editInput-${index}`).value = todosList[index].title;
}

document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
  if (deleteIndex !== null) {
    const todoToDelete = todosList[deleteIndex];
    try {
      const response = await fetch(`${APIURL}/${todoToDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      todosList.splice(deleteIndex, 1);
      renderTodos();
    } catch (err) {
      showError("Todo konnte nicht gelöscht werden!");
    } finally {
      const modalElement = document.getElementById("deleteModal");
      bootstrap.Modal.getInstance(modalElement).hide();
      deleteIndex = null;
    }
  }
});

// function buttonClicked() {
//     if (deleteIndex !== null) {
//         todosList.splice(deleteIndex, 1);
//         deleteIndex = null;
//         renderToDos();

//         const modalElement = document.getElementById('deleteModal');
//         bootstrap.Modal.getInstance(modalElement).hide();
//     }
// }

// document.getElementById('confirmDeleteButton').addEventListener('click', buttonClicked())
