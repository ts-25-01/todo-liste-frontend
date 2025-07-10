console.log("JavaScript Datei geladen");

// Veränderung, dass wir ein leeres Array initialiseren, das wir gleich mit einer Funktion füllen, wo wir die API nach Daten fragen
let todosList = [];
const APIURL = "https://686e0a5fc9090c49538803f9.mockapi.io/api/todos";

// Hilfsfunktionen, um die Loading Spinner jeweils anzuzeigen bzw. wieder zu verstecken
function showLoading() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// document.getElementById('loadingSpinnerSwitchButton').addEventListener('click', () => {
//     if (document.getElementById('loadingSpinner').style.display === 'block') {
//         hideLoading();
//         let isLoading = false;
//         setButtonLoading(isLoading);
//     } else {
//         showLoading();
//         let isLoading = true;
//         setButtonLoading(isLoading);
//     }
// })

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

// Funktion, um die Fehlermeldung bei Bedarf 5 Sekunden anzuzeigen
function showError(message) {
  document.getElementById("errorText").textContent = message;
  // document.getElementById('errorMessage').style.display = 'block';
  document.getElementById("errorMessage").classList.add("show");
  setTimeout(() => {
    document.getElementById("errorMessage").classList.remove("show");
  }, 3000);
}

// Funktion, um sich die Todos von der API zu laden
async function loadTodosFromAPI() {
  // Logge dir aus, dass wir jetzt die Todos von der API laden
  console.log("Lade Todos von der API...");
  // Rufe Funktion showLoading auf, damit wir den Ladezustand angezeigt bekommen
  showLoading();
  try {
    // fetche dir die Daten von der API
    const response = await fetch(APIURL);
    // Transformiere das Response-Objekt in der Konstante response in ein json-Format
    const todosFromAPI = await response.json();
    // Schreibe diese todosFromAPI im json-Format in unsere Todos-Liste
    todosList = todosFromAPI;
    console.log("Todos geladen...", todosList);
    // Wir haben jetzt unsere Todos von der API geholt
    // Jetzt wollen wir diese Todos in der Liste darstellen
  } catch (error) {
    console.error("Fehler beim Laden", error);
    showError("Todos konnten nicht geladen werden. Offline-Modus aktiviert");
    // Gehe auf Fallback zurück
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

async function changeStatus(index) {
  // Status switchen von completed im ToDos Objekt
  // todosList[index].completed = !todosList[index].completed;
  const todo = todosList[index];
  const newStatus = !todo.completed;
  todo.completed = newStatus;
  //   renderToDos();
  try {
    console.log("ändere Status für das Todo", todo);
    console.log("todo id ", todo.id);
    console.log("neuer Status", newStatus);
    // Fetch um Status des Todos zu aktualisieren
    const response = await fetch(
      `${APIURL}/${todo.id}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({completed: newStatus}),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    console.log("Status geändert");
    // renderToDos();
  } catch (error) {
    console.error("Fehler beim Status ändern", error);
  }
  // Aufruf der Render-ToDos für aktuelle Ansicht
  // renderToDos();
}

function renderToDos() {
  // wir holen uns die todoList aus dem html doc
  const todoListElement = document.getElementById("todoList");
  // console.log(todoListElement);
  // wir leeren die ToDoList
  todoListElement.innerHTML = "";
  // console.log("Wir rendern die Todos neu")
  // mit einer for schleife über der todos iterieren
  for (let i = 0; i < todosList.length; i++) {
    const currentToDo = todosList[i];
    // erzeuge jeweils eine Zeile für das ToDo Element als li-Element in html
    // Hier wird überprüft ob completed     ? wenn wahr : wenn falsch
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
    // füge erzeugte Zeile der ToDoList hinzu
    todoListElement.innerHTML += toDoHtml;
  }
}

async function addTodo() {
  // Erster Schritt: Eingabe aus dem Input Field rausholen (mit überprüfung ob eine Eingabe existiert)
  const inputField = document.getElementById("todoInput");
  const inputFieldValue = inputField.value;
  //
  // Überprüfung ob Eingabe Leer ist
  if (inputFieldValue === "") {
    showError("Eingabe darf nicht leer sein");
    return;
  }
  setButtonLoading(true);
  try {
    console.log("Erstelle neues Todo über API...");
    // API-Call zum Hinzufügen des neuen Todos
    // über eine POST-Request
    const response = await fetch(
      APIURL,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title: inputFieldValue,
          completed: false,
        }),
      }
    );
    const newTodoFromAPI = await response.json();
    console.log("Todo hinzugefügt", newTodoFromAPI);
    // Eingabefeld wieder geleert
    inputField.value = ""; //Input Field wird geleert

    // Zweiter Schritt: Eingabe in todosList hinzufügen
    todosList.push(newTodoFromAPI); //wert aus dem Eingabefeld wird dem Array todosList hinzugefügt
    renderToDos();
    // loadTodosFromAPI();
    // Dritter Schritt: Eingabe-Feld nach dem hinzufügen leeren
  } catch (error) {
    console.error("Fehler beim Laden", error);
    showError("Todo konnte nicht erstellt werden");
  } finally {
    setButtonLoading(false);
  }
}
renderToDos();

// Globale Variable für den deleteIndex
let deleteIndex = null;

function deleteToDoModal(index) {
  deleteIndex = index;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
  // Warnung ausgeben ob wirklich gelöscht werden soll
}

async function saveEdit(index) {
  const inputElement = document.getElementById(`editInput-${index}`);
  const newTitle = inputElement.value.trim();
  if (newTitle === "") {
    console.log("Kein Titel eingegeben");
    showError("Titel darf nicht leer sein");
    return;
  }

  try {
    const response = await fetch(
      `${APIURL}/${todo.id}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: newTitle}),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const updatedTodoFromAPI = await response.json();
    todosList[index] = updatedTodoFromAPI;
    renderToDos();
  } catch (error) {
    console.error("Fehler beim Speichern", error);
    showError("Änderungen konnten nicht gespeichert werden.");
  }

  const currentText = todosList[index].title;
  // const newTitle = prompt("Bearbeite den Titel", currentText);
  if (newTitle === null) {
    console.log("Kein Titel eingegeben");
    return;
  }
  const trimmedTitle = newTitle.trim();
  todosList[index].title = trimmedTitle;
  todosList[index].completed = false;
  renderToDos();
}

function openEditMode(index) {
  console.log(`Öffne Editier-Modus für Eintrag ${index}`);
  document.getElementById(`todoItem-${index}`).classList.add('editing');
}

function cancelEdit(index) {
  console.log(`Beende Editier-Modus für Eintrag ${index}`);
  document.getElementById(`todoItem-${index}`).classList.remove('editing');
  document.getElementById(`editInput-${index}`).value = todosList[index].title;
}

// Wir wollen einen Event-Listener definieren
// dieser wird getriggert, sobald der Löschen-Button im Modal gedrückt wird
// Löschen-Button hat die ID: confirmDeleteButton
// Sobald diese Aktion passiert, wird eine Funktion ausgeführt
// Diese Funktion beinhaltet dann das Löschen des Todos aus der Liste
document
  .getElementById("confirmDeleteButton")
  .addEventListener("click", async () => {
    if (deleteIndex !== null) {
      const todoToDelete = todosList[deleteIndex];
      try {
        console.log("lösche Todo", todoToDelete);
        // Todo aus der Liste in der API löschen
        const response = await fetch(
          `${APIURL}/${todoToDelete.id}`,
          {method: "DELETE"}
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        // Lösche das parallel in unserem "künstlichen Cache"
        todosList.splice(deleteIndex, 1);
        renderToDos();
        // Bei Bedarf kann im Hintergrund das Nachladen aller Todos von der API stattfinden, falls parallel andere User Veränderungen durchgeführt haben
        // loadTodosFromAPI();
        console.log("Todo gelöscht!");
      } catch (err) {
        console.error(`Fehler beim Löschen: ${err.name}: ${err.message}`);
        showError("Todo konnte nicht gelöscht werden!");
      } finally {
        // Modal wieder schließen
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
