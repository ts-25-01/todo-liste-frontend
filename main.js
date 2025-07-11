console.log("JavaScript Datei geladen");

let todosList = [];
const APIURL = "https://686e0a5fc9090c49538803f9.mockapi.io/api/todos";

// Hilfsfunktionen für Ladeanzeige und Button-Status
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

// Fehleranzeige
function showError(message) {
  document.getElementById("errorText").textContent = message;
  document.getElementById("errorMessage").classList.add("show");
  setTimeout(() => {
    document.getElementById("errorMessage").classList.remove("show");
  }, 3000);
}

// Todos von API laden
async function loadTodosFromAPI() {
  console.log("Lade Todos von der API...");
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
    renderToDos();
    hideLoading();
  }
}
loadTodosFromAPI();

// Status eines Todos ändern
async function changeStatus(index) {
  const todo = todosList[index];
  const newStatus = !todo.completed;
  todo.completed = newStatus;
  try {
    const response = await fetch(`${APIURL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        completed: newStatus,
        date: todo.date,
        id: todo.id,
      }),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const updatedTodo = await response.json();
    todosList[index] = updatedTodo;
    renderToDos();
  } catch (error) {
    console.error("Fehler beim Status ändern", error);
    showError("Status konnte nicht geändert werden.");
    todo.completed = !newStatus;
    renderToDos();
  }
}

// Todos rendern
function renderToDos() {
  const todoListElement = document.getElementById("todoList");
  todoListElement.innerHTML = "";
  for (let i = 0; i < todosList.length; i++) {
    const currentToDo = todosList[i];
    const isChecked = currentToDo.completed ? "checked" : "";
    const isEditing = currentToDo.isEditing ? "editing" : "";
    const toDoHtml = `
      <li id="todoItem-${i}" class="list-group-item d-flex justify-content-between align-items-center fade-in ${isEditing}">
        <input type="checkbox" class="form-check-input border-dark" onchange="changeStatus(${i})" ${isChecked}>
        <span id="todoText-${i}" class="${isEditing ? 'd-none' : ''}">${currentToDo.title}</span>
        <input id="editInput-${i}" class="form-control mx-5 ${isEditing ? '' : 'd-none'}" value="${currentToDo.title}">
        <div class="d-flex">
          <button class="btn btn-lg mx-auto btn-success ${isEditing ? '' : 'd-none'}" onclick="saveEdit(${i})" id="saveButton-${i}">💾</button>
          <button class="btn btn-lg mx-auto btn-outline-danger ${isEditing ? '' : 'd-none'}" onclick="cancelEdit(${i})" id="cancelButton-${i}">❌</button>
          <button class="btn btn-lg mx-auto btn-warning ${isEditing ? 'd-none' : ''}" onclick="openEditMode(${i})" id="editButton-${i}">✏️</button>
          <button class="btn btn-lg mx-auto btn-danger ${isEditing ? 'd-none' : ''}" onclick="deleteToDoModal(${i})" id="deleteButton-${i}">🗑️</button>
        </div>
      </li>
    `;
    todoListElement.innerHTML += toDoHtml;
  }
}

// Todo hinzufügen
async function addTodo() {
  const inputField = document.getElementById("todoInput");
  const inputFieldValue = inputField.value.trim();
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
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const newTodoFromAPI = await response.json();
    inputField.value = "";
    todosList.push(newTodoFromAPI);
    renderToDos();
  } catch (error) {
    console.error("Fehler beim Hinzufügen", error);
    showError("Todo konnte nicht erstellt werden");
  } finally {
    setButtonLoading(false);
  }
}

// Editiermodus öffnen (nur ein Todo gleichzeitig)
function openEditMode(index) {
  // Alle Editiermodi zurücksetzen
  todosList.forEach((todo) => (todo.isEditing = false));
  todosList[index].isEditing = true;
  renderToDos();
  document.getElementById(`editInput-${index}`).focus();
}

// Editiermodus abbrechen
function cancelEdit(index) {
  todosList[index].isEditing = false;
  renderToDos();
}

// Todo speichern
async function saveEdit(index) {
  const inputElement = document.getElementById(`editInput-${index}`);
  const newTitle = inputElement.value.trim();
  if (newTitle === "") {
    showError("Titel darf nicht leer sein");
    return;
  }
  const todo = todosList[index];
  try {
    const response = await fetch(`${APIURL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        completed: todo.completed,
        date: todo.date,
        id: todo.id,
      }),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const updatedTodoFromAPI = await response.json();
    todosList[index] = { ...updatedTodoFromAPI, isEditing: false };
    renderToDos();
  } catch (error) {
    console.error("Fehler beim Speichern", error);
    showError("Änderungen konnten nicht gespeichert werden.");
  }
}

// Globale Variable für den deleteIndex
let deleteIndex = null;

// Löschen-Modal öffnen
function deleteToDoModal(index) {
  deleteIndex = index;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

// Todo löschen
document.getElementById("confirmDeleteButton").addEventListener("click", async () => {
  if (deleteIndex !== null) {
    const todoToDelete = todosList[deleteIndex];
    try {
      const response = await fetch(`${APIURL}/${todoToDelete.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      todosList.splice(deleteIndex, 1);
      renderToDos();
      const modalElement = document.getElementById("deleteModal");
      bootstrap.Modal.getInstance(modalElement).hide();
      deleteIndex = null;
    } catch (err) {
      console.error(`Fehler beim Löschen: ${err.name}: ${err.message}`);
      showError("Todo konnte nicht gelöscht werden!");
      const modalElement = document.getElementById("deleteModal");
      bootstrap.Modal.getInstance(modalElement).hide();
      deleteIndex = null;
    }
  }
});