app.controller('signUpController',['$mdToast','$location','$scope','$http', function($mdToast,$location,$scope,$http){

    $scope.register = function(){

        var newUser = {
            username: $scope.form.userName,
            email: $scope.form.email,
            password: $scope.form.password,
            lastName: $scope.form.lastName,
            firstName: $scope.form.firstName,
            passwordConfirm: $scope.form.passwordConfirm
        };
        $http.post('/api/register',newUser)
            .then(function(response){
                $location.path('/login');
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
