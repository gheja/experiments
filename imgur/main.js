"use strict";

let _canvas;
let _ctx;

function rand(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

function tick()
{
	_ctx.fillStyle = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
	_ctx.fillRect(rand(0, 390), rand(0, 390), 10, 10);
}

function uploadSuccess(e)
{
	let url;
	
	try
	{
		url = JSON.parse(e.target.response).data.link;
	}
	catch (err)
	{
	}
	
	if (!url)
	{
		uploadError(e);
		return;
	}
	
	document.getElementById("result").innerHTML = "Uploaded to: " + url;
}

function uploadError(e)
{
	document.getElementById("result").innerHTML = "Failed to upload, check javascript console for details.";
	
	console.log(e);
	console.log(e.target.response);
	console.log(JSON.parse(e.target.responseText));
}

function upload()
{
	function encode(x)
	{
		return encodeURIComponent(x.substring(x.indexOf(",") + 1));
	}
	
	let xhr = new XMLHttpRequest();
	xhr.onload = uploadSuccess;
	xhr.onerror = uploadError;
	xhr.open("POST", "https://api.imgur.com/3/image");
	xhr.setRequestHeader("Authorization", "Client-ID " + IMGUR_CLIENT_ID);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("image=" + encode(_canvas.toDataURL()));
}

function init()
{
	_canvas = document.getElementById("canvas1");
	_ctx = _canvas.getContext("2d");
	window.setInterval(tick, 1000 / 60);
}

window.addEventListener("load", init);
