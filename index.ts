interface State {
  score: number;
  word: string;
  locations: Point[];
  playedWords: string[];
}

interface ChooseLetterMessage {
  letter: string;
  button: HTMLButtonElement;
  coordinates: Point;
}

interface SubmitWordMessage {}

interface Point {
  x: number;
  y: number;
}

const letters =
  "AAAAAAAAAAAAABBBCCCDDDDDDEEEEEEEEEEEEEEEEEEFFFGGGGHHHIIIIIIIIIIIIJJKKLLLLLMMMNNNNNNNNOOOOOOOOOOOPPPQQRRRRRRRRRSSSSSSTTTTTTTTTUUUUUUVVVWWWXXYYYZZ";

const gridSize = 12;

let state: State = {
  score: 0,
  word: "",
  locations: [],
  playedWords: [],
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

function coordinatesFromId(id: string): Point {
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
      button: button,
      coordinates: coordinatesFromId(button.id),
    };
    handleChooseLetterMessage(event);
  };
}

function handleChooseLetterMessage(event: ChooseLetterMessage) {
  const lastLocation = state.locations[state.locations.length - 1];
  // User clicked the button they clicked before - this should 'undo' the last
  // move
  if (
    lastLocation &&
    event.coordinates.x === lastLocation.x &&
    event.coordinates.y === lastLocation.y
  ) {
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
  console.log(state);
  console.log(state.locations);
  const container = document.getElementById("container");
  if (!container) {
    console.error("element with ID 'container' not found");
    return;
  }

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const button = document.getElementById(`${x},${y}`) as HTMLButtonElement;
      // Remove any tile statuses
      if (state.locations.length === 0) {
        button.disabled = false;
        button.classList.remove("selected");
        continue;
      }

      const coord = { x, y };
      button.disabled = buttonDisabled(
        coord,
        state.locations,
        state.word.length
      );
    }
  }

  const word = document.getElementById("word");
  if (!word) {
    console.error("element with ID 'word' not found");
    return;
  }
  word.innerHTML = state.word.padEnd(30, "_");

  const score = document.getElementById("score");
  if (score) {
    score.innerHTML = `Score: ${state.score}`;
  }
}

function buttonDisabled(
  coord: Point,
  locations: Point[],
  wordLength: number
): boolean {
  const clonedLocations: Point[] = [...locations];
  const lastLocation = clonedLocations.pop();
  if (!lastLocation) {
    console.error("buttonDisabled: locations has length 0");
    return false;
  }

  // Previous locations (but not the last) are disabled
  for (let p of clonedLocations) {
    if (p.x === coord.x && p.y === coord.y) {
      return true;
    }
  }

  const xDist = Math.abs(lastLocation.x - coord.x);
  const yDist = Math.abs(lastLocation.y - coord.y);

  /* return xDist > wordLength || yDist > wordLength */
  return xDist + yDist > wordLength;
}

function submitOnClick() {
  const word = state.word.toLowerCase();
  if (!wordlist.includes(word)) {
    console.error("word not found");
    return;
  }
  if (state.playedWords.includes(word)) {
    console.error("word already played");
    return;
  }
  state.score = state.score += state.word.length * state.word.length;
  state.word = "";
  state.playedWords.push(word);
  state.locations = [];
  updateBoard();
}

function cancelOnClick() {
  state.word = "";
  state.locations = [];
  updateBoard();
}

initialiseBoard();
