console.log("JavaScript Datei geladen")

let todosList = [];

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
    console.log(`Das neue Todo ist: ${inputFieldValue}`)
    console.log(`Alle To-Dos: `, todosList)
    alert("To-Do erfolgreich hinzugefügt: " + inputFieldValue);
}