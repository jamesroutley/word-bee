interface State {
  points: number;
  word: string;
  lastPlayedCoord?: Coordinates;
}

interface ChooseLetterMessage {
  letter: string;
  coordinates: Coordinates;
}

interface SubmitWordMessage {}

interface Coordinates {
  x: number;
  y: number;
}

const letters =
  "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";

const gridSize = 12;

let state: State = {
  points: 0,
  word: "",
};

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function randomLetter(): string {
  const index = randomInt(letters.length);
  return letters[index];
}

function initialiseBoard() {
  const container = document.getElementById("container");
  if (!container) {
    console.error("element with ID 'container' not found");
    return;
  }
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const button = document.createElement("button");
      const letter = randomLetter();
      button.innerHTML = letter;
      button.value = letter;
      button.id = `${x},${y}`;
      button.type = "button";
      button.onclick = createButtonOnClick(button);
      container.appendChild(button);
    }
  }

  const submit = document.getElementById("submit");
  if (submit) {
    submit.onclick = submitOnClick;
  }
  const cancel = document.getElementById("cancel");
  if (cancel) {
    cancel.onclick = cancelOnClick;
  }

  updateBoard();
}

function coordinatesFromId(id: string): Coordinates {
  const parts = id.split(",");
  return {
    x: parseInt(parts[0]),
    y: parseInt(parts[1]),
  };
}

function createButtonOnClick(button: HTMLButtonElement) {
  return function () {
    const event = {
      letter: button.value,
      coordinates: coordinatesFromId(button.id),
    };
    handleChooseLetterMessage(event);
  };
}

function handleChooseLetterMessage(event: ChooseLetterMessage) {
  state.word = state.word + event.letter;
  state.lastPlayedCoord = event.coordinates;
  updateBoard();
}

function updateBoard() {
  console.log(state);
  console.log(state.lastPlayedCoord);
  const container = document.getElementById("container");
  if (!container) {
    console.error("element with ID 'container' not found");
    return;
  }

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const button = document.getElementById(`${x},${y}`) as HTMLButtonElement;
      if (!state.lastPlayedCoord) {
        button.disabled = false;
      } else {
        const coord = { x, y };
        button.disabled = buttonDisabled(
          coord,
          state.lastPlayedCoord,
          state.word.length
        );
      }
    }
  }

  const word = document.getElementById("word");
  if (!word) {
    console.error("element with ID 'word' not found");
    return;
  }
  word.innerHTML = state.word.padEnd(20, "_");

  const points = document.getElementById("points");
  if (points) {
    points.innerHTML = `Points: ${state.points}`;
  }
}

function buttonDisabled(
  coord: Coordinates,
  lastPlayedCoord: Coordinates,
  wordLength: number
) {
  if (coord.x === lastPlayedCoord.x && coord.y === lastPlayedCoord.y) {
    return true;
  }
  const xDist = Math.abs(lastPlayedCoord.x - coord.x);
  const yDist = Math.abs(lastPlayedCoord.y - coord.y);

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
