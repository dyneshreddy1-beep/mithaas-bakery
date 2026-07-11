import os
import sys
import json
import random
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, HTTPException, Response, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv
from pydantic import BaseModel

# Force UTF-8 stdout encoding on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


# Load env variables from absolute directory path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, "..", ".env")
load_dotenv(dotenv_path)

# Verify loaded configs
print(f"[ENV_LOAD] Loaded WHATSAPP_GATEWAY: {os.getenv('WHATSAPP_GATEWAY')}")
print(f"[ENV_LOAD] Loaded GREEN_API_INSTANCE_ID: {os.getenv('GREEN_API_INSTANCE_ID')}")
print(f"[ENV_LOAD] Loaded BREVO_API_KEY: {'Configured' if os.getenv('BREVO_API_KEY') else 'NOT CONFIGURED'}")

# Pydantic Schemas for validation
class CustomerSchema(BaseModel):
    name: str
    email: str
    phone: str
    address: str

class ItemSchema(BaseModel):
    productId: str
    name: str
    weight: str
    quantity: int
    price: float
    total: float

class OrderCreateSchema(BaseModel):
    customer: CustomerSchema
    items: list[ItemSchema]
    subtotal: float
    shipping: float
    tax: float
    total: float
    paymentMethod: str
    shippingMethod: str
    fulfillment_method: str = "delivery"
    payment_method: str = "upi"

app = FastAPI()

# Configure CORS inline
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
LOGS_FILE = os.path.join(DATA_DIR, "whatsapp_logs.json")

# Ensure data dir exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initial Products
INITIAL_PRODUCTS = [
  { "id": "p1", "slug": "kaju-katli", "name": "Kaju Katli", "category": "Kaju Sweets", "price": 720 },
  { "id": "p2", "slug": "motichoor-laddu", "name": "Motichoor Laddu", "category": "Milk Sweets", "price": 540 },
  { "id": "p3", "slug": "mysore-pak", "name": "Royal Mysore Pak", "category": "Milk Sweets", "price": 480 },
  { "id": "p4", "slug": "rasgulla", "name": "Bengali Rasgulla", "category": "Milk Sweets", "price": 360 },
  { "id": "p5", "slug": "dry-fruit-laddu", "name": "Dry Fruit Laddu", "category": "Dry Fruit", "price": 890 },
  { "id": "p6", "slug": "milk-cake", "name": "Alwari Milk Cake", "category": "Milk Sweets", "price": 460 },
  { "id": "p7", "slug": "kesar-peda", "name": "Kesar Peda", "category": "Milk Sweets", "price": 520 },
  { "id": "p8", "slug": "rasmalai", "name": "Kesar Rasmalai", "category": "Milk Sweets", "price": 580 },
  { "id": "p9", "slug": "diwali-royale-hamper", "name": "Diwali Royale Hamper", "category": "Gift Hampers", "price": 2499 },
  { "id": "p10", "slug": "badam-halwa", "name": "Badam Halwa", "category": "Dry Fruit", "price": 780 }
]

def read_json_file(file_path, default_value=[]):
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(default_value, f, indent=2)
        return default_value
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return default_value

def write_json_file(file_path, data):
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing {file_path}: {e}")
        return False

# Initialize
read_json_file(ORDERS_FILE, [])
read_json_file(LOGS_FILE, [])
read_json_file(PRODUCTS_FILE, INITIAL_PRODUCTS)

# Phone formatting helper (UltraMsg default format: 919347611587)
def format_phone_number(phone, gateway="ultramsg"):
    digits = "".join([c for c in phone if c.isdigit()])
    if digits.startswith("00"):
        digits = digits[2:]
    elif digits.startswith("0"):
        digits = digits[1:]
    
    if len(digits) == 10:
        digits = "91" + digits
        
    if gateway == "twilio":
        return "+" + digits
    return digits

async def send_whatsapp_notification(to, message_text, msg_type):
    gateway = os.getenv("WHATSAPP_GATEWAY", "greenapi")
    timestamp = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    formatted_phone = format_phone_number(to, gateway)
    
    log_entry = {
        "id": f"log-{random.randint(100000, 999999)}",
        "timestamp": timestamp,
        "recipient": formatted_phone,
        "type": msg_type,
        "message": message_text,
        "gateway": gateway,
        "status": "Sent (Simulation)"
    }
    
    print(f"\n--- WHATSAPP NOTIFICATION TRIGGERED ({msg_type.upper()}) ---")
    print(f"To: {formatted_phone}")
    print(f"Gateway: {gateway}")
    print(f"Message:\n{message_text}")
    print("----------------------------------------------------\n")

    if gateway == "greenapi":
        from utils.whatsapp import send_whatsapp_message
        res = await send_whatsapp_message(formatted_phone, message_text)
        log_entry["status"] = res.get("status", "Failed")
        if res.get("messageId") and res["messageId"] != "N/A":
            log_entry["status"] = f"Delivered (ID: {res.get('messageId')})"
    elif gateway == "ultramsg":
        instance_id = os.getenv("ULTRAMSG_INSTANCE_ID")
        token = os.getenv("ULTRAMSG_TOKEN")
        
        if instance_id and token:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"https://api.ultramsg.com/{instance_id}/messages/chat",
                        data={
                            "token": token,
                            "to": formatted_phone,
                            "body": message_text
                        },
                        timeout=15.0
                    )
                    res_data = response.json()
                    if response.status_code == 200 and (res_data.get("sent") == "true" or res_data.get("success") or res_data.get("id")):
                        log_entry["status"] = "Delivered"
                        print(f"UltraMsg message sent successfully! ID: {res_data.get('id', 'N/A')}")
                    else:
                        log_entry["status"] = f"Failed (UltraMsg: {res_data.get('error', response.text)})"
                        print("UltraMsg send failed:", res_data)
            except Exception as e:
                log_entry["status"] = f"Failed ({e})"
                print("UltraMsg exception:", e)
        else:
            log_entry["status"] = "Failed (Missing UltraMsg Config)"
            print("UltraMsg credentials missing. Simulated message.")
            
    # Save log
    logs = read_json_file(LOGS_FILE, [])
    logs.insert(0, log_entry)
    write_json_file(LOGS_FILE, logs[:100])

# Import mailer functionality
from utils.mailer import send_brevo_email

# Task A: Customer Detailed Receipt
async def send_customer_whatsapp_task(order_data):
    items_list_text = ""
    for item in order_data.get("items", []):
        items_list_text += f"• {item.get('name')} ({item.get('weight')}) x {item.get('quantity')} - INR {item.get('price') * item.get('quantity'):,}\n"
    
    order_id = order_data.get("orderId")
    date_str = order_data.get("date")
    customer = order_data.get("customer", {})
    subtotal = order_data.get("subtotal")
    shipping = order_data.get("shipping")
    tax = order_data.get("tax")
    total = order_data.get("total")
    
    fulfillment_method = order_data.get("fulfillment_method", "delivery")
    payment_method = order_data.get("payment_method", "upi")
    
    fulfillment_label = "Store Pickup" if fulfillment_method == "pickup" else "Home Delivery"
    payment_label = "Paid via UPI QR" if payment_method == "upi" else ("Cash on Pickup" if fulfillment_method == "pickup" else "Cash on Delivery")
    
    customer_whatsapp = f"""🍬 *Mithaas Sweets - Order Confirmed!* 🍬

Thank you *{customer.get('name')}*, for placing an order with us!
Here is your order summary:

*Order ID:* {order_id}
*Date:* {date_str}

*Fulfillment:* {fulfillment_label}
*Payment Mode:* {payment_label}

*Items:*
{items_list_text}
*Subtotal:* INR {subtotal:,}
*Shipping:* {"Free" if shipping == 0 else f"INR {shipping:,}"}
*GST Tax:* INR {tax:,}
*Grand Total:* INR {total:,}

*Shipping/Pickup Address:*
{customer.get('address')}

We are preparing your sweets fresh. A confirmation will be sent when your box is dispatched! ✨"""

    await send_whatsapp_notification(customer.get("phone"), customer_whatsapp, "customer")

# Task B: Quick Owner Alert Text
async def send_admin_whatsapp_task(order_data):
    owner_phone = os.getenv("OWNER_PHONE_NUMBER", "919347611587")
    order_id = order_data.get("orderId")
    total = order_data.get("total")
    
    admin_whatsapp = f"Mithaas Alert: New order #{order_id} has been placed for a total of INR {total}."
    
    await send_whatsapp_notification(owner_phone, admin_whatsapp, "admin")

# Routes
@app.get("/api/products")
def get_products():
    return read_json_file(PRODUCTS_FILE, INITIAL_PRODUCTS)

@app.put("/api/products/{id}")
def update_product_price(id: str, payload: dict):
    price = payload.get("price")
    if price is None or price < 0:
        raise HTTPException(status_code=400, detail="Invalid price value provided.")
    
    products = read_json_file(PRODUCTS_FILE, INITIAL_PRODUCTS)
    for p in products:
        if p["id"] == id:
            p["price"] = price
            write_json_file(PRODUCTS_FILE, products)
            return {"message": "Product price updated successfully.", "product": p}
            
    raise HTTPException(status_code=404, detail="Product not found.")

@app.get("/api/orders")
def get_orders():
    return read_json_file(ORDERS_FILE, [])

@app.put("/api/orders/{id}/status")
def update_order_status(id: str, payload: dict):
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status parameter is required.")
        
    orders = read_json_file(ORDERS_FILE, [])
    for o in orders:
        if o["orderId"] == id:
            o["status"] = status
            write_json_file(ORDERS_FILE, orders)
            return {"message": "Order status updated successfully.", "order": o}
            
    raise HTTPException(status_code=404, detail="Order not found.")

@app.delete("/api/orders/{id}")
def delete_order(id: str):
    orders = read_json_file(ORDERS_FILE, [])
    filtered = [o for o in orders if o["orderId"] != id]
    
    if len(orders) == len(filtered):
        raise HTTPException(status_code=404, detail="Order not found.")
        
    write_json_file(ORDERS_FILE, filtered)
    return {"message": "Order deleted successfully."}

@app.get("/api/whatsapp-logs")
def get_whatsapp_logs():
    return read_json_file(LOGS_FILE, [])

@app.post("/api/orders", status_code=201)
async def create_order(request: Request, background_tasks: BackgroundTasks):
    # Print the raw incoming request body to terminal
    raw_body = await request.body()
    body_str = raw_body.decode('utf-8')
    print(f"\n[CHECKOUT INCOMING TRAFFIC] Raw Request Body:\n{body_str}\n")
    
    # Parse to dict
    try:
        payload_dict = json.loads(body_str)
    except Exception as parse_err:
        print(f"[CHECKOUT ERROR] Failed to parse JSON: {parse_err}")
        raise HTTPException(status_code=400, detail="Invalid JSON format")
        
    # Validate with Pydantic manually to intercept validation errors
    try:
        payload = OrderCreateSchema(**payload_dict)
    except Exception as val_err:
        print(f"[CHECKOUT VALIDATION ERROR] Schema validation failed: {val_err}")
        raise HTTPException(status_code=422, detail=f"Validation failed: {val_err}")
        
    order_id = f"MT-{random.randint(20000, 79999)}"
    date_str = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    
    new_order = {
        "orderId": order_id,
        "date": date_str,
        "status": "Pending",
        "customer": payload.customer.dict(),
        "items": [item.dict() for item in payload.items],
        "subtotal": payload.subtotal,
        "shipping": payload.shipping,
        "tax": payload.tax,
        "total": payload.total,
        "paymentMethod": payload.paymentMethod,
        "shippingMethod": payload.shippingMethod,
        "fulfillment_method": payload.fulfillment_method,
        "payment_method": payload.payment_method
    }
    
    # Save to db
    orders = read_json_file(ORDERS_FILE, [])
    orders.insert(0, new_order)
    write_json_file(ORDERS_FILE, orders)
    
    # Enqueue background notification tasks (instant response to client!)
    background_tasks.add_task(send_customer_whatsapp_task, new_order)
    background_tasks.add_task(send_admin_whatsapp_task, new_order)
    background_tasks.add_task(send_brevo_email, new_order)
    
    return {"message": "Order placed successfully.", "orderId": order_id}

@app.get("/admin", response_class=HTMLResponse)
def serve_admin_portal():
    admin_html = r"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mithaas Admin Portal</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #090d16;
                --card: #111827;
                --border: #1f2937;
                --text: #f3f4f6;
                --text-muted: #9ca3af;
                --primary: #f59e0b;
                --primary-hover: #d97706;
                --success: #10b981;
                --danger: #ef4444;
            }
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Outfit', sans-serif;
            }
            body {
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
            header {
                background-color: var(--card);
                border-bottom: 1px solid var(--border);
                padding: 20px 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            header h1 {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            header .logo-sub {
                font-size: 0.8rem;
                color: var(--text-muted);
                font-weight: 400;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .nav-tabs {
                display: flex;
                gap: 10px;
            }
            .tab-btn {
                background: transparent;
                border: 1px solid transparent;
                color: var(--text-muted);
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s;
            }
            .tab-btn:hover {
                color: var(--text);
                background-color: rgba(255, 255, 255, 0.05);
            }
            .tab-btn.active {
                color: var(--primary);
                border-color: var(--primary);
                background-color: rgba(245, 158, 11, 0.05);
            }
            main {
                flex: 1;
                padding: 40px;
                max-width: 1200px;
                width: 100%;
                margin: 0 auto;
            }
            .tab-content {
                display: none;
            }
            .tab-content.active {
                display: block;
            }
            .card {
                background-color: var(--card);
                border: 1px solid var(--border);
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border);
                padding-bottom: 10px;
            }
            
            /* Orders Tab styling */
            .order-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .order-card {
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                background-color: rgba(255,255,255,0.01);
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
            }
            @media (min-width: 768px) {
                .order-card {
                    grid-template-columns: 1.5fr 2fr 1.2fr;
                }
            }
            .order-header h3 {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--primary);
            }
            .order-header p {
                font-size: 0.85rem;
                color: var(--text-muted);
                margin-top: 4px;
            }
            .customer-details {
                font-size: 0.9rem;
                line-height: 1.5;
            }
            .customer-details strong {
                color: var(--text);
            }
            .order-items {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed var(--border);
                font-size: 0.85rem;
                color: var(--text-muted);
            }
            .order-totals {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-end;
                text-align: right;
            }
            .order-price {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--text);
            }
            .status-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 50px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .status-pending { background-color: rgba(245, 158, 11, 0.1); color: var(--primary); }
            .status-delivery { background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .status-delivered { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
            .actions {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }
            .btn {
                padding: 8px 14px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid transparent;
            }
            .btn-primary { background-color: var(--primary); color: #000; }
            .btn-primary:hover { background-color: var(--primary-hover); }
            .btn-secondary { background: transparent; border-color: var(--border); color: var(--text); }
            .btn-secondary:hover { background-color: rgba(255,255,255,0.05); }
            .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border-color: rgba(239, 68, 68, 0.2); }
            .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

            /* Products pricing editor */
            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
            .product-card {
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                background-color: rgba(255,255,255,0.01);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .product-info h3 {
                font-size: 1rem;
                font-weight: 600;
            }
            .product-info .cat {
                font-size: 0.75rem;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 10px;
            }
            .price-edit-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
            }
            .price-input-wrapper {
                position: relative;
                flex: 1;
            }
            .price-currency {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-weight: 600;
                color: var(--text-muted);
            }
            .price-input {
                width: 100%;
                background-color: #000;
                border: 1px solid var(--border);
                color: var(--text);
                border-radius: 8px;
                padding: 10px 10px 10px 25px;
                font-size: 0.95rem;
                outline: none;
            }
            .price-input:focus {
                border-color: var(--primary);
            }

            /* Log View screen */
            .log-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .log-card {
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 20px;
                background-color: rgba(255,255,255,0.01);
            }
            .log-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                color: var(--text-muted);
                border-bottom: 1px solid var(--border);
                padding-bottom: 8px;
                margin-bottom: 12px;
            }
            .log-body {
                font-family: monospace;
                white-space: pre-wrap;
                font-size: 0.85rem;
                background-color: #05080e;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.02);
                color: #a7f3d0;
            }
            .log-badge {
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .badge-customer { background-color: rgba(59,130,246,0.15); color: #60a5fa; }
            .badge-admin { background-color: rgba(245,158,11,0.15); color: var(--primary); }

            .empty-state {
                text-align: center;
                padding: 40px;
                color: var(--text-muted);
                font-size: 0.95rem;
            }
        </style>
    </head>
    <body>
        <header>
            <div>
                <h1>Mithaas <span style="font-weight:300">Admin</span></h1>
                <div class="logo-sub">Order & Price Management Portal</div>
            </div>
            <div class="nav-tabs">
                <button class="tab-btn active" onclick="switchTab('orders')">Orders</button>
                <button class="tab-btn" onclick="switchTab('products')">Product Prices</button>
                <button class="tab-btn" onclick="switchTab('logs')">WhatsApp Log</button>
            </div>
        </header>

        <main>
            <!-- Orders Tab -->
            <div id="tab-orders" class="tab-content active card">
                <h2 class="section-title">Order Management</h2>
                <div id="orders-container" class="order-list">
                    <div class="empty-state">Loading orders...</div>
                </div>
            </div>

            <!-- Products Tab -->
            <div id="tab-products" class="tab-content card">
                <h2 class="section-title">Pricing Configurator</h2>
                <div id="products-container" class="product-grid">
                    <div class="empty-state">Loading products...</div>
                </div>
            </div>

            <!-- Logs Tab -->
            <div id="tab-logs" class="tab-content card">
                <h2 class="section-title">WhatsApp Notification Trigger Log (Simulated / Live)</h2>
                <div id="logs-container" class="log-list">
                    <div class="empty-state">No logs captured yet. Place orders on checkout to trigger events!</div>
                </div>
            </div>
        </main>

        <script>
            let activeTab = 'orders';

            function switchTab(tabId) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                event.currentTarget.classList.add('active');
                document.getElementById('tab-' + tabId).classList.add('active');
                activeTab = tabId;
                
                if (tabId === 'orders') loadOrders();
                if (tabId === 'products') loadProducts();
                if (tabId === 'logs') loadLogs();
            }

            async function loadOrders() {
                const container = document.getElementById('orders-container');
                try {
                    const res = await fetch('/api/orders');
                    const orders = await res.json();
                    
                    if (!orders.length) {
                        container.innerHTML = '<div class="empty-state">No orders received yet. Make a purchase on the website!</div>';
                        return;
                    }
                    
                    container.innerHTML = orders.map(order => {
                        const statusClass = 'status-' + (order.status === 'Pending' ? 'pending' : order.status === 'Out for Delivery' ? 'delivery' : 'delivered');
                        const itemsHtml = order.items.map(item => 
                            \`\${item.name} (\${item.weight}) x \${item.quantity} - ₹\${(item.price * item.quantity).toLocaleString('en-IN')}\`
                        ).join('<br>');

                        return \`
                            <div class="order-card">
                                <div class="order-header">
                                    <h3>\${order.orderId}</h3>
                                    <p>\${order.date}</p>
                                    <div style="margin-top: 10px;">
                                        <span class="status-badge \${statusClass}">\${order.status}</span>
                                    </div>
                                </div>
                                <div class="customer-details">
                                    <strong>Customer:</strong> \${order.customer.name}<br>
                                    <strong>Email:</strong> \${order.customer.email || 'N/A'}<br>
                                    <strong>Phone:</strong> \${order.customer.phone}<br>
                                    <strong>Address:</strong> <span style="font-size:0.8rem;color:var(--text-muted)">\${order.customer.address}</span><br>
                                    <div class="order-items">
                                        <strong>Items Ordered:</strong><br>\${itemsHtml}
                                    </div>
                                </div>
                                <div class="order-totals">
                                    <div>
                                        <p style="font-size:0.8rem;color:var(--text-muted)">Grand Total</p>
                                        <span class="order-price">₹\${order.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div class="actions">
                                        \${order.status !== 'Delivered' ? \`
                                            <button class="btn btn-primary" onclick="updateOrderStatus('\${order.orderId}', '\${order.status === 'Pending' ? 'Out for Delivery' : 'Delivered'}')">
                                                \${order.status === 'Pending' ? 'Mark Out for Delivery' : 'Mark Delivered'}
                                            </button>
                                        \` : ''}
                                        <button class="btn btn-danger" onclick="deleteOrder('\${order.orderId}')">Delete</button>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }).join('');
                } catch (e) {
                    container.innerHTML = '<div class="empty-state" style="color:var(--danger)">Error loading orders from database.</div>';
                }
            }

            async function loadProducts() {
                const container = document.getElementById('products-container');
                try {
                    const res = await fetch('/api/products');
                    const products = await res.json();
                    
                    container.innerHTML = products.map(product => \`
                        <div class="product-card">
                            <div class="product-info">
                                <div class="cat">\${product.category}</div>
                                <h3>\${product.name}</h3>
                            </div>
                            <div class="price-edit-row">
                                <div class="price-input-wrapper">
                                    <span class="price-currency">₹</span>
                                    <input type="number" class="price-input" id="price-\&quot;\${product.id}\&quot;" value="\${product.price}">
                                </div>
                                <button class="btn btn-primary" onclick="updateProductPrice('\${product.id}')">Save</button>
                            </div>
                        </div>
                    \`).join('');
                } catch (e) {
                    container.innerHTML = '<div class="empty-state" style="color:var(--danger)">Error loading products.</div>';
                }
            }

            async function loadLogs() {
                const container = document.getElementById('logs-container');
                try {
                    const res = await fetch('/api/whatsapp-logs');
                    const logs = await res.json();
                    
                    if (!logs.length) {
                        container.innerHTML = '<div class="empty-state">No logs captured yet. Checkout orders on the website to trigger receipts!</div>';
                        return;
                    }
                    
                    container.innerHTML = logs.map(log => \`
                        <div class="log-card">
                            <div class="log-meta">
                                <div>
                                    <strong>To:</strong> \${log.recipient} &nbsp;|&nbsp; 
                                    <strong>Type:</strong> <span class="log-badge badge-\${log.type}">\${log.type}</span> &nbsp;|&nbsp;
                                    <strong>Gateway:</strong> \${log.gateway.toUpperCase()}
                                </div>
                                <div>
                                    \${log.timestamp} &nbsp;|&nbsp; <strong>Status:</strong> <span style="color:\${log.status.includes('Failed') ? 'var(--danger)' : 'var(--success)'}">\${log.status}</span>
                                </div>
                            </div>
                            <div class="log-body">\${escapeHtml(log.message)}</div>
                        </div>
                    \`).join('');
                } catch (e) {
                    container.innerHTML = '<div class="empty-state" style="color:var(--danger)">Error loading logs.</div>';
                }
            }

            function escapeHtml(text) {
                return text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            async function updateOrderStatus(id, newStatus) {
                try {
                    const res = await fetch(\`/api/orders/\${id}/status\`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({status: newStatus})
                    });
                    if (res.ok) {
                        loadOrders();
                    }
                } catch(e) {
                    alert("Failed to update order status.");
                }
            }

            async function deleteOrder(id) {
                if(!confirm("Are you sure you want to delete mock order " + id + "?")) return;
                try {
                    const res = await fetch(\`/api/orders/\${id}\`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        loadOrders();
                    }
                } catch(e) {
                    alert("Failed to delete order.");
                }
            }

            async function updateProductPrice(id) {
                const input = document.getElementById('price-' + id) || document.getElementById('price-"' + id + '"');
                const price = parseFloat(input.value);
                
                if(isNaN(price) || price < 0) {
                    alert("Please enter a valid price.");
                    return;
                }
                
                try {
                    const res = await fetch(\`/api/products/\${id}\`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({price})
                    });
                    if (res.ok) {
                        alert("Price updated successfully! This will sync immediately with the website.");
                        loadProducts();
                    } else {
                        const data = await res.json();
                        alert("Error: " + data.message);
                    }
                } catch(e) {
                    alert("Failed to update product price.");
                }
            }

            // Initial load
            loadOrders();
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=admin_html)

@app.get("/")
def redirect_to_admin():
    return RedirectResponse(url="/admin")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
