document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-intake-form]");

    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalButtonText = submitButton?.textContent || "Enviar solicitud";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);

        setSubmitting(true);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "No se pudo enviar el formulario.");
            }

            window.location.href = "/gracias";
        } catch (error) {
            alert(
                error.message ||
                "Ocurrió un error al enviar el formulario. Intentá nuevamente."
            );
        } finally {
            setSubmitting(false);
        }
    });

    function setSubmitting(isSubmitting) {
        if (!submitButton) return;

        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting
            ? "Enviando..."
            : originalButtonText;
    }
});