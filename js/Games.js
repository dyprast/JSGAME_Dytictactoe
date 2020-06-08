class Games {
  constructor(board) {
    this.board = board;
    this.ctx = board.getContext('2d');
    this.backgroundBoard = new Tile(this.ctx, 0, 0, board.width, board.height, '#263238');
      this.playerTiles = [];
      this.playerTilesText = [];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let arrayName = 'tile-' + j + i;
          this.playerTiles[arrayName] = new Tile(this.ctx, j * 155, i * 155, 155, 155, '#292929', '#1b1b1b');
          this.playerTiles[arrayName].dataX = j;
          this.playerTiles[arrayName].dataY = i;
          // this.playerTilesText['text-' + j + i] = new Text(this.ctx, (j * 155) + 10, (i * 155) + 25, '20', j + ',' + i, '#fff');
        }
      }

      this.moveSymbol = [];

    this.addListener();
  }
  init() {
    let lastMove = localStorage.getItem('move');

    if (lastMove != null) this.move = lastMove;
    else this.move = 'player';

    this.clear();

    this.backgroundBoard.draw();

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let arrayName = 'tile-' + j + i;
          let tiles = this.playerTiles[arrayName];
          // let tilesText = this.playerTilesText['text-' + j + i];

          let lastFilledTile = localStorage['fillby-' + j + i];

          if (lastFilledTile != null) tiles.fillBy = lastFilledTile;
          else tiles.fillBy = '';

          tiles.draw();
          // tilesText.draw();

          // localStorage[arrayName] = JSON.stringify(tiles);

          // console.log(JSON.parse(localStorage[arrayName]));
        }
      }
    // }
    // else {
    //   this.move = localStorage.getItem('move');
    //   this.playerTiles = [];

    //   for (let i = 0; i < 3; i++) {
    //     for (let j = 0; j < 3; j++) {
    //       let arrayName = 'tile-' + j + i;
    //       let currentLastTile = JSON.parse(localStorage[arrayName])
    //       this.playerTiles[arrayName] = new Tile(this.ctx, j * 155, i * 155, 155, 155, '#292929', '#1b1b1b');
    //       this.playerTiles[arrayName].dataX = j;
    //       this.playerTiles[arrayName].dataY = i;
    //       this.playerTiles[arrayName].fillBy = currentLastTile.fillBy;

    //       this.playerTiles[arrayName].draw();
    //     }
    //   }
    // }

    let countCurrentSymbol = localStorage.getItem('countCurrentSymbol');

    if (countCurrentSymbol != null) {
      this.moveSymbol = [];

      if (countCurrentSymbol > 0) {
        for (let a = 1; a <= countCurrentSymbol; a++) {
          let currentSymbol = localStorage['movesymbol-' + a];
          let parseJSONSymbol = JSON.parse(currentSymbol);

          if (typeof(parseJSONSymbol.radius) === 'undefined') {
            this.moveSymbol.push(new Line(this.ctx, parseJSONSymbol.tileX, parseJSONSymbol.tileY, parseJSONSymbol.tileWidth, parseJSONSymbol.tileHeight, parseJSONSymbol.margin, parseJSONSymbol.color));
          }
          else {
            this.moveSymbol.push(new Circle(this.ctx, parseJSONSymbol.x, parseJSONSymbol.y, parseJSONSymbol.radius, parseJSONSymbol.color, parseJSONSymbol.strokeColor));
          }

          // console.log(parseJSONSymbol.radius);

          // this.moveSymbol.push(new Text(this.ctx, parseJSONSymbol.x, parseJSONSymbol.y, parseJSONSymbol.fontSize, parseJSONSymbol.text, parseJSONSymbol.color));
          this.moveSymbol[a - 1].draw();
        }
      }
    }

    this.saveMove();

    $('.move').innerText = this.move + ' move';

    if (this.move == 'computer') this.aiMove();
  }
  addListener() {
    this.board.addEventListener('click', this.clickListener.bind(this));
  }
  clickListener(e) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let tiles = this.playerTiles['tile-' + j + i];
        let currentClick = {
          x: e.layerX,
          y: e.layerY
        };

        if (tiles.clicked(currentClick)) {
          if (this.move == 'player') {
            if (tiles.fillBy == '') {
              tiles.fillBy = this.move;
              this.initMove(tiles.getMiddlePosition());
              this.checkMove(j, i);
            }
          }

          break;
        }
      }
    }
  }
  initMove(pos) {
    let symbol = 'o'

    if (this.move == 'computer') symbol = 'x';

    if (symbol == 'o') this.moveSymbol.push(new Circle(this.ctx, pos.x, pos.y, 38, '#292929', '#54b8fe'));
    else if (symbol == 'x') this.moveSymbol.push(new Line(this.ctx, pos.realX, pos.realY, pos.width, pos.height, 40, '#ef6363'));

    // else this.moveSymbol.push(new Text(this.ctx, pos.x, pos.y, '50', symbol, '#fff'));

    let symbolLength = this.moveSymbol.length - 1;
    this.moveSymbol[symbolLength].draw();

    localStorage.setItem('countCurrentSymbol', this.moveSymbol.length);
    localStorage['movesymbol-' + this.moveSymbol.length] = JSON.stringify(this.moveSymbol[symbolLength]);
    // let symbolObj = JSON.parse(localStorage['movesymbol-' + this.moveSymbol.length]);
    // console.log({
    //   countCurrentSymbol: localStorage.getItem('countCurrentSymbol'),
    //   currentSymbol: localStorage['movesymbol-' + this.moveSymbol.length],
    // });
  }
  changeMove() {
    if (this.checkValidTile() > 0) {
      if (this.move == 'player') {
        this.move = 'computer';
        this.aiMove();
      }
      else if (this.move == 'computer') this.move = 'player';

      this.saveMove();

      if ($('.move') != null) $('.move').innerText = this.move + ' move';
    }
    else {
      setTimeout(() => {
        this.endGame('Draw!')
      }, 500);
    }
  }
  checkMove(x, y) {
    this.saveTile(x, y);

    let currentX = x,
        currentY = y;

    //Check horozontal move
    let validHorizontalMove = 0;
    for (let dataX = 0; dataX < 3; dataX++) {
      let currentTile = this.playerTiles['tile-' + dataX + currentY];
      if (currentTile.fillBy == this.move) validHorizontalMove++;
    }

    if (validHorizontalMove == 3) {
      setTimeout(this.checkWinner.bind(this), 500);
      return;
    }

    //Check vertical move
    let validVerticalMove = 0;
    for (let dataY = 0; dataY < 3; dataY++) {
      let currentTile = this.playerTiles['tile-' + currentX + dataY];
      if (currentTile.fillBy == this.move) validVerticalMove++;
    }

    if (validVerticalMove == 3) {
      setTimeout(this.checkWinner.bind(this), 500);
      return;
    }

    //Check right to left diagonal move
    let validRightToLeftDiagonalMove = 0;
    let rtlX = currentX + 1;
    let rtlY = currentY - 1;
    while (true) {
      rtlX--;
      rtlY++;

      let currentTile = this.playerTiles['tile-' + rtlX + rtlY];

      if (typeof(currentTile) === 'undefined') {
        validRightToLeftDiagonalMove = this.reverseRtl(rtlX, rtlY);
        break;
      }
    }

    if (validRightToLeftDiagonalMove == 3) {
      setTimeout(this.checkWinner.bind(this), 500);
      return;
    }

    //Check left to right diagonal move
    let validLeftToRightDiagonalMove = 0;
    let ltrX = currentX - 1;
    let ltrY = currentY - 1;
    while (true) {
      ltrX++;
      ltrY++;

      let currentTile = this.playerTiles['tile-' + ltrX + ltrY];

      if (typeof(currentTile) === 'undefined') {
        validLeftToRightDiagonalMove = this.reverseLtr(ltrX, ltrY);
        break;
      }
    }

    if (validLeftToRightDiagonalMove == 3) {
      setTimeout(this.checkWinner.bind(this), 500);
      return;
    }

    this.changeMove();
  }
  reverseRtl(x, y) {
    let validMove = 0;

    while (true) {
      x++;
      y--;

      let currentTile = this.playerTiles['tile-' + x + y];

      if (typeof(currentTile) === 'undefined') break;

      if (currentTile.fillBy == this.move) validMove++;
    }

    return validMove;
  }
  reverseLtr(x, y) {
    let validMove = 0;

    while (true) {
      x--;
      y--;

      let currentTile = this.playerTiles['tile-' + x + y];

      if (typeof(currentTile) === 'undefined') break;

      if (currentTile.fillBy == this.move) validMove++;
    }

    return validMove;
  }
  aiMove() {
    setTimeout(this.randomAiMove.bind(this), 2000);
  }
  randomAiMove() {
      let randomX = this.getRandomInt(0, 3);
      let randomY = this.getRandomInt(0, 3);
      let randomTile = this.playerTiles['tile-' + randomX + randomY];

      if (typeof(randomTile) === 'undefined') this.randomAiMove();

      if (randomTile.fillBy == '') {
        randomTile.fillBy = this.move;
        this.initMove(randomTile.getMiddlePosition());
        this.checkMove(randomTile.dataX, randomTile.dataY);
      }
      else this.randomAiMove();
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  checkWinner() {
    if (this.move == 'player') this.endGame('You win!');
    else if (this.move == 'computer') this.endGame('Computer win!');
  }
  checkValidTile() {
    let validTile = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let currentTile = this.playerTiles['tile-' + j + i];

        if (currentTile.fillBy == '') validTile++;
      }
    }

    return validTile;
  }
  endGame(instructionText) {
    localStorage.clear();

    if ($('.move') != null) $('.move').remove();
    if ($('#game-board') != null) $('#game-board').remove();
    $('.container').style.display = 'block';
    $('#btn-play').innerText = 'Retry';
    $('.instruction').innerText = instructionText;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.board.width, this.board.height);
  }
  saveMove() {
    localStorage.setItem('move', this.move);
  }
  saveTile(x, y) {
    localStorage['fillby-' + x + y] = this.move;
  }
}
