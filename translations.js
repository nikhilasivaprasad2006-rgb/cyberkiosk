/**
 * CyberKiosk AI - Bilingual Translations (English & Malayalam)
 * Designed for senior citizens and rural communities.
 * Comprehensive coverage for all 6 scam categories, accessibility, and tools.
 */

const translations = {
  en: {
    // Header & Meta
    appTitle: "CyberKiosk AI",
    tagline: "Simple & Friendly Cyber Safety Assistant",
    sdgBadge: "SDG 17: Partnerships & Digital Inclusion",
    langText: "മലയാളം",
    fontScaleLabel: "Text Size:",
    readAloud: "Listen",
    stopAudio: "Stop",

    // Hero Section
    heroTitle: "Protecting You & Your Family from Online Fraud",
    heroDesc: "CyberKiosk AI helps senior citizens and rural families easily detect scams, verify suspicious messages, and take immediate action in Malayalam and English.",
    heroActionScams: "Explore Scam Guides",
    heroActionChecker: "Interactive Scam Detector",

    // Scam Categories Section
    categoriesTitle: "Common Scam Categories",
    categoriesSub: "Click any scam below to learn how it works, or click 'Test & Detect' to launch its interactive detector.",
    viewGuide: "View Safety Guide",
    testDetectBtn: "⚡ Test & Detect",

    // Scam Categories Data (for guide modals)
    scams: {
      upi: {
        title: "UPI & QR Code Scam",
        icon: "💳",
        badge: "Very Common",
        summary: "Scammers ask you to scan a QR code or enter your UPI PIN to 'receive' money.",
        whatHappened: "Someone calls or messages saying they sent you money by mistake or want to pay you for OLX goods or cashback. They ask you to scan a QR code or enter your PIN to claim the money.",
        whyDangerous: "You NEVER need to enter your UPI PIN to receive money! Entering your PIN will instantly deduct money from your bank account.",
        whatToDo: [
          "Remember: UPI PIN is ONLY for SENDING money, never for receiving.",
          "Check your bank balance directly inside your UPI app if someone claims they sent money.",
          "Reject any collect request or request asking for PIN entry."
        ],
        whatNotToDo: [
          "NEVER scan a QR code given by a stranger to receive money.",
          "NEVER enter your UPI PIN on payment screens sent by unknown callers.",
          "Do not trust screenshots of fake payment receipts."
        ]
      },
      whatsapp: {
        title: "WhatsApp Emergency Scam",
        icon: "💬",
        badge: "Urgent Trick",
        summary: "Scammers pose as a child, relative, or friend claiming an urgent accident or crisis.",
        whatHappened: "You get a message from an unknown number saying 'Hi Mum/Dad, I lost my phone, this is my new number. I urgently need ₹15,000 for hospital/fees.'",
        whyDangerous: "Scammers exploit your emotions and care for loved ones to steal money quickly before you can double check.",
        whatToDo: [
          "Immediately call your relative on their OLD, ORIGINAL phone number.",
          "Ask a personal question only your real family member would know.",
          "Inform other family members before transferring any money."
        ],
        whatNotToDo: [
          "Do NOT send money immediately out of fear or panic.",
          "Do NOT save the new number without verifying.",
          "Do NOT share OTPs or personal bank details over chat."
        ]
      },
      fakelink: {
        title: "Fake Link & APK Scam",
        icon: "🔗",
        badge: "High Risk",
        summary: "Messages containing links offering free recharges, government schemes, or app downloads.",
        whatHappened: "You receive an SMS or message claiming you won a gift, your electricity bill is unpaid, or you must update your SIM card by clicking a link.",
        whyDangerous: "Clicking the link may install secret virus apps (APKs) that steal your banking passwords and SMS OTPs automatically.",
        whatToDo: [
          "Delete the message immediately.",
          "Verify official government schemes on official websites ending with '.gov.in'.",
          "Pay electricity bills only through official apps (KSEB / official state portals)."
        ],
        whatNotToDo: [
          "NEVER click on web links sent via unknown SMS or WhatsApp.",
          "Do NOT download '.apk' files from links.",
          "Do NOT fill forms asking for Aadhaar, Bank PIN, or OTP."
        ]
      },
      bank: {
        title: "Bank & KYC Block Scam",
        icon: "🏦",
        badge: "Identity Theft",
        summary: "Threatening calls or SMS stating your Bank account or ATM card will be blocked today.",
        whatHappened: "A caller claims to be a Bank Manager or SBI officer. They say your KYC is expired and account will be frozen in 2 hours unless you share OTP or click a link.",
        whyDangerous: "Real bank staff will NEVER call you demanding OTP, CVV, or passwords over the phone.",
        whatToDo: [
          "Hang up the phone call immediately.",
          "Visit your local bank branch directly or call the official number printed on your bank passbook.",
          "Report the caller number on 1930 Cyber Helpline."
        ],
        whatNotToDo: [
          "NEVER share OTP, CVV number, or ATM PIN with anyone over call.",
          "Do NOT trust callers claiming to be Bank Officials.",
          "Do NOT download remote screenshare apps like AnyDesk or TeamViewer."
        ]
      },
      fakeaccount: {
        title: "Fake Profile & Impersonation",
        icon: "👤",
        badge: "Social Media",
        summary: "Fake Facebook or Instagram accounts using real photos of your friends or local leaders.",
        whatHappened: "You get a friend request from someone you already know. Shortly after, they send a message asking for emergency money via UPI.",
        whyDangerous: "Scammers clone photos and names of trusted friends to betray your trust and steal money.",
        whatToDo: [
          "Call your actual friend directly via phone to confirm if they made a new profile.",
          "Report the fake profile on Facebook/Instagram as 'Impersonation'.",
          "Warn mutual friends about the fake account."
        ],
        whatNotToDo: [
          "Do NOT accept friend requests from duplicate accounts of existing friends.",
          "Do NOT send money without voice/video verification.",
          "Do NOT share private photos or financial details."
        ]
      },
      fakecall: {
        title: "Digital Arrest & Fake Police Call",
        icon: "📞",
        badge: "Extortion",
        summary: "Callers pretending to be Police, Customs, or Telecom officers threatening arrest.",
        whatHappened: "You receive a video or audio call claiming your parcel contained illegal items or your SIM was used for crime. They demand money to cancel the arrest warrant.",
        whyDangerous: "Indian Law Enforcement or Police NEVER conduct 'Digital Arrests' or demand money via video call.",
        whatToDo: [
          "Stay calm and remember: Indian Police never arrest anyone over WhatsApp video calls.",
          "Disconnect the call immediately and call 1930 or your local police station.",
          "Inform your family members or neighbors."
        ],
        whatNotToDo: [
          "Do NOT pay any fine or fee demanded over video call.",
          "Do NOT stay on the call under threat or fear.",
          "Do NOT isolate yourself; speak out immediately."
        ]
      }
    },

    // Modal Titles
    modalHappened: "What Happened?",
    modalDangerous: "Why is this Dangerous?",
    modalToDo: "What You SHOULD Do",
    modalNotToDo: "What You Should NOT Do",
    closeButton: "Close Guide",

    // Interactive Detection Center
    detectorSectionTitle: "Interactive Scam Detection Center",
    detectorSectionSub: "Select any of the 6 scam categories below to test messages, URLs, QR codes, profiles, and phone calls with live validation.",
    tabUpi: "1. UPI & QR Code",
    tabWhatsapp: "2. WhatsApp Emergency",
    tabFakelink: "3. Fake Link & APK",
    tabBank: "4. Bank & KYC Block",
    tabFakeaccount: "5. Fake Profile",
    tabFakecall: "6. Digital Arrest",

    // Category 1: UPI & QR
    upiTitle: "UPI & QR Code Scam Detector",
    upiSub: "Upload a payment QR code image or enter a UPI string to verify if it is an authorization trap or collect request.",
    uploadQrBtn: "Upload QR Code (PNG, JPG, JPEG)",
    dragDropQr: "Drag & drop QR code image here or click to browse",
    removeFile: "Remove Image",
    qrDecodedLabel: "Decoded Content from QR:",
    manualUpiLabel: "Or Enter / Paste UPI Payment String or URL:",
    manualUpiPlaceholder: "e.g., upi://pay?pa=recipient@bank&pn=PrizeWinner&am=25000&tn=Cashback%20Reward",
    upiIntentLabel: "What were you told?",
    upiIntentReceive: "I was told: 'Receive Money / Claim Cashback / Get Refund'",
    upiIntentPay: "I intend to send money to a merchant or shop",
    upiSample1: "Fake QR: Collect Request Disguised as 'Receive'",
    upiSample2: "Cashback Reward Trap QR",
    upiSample3: "Legitimate Merchant Store QR",
    analyzeQrBtn: "Analyze QR Code",
    clearQrBtn: "Clear QR",
    unreadableQrError: "Could not detect or decode a QR code in this image. Please ensure the QR code is clear, well-lit, and not blurry, or enter the UPI string manually.",
    upiPinSafetyAlert: "⚠️ CRITICAL SAFETY RULE: You NEVER need to enter your UPI PIN to receive money! Entering your PIN will ALWAYS deduct money from your account.",

    // Category 2: WhatsApp Emergency
    waTitle: "WhatsApp Emergency Scam Detector",
    waSub: "Paste suspicious WhatsApp messages or upload chat screenshots to detect impersonation, urgent medical appeals, or money requests.",
    waTextPlaceholder: "Paste WhatsApp message here... (e.g., 'Hi Mum, I lost my phone, this is my temporary number. I had an accident and need ₹20,000 urgently for hospital bills. Don't tell dad yet.')",
    uploadWaScreenshot: "Optional: Upload WhatsApp Chat Screenshot (PNG, JPG)",
    extractOcrBtn: "Extract Text from Screenshot (OCR)",
    ocrProcessing: "Reading text from image...",
    ocrSuccess: "Text extracted from screenshot! Review and edit in the box above.",
    ocrFailed: "OCR could not extract clear text. Please type or paste the message text manually.",
    waSample1: "Hospital / Accident Emergency",
    waSample2: "Lost Phone & Urgent College Fees",
    waSample3: "Normal Family Message",
    analyzeWaBtn: "Analyze Message",
    clearWaBtn: "Clear Text",
    waVerifyNotice: "⚠️ CRITICAL: Always verify emergencies by calling the person on their KNOWN, ORIGINAL phone number before transferring money.",

    // Category 3: Fake Link & APK
    linkTitle: "Fake Link & APK Scam Detector",
    linkSub: "Analyze website URLs, suspicious domains, misleading subdomains, and APK download links without visiting them.",
    linkInputPlaceholder: "Enter website link (e.g., http://sbi-kyc-update.xyz/app.apk or bit.ly/free-recharge-reward)",
    linkSample1: "Fake Bank KYC APK Download",
    linkSample2: "Free Recharge Shortener Link",
    linkSample3: "Official CyberCrime Portal",
    analyzeLinkBtn: "Analyze Link",
    clearLinkBtn: "Clear Link",
    linkSafetyWarning: "Safe Browsing: CyberKiosk AI performs local heuristic analysis and never opens or downloads untrusted files.",

    // Category 4: Bank & KYC Block
    bankTitle: "Bank & KYC Block Scam Detector",
    bankSub: "Paste bank SMS alerts, emails, or caller statements threatening account freezes or KYC expiry.",
    bankSelectLabel: "Select Bank (Optional):",
    bankSelectPlaceholder: "-- Select Bank (Optional) --",
    bankInputPlaceholder: "Paste bank message here... (e.g., 'Dear customer, your SBI account is blocked due to pending KYC. Update immediately at http://bit.ly/sbi-kyc or call 9876543210')",
    uploadBankScreenshot: "Optional: Upload SMS / Bank Notice Screenshot",
    bankSample1: "SBI Account KYC Expiry Block",
    bankSample2: "ATM Card Block & Callback Threat",
    bankSample3: "Legitimate Bank Balance SMS",
    analyzeBankBtn: "Analyze Bank Alert",
    clearBankBtn: "Clear Text",
    bankPrivacyReminder: "🔒 Privacy Protection: CyberKiosk AI will NEVER ask for your bank account number, card CVV, ATM PIN, OTP, or passwords.",

    // Category 5: Fake Profile & Impersonation
    profileTitle: "Fake Profile & Impersonation Detector",
    profileSub: "Inspect suspicious social media profiles, usernames, and messages asking for money or sharing links.",
    profileNameLabel: "Profile Display Name (Optional):",
    profileNamePlaceholder: "e.g., Dr. Rajesh Kumar",
    profileHandleLabel: "Username / Handle (Optional):",
    profileHandlePlaceholder: "e.g., @rajesh_kumar_loan892",
    profilePlatformLabel: "Social Platform:",
    profileMsgLabel: "Suspicious Message Received (Required):",
    profileMsgPlaceholder: "Paste message received from this profile... (e.g., 'Hey, I lost my wallet at the airport. Can you GPay me ₹5,000? I will return it tomorrow.')",
    uploadProfilePhoto: "Upload Profile Screenshot / Photo",
    toggleCompareLabel: "Optional: Compare with Known / Original Profile",
    originalProfilePhoto: "Original / Known Profile Screenshot",
    originalProfileHandle: "Original Profile Handle (e.g., @rajesh_official)",
    profileSample1: "Fake Facebook Friend Asking for Money",
    profileSample2: "Doctor Impersonation Urgent Appeal",
    profileSample3: "Normal Profile Inquiry",
    analyzeProfileBtn: "Analyze Profile",
    clearProfileBtn: "Clear",
    profileLimitationNotice: "LIMITATION NOTICE: This tool analyzes text & metadata heuristics locally. No external social media verification or reverse-image search API is connected. Never assume a profile is genuine solely because no warning signs were found.",

    // Category 6: Digital Arrest & Fake Police Call
    arrestTitle: "Digital Arrest & Fake Police Call Detector",
    arrestSub: "Analyze calls or transcripts claiming to be Police, CBI, ED, or Customs threatening arrest or demanding video detention.",
    arrestTranscriptLabel: "Call Notes or Transcript (Required):",
    arrestTranscriptPlaceholder: "Enter notes about the phone call... (e.g., 'Caller claimed to be CBI Officer Sharma. Said a parcel from Taiwan containing MDMA drugs has my Aadhaar. Demanded I stay on Skype video call in an isolated room and transfer ₹50,000 to an RBI verification account to avoid arrest.')",
    arrestDeptLabel: "Claimed Department (Optional):",
    arrestReasonLabel: "Claimed Reason / Allegation (Optional):",
    uploadAudioLabel: "Optional: Call Audio Recording (.mp3, .wav, .m4a)",
    dictateNotesBtn: "🎙️ Dictate / Speak Notes",
    arrestSample1: "Digital Arrest: Drug Parcel from Taiwan (Fake CBI)",
    arrestSample2: "TRAI Notice: SIM Disconnection & Video Detention",
    arrestSample3: "Legitimate Courier Delivery Query",
    analyzeArrestBtn: "Analyze Call Threat",
    clearArrestBtn: "Clear",
    arrestTruthBanner: "100% FRAUD WARNING: Under Indian Law, Police, CBI, ED, and Customs NEVER conduct arrests over video calls, and NEVER ask citizens to transfer money to 'verification accounts'.",
    audioLimitationNotice: "Audio playback loaded. Note: Automatic offline transcription requires dedicated speech models. Please write or dictate key phrases in the box above for analysis.",

    // Results & Feedback
    resultTitle: "Scam Risk Assessment",
    riskLow: "LOW RISK",
    riskMedium: "MEDIUM RISK",
    riskHigh: "HIGH RISK DANGER",
    riskLowDesc: "No overt scam patterns detected by local heuristic rules. Always stay vigilant.",
    riskMediumDesc: "Caution advised! Suspicious patterns, urgency, or unfamiliar requests detected.",
    riskHighDesc: "HIGH DANGER: Strong indicators of a SCAM! Do NOT send money, share PINs, or click links!",
    reasonsFound: "Suspicious Triggers Detected:",
    adviceTitle: "Recommended Action Plan:",
    technicalDetailsTitle: "Technical Breakdown / Details:",
    onlineModeNotice: "Connected: Analyzed using CyberKiosk Python Backend",
    offlineModeNotice: "Offline Mode: Analyzed using Local Browser Safety Engine",
    trySampleTitle: "Try Sample Scenarios:",

    // Emergency Section
    emergencyTitle: "Emergency Cyber Crime Help & Helpline",
    emergencySub: "If you have lost money or entered passwords, act immediately within the first 1-2 hours ('Golden Hour').",
    helplineNumber: "1930",
    helplineLabel: "National Cyber Crime Helpline (India)",
    helplineDesc: "Toll-free emergency helpline available 24x7 to block fraudulent transactions immediately.",
    callNowBtn: "Call 1930 Helpline",
    portalLink: "Official Portal: cybercrime.gov.in",
    visitPortalBtn: "Visit Official CyberCrime Portal (cybercrime.gov.in)",

    emergencyStepsTitle: "Immediate 4-Step Emergency Action Plan:",
    step1Title: "1. Call 1930 Helpline",
    step1Desc: "Report the transaction immediately so cyberpolice can freeze the scammer's bank account.",
    step2Title: "2. Contact Your Bank",
    step2Desc: "Call your bank's customer care to block your ATM card, net banking, and UPI ID.",
    step3Title: "3. File Official Complaint",
    step3Desc: "Submit transaction reference number and screenshots on cybercrime.gov.in or local police station.",
    step4Title: "4. Change All Passwords",
    step4Desc: "Change your UPI PIN, banking passwords, and email credentials immediately.",

    // SDG Section
    sdgTitle: "Alignment with UN Sustainable Development Goals (SDG 17)",
    sdgDesc: "CyberKiosk AI supports SDG 17 (Partnerships for the Goals) and SDG 10 (Reduced Inequalities) by providing accessible, bilingual digital safety tools to bridge the digital literacy divide for senior citizens and rural communities.",

    // Footer
    footerText: "CyberKiosk AI • Hackathon Project for Community Empowerment • Non-profit Educational Tool"
  },

  ml: {
    // Header & Meta
    appTitle: "സൈബർകിയോസ്ക് AI (CyberKiosk AI)",
    tagline: "ഗ്രാമീണ മേഖലകൾക്കും മുതിർന്ന പൗരന്മാർക്കുമായുള്ള ഓൺലൈൻ സുരക്ഷാ സഹായി",
    sdgBadge: "SDG 17: സൗജന്യ ഡിജിറ്റൽ സുരക്ഷാ ദൗത്യം",
    langText: "English",
    fontScaleLabel: "അക്ഷര വലിപ്പം:",
    readAloud: "വായിക്കുക (ശബ്ദം)",
    stopAudio: "ശബ്ദം നിർത്തുക",

    // Hero Section
    heroTitle: "ഓൺലൈൻ തട്ടിപ്പുകളിൽ നിന്നും നിങ്ങളെയും കുടുംബത്തെയും സംരക്ഷിക്കാം",
    heroDesc: "മുതിർന്ന പൗരന്മാർക്കും ഗ്രാമീണ കുടുംബങ്ങൾക്കും വ്യാജ സന്ദേശങ്ങൾ തിരിച്ചറിയാനും അടിയന്തര ഘട്ടങ്ങളിൽ എന്തുചെയ്യണമെന്ന് പഠിക്കാനുമുള്ള ലളിതമായ സഹായി.",
    heroActionScams: "തട്ടിപ്പുകൾ പരിചയപ്പെടാം",
    heroActionChecker: "തത്സമയ തട്ടിപ്പ് പരിശോധന",

    // Scam Categories Section
    categoriesTitle: "പ്രധാന സൈബർ തട്ടിപ്പുകൾ",
    categoriesSub: "തട്ടിപ്പ് രീതികളെക്കുറിച്ചും അവയിൽ നിന്ന് രക്ഷപ്പെടാനുള്ള വഴികളെക്കുറിച്ചും അറിയാൻ താഴെയുള്ള കാർഡുകൾ കാണുക.",
    viewGuide: "സുരക്ഷാ ഗൈഡ് കാണുക",
    testDetectBtn: "⚡ പരിശോധിച്ച് കണ്ടെത്തുക",

    // Scam Categories Data
    scams: {
      upi: {
        title: "യു.പി.ഐ & QR കോഡ് തട്ടിപ്പ്",
        icon: "💳",
        badge: "വളരെ സാധാരണ തട്ടിപ്പ്",
        summary: "പണം ലഭിക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യാനോ PIN എന്റർ ചെയ്യാനോ ആവശ്യപ്പെടുന്നു.",
        whatHappened: "ആരെങ്കിലും നിങ്ങളെ വിളിച്ച് 'അബദ്ധത്തിൽ നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം അയച്ചു, അത് തിരികെ തരാൻ അല്ലെങ്കിൽ പണം ലഭിക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യൂ' എന്ന് പറയും.",
        whyDangerous: "ഓർക്കുക: നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പണം ലഭിക്കാൻ ഒരിക്കലും UPI PIN നൽകേണ്ടതില്ല! PIN അടടിച്ചാൽ നിങ്ങളുടെ പണം നഷ്ടപ്പെടും.",
        whatToDo: [
          "അറിഞ്ഞിരിക്കുക: പണം അയക്കാൻ മാത്രമാണ് PIN നമ്പർ നൽകേണ്ടത്, പണം സ്വീകരിക്കാൻ വേണ്ടതില്ല.",
          "പണം വന്നോ എന്ന് അറിയാൻ നിങ്ങളുടെ ഗൂഗിൾ പേ/ഫോൺപേ ആപ്പിലെ അക്കൗണ്ട് ബാലൻസ് നേരിട്ട് പരിശോധിക്കുക.",
          "PIN അടിക്കാൻ ആവശ്യപ്പെടുന്ന സന്ദേശങ്ങൾ നിരസിക്കുക."
        ],
        whatNotToDo: [
          "അപരിചിതർ അയക്കുന്ന QR കോഡുകൾ ഒരിക്കലും സ്കാൻ ചെയ്യരുത്.",
          "പണം കിട്ടാൻ ഫോൺ കോളിൽ നിൽക്കുമ്പോൾ UPI PIN അടിക്കരുത്.",
          "വ്യാജ പണമിടപാട് സ്ക്രീൻഷോട്ടുകൾ കണ്ട് വിശ്വസിക്കരുത്."
        ]
      },
      whatsapp: {
        title: "വാട്സാപ്പ് അടിയന്തര സഹായ തട്ടിപ്പ്",
        icon: "💬",
        badge: "വൈകാരിക തട്ടിപ്പ്",
        summary: "ബന്ധുക്കളോ മക്കളോ ആണെന്ന് വ്യാജേന അടിയന്തരമായി പണം ആവശ്യപ്പെടുന്നു.",
        whatHappened: "അപരിചിതമായ നമ്പറിൽ നിന്ന് 'അമ്മേ/അച്ഛാ, എന്റെ ഫോൺ നഷ്ടപ്പെട്ടു, ഇതെന്റെ പുതിയ നമ്പറാണ്. അപകടം പറ്റി ആശുപത്രിയിലാണ്, ഉടൻ 15,000 രൂപ അയക്കൂ' എന്ന സന്ദേശം വരുന്നു.",
        whyDangerous: "നിങ്ങളുടെ പരിഭ്രമവും ബന്ധുക്കളോടുള്ള സ്നേഹവും മുതലെടുത്ത് വേഗത്തിൽ പണം തട്ടിയെടുക്കാനാണ് ഇവർ ശ്രമിക്കുന്നത്.",
        whatToDo: [
          "സന്ദേശം അയച്ച വ്യക്തിയെ അവരുടെ പഴയ സാധാരണ ഫോൺ നമ്പറിലേക്ക് വിളിച്ച് ഉറപ്പ് വരുത്തുക.",
          "നിങ്ങളുടെ കുടുംബത്തിന് മാത്രം അറിയാവുന്ന രഹസ്യ ചോദ്യം ചോദിക്കുക.",
          "കുടുംബാംഗങ്ങളോട് സംസാരിച്ച ശേഷം മാത്രം പണം കൈമാറുക."
        ],
        whatNotToDo: [
          "ഭയന്നോ പരിഭ്രാന്തരായോ ഉടൻ പണം അയക്കരുത്.",
          "സ്ഥിരീകരിക്കാത്ത പുതിയ നമ്പറുകൾ സേവ് ചെയ്യരുത്.",
          "ചാറ്റിലൂടെ ബാങ്ക് വിവരങ്ങളോ OTP യോ പങ്കുവെക്കരുത്."
        ]
      },
      fakelink: {
        title: "വ്യാജ ലിങ്കുകളും APK ആപ്പുകളും",
        icon: "🔗",
        badge: "ഉയർന്ന അപകടസാധ്യത",
        summary: "സൗജന്യ റീച്ചാർജ്, സമ്മാനങ്ങൾ, വൈദ്യുതി ബിൽ എന്നിവയെക്കുറിച്ചുള്ള ലിങ്കുകൾ.",
        whatHappened: "സൗജന്യ സമ്മാനം ലഭിച്ചു, വൈദ്യുതി കണക്ഷൻ വിച്ഛേദിക്കാതിരിക്കാൻ ഉടൻ ബിൽ അടയ്ക്കൂ അല്ലെങ്കിൽ സിം കാർഡ് ബ്ലോക്കാകും എന്ന് കാണിച്ച് സന്ദേശം വരുന്നു.",
        whyDangerous: "ലിങ്കിൽ ക്ലിക്ക് ചെയ്താൽ നിങ്ങളുടെ ഫോണിൽ രഹസ്യമായി വൈറസ് ആപ്പുകൾ (APK) ഇൻസ്റ്റാൾ ആകുകയും ബാങ്ക് ഒ.ടി.പി അടക്കം തട്ടിയെടുക്കുകയും ചെയ്യും.",
        whatToDo: [
          "ഇത്തരം സന്ദേശങ്ങൾ ഉടൻ ഡിലീറ്റ് ചെയ്യുക.",
          "സർക്കാർ പദ്ധതികൾ '.gov.in' എന്ന് അവസാനിക്കുന്ന ഔദ്യോഗിക വെബ്സൈറ്റുകളിൽ മാത്രം പരിശോധിക്കുക.",
          "വൈദ്യുതി ബില്ലുകൾ KSEB ഔദ്യോഗിക ആപ്പ് വഴി മാത്രം അടയ്ക്കുക."
        ],
        whatNotToDo: [
          "അപരിചിത സന്ദേശങ്ങളിലെ ലിങ്കുകളിൽ ഒരിക്കലും ക്ലിക്ക് ചെയ്യരുത്.",
          "ലിങ്കുകൾ വഴി ഫോണിലേക്ക് ആപ്പുകൾ ഡൗൺലോഡ് ചെയ്യരുത്.",
          "ആധാർ നമ്പറോ അക്കൗണ്ട് വിവരങ്ങളോ ഫോമുകളിൽ പൂരിപ്പിച്ചു നൽകരുത്."
        ]
      },
      bank: {
        title: "ബാങ്ക് & KYC ബ്ലോക്ക് തട്ടിപ്പ്",
        icon: "🏦",
        badge: "അക്കൗണ്ട് വിവര ചോർത്തൽ",
        summary: "ബാങ്ക് അക്കൗണ്ടോ എടിഎം കാർഡോ ഇന്ന് ബ്ലോക്കാകും എന്ന വ്യാജ ഭീഷണി.",
        whatHappened: "ബാങ്ക് മാനേജർ എന്ന് പറഞ്ഞ് ഒരാൾ വിളിക്കുകയും, KYC അപ്ഡേറ്റ് ചെയ്തില്ലെങ്കിൽ 2 മണിക്കൂറിനുള്ളിൽ അക്കൗണ്ട് ബ്ലോക്കാകും എന്ന് ഭയപ്പെടുത്തി OTP ചോദിക്കുകയും ചെയ്യുന്നു.",
        whyDangerous: "യഥാർത്ഥ ബാങ്ക് ഉദ്യോഗസ്ഥർ ഫോണിലൂടെ നിങ്ങളുടെ OTP യോ കാർഡ് വിവരങ്ങളോ ഒരിക്കലും ചോദിക്കില്ല.",
        whatToDo: [
          "ഫോൺ കോൾ ഉടൻ വിച്ഛേദിക്കുക (Cut ചെയ്യുക).",
          "നിങ്ങളുടെ ബാങ്ക് ശാഖ സന്ദർശിച്ചോ ബാങ്ക് പാസ്ബുക്കിലെ നമ്പറിലോ ബന്ധപ്പെടുക.",
          "ഈ ഫോൺ നമ്പർ 1930 ഹെൽപ്പ് ലൈനിൽ റിപ്പോർട്ട് ചെയ്യുക."
        ],
        whatNotToDo: [
          "ഫോൺ കോളിൽ ആർക്കും OTP യോ ATM PIN നമ്പറോ നൽകരുത്.",
          "ബാങ്ക് ഓഫീസർ എന്ന് അവകാശപ്പെടുന്ന കോളർമാരെ വിശ്വസിക്കരുത്.",
          "AnyDesk, TeamViewer തുടങ്ങിയ ആപ്പുകൾ ഫോണിൽ ഇൻസ്റ്റാൾ ചെയ്യരുത്."
        ]
      },
      fakeaccount: {
        title: "വ്യാജ പ്രൊഫൈലുകളും സുഹൃത്തുക്കളും",
        icon: "👤",
        badge: "സോഷ്യൽ മീഡിയ തട്ടിപ്പ്",
        summary: "നിങ്ങളുടെ സുഹൃത്തുക്കളുടെയോ ബന്ധുക്കളുടെയോ ഫോട്ടോ വെച്ചുള്ള വ്യാജ ഫേസ്ബുക്ക് അക്കൗണ്ട്.",
        whatHappened: "നിങ്ങൾക്ക് പരിചയമുള്ള ആളുടെ പേരിൽ പുതിയ ഫ്രണ്ട് റിക്വസ്റ്റ് വരുന്നു. ശേഷം അടിയന്തര ആവശ്യത്തിന് പണം കടം ചോദിക്കുന്നു.",
        whyDangerous: "നിങ്ങളുടെ വിശ്വാസ്യത മുതലെടുത്ത് സുഹൃത്തിന്റെ പേരിൽ തട്ടിപ്പുകാർ പണം കവരുന്നു.",
        whatToDo: [
          "സുഹൃത്തിനെ നേരിട്ട് സാധാരണ ഫോൺ കോളിൽ വിളിച്ച് പുതിയ അക്കൗണ്ട് തുടങ്ങിയോ എന്ന് ചോദിക്കുക.",
          "ആ വ്യാജ അക്കൗണ്ട് സോഷ്യൽ മീഡിയയിൽ റിപ്പോർട്ട് (Report) ചെയ്യുക.",
          "മറ്റു സുഹൃത്തുക്കൾക്കും മുന്നറിയിപ്പ് നൽകുക."
        ],
        whatNotToDo: [
          "നിലവിലുള്ള സുഹൃത്തുക്കളുടെ വ്യാജ അക്കൗണ്ട് റിക്വസ്റ്റുകൾ സ്വീകരിക്കരുത്.",
          "ശബ്ദമോ നേരിട്ടോ സ്ഥിരീകരിക്കാതെ പണം നൽകരുത്.",
          "വ്യക്തിഗത വിവരങ്ങൾ കൈമാറരുത്."
        ]
      },
      fakecall: {
        title: "ഡിജിറ്റൽ അറസ്റ്റ് & വ്യാജ പോലീസ് കോൾ",
        icon: "📞",
        badge: "ഭീഷണിപ്പെടുത്തിയുള്ള തട്ടിപ്പ്",
        summary: "പോലീസ് അല്ലെങ്കിൽ കസ്റ്റംസ് ഉദ്യോഗസ്ഥരാണെന്ന് പറഞ്ഞ് കേസിൽപ്പെടുത്തുമെന്ന് ഭീഷണിപ്പെടുത്തുന്നു.",
        whatHappened: "പോലീസ് ആണെന്ന് പറഞ്ഞു വീഡിയോ കോൾ വരുന്നു. നിങ്ങളുടെ പേരിൽ മയക്കുമരുന്ന് പാഴ്സൽ ഉണ്ടെന്നും അറസ്റ്റ് ചെയ്യാതിരിക്കാൻ പണം നൽകണമെന്നും ഭീഷണിപ്പെടുത്തുന്നു.",
        whyDangerous: "ഇന്ത്യയിലെ പോലീസോ സി.ബി.ഐ യോ ഒരിക്കലും വാട്സാപ്പ് വീഡിയോ കോളിൽ ഡിജിറ്റൽ അറസ്റ്റ് ചെയ്യുകയോ പണം ചോദിക്കുകയോ ഇല്ല.",
        whatToDo: [
          "ധൈര്യമായിരിക്കുക: വീഡിയോ കോളിലൂടെ പോലീസ് അറസ്റ്റ് ചെയ്യാറില്ല എന്ന് മനസ്സിലാക്കുക.",
          "ഫോൺ കോൾ ഉടൻ വിച്ഛേദിച്ച് 1930 നമ്പറിലോ അടുത്തുള്ള പോലീസ് സ്റ്റേഷനിലോ വിവരമറിയിക്കുക.",
          "കുടുംബാംഗങ്ങളെയോ അയൽക്കാരെയോ വിവരമറിയിക്കുക."
        ],
        whatNotToDo: [
          "വീഡിയോ കോളിൽ ആവശ്യപ്പെടുന്ന പിഴയോ പണമോ നൽകരുത്.",
          "ഭയം കാരണം ഫോൺ സംഭാഷണം തുടരരുത്.",
          "ഒറ്റയ്ക്ക് ഭയന്ന് വിവരങ്ങൾ രഹസ്യമായി വെക്കരുത്."
        ]
      }
    },

    // Modal Titles
    modalHappened: "സംഭവിച്ചത് എന്താണ്?",
    modalDangerous: "എന്തുകൊണ്ട് ഇത് അപകടകരമാണ്?",
    modalToDo: "നിങ്ങൾ ചെയ്യേണ്ടവ (SHOULD DO)",
    modalNotToDo: "നിങ്ങൾ ചെയ്യാൻ പാടില്ലാത്തവ (NOT DO)",
    closeButton: "വിവരണം അടയ്ക്കുക",

    // Interactive Detection Center
    detectorSectionTitle: "തത്സമയ തട്ടിപ്പ് പരിശോധനാ കേന്ദ്രം",
    detectorSectionSub: "തത്സമയ പരിശോധനയ്ക്കായി താഴെയുള്ള 6 തട്ടിപ്പ് വിഭാഗങ്ങളിൽ ഒന്ന് തിരഞ്ഞെടുക്കൂ.",
    tabUpi: "1. UPI & QR കോഡ്",
    tabWhatsapp: "2. വാട്സാപ്പ് അടിയന്തര സന്ദേശം",
    tabFakelink: "3. വ്യാജ ലിങ്കും APK യും",
    tabBank: "4. ബാങ്ക് & KYC ബ്ലോക്ക്",
    tabFakeaccount: "5. വ്യാജ പ്രൊഫൈൽ",
    tabFakecall: "6. ഡിജിറ്റൽ അറസ്റ്റ്",

    // Category 1: UPI & QR
    upiTitle: "യു.പി.ഐ & QR കോഡ് തട്ടിപ്പ് പരിശോധന",
    upiSub: "QR കോഡ് ഇമേജ് അപ്‌ലോഡ് ചെയ്തോ UPI ലിങ്ക് നൽകിയോ തട്ടിപ്പ് പരിശോധിക്കുക.",
    uploadQrBtn: "QR കോഡ് ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക (PNG, JPG)",
    dragDropQr: "QR കോഡ് ഇമേജ് ഇവിടെ ഡ്രാഗ് ചെയ്യുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യുക",
    removeFile: "ഇമേജ് ഒഴിവാക്കുക",
    qrDecodedLabel: "QR കോഡിൽ നിന്ന് ലഭിച്ച വിവരങ്ങൾ:",
    manualUpiLabel: "അല്ലെങ്കിൽ UPI ലിങ്ക് / വെബ് ലിങ്ക് ഇവിടെ നൽകുക:",
    manualUpiPlaceholder: "ഉദാ: upi://pay?pa=scammer@okaxis&pn=PrizeWinner&am=25000&tn=Cashback",
    upiIntentLabel: "നിങ്ങളോട് എന്താണ് പറഞ്ഞത്?",
    upiIntentReceive: "'പണം അക്കൗണ്ടിൽ ലഭിക്കും / ക്യാഷ്ബാക്ക് ലഭിക്കും' എന്ന് പറഞ്ഞു",
    upiIntentPay: "ഞാൻ ഒരു കടയിലോ മറ്റോ പണം അയക്കുകയാണ്",
    upiSample1: "പണം ലഭിക്കുമെന്ന പേരിലുള്ള വ്യാജ QR",
    upiSample2: "സമ്മാനത്തുക ലഭിക്കുമെന്ന തട്ടിപ്പ് QR",
    upiSample3: "സാധാരണ കടയിലെ സുരക്ഷിത QR",
    analyzeQrBtn: "QR കോഡ് പരിശോധിക്കുക",
    clearQrBtn: "മായ്ക്കുക",
    unreadableQrError: "ഈ ഇമേജിൽ നിന്ന് QR കോഡ് വായിക്കാൻ കഴിഞ്ഞില്ല. വ്യക്തമായ ഇമേജ് നൽകുക അല്ലെങ്കിൽ ലിങ്ക് നേരിട്ട് ടൈപ്പ് ചെയ്യുക.",
    upiPinSafetyAlert: "⚠️ വളരെ പ്രധാനം: പണം നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് ലഭിക്കാൻ ഒരിക്കലും UPI PIN അടിക്കേണ്ടതില്ല! PIN അടിച്ചാൽ പണം നഷ്ടപ്പെടും.",

    // Category 2: WhatsApp Emergency
    waTitle: "വാട്സാപ്പ് അടിയന്തര സഹായ തട്ടിപ്പ് പരിശോധന",
    waSub: "പരിചയമില്ലാത്ത നമ്പറിൽ നിന്നുള്ള അടിയന്തര സന്ദേശങ്ങളോ ചാറ്റ് സ്ക്രീൻഷോട്ടുകളോ പരിശോധിച്ച് ഉറപ്പാക്കുക.",
    waTextPlaceholder: "വാട്സാപ്പ് സന്ദേശം ഇവിടെ നൽകുക... (ഉദാ: 'അച്ഛാ, എന്റെ ഫോൺ നഷ്ടപ്പെട്ടു, ആശുപത്രിയിലാണ്, അടിയന്തരമായി ₹15,000 അയക്കൂ')",
    uploadWaScreenshot: "ഓപ്ഷണൽ: ചാറ്റ് സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക (PNG, JPG)",
    extractOcrBtn: "സ്ക്രീൻഷോട്ടിൽ നിന്ന് വാചകം എടുക്കുക (OCR)",
    ocrProcessing: "സ്ക്രീൻഷോട്ട് വായിക്കുന്നു...",
    ocrSuccess: "സ്ക്രീൻഷോട്ടിൽ നിന്ന് വാചകം എടുത്തു! മുകളിലെ ബോക്സിൽ പരിശോധിച്ച് ഉറപ്പാക്കുക.",
    ocrFailed: "സ്ക്രീൻഷോട്ടിലെ അക്ഷരങ്ങൾ വ്യക്തമല്ല. ദയവായി സന്ദേശം നേരിട്ട് ടൈപ്പ് ചെയ്യുക.",
    waSample1: "ആശുപത്രി / അപകട അടിയന്തരാവസ്ഥ",
    waSample2: "ഫോൺ നഷ്ടപ്പെട്ടെന്ന വ്യാജ സന്ദേശം",
    waSample3: "സാധാരണ കുടുംബ സന്ദേശം",
    analyzeWaBtn: "സന്ദേശം പരിശോധിക്കുക",
    clearWaBtn: "മായ്ക്കുക",
    waVerifyNotice: "⚠️ പ്രധാന മുൻകരുതൽ: പണം അയക്കുന്നതിന് മുൻപ് ആ വ്യക്തിയെ അവരുടെ പഴയ ഫോൺ നമ്പറിലേക്ക് നേരിട്ട് വിളിച്ച് ഉറപ്പ് വരുത്തുക.",

    // Category 3: Fake Link & APK
    linkTitle: "വ്യാജ ലിങ്കുകളും APK ആപ്പുകളും പരിശോധിക്കുക",
    linkSub: "ലിങ്കുകൾ തുറക്കാതെ തന്നെ അവ സുരക്ഷിതമാണോ എന്ന് പരിശോധിക്കുക.",
    linkInputPlaceholder: "വെബ് വിലാസം (URL) ഇവിടെ നൽകുക... (ഉദാ: http://sbi-kyc-verify.xyz/update.apk)",
    linkSample1: "വ്യാജ ബാങ്ക് APK ഡൗൺലോഡ് ലിങ്ക്",
    linkSample2: "സൗജന്യ റീച്ചാർജ് ഷോർട്ട് ലിങ്ക്",
    linkSample3: "ഔദ്യോഗിക സൈബർ പോർട്ടൽ",
    analyzeLinkBtn: "ലിങ്ക് പരിശോധിക്കുക",
    clearLinkBtn: "മായ്ക്കുക",
    linkSafetyWarning: "സുരക്ഷിത പരിശോധന: സൈബർകിയോസ്ക് AI സംശയകരമായ ലിങ്കുകൾ തുറക്കുകയോ ഫയലുകൾ ഡൗൺലോഡ് ചെയ്യുകയോ ചെയ്യില്ല.",

    // Category 4: Bank & KYC Block
    bankTitle: "ബാങ്ക് & KYC ബ്ലോക്ക് തട്ടിപ്പ് പരിശോധന",
    bankSub: "ബാങ്ക് അക്കൗണ്ട് ബ്ലോക്ക് ആകുമെന്ന സന്ദേശങ്ങളോ ഫോൺ സംഭാഷണങ്ങളോ പരിശോധിച്ച് ഉറപ്പാക്കുക.",
    bankSelectLabel: "ബാങ്ക് തിരഞ്ഞെടുക്കുക (ഓപ്ഷണൽ):",
    bankSelectPlaceholder: "-- ബാങ്ക് തിരഞ്ഞെടുക്കുക --",
    bankInputPlaceholder: "ബാങ്ക് SMS അല്ലെങ്കിൽ സന്ദേശം ഇവിടെ പേസ്റ്റ് ചെയ്യുക...",
    uploadBankScreenshot: "ഓപ്ഷണൽ: ബാങ്ക് SMS സ്ക്രീൻഷോട്ട്",
    bankSample1: "അക്കൗണ്ട് KYC ബ്ലോക്ക് ഭീഷണി",
    bankSample2: "എടിഎം കാർഡ് ബ്ലോക്ക് സന്ദേശം",
    bankSample3: "സാധാരണ ബാങ്ക് ഇടപാട് സന്ദേശം",
    analyzeBankBtn: "പരിശോധിക്കുക",
    clearBankBtn: "മായ്ക്കുക",
    bankPrivacyReminder: "🔒 സ്വകാര്യതാ ഉറപ്പ്: സൈബർകിയോസ്ക് നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ട് നമ്പറോ, PIN നമ്പറോ, പാസ്‌വേഡോ ഒരിക്കലും ചോദിക്കില്ല.",

    // Category 5: Fake Profile & Impersonation
    profileTitle: "വ്യാജ പ്രൊഫൈലുകളും ആൾമാറാട്ടവും കണ്ടെത്തുക",
    profileSub: "സോഷ്യൽ മീഡിയയിൽ സുഹൃത്തുക്കളുടെ പേരിൽ പണം ചോദിച്ചു വരുന്ന സന്ദേശങ്ങൾ പരിശോധിക്കുക.",
    profileNameLabel: "പ്രൊഫൈലിലെ പേര് (ഓപ്ഷണൽ):",
    profileNamePlaceholder: "ഉദാ: ഡോ. രമേഷ് കുമാർ",
    profileHandleLabel: "യൂസർനെയിം / ഹാൻഡിൽ (ഓപ്ഷണൽ):",
    profileHandlePlaceholder: "ഉദാ: @ramesh_loan892",
    profilePlatformLabel: "സോഷ്യൽ പ്ലാറ്റ്‌ഫോം:",
    profileMsgLabel: "വന്ന സംശയകരമായ സന്ദേശം (ആവശ്യമാണ്):",
    profileMsgPlaceholder: "ഈ പ്രൊഫൈലിൽ നിന്ന് വന്ന സന്ദേശം ഇവിടെ നൽകുക... (ഉദാ: 'എയർപോർട്ടിൽ വെച്ച് പേഴ്സ് നഷ്ടപ്പെട്ടു, ₹5,000 ഗൂഗിൾ പേ ചെയ്യാമോ?')",
    uploadProfilePhoto: "പ്രൊഫൈൽ ഫോട്ടോ / സ്ക്രീൻഷോട്ട്",
    toggleCompareLabel: "ഓപ്ഷണൽ: യഥാർത്ഥ പ്രൊഫൈലുമായി താരതമ്യം ചെയ്യുക",
    originalProfilePhoto: "യഥാർത്ഥ പ്രൊഫൈൽ ഫോട്ടോ",
    originalProfileHandle: "യഥാർത്ഥ യൂസർനെയിം (ഉദാ: @ramesh_real)",
    profileSample1: "പണം കടം ചോദിക്കുന്ന വ്യാജ സുഹൃത്ത്",
    profileSample2: "ഡോക്ടറാണെന്ന് നടിച്ചുള്ള അടിയന്തര സന്ദേശം",
    profileSample3: "സാധാരണ പ്രൊഫൈൽ വിവരങ്ങൾ",
    analyzeProfileBtn: "പ്രൊഫൈൽ പരിശോധിക്കുക",
    clearProfileBtn: "മായ്ക്കുക",
    profileLimitationNotice: "പരിമിതി മുന്നറിയിപ്പ്: ഈ ഉപകരണം തദ്ദേശീയമായി വാചകങ്ങളും വിവരങ്ങളും പരിശോധിക്കുന്നു. സോഷ്യൽ മീഡിയ ഡാറ്റാബേസ് ഇതിൽ പരിശോധിക്കുന്നില്ല. മുന്നറിയിപ്പുകൾ ഇല്ലെങ്കിലും നേരിട്ട് സംസാരിച്ച് ഉറപ്പാക്കുക.",

    // Category 6: Digital Arrest & Fake Police Call
    arrestTitle: "ഡിജിറ്റൽ അറസ്റ്റ് & വ്യാജ പോലീസ് കോൾ കണ്ടെത്തുക",
    arrestSub: "പോലീസ് അല്ലെങ്കിൽ കസ്റ്റംസ് ഉദ്യോഗസ്ഥരാണെന്ന് പറഞ്ഞ് കേസിൽപ്പെടുത്തുമെന്ന് ഭീഷണിപ്പെടുത്തുന്ന കോളുകൾ പരിശോധിക്കുക.",
    arrestTranscriptLabel: "ഫോൺ സംഭാഷണ വിവരങ്ങൾ അല്ലെങ്കിൽ നോട്ട്സ്:",
    arrestTranscriptPlaceholder: "ഫോൺ കോളിൽ പറഞ്ഞ കാര്യങ്ങൾ ഇവിടെ എഴുതുക... (ഉദാ: 'സിബിഐ ഓഫീസറാണെന്നും നിങ്ങളുടെ പേരിൽ ലഹരിമരുന്ന് പാഴ്സൽ ഉണ്ടെന്നും പറഞ്ഞ് വീഡിയോ കോളിൽ തുടരാൻ നിർബന്ധിച്ചു')",
    arrestDeptLabel: "അവകാശപ്പെട്ട വകുപ്പ് (ഓപ്ഷണൽ):",
    arrestReasonLabel: "ആരോപിച്ച കുറ്റം (ഓപ്ഷണൽ):",
    uploadAudioLabel: "ഓപ്ഷണൽ: കോൾ ഓഡിയോ റെക്കോർഡിംഗ് (.mp3, .wav, .m4a)",
    dictateNotesBtn: "🎙️ ശബ്ദത്തിലൂടെ സംസാരിച്ച് എഴുതുക",
    arrestSample1: "വ്യാജ സിബിഐ ലഹരിമരുന്ന് പാഴ്സൽ ഭീഷണി",
    arrestSample2: "സിം കാർഡ് വിച്ഛേദിക്കൽ ഭീഷണി",
    arrestSample3: "സാധാരണ കൊറിയർ അന്വേഷണം",
    analyzeArrestBtn: "ഭീഷണി കോൾ പരിശോധിക്കുക",
    clearArrestBtn: "മായ്ക്കുക",
    arrestTruthBanner: "100% തട്ടിപ്പ് മുന്നറിയിപ്പ്: ഇന്ത്യൻ നിയമപ്രകാരം പോലീസോ സിബിഐയോ വീഡിയോ കോളിലൂടെ 'ഡിജിറ്റൽ അറസ്റ്റ്' ചെയ്യാറില്ല, പണം ആവശ്യപ്പെടാറുമില്ല.",
    audioLimitationNotice: "ഓഡിയോ പരിശോധിച്ചു. ശ്രദ്ധിക്കുക: ഓഫ്‌ലൈൻ ഓഡിയോ ട്രാൻസ്ക്രിപ്ഷൻ സാധ്യമല്ല. സംഭാഷണത്തിലെ പ്രധാന കാര്യങ്ങൾ മുകളിലെ ബോക്സിൽ എഴുതുക.",

    // Results & Feedback
    resultTitle: "പരിശോധനാ ഫലം (Risk Result)",
    riskLow: "കുറഞ്ഞ അപകടസാധ്യത (LOW RISK)",
    riskMedium: "മിതമായ അപകടസാധ്യത (MEDIUM RISK)",
    riskHigh: "വളരെ ഉയർന്ന അപകടസാധ്യത (HIGH RISK DANGER)",
    riskLowDesc: "ഈ സന്ദേശത്തിൽ പ്രാഥമികമായി അപകടകരമായ സൂചനകൾ കണ്ടില്ല. എങ്കിലും ജാഗ്രത പാലിക്കുക.",
    riskMediumDesc: "ശ്രദ്ധിക്കുക! ഈ സന്ദേശത്തിൽ സംശയകരമായ വിവരങ്ങളോ തിടുക്കം കൂട്ടുന്ന വാചകങ്ങളോ ഉണ്ട്.",
    riskHighDesc: "മുന്നറിയിപ്പ്: ഇത് ഒരു തട്ടിപ്പ് ആകാൻ വളരെ ഉയർന്ന സാധ്യതയുണ്ട്! ലിങ്കുകളിൽ ക്ലിക്ക് ചെയ്യുകയോ പണം അയക്കുകയോ ചെയ്യരുത്!",
    reasonsFound: "കണ്ടെത്തിയ അപകട സൂചനകൾ:",
    adviceTitle: "നിങ്ങൾ ചെയ്യേണ്ട മുൻകരുതൽ:",
    technicalDetailsTitle: "സാങ്കേതിക വിവരങ്ങൾ:",
    onlineModeNotice: "കണക്റ്റഡ്: സൈബർകിയോസ്ക് പൈത്തൺ ബാക്കെൻഡ് ഉപയോഗിച്ച് പരിശോധിച്ചു",
    offlineModeNotice: "ഓഫ്‌ലൈൻ മോഡ്: ലോക്കൽ ബ്രൗസർ എഞ്ചിൻ ഉപയോഗിച്ച് പരിശോധിച്ചു",
    trySampleTitle: "പരിശോധിക്കാൻ മാതൃകകൾ:",

    // Emergency Section
    emergencyTitle: "അടിയന്തര സൈബർ സഹായവും ഹെൽപ്പ് ലൈനും",
    emergencySub: "നിങ്ങൾക്ക് പണം നഷ്ടപ്പെടുകയോ രഹസ്യ വിവരങ്ങൾ കൈമാറുകയോ ചെയ്തിട്ടുണ്ടെങ്കിൽ ആദ്യ 1-2 മണിക്കൂറിനുള്ളിൽ (Golden Hour) ഉടൻ പ്രതികരിക്കുക.",
    helplineNumber: "1930",
    helplineLabel: "ദേശീയ സൈബർ ക്രൈം ഹെൽപ്പ് ലൈൻ (ഇന്ത്യ)",
    helplineDesc: "തട്ടിപ്പുകാർ തട്ടിയടുത്ത പണം ബാങ്ക് അക്കൗണ്ടിൽ തന്നെ മരവിപ്പിക്കാൻ 24 മണിക്കുറും പ്രവർത്തിക്കുന്ന സൗജന്യ നമ്പർ.",
    callNowBtn: "1930 നമ്പറിലേക്ക് വിളിക്കുക",
    portalLink: "ഔദ്യോഗിക വെബ്സൈറ്റ്: cybercrime.gov.in",
    visitPortalBtn: "സൈബർ പോർട്ടൽ സന്ദർശിക്കുക",

    emergencyStepsTitle: "പണം നഷ്ടപ്പെട്ടാൽ ഉടൻ ചെയ്യേണ്ട 4 കാര്യങ്ങൾ:",
    step1Title: "1. 1930 നമ്പറിലേക്ക് ഉടൻ വിളിക്കുക",
    step1Desc: "തട്ടിപ്പുകാരന്റെ ബാങ്ക് അക്കൗണ്ടിലേക്ക് പണം മാറുന്നത് തടയാൻ ഉടൻ വിവരമറിയിക്കുക.",
    step2Title: "2. നിങ്ങളുടെ ബാങ്കിൽ അറിയിക്കുക",
    step2Desc: "കസ്റ്റമർ കെയറിൽ വിളിച്ച് എടിഎം കാർഡും നെറ്റ് ബാങ്കിംഗും ബ്ലോക്ക് ചെയ്യുക.",
    step3Title: "3. പരാതി രജിസ്റ്റർ ചെയ്യുക",
    step3Desc: "cybercrime.gov.in വെബ്സൈറ്റിലോ അടുത്തുള്ള പോലീസ് സ്റ്റേഷനിലോ ട്രാൻസാക്ഷൻ നമ്പർ സഹിതം പരാതി നൽകുക.",
    step4Title: "4. പാസ്‌വേഡുകൾ മാറ്റുക",
    step4Desc: "നിങ്ങളുടെ UPI PIN നമ്പറും ബാങ്കിംഗ് പാസ്‌വേഡുകളും ഉടൻ തന്നെ മാറ്റുക.",

    // SDG Section
    sdgTitle: "ഐക്യരാഷ്ട്രസഭയുടെ SDG 17 ലക്ഷ്യങ്ങൾ",
    sdgDesc: "സൈബർകിയോസ്ക് AI പദ്ധതി മുതിർന്ന പൗരന്മാർക്കും ഗ്രാമീണ ജനവിഭാഗങ്ങൾക്കും സൗജന്യ സൈബർ ബോധവൽക്കരണം നൽകിക്കൊണ്ട് ഡിജിറ്റൽ സുരക്ഷയും സമത്വവും (SDG 10, SDG 17) ഉറപ്പാക്കുന്നു.",

    // Footer
    footerText: "സൈബർകിയോസ്ക് AI • ജനക്ഷേമ ഡിജിറ്റൽ സുരക്ഷാ ദൗത്യം • തികച്ചും സൗജന്യം"
  }
};
