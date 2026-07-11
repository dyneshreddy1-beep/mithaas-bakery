from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import base64
import httpx
import os
import sys
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


def generate_invoice_pdf(order_data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=40, 
        leftMargin=40,
        topMargin=40, 
        bottomMargin=40
    )
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#d97706'), # Amber gold
        spaceAfter=15
    )
    normal_style = styles['Normal']
    bold_style = ParagraphStyle(
        'InvoiceBold',
        parent=normal_style,
        fontName='Helvetica-Bold'
    )
    
    # Title
    story.append(Paragraph("Mithaas Sweet Shop - Invoice", title_style))
    story.append(Spacer(1, 10))
    
    # Info
    order_id = order_data.get("orderId", "N/A")
    date_str = order_data.get("date", "N/A")
    cust_name = order_data.get("customer", {}).get("name", "N/A")
    cust_phone = order_data.get("customer", {}).get("phone", "N/A")
    cust_email = order_data.get("customer", {}).get("email", "N/A")
    cust_address = order_data.get("customer", {}).get("address", "N/A")
    
    fulfillment_method = order_data.get("fulfillment_method", "delivery")
    payment_method = order_data.get("payment_method", "upi")
    
    fulfillment_label = "Store Pickup" if fulfillment_method == "pickup" else "Home Delivery"
    payment_label = "Paid via UPI QR" if payment_method == "upi" else ("Cash on Pickup" if fulfillment_method == "pickup" else "Cash on Delivery")
    
    info_text = f"""
    <b>Order ID:</b> {order_id}<br/>
    <b>Date:</b> {date_str}<br/>
    <b>Customer:</b> {cust_name}<br/>
    <b>Phone:</b> {cust_phone}<br/>
    <b>Email:</b> {cust_email}<br/>
    <b>Fulfillment:</b> {fulfillment_label}<br/>
    <b>Payment Mode:</b> {payment_label}<br/>
    <b>Shipping/Pickup Address:</b> {cust_address}<br/>
    """
    story.append(Paragraph(info_text, normal_style))
    story.append(Spacer(1, 20))
    
    # Table data
    table_data = [["Item Description", "Weight", "Qty", "Price", "Total"]]
    items = order_data.get("items", [])
    for item in items:
        name = item.get("name", "Unknown")
        weight = item.get("weight", "N/A")
        qty = item.get("quantity", 1)
        price = item.get("price", 0)
        total = price * qty
        table_data.append([
            name,
            weight,
            str(qty),
            f"INR {price:,}",
            f"INR {total:,}"
        ])
        
    # Totals
    subtotal = order_data.get("subtotal", 0)
    shipping = order_data.get("shipping", 0)
    tax = order_data.get("tax", 0)
    grand_total = order_data.get("total", 0)
    
    table_data.append(["", "", "", "Subtotal:", f"INR {subtotal:,}"])
    table_data.append(["", "", "", "Shipping:", f"Free" if shipping == 0 else f"INR {shipping:,}"])
    table_data.append(["", "", "", "GST Tax (5%):", f"INR {tax:,}"])
    table_data.append(["", "", "", "Grand Total:", f"INR {grand_total:,}"])
    
    # Table formatting
    t = Table(table_data, colWidths=[200, 70, 50, 90, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1f2937')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
        ('FONTNAME', (0,-4), (-1,-1), 'Helvetica-Bold'),
        ('BACKGROUND', (3,-1), (4,-1), colors.HexColor('#fef3c7')), # Highlight grand total row
        ('TEXTCOLOR', (3,-1), (4,-1), colors.HexColor('#b45309')),
        ('ALIGN', (3,0), (4,-1), 'RIGHT'),
    ]))
    
    story.append(t)
    story.append(Spacer(1, 30))
    story.append(Paragraph("Thank you for shopping at Mithaas! We hope to sweeten your day again soon. ✨", bold_style))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

async def send_brevo_email(order_data):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("SENDER_EMAIL", "dyneshreddy1@gmail.com")
    sender_name = os.getenv("SENDER_NAME", "sweet shop")
    
    customer_email = order_data.get("customer", {}).get("email")
    customer_name = order_data.get("customer", {}).get("name", "Valued Customer")
    order_id = order_data.get("orderId", "N/A")
    grand_total = order_data.get("total", 0)
    
    if not api_key:
        print("[MOCK EMAIL] BREVO_API_KEY is not configured in .env. Skipping real email send.")
        return
        
    if not customer_email:
        print("[MOCK EMAIL] Customer email address is missing.")
        return
        
    try:
        # Generate the PDF
        pdf_bytes = generate_invoice_pdf(order_data)
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        fulfillment_method = order_data.get("fulfillment_method", "delivery")
        payment_method = order_data.get("payment_method", "upi")
        
        fulfillment_label = "Store Pickup" if fulfillment_method == "pickup" else "Home Delivery"
        payment_label = "Paid via UPI QR" if payment_method == "upi" else ("Cash on Pickup" if fulfillment_method == "pickup" else "Cash on Delivery")
        
        payload = {
            "sender": {
                "name": sender_name,
                "email": sender_email
            },
            "to": [
                {
                    "email": customer_email,
                    "name": customer_name
                }
            ],
            "subject": f"Order Confirmed! Your Mithaas Invoice: {order_id}",
            "htmlContent": f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
                        <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Order Confirmed! 🍬</h2>
                        <p>Dear <strong>{customer_name}</strong>,</p>
                        <p>Thank you for placing your order with <strong>Mithaas</strong>. We are busy preparing your sweets fresh in our kitchen.</p>
                        <p>Please find attached the official PDF invoice for your order reference <strong>{order_id}</strong> for the amount of <strong>INR {grand_total:,}</strong>.</p>
                        <p style="background-color:#f9fafb; padding:12px; border-radius:6px; border: 1px solid #f3f4f6; font-size: 0.9rem;">
                            <strong>Fulfillment:</strong> {fulfillment_label} | <strong>Payment Mode:</strong> {payment_label}
                        </p>
                        <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:gifting@mithaas.co">gifting@mithaas.co</a>.</p>
                        <br/>
                        <p>Warm regards,<br/><strong>Mithaas Concierge Team</strong></p>
                    </div>
                </body>
            </html>
            """,
            "attachment": [
                {
                    "content": pdf_base64,
                    "name": f"Invoice-{order_id}.pdf"
                }
            ]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": api_key,
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=15.0
            )
            print("[BREVO RESPONSE]:", response.status_code, response.text, flush=True)
            
            if response.status_code in [200, 201, 202]:
                print(f"[BREVO SUCCESS] Transactional email sent successfully to {customer_email}! Response: {response.text}", flush=True)
            else:
                print(f"[BREVO ERROR] Failed to send Brevo email. Status Code: {response.status_code}", flush=True)
                print(f"[BREVO ERROR] Response Content: {response.text}", flush=True)
                print(f"[BREVO ERROR] Request Payload Info (Sender: {sender_email}, To: {customer_email}, Subject: Confirmed: {order_id})", flush=True)
                
    except Exception as e:
        print(f"[BREVO EXCEPTION] Exception raised during Brevo SMTP email dispatch: {e}", flush=True)
