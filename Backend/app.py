from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
# import threading


# Start app
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)


# Custom endpoint
endpoint = '/api/v1'

# SOCKET.IO EVENTS


@socketio.on('connect')
def initial_connection():
    print('a new client connnect')


@app.route(endpoint + '/top/', methods=['GET'])
def get_allLikes():
    if request.method == 'GET':
        s = DataRepository.readAllLikes()
        return jsonify(s), 200


@socketio.on('F2B_get_likes')
def getLikes(jsonObject):
    print(jsonObject)
    isbn_nr = jsonObject['isbn_nr']
    title = jsonObject['name']
    cat = jsonObject['categorie']
    insert = DataRepository.readLikes(isbn_nr, title, cat)
    if insert:
        socketio.emit('B2F_showLikes', insert)

@socketio.on('F2B_update_likes')
def getLikes(jsonObject):
    isbn_nr = jsonObject['isbn_nr']
    insert = DataRepository.readUpdatedLikes(isbn_nr)
    if insert:
        socketio.emit('B2F_showLikes', insert)


@socketio.on('F2B_add_like')
def updateLikes(jsonObject):
    isbn_nr = jsonObject['isbn_nr']
    data = DataRepository.updateLike(isbn_nr)
    print(data)
    if data > 0:
        return jsonify(response="Likes van {0} aangepast ".format(isbn_nr)), 200
    else:
        return jsonify(error="Isbn {} niet gevonden".format(isbn_nr)), 404


@socketio.on('F2B_add_dislike')
def updateDislikes(jsonObject):
    isbn_nr = jsonObject['isbn_nr']
    data = DataRepository.updateDislike(isbn_nr)
    print(data)
    if data > 0:
        return jsonify(response="Dislikes van {0} aangepast ".format(isbn_nr)), 200
    else:
        return jsonify(error="Isbn {} niet gevonden".format(isbn_nr)), 404


@socketio.on('F2B_add_categorie')
def addCategorie(json):
    isbn = json['isbn_nr']
    cat = json['categorie']
    print(isbn, cat)
    data = DataRepository.addCat(isbn, cat)
    if data > 0:
        return jsonify(response="Cat van {0} aangepast ".format(isbn)), 200
    else:
        return jsonify(error="Isbn {} niet gevonden".format(isbn)), 404
    

# Start app
if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=5500, debug=True)
    socketio.run(app, host='0.0.0.0', debug=True)
