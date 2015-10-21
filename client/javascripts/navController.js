app.controller('navCtrl', ['userRecommendations','authService','$scope','$rootScope','$location','$http', function(userRecommendations,authService, $scope,$rootScope, $location,$http){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    $scope.logout = function(){
        $http.get('/api/logout').
            then(function(response){
            });
        authService.logout();
        $rootScope.user = authService.getUser();
        userRecommendations = {};
        $location.path("/home");
    }
}]);
