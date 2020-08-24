"use strict";

function getNextZIndex()
{
    if (!getNextZIndex.n)
    {
        getNextZIndex.n = 9000;
    }
    getNextZIndex.n++;
    return getNextZIndex.n + "";
}

function windowMouseDown(event: MouseEvent)
{
    // console.log("down");
    (event.currentTarget as HTMLElement).dataset.selected = "1";
    (event.currentTarget as HTMLElement).style.zIndex = getNextZIndex();
}

function windowMouseUp()
{
    let a: HTMLElement;

    // console.log("up");

    for (a of document.querySelectorAll<HTMLElement>(".window"))
    {
        a.dataset.selected = "0";
    }
}

function windowUpdate(dx, dy)
{
    let a: HTMLElement;
    let b: DOMRect;

    // console.log(dx, dy);

    for (a of document.querySelectorAll<HTMLElement>(".window"))
    {
        if (a.dataset.selected == "1")
        {
            b = a.getBoundingClientRect();
            a.style.top = b.top + dy + "px";
            a.style.left = b.left + dx + "px";
        }
    }
}

function createWindow()
{
    let win: HTMLDivElement;
    let a: HTMLDivElement;

    win = document.createElement("div");
    win.className = "window";
    win.addEventListener("mousedown", windowMouseDown.bind(null));
    win.addEventListener("mouseup", windowMouseUp.bind(null));

    a = document.createElement("div");
    a.className = "title";
    a.innerHTML = "Choo-choo train";
    win.appendChild(a);

    a = document.createElement("div");
    a.className = "body";
    a.innerHTML = "Class: <span>Loremipsu</span><br/>Capacity: <span>1300</span><br/>Cargo: <span>150</span><br/>Running cost: <span>$" + (Math.floor(Math.random() * 20 + 2) * 100) + "/year</span>";
    win.appendChild(a);

    document.body.appendChild(win);
}

let _mouseX = 0;
let _mouseY = 0;

function onMouseMove(event: MouseEvent)
{
    windowUpdate(event.screenX - _mouseX, event.screenY - _mouseY)
    _mouseX = event.screenX;
    _mouseY = event.screenY;
}

function init()
{
    window.addEventListener("mousemove", onMouseMove);
}

window.addEventListener("load", init);