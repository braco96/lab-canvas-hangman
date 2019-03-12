class HangmanCanvas {
  constructor(secretWord) {
    this.canvas = document.getElementById('hangman');
    this.context = this.canvas.getContext('2d');
    this.secretWord = String(secretWord || '').toUpperCase();

    // Dimensiones
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.context;

    // Geometría del tablero
    this.baseY = this.height - 60; // línea base de los guiones
    this.slotW = 60;               // ancho por letra (guion + espacio)
    this.lineW = 40;               // ancho del guion
    this.startX = 60;              // margen izquierdo

    // Zona letras falladas
    this.wrongStartX = 60;
    this.wrongStartY = 120;
    this.wrongGap = 28;

    // Colores con alto contraste
    this.colorLine = '#222';
    this.colorCorrect = '#06365f';
    this.colorWrong = '#b00020';

    // Imágenes opcionales (si no existen, mostramos texto)
    this.imgGameOver = new Image();
    this.imgGameOver.src = './images/gameover.png';
    this.imgWinner = new Image();
    this.imgWinner.src = './images/awesome.png';
  }

  createBoard() {
    // Limpia y redibuja líneas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawLines();
  }

  drawLines() {
    const n = this.secretWord.length;
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.colorLine;

    for (let i = 0; i < n; i++) {
      const x = this.startX + i * this.slotW;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.baseY);
      this.ctx.lineTo(x + this.lineW, this.baseY);
      this.ctx.stroke();
    }
  }

  writeCorrectLetter(index) {
    const letter = this.secretWord[index];
    const x = this.startX + index * this.slotW + this.lineW / 2;
    const y = this.baseY - 10;

    this.ctx.fillStyle = this.colorCorrect;
    this.ctx.font = 'bold 36px Helvetica, Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.fillText(letter, x, y);
  }

  writeWrongLetter(letter, errorsLeft) {
    const missIndex = 10 - errorsLeft - 1; // 0,1,2...
    const x = this.wrongStartX + missIndex * this.wrongGap;
    const y = this.wrongStartY;

    this.ctx.fillStyle = this.colorWrong;
    this.ctx.font = 'bold 24px Helvetica, Arial, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.fillText(String(letter||'').toUpperCase(), x, y);
  }

  drawHangman(errorsLeft) {
    const c = this.ctx;
    c.strokeStyle = '#1c5380';
    c.lineWidth = 3;

    const line = (x1,y1,x2,y2)=>{ c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); };

    // Geometría de la horca
    const baseY = this.height - 40;
    const baseX1 = 420, baseX2 = 600;
    const mastX = 520, mastTopY = 100;
    const beamEndX = 650, beamY = mastTopY;
    const ropeTopY = 140;

    switch (errorsLeft) {
      case 9:  line(baseX1, baseY, baseX2, baseY); break;                   // base
      case 8:  line(mastX, baseY, mastX, mastTopY); break;                  // mástil
      case 7:  line(mastX, mastTopY, beamEndX, beamY); break;               // viga
      case 6:  line(mastX, mastTopY+40, mastX+40, mastTopY); break;         // soporte
      case 5:  line(beamEndX, beamY, beamEndX, ropeTopY); break;            // cuerda
      case 4:  c.beginPath(); c.arc(beamEndX, ropeTopY+20, 20, 0, Math.PI*2); c.stroke(); break; // cabeza
      case 3:  line(beamEndX, ropeTopY+40, beamEndX, ropeTopY+110); break;  // tronco
      case 2:  line(beamEndX, ropeTopY+55, beamEndX-30, ropeTopY+80); break;// brazo izq
      case 1:  line(beamEndX, ropeTopY+55, beamEndX+30, ropeTopY+80); break;// brazo dcho
      case 0:  line(beamEndX, ropeTopY+110, beamEndX-30, ropeTopY+140);     // pierna izq
              line(beamEndX, ropeTopY+110, beamEndX+30, ropeTopY+140); break; // pierna dcha
      default: break; // 10 -> nada aún
    }
  }

  gameOver() {
    const c = this.ctx;
    c.save();
    c.globalAlpha = 0.92;
    c.fillStyle = '#fff';
    c.fillRect(0,0,this.width,this.height);
    c.restore();

    if (this.imgGameOver && this.imgGameOver.complete && this.imgGameOver.naturalWidth) {
      const w = Math.min(500, this.width-40);
      const h = (w*300)/500;
      c.drawImage(this.imgGameOver, (this.width-w)/2, (this.height-h)/2, w, h);
    } else {
      c.fillStyle = '#b00020';
      c.font = 'bold 64px Helvetica, Arial, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('GAME OVER', this.width/2, this.height/2);
    }
  }

  winner() {
    const c = this.ctx;
    c.save();
    c.globalAlpha = 0.92;
    c.fillStyle = '#fff';
    c.fillRect(0,0,this.width,this.height);
    c.restore();

    if (this.imgWinner && this.imgWinner.complete && this.imgWinner.naturalWidth) {
      const w = Math.min(500, this.width-40);
      const h = (w*300)/500;
      c.drawImage(this.imgWinner, (this.width-w)/2, (this.height-h)/2, w, h);
    } else {
      c.fillStyle = '#00a86b';
      c.font = 'bold 64px Helvetica, Arial, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('YOU WIN!', this.width/2, this.height/2);
    }
  }
}
