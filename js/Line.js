class Line {
    constructor(ctx, tileX, tileY, tileWidth, tileHeight, margin, color) {
        this.ctx = ctx;
        this.tileX = tileX;
        this.tileY = tileY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.margin = margin
        this.startLineX1 = tileX + margin;
        this.startLineY1 = tileY + margin;
        this.endLineX1 = (tileX + tileWidth) - margin;
        this.endLineY1 = (tileY + tileHeight) - margin;
        this.color = color || '#fff';
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startLineX1, this.startLineY1);
        this.ctx.lineTo(this.endLineX1, this.endLineY1);
        this.ctx.moveTo(this.endLineX1, this.startLineY1);
        this.ctx.lineTo(this.startLineX1, this.endLineY1);
        this.ctx.lineWidth = 22;

        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }
}