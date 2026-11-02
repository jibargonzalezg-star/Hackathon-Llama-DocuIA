from pathlib import Path

PDF_DIR = Path("data/pdfs")
PDF_DIR.mkdir(parents=True, exist_ok=True)

def save_pdf(filename, content):
    destination = PDF_DIR / filename
    destination.write_bytes(content)

def list_documents():
    result = []
    for pdf in PDF_DIR.glob("*.pdf"):
        result.append({
            "nombre": pdf.name,
            "tamano_mb": round(pdf.stat().st_size / (1024 * 1024), 2)
        })
    return result

def ask_question(question):
    return {
        "respuesta": "Esta es una respuesta simulada basada en RAG para la demostración del Hackathon.",
        "fuentes": [
            {
                "archivo": "Documento_Ejemplo.pdf",
                "pagina": 1,
                "extracto": "Texto extraído de prueba para validar el funcionamiento del sistema RAG con Llama."
            }
        ]
    }
