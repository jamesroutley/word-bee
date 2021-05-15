"use strict";
var letters = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
var gridSize = 12;
var state = {
    points: 0,
    word: "",
};
function randomInt(max) {
    return Math.floor(Math.random() * max);
}
function randomLetter() {
    var index = randomInt(letters.length);
    return letters[index];
}
function initialiseBoard() {
    var container = document.getElementById("container");
    if (!container) {
        console.error("element with ID 'container' not found");
        return;
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var button = document.createElement("button");
            var letter = randomLetter();
            button.innerHTML = letter;
            button.value = letter;
            button.id = x + "," + y;
            button.type = "button";
            button.onclick = createButtonOnClick(button);
            container.appendChild(button);
        }
    }
    var submit = document.getElementById("submit");
    if (submit) {
        submit.onclick = submitOnClick;
    }
    var cancel = document.getElementById("cancel");
    if (cancel) {
        cancel.onclick = cancelOnClick;
    }
    updateBoard();
}
function coordinatesFromId(id) {
    var parts = id.split(",");
    return {
        x: parseInt(parts[0]),
        y: parseInt(parts[1]),
    };
}
function createButtonOnClick(button) {
    return function () {
        var event = {
            letter: button.value,
            coordinates: coordinatesFromId(button.id),
        };
        handleChooseLetterMessage(event);
    };
}
function handleChooseLetterMessage(event) {
    state.word = state.word + event.letter;
    state.lastPlayedCoord = event.coordinates;
    updateBoard();
}
function updateBoard() {
    console.log(state);
    console.log(state.lastPlayedCoord);
    var container = document.getElementById("container");
    if (!container) {
        console.error("element with ID 'container' not found");
        return;
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var button = document.getElementById(x + "," + y);
            if (!state.lastPlayedCoord) {
                button.disabled = false;
            }
            else {
                var coord = { x: x, y: y };
                button.disabled = buttonDisabled(coord, state.lastPlayedCoord, state.word.length);
            }
        }
    }
    var word = document.getElementById("word");
    if (!word) {
        console.error("element with ID 'word' not found");
        return;
    }
    word.innerHTML = state.word.padEnd(20, "_");
    var points = document.getElementById("points");
    if (points) {
        points.innerHTML = "Points: " + state.points;
    }
}
function buttonDisabled(coord, lastPlayedCoord, wordLength) {
    if (coord.x === lastPlayedCoord.x && coord.y === lastPlayedCoord.y) {
        return true;
    }
    var xDist = Math.abs(lastPlayedCoord.x - coord.x);
    var yDist = Math.abs(lastPlayedCoord.y - coord.y);
    /* return xDist > wordLength || yDist > wordLength */
    return xDist + yDist > wordLength;
}
function submitOnClick() {
    // TODO: validate word
    console.log("submitting");
    if (!wordlist.includes(state.word.toLowerCase())) {
        console.error("word not found");
        return;
    }
    state.points = state.points += state.word.length * state.word.length;
    state.word = "";
    state.lastPlayedCoord = undefined;
    updateBoard();
}
function cancelOnClick() {
    state.word = "";
    state.lastPlayedCoord = undefined;
    updateBoard();
}
initialiseBoard();
