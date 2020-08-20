"use strict";

function createWindow()
{
    let win: HTMLDivElement;
    let a: HTMLDivElement;

    win = document.createElement("div");
    win.className = "window";

    a = document.createElement("div");
    a.className = "title";
    a.innerHTML = "Choo-choo train";
    win.appendChild(a);

    a = document.createElement("div");
    a.className = "body";
    a.innerHTML = `Class: <span>Loremipsu</span><br/>Capacity: <span>1300</span><br/>Cargo: <span>150</span><br/>Maintenance: <span>1200 USD/year</span>`;
    win.appendChild(a);

    document.body.appendChild(win);
}