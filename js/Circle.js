class Circle {
    constructor(ctx, x, y, radius, color = null, strokeColor = null) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color || '#000';
        this.strokeColor = strokeColor || '#ef6363';
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.lineWidth = 18;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.stroke();
    }
}