import subprocess
import os
import sys

backend_port = "5000"
frontend_port = "8000"

print(f"🔹 Iniciando backend na porta {backend_port}...")
subprocess.Popen(
    [sys.executable, "server.py", backend_port],
    cwd=os.path.join(os.getcwd(), "backend")  # assume que backend está na pasta backend
)

print(f"🔹 Iniciando frontend na porta {frontend_port}...")
subprocess.Popen(
    [sys.executable, "-m", "http.server", frontend_port],
    cwd=os.path.join(os.getcwd(), "docs")  # frontend agora está em docs
)

print("\n✅ Acesse:")
print(f"Frontend: http://localhost:{frontend_port}")
print(f"Backend: http://localhost:{backend_port}/api/db")
