console.log("form.js loaded");

/**
 * Collect all registration form data
 */
function getFormData(form) {

    return {

        title: form.title.value,

        fullName: form.fullName.value,

        gender: form.querySelector('input[name="gender"]:checked')?.value || "",

        phone: form.phone.value,

        whatsApp: form.whatsApp.value,

        email: form.email.value,

        nationality: form.nationality.value,

        organization: form.organization.value,

        designation: form.designation.value,

        category: form.category.value,

        stateChapter: form.stateChapter.value,

        registrationType: form.registrationType.value,

        registrationFee: getRegistrationFee(form.registrationType.value),

        paymentStatus: form.paymentStatus.value,

        paymentDate: form.paymentDate.value,

        paymentReference: form.paymentReference.value,

        emergencyContactName: form.emergencyContactName.value,

        emergencyRelationship: form.emergencyRelationship.value,

        emergencyPhone: form.emergencyPhone.value,

        certificateName: form.certificateName.value,

        photoConsent: form.photoConsent.checked,

        informationCorrect: form.informationCorrect.checked,

        conferenceRules: form.conferenceRules.checked,

        activities: [...form.querySelectorAll('input[name="activities"]:checked')]
            .map(item => item.value)

    };

}
/**
 * Returns the registration fee based on registration type
 */
function getRegistrationFee(registrationType) {

    switch (registrationType) {

        case "Regular Registration (Early)":
            return "₦15,000";   // Change if your approved fee is different

        case "Sponsored Delegate":
            return "SPONSORED";

        case "Complimentary":
            return "FREE";

        case "Late Registration":
            return "₦17,000";   // Change if applicable

        default:
            return "Not Available";
    }
}