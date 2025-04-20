from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.models.agent import AgentInDB
from app.models.application import ApplicationInDB

async def send_notification(
    agent: AgentInDB,
    application: ApplicationInDB,
    document_type: str
) -> None:
    if not agent.settings.enable_notifications:
        return

    # Prepare email content
    subject = f"New Document Uploaded - {application.bio_info.first_name} {application.bio_info.last_name}"
    
    # Create email body
    body = f"""
    <html>
        <body>
            <h2>New Document Uploaded</h2>
            <p>A new document has been uploaded for the following application:</p>
            <ul>
                <li><strong>Applicant:</strong> {application.bio_info.first_name} {application.bio_info.last_name}</li>
                <li><strong>Document Type:</strong> {document_type}</li>
                <li><strong>Application ID:</strong> {application.id}</li>
                <li><strong>Upload Time:</strong> {application.document_uploaded_at}</li>
            </ul>
            <p>You can view the application at: {settings.FRONTEND_URL}/applications/{application.id}</p>
        </body>
    </html>
    """

    # Create message
    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_FROM_EMAIL
    msg['To'] = agent.settings.notification_email or agent.email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        # Log the error but don't raise it to prevent application failure
        print(f"Failed to send notification email: {str(e)}") 