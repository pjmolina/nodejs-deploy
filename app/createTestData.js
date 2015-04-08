//Create test data for backend services
var mongoose = require('mongoose');

var models = require('./model');

var dbName = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/DemoDb';
mongoose.connect(dbName);


// Clear the database of old data
mongoose.model('user').remove(function (error) {
  if (error) {
  	throw error;
  }
});

console.log('Data deleted on: ' + dbName);

// Put the fresh data in the database
//Data for User ---------------------------
console.log('  Creating data for  User.');

mongoose.model('user').create( {
		name: 'Name0',
		surname: 'Surname1'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name2',
		surname: 'Surname3'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name4',
		surname: 'Surname5'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name6',
		surname: 'Surname7'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);
mongoose.model('user').create( {
		name: 'Name8',
		surname: 'Surname9'
	}, function (error) { 
		if (error) {
			throw error;
		} 
	}
);

console.log('Fake Data created on: ' + dbName);
