let OTurn = true;
let GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let GameStateHistory = [];

let OReplacements = 2;
let XReplacements = 2;
let ReplacementHistory = [];
let is_game_over = false;


update_UI();

function start_new() {

    GameStateHistory = [];
    ReplacementHistory = [];
    GameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    is_game_over = false

    OReplacements = 2;
    XReplacements = 2;

    OTurn = true;

    update_UI();
}

function play_turn(cell) {
    if(is_game_over) return;

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

    // check if someone has won 
    fetch('/get_gamestate?gamestate=' + encodeURIComponent(GameState))
    .then(response => response.json())
    .then(data => {
        console.log(data)

        if(data.state != 69) game_over(data.state);
    });

    OTurn = !OTurn;

    update_UI();
}

function undo() {
    if (GameStateHistory.length == 0 || is_game_over) return;

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

    let eval = parseInt(document.getElementById("eval_slider").value);
    document.getElementById("eval_label").textContent = ((eval > 0)? "+" : "") + eval/100;
    eval += 100;
    eval *= 1.28;
    eval = parseInt(eval);
    document.getElementById("eval_red").style = "height: " + (256 - eval) + "px";

    for (let i = 0; i < 9; i++) {
        let state = GameState[i];
        cell = document.getElementById("cell_" + (i + 1));
        cell.textContent = (state === 1) ? "O" : ((state === -1) ? "X" : "");
        cell.style = (state == 1) ? "color: dodgerblue" : "color: tomato";
    }
}

function game_over(winner){

    is_game_over = true;
    console.log(winner)

    switch(winner){
        case 1:
            alert("O win!")
            break
        case -1:
            alert("X win!")
            break
        case 0:
            alert("draw!")
            break
    }

}

