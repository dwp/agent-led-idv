module.exports = function (router) {

  // =========================================
  // GET PAGES
  // =========================================


  router.get('/v6-1/establish-identity/what-is-your-national-insurance-number', (req, res) => {

    // ✅ Only handle quick links
    if (req.query.nationalinsurancenumber) {
      req.session.data.nationalinsurancenumber = req.query.nationalinsurancenumber;
    }

    res.render('v6-1/establish-identity/what-is-your-national-insurance-number');
  });

  router.get('/v6-1/establish-identity/check-correct-record', (req, res) => {
    res.render('v6-1/establish-identity/check-correct-record');
  });

  router.get('/v6-1/establish-identity/found-your-customer-record', (req, res) => {
    res.render('v6-1/establish-identity/found-your-customer-record');
  });

  router.get('/v6-1/establish-identity/no-customer-record-found', (req, res) => {
    res.render('v6-1/establish-identity/no-customer-record-found');
  });

  router.get('/v6-1/establish-identity/no-match-found', (req, res) => {
    res.render('v6-1/establish-identity/no-match-found');
  });


  router.get('/v6-1/establish-identity/search-for-your-details', (req, res) => {
    res.render('v6-1/establish-identity/search-for-your-details');
  });


  router.get('/v6-1/establish-identity/search-for-your-details-another-way', (req, res) => {
    res.redirect('/v6-1/establish-identity/search-for-your-details');
  });

  router.get('/v6-1/no-kbv/find-some-security-questions', (req, res) => {
    res.render('v6-1/no-kbv/find-some-security-questions');
  });

  router.get('/v6-1/no-kbv/find-some-security-questions-to-ask-you', (req, res) => {
    res.redirect('/v6-1/no-kbv/find-some-security-questions');
  });

  router.get('/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for', (req, res) => {
    res.render('v6-1/kbv-questions/another-benefit-you-have-previously-applied-for');
  });

  router.get('/v6-1/kbv-questions/when-did-you-receive-your-last-payment', (req, res) => {
    res.render('v6-1/kbv-questions/when-did-you-receive-your-last-payment');
  });

  router.get('/v6-1/kbv-questions/what-is-your-mobile-telephone-number', (req, res) => {
    res.render('v6-1/kbv-questions/what-is-your-mobile-telephone-number');
  });

  // ✅ ✅ ADDED: FRAUD PAGE (Severus)
  router.get('/v6-1/counter-fraud-checks/bring-up-security-questions-single', (req, res) => {
    res.render('v6-1/counter-fraud-checks/bring-up-security-questions-single');
  });

  router.get('/v6-1/counter-fraud-checks/bring-up-some-security-questions-single', (req, res) => {
      res.redirect('/v6-1/counter-fraud-checks/bring-up-security-questions-single');
  });


  // ✅ END SESSION GET
  router.get('/v6-1/end/end-this-session', (req, res) => {

    const referer = req.get('Referrer');

    if (referer && !referer.includes('/v6-1/end/end-this-session')) {
      req.session.data.previousPage = referer;
    }

    res.render('v6-1/end/end-this-session');
  });

  router.get('/v6-1/end/end-session', (req, res) => {
    res.redirect('/v6-1/end/end-this-session');
  });


  // =========================================
  // NINO ENTRY ✅
  // =========================================

  router.post('/v6-1/establish-identity/what-is-your-national-insurance-number', (req, res) => {

    const raw = req.session.data['nationalinsurancenumber'] || '';

    if (!raw.trim()) {
      return res.redirect('/v6-1/errors/input-errors/missing-nino');
    }

    const cleaned = raw.replace(/\s/g, '').toUpperCase();

    const formatted = cleaned.replace(/^(.{2})(.{2})(.{2})(.{2})(.{1})$/, '$1 $2 $3 $4 $5');

    req.session.data.nationalinsurancenumber = cleaned;
    req.session.data.nationalinsurancenumberFormatted = formatted;

    const journeys = {
      'QQ123456C': { type: 'standard', name: 'Albus Dumbledore', dob: '5/1/1978', postcode: 'PE1 6AN' },
      'QQ444444C': { type: 'flagged', name: 'Severus Snape', dob: '9/1/1960', postcode: 'SW1A 1AA' },
      'QQ333333C': { type: 'no-kbv', name: 'Romilda Vane', dob: '13/2/1981', postcode: 'M1 1AA' }
    };

    const journey = journeys[cleaned];

    if (journey) {

      req.session.data.journey = { type: journey.type };
      req.session.data.customerName = journey.name;
      req.session.data.customerPostcode = journey.postcode;

      req.session.data.nationalinsurancenumber = cleaned;
      req.session.data.nationalinsurancenumberFormatted = formatted;

      const [d, m, y] = journey.dob.split('/');
      const date = new Date(y, m - 1, d);

      req.session.data.customerDob = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return res.redirect('/v6-1/establish-identity/check-correct-record');
    }

    return res.redirect('/v6-1/establish-identity/no-customer-record-found');
  });

  // =========================================
  // NAME SEARCH ✅
  // =========================================

  router.post('/v6-1/establish-identity/name-dob-postcode-answer', (req, res) => {

    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const day = req.body['date-of-birth-day'];
    const month = req.body['date-of-birth-month'];
    const year = req.body['date-of-birth-year'];
    const postcode = req.body.addressPostcode;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !day?.trim() ||
      !month?.trim() ||
      !year?.trim() ||
      !postcode?.trim()
    ) {
      return res.redirect('/v6-1/errors/input-errors/missing-details');
    }

    const customers = [
  { name: 'Albus Dumbledore', dob: '5/1/1978', postcode: 'PE1 6AN', nino: 'QQ123456C', type: 'standard' },
  { name: 'Severus Snape', dob: '9/1/1960', postcode: 'SW1A 1AA', nino: 'QQ444444C', type: 'flagged' },
  { name: 'Romilda Vane', dob: '13/2/1981', postcode: 'M1 1AA', nino: 'QQ333333C', type: 'no-kbv' }
];

    const fullName = `${firstName} ${lastName}`
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();

    const dob = `${parseInt(day)}/${parseInt(month)}/${year}`;
    const cleanedPostcode = postcode.toUpperCase().replace(/\s/g, '');

    const match = customers.find(p => {

      const [d, m, y] = p.dob.split('/');
      const storedDob = `${parseInt(d)}/${parseInt(m)}/${y}`;

      return (
        p.name.toLowerCase() === fullName &&
        storedDob === dob &&
        p.postcode.replace(/\s/g, '') === cleanedPostcode
      );
    });

    if (match) {

      req.session.data.journey = { type: match.type };
      req.session.data.customerName = match.name;
      req.session.data.customerPostcode = match.postcode;

      const formatted = match.nino.replace(/^(.{2})(.{2})(.{2})(.{2})(.{1})$/, '$1 $2 $3 $4 $5');

      req.session.data.nationalinsurancenumber = match.nino;
      req.session.data.nationalinsurancenumberFormatted = formatted;

      const [d, m, y] = match.dob.split('/');
      const date = new Date(y, m - 1, d);

      req.session.data.customerDob = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return res.redirect('/v6-1/establish-identity/found-your-customer-record');
    }

    req.session.data.customerName = `${firstName} ${lastName}`;
    req.session.data.customerDob = `${day} ${month} ${year}`;
    req.session.data.customerPostcode = postcode;

    return res.redirect('/v6-1/establish-identity/no-match-found');

  });

  // =========================================
  // CHECK CORRECT RECORD ✅
  // =========================================

  router.post('/v6-1/establish-identity/check-correct-record', (req, res) => {

    const answer = req.body.correctrecord;

    if (!answer) {
      return res.redirect('/v6-1/errors/input-errors/missing-selection');
    }

    if (answer === 'no') {
      return res.redirect('/v6-1/reset-session');
    }

    return routeFromJourney(req.session.data.journey, res);

  });

  // =========================================
  // ROUTING FUNCTION ✅ (FIXED)
  // =========================================

  function routeFromJourney(journey, res) {

    if (!journey) {
      return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
    }

    if (journey.type === 'no-kbv') {
      return res.redirect('/v6-1/no-kbv/find-some-security-questions');
    }

    // ✅ FIX: Severus now goes to fraud page
    if (journey.type === 'flagged') {
      return res.redirect('/v6-1/counter-fraud-checks/bring-up-security-questions-single');
    }

    return res.redirect('/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for');

  }

  // =========================================
  // KBV LOGIC ✅
  // =========================================

  router.post('/v6-1/kbv-questions/when-did-you-receive-your-last-payment', (req, res) => {

    let journey = req.session.data.journey;

    // ✅ allow back button / retry
    if (!journey) {
      journey = { type: 'standard' };
      req.session.data.journey = journey;
    }

    const day = req.body['payment-received-day'];
    const month = req.body['payment-received-month'];
    const year = req.body['payment-received-year'];

    if (!day || !month || !year) {
      return res.redirect('/v6-1/errors/input-errors/missing-date');
    }

    if (day === '25' && month === '10' && year === '2025') {

  // ✅ Severus (flagged)
  if (journey.type === 'flagged') {
    return res.redirect('/v6-1/idv-outcomes/you-have-answered-the-security-questions');
  }

  // ✅ Everyone else
  return res.redirect('/v6-1/idv-outcomes/you-have-proved-your-identity');
}

// ✅ Severus wrong Q2 → go to Q3
if (journey.type === 'flagged') {
  return res.redirect('/v6-1/kbv-questions/what-is-your-mobile-telephone-number');
}

// ✅ Others continue KBV
return res.redirect('/v6-1/kbv-questions/what-is-your-mobile-telephone-number');
  });

  router.post('/v6-1/kbv-questions/what-is-your-mobile-telephone-number', (req, res) => {

    let journey = req.session.data.journey;

    // ✅ allow back button / retry
    if (!journey) {
      journey = { type: 'standard' };
      req.session.data.journey = journey;
    }
    
  const mobile = req.body['customer-mobile-tel-v6'];

  if (!mobile || mobile.trim() === '') {
    return res.redirect('/v6-1/errors/input-errors/missing-phone');
  }

  const isCorrect = (mobile === '07700 900000');

  // ✅ Severus (flagged)
  if (journey.type === 'flagged') {

    if (isCorrect) {
      return res.redirect('/v6-1/idv-outcomes/you-have-answered-the-security-questions');
    }

    return res.redirect('/v6-1/idv-outcomes/you-have-not-passed-the-security-questions');
  }

  // ✅ Everyone else (Albus)
  if (isCorrect) {
    return res.redirect('/v6-1/idv-outcomes/you-have-proved-your-identity');
  }

  return res.redirect('/v6-1/idv-outcomes/you-have-not-proved-your-identity');

});

  // =========================================
  // END SESSION ✅
  // =========================================

  router.post('/v6-1/end/end-this-session', (req, res) => {

    const answer = req.body.endSession;

    if (!answer) {
      return res.redirect('/v6-1/errors/input-errors/missing-selection');
    }

    if (answer === 'yes') {
      req.session.data = {};
      return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
    }


    const back = req.session.data.previousPage;

    // ✅ Allow internal URLs only
    if (back && (back.includes('/v6-1/') || back.startsWith('/v6-1/'))) {
      return res.redirect(back);
    }

    // ✅ Safe fallback
    return res.redirect('/v6-1/establish-identity/check-correct-record');

  });

  // =========================================
// NO KBV ✅
// =========================================

router.post('/v6-1/no-kbv/find-some-security-questions', (req, res) => {

  const answer = req.body.correctnokbv;

  // ❌ nothing selected
  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection');
  }

  // ✅ YES → pass
  if (answer === 'yes') {
    return res.redirect('/v6-1/idv-outcomes/you-have-proved-your-identity');
  }

  // ❌ NO → fail
  return res.redirect('/v6-1/idv-outcomes/you-have-not-proved-your-identity');

});

// =========================================
// FOUND ONLY ROUTE
// =========================================

router.get('/v6-1/establish-identity/route-from-found', (req, res) => {

  const journey = req.session.data.journey;

  if (!journey) {
    return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
  }

  // ✅ Romilda
  if (journey.type === 'no-kbv') {
    return res.redirect('/v6-1/no-kbv/find-some-security-questions');
  }

  // ✅ Severus
  if (journey.type === 'flagged') {
    return res.redirect('/v6-1/counter-fraud-checks/bring-up-security-questions-single');
  }

  // ✅ Albus
  return res.redirect('/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for');

});

// =========================================
// CLEAR SESSION
// =========================================

router.get('/v6-1/reset-session', (req, res) => {

  req.session.destroy(() => {
    res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
  });

});

};
