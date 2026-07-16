// =====================================================================
// EMAILJS CONFIG — REPLACE THESE WITH YOUR REAL VALUES
// =====================================================================
// 1. Create a FREE account at https://www.emailjs.com
// 2. Add an Email Service (Gmail works — connect ogunnalhsaton@gmail.com)
// 3. Create an Email Template with these variables:
//       {{email}}   — recipient email
//       {{to_name}}    — recipient full name
//       {{org}}        — organization
//       {{category}}   — attendee category
//       {{fee}}        — fee amount
//       {{ticket_code}}— unique ticket code
//       {{venue}}      — venue
//       {{dates}}      — conference dates
//    Subject line suggestion: "Your #OGUN2026 Conference Ticket — {{ticket_code}}"
// 4. Copy your Public Key, Service ID, and Template ID below
// =====================================================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY:   "kBVQU5gb0OK3viesI",
  SERVICE_ID:   "service_s6vcf79",
  TEMPLATE_ID:  "template_cp03rur"
};
// =====================================================================
(function(){
  emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
})();

// ─────────────────────────────────────────────────────────

// ── Registration Category: footnotes + skip payment section ──────────────
function handleRegCategory(val) {
  var fnBox   = document.getElementById('regcat-footnotes');
  var paySection = document.getElementById('payment-section');
  var fnRegular  = fnBox ? fnBox.querySelector('.fn-regular')      : null;
  var fnSponsored= fnBox ? fnBox.querySelector('.fn-sponsored')    : null;
  var fnCompl    = fnBox ? fnBox.querySelector('.fn-complimentary'): null;
  var fnLate     = fnBox ? fnBox.querySelector('.fn-late')         : null;

  // Hide all footnotes first
  [fnRegular, fnSponsored, fnCompl, fnLate].forEach(function(el){ if(el) el.style.display='none'; });
  if(fnBox) fnBox.style.display = val ? 'block' : 'none';

  // Show relevant footnote
  if(val === 'Regular Registration (Early)' && fnRegular)   fnRegular.style.display   = 'block';
  if(val === 'Sponsored Delegate'           && fnSponsored) fnSponsored.style.display = 'block';
  if(val === 'Complimentary'                && fnCompl)     fnCompl.style.display     = 'block';
  if(val === 'Late Registration'            && fnLate)      fnLate.style.display      = 'block';

  // Skip payment section for Sponsored Delegate or Complimentary
  var skip = (val === 'Sponsored Delegate' || val === 'Complimentary');
  if(paySection){
    paySection.style.display = skip ? 'none' : 'block';
    // Make required fields inside optional when skipped
    paySection.querySelectorAll('[required]').forEach(function(el){
      el.required = !skip;
    });
  }
}

// ---------- Countdown ----------
(function(){
  const target = new Date("2026-10-05T09:00:00").getTime();
  function update(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  update();
  setInterval(update,1000);
})();

// ---------- Reveal on scroll ----------
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  els.forEach(el=>obs.observe(el));
})();

// ---------- Category selection highlight ----------
(function(){
  const options = document.querySelectorAll('.cat-option');
  options.forEach(opt=>{
    opt.addEventListener('click', ()=>{
      options.forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
})();

// =====================================================================
// GOOGLE FORM CONFIG — REPLACE THESE PLACEHOLDER VALUES
// =====================================================================
// 1. Create your Google Form with these 5 fields, in this order:
//    Full name / Organization / Email address / Phone number / Registration category
// 2. Click the three-dot menu (top right of form editor) -> "Get pre-filled link"
// 3. Fill in any dummy text in each field, click "Get link", then "Copy link"
// 4. That copied URL will look like:
//    https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxx/viewform?usp=pp_url&entry.111=John&entry.222=Acme&...
// 5. Paste that FULL url below as PREFILL_URL_TO_PARSE (temporarily) and this
//    file will read it, OR just manually copy each entry.XXXX number into
//    the fields below yourself. Then delete/ignore the PREFILL_URL_TO_PARSE line.
//
// EASIEST METHOD: paste your copied pre-filled link as the value of
// PREFILL_URL_TO_PARSE, save, and the field IDs will be extracted automatically
// at runtime — no manual copying of entry.XXXX numbers needed.
// =====================================================================
  (function () {
  var form = document.getElementById('reg-form');
  var formCard = document.getElementById('form-card');
  var ticketWrap = document.getElementById('ticket-wrap');
  var submitBtn = document.getElementById('reg-submit');
  var newRegBtn = document.getElementById('new-reg-btn');
  if(!form) return;

  function genCode(){
    return 'NALHSATON-OG-' + Math.floor(100000 + Math.random() * 899999);
  }

  function showTicket(data, code){
    document.getElementById('t-name').textContent = data.title + ' ' + data.fullName;
    document.getElementById('t-org').textContent = data.organization || 'Independent Attendee';
    if(document.getElementById('t-email')) document.getElementById('t-email').textContent = data.email;
    document.getElementById('t-category').textContent = data.category;
    document.getElementById('t-fee').textContent = (data.registrationType || '').includes('Late') ? '₦18,000' : '₦15,000';
    document.getElementById('t-code').textContent = code;
    formCard.style.display = 'none';
    ticketWrap.classList.add('show');
    ticketWrap.scrollIntoView({behavior:'smooth', block:'start'});
    submitBtn.disabled = false;
    submitBtn.textContent = 'Complete Registration & Get Ticket →';
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    // Validate required fields
    var valid = true;
    // Check at least one activity selected
    var actChecked = form.querySelectorAll('input[name="activities"]:checked');
    var actGroup = document.getElementById('activities-group');
    if(actChecked.length === 0){
      if(actGroup){ actGroup.style.outline='2px solid #C8232A'; actGroup.style.borderRadius='4px'; }
      valid = false;
    } else {
      if(actGroup){ actGroup.style.outline=''; }
    }
    form.querySelectorAll('[required]').forEach(function(el){
      if(el.type === 'radio'){
        var anyChecked = form.querySelector('input[name="'+el.name+'"]:checked');
        var grp = document.getElementById('gender-group');
        if(!anyChecked){ if(grp) grp.style.outline='2px solid #C8232A'; valid=false; }
        else { if(grp) grp.style.outline=''; }
      } else if(el.type === 'checkbox'){
        if(!el.checked){ el.style.outline='2px solid #C8232A'; valid=false; }
        else { el.style.outline=''; }
      } else if(!el.value.trim()){
        el.style.borderColor='#C8232A'; valid=false;
        el.addEventListener('input',function(){el.style.borderColor='';},{once:true});
      }
    });
    if(!valid){
      var first = form.querySelector('[required][style*="C8232A"], [required]:invalid');
      if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

var data = {

    title: form.querySelector('[name="title"]').value,

    fullName: form.querySelector('[name="fullName"]').value,

    gender: form.querySelector('[name="gender"]:checked')?.value || "",

    phone: form.querySelector('[name="phone"]').value,

    whatsApp: form.querySelector('[name="whatsApp"]').value,

    email: form.querySelector('[name="email"]').value,

    nationality: form.querySelector('[name="nationality"]').value,

    organization: form.querySelector('[name="organization"]').value,

    designation: form.querySelector('[name="designation"]').value,

    category: form.querySelector('[name="category"]').value,

    stateChapter: form.querySelector('[name="stateChapter"]').value,

    registrationType: form.querySelector('[name="registrationType"]').value,

    paymentStatus: form.querySelector('[name="paymentStatus"]').value,

    paymentDate: form.querySelector('[name="paymentDate"]').value,

    paymentReference: form.querySelector('[name="paymentReference"]').value,

    emergencyContactName: form.querySelector('[name="emergencyContactName"]').value,

    emergencyRelationship: form.querySelector('[name="emergencyRelationship"]').value,

    emergencyPhone: form.querySelector('[name="emergencyPhone"]').value,

    certificateName: form.querySelector('[name="certificateName"]').value,

    photoConsent: form.querySelector('[name="photoConsent"]').checked,

    informationCorrect: form.querySelector('[name="informationCorrect"]').checked,

    conferenceRules: form.querySelector('[name="conferenceRules"]').checked,

    activities: Array.from(
        form.querySelectorAll('[name="activities"]:checked')
    ).map(item => item.value)

};
   showTicket(data, result.ticketNo);
sendEmails(data, result.ticketNo);


    // ── Send ticket to registrant + copy to association ───────────────────
    function sendEmails(d, code) {
      var fee = (d.regtype||'').indexOf('Late') > -1        ? '₦18,000'      :
                (d.regtype||'').indexOf('Sponsored') > -1   ? 'Sponsored'    :
                (d.regtype||'').indexOf('Complimentary') > -1 ? 'Complimentary' : '₦15,000';

      var params = {
        email:    d.email,
        to_name:     d.title + ' ' + d.fullname,
        category:    d.category  || '',
        reg_type:    d.regtype   || '',
        fee:         fee,
        ticket_code: code
      };

      // 1. Ticket to registrant
      emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, params)
        .then(function(){ console.log('Ticket sent to: ' + d.email); })
        .catch(function(e){ console.warn('Ticket email failed:', e); });

      // 2. Notification copy to association
      emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID,
        Object.assign({}, params, { to_email: 'ogunnalhsaton@gmail.com', to_name: 'NALHSATON Secretariat' })
      ).then(function(){ console.log('Copy sent to ogunnalhsaton@gmail.com'); })
       .catch(function(e){ console.warn('Association copy failed:', e); });
    }
   fetch("https://script.google.com/macros/s/AKfycbyju0TkHZiqISuNFGdMpcmYR1xYbq85zxB2tGFEQokKvSh2QRTA2pH2Ch2XltNwVf_1Qg/exec", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({

        fullName: data.fullName,

        email: data.email,

        phone: "",

        state: "",

        organization: data.organization,

        category: data.category,

        registrationType: data.registrationType

    })

})
.then(response => response.json())

.then(result => {

    if(result.success){

        showTicket(data, result.ticketNo);

        sendEmails(data, result.ticketNo);

    }else{

        alert(result.error);

    }

})

.catch(error => {

    console.error(error);

    alert("Unable to register.");

});
  if(newRegBtn){
    newRegBtn.addEventListener('click', function(){
      form.reset();
      ticketWrap.classList.remove('show');
      formCard.style.display = 'block';
      formCard.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  // Category option highlight (legacy cat-options if present)
  document.querySelectorAll('.cat-option').forEach(function(opt){
    opt.addEventListener('click',function(){
      document.querySelectorAll('.cat-option').forEach(function(o){o.classList.remove('selected');});
      opt.classList.add('selected');
    });
  });
})();
(function(){
  const form = document.getElementById('reg-form');
  const formCard = document.getElementById('form-card');
  const ticketWrap = document.getElementById('ticket-wrap');
  const newRegBtn = document.getElementById('new-reg-btn');
  const submitBtn = form.querySelector('.form-submit');

  // Resolve entry IDs, optionally auto-detected from a pasted pre-filled link
  function resolveEntryIds(){
    const ids = Object.assign({}, GOOGLE_FORM_CONFIG.ENTRY_IDS);
    const prefill = GOOGLE_FORM_CONFIG.PREFILL_URL_TO_PARSE;
    if(prefill && prefill.trim().length > 0){
      try{
        const url = new URL(prefill);
        const params = url.searchParams;
        const keys = ['fullName','organization','email','phone','category'];
        // We can't know which entry.NNN maps to which field by name alone,
        // so this only works if you fill the dummy values in the SAME
        // order as the fields appear in your form (recommended order above).
        keys.forEach((key, i) => {
          if(entryParams[i]) ids[key] = entryParams[i][0];
        });
      }catch(err){
        console.warn('Could not parse PREFILL_URL_TO_PARSE — falling back to manual ENTRY_IDS.', err);
      }
    }
    return ids;
  }

  function genCode(){
    const n = Math.floor(100000 + Math.random()*899999);
    return 'NALHSATON-OG-' + n;
  }

  function isPlaceholderConfig(){
    return GOOGLE_FORM_CONFIG.ACTION_URL.includes('REPLACE_WITH_YOUR_FORM_ID');
  }

  function submitToGoogleForm(data){
    const ids = resolveEntryIds();
    const body = new URLSearchParams();
    body.append(ids.fullName, data.name);
    body.append(ids.organization, data.organization || '');
    body.append(ids.email, data.email);
    body.append(ids.phone, data.phone);
    body.append(ids.category, data.category);

    // Google Forms does not allow reading the response cross-origin, so we
    // fire the request in "no-cors" mode. We can't confirm success/failure
    // this way, but the submission still reaches the form + your sheet/email.
    return fetch(GOOGLE_FORM_CONFIG.ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    const name = document.getElementById('fname').value.trim();
    const org = document.getElementById('org').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const catInput = form.querySelector('input[name="category"]:checked');

    if(!name || !email || !phone || !catInput){
      if(!catInput){
        document.getElementById('cat-options').style.outline = '2px solid #C8232A';
        document.getElementById('cat-options').style.borderRadius = '4px';
      }
      return;
    }

    const category = catInput.value;
    const fee = '₦15,000';

    function showTicket(ticketCode){
      document.getElementById('t-name').textContent = name;
      if(document.getElementById('t-email')) document.getElementById('t-email').textContent = email;
      document.getElementById('t-org').textContent = org || 'Independent Attendee';
      document.getElementById('t-category').textContent = category;
      document.getElementById('t-fee').textContent = fee;
      document.getElementById('t-code').textContent = ticketCode;

      formCard.style.display = 'none';
      ticketWrap.classList.add('show');
      ticketWrap.scrollIntoView({behavior:'smooth', block:'start'});
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Registration & Get Ticket';
    }

    function sendTicketEmail(ticketCode){
      if(EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY"){
        console.warn("NALHSATON: EmailJS not configured — ticket email not sent. See EMAILJS_CONFIG at top of page.");
        return Promise.resolve();
      }
      const templateParams = {
        email:    email,
        to_name:     name,
        org:         org || 'Independent Attendee',
        category:    category,
        fee:         fee,
        ticket_code: ticketCode,
        venue:       'The Event Towers, Opp. MKO Abiola Sports Arena, Kuto, Abeokuta, Ogun State',
        dates:       'Monday 5th – Thursday 8th October 2026, 9:00AM Daily'
      };
      return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
    }

    const ticketCode = genCode();

    if(isPlaceholderConfig()){
      console.warn('NALHSATON: Google Form ACTION_URL is still a placeholder. Responses are NOT being saved. See GOOGLE_FORM_CONFIG.');
      sendTicketEmail(ticketCode).catch(e => console.warn('Email send failed:', e));
      showTicket(ticketCode);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Submit to Google Form AND send email in parallel
    Promise.allSettled([
      submitToGoogleForm({name, org, email, phone, category}),
      sendTicketEmail(ticketCode)
    ]).then(function(results){
      if(results[1].status === 'rejected'){
        console.warn('Ticket email failed to send:', results[1].reason);
      }
      showTicket(ticketCode);
    });
  });

  newRegBtn.addEventListener('click', function(){
    form.reset();
    document.querySelectorAll('.cat-option').forEach(o=>o.classList.remove('selected'));
    ticketWrap.classList.remove('show');
    formCard.style.display = 'block';
    formCard.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();

// ─────────────────────────────────────────────────────────

// Images loaded once, applied to all instances
(function(){
  var LOGO = 'assets/logo.jpg';
  var BANNER = 'assets/banner.jpg';
  function setImages(){
    document.querySelectorAll('.js-logo').forEach(function(el){ el.src = LOGO; });
    document.querySelectorAll('.js-banner').forEach(function(el){ el.src = BANNER; });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setImages);
  } else { setImages(); }
})();})