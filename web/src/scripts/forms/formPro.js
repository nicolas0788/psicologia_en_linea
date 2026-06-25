const form = document.getElementById("professionalForm");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB por archivo
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
];

const FILE_FIELDS = [
    "seguro_archivo",
    "matricula_archivo",
    "dni_archivo",
    "titulo_archivo",
];

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

    if (!validateCheckboxGroup("marco_teorico[]")) {
        alert("Seleccioná al menos un marco teórico.");
        return;
    }

    if (!validateCheckboxGroup("modalidad[]")) {
        alert("Seleccioná al menos una modalidad de atención.");
        return;
    }

    if (!validateCheckboxGroup("tematicas_clinicas[]")) {
        alert("Seleccioná al menos una temática clínica.");
        return;
    }

    const fileError = validateFiles(form);
    if (fileError) {
        alert(fileError);
        return;
    }

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Enviando...";
        }

        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "No se pudo enviar el formulario.");
        }

        window.location.href = "/gracias";
    } catch (error) {
        alert(error.message || "Ocurrió un error al enviar el formulario.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Enviar postulación";
        }
    }
});

function validateCheckboxGroup(name) {
    return form.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
}

function validateFiles(form) {
    for (const fieldName of FILE_FIELDS) {
        const input = form.querySelector(`input[name="${fieldName}"]`);

        if (!input || !input.files.length) {
            return "Falta adjuntar uno de los archivos obligatorios.";
        }

        const file = input.files[0];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return `El archivo "${file.name}" debe ser JPG, PNG o PDF.`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `El archivo "${file.name}" supera los 5 MB.`;
        }
    }

    return null;
}