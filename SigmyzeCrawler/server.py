from flask import Flask, jsonify, request
import os

from crawlers import WEO_Parser

app = Flask(__name__)

#check if dir exists
path = './tmp'
if not os.path.exists(path):
    os.mkdir("./tmp")

app.secret_key = "secret"
app.config['UPLOAD_FOLDER'] = './tmp'

@app.route("/")
def index():
    return jsonify({ 'working': True })

@app.route("/weo", methods=['POST'])
def weo_upload():
    if 'file' not in request.files:
        resp = jsonify({ 'msg': 'No File in request' })
        resp.status_code = 400
        return resp

    file = request.files['file']
    if file.filename == '':
        resp = jsonify({ 'msg': 'No file selected' })
        resp.status_code = 400
        return resp

    file.save('./tmp/weo.xls')
    resp = jsonify({ 'msg': 'Uploaded' })
    resp.status_code = 201

    parser = WEO_Parser.WEO_Parser()

    return resp
