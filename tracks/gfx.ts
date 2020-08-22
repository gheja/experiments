"use strict";

class Gfx
{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    public cursorPosition: Point3d;

    constructor(canvas: HTMLCanvasElement)
    {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = 900;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.cursorPosition = new Point3d(0,0,0);
    }

    renderBegin()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBegin()
    {
        this.ctx.beginPath();
    }

    drawCircle(x: number, y: number, radius: number)
    {
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number)
    {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
    }

    setStroke(width: number, style: string)
    {
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = style;
    }

    drawStroke()
    {
        this.ctx.stroke();
    }

    renderEnd()
    {

    }

    onMouseMove(event)
    {
        this.cursorPosition.x = event.layerX;
        this.cursorPosition.y = event.layerY;
    }
}
