import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))

class ShopPulseHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    # Disable annoying noisy log requests, only show essentials
    def log_message(self, format, *args):
        if "200" not in args[1]:
            super().log_message(format, *args)

def start_server():
    os.chdir(DIR)
    url = f"http://localhost:{PORT}"
    
    print("\n" + "=" * 60)
    print("  🚀 ShopPulse AI - Trend-to-Ad Generator Serveri")
    print("=" * 60)
    print(f"  ➜ Yerli Ünvan:   {url}")
    print("  ➜ Vəziyyət:      Aktivdir və brauzer açılır...")
    print("  ➜ Dayandırmaq:   Terminalda CTRL + C sıxın")
    print("=" * 60 + "\n")

    # Open browser automatically after a short delay
    webbrowser.open(url)

    # Allow port reuse to avoid 'Address already in use' errors
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), ShopPulseHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Server dayandırıldı. Xoş günlər!")
        sys.exit(0)
    except OSError as e:
        if "Address already in use" in str(e) or 10048 in getattr(e, "args", []):
            print(f"\n[!] Port {PORT} artıq istifadədədir. Brauzerdə {url} ünvanına keçin.")
            webbrowser.open(url)
        else:
            raise e

if __name__ == "__main__":
    start_server()
