
function showEmailStatus(message, success = true){
    const existing = document.getElementById("email-status");

    if(existing){
        existing.remove();
    }

    const div = document.createElement("div");
    div.id = "email-status";
    div.textContent = message;
    div.style.marginTop = "12px";
    div.style.padding = "12px 14px";
    div.style.borderRadius = "10px";
    div.style.fontWeight = "600";
    div.style.fontSize = "0.95rem";
    div.style.background = success ? "#e9f9ef" : "#fff4e5";
    div.style.color = success ? "#146c2e" : "#9a6700";
    div.style.border = success ? "1px solid #b7ebc6" : "1px solid #f7d9a6";

    const ticket = document.getElementById("ticket-wrap");
    if(ticket){
        ticket.appendChild(div);
    }
}

async function sendTicketEmail(data, ticketNo){
    try{
        if(typeof emailjs === "undefined"){
            showEmailStatus("Email service unavailable. Ticket generated successfully.", false);
            return { success:false, message:"EmailJS SDK not loaded" };
        }

        const cfg = CONFIG.EMAILJS || {};

        if(!cfg.PUBLIC_KEY || !cfg.SERVICE_ID || !cfg.TEMPLATE_ID){
            showEmailStatus("Email not configured yet. Ticket generated successfully.", false);
            return { success:false, message:"EmailJS credentials missing" };
        }

        emailjs.init(cfg.PUBLIC_KEY);

        const response = await emailjs.send(
            cfg.SERVICE_ID,
            cfg.TEMPLATE_ID,
            {
                fullName: data.fullName,
                title: data.title,
                email: data.email,
                phone: data.phone,
                organization: data.organization || "Independent Attendee",
                category: data.category,
                registrationType: data.registrationType,
                fee: data.fee,
                ticketNo: ticketNo,
                conference: "NALHSATON 30th Annual National Conference",
                venue: "Event Towers, Kuto, Abeokuta",
                date: "5th–8th October 2026"
            }
        );

        showEmailStatus("Confirmation email sent successfully.");
        return { success:true, response };
    }catch(err){
        console.error("EmailJS Error:", err);
        showEmailStatus("Ticket generated, but email delivery failed.", false);
        return { success:false, message: err?.text || err?.message || "Email failed" };
    }
}
