import urllib.request
import json

def test_live_server():
    # 1. Test root URL /
    with urllib.request.urlopen("http://127.0.0.1:5000/") as response:
        status = response.getcode()
        html = response.read().decode('utf-8')
        assert status == 200
        assert "CyberKiosk AI" in html
        print("PASS: Root URL http://127.0.0.1:5000/ returns HTTP 200 with index.html")

    # 2. Test static style.css
    with urllib.request.urlopen("http://127.0.0.1:5000/style.css") as response:
        assert response.getcode() == 200
        print("PASS: http://127.0.0.1:5000/style.css returns HTTP 200")

    # 3. Test static app.js
    with urllib.request.urlopen("http://127.0.0.1:5000/app.js") as response:
        assert response.getcode() == 200
        print("PASS: http://127.0.0.1:5000/app.js returns HTTP 200")

    # 4. Test API endpoint /api/health
    with urllib.request.urlopen("http://127.0.0.1:5000/api/health") as response:
        assert response.getcode() == 200
        data = json.loads(response.read().decode('utf-8'))
        assert data["status"] == "ok"
        print(f"PASS: http://127.0.0.1:5000/api/health returns HTTP 200 ({data['service']})")

    # 5. Test API endpoint /api/analyze-upi via POST
    req = urllib.request.Request(
        "http://127.0.0.1:5000/api/analyze-upi",
        data=json.dumps({"payload": "upi://pay?pa=scam@okaxis&am=5000", "intent": "receive"}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as response:
        assert response.getcode() == 200
        data = json.loads(response.read().decode('utf-8'))
        assert data["risk_level"] == "HIGH"
        print("PASS: http://127.0.0.1:5000/api/analyze-upi returns HTTP 200 (HIGH RISK)")

    print("\nALL LIVE SERVER TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_live_server()
