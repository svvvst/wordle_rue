function buildKeyboard(layout) {
  const keyboardElement = document.querySelector("#keyboard");
  let keyboard = "";

  layout.forEach((row) => {
    keyboard += `<div>`;
    row.forEach((letter) => {
      if (letter) {
        if (letter === "backspace") {
          keyboard += `<button class="key" id="backspace">⬅</button>`;
        } else {
          keyboard += `<button class="key" data-letter=${letter}>${letter}</button>`;
        }
      }
    });
    keyboard += `</div>`;
  });

  keyboardElement.innerHTML = keyboard;
  keyboardElement.addEventListener("click", keyPress);
}

function keyPress(event) {
  const guessInput = document.querySelector("#inputStr");

  // if backspace, remove last character from the input field
  // if any other key, add the character (no more than 5)
  if (event.target.id === "backspace") {
    guessInput.value = guessInput.value.slice(0, -1);
  } else if (
    event.target.classList.contains("key") &&
    guessInput.value.length < 5
  ) {
    guessInput.value += event.target.innerHTML;
  }
}

function keyMark(letter, result) {
  // result must be "right", "wrong" or "swap"
  const key = document.querySelector(`button[data-letter=${letter}]`);
  if (key) {
    key.classList.add(result);
  }
}

// layout with "false" for unused keyboard positions
const layout = [
  ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ы"],
  ["Ф", "І", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Є", false],
  ["Ґ", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", false, "backspace"],
];

buildKeyboard(layout);
