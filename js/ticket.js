
function showTicket(data, ticketNo){

    document.getElementById("t-name").textContent =
        data.title + " " + data.fullName;

    document.getElementById("t-org").textContent =
        data.organization || "Independent Attendee";

    document.getElementById("t-email").textContent =
        data.email;

    document.getElementById("t-category").textContent =
        data.category;

    document.getElementById("t-fee").textContent =
        data.registrationFee;

    document.getElementById("t-code").textContent =
        ticketNo;

    document.getElementById("form-card").style.display = "none";

    const ticket = document.getElementById("ticket-wrap");

    ticket.style.display = "block";
    ticket.style.visibility = "visible";
    ticket.classList.add("show");

    ticket.scrollIntoView({
        behavior: "smooth"
    });

    const newBtn = document.getElementById("new-reg-btn");
    if(newBtn){
        newBtn.onclick = () => {
            ticket.style.display = "none";
            document.getElementById("form-card").style.display = "block";
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }
}

async function printTicket() {

    const ticket = document.getElementById("ticket-wrap");

    if (!ticket) {
        alert("Ticket not found.");
        return;
    }

    // Render the ticket to a canvas
    const canvas = await html2canvas(ticket, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
    });

    // Convert canvas to PNG
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save(
        "NALHSATON_Ticket_" +
        document.getElementById("t-code").textContent.trim() +
        ".pdf"
    );
}