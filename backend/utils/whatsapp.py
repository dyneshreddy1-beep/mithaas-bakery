import os
import sys
import httpx
from dotenv import load_dotenv

# Force UTF-8 stdout encoding on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


# Explicitly load .env from absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, "..", ".env")
load_dotenv(dotenv_path)

def format_whatsapp_chat_id(phone: str) -> str:
    # Remove all non-digit characters
    digits = "".join([c for c in phone if c.isdigit()])
    if digits.startswith("00"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = digits[1:]
    
    if len(digits) == 10:
        digits = "91" + digits
        
    return f"{digits}@c.us"

async def send_whatsapp_message(to_phone: str, message_body: str) -> dict:
    instance_id = os.getenv("GREEN_API_INSTANCE_ID")
    token = os.getenv("GREEN_API_TOKEN")
    gateway = os.getenv("WHATSAPP_GATEWAY", "greenapi")
    
    print(f"[GREENAPI DEBUG] Loaded Instance ID: '{instance_id}'")
    print(f"[GREENAPI DEBUG] Loaded Token length: {len(token) if token else 0}")
    print(f"[GREENAPI DEBUG] Loaded Gateway: '{gateway}'")
    
    chat_id = format_whatsapp_chat_id(to_phone)
    
    print(f"\n--- GREEN API WHATSAPP TRIGGERED ---")
    print(f"To Chat ID: {chat_id}")
    print(f"Gateway: {gateway}")
    print(f"Message:\n{message_body}")
    print("------------------------------------\n")
    
    if gateway != "greenapi":
        print(f"[SIMULATION] Skipping real Green API call since gateway is set to '{gateway}'.")
        return {"status": "Simulated", "message": "Simulation bypass"}
        
    if not instance_id or not token:
        print("[MOCK WHATSAPP] GREEN_API_INSTANCE_ID or GREEN_API_TOKEN is missing in .env. Notification simulated.")
        return {"status": "Failed (Missing Config)", "message": "Missing credentials"}
        
    url = f"https://api.green-api.com/waInstance{instance_id}/sendMessage/{token}"
    
    payload = {
        "chatId": chat_id,
        "message": message_body
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=15.0)
            print("[GREENAPI RESPONSE]:", response.status_code, response.text, flush=True)
            
            if response.status_code == 200:
                res_data = response.json()
                if res_data.get("idMessage") or res_data.get("sent"):
                    print(f"[GREENAPI SUCCESS] Message successfully dispatched! Msg ID: {res_data.get('idMessage', 'N/A')}", flush=True)
                    return {"status": "Delivered", "messageId": res_data.get("idMessage", "N/A"), "raw": res_data}
            
            print(f"[GREENAPI ERROR] Dispatch failed. Status Code: {response.status_code}", flush=True)
            print(f"[GREENAPI ERROR] Response: {response.text}", flush=True)
            print(f"[GREENAPI ERROR] URL Target: {url.replace(token, 'TOKEN_HIDDEN') if token else url}", flush=True)
            return {"status": f"Failed ({response.status_code})", "message": response.text}
                
    except Exception as e:
        print(f"[GREENAPI EXCEPTION] Exception raised during dispatch: {e}", flush=True)
        return {"status": "Failed (Exception)", "message": str(e)}
