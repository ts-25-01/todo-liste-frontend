console.log("JavaScript Datei geladen")

let todosList = ["waschen"];

function renderToDos() {
    // wir holen uns die todoList aus dem html doc
    const todoListElement = document.getElementById("todoList");
    // console.log(todoListElement);
    // wir leeren die ToDoList
    todoListElement.innerHTML = "";
    // mit einer for schleife über der todos iterieren
    for (let i = 0; i < todosList.length; i++) {
        const currentToDo = todosList[i]
        // erzeuge jeweils eine Zeile für das ToDo Element als li-Element in html
        const toDoHtml = `
        <li class="list-group-item">${currentToDo}</li>
        `
            
        // füge erzeugte Zeile der ToDoList hinzu
        todoListElement.innerHTML += toDoHtml;
    }
    

}

function addTodo() {
    // Erster Schritt: Eingabe aus dem Input Field rausholen (mit überprüfung ob eine Eingabe existiert)
    const inputField = document.getElementById("todoInput");
    const inputFieldValue = inputField.value;
    // Überprüfung ob Eingabe Leer ist
    if (inputFieldValue === "") {
        alert("Eingabefeld ist Leer, Bitte gib ein To-Do ein");
        return;
    }
    // Zweiter Schritt: Eingabe in todosList hinzufügen
    todosList.push(inputFieldValue); //wert aus dem Eingabefeld wird dem Array todosList hinzugefügt
    // Dritter Schritt: Eingabe-Feld nach dem hinzufügen leeren
    inputField.value = "" //Input Field wird geleert
    renderToDos();
    console.log(`Das neue Todo ist: ${inputFieldValue}`)
    console.log(`Alle To-Dos: `, todosList)
    alert("To-Do erfolgreich hinzugefügt: " + inputFieldValue);
}
renderToDos();