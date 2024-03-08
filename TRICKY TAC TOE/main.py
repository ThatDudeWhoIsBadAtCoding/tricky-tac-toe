from flask import Flask, render_template, request, jsonify

WIN_STATES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Vertical
        [0, 4, 8], [2, 4, 6]              # Diagonal
    ]

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/get_gamestate', methods=["GET"])
def get_gamestate():

    # get arguments
    gamestate = request.args.get('gamestate').split(',')
    replacements = request.args.get('replacements').split(',')
    oTurn = request.args.get('oturn') == "true"

    gamestate = [int(i) for i in gamestate]
    replacements = [int(i) for i in replacements]

    # ----------------
    # this function will either return a single integer (drawn position or game still going on)
    # or a tuple when the game is won by either player (tuple containing the winner and the tiles for colouring)
    state = has_won(gamestate, replacements, oTurn)  

    if isinstance(state, int): 
        return jsonify({'state': state})
    else:
        return jsonify({'state': state[0], 'tiles': state[1]})


def has_won(board, replacements = [0, 0], oTurn = True):

    # +1 -> O won
    # -1 -> X won
    # 00 -> tie
    # 69 -> game still on
        
    for combination in WIN_STATES:
        if board[combination[0]] == board[combination[1]] == board[combination[2]] != 0:
            return (board[combination[0]], combination)  # Return the winner and the winning tiles
        
    # no empty spaces left on the board
    if 0 not in board:
        if (oTurn and replacements[0]) or (not oTurn and replacements[1]): # check if replacement moves are possible
            return 69 # game still going on
        return 0 # game drawn
    
    return 69 # game still going on (no empty spaces on board)


if __name__ == '__main__':
    app.run(debug=True, port=8000)