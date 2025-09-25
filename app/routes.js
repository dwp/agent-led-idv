//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
router.post('/establish-answer', function(request, response) {

	var matched = request.session.data['matched']
	if (matched == "yes"){
		response.redirect("/path1/fraud-check")
	} else {
		response.redirect("path1/identity-not-verified")
	}
})

router.post('/fraud-answer', function(request, response) {
    var fraud = request.session.data['fraud'];

    // If no selection is made
    if (!fraud || fraud.length === 0) {
        response.redirect('/path1/fraud-check-error');
    } else if (fraud.includes("nifu")) {
        response.redirect("/path1/nifu-stop");
    } else if (fraud.includes("dateofdeath")) {
        response.redirect("/path1/dateofdeath");
    } else if (fraud.includes("idatrisk")) {
        response.redirect("/path1/verify-identity");
    } else if (fraud.includes("cfems")) {
        response.redirect("/path1/cfems");
    } else if (fraud.includes("none")) {
        response.redirect("/path1/verify-identity-no-markers");
    } else {
        response.redirect('/path1/fraud-check-error');
    }
});

router.post('/verify-answer', function(request, response) {

	var verify = request.session.data['verify']
	if (verify == "yes"){
		response.redirect("/path1/identity-verified")
	} else {
		response.redirect("/path1/identity-not-verified")
	}
})
