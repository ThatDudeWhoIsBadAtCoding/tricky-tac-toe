var OTurn = true;

var GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var GameStateHistory = [];

var OReplacements = 2;
var XReplacements = 2;
var ReplacementHistory = [];

update_UI();

function start_new() {

    GameStateHistory = [];
    ReplacementHistory = [];
    GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    OReplacements = 2;
    XReplacements = 2;

    OTurn = true;

    update_UI();
}

function play_turn(cell) {

    // --------------

    let replacementHistoryUpdated = false;

    if (GameState[cell - 1] == (OTurn ? 1 : -1)) return; // do not replace your own cell

    else if (GameState[cell - 1] != 0) { // replacing a cell
        if (OTurn) {
            if (OReplacements <= 0) return;
            ReplacementHistory.push([OReplacements, XReplacements]);
            replacementHistoryUpdated = true;
            OReplacements -= 1;
        }
        else {
            if (XReplacements <= 0) return;
            ReplacementHistory.push([OReplacements, XReplacements]);
            replacementHistoryUpdated = true;
            XReplacements -= 1;
        }
    }
    if (!replacementHistoryUpdated) ReplacementHistory.push([OReplacements, XReplacements]);

    // --------------

    GameStateHistory.push(GameState.slice());

    GameState[cell - 1] = OTurn ? 1 : -1;

    OTurn = !OTurn;

    update_UI();
}

function undo() {
    if (GameStateHistory.length == 0) return;

    GameState = GameStateHistory.pop();
    replacements = ReplacementHistory.pop();
    OReplacements = replacements[0];
    XReplacements = replacements[1];
    
    OTurn = !OTurn;
    update_UI();
}

function update_UI() {

    document.getElementById("turn_indicator_O").className = OTurn ? "Turn_indicator_O" : "Turn_indicator_disabled";
    document.getElementById("turn_indicator_X").className = (!OTurn) ? "Turn_indicator_X" : "Turn_indicator_disabled";

    document.getElementById("o_replacements").textContent = OReplacements;
    document.getElementById("x_replacements").textContent = XReplacements;

    document.getElementById("undo").disabled = (GameStateHistory.length == 0);

    eval = parseInt(document.getElementById("eval_slider").value);
    document.getElementById("eval_label").textContent = ((eval > 0)? "+" : "") + eval/100;
    eval += 100;
    eval *= 1.28;
    eval = parseInt(eval);
    document.getElementById("eval_red").style = "height: " + (256 - eval) + "px";

    for (let i = 0; i < 9; i++) {
        let state = GameState[i];
        cell = document.getElementById("cell_" + (i + 1));
        cell.textContent = (state == 1) ? "O" : ((state == -1) ? "X" : "");
        cell.style = (state == 1) ? "color: dodgerblue" : "color: tomato";
    }
}

