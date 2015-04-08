var timeSelectorController = function ($scope) {

	$scope.value = null;

	$scope.clear = function () {
		$scope.value = null;
	};	
	$scope.now = function () {
		$scope.value = new Date().toISOString();
	};	

	$scope.now();
};

timeSelectorController.$inject = ['$scope'];

angular.module('myApp').directive("timeSelector", [function () {

	var uniqueId = 1;

	return {
		//require: ['ngModel'],  //'datepicker'
		controller: timeSelectorController,
		restrict: 'E',
		replace: true,
		scope: {
			value: "=",
			id: "@",
			opts: "@",
			readonly : "=ngReadonly"
		},
		templateUrl: '/app/directives/timeSelector.html',

		link: function (scope, elem, attr, reqs) {

			if (scope.id == null) {
				scope.id = 'timePicker' + uniqueId++;
			}
	        elem.find('timepicker').attr('id' , scope.id);		
    
            //add options
            if (scope.opts) {        	
	            //scope.readonly = scope.opts.indexOf("readonly") > -1;
	            var required = scope.opts.indexOf("required") > -1;

	            //if (scope.readonly) {
				//	elem.find('timepicker').attr('readonly-input', 'true');
	            //}
	            //if (required) {
	            //}
            }
	    

	    }
	};
	
}]);