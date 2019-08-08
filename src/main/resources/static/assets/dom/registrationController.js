var registrationController = angular.module('registrationController', []).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);


registrationController.controller('requestLogin', function ($scope, $http, $rootScope, 
		$location, $window) {
	 $scope.hello = function(){
		 debugger;
		alert("hai"); 
	 };
});