console.log("JavaScript Datei geladen")

let todosList = [
    { "title": "waschen", "completed": true, "date": "02.07.2025" },
    { "title": "putzen", "completed": false, "date": "03.07.2025" }
];

function changeStatus(index) {
    // Status switchen von completed im ToDos Objekt
    todosList[index].completed = !todosList[index].completed;
    // Aufruf der Render-ToDos für aktuelle Ansicht
    renderToDos();
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
        const currentToDo = todosList[i]
        // erzeuge jeweils eine Zeile für das ToDo Element als li-Element in html
        // Hier wird überprüft ob completed     ? wenn wahr : wenn falsch
        const isChecked = currentToDo.completed ? 'checked' : '';
        // let isChecked;
        // if (currentToDo.completed == true){
        //     isChecked = 'checked';
        // } else {
        //     isChecked = '';
        // }
        const strikethrough = currentToDo.completed ? 'text-decoration-line-through' : '';
        // console.log(currentToDo.title + ' bekommt den Wert ' + isChecked)
        const toDoHtml = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
        <input type="checkbox" class="form-check-input border-dark" onchange="changeStatus(${i})" ${isChecked}>
        <span class="${strikethrough}">${currentToDo.title}</span>
        <div>
        <button class="btn btn-lg mx-auto btn-success" onclick="editToDo(${i})">✏️</button>
        <button class="btn btn-lg mx-auto btn-danger" onclick="deleteToDo(${i})">🗑️</button>
        </div>
        </li>

        `

        // füge erzeugte Zeile der ToDoList hinzu
        todoListElement.innerHTML += toDoHtml;
    }


}

function addTodo() {
    // Erster Schritt: Eingabe aus dem Input Field rausholen (mit überprüfung ob eine Eingabe existiert)
    const inputField = document.getElementById("todoInput");
    const inputFieldValue = inputField.value;
    //
    // Überprüfung ob Eingabe Leer ist
    if (inputFieldValue === "") {
        // alert("Eingabefeld ist Leer, Bitte gib ein To-Do ein");
        return;
    }
    // Konstruiere das To-Do als Objekt - bsp: {"title": "waschen", "completed": true, "date": "02.07.2025"},
    const newTodoObject = {
        title: inputFieldValue,
        completed: false,
        date: "Platzhalter",
    }
    // Zweiter Schritt: Eingabe in todosList hinzufügen
    todosList.push(newTodoObject); //wert aus dem Eingabefeld wird dem Array todosList hinzugefügt
    // Dritter Schritt: Eingabe-Feld nach dem hinzufügen leeren
    inputField.value = "" //Input Field wird geleert
    renderToDos();

    console.log(`Das neue Todo ist: `, newTodoObject)
    console.log(`Alle To-Dos: `, todosList)
    // alert("To-Do erfolgreich hinzugefügt: " + inputFieldValue);
}
renderToDos();

// Globale Variable für den deleteIndex
let deleteIndex = null;

function deleteToDo(index) {
    deleteIndex = index;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
    // Warnung ausgeben ob wirklich gelöscht werden soll
    // const confirmDelete = confirm("Möchten Sie das ToDo wirklich löschen?");
    // // ToDo-Object aus Array löschen
    // if (confirmDelete) {
    //     // Ab dieser Stelle(Index) löschen wir ein Element 
    //     todosList.splice(index, 1)
    //     renderToDos()
    // } else {
    //     alert("Prozess wurde abgebrochen")
    // }
}

function editToDo(index) {
    const currentText = todosList[index].title;
    const newTitle = prompt("Bearbeite den Titel", currentText);
    if (newTitle === null) {
        console.log("Kein Titel eingegeben")
        return;
    }
    const trimmedTitle = newTitle.trim();
    todosList[index].title = trimmedTitle;
    todosList[index].completed = false;
    renderToDos()
}

// Wir wollen einen Event-Listener definieren
// dieser wird getriggert, sobald der Löschen-Button im Modal gedrückt wird
// Löschen-Button hat die ID: confirmDeleteButton
// Sobald diese Aktion passiert, wird eine Funktion ausgeführt
// Diese Funktion beinhaltet dann das Löschen des Todos aus der Liste
document.getElementById('confirmDeleteButton').addEventListener('click', function () {
    if (deleteIndex !== null) {
        todosList.splice(deleteIndex, 1);
        deleteIndex = null;
        renderToDos();

        const modalElement = document.getElementById('deleteModal');
        bootstrap.Modal.getInstance(modalElement).hide();
    }
})