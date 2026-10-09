"""
Automated Test Suite for CyberKiosk AI - 6 Scam Categories & Frontend Serving
"""
import sys
from backend import app

def run_tests():
    client = app.test_client()
    passed = 0

    # 1. Root Homepage & Static Assets Serving
    res = client.get('/')
    assert res.status_code == 200, "Root URL / failed"
    html_content = res.get_data(as_text=True)
    assert "CyberKiosk AI" in html_content, "index.html missing brand title"
    passed += 1
    print("Test 1 Passed: GET / serves index.html (200 OK)")

    res_css = client.get('/style.css')
    assert res_css.status_code == 200, "style.css serving failed"
    passed += 1
    print("Test 2 Passed: GET /style.css served (200 OK)")

    res_js = client.get('/app.js')
    assert res_js.status_code == 200, "app.js serving failed"
    passed += 1
    print("Test 3 Passed: GET /app.js served (200 OK)")

    # 2. Health check
    res = client.get('/api/health')
    assert res.status_code == 200, "Health check failed"
    passed += 1
    print("Test 4 Passed: /api/health OK")

    # 3. UPI QR Analysis
    res = client.post('/api/analyze-upi', json={
        'payload': 'upi://pay?pa=scammer@ybl&pn=QuickRefund&am=4999&tn=Cashback',
        'intent': 'receive'
    })
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] == 'HIGH', "UPI QR check failed"
    passed += 1
    print("Test 5 Passed: /api/analyze-upi identified collect request scam")

    # 4. WhatsApp Emergency
    res = client.post('/api/analyze-message', json={
        'text': 'Hi Dad, lost my phone, new number. Hospital accident, need 15000 urgently.',
        'category': 'whatsapp'
    })
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] == 'HIGH', "WhatsApp check failed"
    passed += 1
    print("Test 6 Passed: /api/analyze-message (WhatsApp) detected emergency scam")

    # 5. Fake Link & APK
    res = client.post('/api/analyze-url', json={'url': 'http://sbi-kyc-verify.xyz/update.apk'})
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] == 'HIGH', "URL check failed"
    passed += 1
    print("Test 7 Passed: /api/analyze-url detected fake APK scam")

    # 6. Bank & KYC
    res = client.post('/api/analyze-message', json={
        'text': 'Dear customer, your bank account is blocked today due to pending KYC. Call 9876543210.',
        'category': 'bank',
        'bank_name': 'SBI'
    })
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] in ['MEDIUM', 'HIGH'], "Bank KYC check failed"
    passed += 1
    print("Test 8 Passed: /api/analyze-message (Bank KYC) detected KYC threat")

    # 7. Fake Profile
    res = client.post('/api/analyze-profile', json={
        'profile_name': 'Rajesh Kumar',
        'username': 'rajesh_kumar_loan892',
        'platform': 'Facebook',
        'message': 'Hey bro, need emergency money ₹10,000 for hospital, can you GPay me?'
    })
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] == 'HIGH', "Profile check failed"
    passed += 1
    print("Test 9 Passed: /api/analyze-profile detected impersonation money request")

    # 8. Digital Arrest
    res = client.post('/api/analyze-digital-arrest', json={
        'transcript': 'CBI Officer said drug parcel found, stay on Skype video call under digital arrest and transfer funds to RBI.',
        'department': 'CBI',
        'reason': 'Drug parcel'
    })
    data = res.get_json()
    assert res.status_code == 200 and data['risk_level'] == 'HIGH', "Digital Arrest check failed"
    passed += 1
    print("Test 10 Passed: /api/analyze-digital-arrest detected extortion & fake police threat")

    print(f"\nSUCCESS: All {passed} tests passed!")

if __name__ == '__main__':
    run_tests()
