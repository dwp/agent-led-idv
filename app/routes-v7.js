module.exports = function (router) {

  router.get('/v7/representative/reset', function (req, res) {

    delete req.session.data.representativeJourney

    res.redirect(
      '/v7/representative/behalf-of-yourself-or-someone-else'
    )

  })

// =========================================
// NINO search representative start switch
// =========================================

router.get('/v7/representative/reset', function (req, res) {

  delete req.session.data.representativeJourney

  delete req.session.data.nationalinsurancenumber
  delete req.session.data.nationalinsurancenumberFormatted

  res.redirect(
    '/v7/representative/behalf-of-yourself-or-someone-else'
  )

})

  // =========================================
  // Their NINO search start
  // =========================================

  router.get('/v7/representative/start', function (req, res) {

    req.session.data.representativeJourney = true

    res.redirect(
      '/v7/representative/what-is-their-national-insurance-number'
    )

  })

  router.get('/v7/representative/end', function (req, res) {

    delete req.session.data.representativeJourney

    res.redirect(
      '/v7/representative/what-is-your-national-insurance-number-rep-start'
    )

  })

// =========================================
// Are you an official representative
// =========================================

  router.post('/v7/representative/are-you-an-official-representative', function (req, res) {

    const answer = req.body.repAnswer

    if (!answer) {
      return res.redirect('/v6-1/errors/input-errors/missing-selection')
    }

    if (answer === 'yesrep') {
      return res.redirect(
        '/v7/representative/what-type-of-representative-are-you'
      )
    }

    if (answer === 'no') {
      return res.redirect(
        '/v7/representative/is-the-customer-with-you-now'
      )
    }

    if (answer === 'dont-know') {
      return res.redirect(
        '/v7/representative/can-you-confirm-your-full-name'
      )
    }

  })

  // =========================================
  // Is the customer with you now
  // =========================================

  router.post('/v7/representative/is-the-customer-with-you-now', function (req, res) {

  const answer = req.body.customerWithYou

  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection')
  }

  if (answer === 'yes') {
    return res.redirect(
      '/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for'
    )
  }

  if (answer === 'no') {
    return res.redirect(
      '/v7/representative/i-am-limited-with-what-i-can-help-you-with'
    )
  }

})

// =========================================
// I am going to check your name is on the customer's record
// =========================================

router.post('/v7/representative/check-your-name-is-on-the-customers-record', function (req, res) {

  const answer = req.body.representativeCheck

  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection')
  }

  if (answer === 'yes') {
    return res.redirect(
      '/v6-1/kbv-questions/another-benefit-you-have-previously-applied-for'
    )
  }

  return res.redirect(
    '/v7/representative/is-the-customer-with-you-now'
  )

})

// =========================================
// Type of appointee
// =========================================

router.post('/v7/representative/what-type-of-representative-are-you', function (req, res) {

  const answer = req.body.representativeType

  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection')
  }

  if (answer === 'appointee') {
    return res.redirect('/v7/representative/can-you-confirm-your-full-name')
  }

  if (answer === 'pab') {
    return res.redirect('/v7/representative/can-you-confirm-your-full-name')
  }

  if (answer === 'poa') {
    return res.redirect('/v7/representative/can-you-confirm-your-full-name')
  }

  if (answer === 'cab') {
    return res.redirect('/v7/representative/what-type-of-corporate-acting-body-are-you')
  }

  if (answer === 'dont-know') {
    return res.redirect('/v7/representative/can-you-confirm-your-full-name')
  }

})

// =========================================
// Type of CAB
// =========================================

router.post('/v7/representative/what-type-of-corporate-acting-body-are-you', function (req, res) {

  const answer = req.body.representativeType

  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection')
  }

  if (answer === 'cab-type-la') {
    return res.redirect('/v7/representative/full-name-and-the-authority-you-are-calling-from')
  }

  if (answer === 'cab-type-other') {
    return res.redirect('/v7/representative/cab-other')
  }

})

// =========================================
// On behalf of yourself or someone else
// =========================================

router.post('/v7/representative/behalf-of-yourself-or-someone-else', function (req, res) {

  const answer = req.body.calling

  if (!answer) {
    return res.redirect('/v6-1/errors/input-errors/missing-selection')
  }

  if (answer === 'myself') {
    return res.redirect('/v6-1/establish-identity/what-is-your-national-insurance-number')
  }

  if (answer === 'someone-else') {
    req.session.data.representativeJourney = true

    return res.redirect(
      '/v7/representative/what-is-their-national-insurance-number'
    )
  }

})


}
