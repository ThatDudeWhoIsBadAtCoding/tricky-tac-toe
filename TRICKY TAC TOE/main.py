# app.py

from flask import Flask, render_template, request, jsonify


app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/get_gamestate', methods=["GET"])
def get_gamestate():
    gamestate = request.args.get('gamestate').split(",")
    gamestate = [int(i) for i in gamestate]
    state = has_won(gamestate)
    return jsonify({'state': state})

def has_won(board) -> int:
    # 1 means O won, 0 means tie, -1 means X won, 69 means the game is still going on
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Vertical
        [0, 4, 8], [2, 4, 6]              # Diagonal
    ]
        
    for combination in winning_combinations:
        if board[combination[0]] == board[combination[1]] == board[combination[2]] != 0:
            return board[combination[0]]  # Return the winner
    return 69 if 0 in board else 0 # if spaces r empty that means game goin on else its a draw

if __name__ == '__main__':
    app.run(debug=True, port=8000)
