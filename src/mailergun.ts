var api_key = "332166e476addb444a35f478140f40e7-c322068c-f9181624";
var domain = "sandbox327fe652e27249ed9d518cd69654312a.mailgun.org";
// var domain = process.env.DOMAIN_NAME;
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

export function sendMail() {
	var data = {
		from: "Excited User <me@samples.mailgun.org>",
		to: "jay.topher11@gmail.com",
		subject: "Hello",
		text: "Testing some Mailgun awesomeness!"
	};

	mailgun.messages().send(data, function(error: any, body: any) {
		if (error) throw error;
		console.log(body);
		return body;
	});
}
