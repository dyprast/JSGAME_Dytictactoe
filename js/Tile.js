class Tile {
  constructor(ctx, x, y, width, height, color = null, strokeColor = null) {
    this.ctx = ctx;
    // if (stroke == null) {
    //   this.strokeStyle = 'red';
    //   this.lineWidth = 5;
    // }
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color || '#000';
    this.strokeColor = strokeColor || '';
    this.dataX;
    this.dataY;
    this.fillBy;
  }
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.strokeColor != '') {
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = 4;
      this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    // this.ctx.lineWidth = 5;
    // this.ctx.fillStyle = this.color;
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  clicked(otherClicked) {
    let currLeft = this.x;
    let currRight = this.x + this.width;
    let currTop = this.y;
    let currBottom = this.y + this.height;
    let otherClickedX = otherClicked.x;
    let otherClickedY = otherClicked.y;
    let clicked = true;

    if (otherClickedX < currLeft || otherClickedX > currRight || otherClickedY < currTop || otherClickedY > currBottom) {
      clicked = false;
    }

    return clicked;
  }
  getMiddlePosition() {
    let midX = (this.x + this.width) - (this.width / 2);
    let midY = (this.y + this.height) - (this.height / 2);
    let position = {
      x: midX,
      y: midY,
      realX: this.x,
      realY: this.y,
      width: this.width,
      height: this.height
    };

    return position;
  }
}
