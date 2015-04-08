angular.module('myApp').controller('AdminWebHooksController', ['$scope', '$location', 'WebHooksService', 'ConfigService', function ($scope, $location, WebHooksService, ConfigService) {

	var EditorStatus = {
		addNew: 1,
		edit: 2
	};

	function init(){

		$scope.resources = WebHooksService.resources;
		$scope.operations= WebHooksService.operations;
		$scope.httpMethods= WebHooksService.httpMethods;
		$scope.paramTypes = WebHooksService.httpParameterTypes;

		$scope.enableWebhooks = false;
		$scope.webhooks = [];
		$scope.newWebhook = {
			id: null,
			cid: null,
			resource: null,
			operation: null,
			httpMethod: null,
			urlTemplate: null,
			parameters: []
		};
		$scope.hooksEditorStatus = EditorStatus.addNew;


		ConfigService.getByKey('webhooks.enable').then(function(response) {
			var res = response.data;
			if (res.length === 0) {
				$scope.enableWebhooks = false;
			}
			else {
				$scope.enableWebhooks = (res[0].value === 'true');
			}
		});

		WebHooksService.getList({}).then(function(response) {
			$scope.webhooks = response.data;
			for(var i in $scope.webhooks) {
				var hook = $scope.webhooks[i];
				hook.cid = i;
			}
		});

		$scope.isDirty = false;
	}


	$scope.enableWh = function(state) {
		$scope.enableWebhooks = state;
		$scope.isDirty = true;
	};

	$scope.canAddHook = function() {
		if ($scope.hooksEditorStatus != EditorStatus.addNew) {
			return false;
		}
		return hookIsValid($scope.newWebhook);
	};
	$scope.canEditHook = function() {
		if ($scope.hooksEditorStatus != EditorStatus.edit) {
			return false;
		}
		return hookIsValid($scope.newWebhook);
	};

	function hookIsValid(hook) {
		return (hook != null && 
				hook.resource != null && 
				hook.operation != null && 
				hook.httpMethod != null && 
				hook.resource.key != null && 
				hook.operation.key != null && 
				hook.httpMethod.key != null && 
				hook.urlTemplate != null 
			);
	}

	$scope.addHook = function () {
		var nh = {
			cid: new Date(),
			resource: $scope.newWebhook.resource.key,
			operation: $scope.newWebhook.operation.key,
			httpMethod: $scope.newWebhook.httpMethod.key,
			urlTemplate: $scope.newWebhook.urlTemplate,
			parameters: $scope.newWebhook.parameters
		};
		$scope.webhooks.push(nh);

		clearEditor();
		$scope.isDirty = true;
	};
	$scope.editHook = function () {
		var nh = {
			cid: $scope.newWebhook.cid,
			_id: $scope.newWebhook._id,
			resource: $scope.newWebhook.resource.key,
			operation: $scope.newWebhook.operation.key,
			httpMethod: $scope.newWebhook.httpMethod.key,
			urlTemplate: $scope.newWebhook.urlTemplate,
			parameters: $scope.newWebhook.parameters
		};

		var index = locateIndexByAttr($scope.webhooks, 'cid', nh.cid);
		if (index != -1) {
			//replace
			$scope.webhooks.splice(index, 1, nh);
		}
		//removeByAttr($scope.webhooks, 'cid', nh.cid);
		//$scope.webhooks.push(nh);

		clearEditor();
		$scope.isDirty = true;
	};

	$scope.cancelEditHook = function () {
		clearEditor();
	};

	$scope.startEditHook = function(wh){
		var newh = {
			cid: wh.cid,
			_id: wh._id,
			resource: selectItemByKey(WebHooksService.resources, wh.resource),
			operation: selectItemByKey(WebHooksService.operations, wh.operation),
			httpMethod: selectItemByKey(WebHooksService.httpMethods, wh.httpMethod),
			urlTemplate: wh.urlTemplate,
			parameters: wh.parameters
		};
		$scope.newWebhook = newh;
		$scope.hooksEditorStatus = EditorStatus.edit;
	};

	function selectItemByKey(collection, key) {
		for(var i in collection) {
			var item = collection[i];
			if (item.key === key) {
				return item;
			}
		}
		return null;
	}

	function clearEditor() {
		$scope.newWebhook.resource = null;
		$scope.newWebhook.operation = null;
		$scope.newWebhook.httpMethod = null;
		$scope.newWebhook.urlTemplate = null;
		$scope.newWebhook.parameters = [];

		$scope.hooksEditorStatus = EditorStatus.addNew;
	}

	$scope.deleteHook = function(wh, $event) {
		removeByAttr($scope.webhooks, 'cid', wh.cid);
		$scope.isDirty = true;
	};

	locateIndexByAttr = function(arr, attr, value) {
	    var i = 0;
	    while(i < arr.length) {
	    	var item = arr[i];
	    	if (item[attr] === value) {
	    		return i;
	    	}
	    	i++;
	    }
	    return -1;
	};

	removeByAttr = function(arr, attr, value){
	    var i = arr.length;
	    while(i--){
	       if( arr[i] &&
	           arr[i].hasOwnProperty(attr) &&
	           (arguments.length > 2 && arr[i][attr] === value ) ) { 

	           arr.splice(i, 1);
	       }
	    }
	    return arr;
	};

	$scope.gotoHome = function() {
		$location.path('/');
	};
	$scope.cancel = function() {
		init();
	};
	$scope.save = function() {
		ConfigService.setKey('webhooks.enable', $scope.enableWebhooks).then( function() {
			WebHooksService.saveHooks($scope.webhooks).then(function() {
				$scope.isDirty = false;
			});
		});
	};

	$scope.addParameter = function () {
		var param = {
			type : 'header',
			key : '',
			value: null
		};
		if ($scope.newWebhook) {
			$scope.newWebhook.parameters.push(param);
		}
	};
	$scope.removeParameter = function (param) {
		if (!$scope.newWebhook) {
			return;
		}
		for(var i=0; i < $scope.newWebhook.parameters.length; i++) {
			if ($scope.newWebhook.parameters[i] === param) {
				$scope.newWebhook.parameters.splice(i, 1);
				return;
			}
		}
	};	

	init();
}]);
