"strict mode";

var size = 9;
var board = [];
var BLACK="BLACK", WHITE="WHITE";
var activePlayer = BLACK;
var scores = {WHITE:0, BLACK:0}; 


function onLoad() {
	// write HTML board table
	document.getElementById("board_div").innerHTML =
		HTMLBoard();
	// initialize board variable
	for (var x=0; x<size; x++) {
		board[x] = [];
		for (var y=0; y<size; y++) {
			board[x][y] = {};
			board[x][y].content = null;
			board[x][y].ui = document.getElementById(fieldId(x, y));
		}
	}
	// display initial scores (0 both)
	// and initial active player (black)
	refreshScores();
	refreshActivePlayerIndicators();
}

function onFieldClick(x, y) {
	switch (board[x][y].content) {
		case null: // place a stone
			setField(x, y, activePlayer);
			flipActivePlayer();
			break;
		case activePlayer: // remove captured stones
			captureGroup(x, y, activePlayer);
			break;
		case flip(activePlayer): // for undoing turns
			setField(x, y, null);
			flipActivePlayer();
			break;
	}
}
function flipActivePlayer() {
	activePlayer = flip(activePlayer);
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

function setField(x, y, value) {
	if (!(value==null || value==BLACK || value==WHITE)) return;
	board[x][y].content = value;
	board[x][y].ui.style = fieldContentToStyle(value);
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
	if (board[x][y].content != color) return;
	setField(x, y, null);
	scores[flip(color)] += 1;
	refreshScores();
	for (neighbour of [{x:x, y:y-1}
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
		scores[BLACK];
	document.getElementById("score_white_div").innerHTML =
		scores[WHITE];
}
function refreshActivePlayerIndicators() {
	var div = document.getElementById("activePlayerIndicator_black_div");
	div.style.display = activePlayer==BLACK ? "block" : "none";
	div = document.getElementById("activePlayerIndicator_white_div");
	div.style.display = activePlayer==WHITE ? "block" : "none";
}

function fieldId(x, y) {
	return "field "+x+"/"+y;
}

function fieldStyle(x, y) {
	str = "";
	if (board[x][y].content==BLACK)
		str += "background: #101010;";
	else if (board[x][y].content==WHITE)
		str += "background: #f0f0f0;";
	return str;
}
