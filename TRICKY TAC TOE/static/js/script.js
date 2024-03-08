// --------------
let OTurn = true;
let GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let GameStateHistory = [];

let OReplacements = 2;
let XReplacements = 2;
let ReplacementHistory = [];
let is_game_over = false;
// --------------


function start_new() {

    GameStateHistory = [];
    ReplacementHistory = [];
    GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    OReplacements = 2;
    XReplacements = 2;

    is_game_over = false;
    OTurn = true;

    update_UI();
}


function play_turn(cell) {

    if (is_game_over) return;

    let prevReplacements = [OReplacements, XReplacements]; // temporary variable

    if (GameState[cell - 1] == (OTurn ? 1 : -1)) return; // do not replace your own cell

    else if (GameState[cell - 1] != 0) // attempting to replace an enemy cell
        if (OTurn) {
            if (OReplacements <= 0) return;
            OReplacements -= 1;
        }
        else {
            if (XReplacements <= 0) return;
            XReplacements -= 1;
        }

    // --------------

    GameStateHistory.push(GameState.slice());
    ReplacementHistory.push(prevReplacements.slice());

    GameState[cell - 1] = OTurn ? 1 : -1;

    OTurn = !OTurn;

    // check if someone has won 
    fetch('/get_gamestate?gamestate=' + encodeURIComponent(GameState) + '&replacements=' + encodeURIComponent([OReplacements, XReplacements]) + '&oturn=' + encodeURIComponent(OTurn))
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.state != 69) game_over(data.state, data.tiles);
        });

    update_UI();
}


function undo() {

    if (GameStateHistory.length == 0) return;

    GameState = GameStateHistory.pop();
    let replacements = ReplacementHistory.pop();
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

    // (!) eval value is controlled by a slider only for debugging purposes
    // eval must be a value ranging from -1 to 1

    let eval = (parseInt(document.getElementById("eval_slider").value))/100;


    document.getElementById("eval_label").textContent = ((eval > 0) ? "+" : "") + eval;

    eval += 1;
    eval *= 128;
    eval = parseInt(eval);

    document.getElementById("eval_red").style = "height: " + (256 - eval) + "px";

    for (let i = 0; i < 9; i++) {
        let state = GameState[i];
        cell = document.getElementById("cell_" + (i + 1));
        cell.textContent = (state === 1) ? "O" : ((state === -1) ? "X" : "");
        cell.style = (state == 1) ? "color: dodgerblue" : "color: tomato";
    }
}


function game_over(winner, tiles) {

    is_game_over = true;
    console.log("Winner:", ["X", "(draw)", "O"][winner + 1]);

    // colouring the tiles
    switch (winner) {
        case 1:
            for (let i = 0; i < tiles.length; i++) {
                let cell = document.getElementById("cell_" + (tiles[i] + 1));
                cell.style = "background-color: dodgerblue";
            }
            break
        case -1:
            for (let i = 0; i < tiles.length; i++) {
                let cell = document.getElementById("cell_" + (tiles[i] + 1));
                cell.style = "background-color: tomato";
            }
            break
        case 0:
            for (let i = 1; i <= 9; i++) {
                let cell = document.getElementById("cell_" + i);
                cell.style = "background-color: rgb(119, 119, 119)";
            }
            break
    }
}