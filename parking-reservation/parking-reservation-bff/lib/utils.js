const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// ============================================================
// -------------------  VERIFY --------------------------------
// ============================================================

// Verify the token we just signed using the public key.  Also validates our algorithm RS256
const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader.split(" ")[1];

	jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, payload) => {
		if (err !== null && err.name === "TokenExpiredError") {
	    	console.log("Whoops, your token has expired!");
	    	return res.status(401).json({ message: "Whoops, your token has expired!" });
	  	}

		if (err !== null && err.name === "JsonWebTokenError") {
		    console.log("That JWT is malformed!");
		    return res.status(401).json({ message: "That JWT is malformed!" });
		}

		if (err === null) {
		   console.log("Your JWT was successfully validated!");
		}

		// Both should be the same
		console.log(payload);
		next();
		// console.log(payloadObj);
	});	
}

module.exports = {
	verifyToken,
}
