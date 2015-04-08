angular.module('myApp').service('UserService', ['$http', '$q', 'baseApi', 'QueryBuilderService', function ($http, $q, baseApi, QueryBuilderService) {

	var UserService = {};

	var resourceUrl = baseApi + '/users';
	var fields = null;

	function buildFields() {
		if (!fields) {
			fields = [
			{name: 'name', type: 'string'},
			{name: 'surname', type: 'string'}
				
			];
		}
		return fields;
	}

	//-- Public API -----

	UserService.getCount =  function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.count = true;		
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	};
	
	UserService.getList = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return $http.get(resourceUrl + q);
	};

	function exportQuery(opts) {
		opts = opts || {};
		opts.paginate = false;
		opts.fields = opts.fields || buildFields();
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return q;	
	}

	UserService.getListAsCsv = function (opts) {
		var q = exportQuery(opts);
		return $http({
			method: 'GET', 
			url: resourceUrl + q, 
			headers: {'Accept': 'text/csv'} 
		});
	};	

	UserService.getFileAsCsv = function (opts) {
		var q = exportQuery(opts);
		return $http({
			method: 'GET', 
			url: resourceUrl + q, 
			headers: {'Accept': 'text/csv'} 
		});
	};	
	UserService.getFileAsXml = function (opts) {
		var q = exportQuery(opts);
		return $http({
			method: 'GET', 
			url: resourceUrl + q, 
			headers: {'Accept': 'text/xml'} 
		});
	};		
	UserService.getFileAsXlsx = function (opts) {
		var q = exportQuery(opts);
		return $http({
			method: 'GET', 
			url: resourceUrl + q, 
			headers: {'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
			responseType: 'blob' 
		});
	};		
	
	UserService.get = function (link) {
		return $http.get(link);
	};
	
	UserService.getDocument = function (id) {
		return UserService.get(resourceUrl + '/' + id );
	};

	UserService.add = function (item) {
		return $http.post(resourceUrl, JSON.stringify(item));
	};

	UserService.update = function (item) {
		return $http.put(resourceUrl + '/' + item._id, JSON.stringify(item));
	};

	UserService.delete = function (id) {
		return $http.delete(resourceUrl + '/' + id);
	};

	UserService.deleteMany = function (ids) {
		var msg = { 
			'ids'		: ids
		};	
		return $http.post(resourceUrl + '/deleteByIds', JSON.stringify(msg));
	};	

	UserService.deleteByQuery = function (opts) {
		opts = opts || {};
		opts.fields = opts.fields || buildFields();
		opts.paginate = false;		
		var q = QueryBuilderService.buildBaucisQuery(opts);
		return $http.delete(resourceUrl + q);
	};
	
	return UserService;

}]);
