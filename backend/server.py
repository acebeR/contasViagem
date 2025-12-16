import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

DB_FILE = "banco.json"

class SimpleHandler(BaseHTTPRequestHandler):
    def _set_headers(self, code=200):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == "/api/db":
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except FileNotFoundError:
                data = {"pessoas": [], "despesas": []}
            self._set_headers()
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            self.send_error(404, "File not found")

    def do_POST(self):
        if self.path == "/api/db":
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode("utf-8"))
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode("utf-8"))
        else:
            self.send_error(404, "File not found")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # pega porta do Render
    print(f"🔹 Backend rodando em http://0.0.0.0:{port}")
    HTTPServer(("0.0.0.0", port), SimpleHandler).serve_forever()

