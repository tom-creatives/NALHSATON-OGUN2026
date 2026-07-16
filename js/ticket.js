
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
        data.registrationType;

    document.getElementById("t-code").textContent =
        ticketNo;

    document.getElementById("form-card").style.display = "none";

    const ticket = document.getElementById("ticket-wrap");

    ticket.style.display = "block";
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

function printTicket(){
    const ticket = document.querySelector(".ticket");
    if(!ticket){
        alert("Ticket not found.");
        return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
        <head>
            <title>NALHSATON Conference Ticket</title>
            <style>
                body{
                    font-family: Arial, sans-serif;
                    margin:20px;
                    background:#fff;
                }
                .ticket{
                    border:1px solid #ccc;
                    border-radius:12px;
                    padding:24px;
                }
            </style>
        </head>
        <body>
            ${ticket.outerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 300);
}
