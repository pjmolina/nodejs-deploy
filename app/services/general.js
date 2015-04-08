function apply(app, models) {

	//General error handler -- log error
	app.use(function(err, req, res, next) {
		console.error(req.query);
		console.error(err.stack);
	});

	//CORS enabled for allowing 3rd party web-apps to consume Swagger metadata and backend. 
	//Disable it commenting this block if you don not need it. ----------
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");  //Change * to your host domain
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
	    next();
	});

	//config-----
	app.post('/api/setConfigKey', function(req, res){
		console.log("SetKey:");
	 	try {
			var item = {
			      'key': req.body.key,
			      'value': req.body.value
			    };
			var model = models.models._config.model;

			console.log("SetKey: " + item.key + '=' + item.value);

			//delete all entries with the same key.
			model.remove({ 'key': item.key }, function (err, doc) {
				if (err) {
					console.err(err);
				}				
			});

			//create setting
			var newDoc = new model({
			  'key': item.key,
			  'value': item.value
			});
			newDoc.save();

			res.status(200)
			   .set('Content-Type', 'text/json')
			   .send('{}');

		}
		catch (e) {
			res.status(501)
			   .set('Content-Type', 'text/json')
			   .send('{ "error" : "' + e.message + '"}');
		}
	});

	//Save webkhooks ---
	app.post('/api/saveHooks', function(req, res){
		try {
		    var hooks = req.body.items;
		    var whModel = models.models._webhooks.model;
		    console.log("Save hooks: " + hooks.length + " received.");

		    //delete all previous entries
		    whModel.remove({ }, function (err, doc) {
				if (err) {
					console.err(err);
				}
		    });

			//persist all hooks
			for(var i in hooks) {
				var item = hooks[i];

				console.log(JSON.stringify(item));

				var newDoc = new whModel({
					resource : item.resource,
					operation : item.operation,
					httpMethod : item.httpMethod,
					urlTemplate : item.urlTemplate,        
					parameters : buildParams(item.parameters)
				});
				newDoc.save();
			}

			res.status(200)
			   .set('Content-Type', 'text/json')
			   .send('{}');
	 	}
	  	catch (e) {
	    	res.status(501)
	       		.set('Content-Type', 'text/json')
	       		.send('{ "error" : ' + e + '}');
	  	}
	});

	function buildParams(params) {
		var result = [];
		if (params != null) {
			params.forEach(function(item) {
				result.push({
					type: item.type,
					key: item.key,
					value: item.value
				});
			});
		}
		return result;
	}

}
module.exports.apply = apply;