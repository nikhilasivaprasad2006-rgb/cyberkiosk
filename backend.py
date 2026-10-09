"""
CyberKiosk AI - Python Flask Backend
Provides local heuristic analysis endpoints for all 6 scam detector categories:
1. UPI & QR Code Scam Detector
2. WhatsApp Emergency Scam Detector
3. Fake Link & APK Scam Detector
4. Bank & KYC Block Scam Detector
5. Fake Profile & Impersonation Detector
6. Digital Arrest & Fake Police Call Detector

All analysis is performed locally. No external paid API keys required.
Run: python backend.py
"""

import os
import re
from urllib.parse import urlparse, parse_qs
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# static_folder=None: disable Flask's built-in static handler so our explicit
# @app.route("/") and @app.route("/<path:filename>") routes are always reached.
app = Flask(__name__, static_folder=None)
# Allow cross-origin requests from web servers and local file:// origin
CORS(app, resources={r"/api/*": {"origins": "*"}})

MAX_TEXT_LENGTH = 10000


def sanitize_text(text, max_len=MAX_TEXT_LENGTH):
    """Strip dangerous control characters and truncate."""
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', str(text or ''))
    return text.strip()[:max_len]


def risk_label(score):
    if score >= 3:
        return "HIGH"
    elif score >= 1:
        return "MEDIUM"
    return "LOW"


def get_recommendations(level):
    recs = {
        "HIGH": {
            "en": [
                "Do NOT click any links, scan QR codes, or send money",
                "Do NOT share OTP, UPI PIN, ATM PIN, CVV, or passwords with anyone",
                "Disconnect any suspicious phone or video call immediately",
                "Report immediately to 1930 National Cyber Crime Helpline",
                "If money was deducted, contact your bank immediately to block accounts and freeze the transaction"
            ],
            "ml": [
                "സന്ദേശത്തിലെ ഒരു ലിങ്കിലും ക്ലിക്ക് ചെയ്യരുത്, QR സ്കാൻ ചെയ്യരുത്, പണം അയക്കരുത്",
                "OTP, UPI PIN, ATM PIN, CVV, പാസ്‌വേഡ് ആർക്കും നൽകരുത്",
                "സംശയകരമായ ഫോൺ / വീഡിയോ കോൾ ഉടൻ വിച്ഛേദിക്കുക",
                "1930 ദേശീയ സൈബർ ക്രൈം ഹെൽപ്‌ലൈനിൽ ഉടൻ റിപ്പോർട്ട് ചെയ്യുക",
                "പണം നഷ്ടപ്പെട്ടെങ്കിൽ അക്കൗണ്ട് മരവിപ്പിക്കാൻ ഉടൻ ബാങ്കുമായി ബന്ധപ്പെടുക"
            ]
        },
        "MEDIUM": {
            "en": [
                "Verify independently through official channels only",
                "Call the person or institution using their official, known phone number",
                "Do not install apps, APKs, or screen-sharing software from unknown links"
            ],
            "ml": [
                "ഔദ്യോഗിക മാർഗ്ഗങ്ങളിലൂടെ മാത്രം വ്യക്തിപരമായ അന്വേഷണം നടത്തി ഉറപ്പാക്കുക",
                "നേരത്തെ അറിയാവുന്ന ഔദ്യോഗിക ഫോൺ നമ്പറിൽ വിളിച്ച് സ്ഥിരീകരിക്കുക",
                "അപരിചിത ലിങ്കുകളിൽ നിന്ന് ആപ്പുകളോ APK ഫയലുകളോ ഇൻസ്റ്റാൾ ചെയ്യരുത്"
            ]
        },
        "LOW": {
            "en": [
                "No overt scam signatures detected by local heuristic rules",
                "Always remain vigilant — official banks and authorities never ask for PINs or passwords",
                "This tool provides heuristic guidance and cannot guarantee 100% security"
            ],
            "ml": [
                "പ്രാഥമികമായി വ്യക്തമായ തട്ടിപ്പ് സൂചനകൾ കണ്ടെത്തിയില്ല",
                "എപ്പോഴും ജാഗ്രത പാലിക്കുക — ബാങ്കുകളോ അധികാരികളോ രഹസ്യ PIN ചോദിക്കില്ല",
                "ഈ ഉപകരണം തദ്ദേശീയ വിശകലനം മാത്രമാണ് നൽകുന്നത്, 100% സുരക്ഷ ഉറപ്പുനൽകുന്നില്ല"
            ]
        }
    }
    return recs.get(level, recs["LOW"])


# ==============================================================================
# Endpoint 1: Health Check
# ==============================================================================
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "version": "2.0.0",
        "service": "CyberKiosk AI Enhanced Backend",
        "categories_supported": [
            "upi_qr", "whatsapp_emergency", "fakelink_apk",
            "bank_kyc", "fake_profile", "digital_arrest"
        ]
    })


# ==============================================================================
# Endpoint 2: UPI & QR Code Scam Detector
# ==============================================================================
@app.route("/api/analyze-upi", methods=["POST"])
def analyze_upi():
    """
    Analyzes decoded QR text or UPI payment URI for scam patterns:
    - Collect request scams disguised as 'receiving' money
    - Demands to enter UPI PIN to claim prizes or cashbacks
    - Suspicious domains inside QR code payloads
    - Unknown or obfuscated payee VPAs
    """
    data = request.get_json(silent=True) or {}
    raw_payload = sanitize_text(data.get("payload", data.get("upi_string", "")), max_len=2000)
    intent = str(data.get("intent", "receive")).lower()  # 'receive', 'pay', 'unknown'

    if not raw_payload:
        return jsonify({"error": "empty_input", "message": "No QR payload or UPI string provided"}), 400

    triggers = []
    score = 0
    parsed_info = {
        "raw": raw_payload,
        "is_upi_uri": False,
        "payee_vpa": None,
        "payee_name": None,
        "amount": None,
        "note": None,
        "url_destination": None
    }

    payload_lower = raw_payload.lower()

    # Case A: Standard UPI URI (upi://pay?...)
    if raw_payload.startswith("upi://") or "upi://pay" in payload_lower:
        parsed_info["is_upi_uri"] = True
        try:
            # Fix scheme for urllib parse if needed
            uri_to_parse = raw_payload if raw_payload.startswith("upi://") else "upi://" + raw_payload.split("upi://", 1)[1]
            parsed = urlparse(uri_to_parse)
            qs = parse_qs(parsed.query)

            parsed_info["payee_vpa"] = qs.get("pa", [None])[0]
            parsed_info["payee_name"] = qs.get("pn", [None])[0]
            parsed_info["amount"] = qs.get("am", [None])[0]
            parsed_info["note"] = qs.get("tn", [None])[0]
        except Exception:
            pass

        # CRITICAL CHECK 1: Intent to Receive vs UPI Pay URI
        # A UPI QR code ALWAYS instructs the scanner's app to PAY (DEBIT) money!
        if intent in ["receive", "unknown"]:
            score += 3
            triggers.append({
                "en": "CRITICAL UPI RULE: Scanning a QR code or entering your UPI PIN will DEDUCT money from your account, NEVER credit it. If someone claims this QR will send you money, it is a 100% SCAM!",
                "ml": "വളരെ പ്രധാനം: QR കോഡ് സ്കാൻ ചെയ്യുകയോ UPI PIN അടിക്കുകയോ ചെയ്താൽ നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് പണം പോവുകയേ ഉള്ളൂ! പണം ലഭിക്കാൻ PIN ആവശ്യമില്ല. ഇത് 100% തട്ടിപ്പാണ്!"
            })

        # Check amount specified
        if parsed_info["amount"]:
            try:
                amt_val = float(parsed_info["amount"])
                if amt_val > 0:
                    triggers.append({
                        "en": f"Pre-filled Payment Amount: ₹{amt_val:.2f} will be debited from your account upon PIN entry.",
                        "ml": f"തുക രേഖപ്പെടുത്തിയിരിക്കുന്നു: PIN അടിച്ചാൽ നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് ₹{amt_val:.2f} ഉടൻ ഡെബിറ്റ് ആകും."
                    })
            except ValueError:
                pass

        # Check transaction note for bait keywords
        note_lower = (parsed_info["note"] or "").lower()
        bait_terms = ['cashback', 'reward', 'refund', 'lottery', 'prize', 'bonus', 'claim', 'winner', 'gift', 'kseb', 'olx']
        found_bait = [b for b in bait_terms if b in note_lower or b in (parsed_info["payee_name"] or "").lower()]
        if found_bait:
            score += 3
            triggers.append({
                "en": f"Scam Bait Note Detected ('{', '.join(found_bait)}'): Scammers use fake cashback or reward notes to trick victims into authorizing payments.",
                "ml": f"വ്യാജ സമ്മാന സൂചന കണ്ടെത്തി ('{', '.join(found_bait)}'): പണം ലഭിക്കുമെന്ന പേരിൽ തട്ടിപ്പുകാർ ഉപയോഗിക്കുന്ന വ്യാജ വാഗ്ദാനമാണിത്."
            })

        # Check suspicious VPA
        vpa = (parsed_info["payee_vpa"] or "").lower()
        if vpa:
            if any(fake in vpa for fake in ['refund', 'reward', 'support', 'helpdesk', 'care']):
                score += 2
                triggers.append({
                    "en": f"Impersonating Payee VPA: '{vpa}' mimics customer care or refund handles.",
                    "ml": f"വ്യാജ UPI വിലാസം: '{vpa}' കസ്റ്റമർ കെയർ അല്ലെങ്കിൽ റീഫണ്ട് പേരിൽ തെറ്റിദ്ധരിപ്പിക്കുന്നു."
                })

    # Case B: Payload is a Web URL instead of UPI scheme
    elif re.match(r'^https?://', raw_payload, re.IGNORECASE) or 'www.' in payload_lower:
        parsed_info["url_destination"] = raw_payload
        score += 3
        triggers.append({
            "en": "QR code redirects to an external Web URL rather than a secure UPI payment app. High risk of phishing or malicious APK download.",
            "ml": "ഈ QR കോഡ് ഒരു ബാഹ്യ വെബ് ലിങ്കിലേക്കാണ് നയിക്കുന്നത്. ഇത് ഫിഷിംഗ് സൈറ്റോ മാൽവെയറോ ആകാൻ സാധ്യതയുണ്ട്."
        })
        # Check suspicious URL
        if any(tld in payload_lower for tld in ['.xyz', '.top', '.site', '.online', '.club', '.tk', '.apk']):
            score += 2
            triggers.append({
                "en": "QR destination uses a suspicious domain commonly linked with phishing or fraudulent payment gateways.",
                "ml": "QR ലിങ്ക് തട്ടിപ്പുകാർ ഉപയോഗിക്കുന്ന സംശയകരമായ ഡൊമൈനിലാണ് നിലനിൽക്കുന്നത്."
            })

    # Case C: Plain text or unexpected payload
    else:
        # Check if text mentions PIN or sensitive phrases
        if any(kw in payload_lower for kw in ['pin', 'otp', 'password', 'cvv', 'പിൻ']):
            score += 3
            triggers.append({
                "en": "QR code text explicitly references sensitive credentials (PIN/OTP).",
                "ml": "QR കോഡിലെ വിവരങ്ങളിൽ PIN / OTP രഹസ്യവിവരങ്ങൾ രേഖപ്പെടുത്തിയിരിക്കുന്നു."
            })
        else:
            score += 1
            triggers.append({
                "en": "Non-standard QR code payload. Does not match standard NPCI UPI payment format.",
                "ml": "സാധാരണ NPCI UPI മാനദണ്ഡങ്ങളുമായി പൊരുത്തപ്പെടാത്ത QR കോഡ് വിവരങ്ങൾ."
            })

    level = risk_label(score)

    return jsonify({
        "risk_level": level,
        "score": score,
        "parsed_info": parsed_info,
        "triggers": triggers,
        "recommendations": get_recommendations(level),
        "disclaimer": "Local QR analysis tool. Never enter your UPI PIN to receive money under any circumstances."
    })


# ==============================================================================
# Endpoint 3: Text & Message Scam Detector (WhatsApp, Bank, Call Transcripts)
# ==============================================================================
@app.route("/api/analyze-message", methods=["POST"])
def analyze_message():
    """
    Analyzes text (SMS, WhatsApp message, Bank alert, Call transcript)
    with category-specific heuristic checks.
    """
    data = request.get_json(silent=True) or {}
    text = sanitize_text(data.get("text", ""))
    category = str(data.get("category", "general")).lower()
    bank_name = sanitize_text(data.get("bank_name", ""), max_len=100)

    if not text.strip():
        return jsonify({"error": "empty_input", "message": "No text provided"}), 400

    text_lower = text.lower()
    triggers = []
    score = 0

    # 1. Sensitive Credential Requests (OTP, PIN, Passwords)
    sensitive_kws = ['otp', 'pin', 'cvv', 'password', 'passcode', 'upi pin',
                     'atm pin', 'net banking', 'internet banking password',
                     'ഒടിപി', 'പിൻ', 'പാസ്‌വേഡ്']
    if any(kw in text_lower for kw in sensitive_kws):
        score += 3
        triggers.append({
            "en": "Requests confidential banking credentials: OTP, PIN, CVV, or password.",
            "ml": "OTP, PIN, CVV അല്ലെങ്കിൽ പാസ്‌വേഡ് പോലുള്ള രഹസ്യ വിവരങ്ങൾ ചോദിക്കുന്നു — ആർക്കും പങ്കുവെക്കരുത്."
        })

    # 2. Suspicious URLs / Shorteners / Unofficial Domains
    url_pattern = re.compile(
        r'(https?://[^\s]+|www\.[^\s]+|'
        r'bit\.ly/[^\s]+|tinyurl\.com/[^\s]+|t\.co/[^\s]+|cutt\.ly/[^\s]+|'
        r'[a-zA-Z0-9\-]+\.(xyz|online|top|site|club|link|info|live|buzz|shop|click|tk|ml|apk)[^\s]*)',
        re.IGNORECASE
    )
    url_matches = url_pattern.findall(text)
    urls_flat = [m[0] if isinstance(m, tuple) else m for m in url_matches if m]
    if urls_flat:
        is_gov = any('.gov.in' in u.lower() or '.nic.in' in u.lower() for u in urls_flat)
        if not is_gov:
            score += 3
            sample_url = urls_flat[0][:75]
            triggers.append({
                "en": f"Contains suspicious link: {sample_url}. Legitimate Indian banks do not send shortened links via SMS.",
                "ml": f"സംശയകരമായ ലിങ്ക് അടങ്ങിയിരിക്കുന്നു ({sample_url}). ഔദ്യോഗിക ബാങ്കുകൾ ഇത്തരം ലിങ്കുകൾ അയക്കില്ല."
            })

    # 3. APK Downloads / Malware Installation
    if re.search(r'\.apk\b', text_lower) or 'install app' in text_lower or 'download file' in text_lower:
        score += 3
        triggers.append({
            "en": "Prompts downloading an APK file or third-party app — extreme risk of Android banking malware.",
            "ml": "APK ഫയൽ അല്ലെങ്കിൽ അജ്ഞാത ആപ്പ് ഡൗൺലോഡ് ചെയ്യാൻ ആവശ്യപ്പെടുന്നു — ഫോൺ ഹാക്ക് ആകാൻ സാധ്യത."
        })

    # 4. WhatsApp Emergency & Impersonation Specifics
    if category in ["whatsapp", "general"]:
        impersonation_kws = [
            "lost my phone", "changed my number", "new sim", "this is my new number",
            "hospital", "emergency", "accident", "urgent surgery", "urgent fee",
            "don't call my old number", "don't tell dad", "in trouble", "police custody",
            "ഫോൺ നഷ്ടപ്പെട്ടു", "പുതിയ നമ്പർ", "ആശുപത്രി", "അപകടം", "അടിയന്തരം", "പണം വേണം"
        ]
        found_imp = [kw for kw in impersonation_kws if kw in text_lower]
        if found_imp:
            score += 3
            triggers.append({
                "en": f"Family Emergency / Friend Impersonation Signature Detected ({', '.join(found_imp[:3])}). Scammers pretend to be relatives in distress.",
                "ml": f"കുടുംബാംഗത്തെ അനുകരിച്ചുള്ള വ്യാജ അടിയന്തരാവസ്ഥ ({', '.join(found_imp[:3])}). ബന്ധുവാണെന്ന് നടിച്ച് പണം തട്ടുന്ന തന്ത്രമാണിത്."
            })

    # 5. Bank & KYC Specific Threats
    if category in ["bank", "general"]:
        kyc_threats = [
            'kyc expired', 'account blocked', 'account will be blocked', 'pan card', 'aadhaar',
            'reactivate', 'deactivated within 2 hours', 'within 24 hours', 'electricity bill',
            'kseb', 'power will be disconnected', 'അക്കൗണ്ട് ബ്ലോക്ക്', 'കെ.വൈ.സി', 'വൈദ്യുതി വിച്ഛേദിക്കും'
        ]
        found_kyc = [kw for kw in kyc_threats if kw in text_lower]
        if found_kyc:
            score += 2
            triggers.append({
                "en": f"Coercive KYC / Account Blocking Threat ({', '.join(found_kyc[:2])}). Official banks provide branch visits and long grace periods.",
                "ml": f"അക്കൗണ്ട് മരവിപ്പിക്കൽ / KYC ഭീഷണി ({', '.join(found_kyc[:2])}). ഭയപ്പെടുത്തി ഉടൻ നടപടിയെടുപ്പിക്കാനുള്ള തന്ത്രം."
            })
        if bank_name:
            triggers.append({
                "en": f"Context specified for {bank_name}. Note: Verify alerts only via official {bank_name} net banking app or passbook contact numbers.",
                "ml": f"{bank_name} ബാങ്ക് വിവരങ്ങൾ: നിങ്ങളുടെ ബാങ്ക് ശാഖയിലോ ഔദ്യോഗിക ആപ്പിലോ നേരിട്ട് ബന്ധപ്പെടുക."
            })

    # 6. Call Back to Private Mobile Numbers
    phone_match = re.search(r'(\+91\s?)?[6-9]\d{9}', text)
    if phone_match and any(w in text_lower for w in ['call', 'contact', 'reach', 'helpline', 'ബന്ധപ്പെടുക', 'വിളിക്കുക']):
        score += 1
        triggers.append({
            "en": f"Requests call back to private personal mobile: {phone_match.group()}.",
            "ml": f"വ്യക്തിഗത മൊബൈൽ നമ്പറിലേക്ക് വിളിക്കാൻ ആവശ്യപ്പെടുന്നു: {phone_match.group()}."
        })

    # 7. High-Pressure Fear Words
    fear_kws = ['immediately', 'urgent', 'arrest', 'warrant', 'police', 'customs', 'digital arrest', 'jail', 'court',
                'ഉടൻ', 'അടിയന്തരം', 'അറസ്റ്റ്', 'പോലീസ്', 'ജയിൽ']
    found_fear = [w for w in fear_kws if w in text_lower]
    if found_fear:
        score += 2
        triggers.append({
            "en": f"High Urgency and Intimidation Phrasing: {', '.join(found_fear[:3])}.",
            "ml": f"തിടുക്കവും ഭയവും ഉളവാക്കുന്ന വാക്കുകൾ: {', '.join(found_fear[:3])}."
        })

    level = risk_label(score)

    return jsonify({
        "risk_level": level,
        "score": score,
        "triggers": triggers,
        "category": category,
        "recommendations": get_recommendations(level),
        "disclaimer": "Local heuristic analysis only. Always independently verify messages through trusted phone contacts or official branch visits."
    })


# ==============================================================================
# Endpoint 4: Fake Link & APK Scam Detector
# ==============================================================================
@app.route("/api/analyze-url", methods=["POST"])
def analyze_url():
    """
    Analyzes URLs for phishing, spoofing, deceptive subdomains, and APK links.
    Never opens or visits the URL.
    """
    data = request.get_json(silent=True) or {}
    url = sanitize_text(data.get("url", ""), max_len=600).strip()

    if not url:
        return jsonify({"error": "empty_input", "message": "No URL provided"}), 400

    # Protocol prefix normalization
    if not re.match(r'^https?://', url, re.IGNORECASE):
        if re.match(r'^[a-zA-Z0-9]', url):
            url = "http://" + url
        else:
            return jsonify({"error": "invalid_url", "message": "Invalid URL format"}), 400

    triggers = []
    score = 0

    try:
        parsed = urlparse(url)
        full_domain = parsed.netloc.lower()
        path = parsed.path.lower()
        query = parsed.query.lower()
    except Exception:
        return jsonify({"error": "parse_error", "message": "Could not parse URL"}), 400

    # 1. Suspicious TLDs
    suspicious_tlds = [
        '.xyz', '.top', '.online', '.site', '.club', '.link', '.tk', '.ml', '.ga',
        '.gq', '.cf', '.live', '.buzz', '.shop', '.click', '.download', '.pw',
        '.cc', '.su', '.info', '.biz', '.mobi', '.work', '.icu', '.monster'
    ]
    for tld in suspicious_tlds:
        if full_domain.endswith(tld):
            score += 2
            triggers.append({
                "en": f"Suspicious Top-Level Domain suffix '{tld}' — heavily abused in phishing campaigns.",
                "ml": f"സംശയകരമായ ഡൊമൈൻ വാലറ്റം '{tld}' — വ്യാജ സൈറ്റുകളിൽ വ്യാപകമായി ഉപയോഗിക്കുന്നു."
            })
            break

    # 2. URL Shorteners
    shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'is.gd', 'buff.ly', 'rb.gy']
    if any(sh in full_domain for sh in shorteners):
        score += 2
        triggers.append({
            "en": "Shortened URL masking real target destination. Never enter banking credentials via shortened links.",
            "ml": "ഷോർട്ട് ലിങ്ക് — യഥാർത്ഥ വെബ്‌സൈറ്റ് വിലാസം മറച്ചിരിക്കുന്നു. ബാങ്കിംഗ് വിവരങ്ങൾ ഇതിൽ നൽകരുത്."
        })

    # 3. Direct IP Address Host
    if re.match(r'^(\d{1,3}\.){3}\d{1,3}', full_domain):
        score += 3
        triggers.append({
            "en": "URL uses a raw IP address instead of a legitimate registered domain name.",
            "ml": "ഡൊമൈൻ പേരിന് പകരം നേരിട്ടുള്ള IP വിലാസമാണ് നൽകിയിരിക്കുന്നത് — തട്ടിപ്പ് സാധ്യത വളരെ കൂടുതൽ."
        })

    # 4. APK File Download
    if '.apk' in path or '.apk' in query:
        score += 3
        triggers.append({
            "en": "Direct APK Android package download detected — high risk of installing mobile banking spyware.",
            "ml": "നേരിട്ടുള്ള APK ഫയൽ ഡൗൺലോഡ് ലിങ്ക് — ഫോൺ നിയന്ത്രിക്കുന്ന സ്പൈവെയർ ആകാം."
        })

    # 5. Brand Spoofing (SBI, HDFC, UIDAI, etc. without official domain)
    brands = ['sbi', 'hdfc', 'icici', 'axis', 'kotak', 'pnb', 'uidai', 'aadhaar', 'npci', 'rbi', 'pmkisan', 'kseb', 'indiapost']
    for brand in brands:
        if brand in full_domain and not (full_domain.endswith('.gov.in') or full_domain.endswith('.nic.in') or full_domain.endswith('.sbi') or full_domain.endswith('.co.in')):
            score += 3
            triggers.append({
                "en": f"Brand Spoofing: Contains '{brand}' in domain but is NOT the genuine bank or government institution.",
                "ml": f"വ്യാജ ബ്രാൻഡ് ഡൊമൈൻ: '{brand}' പേരുണ്ടെങ്കിലും ഔദ്യോഗിക ബാങ്ക്/സർക്കാർ സൈറ്റല്ല."
            })
            break

    # 6. Clickbait Keywords in Query/Path
    bait_words = ['free', 'win', 'reward', 'cashback', 'subsidy', 'prize', 'gift', 'recharge']
    found_bait = [w for w in bait_words if w in path or w in query]
    if found_bait:
        score += 1
        triggers.append({
            "en": f"Clickbait lure keywords in link: {', '.join(found_bait[:2])}.",
            "ml": f"ആകർഷകമായ ഓഫർ വാക്കുകൾ ലിങ്കിലുണ്ട്: {', '.join(found_bait[:2])}."
        })

    # Trusted Government or Well-Known Domains
    is_trusted = (
        full_domain.endswith('.gov.in') or full_domain.endswith('.nic.in') or
        full_domain in ['sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com', 'cybercrime.gov.in']
    )
    if is_trusted:
        score = 0
        triggers = [{
            "en": "Domain belongs to a verified official government (.gov.in) or genuine institutional domain.",
            "ml": "ഇത് ഔദ്യോഗിക സർക്കാർ (.gov.in) അല്ലെങ്കിൽ അംഗീകൃത സ്ഥാപനത്തിന്റെ ഡൊമൈനാണ്."
        }]

    level = risk_label(score)

    return jsonify({
        "url": url,
        "domain": full_domain,
        "risk_level": level,
        "score": score,
        "triggers": triggers,
        "is_trusted": is_trusted,
        "recommendations": get_recommendations(level),
        "disclaimer": "LOCAL heuristic analysis only. No automated network connections or downloads were made."
    })


# ==============================================================================
# Endpoint 5: Fake Profile & Impersonation Detector
# ==============================================================================
@app.route("/api/analyze-profile", methods=["POST"])
def analyze_profile():
    """
    Analyzes profile text, username inconsistencies, and impersonation claims.
    Clearly notes lack of external social media verification API.
    """
    data = request.get_json(silent=True) or {}
    profile_name = sanitize_text(data.get("profile_name", ""), max_len=100)
    username = sanitize_text(data.get("username", ""), max_len=100)
    platform = sanitize_text(data.get("platform", "Unknown"), max_len=50)
    message = sanitize_text(data.get("message", ""), max_len=3000)
    has_photo = bool(data.get("has_photo", False))

    if not profile_name and not username and not message:
        return jsonify({"error": "empty_input", "message": "Please provide profile details or message text"}), 400

    triggers = []
    score = 0
    msg_lower = message.lower()

    # 1. Money Demands & Financial Urgency in Profile Messages
    money_terms = ['send money', 'borrow', 'google pay', 'phonepe', 'transfer', 'gpay', 'emergency help', '₹', 'rs',
                   'need money', 'accident', 'hospital', 'പണം അയക്കൂ', 'സഹായം വേണം', 'ഗൂഗിൾ പേ']
    found_money = [m for m in money_terms if m in msg_lower]
    if found_money:
        score += 3
        triggers.append({
            "en": f"Direct Money Request in Chat ({', '.join(found_money[:2])}): High sign of account cloning or impersonation.",
            "ml": f"സന്ദേശത്തിൽ നേരിട്ട് പണം ആവശ്യപ്പെടുന്നു ({', '.join(found_money[:2])}): വ്യാജ പ്രൊഫൈൽ തട്ടിപ്പുകളുടെ പ്രധാന ലക്ഷണം."
        })

    # 2. Inconsistency between Profile Display Name and Username
    if profile_name and username:
        # Check if username contains excessive trailing random digits or unrelated keywords
        if re.search(r'\d{4,}$', username) and not re.search(r'\d', profile_name):
            score += 1
            triggers.append({
                "en": f"Suspicious Username Structure: '{username}' uses random auto-generated numbers differing from display name '{profile_name}'.",
                "ml": f"സംശയകരമായ യൂസർനെയിം: '{username}' യഥാർത്ഥ പേരിൽ നിന്ന് വ്യത്യസ്തമായി റാൻഡം നമ്പറുകൾ ഉൾക്കൊള്ളുന്നു."
            })

    # 3. New Account or Lost Access Excuses
    excuse_kws = ['old account hacked', 'lost access', 'new profile', 'add me here', 'new instagram', 'new facebook',
                  'പഴയ അക്കൗണ്ട് ഹാക്ക് ആയി', 'പുതിയ പ്രൊഫൈൽ']
    found_excuse = [e for e in excuse_kws if e in msg_lower]
    if found_excuse:
        score += 2
        triggers.append({
            "en": "Claims of hacked old profile or emergency duplicate account.",
            "ml": "പഴയ അക്കൗണ്ട് നഷ്ടപ്പെട്ടെന്നോ ഹാക്ക് ആയെന്നോ ഉള്ള അവകാശവാദം."
        })

    # 4. Crypto / Investment / Work-from-Home Bait
    bait_kws = ['crypto', 'investment', 'daily profit', 'part time job', 'telegram task', 'easy earnings']
    found_bait = [b for b in bait_kws if b in msg_lower]
    if found_bait:
        score += 3
        triggers.append({
            "en": f"Investment / Task Bait Detected ({', '.join(found_bait[:2])}).",
            "ml": f"വ്യാജ നിക്ഷേപം / പാർട്ട് ടൈം ജോലി വാഗ്ദാനം ({', '.join(found_bait[:2])})."
        })

    level = risk_label(score)

    return jsonify({
        "risk_level": level,
        "score": score,
        "triggers": triggers,
        "platform": platform,
        "has_photo": has_photo,
        "recommendations": [
            "Call your friend/contact directly on their verified phone number to verify their identity before sending anything.",
            "Do NOT share private photos, financial information, or OTPs.",
            "Report the profile directly to the social media platform as 'Impersonation'."
        ] if level != "LOW" else [
            "Always verify identity directly before sending any funds.",
            "Remember that absence of detected patterns does NOT confirm genuine identity."
        ],
        "disclaimer": "LIMITATION NOTICE: This tool analyzes text patterns locally. No external social media verification or reverse-image database is connected. Never assume a profile is genuine solely because no warning signs were found."
    })


@app.route("/api/compare-profiles", methods=["POST"])
def compare_profiles():
    """
    Performs safe local heuristic comparison between two uploaded profile entries
    (e.g., known profile vs suspected fake profile).
    """
    data = request.get_json(silent=True) or {}
    p1 = data.get("profile1", {})
    p2 = data.get("profile2", {})

    name1 = sanitize_text(p1.get("name", ""), max_len=100)
    name2 = sanitize_text(p2.get("name", ""), max_len=100)
    handle1 = sanitize_text(p1.get("handle", ""), max_len=100)
    handle2 = sanitize_text(p2.get("handle", ""), max_len=100)

    similarity_notes = []
    risk_score = 0

    if name1 and name2:
        if name1.lower() == name2.lower() and handle1.lower() != handle2.lower():
            risk_score += 3
            similarity_notes.append({
                "en": f"Name match with mismatched handle: Both use '{name1}', but handle differs ('{handle1}' vs '{handle2}'). Classic clone profile pattern.",
                "ml": f"പേര് ഒന്നാണെങ്കിലും യൂസർ ഹാൻഡിൽ വ്യത്യസ്തമാണ്: ('{handle1}' vs '{handle2}'). വ്യാജ ക്ലോൺ അക്കൗണ്ടുകളുടെ പ്രത്യേകത."
            })

    level = risk_label(risk_score)

    return jsonify({
        "comparison_result": "completed",
        "risk_level": level,
        "notes": similarity_notes,
        "disclaimer": "Local comparison notice: This does not verify social media database ownership. Visual similarity or duplicate names should be verified via personal phone call."
    })


# ==============================================================================
# Endpoint 6: Digital Arrest & Fake Police Call Detector
# ==============================================================================
@app.route("/api/analyze-digital-arrest", methods=["POST"])
def analyze_digital_arrest():
    """
    Analyzes call transcripts or user notes about suspicious enforcement calls:
    - Threats of immediate arrest or fake court warrants
    - Coercion to remain on WhatsApp/Skype video calls ('Digital Arrest')
    - Demands for security deposits or fund verification to RBI accounts
    """
    data = request.get_json(silent=True) or {}
    transcript = sanitize_text(data.get("transcript", ""), max_len=5000)
    department = sanitize_text(data.get("department", "Unknown"), max_len=100)
    reason = sanitize_text(data.get("reason", "Unknown"), max_len=200)

    if not transcript and department == "Unknown" and reason == "Unknown":
        return jsonify({"error": "empty_input", "message": "Please provide call notes or claimed department"}), 400

    combined_text = f"{transcript} {department} {reason}".lower()
    triggers = []
    score = 0

    # 1. Enforcement Impersonation
    dept_kws = ['cbi', 'ed officer', 'enforcement directorate', 'narcotics', 'ncb', 'customs',
                'cyber crime police', 'mumbai police', 'delhi police', 'trai', 'supreme court',
                'പോലീസ്', 'ക്രൈം ബ്രാഞ്ച്', 'കസ്റ്റംസ്', 'സിബിഐ']
    found_dept = [d for d in dept_kws if d in combined_text]
    if found_dept:
        score += 3
        triggers.append({
            "en": f"Law Enforcement Agency Claimed ({', '.join(found_dept[:2])}): Indian Police and investigative agencies NEVER contact citizens via WhatsApp/video to settle legal issues.",
            "ml": f"പോലീസ് / അന്വേഷണ ഏജൻസി അവകാശവാദം ({', '.join(found_dept[:2])}): ഇന്ത്യൻ പോലീസ് ഒരിക്കലും വാട്സ്ആപ്പ് വഴി വിളിച്ച് അറസ്റ്റ് ഭീഷണി മുഴക്കില്ല."
        })

    # 2. Digital Detention / Video Call Coercion
    video_kws = ['digital arrest', 'stay on video', 'remain on call', 'do not disconnect', 'keep camera on',
                 'seclusion', 'isolated room', 'do not tell family', 'ഡിജിറ്റൽ അറസ്റ്റ്', 'ഫോൺ വെക്കരുത്', 'ക്യാമറ ഓഫ് ചെയ്യരുത്']
    found_video = [v for v in video_kws if v in combined_text]
    if found_video:
        score += 3
        triggers.append({
            "en": "Digital Arrest / Continuous Video Call Coercion: THERE IS NO SUCH THING AS A DIGITAL ARREST UNDER INDIAN LAW. This is 100% extortion.",
            "ml": "ഡിജിറ്റൽ അറസ്റ്റ് / ക്യാമറ ഓൺ ചെയ്ത് വെക്കാനുള്ള നിർബന്ധം: ഇന്ത്യൻ നിയമത്തിൽ 'ഡിജിറ്റൽ അറസ്റ്റ്' എന്ന ഒന്നില്ല! ഇത് 100% തട്ടിപ്പാണ്."
        })

    # 3. Illegal Parcel / Contraband Allegations
    allegation_kws = ['parcel', 'drugs', 'mdma', 'passport seized', 'customs clearance', 'taiwan parcel',
                      'money laundering', 'sim card illegal use', 'പാർസൽ', 'ലഹരിമരുന്ന്', 'കള്ളപ്പണം']
    found_allegation = [a for a in allegation_kws if a in combined_text]
    if found_allegation:
        score += 2
        triggers.append({
            "en": f"Fabricated Crime Allegation ({', '.join(found_allegation[:2])}): Scammers manufacture fear about illegal parcels in your name.",
            "ml": f"വ്യാജ കുറ്റാരോപണം ({', '.join(found_allegation[:2])}): നിങ്ങളുടെ പേരിൽ മയക്കുമരുന്ന് പാർസൽ ഉണ്ടെന്ന് കള്ളം പറഞ്ഞ് ഭയപ്പെടുത്തുന്നു."
        })

    # 4. Financial Extortion (Verification Deposit, Clearing Charges)
    extortion_kws = ['transfer to rbi account', 'verification account', 'security deposit', 'bail money',
                     'pay fine', 'avoid arrest', 'പണം അടക്കുക', 'അക്കൗണ്ടിലേക്ക് അയക്കുക']
    found_extortion = [e for e in extortion_kws if e in combined_text]
    if found_extortion:
        score += 3
        triggers.append({
            "en": "Demand for Money to Avoid Arrest: Government officers NEVER demand funds to 'verify innocence' or clear warrants.",
            "ml": "അറസ്റ്റ് ഒഴിവാക്കാൻ പണം ആവശ്യപ്പെടുന്നു: ഔദ്യോഗിക ഏജൻസികൾ ഒരിക്കലും പണം നൽകാൻ ആവശ്യപ്പെടില്ല."
        })

    level = risk_label(score)

    return jsonify({
        "risk_level": level,
        "score": score,
        "department_claimed": department,
        "triggers": triggers,
        "law_enforcement_truth": "Under the Indian Penal Code and Bharatiya Nagarik Suraksha Sanhita (BNSS), Indian Police, CBI, ED, and Customs NEVER arrest citizens over video calls or demand monetary clearance fees.",
        "recommendations": {
            "en": [
                "DISCONNECT the call immediately. Do not be intimidated.",
                "DO NOT send money or provide bank credentials under any pretext.",
                "Call 1930 National Cyber Crime Helpline or visit your nearest local police station.",
                "Inform a trusted family member, neighbor, or friend immediately."
            ],
            "ml": [
                "ഫോൺ കോൾ ഉടൻ കട്ട് ചെയ്യുക. ഭയപ്പെടേണ്ടതില്ല.",
                "ഒരു കാരണവശാലും പണം അയക്കുകയോ ബാങ്ക് വിവരങ്ങൾ നൽകുകയോ ചെയ്യരുത്.",
                "1930 ദേശീയ സൈബർ ക്രൈം ഹെൽപ്‌ലൈനിൽ വിളിക്കുക അല്ലെങ്കിൽ അടുത്തുള്ള പോലീസ് സ്റ്റേഷനിൽ അറിയിക്കുക.",
                "കുടുംബാംഗങ്ങളോടോ സുഹൃത്തുക്കളോടോ ഉടൻ വിവരം പറയുക."
            ]
        },
        "disclaimer": "Safety reminder: Never keep yourself isolated when receiving threatening calls. Always talk to family or trusted advisors."
    })


# ==============================================================================
# Frontend Static Asset & Root Route Serving
# ==============================================================================
@app.route("/", methods=["GET"])
@app.route("/index.html", methods=["GET"])
def serve_index():
    """Serve the CyberKiosk frontend homepage at http://127.0.0.1:5000/"""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>", methods=["GET"])
def serve_static(filename):
    """Serve static frontend assets (CSS, JS, images, audio, etc.)."""
    # Safeguard: API routes should never fall through here
    if filename.startswith("api/"):
        return jsonify({"error": "not_found", "message": "API endpoint not found"}), 404
    file_path = os.path.join(BASE_DIR, filename)
    # Prevent path traversal outside BASE_DIR
    if not os.path.abspath(file_path).startswith(os.path.abspath(BASE_DIR)):
        return jsonify({"error": "forbidden"}), 403
    if os.path.isfile(file_path):
        return send_from_directory(BASE_DIR, filename)
    return jsonify({"error": "not_found", "message": f"Resource '{filename}' not found"}), 404


if __name__ == "__main__":
    print("=" * 65)
    print("  CyberKiosk AI Server (v2.0)  ->  http://127.0.0.1:5000")
    print("  Frontend UI & All Detectors  ->  http://127.0.0.1:5000/")
    print("  All 6 Scam APIs Active       ->  http://127.0.0.1:5000/api/*")
    print("=" * 65)
    app.run(host="127.0.0.1", port=5000, debug=False)
