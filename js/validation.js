/**
 * Validate the registration form
 * Returns an object:
 * { valid: true } if successful
 * { valid: false, message: "..." } if validation fails
 */

function validateForm(form) {

    // Check all required fields
    const requiredFields = form.querySelectorAll("[required]");

    for (const field of requiredFields) {

        if (field.type === "radio") {

            const checked = form.querySelector(
                `input[name="${field.name}"]:checked`
            );

            if (!checked) {
                return {
                    valid: false,
                    message: "Please select " + field.name + "."
                };
            }

        } else if (field.type === "checkbox") {

            if (!field.checked) {
                return {
                    valid: false,
                    message: "Please accept all required declarations."
                };
            }

        } else {

            if (!field.value.trim()) {
                field.focus();

                return {
                    valid: false,
                    message: "Please complete all required fields."
                };
            }

        }

    }

    // Check at least one activity selected
    const activities = form.querySelectorAll(
        'input[name="activities"]:checked'
    );

    if (activities.length === 0) {

        return {
            valid: false,
            message: "Please select at least one conference activity."
        };

    }

    return {
        valid: true
    };

}