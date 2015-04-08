var dateSelectorController = function ($scope) {

	$scope.value = null;
	$scope.opened = false;

	$scope.dateOptions = {
   		formatYear: 'yyyy',
    	startingDay: 0
	};
	$scope.today = function() {
		$scope.value = new Date().toISOString();
	};
	$scope.clear = function () {
		$scope.value = null;
	};	

	$scope.disabledDates = function(date, mode) {
	    return false;
	};	
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		if ($scope.readonly) {
			return; //disable selector on readOnly
		}

		$scope.opened = true;
	};	
	  
	//$scope.today();
};

dateSelectorController.$inject = ['$scope'];

angular.module('myApp').directive("dateSelector", [function () {

	var uniqueId = 1;

	return {
		//require: ['ngModel'],  //'datepicker'
		controller: dateSelectorController,
		restrict: 'E',
		replace: true,
		scope: {
			value: "=",
			id: "@",
			placeholder: "@",
			opts: "@",
			readonly : "=ngReadonly"
		},
		templateUrl: '/app/directives/dateSelector.html',

		link: function (scope, elem, attr, reqs) {

			if (scope.id == null) {
				scope.id = 'calendarSelector' + uniqueId++;
			}
	        elem.find('input').attr('id' , scope.id);		
			elem.find('input').attr('placeholder' , scope.placeholder);

            //add options
            if (scope.opts) {        	
	            //scope.readonly = scope.opts.indexOf("readonly") > -1;
	            var required = scope.opts.indexOf("required") > -1;

	            //if (scope.readonly) {
					//elem.find('input').attr('readonly', '');

					//hide span or disable button
					//elem.find('span').attr('class', 'ng-hide');
	            //}
	            //if (required) {
				//	elem.find('input').attr('required', '');
	            //}
            }
	    

	    }
	};
	
}]);