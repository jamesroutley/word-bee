interface State {
  score: number;
  word: string;
  locations: Point[];
  playedWords: string[];
  scoreTargetIndex: number;
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

const scoreTargets = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800];

const gridSize = 8;

let state: State = {
  score: 0,
  word: "",
  locations: [],
  playedWords: [],
  scoreTargetIndex: 0,
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
      const disabled = buttonDisabled(
        coord,
        state.locations,
        state.word.length
      );
      if (button.disabled !== disabled) {
        button.disabled = disabled;
      }
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
    flashError("Invalid word!");
    return;
  }
  if (state.playedWords.includes(word)) {
    flashError("Word already played!");
    return;
  }
  const points = calculatePoints(state.word);
  state.score = state.score += points;
  state.word = "";
  state.playedWords.push(word);
  state.locations = [];

  // Update progress bar
  const progressBar = document.getElementById(
    "progressBar"
  ) as HTMLProgressElement;
  if (progressBar) {
    if (state.score >= scoreTargets[state.scoreTargetIndex]) {
      state.scoreTargetIndex++;
      progressBar.max = scoreTargets[state.scoreTargetIndex];
    }
    progressBar.value = state.score;
  }

  // Flash score change
  const scoreChange = document.getElementById("scoreChange");
  if (scoreChange) {
    scoreChange.innerHTML = `+${points}`;
    scoreChange.className = "show";
    setTimeout(function () {
      scoreChange.className = scoreChange.className.replace("show", "");
    }, 3000);
  }

  updateBoard();
}

function flashError(msg: string) {
  // Hack - the score change is hidden, but can shift our error message span
  // over to the right if it has contents. Remove them.
  const scoreChange = document.getElementById("scoreChange");
  if (scoreChange) {
    scoreChange.innerHTML = "";
  }

  const errorMsg = document.getElementById("errorMsg");
  if (errorMsg) {
    errorMsg.innerHTML = msg;
    errorMsg.className = "show";
    setTimeout(function () {
      errorMsg.className = errorMsg.className.replace("show", "");
    }, 3000);
  }
}

function calculatePoints(word: string): number {
  /* return state.word.length * state.word.length; */
  const len = word.length;
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
