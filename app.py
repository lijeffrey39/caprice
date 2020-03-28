
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
import os

# creates a Flask application, named app

app = Flask(__name__)
socketio = SocketIO(app)

# a route where we will display a welcome message via an HTML template
# @app.route("/")
# def hello():
#     message = "Hello, World"
#     return render_template('index.html', message=message)

@app.route("/")
def hello():
    return render_template('index.html', token = "hi")

# this is the note-playing socket
@socketio.on('notif')
def test_message():
    print('received')
    # print(message['data']['triggerButton'])
    emit('update value', {'notes': ['C4', 'E4', 'G4'], 'new_swipe': True}, broadcast=True)


@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")


@socketio.on('button press')
def test_connect(buttonNum):
    print("Button Pressed", buttonNum)


# run the application
if __name__ == "__main__":
    # app.run(debug=True)
    print("running")
    socketio.run(app, host='0.0.0.0')