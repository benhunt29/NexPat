app.controller('loginController', ['$mdToast','$scope', '$http', 'authService', '$location', '$rootScope', function($mdToast,$scope, $http, authService, $location, $rootScope){
    $scope.signIn = function(){
        var user = {
            username: $scope.form.userName,
            password: $scope.form.password
        };

        $http.post('api/login', user)
            .then(function (response) {
                authService.saveToken(response.data);
                $rootScope.user = authService.getUser();
                $location.path("/");
            }, function errorCallback(response) {
                $scope.errorToast(response.data.error);
            });
    };

    $scope.errorToast = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .hideDelay(3000)
        );
    };

}]);
