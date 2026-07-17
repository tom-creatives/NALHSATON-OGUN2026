document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("reg-form");

    if (!form) {
        console.error("Registration form not found.");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const check = validateForm(form);

        if (!check.valid) {
            alert(check.message);
            return;
        }

        const data = getFormData(form);

        console.log("Registration Data:", data);

        const submitBtn = form.querySelector('button[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
        }

        try {

            const result = await submitRegistration(data);

            console.log("Result:", result);

            if (result.success) {

                console.log("Calling showTicket...");

                showTicket(data, result.ticketNo);

                console.log("showTicket finished.");

                const emailResult =
                    await sendTicketEmail(data, result.ticketNo);

                if (!emailResult.success) {
                    console.warn(
                        "Email not sent:",
                        emailResult.message
                    );
                }

            } else {

                alert(
                    result.error ||
                    result.message ||
                    "Registration failed."
                );

            }

        } catch (err) {

            console.error(err);

            alert(
                "Unable to complete your registration. Please check your internet connection and try again."
            );

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent =
                    "Complete Registration & Get Ticket →";
            }

        }

    });

});