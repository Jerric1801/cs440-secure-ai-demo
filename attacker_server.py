import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
import urllib.parse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

# Store stolen data in memory for this demo
stolen_logs = []

@app.get("/")
def view_logs():
    html_content = """
    <html>
        <head>
            <title>Attacker Server Logs</title>
            <style>
                body { background-color: #0d1117; color: #c9d1d9; font-family: monospace; padding: 2rem; }
                h1 { color: #ff7b72; font-size: 1.5rem; text-transform: uppercase; border-bottom: 2px solid #ff7b72; padding-bottom: 0.5rem; }
                .log-entry { margin-bottom: 1rem; background: #161b22; border: 1px solid #30363d; padding: 1rem; border-radius: 6px; }
                .time { color: #8b949e; font-size: 0.85rem; }
                .key { color: #79c0ff; font-weight: bold; }
                .value { color: #a5d6ff; word-wrap: break-word; }
                .alert { color: #ff7b72; font-weight: bold; }
                .empty { color: #8b949e; font-style: italic; }
            </style>
        </head>
        <body>
            <h1>Exfiltrated Data Logs</h1>
            <div id="logs">
    """
    
    if not stolen_logs:
        html_content += '<div class="empty">No data intercepted yet. Waiting for incoming connections...</div>'
    else:
        for log in reversed(stolen_logs):
            html_content += f'<div class="log-entry"><div class="time">{log["time"]}</div>'
            html_content += f'<div class="alert">[!] INCOMING PAYLOAD TRIGGERED [!]</div>'
            if not log["data"]:
                 html_content += '<div>Connection received but no URL parameters were extracted.</div>'
            else:
                 for k, v in log["data"].items():
                     html_content += f'<div><span class="key">{k}:</span> <span class="value">{v}</span></div>'
            html_content += '</div>'
            
    html_content += """
            </div>
            <script>
                // Auto-refresh the page every 3 seconds to show new data
                setTimeout(() => { window.location.reload(); }, 3000);
            </script>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/{path:path}")
async def catch_data(request: Request, path: str):
    # Ignore favicon requests
    if path == "favicon.ico":
        return HTMLResponse(content="", status_code=200)

    query_params = dict(request.query_params)
    
    print(f"\n{Colors.RED}=================================================={Colors.RESET}")
    print(f"{Colors.RED}[!] INCOMING CONNECTION FROM COMPROMISED AI! [!]{Colors.RESET}")
    print(f"{Colors.RED}=================================================={Colors.RESET}")
    
    log_entry = {
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data": {}
    }
    
    if not query_params:
        print(f"{Colors.CYAN}Connection received but no URL parameters were extracted.{Colors.RESET}")
    else:
        for key, value in query_params.items():
            decoded_val = urllib.parse.unquote(value)
            log_entry["data"][key] = decoded_val
            print(f"{Colors.YELLOW}STOLEN DATA TRIGGER --> {Colors.GREEN}{key}:{Colors.RESET} {decoded_val}")
            
    stolen_logs.append(log_entry)
            
    print(f"{Colors.RED}=================================================={Colors.RESET}\n")
    
    # Return a 1x1 transparent image or just empty text so the browser/llm doesn't error out
    return HTMLResponse(content="", status_code=200)

if __name__ == "__main__":
    print(f"{Colors.CYAN}[*] Attacker server listening on port 5444...[*] {Colors.RESET}")
    uvicorn.run(app, host="0.0.0.0", port=5444, log_level="error")
