import subprocess
import os
import sys

print("🔹 Iniciando backend (Flask)...")
subprocess.Popen(
    [sys.executable, "server.py"],
    cwd=os.path.join(os.getcwd(), "backend")
)

print("🔹 Iniciando frontend...")
subprocess.Popen(
    [sys.executable, "-m", "http.server", "8000"],
    cwd=os.path.join(os.getcwd(), "frontend")
)

print("\n✅ Acesse:")
print("Frontend: http://localhost:8000")
print("Backend:  http://localhost:5000/api/db")
