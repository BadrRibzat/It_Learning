
from flask_restx import Api

api = None

def init_api(app):
    global api
    if api is None:
        api = Api(app)
    return api

def get_api():
    global api
    return api