/**
 * CyberKiosk AI - Core Application Logic (v2.0)
 * Senior-Friendly Bilingual UI, 6 Interactive Scam Detectors,
 * Local QR Decoding, Client-Side OCR, Speech Dictation & Voice Assistant
 */

let currentLang = 'en';
let fontScale = 1.0;
let synth = window.speechSynthesis;
let currentUtterance = null;
let speechRecognizer = null;
let isDictating = false;

// Active Category Tab: 'upi', 'whatsapp', 'fakelink', 'bank', 'fakeaccount', 'fakecall'
let activeCategory = 'upi';

// Stored Uploaded Files State
const uploadedFiles = {
  qr: null,
  whatsapp: null,
  bank: null,
  profile: null,
  origProfile: null,
  audio: null
};

// Backend Base URL: If served directly from Flask on port 5000, use relative path ""; otherwise fallback to http://127.0.0.1:5000
const BACKEND_URL = (typeof window !== 'undefined' && window.location && window.location.port === '5000') 
  ? '' 
  : 'http://127.0.0.1:5000';

// ==============================================================================
// 1. Initialization
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initFontScaler();
  renderScamCategories();
  initDragAndDropZones();
  updateUIStrings();
});

// ==============================================================================
// 2. Language Switcher & UI Localization
// ==============================================================================
function initLanguageSwitcher() {
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ml' : 'en';
      stopAudio();
      updateUIStrings();
      renderScamCategories();
    });
  }
}

function updateUIStrings() {
  const dict = translations[currentLang];
  if (!dict) return;

  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update dynamic placeholders
  const upiInput = document.getElementById('upiInput');
  if (upiInput && dict.manualUpiPlaceholder) upiInput.placeholder = dict.manualUpiPlaceholder;

  const waInput = document.getElementById('waMessageInput');
  if (waInput && dict.waTextPlaceholder) waInput.placeholder = dict.waTextPlaceholder;

  const linkInput = document.getElementById('linkInput');
  if (linkInput && dict.linkInputPlaceholder) linkInput.placeholder = dict.linkInputPlaceholder;

  const bankInput = document.getElementById('bankInput');
  if (bankInput && dict.bankInputPlaceholder) bankInput.placeholder = dict.bankInputPlaceholder;

  const profMsgInput = document.getElementById('profileMessageInput');
  if (profMsgInput && dict.profileMsgPlaceholder) profMsgInput.placeholder = dict.profileMsgPlaceholder;

  const arrestInput = document.getElementById('arrestTranscriptInput');
  if (arrestInput && dict.arrestTranscriptPlaceholder) arrestInput.placeholder = dict.arrestTranscriptPlaceholder;

  // Update Language Button Text
  const langBtnText = document.getElementById('langBtnText');
  if (langBtnText) {
    langBtnText.textContent = dict.langText;
  }
}

// ==============================================================================
// 3. Accessibility: Font Scaler
// ==============================================================================
function initFontScaler() {
  const btnDecrease = document.getElementById('btnFontDecrease');
  const btnIncrease = document.getElementById('btnFontIncrease');
  const btnReset = document.getElementById('btnFontReset');

  if (btnDecrease) btnDecrease.addEventListener('click', () => adjustFont(-0.1));
  if (btnIncrease) btnIncrease.addEventListener('click', () => adjustFont(0.1));
  if (btnReset) btnReset.addEventListener('click', () => setFontScale(1.0));
}

function adjustFont(delta) {
  fontScale = Math.min(Math.max(fontScale + delta, 0.85), 1.4);
  document.documentElement.style.setProperty('--font-scale', fontScale);
}

function setFontScale(scale) {
  fontScale = scale;
  document.documentElement.style.setProperty('--font-scale', fontScale);
}

// ==============================================================================
// 4. Text-To-Speech (Voice Assistant)
// ==============================================================================
function speakText(text) {
  if (!synth) {
    alert(currentLang === 'ml' ? "ഈ ബ്രൗസറിൽ ഓഡിയോ വോയ്‌സ് ലഭ്യമല്ല." : "Audio playback is not supported on this browser.");
    return;
  }
  stopAudio();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = currentLang === 'ml' ? 'ml-IN' : 'en-IN';
  currentUtterance.rate = 0.9;

  const speakBtn = document.getElementById('speakPageBtn');
  if (speakBtn) {
    speakBtn.classList.add('playing');
    speakBtn.innerHTML = `<span class="icon">⏹️</span> <span>${translations[currentLang].stopAudio}</span>`;
  }

  currentUtterance.onend = resetSpeakBtn;
  currentUtterance.onerror = resetSpeakBtn;

  synth.speak(currentUtterance);
}

function stopAudio() {
  if (synth && synth.speaking) {
    synth.cancel();
  }
  resetSpeakBtn();
}

function resetSpeakBtn() {
  const speakBtn = document.getElementById('speakPageBtn');
  if (speakBtn) {
    speakBtn.classList.remove('playing');
    speakBtn.innerHTML = `<span class="icon">🔊</span> <span>${translations[currentLang].readAloud}</span>`;
  }
}

function toggleVoiceGuide() {
  if (synth && synth.speaking) {
    stopAudio();
  } else {
    const activeModal = document.getElementById('scamModal');
    let textToRead = "";
    
    if (activeModal && !activeModal.classList.contains('hidden')) {
      const title = document.getElementById('modalTitle').innerText;
      const body = document.getElementById('modalBody').innerText;
      textToRead = `${title}. ${body}`;
    } else {
      const heroTitle = document.getElementById('heroTitleText') ? document.getElementById('heroTitleText').innerText : "";
      const heroDesc = document.getElementById('heroDescText') ? document.getElementById('heroDescText').innerText : "";
      textToRead = `${heroTitle}. ${heroDesc}. ${translations[currentLang].categoriesTitle}.`;
    }
    speakText(textToRead);
  }
}

// ==============================================================================
// 5. Scam Category Cards & Guide Modal
// ==============================================================================
function renderScamCategories() {
  const container = document.getElementById('scamGridContainer');
  if (!container) return;

  const scamsDict = translations[currentLang].scams;
  container.innerHTML = "";

  Object.keys(scamsDict).forEach(key => {
    const item = scamsDict[key];
    const card = document.createElement('div');
    card.className = 'scam-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${item.title}`);
    
    card.innerHTML = `
      <div class="scam-card-header">
        <span class="scam-icon" aria-hidden="true">${item.icon}</span>
        <span class="scam-badge">${item.badge}</span>
      </div>
      <h3 class="scam-card-title">${item.title}</h3>
      <p class="scam-card-summary">${item.summary}</p>
      <div class="card-actions-row">
        <button class="btn btn-secondary btn-sm" onclick="openScamModal('${key}')">
          <span>🔍</span> <span>${translations[currentLang].viewGuide}</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="openDetectorCategory('${key}')">
          <span>${translations[currentLang].testDetectBtn}</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function openScamModal(scamKey) {
  const dict = translations[currentLang];
  const item = dict.scams[scamKey];
  if (!item) return;

  const modal = document.getElementById('scamModal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');

  titleEl.innerHTML = `${item.icon} ${item.title}`;

  let whatToDoListHTML = item.whatToDo.map(point => `<li>✅ ${point}</li>`).join('');
  let whatNotToDoListHTML = item.whatNotToDo.map(point => `<li>❌ ${point}</li>`).join('');

  bodyEl.innerHTML = `
    <div class="modal-section">
      <h4>❓ ${dict.modalHappened}</h4>
      <p>${item.whatHappened}</p>
    </div>
    
    <div class="modal-section warning-box">
      <h4>⚠️ ${dict.modalDangerous}</h4>
      <p>${item.whyDangerous}</p>
    </div>

    <div class="modal-grid">
      <div class="modal-section do-box">
        <h4>✅ ${dict.modalToDo}</h4>
        <ul>${whatToDoListHTML}</ul>
      </div>
      <div class="modal-section dont-box">
        <h4>❌ ${dict.modalNotToDo}</h4>
        <ul>${whatNotToDoListHTML}</ul>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const readModalBtn = document.getElementById('modalSpeakBtn');
  if (readModalBtn) {
    readModalBtn.onclick = () => {
      const text = `${item.title}. ${dict.modalHappened}: ${item.whatHappened}. ${dict.modalDangerous}: ${item.whyDangerous}. ${dict.modalToDo}: ${item.whatToDo.join('. ')}`;
      speakText(text);
    };
  }
}

function closeScamModal() {
  const modal = document.getElementById('scamModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    stopAudio();
  }
}

// Quick jump from card button to detector tab
function openDetectorCategory(key) {
  switchDetectorTab(key);
  const checkerSection = document.getElementById('messageChecker');
  if (checkerSection) {
    checkerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==============================================================================
// 6. Category Tab Switching
// ==============================================================================
function switchDetectorTab(categoryKey) {
  activeCategory = categoryKey;
  stopAudio();

  const tabKeys = ['upi', 'whatsapp', 'fakelink', 'bank', 'fakeaccount', 'fakecall'];
  
  tabKeys.forEach(key => {
    const tabBtn = document.getElementById(`tabBtn${capitalize(key)}`);
    const panel = document.getElementById(`panel${capitalize(key)}`);
    
    if (tabBtn) {
      if (key === categoryKey) {
        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');
      } else {
        tabBtn.classList.remove('active');
        tabBtn.setAttribute('aria-selected', 'false');
      }
    }

    if (panel) {
      if (key === categoryKey) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  });

  // Hide the previous result box on tab switch
  const resultBox = document.getElementById('resultBox');
  if (resultBox) resultBox.classList.add('hidden');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==============================================================================
// 7. Drag-and-Drop & File Upload Handlers
// ==============================================================================
function initDragAndDropZones() {
  setupFileZone('qrDropZone', 'qrFileInput', handleQrFileSelect);
  setupFileZone('waDropZone', 'waFileInput', handleWaFileSelect);
  setupFileZone('bankDropZone', 'bankFileInput', handleBankFileSelect);
  setupFileZone('profileDropZone', 'profileFileInput', handleProfileFileSelect);
  setupFileZone('origProfileDropZone', 'origProfileFileInput', handleOrigProfileFileSelect);
  setupFileZone('audioDropZone', 'audioFileInput', handleAudioFileSelect);
}

function setupFileZone(zoneId, inputId, handler) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handler(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handler(e.target.files[0]);
    }
  });
}

function validateFile(file, allowedTypes, maxSizeMB) {
  if (!allowedTypes.includes(file.type)) {
    const msg = currentLang === 'ml' 
      ? `സാധുതയില്ലാത്ത ഫയൽ ടൈപ്പ്. അനുമതിയുള്ള ഫോർമാറ്റുകൾ: ${allowedTypes.join(', ')}`
      : `Invalid file format. Allowed types: ${allowedTypes.join(', ')}`;
    alert(msg);
    return false;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    const msg = currentLang === 'ml'
      ? `ഫയൽ വലിപ്പം വളരെ വലുതാണ്. പരമാവധി അനുവദനീയമായ വലിപ്പം: ${maxSizeMB}MB`
      : `File size exceeds the limit of ${maxSizeMB}MB.`;
    alert(msg);
    return false;
  }
  return true;
}

// ==============================================================================
// 8. Category 1: UPI & QR Code Scam Detector
// ==============================================================================
function handleQrFileSelect(file) {
  if (!validateFile(file, ['image/png', 'image/jpeg', 'image/jpg'], 5)) return;
  uploadedFiles.qr = file;

  const previewContainer = document.getElementById('qrPreviewContainer');
  const previewImg = document.getElementById('qrPreviewImg');
  const fileNameEl = document.getElementById('qrFileName');
  const statusBadge = document.getElementById('qrStatusBadge');

  fileNameEl.textContent = file.name;
  statusBadge.textContent = currentLang === 'ml' ? "ഡീകോഡ് ചെയ്യുന്നു..." : "Decoding...";
  statusBadge.className = "status-chip";

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.remove('hidden');
    // Decode locally
    decodeQrCodeFromImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function removeQrImage() {
  uploadedFiles.qr = null;
  document.getElementById('qrFileInput').value = '';
  document.getElementById('qrPreviewContainer').classList.add('hidden');
  document.getElementById('qrPreviewImg').src = '';
  document.getElementById('upiInput').value = '';
}

function decodeQrCodeFromImage(dataUrl) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    let decodedResult = null;

    // Method 1: Local jsQR library
    if (window.jsQR) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });
        if (code && code.data) {
          decodedResult = code.data;
        }
      } catch (err) {
        console.warn("jsQR decode error:", err);
      }
    }

    // Method 2: Browser native BarcodeDetector if available
    if (!decodedResult && window.BarcodeDetector) {
      const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
      barcodeDetector.detect(img)
        .then(barcodes => {
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            handleDecodedQrText(barcodes[0].rawValue);
          } else {
            handleFailedQrDecode();
          }
        })
        .catch(() => handleFailedQrDecode());
      return;
    }

    if (decodedResult) {
      handleDecodedQrText(decodedResult);
    } else {
      handleFailedQrDecode();
    }
  };
  img.src = dataUrl;
}

function handleDecodedQrText(text) {
  const statusBadge = document.getElementById('qrStatusBadge');
  const upiInput = document.getElementById('upiInput');
  statusBadge.textContent = currentLang === 'ml' ? "വിജയകരമായി ഡീകോഡ് ചെയ്തു ✅" : "Decoded Successfully ✅";
  statusBadge.className = "status-chip status-safe";
  upiInput.value = text;
}

function handleFailedQrDecode() {
  const statusBadge = document.getElementById('qrStatusBadge');
  statusBadge.textContent = currentLang === 'ml' ? "വായിക്കാൻ കഴിഞ്ഞില്ല ❌" : "Unreadable QR ❌";
  statusBadge.className = "status-chip status-warning";
  alert(translations[currentLang].unreadableQrError);
}

function loadUpiSample(num) {
  const upiInput = document.getElementById('upiInput');
  const radioReceive = document.querySelector('input[name="upiIntent"][value="receive"]');
  const radioPay = document.querySelector('input[name="upiIntent"][value="pay"]');

  if (num === 1) {
    upiInput.value = "upi://pay?pa=refund_desk99@ybl&pn=QuickRefund&am=4999&cu=INR&tn=Enter%20PIN%20To%20Receive%20Cashback";
    if (radioReceive) radioReceive.checked = true;
  } else if (num === 2) {
    upiInput.value = "http://claim-money.reward-bonus.xyz/gpay?amount=25000&action=collect";
    if (radioReceive) radioReceive.checked = true;
  } else {
    upiInput.value = "upi://pay?pa=citysupermarket@icici&pn=CitySupermarket&am=250&cu=INR&tn=Invoice%20Grocery";
    if (radioPay) radioPay.checked = true;
  }
}

function clearUpiDetector() {
  removeQrImage();
  document.getElementById('upiInput').value = '';
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeUpiDetector() {
  const payload = document.getElementById('upiInput').value.trim();
  const intentEl = document.querySelector('input[name="upiIntent"]:checked');
  const intent = intentEl ? intentEl.value : 'receive';

  if (!payload) {
    alert(currentLang === 'ml' ? "ദയവായി ഒരു QR കോഡ് അപ്‌ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ UPI ലിങ്ക് നൽകുക." : "Please upload a QR code image or enter a UPI string.");
    return;
  }

  showLoading(true);

  try {
    // Attempt backend analysis
    const response = await fetch(`${BACKEND_URL}/api/analyze-upi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload, intent })
    });

    if (response.ok) {
      const data = await response.json();
      renderComprehensiveResult(data, 'online', 'upi');
    } else {
      throw new Error("Backend response error");
    }
  } catch (err) {
    // Resilient offline client-side heuristic engine
    const localResult = analyzeUpiClientSide(payload, intent);
    renderComprehensiveResult(localResult, 'offline', 'upi');
  } finally {
    showLoading(false);
  }
}

function analyzeUpiClientSide(payload, intent) {
  const textLower = payload.toLowerCase();
  const triggers = [];
  let score = 0;
  const parsed = { is_upi_uri: false, payee_vpa: "", amount: "", note: "" };

  if (payload.startsWith("upi://") || textLower.includes("upi://pay")) {
    parsed.is_upi_uri = true;
    const paMatch = payload.match(/[?&]pa=([^&]+)/i);
    const amMatch = payload.match(/[?&]am=([^&]+)/i);
    const tnMatch = payload.match(/[?&]tn=([^&]+)/i);
    
    parsed.payee_vpa = paMatch ? decodeURIComponent(paMatch[1]) : "";
    parsed.amount = amMatch ? decodeURIComponent(amMatch[1]) : "";
    parsed.note = tnMatch ? decodeURIComponent(tnMatch[1]) : "";

    if (intent === 'receive') {
      score += 3;
      triggers.push(currentLang === 'ml'
        ? "വളരെ പ്രധാനം: പണം ലഭിക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യുകയോ UPI PIN അടിക്കുകയോ ചെയ്യേണ്ടതില്ല. ഇത് പണം നഷ്ടപ്പെടുത്താനുള്ള തട്ടിപ്പ് QR കോഡാണ്!"
        : "CRITICAL UPI RULE: Scanning a QR code or entering your UPI PIN will DEDUCT money from your account, NEVER credit it. If told this QR is to receive money, it is 100% FRAUD!");
    }

    if (parsed.amount && parseFloat(parsed.amount) > 0) {
      triggers.push(currentLang === 'ml'
        ? `തുക രേഖപ്പെടുത്തിയിരിക്കുന്നു: PIN നൽകിയാൽ നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് ₹${parsed.amount} ഉടൻ നഷ്ടമാകും.`
        : `Pre-set Transfer Amount: ₹${parsed.amount} will be deducted from your bank balance.`);
    }

    if (textLower.includes('cashback') || textLower.includes('reward') || textLower.includes('refund') || textLower.includes('prize')) {
      score += 3;
      triggers.push(currentLang === 'ml'
        ? "വ്യാജ സമ്മാന/ക്യാഷ്ബാക്ക് സൂചന കണ്ടെത്തി. ഉപയോക്താക്കളെ തെറ്റിദ്ധരിപ്പിക്കാനുള്ള തന്ത്രമാണിത്."
        : "Scam Bait Note Detected: Fraudsters use fake cashback or reward labels to trick victims.");
    }
  } else if (payload.startsWith("http://") || payload.startsWith("https://")) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "ഈ QR കോഡ് ബാഹ്യ വെബ്സൈറ്റിലേക്കാണ് നയിക്കുന്നത്. വ്യാജ പേയ്‌മെന്റ് ഗേറ്റ്‌വേയോ മാൽവെയറോ ആകാം."
      : "QR code leads to an external Web URL rather than a secure UPI app. High phishing risk.");
  } else {
    score += 1;
    triggers.push(currentLang === 'ml'
      ? "സാധാരണ UPI മാനദണ്ഡങ്ങളുമായി പൊരുത്തപ്പെടാത്ത QR കോഡ് വിവരങ്ങൾ."
      : "Non-standard QR code payload. Does not match NPCI UPI format.");
  }

  const level = score >= 3 ? "HIGH" : (score >= 1 ? "MEDIUM" : "LOW");
  return {
    risk_level: level,
    score: score,
    parsed_info: parsed,
    triggers: triggers.map(t => ({ en: t, ml: t })),
    recommendations: translations[currentLang].scams.upi.whatToDo,
    disclaimer: "Local browser heuristic analysis. Never enter your UPI PIN to receive money."
  };
}

// ==============================================================================
// 9. Category 2: WhatsApp Emergency Scam Detector
// ==============================================================================
function handleWaFileSelect(file) {
  if (!validateFile(file, ['image/png', 'image/jpeg', 'image/jpg'], 5)) return;
  uploadedFiles.whatsapp = file;

  const previewContainer = document.getElementById('waPreviewContainer');
  const previewImg = document.getElementById('waPreviewImg');
  const fileNameEl = document.getElementById('waFileName');

  fileNameEl.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.remove('hidden');
    document.getElementById('waOcrStatus').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function removeWaImage() {
  uploadedFiles.whatsapp = null;
  document.getElementById('waFileInput').value = '';
  document.getElementById('waPreviewContainer').classList.add('hidden');
  document.getElementById('waPreviewImg').src = '';
  document.getElementById('waOcrStatus').classList.add('hidden');
}

async function extractWaOcr() {
  if (!uploadedFiles.whatsapp) return;
  const statusEl = document.getElementById('waOcrStatus');
  statusEl.textContent = translations[currentLang].ocrProcessing;
  statusEl.classList.remove('hidden');

  if (window.Tesseract) {
    try {
      const res = await Tesseract.recognize(uploadedFiles.whatsapp, 'eng');
      const text = res.data.text.trim();
      if (text) {
        document.getElementById('waMessageInput').value = text;
        statusEl.textContent = translations[currentLang].ocrSuccess;
      } else {
        statusEl.textContent = translations[currentLang].ocrFailed;
      }
    } catch (err) {
      console.warn("OCR Error:", err);
      statusEl.textContent = translations[currentLang].ocrFailed;
    }
  } else {
    statusEl.textContent = translations[currentLang].ocrFailed;
  }
}

function loadWaSample(num) {
  const waInput = document.getElementById('waMessageInput');
  if (num === 1) {
    waInput.value = currentLang === 'ml'
      ? "അച്ഛാ, എന്റെ ഫോൺ നഷ്ടപ്പെട്ടു, ഇതെന്റെ താത്കാലിക നമ്പറാണ്. ബാംഗ്ലൂരിൽ വെച്ച് ബൈക്ക് അപകടം പറ്റി ആശുപത്രിയിലാണ്. അടിയന്തര ചികിത്സയ്ക്ക് ₹20,000 ഉടൻ വേണം. അമ്മയോട് ഇപ്പോൾ പറയണ്ട, ഉടൻ ഈ ഗൂഗിൾ പേ നമ്പറിലേക്ക് അയക്കൂ."
      : "Hi Dad, I lost my phone, this is my temporary number. I had an accident and need ₹20,000 urgently for hospital emergency bills. Don't tell mum yet, please GPay to this number immediately.";
  } else if (num === 2) {
    waInput.value = currentLang === 'ml'
      ? "അമ്മേ, എന്റെ ഫോണും പഴ്സും ട്രെയിനിൽ വെച്ച് നഷ്ടപ്പെട്ടു. ഇന്ന് കോളേജ് ഫീസ് അടയ്ക്കാനുള്ള അവസാന തീയതിയാണ്. ₹15,000 സുഹൃത്തിന്റെ ഈ UPI ഐഡിയിലേക്ക് ഉടൻ ട്രാൻസ്ഫർ ചെയ്യാമോ? പഴയ നമ്പറിലേക്ക് വിളിക്കേണ്ട."
      : "Hi Mum, I lost my phone and wallet on the train. Today is the final deadline for my semester exam fees. Please transfer ₹15,000 immediately to my friend's UPI. Don't call my old number.";
  } else {
    waInput.value = currentLang === 'ml'
      ? "അച്ഛാ, ഞാൻ നാട്ടിലെത്തി. വൈകുന്നേരം വിളിക്കാം. എല്ലാവർക്കും സുഖമാണോ?"
      : "Hi Dad, I reached the hotel safely. Will call you tonight after the meeting. Take care!";
  }
}

function clearWaDetector() {
  removeWaImage();
  document.getElementById('waMessageInput').value = '';
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeWaDetector() {
  const text = document.getElementById('waMessageInput').value.trim();
  if (!text) {
    alert(currentLang === 'ml' ? "ദയവായി സന്ദേശം നൽകുക." : "Please enter or paste a message.");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category: 'whatsapp' })
    });

    if (res.ok) {
      const data = await res.json();
      renderComprehensiveResult(data, 'online', 'whatsapp');
    } else {
      throw new Error("Backend error");
    }
  } catch (err) {
    const localResult = analyzeMessageClientSide(text, 'whatsapp');
    renderComprehensiveResult(localResult, 'offline', 'whatsapp');
  } finally {
    showLoading(false);
  }
}

// ==============================================================================
// 10. Category 3: Fake Link & APK Scam Detector
// ==============================================================================
function loadLinkSample(num) {
  const linkInput = document.getElementById('linkInput');
  if (num === 1) {
    linkInput.value = "http://sbi-kyc-verify-update.xyz/login/download_sbi.apk";
  } else if (num === 2) {
    linkInput.value = "http://bit.ly/free-5g-recharge-offer";
  } else {
    linkInput.value = "https://cybercrime.gov.in";
  }
}

function clearLinkDetector() {
  document.getElementById('linkInput').value = '';
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeLinkDetector() {
  const url = document.getElementById('linkInput').value.trim();
  if (!url) {
    alert(currentLang === 'ml' ? "ദയവായി വെബ് വിലാസം (URL) നൽകുക." : "Please enter a URL.");
    return;
  }

  // Basic URL regex validation
  if (!url.match(/^https?:\/\//i) && !url.match(/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
    alert(currentLang === 'ml' ? "അസാധുവായ വെബ് വിലാസം (URL). ദയവായി ശരിയായ വിലാസം നൽകുക." : "Invalid URL format. Please enter a valid web address.");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (res.ok) {
      const data = await res.json();
      renderComprehensiveResult(data, 'online', 'fakelink');
    } else {
      throw new Error("Backend error");
    }
  } catch (err) {
    const localResult = analyzeUrlClientSide(url);
    renderComprehensiveResult(localResult, 'offline', 'fakelink');
  } finally {
    showLoading(false);
  }
}

function analyzeUrlClientSide(rawUrl) {
  let url = rawUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  const triggers = [];
  let score = 0;
  const urlLower = url.toLowerCase();

  const isTrusted = urlLower.includes('.gov.in') || urlLower.includes('.nic.in') || urlLower.includes('cybercrime.gov.in');

  if (isTrusted) {
    triggers.push(currentLang === 'ml'
      ? "ഔദ്യോഗിക സർക്കാർ അല്ലെങ്കിൽ അംഗീകൃത പോർട്ടൽ (.gov.in)."
      : "Domain belongs to a verified official government (.gov.in) portal.");
    return {
      risk_level: "LOW",
      score: 0,
      url: rawUrl,
      triggers: triggers.map(t => ({ en: t, ml: t })),
      recommendations: translations[currentLang].scams.fakelink.whatToDo,
      disclaimer: "Local heuristic check only. Always ensure you are on genuine websites."
    };
  }

  // APK Check
  if (urlLower.includes('.apk')) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "നേരിട്ടുള്ള APK ഫയൽ ഡൗൺലോഡ് — ഫോണിൽ മാൽവെയർ ഇൻസ്റ്റാൾ ആകാൻ ഉയർന്ന സാധ്യത!"
      : "Direct APK file download detected — high danger of installing Android banking malware!");
  }

  // Suspicious TLD
  const badTlds = ['.xyz', '.top', '.online', '.site', '.club', '.link', '.tk', '.live', '.buzz', '.shop', '.click'];
  if (badTlds.some(tld => urlLower.includes(tld))) {
    score += 2;
    triggers.push(currentLang === 'ml'
      ? "തട്ടിപ്പുകാർ വ്യാപകമായി ഉപയോഗിക്കുന്ന സംശയകരമായ ഡൊമൈൻ വാലറ്റം."
      : "Suspicious top-level domain suffix heavily abused in phishing.");
  }

  // Shortener
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy'];
  if (shorteners.some(s => urlLower.includes(s))) {
    score += 2;
    triggers.push(currentLang === 'ml'
      ? "ഷോർട്ട് ലിങ്ക് — യഥാർത്ഥ ലക്ഷ്യസ്ഥാനം മറഞ്ഞിരിക്കുന്നു."
      : "URL shortener detected masking the true destination.");
  }

  // Bank Spoofing
  if ((urlLower.includes('sbi') || urlLower.includes('hdfc') || urlLower.includes('kyc')) && !urlLower.includes('.sbi')) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "വ്യാജ ബാങ്ക് / KYC ഡൊമൈൻ അനുകരണം."
      : "Brand spoofing: mimics trusted bank names without official credentials.");
  }

  const level = score >= 3 ? "HIGH" : (score >= 1 ? "MEDIUM" : "LOW");
  return {
    risk_level: level,
    score: score,
    url: rawUrl,
    triggers: triggers.map(t => ({ en: t, ml: t })),
    recommendations: translations[currentLang].scams.fakelink.whatToDo,
    disclaimer: "Local heuristic analysis only. Links should not be visited."
  };
}

// ==============================================================================
// 11. Category 4: Bank & KYC Block Scam Detector
// ==============================================================================
function handleBankFileSelect(file) {
  if (!validateFile(file, ['image/png', 'image/jpeg', 'image/jpg'], 5)) return;
  uploadedFiles.bank = file;

  const previewContainer = document.getElementById('bankPreviewContainer');
  const previewImg = document.getElementById('bankPreviewImg');
  const fileNameEl = document.getElementById('bankFileName');

  fileNameEl.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.remove('hidden');
    document.getElementById('bankOcrStatus').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function removeBankImage() {
  uploadedFiles.bank = null;
  document.getElementById('bankFileInput').value = '';
  document.getElementById('bankPreviewContainer').classList.add('hidden');
  document.getElementById('bankPreviewImg').src = '';
  document.getElementById('bankOcrStatus').classList.add('hidden');
}

async function extractBankOcr() {
  if (!uploadedFiles.bank) return;
  const statusEl = document.getElementById('bankOcrStatus');
  statusEl.textContent = translations[currentLang].ocrProcessing;
  statusEl.classList.remove('hidden');

  if (window.Tesseract) {
    try {
      const res = await Tesseract.recognize(uploadedFiles.bank, 'eng');
      const text = res.data.text.trim();
      if (text) {
        document.getElementById('bankInput').value = text;
        statusEl.textContent = translations[currentLang].ocrSuccess;
      } else {
        statusEl.textContent = translations[currentLang].ocrFailed;
      }
    } catch (err) {
      statusEl.textContent = translations[currentLang].ocrFailed;
    }
  } else {
    statusEl.textContent = translations[currentLang].ocrFailed;
  }
}

function loadBankSample(num) {
  const bankInput = document.getElementById('bankInput');
  const bankSelect = document.getElementById('bankSelect');

  if (num === 1) {
    if (bankSelect) bankSelect.value = "State Bank of India (SBI)";
    bankInput.value = currentLang === 'ml'
      ? "പ്രിയ ഉപഭോക്താവേ, നിങ്ങളുടെ SBI ബാങ്ക് അക്കൗണ്ട് KYC അപൂർണ്ണമായതിനാൽ ഇന്ന് 2 മണിക്കൂറിനുള്ളിൽ ബ്ലോക്ക് ചെയ്യപ്പെടും. അടിയന്തരമായി അക്കൗണ്ട് പുനഃസ്ഥാപിക്കാൻ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക: http://bit.ly/sbi-kyc-verify അല്ലെങ്കിൽ 9876543210 എന്ന നമ്പറിൽ ബന്ധപ്പെടുക. ഒടിപി ആർക്കും നൽകരുത്."
      : "Dear SBI customer, your bank account is blocked due to missing KYC update. Click link immediately to update: http://bit.ly/sbi-kyc-reactivate or call 9123456789. Do not share OTP with anyone.";
  } else if (num === 2) {
    if (bankSelect) bankSelect.value = "HDFC Bank";
    bankInput.value = currentLang === 'ml'
      ? "നിങ്ങളുടെ ATM കാർഡ് സുരക്ഷാ കാരണങ്ങളാൽ ബ്ലോക്ക് ചെയ്തിരിക്കുന്നു. കാർഡ് ആക്റ്റീവ് ചെയ്യാൻ ഉടൻ ബാങ്ക് ഓഫീസറെ 9845123456 നമ്പറിൽ വിളിക്കുക."
      : "URGENT: Your ATM Debit card has been blocked today. Call Senior Bank Officer at 9845123456 immediately to restore net banking and card services.";
  } else {
    if (bankSelect) bankSelect.value = "State Bank of India (SBI)";
    bankInput.value = currentLang === 'ml'
      ? "നിങ്ങളുടെ അക്കൗണ്ട് XXXXX1234 ലേക്ക് ₹5,000 ക്രെഡിറ്റ് ആയിരിക്കുന്നു. ലഭ്യമായ ബാക്കി തുക: ₹24,800. SBI."
      : "Your account XXXXX1234 has been credited with INR 5,000 on 08-Oct-26. Available Balance: INR 24,800. SBI Bank.";
  }
}

function clearBankDetector() {
  removeBankImage();
  document.getElementById('bankInput').value = '';
  document.getElementById('bankSelect').value = '';
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeBankDetector() {
  const text = document.getElementById('bankInput').value.trim();
  const bankName = document.getElementById('bankSelect').value;

  if (!text) {
    alert(currentLang === 'ml' ? "ദയവായി ബാങ്ക് സന്ദേശം നൽകുക." : "Please enter the bank message text.");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category: 'bank', bank_name: bankName })
    });

    if (res.ok) {
      const data = await res.json();
      renderComprehensiveResult(data, 'online', 'bank');
    } else {
      throw new Error("Backend error");
    }
  } catch (err) {
    const localResult = analyzeMessageClientSide(text, 'bank', bankName);
    renderComprehensiveResult(localResult, 'offline', 'bank');
  } finally {
    showLoading(false);
  }
}

// Client-side message heuristic engine for WhatsApp and Bank
function analyzeMessageClientSide(text, category, bankName = "") {
  const textLower = text.toLowerCase();
  const triggers = [];
  let score = 0;

  // Credential requests
  if (['otp', 'pin', 'cvv', 'password', 'ഒടിപി', 'പിൻ'].some(k => textLower.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "രഹസ്യ വിവരങ്ങൾ (OTP / PIN / CVV / Password) പരാമർശിച്ചിരിക്കുന്നു — ഒരിക്കലും ആർക്കും നൽകരുത്."
      : "Mentions confidential credentials (OTP, PIN, CVV, or password).");
  }

  // Links
  if (text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|\.xyz|\.top|\.online/i)) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "സംശയകരമായ ബാഹ്യ ലിങ്ക് അടങ്ങിയിരിക്കുന്നു. ഔദ്യോഗിക ബാങ്കുകൾ സന്ദേശത്തിൽ ലിങ്ക് അയക്കില്ല."
      : "Contains suspicious external or shortened web link.");
  }

  // Urgency
  if (['immediately', 'urgent', 'blocked', 'freeze', 'within 2 hours', 'ഉടൻ', 'ബ്ലോക്ക്'].some(k => textLower.includes(k))) {
    score += 2;
    triggers.push(currentLang === 'ml'
      ? "ഭയപ്പെടുത്തുന്നതും തിടുക്കം കൂട്ടുന്നതുമായ പദപ്രയോഗങ്ങൾ."
      : "High urgency or account blocking threat detected.");
  }

  // Impersonation / Emergency
  if (category === 'whatsapp' && ['hospital', 'accident', 'lost phone', 'new number', 'ആശുപത്രി', 'അപകടം', 'പുതിയ നമ്പർ'].some(k => textLower.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "ബന്ധുവാണെന്ന വ്യാജേനയുള്ള അടിയന്തര പണ സഹായ തട്ടിപ്പ് ലക്ഷണം."
      : "Family emergency / lost phone impersonation trick detected.");
  }

  const level = score >= 3 ? "HIGH" : (score >= 1 ? "MEDIUM" : "LOW");
  return {
    risk_level: level,
    score: score,
    category: category,
    triggers: triggers.map(t => ({ en: t, ml: t })),
    recommendations: translations[currentLang].scams[category === 'whatsapp' ? 'whatsapp' : 'bank'].whatToDo,
    disclaimer: "Local browser heuristic analysis. Always cross-verify through official branches or known contacts."
  };
}

// ==============================================================================
// 12. Category 5: Fake Profile & Impersonation Detector
// ==============================================================================
function handleProfileFileSelect(file) {
  if (!validateFile(file, ['image/png', 'image/jpeg', 'image/jpg'], 5)) return;
  uploadedFiles.profile = file;

  const previewContainer = document.getElementById('profilePreviewContainer');
  const previewImg = document.getElementById('profilePreviewImg');
  const fileNameEl = document.getElementById('profileFileName');

  fileNameEl.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function removeProfileImage() {
  uploadedFiles.profile = null;
  document.getElementById('profileFileInput').value = '';
  document.getElementById('profilePreviewContainer').classList.add('hidden');
  document.getElementById('profilePreviewImg').src = '';
}

function handleOrigProfileFileSelect(file) {
  if (!validateFile(file, ['image/png', 'image/jpeg', 'image/jpg'], 5)) return;
  uploadedFiles.origProfile = file;

  const previewContainer = document.getElementById('origPreviewContainer');
  const previewImg = document.getElementById('origPreviewImg');
  const fileNameEl = document.getElementById('origFileName');

  fileNameEl.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function removeOrigProfileImage() {
  uploadedFiles.origProfile = null;
  document.getElementById('origProfileFileInput').value = '';
  document.getElementById('origPreviewContainer').classList.add('hidden');
  document.getElementById('origPreviewImg').src = '';
}

function toggleProfileComparison() {
  const toggle = document.getElementById('compareToggle');
  const compareSection = document.getElementById('compareSection');
  if (toggle && compareSection) {
    if (toggle.checked) {
      compareSection.classList.remove('hidden');
    } else {
      compareSection.classList.add('hidden');
    }
  }
}

function loadProfileSample(num) {
  const nameInput = document.getElementById('profileNameInput');
  const handleInput = document.getElementById('profileHandleInput');
  const platformSelect = document.getElementById('profilePlatformSelect');
  const msgInput = document.getElementById('profileMessageInput');

  if (num === 1) {
    nameInput.value = "Rajesh Kumar";
    handleInput.value = "@rajesh_kumar_loan892";
    platformSelect.value = "Facebook";
    msgInput.value = currentLang === 'ml'
      ? "ഹായ് അളിയാ, ഞാൻ ഡൽഹി എയർപോർട്ടിലാണ്, പേഴ്സ് നഷ്ടപ്പെട്ടു. അടിയന്തരമായി ₹10,000 വേണം. നാളെ രാവിലെ വീട്ടിലെത്തി തിരികെ തരാം. ഗൂഗിൾ പേ ചെയ്യാമോ?"
      : "Hey bro, lost my wallet at the airport. Need ₹10,000 urgently for ticket charges. Will transfer back tomorrow morning. Can you GPay me?";
  } else if (num === 2) {
    nameInput.value = "Dr. Ananya Nair";
    handleInput.value = "@dr_ananya_official_medic";
    platformSelect.value = "Instagram";
    msgInput.value = currentLang === 'ml'
      ? "മെഡിക്കൽ എമർജൻസി: ഒരു പാവപ്പെട്ട രോഗിയുടെ ശസ്ത്രക്രിയയ്ക്ക് ₹5,000 സഹായം വേണം. ഉടൻ പണം അയക്കുക."
      : "Emergency hospital appeal: need ₹5,000 urgently for an underprivileged patient's operation today. Please transfer to hospital GPay.";
  } else {
    nameInput.value = "Priya Menon";
    handleInput.value = "@priya_menon";
    platformSelect.value = "LinkedIn";
    msgInput.value = currentLang === 'ml'
      ? "ഹലോ, സുഖമാണോ? ഈ വാരാന്ത്യത്തിലെ വർക്ക്‌ഷോപ്പിൽ പങ്കെടുക്കുന്നുണ്ടോ എന്ന് അറിയാൻ മെസ്സേജ് അയച്ചതാണ്."
      : "Hi, hope you are doing well. Just wanted to check if you will be attending the regional meeting this weekend.";
  }
}

function clearProfileDetector() {
  removeProfileImage();
  removeOrigProfileImage();
  document.getElementById('profileNameInput').value = '';
  document.getElementById('profileHandleInput').value = '';
  document.getElementById('profileMessageInput').value = '';
  document.getElementById('compareToggle').checked = false;
  document.getElementById('compareSection').classList.add('hidden');
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeProfileDetector() {
  const profileName = document.getElementById('profileNameInput').value.trim();
  const username = document.getElementById('profileHandleInput').value.trim();
  const platform = document.getElementById('profilePlatformSelect').value;
  const message = document.getElementById('profileMessageInput').value.trim();
  const hasPhoto = !!uploadedFiles.profile;

  if (!message && !profileName && !username) {
    alert(currentLang === 'ml' ? "ദയവായി പ്രൊഫൈൽ വിവരങ്ങളോ സന്ദേശമോ നൽകുക." : "Please enter profile details or the suspicious message.");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_name: profileName,
        username: username,
        platform: platform,
        message: message,
        has_photo: hasPhoto
      })
    });

    if (res.ok) {
      const data = await res.json();
      
      // If compare is active
      const compareToggle = document.getElementById('compareToggle');
      if (compareToggle && compareToggle.checked) {
        const origHandle = document.getElementById('origHandleInput').value.trim();
        const compRes = await fetch(`${BACKEND_URL}/api/compare-profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile1: { name: profileName, handle: username },
            profile2: { name: profileName, handle: origHandle }
          })
        });
        if (compRes.ok) {
          const compData = await compRes.json();
          if (compData.notes && compData.notes.length > 0) {
            data.triggers = data.triggers.concat(compData.notes);
          }
        }
      }

      renderComprehensiveResult(data, 'online', 'fakeaccount');
    } else {
      throw new Error("Backend error");
    }
  } catch (err) {
    const localResult = analyzeProfileClientSide(profileName, username, platform, message);
    renderComprehensiveResult(localResult, 'offline', 'fakeaccount');
  } finally {
    showLoading(false);
  }
}

function analyzeProfileClientSide(name, handle, platform, message) {
  const triggers = [];
  let score = 0;
  const msgLower = (message || '').toLowerCase();

  if (['money', 'gpay', 'phonepe', 'borrow', '₹', 'transfer', 'പണം', 'കടം'].some(k => msgLower.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "സന്ദേശത്തിൽ നേരിട്ട് പണം ആവശ്യപ്പെടുന്നു — വ്യാജ ക്ലോൺ അക്കൗണ്ടുകളുടെ പ്രധാന ലക്ഷണം."
      : "Direct money transfer request in chat — primary signature of cloned profiles.");
  }

  if (handle && handle.match(/\d{4,}$/)) {
    score += 1;
    triggers.push(currentLang === 'ml'
      ? `യൂസർനെയിമിൽ റാൻഡം നമ്പറുകൾ ഉൾപ്പെടുന്നു ('${handle}') — വ്യാജ അക്കൗണ്ടുകളിൽ പതിവുള്ളത്.`
      : `Username contains auto-generated trailing digits ('${handle}') differing from standard handles.`);
  }

  const level = score >= 3 ? "HIGH" : (score >= 1 ? "MEDIUM" : "LOW");
  return {
    risk_level: level,
    score: score,
    triggers: triggers.map(t => ({ en: t, ml: t })),
    recommendations: translations[currentLang].scams.fakeaccount.whatToDo,
    disclaimer: "LIMITATION NOTICE: Local heuristic analysis only. No external social media database was consulted. Never assume a profile is genuine solely because no warning signs were found."
  };
}

// ==============================================================================
// 13. Category 6: Digital Arrest & Fake Police Call Detector
// ==============================================================================
function handleAudioFileSelect(file) {
  if (!validateFile(file, ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/ogg', 'audio/x-m4a'], 10)) return;
  uploadedFiles.audio = file;

  const previewContainer = document.getElementById('audioPreviewContainer');
  const player = document.getElementById('audioPreviewPlayer');
  const fileNameEl = document.getElementById('audioFileName');

  fileNameEl.textContent = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    player.src = e.target.result;
    previewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function removeAudioFile() {
  uploadedFiles.audio = null;
  document.getElementById('audioFileInput').value = '';
  document.getElementById('audioPreviewContainer').classList.add('hidden');
  const player = document.getElementById('audioPreviewPlayer');
  player.pause();
  player.src = '';
}

// Hands-free voice speech dictation into the notes box
function toggleSpeechDictation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert(currentLang === 'ml' ? "ഈ ബ്രൗസറിൽ സ്പീച്ച് ഡിക്ടേഷൻ ലഭ്യമല്ല." : "Speech recognition is not supported on this browser.");
    return;
  }

  const btn = document.getElementById('btnDictateNotes');
  const icon = document.getElementById('dictateIcon');
  const input = document.getElementById('arrestTranscriptInput');

  if (isDictating && speechRecognizer) {
    speechRecognizer.stop();
    isDictating = false;
    btn.classList.remove('playing');
    icon.textContent = '🎙️';
    return;
  }

  speechRecognizer = new SpeechRecognition();
  speechRecognizer.lang = currentLang === 'ml' ? 'ml-IN' : 'en-IN';
  speechRecognizer.continuous = true;
  speechRecognizer.interimResults = false;

  speechRecognizer.onstart = () => {
    isDictating = true;
    btn.classList.add('playing');
    icon.textContent = '⏹️';
  };

  speechRecognizer.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    input.value += (input.value ? ' ' : '') + transcript;
  };

  speechRecognizer.onerror = () => {
    isDictating = false;
    btn.classList.remove('playing');
    icon.textContent = '🎙️';
  };

  speechRecognizer.onend = () => {
    isDictating = false;
    btn.classList.remove('playing');
    icon.textContent = '🎙️';
  };

  speechRecognizer.start();
}

function loadArrestSample(num) {
  const input = document.getElementById('arrestTranscriptInput');
  const deptSelect = document.getElementById('arrestDeptSelect');
  const reasonInput = document.getElementById('arrestReasonInput');

  if (num === 1) {
    deptSelect.value = "CBI (Central Bureau of Investigation)";
    reasonInput.value = "Narcotics MDMA drug parcel seized from Taiwan";
    input.value = currentLang === 'ml'
      ? "സിബിഐ ഓഫീസർ ശർമ്മയാണെന്ന് പറഞ്ഞ് കോൾ വന്നു. തായ്‌വാനിൽ നിന്ന് എന്റെ ആധാർ കാർഡ് വെച്ച് വന്ന പാഴ്‌സലിൽ 150 ഗ്രാം എംഡിഎംഎ ലഹരിമരുന്ന് കണ്ടെത്തിയെന്നും അറസ്റ്റ് വാറണ്ട് ഉണ്ടെന്നും പറഞ്ഞു. ഫോൺ കട്ട് ചെയ്യാതെ സ്കൈപ്പ് വീഡിയോ കോളിൽ തുടരാൻ നിർബന്ധിച്ചു. അറസ്റ്റ് ഒഴിവാക്കാൻ ആർബിഐ വെരിഫിക്കേഷൻ അക്കൗണ്ടിലേക്ക് ₹50,000 സെക്യൂരിറ്റി ഡെപ്പോസിറ്റ് ഉടൻ അയക്കണമെന്ന് ആവശ്യപ്പെട്ടു."
      : "Caller claiming to be CBI Officer Sharma said a FedEx parcel from Taiwan containing 150g MDMA drugs has my Aadhaar linked to it. Claimed a warrant was issued. Demanded I stay on Skype video call in an isolated room under digital arrest and transfer ₹50,000 to an RBI verification account to avoid immediate detention.";
  } else if (num === 2) {
    deptSelect.value = "TRAI (Telecom Regulatory Authority)";
    reasonInput.value = "SIM card deactivation & illegal harassment complaints";
    input.value = currentLang === 'ml'
      ? "നിങ്ങളുടെ ആധാർ വെച്ചെടുത്ത മൊബൈൽ നമ്പർ ഉപയോഗിച്ച് കുറ്റകൃത്യങ്ങൾ ചെയ്തതിനാൽ 2 മണിക്കൂറിനുള്ളിൽ എല്ലാ സിം കാർഡുകളും ബ്ലോക്കാകും. മുംബൈ ക്രൈം ബ്രാഞ്ച് ഓഫീസറോട് വാട്സാപ്പ് വീഡിയോ കോളിൽ സംസാരിച്ചില്ലെങ്കിൽ അറസ്റ്റ് ചെയ്യുമെന്ന് പറഞ്ഞു."
      : "Automated call stating my Aadhaar SIM cards will be permanently disconnected in 2 hours by TRAI due to cyber harassment complaints. Caller demanded I connect to Mumbai Police on WhatsApp video call immediately.";
  } else {
    deptSelect.value = "Unknown";
    reasonInput.value = "Normal courier package delivery";
    input.value = currentLang === 'ml'
      ? "കൊറിയർ ഡെലിവറി ഏജന്റ് വിളിച്ചു. വീട്ടുനമ്പർ വ്യക്തമല്ലാത്തതിനാൽ ലാൻഡ്മാർക്ക് ചോദിച്ചതാണ്."
      : "Courier delivery agent called asking for the landmark near my home to deliver an online order.";
  }
}

function clearArrestDetector() {
  removeAudioFile();
  document.getElementById('arrestTranscriptInput').value = '';
  document.getElementById('arrestDeptSelect').value = 'Unknown';
  document.getElementById('arrestReasonInput').value = '';
  document.getElementById('resultBox').classList.add('hidden');
  stopAudio();
}

async function analyzeArrestDetector() {
  const transcript = document.getElementById('arrestTranscriptInput').value.trim();
  const dept = document.getElementById('arrestDeptSelect').value;
  const reason = document.getElementById('arrestReasonInput').value.trim();

  if (!transcript && dept === 'Unknown' && !reason) {
    alert(currentLang === 'ml' ? "ദയവായി ഫോൺ സംഭാഷണ വിവരങ്ങൾ നൽകുക." : "Please enter the phone call notes or transcript.");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${BACKEND_URL}/api/analyze-digital-arrest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: transcript,
        department: dept,
        reason: reason,
        has_audio: !!uploadedFiles.audio
      })
    });

    if (res.ok) {
      const data = await res.json();
      renderComprehensiveResult(data, 'online', 'fakecall');
    } else {
      throw new Error("Backend error");
    }
  } catch (err) {
    const localResult = analyzeArrestClientSide(transcript, dept, reason);
    renderComprehensiveResult(localResult, 'offline', 'fakecall');
  } finally {
    showLoading(false);
  }
}

function analyzeArrestClientSide(transcript, dept, reason) {
  const combined = `${transcript} ${dept} ${reason}`.toLowerCase();
  const triggers = [];
  let score = 0;

  if (['cbi', 'police', 'customs', 'narcotics', 'ed', 'പോലീസ്', 'കസ്റ്റംസ്'].some(k => combined.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "അന്വേഷണ ഏജൻസി അല്ലെങ്കിൽ പോലീസ് അവകാശവാദം — ഇന്ത്യൻ പോലീസ് ഒരിക്കലും ഫോൺ വഴി അറസ്റ്റ് ഭീഷണി മുഴക്കില്ല."
      : "Law Enforcement impersonation: Police, CBI, and ED NEVER arrest citizens over phone or video calls.");
  }

  if (['video', 'digital arrest', 'do not disconnect', 'remain on call', 'ഡിജിറ്റൽ അറസ്റ്റ്', 'ഫോൺ വെക്കരുത്'].some(k => combined.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "ഡിജിറ്റൽ അറസ്റ്റ് ഭീഷണി — ഇന്ത്യൻ നിയമത്തിൽ ഡിജിറ്റൽ അറസ്റ്റ് എന്ന ഒന്നില്ല. ഇത് 100% തട്ടിപ്പാണ്!"
      : "Digital Arrest Coercion: THERE IS NO SUCH THING AS DIGITAL ARREST UNDER INDIAN LAW. This is 100% fraud.");
  }

  if (['money', 'transfer', 'rbi', 'deposit', 'fine', 'പണം', 'അക്കൗണ്ട്'].some(k => combined.includes(k))) {
    score += 3;
    triggers.push(currentLang === 'ml'
      ? "അറസ്റ്റ് ഒഴിവാക്കാൻ പണം ആവശ്യപ്പെടുന്നു — ഔദ്യോഗിക ഏജൻസികൾ ഒരിക്കലും പണം ചോദിക്കില്ല."
      : "Demands money or verification deposit to clear warrants.");
  }

  const level = score >= 3 ? "HIGH" : (score >= 1 ? "MEDIUM" : "LOW");
  return {
    risk_level: level,
    score: score,
    triggers: triggers.map(t => ({ en: t, ml: t })),
    recommendations: translations[currentLang].scams.fakecall.whatToDo,
    disclaimer: "Safety Truth: Hang up the call immediately. Report to 1930 Cyber Helpline or local police station."
  };
}

// ==============================================================================
// 14. Shared Result Rendering Engine
// ==============================================================================
function renderComprehensiveResult(data, mode, categoryKey) {
  const dict = translations[currentLang];
  const resultBox = document.getElementById('resultBox');
  const badgeEl = document.getElementById('riskBadge');
  const descEl = document.getElementById('riskDesc');
  const triggersListEl = document.getElementById('triggersList');
  const adviceEl = document.getElementById('adviceContent');
  const techDetailsSection = document.getElementById('techDetailsSection');
  const techDetailsContent = document.getElementById('techDetailsContent');
  const disclaimerEl = document.getElementById('resultDisclaimer');
  const engineBadge = document.getElementById('backendEngineBadge');

  if (!resultBox) return;

  // Engine Mode Badge
  if (engineBadge) {
    if (mode === 'online') {
      engineBadge.className = 'engine-badge badge-online';
      engineBadge.textContent = `🔒 ${dict.onlineModeNotice}`;
    } else {
      engineBadge.className = 'engine-badge badge-offline';
      engineBadge.textContent = `⚡ ${dict.offlineModeNotice}`;
    }
  }

  // Risk Badge & Description
  const level = data.risk_level || 'LOW';
  if (level === 'HIGH') {
    badgeEl.className = 'risk-badge risk-high';
    badgeEl.innerHTML = `🚨 ${dict.riskHigh}`;
    descEl.textContent = dict.riskHighDesc;
  } else if (level === 'MEDIUM') {
    badgeEl.className = 'risk-badge risk-medium';
    badgeEl.innerHTML = `⚠️ ${dict.riskMedium}`;
    descEl.textContent = dict.riskMediumDesc;
  } else {
    badgeEl.className = 'risk-badge risk-low';
    badgeEl.innerHTML = `✅ ${dict.riskLow}`;
    descEl.textContent = dict.riskLowDesc;
  }

  // Technical Details (UPI params, URL domain, etc.)
  if (data.parsed_info && (data.parsed_info.is_upi_uri || data.parsed_info.url_destination)) {
    techDetailsSection.classList.remove('hidden');
    const p = data.parsed_info;
    let detailsHTML = `<p><strong>Raw Payload:</strong> <code>${escapeHtml(p.raw || '')}</code></p>`;
    if (p.payee_vpa) detailsHTML += `<p><strong>Payee VPA:</strong> <code>${escapeHtml(p.payee_vpa)}</code></p>`;
    if (p.payee_name) detailsHTML += `<p><strong>Payee Name:</strong> ${escapeHtml(p.payee_name)}</p>`;
    if (p.amount) detailsHTML += `<p><strong>Amount to Debit:</strong> ₹${escapeHtml(p.amount)}</p>`;
    if (p.note) detailsHTML += `<p><strong>Transaction Note:</strong> ${escapeHtml(p.note)}</p>`;
    techDetailsContent.innerHTML = detailsHTML;
  } else if (data.url && data.domain) {
    techDetailsSection.classList.remove('hidden');
    techDetailsContent.innerHTML = `
      <p><strong>Target URL:</strong> <code>${escapeHtml(data.url)}</code></p>
      <p><strong>Resolved Host Domain:</strong> <code>${escapeHtml(data.domain)}</code></p>
      <p><strong>Status:</strong> ${data.is_trusted ? "Verified Official Institutional Domain" : "Unverified Domain"}</p>
    `;
  } else {
    techDetailsSection.classList.add('hidden');
    techDetailsContent.innerHTML = '';
  }

  // Triggers List
  triggersListEl.innerHTML = '';
  const triggers = data.triggers || [];
  if (triggers.length > 0) {
    triggers.forEach(t => {
      const text = typeof t === 'object' ? (t[currentLang] || t.en || '') : t;
      if (text) {
        const li = document.createElement('li');
        li.innerHTML = `⚠️ ${escapeHtml(text)}`;
        triggersListEl.appendChild(li);
      }
    });
  } else {
    const li = document.createElement('li');
    li.textContent = currentLang === 'ml' ? "പ്രത്യേകിച്ച് തട്ടിപ്പ് സൂചനകളൊന്നും കണ്ടെത്തിയില്ല." : "No explicit scam signatures identified.";
    triggersListEl.appendChild(li);
  }

  // Advice & Next Steps
  const adviceClass = level === 'HIGH' ? 'advice-danger' : (level === 'MEDIUM' ? 'advice-warning' : 'advice-safe');
  let recsList = [];
  if (data.recommendations) {
    if (Array.isArray(data.recommendations)) {
      recsList = data.recommendations;
    } else if (data.recommendations[currentLang]) {
      recsList = data.recommendations[currentLang];
    }
  }

  // Fallback recommendations if empty
  if (recsList.length === 0 && dict.scams[categoryKey]) {
    recsList = dict.scams[categoryKey].whatToDo;
  }

  const listItemsHTML = recsList.map(r => `<li>${level === 'HIGH' ? '🛑' : '✅'} ${escapeHtml(r)}</li>`).join('');
  adviceEl.innerHTML = `
    <div class="advice-card ${adviceClass}">
      <p><strong>${dict.adviceTitle}</strong></p>
      <ul>${listItemsHTML}</ul>
    </div>
  `;

  // Disclaimer
  disclaimerEl.textContent = data.disclaimer || "Local heuristic assessment. Stay vigilant.";

  // Voice narration setup
  const speakResultBtn = document.getElementById('speakResultBtn');
  if (speakResultBtn) {
    speakResultBtn.onclick = () => {
      const triggersText = triggers.map(t => typeof t === 'object' ? (t[currentLang] || t.en) : t).join('. ');
      const adviceText = recsList.join('. ');
      const speechNarrative = `${dict.resultTitle}: ${badgeEl.innerText}. ${descEl.innerText}. ${triggersText}. ${dict.adviceTitle}: ${adviceText}`;
      speakText(speechNarrative);
    };
  }

  // Show result box and scroll
  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showLoading(show) {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    if (show) {
      spinner.classList.remove('hidden');
    } else {
      spinner.classList.add('hidden');
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
