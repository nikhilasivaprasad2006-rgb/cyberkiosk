# CyberKiosk AI 🛡️
> **Accessible Bilingual Cyber Safety Kiosk for Rural Communities & Senior Citizens**  
> *Aligned with UN Sustainable Development Goals: SDG 17 (Partnerships for the Goals) & SDG 10 (Reduced Inequalities)*

---

## 📌 Overview

**CyberKiosk AI** is a lightweight, accessible web assistant designed to protect families, senior citizens, and rural users from digital financial fraud. It combines **local heuristic analysis** with a **Python Flask backend** and **browser-based offline fallback**, allowing users to safely test suspicious messages, QR codes, links, bank notices, profiles, and phone calls.

The interface supports both **English** and **Malayalam (മലയാളം)** with high-contrast accessibility typography, an interactive text-size scaler, and built-in **Read Aloud (Text-to-Speech)** voice narration.

---

## 🚨 All 6 Fully Functional Interactive Scam Detectors

### 1. 💳 UPI & QR Code Scam Detector
- **QR Image Upload**: Drag-and-drop or browse PNG, JPG, and JPEG images (up to 5MB).
- **Local QR Decoding**: Decodes QR images completely in the browser using HTML5 Canvas and `jsQR` without uploading files to third-party clouds.
- **Payload Inspection**: Automatically parses UPI URI parameters (`pa` payee address, `pn` payee name, `am` amount, `tn` transaction note) or web URLs.
- **Collect Request / PIN Trap Detection**: Flags the critical rule: *“To receive money or claim cashback, you NEVER need to scan a QR code or enter your UPI PIN. Entering your PIN will ALWAYS deduct money from your account.”*
- **Risk Assessment**: Outputs Low, Medium, or High risk with technical parameters, red flags, and safety steps. Never asks for or collects UPI PINs, OTPs, or passwords.

### 2. 💬 WhatsApp Emergency Scam Detector
- **Message Input**: Large textarea for pasting emergency appeals from unknown numbers.
- **Screenshot Upload & OCR**: Optional chat screenshot upload with client-side OCR text extraction into the text area.
- **Emotional Manipulation & Impersonation**: Detects claims of lost phones, new numbers, urgent hospital bills, accident crises, and immediate money transfer demands.
- **Verification Rule**: Prominently warns users to verify emergencies by contacting the relative through their *original, known phone number*.

### 3. 🔗 Fake Link & APK Scam Detector
- **Safe URL Analysis**: Analyzes URLs locally without opening or visiting them, and without downloading APK files.
- **Malware & Phishing Heuristics**: Detects `.apk` package downloads, suspicious TLDs (`.xyz`, `.top`, `.online`, `.tk`, etc.), raw IP hosts, URL shorteners (`bit.ly`, `tinyurl.com`), and brand spoofing (e.g. `sbi-kyc-update.xyz`).
- **Safe Browsing Guidance**: Explains every warning sign and recognizes official government portals (`.gov.in`).

### 4. 🏦 Bank & KYC Block Scam Detector
- **Bank Alert Textarea**: Paste suspicious SMS messages, email notifications, or call transcripts.
- **Bank Context**: Optional dropdown to select the bank (SBI, HDFC, ICICI, Axis, PNB, Canara, Kerala Gramin Bank, Federal Bank, etc.).
- **Screenshot Upload**: Optional upload of SMS or bank notice screenshot with OCR.
- **Threat Detection**: Flags urgent KYC expiry threats, 2-hour account freeze coercion, and requests for confidential credentials.
- **Strict Privacy**: CyberKiosk AI never collects bank account numbers, card numbers, CVVs, passwords, OTPs, or PINs.

### 5. 👤 Fake Profile & Impersonation Detector
- **Profile Details**: Inputs for display name, username/handle, platform (Facebook, Instagram, WhatsApp, Telegram, X/Twitter, LinkedIn), and suspicious messages received.
- **Profile Photo Upload**: Upload profile photo or screenshot with preview and remove controls.
- **Optional Side-by-Side Comparison**: Compare a suspected clone against a known/original profile handle and photo to detect slight variations.
- **Clear Limitation Notice**: Explicitly informs the user that identity cannot be verified solely from text or local image analysis without social platform APIs. Never claims a profile is genuine merely because no red flags were found.

### 6. 📞 Digital Arrest & Fake Police Call Detector
- **Call Transcript / Notes Input**: Text box for user notes or caller statements.
- **Claimed Authority**: Dropdowns for claimed departments (CBI, ED, Narcotics Control Bureau, Customs, Cyber Police, TRAI, etc.) and alleged offenses (drugs, money laundering, SIM misuse).
- **Voice Dictation**: Hands-free speech-to-text button allowing seniors to speak their call notes out loud.
- **Optional Audio Upload**: Upload call recording (`.mp3`, `.wav`, `.m4a`) with audio preview and playback.
- **100% Fraud Truth Warning**: Prominently highlights that under Indian Law, Police, CBI, ED, and courts *NEVER* conduct "Digital Arrests", never issue arrest warrants over video calls, and never ask citizens to transfer money to "verification accounts".

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Accessible HTML5, Vanilla CSS3 (custom CSS variables, responsive grid, glassmorphism dark blue radial gradient), Vanilla JavaScript (ES6+).
- **Local QR Engine**: `jsqr.min.js` (bundled locally for 100% offline QR decoding via HTML5 Canvas).
- **Backend**: Python 3 (Flask, Flask-CORS).
- **Localization**: Bilingual translation dictionary (`translations.js`) covering English (`en`) and Malayalam (`ml`).
- **Voice & Accessibility**: Web Speech API (`SpeechSynthesisUtterance`) with `ml-IN` and `en-IN` voice rate adjustments, plus dynamic font-size scaler (`A-`, `A`, `A+`).
- **Dual-Engine Resilience**: The frontend automatically connects to the Python backend at `http://127.0.0.1:5000`. If the backend is offline or unreachable, the frontend seamlessly falls back to the local browser heuristic safety engine.

---

## 🚀 Installation & Quick Start

### 1. Prerequisites
- Python 3.10+ installed on your system.
- Any modern web browser (Chrome, Edge, Firefox, Safari).

### 2. Install Backend Dependencies
Open a terminal in the project directory:
```bash
pip install -r requirements.txt
```
*(Requirements: `flask>=3.1.0`, `flask-cors>=6.0.0`)*

### 3. Start the Python Backend
Run the Flask server:
```bash
python backend.py
```
The backend will start at:
```
http://127.0.0.1:5000
```

### 4. Start the Frontend
In a second terminal window (in the same project folder), start a local static server:
```bash
python -m http.server 8080
```
Open your browser and navigate to:
```
http://localhost:8080
```
*(Alternatively, you can open `index.html` directly in your browser).*

---

## 🧪 Testing the Detectors

An automated backend test suite is included in `test_detectors.py`. To run all tests:
```bash
python test_detectors.py
```

Expected output:
```
Test 1 Passed: /api/health OK
Test 2 Passed: /api/analyze-upi identified collect request scam
Test 3 Passed: /api/analyze-message (WhatsApp) detected emergency scam
Test 4 Passed: /api/analyze-url detected fake APK scam
Test 5 Passed: /api/analyze-message (Bank KYC) detected KYC threat
Test 6 Passed: /api/analyze-profile detected impersonation money request
Test 7 Passed: /api/analyze-digital-arrest detected extortion & fake police threat

SUCCESS: All 7 tests passed!
```

---

## 🔒 Security & Privacy Commitments

1. **No Sensitive Credential Collection**: CyberKiosk AI will **never** ask for, collect, log, or store OTPs, UPI PINs, ATM PINs, bank passwords, or account numbers.
2. **Safe Link Evaluation**: The tool analyzes URLs using local regex heuristics without sending automated HTTP requests or downloading APK malware.
3. **Local-First Privacy**: QR codes are decoded inside the browser via client-side canvas. User images are not uploaded to third-party clouds.
4. **Transparent Safety Warnings**: The system clearly discloses that local heuristics have limitations and cannot guarantee 100% security. Users are always advised to verify claims through independent, official channels.
5. **Emergency Contact**: Prominently displays the official **1930 National Cyber Crime Helpline** and portal (`cybercrime.gov.in`).
