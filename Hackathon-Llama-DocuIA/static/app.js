const pdfFile = document.getElementById("pdfFile");
const uploadButton = document.getElementById("uploadButton");
const uploadMessage = document.getElementById("uploadMessage");
const documentList = document.getElementById("documentList");
const refreshButton = document.getElementById("refreshButton");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const answer = document.getElementById("answer");
const sources = document.getElementById("sources");

async function loadDocuments() {
    try {
        const response = await fetch("/documentos");
        const data = await response.json();
        documentList.innerHTML = "";
        if (data.length === 0) {
            documentList.textContent = "No hay documentos cargados.";
            return;
        }
        data.forEach(doc => {
            const item = document.createElement("div");
            item.className = "document-item";
            item.textContent = `${doc.nombre} (${doc.tamano_mb} MB)`;
            documentList.appendChild(item);
        });
    } catch {
        documentList.innerHTML = "No fue posible cargar los documentos.";
    }
}

async function uploadPdf() {
    if (!pdfFile.files.length) {
        uploadMessage.textContent = "Seleccione un archivo PDF.";
        return;
    }
    const formData = new FormData();
    formData.append("archivo", pdfFile.files[0]);

    try {
        const response = await fetch("/cargar-pdf", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            uploadMessage.textContent = `✅ ${data.archivo} cargado correctamente.`;
            loadDocuments();
        } else {
            uploadMessage.textContent = data.detail;
        }
    } catch {
        uploadMessage.textContent = "Error cargando PDF.";
    }
}

async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    answer.textContent = "Consultando...";
    sources.innerHTML = "";

    try {
        const response = await fetch("/preguntar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pregunta: question })
        });
        const data = await response.json();
        answer.textContent = data.respuesta;

        data.fuentes.forEach(fuente => {
            const div = document.createElement("div");
            div.className = "source";
            div.innerHTML = `<strong>${fuente.archivo}</strong><br>Página: ${fuente.pagina}<br>${fuente.extracto}`;
            sources.appendChild(div);
        });
    } catch {
        answer.textContent = "Ocurrió un error al consultar.";
    }
}

uploadButton.addEventListener("click", uploadPdf);
refreshButton.addEventListener("click", loadDocuments);
askButton.addEventListener("click", askQuestion);
document.addEventListener("DOMContentLoaded", loadDocuments);
