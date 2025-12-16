import subprocess
import os
import sys

# Porta do Render (ou 5000 como fallback local)
backend_port = os.environ.get("PORT", "5000")
frontend_port = "8000"  # Para testes locais, pode deixar fixo

print(f"🔹 Iniciando backend (server.py) na porta {backend_port}...")
subprocess.Popen(
    [sys.executable, "server.py", backend_port],
    cwd=os.path.join(os.getcwd(), "backend")
)

print(f"🔹 Iniciando frontend na porta {frontend_port}...")
subprocess.Popen(
    [sys.executable, "-m", "http.server", frontend_port],
    cwd=os.path.join(os.getcwd(), "frontend")
)

print("\n✅ Acesse:")
print(f"Frontend: http://localhost:{frontend_port}")
print(f"Backend: http://localhost:{backend_port}/api/db")
