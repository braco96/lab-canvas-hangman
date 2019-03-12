// ==============================
// Lógica del juego (Hangman)
// ==============================
class Hangman {
  constructor(words) {
    this.words = Array.isArray(words) ? words : [];
    this.secretWord = this.pickWord();      // string
    this.errorsLeft = 10;                   // empieza en 10
    this.guessedLetters = "";               // string vacío
    this.letters = [];                      // array vacío
  }

  pickWord() {
    if (!this.words.length) return "";
    const w = this.words[Math.floor(Math.random()*this.words.length)];
    return String(w || "").toUpperCase();
  }

  // tests piden keyCode A–Z (65–90)
  checkIfLetter(keyCode) {
    return typeof keyCode === "number" && keyCode >= 65 && keyCode <= 90;
  }

  checkClickedLetters(letter) {
    const L = String(letter||"").toUpperCase();
    return !this.letters.includes(L);
  }

  addCorrectLetter(letter) {
    const L = String(letter||"").toUpperCase();
    if (!this.guessedLetters.includes(L)) this.guessedLetters += L;
    if (!this.letters.includes(L)) this.letters.push(L);
  }

  addWrongLetter(letter) {
    const L = String(letter||"").toUpperCase();
    if (!this.letters.includes(L)) this.letters.push(L);
    this.errorsLeft = Math.max(0, this.errorsLeft - 1);
  }

  checkGameOver() { return this.errorsLeft <= 0; }

  checkWinner() {
    const word = String(this.secretWord).toUpperCase();
    const uniq = new Set(word.split(""));
    for (const ch of uniq) {
      if (!/[A-Z]/.test(ch)) continue;
      if (!this.guessedLetters.includes(ch)) return false;
    }
    return word.length > 0;
  }
}

// ===== Wiring navegador =====
let hangman;
let hangmanCanvas;

function startNewGame(){
  hangman = new Hangman(['NODE','JAVASCRIPT','REACT','MIAMI','PARIS','AMSTERDAM','LISBOA']);
  // por si acaso, re-elegimos palabra y la normalizamos
  hangman.secretWord = hangman.pickWord();

  if (typeof HangmanCanvas !== 'undefined') {
    hangmanCanvas = new HangmanCanvas(hangman.secretWord);
    hangmanCanvas.createBoard();
  } else {
    console.warn('HangmanCanvas no está definido. ¿Se cargó javascript/canvas.js antes?');
  }
}

document.getElementById('start-game-button')?.addEventListener('click', startNewGame);

document.addEventListener('keydown', (event)=>{
  if (!hangman) return;

  const code = event.keyCode ?? event.which;
  if (!hangman.checkIfLetter(code)) return;

  // normalizamos a 1 char en mayúscula
  const letter = String(event.key || '').toUpperCase();
  if (!letter || letter.length !== 1) return;

  if (!hangman.checkClickedLetters(letter)) return;

  if (hangman.secretWord.includes(letter)) {
    hangman.addCorrectLetter(letter);

    if (hangmanCanvas) {
      [...hangman.secretWord].forEach((ch, i)=>{
        if (ch === letter) hangmanCanvas.writeCorrectLetter(i);
      });
    }
    if (hangman.checkWinner() && hangmanCanvas) hangmanCanvas.winner();
  } else {
    hangman.addWrongLetter(letter);

    if (hangmanCanvas) {
      hangmanCanvas.writeWrongLetter(letter, hangman.errorsLeft);
      hangmanCanvas.drawHangman(hangman.errorsLeft);
    }
    if (hangman.checkGameOver() && hangmanCanvas) hangmanCanvas.gameOver();
  }
});
