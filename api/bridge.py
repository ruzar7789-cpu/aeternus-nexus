from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        core_id = data.get("id", "UNKNOWN")
        target_box = data.get("target", "CZ-1MV")
        
        # Logika simulace: Pokud je ID správné, Vercel povolí operaci
        if core_id == "2b5817cd6e3d1905":
            status_msg = "LOGGED_IN"
            payload = "AUTH_TOKEN_GENERATED"
        else:
            status_msg = "UNAUTHORIZED"
            payload = "NONE"

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "status": status_msg,
            "core": core_id,
            "box": target_box,
            "payload": payload,
            "action": "READY_FOR_COMMAND"
        }
        self.wfile.write(json.dumps(response).encode())
        
