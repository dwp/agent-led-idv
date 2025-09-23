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

router.post('/fraud-answer', function(request, response) {

	var fraud = request.session.data['fraud']
	if (fraud.includes("nifu")){
		response.redirect("/path1/nifu-stop")
	} else {
		response.redirect("/path1/verify-identity")
	}
})

router.post('/verify-answer', function(request, response) {

	var verify = request.session.data['verify']
	if (verify == "yes"){
		response.redirect("/path1/identity-verified")
	} else {
		response.redirect("/path1/identity-not-verified")
	}
})
