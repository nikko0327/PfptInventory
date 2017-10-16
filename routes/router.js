var express = require("express");
var router = express.Router();
var User = require("../models/user");

// GET route for getting and reading data
router.get("/", function(req, res, next){
	//confirm that user typed same password 2 times.
	if(req.body.password !== req.body.passwordConf){
		var err = new Error("Password don't match!");
		err.status = 400;
		res.send("Password do not match!");
		return next(err);
	}

	if(req.body.email &&
		req.body.username &&
		req.body.password &&
		re.body.passwordConf){

		var userData = {
			email: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		User.create(userData, function(error, user){
			if(error){
				return next(error);
			}else{
				req.session.userId = user._id;
				return res.redirect("/index");
			}
		});
	} else if(req.body.logemail && req.body.logpassword){
		User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){
			if(error || !user){
				var err = new Error("Wrong email or password.");
				err.status = 401;
				return next(err);
			}else{
				req.session.userId = user._id;
				return res.redirect("/index");
			}
		});
	} else{
		var err = new Error("All fields required!");
		err.status = 400;
		return next(err);
	}
})

//GET route after registering as a new user
router.get("/index", function(req, res, next){
	User.findById(req.session.userId)
	.exec(function(error, user){
		if(error){
			return next(error);
		} else{
			if(user === null){
				var err = new Error("Not an authorized user.");
				err.status = 400;
				return next(err);
			} else{
				//CHANGE TO res.render
				return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>');
			}
		}
	});
});

//GET for logging out
router.get("/logout", function(req, res, next){
	if(req.session){
		//delete session object
		req.session.destroy(function(err){
			if(err){
				return next(err);
			} else{
				return res.redirect("/");
			}
		});
	}
});

module.exports =router;