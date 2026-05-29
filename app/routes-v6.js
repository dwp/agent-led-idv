module.exports = function (router) {

  // ✅ Test route
  router.get('/v6/routes-v6', (req, res) => {
    res.send('Hello from Routes v6');
  });


  // =====================================================
  // ✅ NO FLAG JOURNEY
  // =====================================================

  // ---------------------------------
  // NINO answer (NO FLAG)
  // ---------------------------------
  router.post('/v6/no-flag/nino-answer', function (req, res) {
    const nino = req.session.data['nationalinsurancenumber'];

    if (!nino || nino.length === 0) {
      return res.redirect('/v6/no-flag/establish-identity-match-nino-error');
    }

    if (
      nino.includes("QQ 12 34 56 C") ||
      nino === "qq123456c" ||
      nino === "QQ123456C"
    ) {
      return res.redirect('/v6/no-flag/confirm-correct-record');
    }

    return res.redirect('/v6/no-flag/no-match-nino');
  });

  // ---------------------------------------------------------
  // name, dob, postcode answer (NO FLAG)
  // ---------------------------------------------------------

  router.post('/v6/no-flag/name-dob-postcode-answer', function (req, res) {

    const firstname = req.session.data['firstname'];
    const lastname = req.session.data['lastname'];
    const day = req.session.data['date-of-birth-day'];
    const month = req.session.data['date-of-birth-month'];
    const year = req.session.data['date-of-birth-year'];
    const postcode = req.session.data['addressPostcode'];

    const name = `${firstname} ${lastname}`;

    const cleanName = name
      ? name.trim().replace(/\s+/g, ' ').toUpperCase()
      : "";

    const cleanPostcode = postcode
      ? postcode.trim().replace(/\s+/g, '').toUpperCase()
      : "";

    const dob = `${day}-${month}-${year}`;

    if (!cleanName || !day || !month || !year || !cleanPostcode) {
      return res.redirect('/v6/no-flag/establish-your-identity-name-dob-postcode-error');
    }

    if (
      cleanName === "ALBUS DUMBLEDORE" &&
      dob === "5-1-1978" &&
      cleanPostcode === "PE16AN"
    ) {
      return res.redirect('/v6/no-flag/confirm-correct-record-short');
    }

    return res.redirect('/v6/no-flag/no-match-name-dob-postcode');
  })


  // ---------------------------------
  // Confirm record (NO FLAG)
  // ---------------------------------
  router.post('/v6/no-flag/correct-record-answer', function (req, res) {
    const answer = req.session.data['correctrecord'];

    if (answer === "yes") {
      return res.redirect('/v6/no-flag/another-benefit-you-have-previously-applied-for');
    } else {
      return res.redirect('/v6/no-flag/establish-your-identity-nino');
    }
  });

  // ---------------------------------
  // Q2: Payment date (NO FLAG)
  // ---------------------------------
  router.get('/v6/no-flag/when-did-you-receive-your-last-payment', (req, res) => {
    res.render('v6/no-flag/when-did-you-receive-your-last-payment');
  });

  router.post('/v6/no-flag/when-did-you-receive-your-last-payment', (req, res) => {
    const day = (req.body['payment-received-day'] || '').trim();
    const month = (req.body['payment-received-month'] || '').trim();
    const year = (req.body['payment-received-year'] || '').trim();

    if (!day || !month || !year) {
      return res.redirect('/v6/no-flag/when-did-you-receive-your-last-payment-error');
    }

    const enteredDate = `${day}-${month}-${year}`;

    if (enteredDate === '25-10-2025') {
      return res.redirect('/v6/no-flag/identity-verified');
    }

    return res.redirect('/v6/no-flag/what-is-your-mobile-telephone-number');
  });

  // ---------------------------------
  // Q3: Mobile (NO FLAG)
  // ---------------------------------
  router.get('/v6/no-flag/what-is-your-mobile-telephone-number', (req, res) => {
    res.render('v6/no-flag/what-is-your-mobile-telephone-number');
  });

  router.post('/v6/no-flag/what-is-your-mobile-telephone-number', (req, res) => {
    const mobile = (req.body['customer-mobile-tel-v6'] || '').trim();

    if (!mobile) {
      return res.redirect('/v6/no-flag/what-is-your-mobile-telephone-number-error');
    }

    if (mobile === '07123456789') {
      return res.redirect('/v6/no-flag/identity-verified');
    }

    return res.redirect('/v6/no-flag/identity-not-verified');
  });


  // =====================================================
  // ✅ FLAG JOURNEY
  // =====================================================

  // ---------------------------------
  // NINO answer (FLAG)
  // ---------------------------------
  router.post('/v6/flag/nino-answer', function (req, res) {
    const nino = req.session.data['nationalinsurancenumber'];

    if (!nino || nino.length === 0) {
      return res.redirect('/v6/flag/establish-identity-match-nino-error');
    }

    if (
      nino.includes("QQ 12 34 56 C") ||
      nino === "qq123456c" ||
      nino === "QQ123456C"
    ) {
      return res.redirect('/v6/flag/confirm-correct-record');
    }

    return res.redirect('/v6/flag/no-match-nino');
  });

  // ---------------------------------------------------------
  // name, dob, postcode answer (FLAG)
  // ---------------------------------------------------------

  router.post('/v6/flag/name-dob-postcode-answer', function (req, res) {

    const firstname = req.session.data['firstname'];
    const lastname = req.session.data['lastname'];
    const day = req.session.data['date-of-birth-day'];
    const month = req.session.data['date-of-birth-month'];
    const year = req.session.data['date-of-birth-year'];
    const postcode = req.session.data['addressPostcode'];

    const name = `${firstname} ${lastname}`;

    const cleanName = name
      ? name.trim().replace(/\s+/g, ' ').toUpperCase()
      : "";

    const cleanPostcode = postcode
      ? postcode.trim().replace(/\s+/g, '').toUpperCase()
      : "";

    const dob = `${day}-${month}-${year}`;

    if (!cleanName || !day || !month || !year || !cleanPostcode) {
      return res.redirect('/v6/flag/establish-your-identity-name-dob-postcode-error');
    }

    if (
      cleanName === "ALBUS DUMBLEDORE" &&
      dob === "5-1-1978" &&
      cleanPostcode === "PE16AN"
    ) {
      return res.redirect('/v6/flag/confirm-correct-record-short');
    }

    return res.redirect('/v6/flag/no-match-name-dob-postcode');
  })


  // ---------------------------------
  // Confirm record (FLAG)
  // ---------------------------------
  router.post('/v6/flag/correct-record-answer', function (req, res) {
    const answer = req.session.data['correctrecord'];

    if (answer === "yes") {
      return res.redirect('/v6/flag/counter-fraud-flag-found');
    } else {
      return res.redirect('/v6/flag/establish-your-identity-nino');
    }
  });

  // ---------------------------------
  // Q2: Payment date (FLAG)
  // ---------------------------------
  router.get('/v6/flag/when-did-you-receive-your-last-payment', (req, res) => {
    res.render('v6/flag/when-did-you-receive-your-last-payment');
  });

  router.post('/v6/flag/when-did-you-receive-your-last-payment', (req, res) => {
    const day = (req.body['payment-received-day'] || '').trim();
    const month = (req.body['payment-received-month'] || '').trim();
    const year = (req.body['payment-received-year'] || '').trim();

    if (!day || !month || !year) {
      return res.redirect('/v6/flag/when-did-you-receive-your-last-payment-error');
    }

    const enteredDate = `${day}-${month}-${year}`;

    if (enteredDate === '25-10-2025') {
      return res.redirect('/v6/flag/identity-verified-flag-found');
    }

    return res.redirect('/v6/flag/what-is-your-mobile-telephone-number');
  });

  // ---------------------------------
  // Q3: Mobile (FLAG)
  // ---------------------------------
  router.get('/v6/flag/what-is-your-mobile-telephone-number', (req, res) => {
    res.render('v6/flag/what-is-your-mobile-telephone-number');
  });

  router.post('/v6/flag/what-is-your-mobile-telephone-number', (req, res) => {
    const mobile = (req.body['customer-mobile-tel-v6'] || '').trim();

    if (!mobile) {
      return res.redirect('/v6/flag/what-is-your-mobile-telephone-number-error');
    }

    if (mobile === '07123456789') {
      return res.redirect('/v6/flag/identity-verified-flag-found');
    }

    return res.redirect('/v6/flag/identity-not-verified-flag-found');
  });


// ---------------------------------------------------------
// NO KBV - UR-R5 - Confirm record yes or no
// ---------------------------------------------------------

router.post('/correct-record-v6-nokbv', function (request, response) {
    var correctrecord = request.session.data['correctrecord']
    if (correctrecord == "yes") {
        response.redirect("/v6/no-kbv/find-some-security-questions-no-flag")
    } else {
        response.redirect("/v6/no-kbv/identity-not-verified")
    }
})


// ---------------------------------------------------------
// NO KBV - V6 - Find some security questions
// ---------------------------------------------------------

router.post('/correct-nokbv', function (request, response) {
    var correctrecord = request.session.data['correctnokbv']
    if (correctrecord == "yes") {
        response.redirect("/v6/no-kbv/identity-verified")
    } else {
        response.redirect("/v6/no-kbv/identity-not-verified")
    }
})


// ✅ Store the last page on every GET request

router.get('*', function (req, res, next) {
    // Don't overwrite previousPage when you're ON the end-session page
    if (!req.originalUrl.includes('/end-session')) {
        req.session.data.prevPage = req.originalUrl;
    }

    next();
});

};
