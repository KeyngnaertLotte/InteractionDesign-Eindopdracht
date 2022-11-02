from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_cors import CORS


# Start app
app = Flask(__name__)
CORS(app)


# Custom endpoint
endpoint = '/api/v1'


# ROUTES


@app.route('/', methods=['GET'])
def get_root():
    if request.method == 'GET':
        return "welkom bij het examen Sinksen2022, ga naar het correcte endpoint", 200
    
    
@app.route(endpoint + '/likesAndDislikes/<id>/', methods=['GET'])
def get_likes(id):
    if request.method == 'GET':
        s = DataRepository.readLikes(id)
        return jsonify(s), 200


# Start app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5500, debug=True)