from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Načtení dat z tvého mobilu (Core: 2b5817cd6e3d1905)
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # Simulace logiky pro Z-BOX
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "status": "active",
            "server": "VERCEL_CLOUD",
            "message": "Signal prijat a overen",
            "box_target": "CZ-1MV"
        }
        self.wfile.write(json.dumps(response).encode())
      
