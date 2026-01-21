const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// -------------------------
// Existing routes
// -------------------------

router.post('/establish-answer', function (request, response) {
    var matched = request.session.data['matched']
    if (matched == "yes") {
        response.redirect("/path1/fraud-check")
    } else {
        response.redirect("/path1/identity-not-verified")
    }
})

router.post('/fraud-answer', function (request, response) {
    var fraud = request.session.data['fraud']

    if (!fraud || fraud.length === 0) {
        response.redirect('/path1/fraud-check-error')
    } else if (fraud.includes("nifu")) {
        response.redirect("/path1/nifu-stop")
    } else if (fraud.includes("dateofdeath")) {
        response.redirect("/path1/dateofdeath")
    } else if (fraud.includes("idatrisk")) {
        response.redirect("/path1/verify-identity")
    } else if (fraud.includes("cfems")) {
        response.redirect("/path1/cfems")
    } else if (fraud.includes("none")) {
        response.redirect("/path1/verify-identity-no-markers")
    } else {
        response.redirect('/path1/fraud-check-error')
    }
})

router.post('/verify-answer', function (request, response) {
    var verify = request.session.data['verify']
    if (verify == "yes") {
        response.redirect("/path1/identity-verified")
    } else {
        response.redirect("/path1/identity-not-verified")
    }
})

/////// new routes //// kbv show answer UR-r1 ////

router.post('/match1-answer', function (request, response) {
    const firstName = request.body['firstname'];
    const lastName = request.body['lastname'];
    const niNumber = request.body['nationalinsurancenumber'];

    // Check if any field is empty
    if (!firstName || !lastName || !niNumber) {
        // Redirect if any field is missing
        response.redirect("/ur-r1/kbv-answer/kbv-start");
    } else {
        // All fields filled, proceed
        response.redirect("/ur-r1/kbv-answer/kbv-start");
    }
});


//////

router.post('/another-benefit-show', function (request, response) {
    var anotherbenefitshow = request.session.data['anotherbenefitshow'];

    if (!anotherbenefitshow) {
        // If no answer is selected, redirect to an error page
        response.redirect("/kbv-answer/another-benefit-you-have-previously-applied-for-error");
    } else if (anotherbenefitshow === "yes") {
        response.redirect("/ur-r1/kbv-answer/when-did-you-receive-your-last-state-pension-payment");
    } else {
        response.redirect("/ur-r1/kbv-answer/when-did-you-receive-your-last-state-pension-payment");
    }
});


/////

router.post('/pension-date-show', (req, res) => {
  const q1 = (req.session.data['anotherbenefitshow'] || '').toLowerCase().trim();
  const q2 = (req.session.data['pensiondateshow'] || '').toLowerCase().trim();

  // Guard: user shouldn’t be here without answering Q1
  if (!['yes', 'no'].includes(q1)) {
    return res.redirect('/ur-r1/kbv-answer/another-benefit-you-have-previously-applied-for');
  }

  // NEW: Guard for missing Q2
  if (!['yes', 'no'].includes(q2)) {
    return res.redirect('/error-page'); // Replace with your actual error page route
  }

  if (q1 === 'yes' && q2 === 'yes') {
    return res.redirect('/ur-r1/kbv-answer/identity-verified');
  }
  if ((q1 === 'no' && q2 === 'yes') || (q1 === 'yes' && q2 === 'no')) {
    return res.redirect('/ur-r1/kbv-answer/what-is-your-mobile-telephone-number');
  }

  // q1 === 'no' && q2 === 'no'
  return res.redirect('/ur-r1/kbv-answer/identity-not-verified');
});


///////

router.post('/mobile-show', (req, res) => {
  const q2 = (req.session.data['pensiondateshow'] || '').toLowerCase().trim();
  const q3 = (req.session.data['mobileshow'] || '').toLowerCase().trim();

  // Guard: user shouldn’t be here without answering Q2
  if (!['yes', 'no'].includes(q2)) {
    return res.redirect('/ur-r1/kbv-answer/when-did-you-receive-your-last-state-pension-payment');
  }

  // NEW: Guard for missing Q3
  if (!['yes', 'no'].includes(q3)) {
    return res.redirect('/error-page'); // Replace with your actual error page route
  }

  if (q2 === 'yes' && q3 === 'yes') {
    return res.redirect('/ur-r1/kbv-answer/identity-verified');
  }
  if (q2 === 'no' && q3 === 'yes') {
    return res.redirect('/ur-r1/kbv-answer/identity-verified');
  }
  if (q2 === 'yes' && q3 === 'no') {
    return res.redirect('/ur-r1/kbv-answer/identity-not-verified');
  }

  // q2 === 'no' && q3 === 'no'
  return res.redirect('/ur-r1/kbv-answer/identity-not-verified');
});


////////// route code for full fat UR-r1 //////////

// --------------------
// Q1: Another benefit applied for
// --------------------
router.get('/another-benefit-you-have-previously-applied-for', (req, res) => {
    res.render('ur-r1/kbv-no-answer/another-benefit-you-have-previously-applied-for');
});

router.post('/another-benefit-you-have-previously-applied-for', (req, res) => {
    const anotherBenefit = (req.body.anotherBenefit || '').trim();

    if (anotherBenefit === 'job-seekers-allowance') {
        // ✅ Correct answer → go to next question
        return res.redirect('/when-did-you-receive-your-last-state-pension-payment');
    } else {
        // ❌ Incorrect answer → show error page
        return res.redirect('/ur-r1/kbv-no-answer/when-did-you-receive-your-last-pension-payment');
    }
});

// --------------------
// Q2: When did you receive your last pension payment?
// --------------------
router.get('/when-did-you-receive-your-last-state-pension-payment', (req, res) => {
    res.render('ur-r1/kbv-no-answer/when-did-you-receive-your-last-state-pension-payment');
});

router.post('/when-did-you-receive-your-last-state-pension-payment', (req, res) => {
    const day = (req.body['pension-received-day'] || '').trim();
    const month = (req.body['pension-received-month'] || '').trim();
    const year = (req.body['pension-received-year'] || '').trim();

    const enteredDate = `${day}-${month}-${year}`;

    if (enteredDate === '25-10-2025') {
        // ✅ Both Q1 and Q2 correct → go to success page
        return res.redirect('/ur-r1/kbv-no-answer/identity-verified');
    } else {
        // ❌ Incorrect date → show error page
        return res.redirect('/ur-r1/kbv-no-answer/what-is-your-mobile-telephone-number');
    }
});


// --------------------
// Q3: What is your mobile telephone number?
// --------------------
router.get('/what-is-your-mobile-telephone-number', (req, res) => {
    res.render('ur-r1/kbv-no-answer/what-is-your-mobile-telephone-number');
});

router.post('/what-is-your-mobile-telephone-number', (req, res) => {
    const mobileNumber = (req.body['customer-mobile-tel'] || '').trim();

    // Remove spaces for comparison
    const normalizedNumber = mobileNumber.replace(/\s+/g, '');

    // Flexible check: must match 07123456789 exactly after removing spaces
    if (normalizedNumber === '07123456789') {
        // ✅ Correct mobile number → success page
        return res.redirect('/ur-r1/kbv-no-answer/identity-verified');
    } else {
        // ❌ Incorrect mobile number → failure page
        return res.redirect('/ur-r1/kbv-no-answer/identity-not-verified');
    }
});


// --------------------
// Success Page
// --------------------
router.get('/identity-verified-success', (req, res) => {
    res.render('/ur-r1/kbv-no-answer/identity-verified-success');
});

// --------------------
// Error Page
// --------------------
router.get('/ur-r1/kbv-no-answer/error', (req, res) => {
    res.render('ur-r1/kbv-no-answer/error');
});

// -------------------------
// UR-r2 routes
// -------------------------

// --------------------
// Establish identity NINO
// --------------------

router.post('/nino-answer', function (request, response) {
    var nino = request.session.data['nationalinsurancenumber']

    if (!nino || nino.length === 0) {
        response.redirect('/ur-r2/establish-your-identity-nino-error')
    } else if (
        nino.includes("QQ 12 34 56 C") ||
        nino === "qq123456c" ||
        nino === "QQ123456C"
    ) {
        response.redirect("/ur-r2/confirm-correct-record")
    } else {
        response.redirect('/ur-r2/correct-record-unhappy')
    }
})


// --------------------
// Establish identity name DOB
// --------------------




// --------------------
// Correct customer record
// --------------------

router.post('/correct-record', function (request, response) {
    var correctrecord = request.session.data['correctrecord']
    if (correctrecord == "yes") {
        response.redirect("/ur-r2/kbv-start-flag-found")
    } else {
        response.redirect("/ur-r2/correct-record-unhappy")
    }
})

// -------------------------
// UR-r2 - Show Answers
// -------------------------

router.post('/another-benefit-show-ur2', function (request, response) {
    var anotherbenefitshow = request.session.data['anotherbenefitshow'];

    if (!anotherbenefitshow) {
        // If no answer is selected, redirect to an error page
        response.redirect("/ur-r2/kbv-answer/another-benefit-you-have-previously-applied-for-error");
    } else if (anotherbenefitshow === "yes") {
        response.redirect("/ur-r2/kbv-answer/When-did-you-receive-your-last-payment");
    } else {
        response.redirect("/ur-r2/kbv-answer/When-did-you-receive-your-last-payment");
    }
});


/////

router.post('/pension-date-show-ur2', (req, res) => {
  const q1 = (req.session.data['anotherbenefitshow'] || '').toLowerCase().trim();
  const q2 = (req.session.data['pensiondateshow'] || '').toLowerCase().trim();

  // Guard: user shouldn’t be here without answering Q1
  if (!['yes', 'no'].includes(q1)) {
    return res.redirect('/kbv-answer/another-benefit-you-have-previously-applied-for');
  }

  // NEW: Guard for missing Q2
  if (!['yes', 'no'].includes(q2)) {
    return res.redirect('/error-page'); // Replace with your actual error page route
  }

  if (q1 === 'yes' && q2 === 'yes') {
    return res.redirect('/ur-r2/identity-verified-flag-found');
  }
  if ((q1 === 'no' && q2 === 'yes') || (q1 === 'yes' && q2 === 'no')) {
    return res.redirect('/ur-r2/kbv-answer/what-is-your-mobile-telephone-number');
  }

  // q1 === 'no' && q2 === 'no'
  return res.redirect('/ur-r2/identity-not-verified-flag-found');
});


///////

router.post('/mobile-show-ur2', (req, res) => {
  const q2 = (req.session.data['pensiondateshow'] || '').toLowerCase().trim();
  const q3 = (req.session.data['mobileshow'] || '').toLowerCase().trim();

  // Guard: user shouldn’t be here without answering Q2
  if (!['yes', 'no'].includes(q2)) {
    return res.redirect('/kbv-answer/when-did-you-receive-your-last-payment');
  }

  // NEW: Guard for missing Q3
  if (!['yes', 'no'].includes(q3)) {
    return res.redirect('/error-page'); // Replace with your actual error page route
  }

  if (q2 === 'yes' && q3 === 'yes') {
    return res.redirect('/ur-r2/identity-verified-flag-found');
  }
  if (q2 === 'no' && q3 === 'yes') {
    return res.redirect('/ur-r2/identity-verified-flag-found');
  }
  if (q2 === 'yes' && q3 === 'no') {
    return res.redirect('/ur-r2/identity-not-verified-flag-found');
  }

  // q2 === 'no' && q3 === 'no'
  return res.redirect('/ur-r2/identity-not-verified-flag-found');
});

//////////


// --------------------------------------
// UR-r2 - Routing for flag found variant
// --------------------------------------
