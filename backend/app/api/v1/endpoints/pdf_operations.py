# pdf_operations.py
import fitz  # PyMuPDF
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pdfrw import PdfReader, PdfWriter, PdfDict
import io
import os
import logging

logger = logging.getLogger(__name__)

def fill_pdf_form(template_path: str, output_path: str, form_data: dict):
    try:
        # Open the template PDF
        doc = fitz.open(template_path)
        
        # Get the first page
        page = doc[0]
        
        # Fill form fields
        for field_name, value in form_data.items():
            widget = page.first_widget
            while widget:
                if widget.field_name == field_name:
                    widget.field_value = value
                widget = widget.next
        
        # Save the filled PDF
        doc.save(output_path)
        doc.close()
        
    except Exception as e:
        logger.error(f"Error filling PDF form: {str(e)}")
        raise

def add_signature_to_pdf(pdf_path: str, output_path: str, signature_path: str, page_num: int, x: float, y: float):
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        
        # Get the specified page
        page = doc[page_num]
        
        # Open the signature image
        signature = fitz.open(signature_path)
        signature_page = signature[0]
        
        # Get the signature image
        pix = signature_page.get_pixmap()
        
        # Add the signature to the PDF page
        page.insert_image(fitz.Rect(x, y, x + 100, y + 50), pixmap=pix)
        
        # Save the signed PDF
        doc.save(output_path)
        doc.close()
        signature.close()
        
    except Exception as e:
        logger.error(f"Error adding signature to PDF: {str(e)}")
        raise

def extract_form_field_names(pdf_path):
    """Extract all form field names from a PDF (useful for debugging)"""
    pdf = fitz.open(pdf_path)
    field_names = []
    
    for page_num in range(len(pdf)):
        page = pdf[page_num]
        fields = page.widgets()
        
        for field in fields:
            field_names.append(field.field_name)
    
    pdf.close()
    return field_names