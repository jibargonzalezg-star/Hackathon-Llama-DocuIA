from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from rag import save_pdf, list_documents, ask_question

app = FastAPI(title="DocuIA", version="1.0.0")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

class QuestionRequest(BaseModel):
    pregunta: str

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/documentos")
def documentos():
    return list_documents()

@app.post("/cargar-pdf")
async def cargar_pdf(archivo: UploadFile = File(...)):
    if not archivo.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo archivos PDF permitidos")
    contenido = await archivo.read()
    save_pdf(archivo.filename, contenido)
    return {"ok": True, "archivo": archivo.filename}

@app.post("/preguntar")
def preguntar(request: QuestionRequest):
    return ask_question(request.pregunta)
