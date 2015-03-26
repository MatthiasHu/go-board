"use strict";

var size = 9;
var BLACK="BLACK", WHITE="WHITE";

var ui = {fields: []};

var game = {};
game.board = [];
game.activePlayer = BLACK;
game.scores = {WHITE:0, BLACK:0}; 

var gameHistory = [];


function onLoad() {
	// write HTML board table
	document.getElementById("board_div").innerHTML =
		HTMLBoard();
	// initialize board variable
	for (var x=0; x<size; x++) {
		game.board[x] = [];
		for (var y=0; y<size; y++) {
			game.board[x][y] = null;
		}
	}
	// get DOM elements
	for (var x=0; x<size; x++) {
		ui.fields[x] = [];
		for (var y=0; y<size; y++) {
			ui.fields[x][y] =
				document.getElementById(fieldId(x, y));
		}
	}
	// refresh all ui
	refreshUI();
}

function refreshUI() {
	refreshScores();
	refreshActivePlayerIndicators();
	refreshAllFields();
}
function refreshAllFields() {
	for (var x=0; x<size; x++) {
		for (var y=0; y<size; y++) {
			refreshField(x, y);
		}
	}
}


function onFieldClick(x, y) {
	switch (game.board[x][y]) {
		case null: // place a stone
			pushHistory();
			setField(x, y, game.activePlayer);
			flipActivePlayer();
			break;
		case game.activePlayer: // remove captured stones
			pushHistory();
			captureGroup(x, y, game.activePlayer);
			break;
	}
}
function flipActivePlayer() {
	game.activePlayer = flip(game.activePlayer);
	refreshActivePlayerIndicators();
}
function flip(playerColor) {
	switch (playerColor) {
		case BLACK:
			return WHITE;
		case WHITE:
			return BLACK;
	}
}

function pushHistory() {
	pushList(gameHistory, copyGame(game));
}
function onUndo() {
	if (!gameHistory[0]) return;
	game = popList(gameHistory);
	refreshUI();
}
function copyGame(g) {
	var gg = {};
	gg.activePlayer = g.activePlayer;
	gg.scores = {WHITE: g.scores[WHITE]
		    ,BLACK: g.scores[BLACK]};
	gg.board = [];
	// copy board variable
	for (var x=0; x<size; x++) {
		gg.board[x] = [];
		for (var y=0; y<size; y++) {
			gg.board[x][y] = g.board[x][y];
		}
	}
	return gg;
}

function setField(x, y, value) {
	if (!(value==null || value==BLACK || value==WHITE)) return;
	game.board[x][y] = value;
	refreshField(x, y);
}
function refreshField(x, y) {
	ui.fields[x][y].style = fieldContentToStyle(game.board[x][y]);
}
function fieldContentToStyle(value) {
	switch (value) {
		case null:
			return "";
			break;
		case BLACK:
			return "background: #111111";
			break;
		case WHITE:
			return "background: #eeeeee";
			break;
	}
}

function captureGroup(x, y, color) {
	if (x<0 || x>=size || y<0 || y>=size) return;
	if (game.board[x][y] != color) return;
	setField(x, y, null);
	game.scores[flip(color)] += 1;
	refreshScores();
	for (var neighbour of [{x:x, y:y-1}
		   ,{x:x, y:y+1}
		   ,{x:x-1, y:y}
		   ,{x:x+1, y:y}]) {
		captureGroup(neighbour.x, neighbour.y, color);
	}
}


function HTMLBoard() {
	var str = "";
	str += "<table id='board_table'><tbody>";
	for (var y=0; y<size; y++) {
		str += "<tr>";
		for (var x=0; x<size; x++) {
			str += "<td class='field_td'><div";
			str += " id='"+fieldId(x, y)+"'";
			str += " class='field_div'";
			str += " onClick='onFieldClick("+x+", "+y+");'";
			str += "></div></td>";
		}
		str += "</tr>";
	}
	str += "</tbody></table>";
	return str;
}

function refreshScores() {
	document.getElementById("score_black_div").innerHTML =
		game.scores[BLACK];
	document.getElementById("score_white_div").innerHTML =
		game.scores[WHITE];
}
function refreshActivePlayerIndicators() {
	var div = document.getElementById("activePlayerIndicator_black_div");
	div.style.display = game.activePlayer==BLACK ? "block" : "none";
	div = document.getElementById("activePlayerIndicator_white_div");
	div.style.display = game.activePlayer==WHITE ? "block" : "none";
}

function fieldId(x, y) {
	return "field "+x+"/"+y;
}

function fieldStyle(x, y) {
	str = "";
	if (game.board[x][y].content==BLACK)
		str += "background: #101010;";
	else if (board[x][y].content==WHITE)
		str += "background: #f0f0f0;";
	return str;
}

// list/array utility:
function pushList(list, head) {
	for (var i=list.length-1; i>=0; i--) {
		list[i+1] = list[i];
	}
	list[0] = head;
}
function popList(list) {
	var head = list[0];
	for (var i=0; i<list.length-1; i++) {
		list[i] = list[i+1];
	}
	delete list[list.length-1];
	return head;
}
