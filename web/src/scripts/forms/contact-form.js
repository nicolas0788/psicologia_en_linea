
const form = document.getElementById("contactForm");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

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
            throw new Error(result.message || "No se pudo enviar el mensaje.");
        }

        window.location.href = "/gracias";
    } catch (error) {
        alert(error.message || "Ocurrió un error al enviar el mensaje.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Enviar";
        }
    }
});