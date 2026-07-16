/**
 * Submit registration to Google Apps Script
 */
async function submitRegistration(data) {

    const response = await fetch(CONFIG.API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });

    const result = await response.json();

    return result;

}