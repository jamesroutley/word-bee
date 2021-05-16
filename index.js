"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var letters = "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";
var scoreTargets = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800];
var gridSize = 8;
var state = {
    score: 0,
    word: "",
    locations: [],
    playedWords: [],
    scoreTargetIndex: 0,
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
            button: button,
            coordinates: coordinatesFromId(button.id),
        };
        handleChooseLetterMessage(event);
    };
}
function handleChooseLetterMessage(event) {
    var lastLocation = state.locations[state.locations.length - 1];
    // User clicked the button they clicked before - this should 'undo' the last
    // move
    if (lastLocation &&
        event.coordinates.x === lastLocation.x &&
        event.coordinates.y === lastLocation.y) {
        state.word = state.word.slice(0, -1);
        state.locations.pop();
        updateBoard();
        event.button.classList.remove("selected");
        return;
    }
    state.word = state.word + event.letter;
    state.locations.push(event.coordinates);
    event.button.classList.add("selected");
    updateBoard();
}
function updateBoard() {
    var container = document.getElementById("container");
    if (!container) {
        console.error("element with ID 'container' not found");
        return;
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var button = document.getElementById(x + "," + y);
            // Remove any tile statuses
            if (state.locations.length === 0) {
                button.disabled = false;
                button.classList.remove("selected");
                continue;
            }
            var coord = { x: x, y: y };
            var disabled = buttonDisabled(coord, state.locations, state.word.length);
            if (button.disabled !== disabled) {
                button.disabled = disabled;
            }
        }
    }
    var word = document.getElementById("word");
    if (!word) {
        console.error("element with ID 'word' not found");
        return;
    }
    word.innerHTML = state.word.padEnd(30, "_");
    var score = document.getElementById("score");
    if (score) {
        score.innerHTML = "Score: " + state.score;
    }
}
function buttonDisabled(coord, locations, wordLength) {
    var clonedLocations = __spreadArray([], locations);
    var lastLocation = clonedLocations.pop();
    if (!lastLocation) {
        console.error("buttonDisabled: locations has length 0");
        return false;
    }
    // Previous locations (but not the last) are disabled
    for (var _i = 0, clonedLocations_1 = clonedLocations; _i < clonedLocations_1.length; _i++) {
        var p = clonedLocations_1[_i];
        if (p.x === coord.x && p.y === coord.y) {
            return true;
        }
    }
    var xDist = Math.abs(lastLocation.x - coord.x);
    var yDist = Math.abs(lastLocation.y - coord.y);
    /* return xDist > wordLength || yDist > wordLength */
    return xDist + yDist > wordLength;
}
function submitOnClick() {
    var word = state.word.toLowerCase();
    if (!wordlist.includes(word)) {
        flashError("Invalid word!");
        return;
    }
    if (state.playedWords.includes(word)) {
        flashError("Word already played!");
        return;
    }
    var points = calculatePoints(state.word);
    state.score = state.score += points;
    state.word = "";
    state.playedWords.push(word);
    state.locations = [];
    // Update progress bar
    var progressBar = document.getElementById("progressBar");
    if (progressBar) {
        if (state.score >= scoreTargets[state.scoreTargetIndex]) {
            state.scoreTargetIndex++;
            progressBar.max = scoreTargets[state.scoreTargetIndex];
        }
        progressBar.value = state.score;
    }
    // Flash score change
    var scoreChange = document.getElementById("scoreChange");
    if (scoreChange) {
        scoreChange.innerHTML = "+" + points;
        scoreChange.className = "show";
        setTimeout(function () {
            scoreChange.className = scoreChange.className.replace("show", "");
        }, 3000);
    }
    updateBoard();
}
function flashError(msg) {
    // Hack - the score change is hidden, but can shift our error message span
    // over to the right if it has contents. Remove them.
    var scoreChange = document.getElementById("scoreChange");
    if (scoreChange) {
        scoreChange.innerHTML = "";
    }
    var errorMsg = document.getElementById("errorMsg");
    if (errorMsg) {
        errorMsg.innerHTML = msg;
        errorMsg.className = "show";
        setTimeout(function () {
            errorMsg.className = errorMsg.className.replace("show", "");
        }, 3000);
    }
}
function calculatePoints(word) {
    /* return state.word.length * state.word.length; */
    var len = word.length;
    if (len <= 4) {
        return 1;
    }
    if (len <= 6) {
        return len;
    }
    return 2 * len;
}
function cancelOnClick() {
    state.word = "";
    state.locations = [];
    updateBoard();
}
initialiseBoard();
