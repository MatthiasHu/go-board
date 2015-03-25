"strict mode";

var size = 9;
var board = [];
var BLACK="BLACK", WHITE="WHITE";


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
}

function HTMLBoard() {
	var str = "";
	str += "<table><tbody>";
	for (var y=0; y<size; y++) {
		str += "<tr>";
		for (var x=0; x<size; x++) {
			str += "<td id='"+fieldId(x, y)
				+"' class='field_class'>"
				+fieldId(x, y)+"</td>";
		}
		str += "</tr>";
	}
	str += "</tbody></table>";
	return str;
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
