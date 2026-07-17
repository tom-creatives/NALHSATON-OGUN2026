
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

function printTicket(){

    const ticket = document.querySelector(".ticket");

    if(!ticket){
        alert("Ticket not found.");
        return;
    }

    const clone = ticket.cloneNode(true);

    clone.style.display = "block";
    clone.style.visibility = "visible";
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.width = "800px";
    clone.style.padding = "20px";

    document.body.appendChild(clone);

    const ticketNo =
        document.getElementById("t-code").textContent.trim();

    html2pdf()
        .set({
            margin:0.3,
            filename:`NALHSATON_Ticket_${ticketNo}.pdf`,
            image:{
                type:"jpeg",
                quality:1
            },
            html2canvas:{
                scale:3,
                useCORS:true,
                logging:false,
                backgroundColor:"#ffffff"
            },
            jsPDF:{
                unit:"in",
                format:"a4",
                orientation:"portrait"
            }
        })
        .from(clone)
        .save()
        .then(()=>{
            document.body.removeChild(clone);
        });

}