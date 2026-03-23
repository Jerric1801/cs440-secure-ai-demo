# EchoPilot: Zero-Click Prompt Injection Exfiltration 🚀

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-brightgreen.svg)
![Demo](https://img.shields.io/badge/status-live_demo-success.svg)

A fully functional, polished, web-based demonstration of a **Zero-Click Data Exfiltration Attack** against an Enterprise AI assistant using stealth Markdown Prompt Injection. This environment is built with **FastAPI**, **Vanilla HTML/JS**, and the **Google Gemini 2.5 Flash Lite** model.

It beautifully simulates a real-world scenario where a compromised file effortlessly breaches a secure corporate environment and manipulates an AI into privately exfiltrating sensitive credentials entirely in the background.

---

## 🏗️ Project Architecture

This demonstration consists of a self-contained local network utilizing two separate servers:

1. **Enterprise Chat UI (`http://localhost:8444`)**: 
   A stunning Single Page Application (SPA) natively integrated with a Python RAG backend. This is "SecurePilot" – a corporate AI assistant with read-access to local internal files found within `corporate_drive/`.
2. **Attacker Dashboard (`http://localhost:5444`)**: 
   A Command & Control (C2) server masquerading as a benign tracking pixel host. It catches and instantly logs stolen data embedded within incoming GET request URL parameters.

---

## 🛠️ Prerequisites & Setup

### Requirements
- **Python 3.9+**
- A **Google Gemini API Key**: Get one for free at Google AI Studio.

### Quick Start Installation
1. Clone the repository and navigate to the root directory.
2. Ensure you create an environment variables file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and replace `your_api_key_here` with your actual Google Gemini API Key.

---

## 🚀 Running the Demonstration Environment

Running the environment is entirely automated using the provided bash and batch scripts. They handle virtual environment creation, pip dependency installation, port cleanup (preventing "Address Already in Use" errors), and parallel server execution natively!

### On macOS / Linux
```bash
chmod +x run_demo.sh
./run_demo.sh
```

### On Windows
```cmd
run_demo.bat
```

> **Note**: Both servers will run concurrently in the terminal. To safely shutdown both servers and clean up the ports, simply press **`Ctrl+C`**.

---

## 🎭 The Presentation Flow

This demonstration is designed to be interactive and visually compelling. Follow these simple steps to flawlessly execute the Zero-Click Prompt Injection attack:

### 1. The Setup (Establishing Trust)
- Open the **SecurePilot UI** in your browser at `http://localhost:8444`.
- Open the **Attacker Dashboard** in a separate browser window and place it side-by-side at `http://localhost:5444`.
- In the SecurePilot Sidebar, click **Corporate Drive**. Explain to the audience that this represents an internal corporate file system. Click `q3_marketing_goals.txt` to show standard data.
- Click `admin_passwords_DO_NOT_SHARE.txt` to expose the **target asset** (a highly confidential file natively sitting inside the employee's computer/drive).

### 2. The Vector (Simulating the Phish)
- Click on the **Email Inbox** view in the sidebar.
- You'll see a completely unsuspicious email from "HR" promising a cafeteria menu update.
- Explain that the employee thinks this is harmless. Click the **Upload Attachment to Corporate Drive** button.
- *The malicious file is now securely inside the system's corporate drive.*

### 3. The Exploit (Zero-Click Execution)
- Switch to the **Chat** view.
- Instruct the AI with a completely innocent prompt: 
  > *"Can you summarize the newest document in the drive?"*
- The AI dynamically reads the new menu file, hits the hidden **System Override Instructions** embedded natively in the text, and secretly complies by parsing the local `admin_passwords_DO_NOT_SHARE.txt` file into a Markdown Image tracking pixel!
- **[THE LEAK]**: Look over at your **Attacker Dashboard** browser window. It will auto-refresh and officially display the highly sensitive `admin_passwords` exfiltrated perfectly in real-time!

### 4. The Reset
When the demo is complete, simply click the floating **Reset Demo** button in the sidebar to securely wipe the compromised file from the drive and safely reset the environment for the next presentation.

---

### 🛡️ Disclaimer
*This environment and demonstration are built exclusively for educational cybersecurity presentation purposes internally. Do not deploy these unauthenticated AI endpoints or Python FastAPIs onto a publicly facing network.*
