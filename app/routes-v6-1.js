module.exports = function (router) {

  // =========================================
  // GET PAGES
  // =========================================

  router.get('/v6-1/establish-identity/what-is-your-national-insurance-number', (req, res) => {
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

  router.get('/v6-1/establish-identity/search-for-your-customer-record-another-way', (req, res) => {
    res.render('v6-1/establish-identity/search-for-your-customer-record-another-way');
  });

  router.get('/v6-1/no-kbv/find-some-security-questions-to-ask-you', (req, res) => {
    res.render('v6-1/no-kbv/find-some-security-questions-to-ask-you');
  });

  router.get('/v6-1/counter-fraud-checks/bring-up-some-security-questions-single', (req, res) => {
    res.render('v6-1/counter-fraud-checks/bring-up-some-security-questions-single');
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

  // =========================================
  // END SESSION (GET)
  // =========================================

  router.get('/v6-1/end/end-session', (req, res) => {

    const referer = req.get('Referrer');

    if (referer && !referer.includes('/v6-1/end/end-session')) {
      req.session.data.previousPage = referer;
    }

    res.render('v6-1/end/end-session');
  });



  // =========================================
  // NINO ENTRY
  // =========================================

  router.post('/v6-1/establish-identity/what-is-your-national-insurance-number', (req, res) => {

    const raw = req.session.data['nationalinsurancenumber'] || '';
    const cleaned = raw.replace(/\s/g, '').toUpperCase();

    let formatted = cleaned;
    if (cleaned.length === 9) {
      formatted = cleaned.replace(/^(.{2})(.{2})(.{2})(.{2})(.{1})$/, '$1 $2 $3 $4 $5');
    }

    const journeys = {
      'QQ123456C': { type: 'standard', name: 'Albus Dumbledore', dob: '5/1/1978', postcode: 'PE1 6AN' },
      'QQ444444C': { type: 'flagged', name: 'Severus Snape', dob: '9/1/1960', postcode: 'SW1A 1AA' },
      'QQ333333C': { type: 'no-kbv', name: 'Romilda Vane', dob: '13/2/1981', postcode: 'M1 1AA' }
    };

    const journey = journeys[cleaned];

    if (journey) {
      req.session.data.journey = { type: journey.type };
      req.session.data.customerName = journey.name;
      req.session.data.customerDob = journey.dob;
      req.session.data.customerPostcode = journey.postcode;
      req.session.data.nationalinsurancenumber = cleaned;
      req.session.data.nationalinsurancenumberFormatted = formatted;

      return res.redirect('/v6-1/establish-identity/check-correct-record');
    }

    return res.redirect('/v6-1/establish-identity/no-customer-record-found');
  });



  // =========================================
  // NAME SEARCH
  // =========================================

  router.post('/v6-1/establish-identity/name-dob-postcode-answer', (req, res) => {

    const firstName = req.body.firstname;
    const lastName = req.body.lastname;

    const day = parseInt(req.body['date-of-birth-day']);
    const month = parseInt(req.body['date-of-birth-month']);
    const year = req.body['date-of-birth-year'];

    const postcode = req.body.addressPostcode.toUpperCase().replace(/\s/g, '');

    const dob = `${day}/${month}/${year}`;
    const fullName = `${firstName} ${lastName}`.toLowerCase();

    const customers = [
      { name: 'Albus Dumbledore', dob: '5/1/1978', postcode: 'PE1 6AN', nino: 'QQ123456C', type: 'standard' },
      { name: 'Severus Snape', dob: '9/1/1960', postcode: 'SW1A 1AA', nino: 'QQ444444C', type: 'flagged' },
      { name: 'Romilda Vane', dob: '13/2/1981', postcode: 'M1 1AA', nino: 'QQ333333C', type: 'no-kbv' }
    ];

    const match = customers.find(person => {
      const [d, m, y] = person.dob.split('/');
      const storedDob = `${parseInt(d)}/${parseInt(m)}/${y}`;

      return (
        person.name.toLowerCase() === fullName &&
        storedDob === dob &&
        person.postcode.replace(/\s/g, '') === postcode
      );
    });

    if (match) {

      const formatted = match.nino.replace(/^(.{2})(.{2})(.{2})(.{2})(.{1})$/, '$1 $2 $3 $4 $5');

      req.session.data.journey = { type: match.type };
      req.session.data.customerName = match.name;
      req.session.data.customerDob = match.dob;
      req.session.data.customerPostcode = match.postcode;
      req.session.data.nationalinsurancenumber = match.nino;
      req.session.data.nationalinsurancenumberFormatted = formatted;

      return res.redirect('/v6-1/establish-identity/found-your-customer-record');
    }

    return res.redirect('/v6-1/establish-identity/no-match-found');
  });



  // =========================================
  // FOUND RECORD ROUTE
  // =========================================

  router.post('/v6-1/establish-identity/found-your-customer-record', (req, res) => {
    return routeFromJourney(req.session.data.journey, res);
  });



  // =========================================
  // CHECK RECORD ROUTE
  // =========================================

  router.post('/v6-1/establish-identity/check-correct-record', (req, res) => {

    const answer = req.session.data.correctrecord;

    if (answer === 'no') {
      return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
    }

    return routeFromJourney(req.session.data.journey, res);
  });



  // =========================================
  // KBV - PAYMENT DATE ✅
  // =========================================

  router.post('/v6-1/kbv-questions/when-did-you-receive-your-last-payment', (req, res) => {

  const day = req.body['payment-received-day'];
  const month = req.body['payment-received-month'];
  const year = req.body['payment-received-year'];

  // ❌ blank
  if (!day || !month || !year) {
    return res.redirect('/v6-1/errors/input-errors/missing-date');
  }

  // ✅ correct answer → SUCCESS
  if (day === '25' && month === '10' && year === '2025') {
    return res.redirect('/v6-1/idv-outcomes/you-have-proved-your-identity');
  }

  // ❌ wrong → go to Q3
  return res.redirect('/v6-1/kbv-questions/what-is-your-mobile-telephone-number');
});




  // =========================================
  // ✅ KBV - MOBILE NUMBER (YOUR FIX)
  // =========================================

  router.post('/v6-1/kbv-questions/what-is-your-mobile-telephone-number', (req, res) => {

  const mobile = req.body['customer-mobile-tel-v6'];

  // ❌ blank
  if (!mobile) {
    return res.redirect('/v6-1/errors/input-errors/missing-phone');
  }

  // ✅ correct → SUCCESS
  if (mobile === '07700 900000') {
    return res.redirect('/v6-1/idv-outcomes/you-have-proved-your-identity');
  }

  // ❌ wrong → FAIL
  return res.redirect('/v6-1/idv-outcomes/you-have-not-proved-your-identity');
});



  // =========================================
  // SHARED JOURNEY ROUTING
  // =========================================

  function routeFromJourney(journey, res) {

    if (journey.type === 'no-kbv') {
      return res.redirect('/v6-1/no-kbv/find-some-security-questions-to-ask-you');
    }

    if (journey.type === 'flagged') {
      return res.redirect('/v6-1/counter-fraud-checks/bring-up-some-security-questions-single');
    }

    return res.redirect('/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for');
  }



  // =========================================
  // END SESSION POST
  // =========================================

  router.post('/v6-1/end/end-session', (req, res) => {

    const answer = req.session.data['endSession'];
    const back = req.session.data.previousPage;

    if (answer === 'yes') {
      req.session.data = {};
      return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number');
    }

    return res.redirect(back || '/v6-1/establish-identity/check-correct-record');
  });

};
