"use strict";

class Gfx
{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = 900;
        this.height = 600;
    }

    render()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#f0f";
        this.ctx.fillRect(0, 0, 100, 100);
    }
}
