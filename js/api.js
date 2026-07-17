/**
 * Submit registration to Google Apps Script
 */
async function submitRegistration(data) {

    const formData = new URLSearchParams();

    Object.keys(data).forEach(key => {

        if (Array.isArray(data[key])) {
            formData.append(key, data[key].join(", "));
        } else {
            formData.append(key, data[key]);
        }

    });

    const response = await fetch(CONFIG.API_URL, {

        method: "POST",

        body: formData

    });

    if (!response.ok) {
        throw new Error("Unable to submit registration.");
    }

    return await response.json();

}