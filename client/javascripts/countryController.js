app.controller('countryController', ['sharedService','countryPage','$scope','$http', function(sharedService,countryPage,$scope,$http){
    $scope.countryName = countryPage.name;
    $scope.abbreviation = countryPage.abbreviation;
    $scope.largestCityName = countryPage.largestCityName;
    $scope.largestCityPop = countryPage.largestCityPop;
    $scope.majorityLanguage = countryPage.majorityLanguage;
    $scope.medianAge = countryPage.medianAge;
    $scope.worldBankData = {};

    var getData = function(){
        $http.get('/externalAPIs/worldBankData/'+$scope.abbreviation)
            .then(function(response){
                $scope.worldBankData.column1 = response.data.slice(0,response.data.length/2);
                $scope.worldBankData.column2 = response.data.slice(response.data.length/2,response.data.length);

            },function errorCallback(response){
                $scope.data = "There was an error, try again later!";
            });
    };

    getData();

    var mediWikiCountryName = encodeURI($scope.countryName);

    var getFlag = function(){
        $http.get('/externalAPIs/mediWiki/'+ mediWikiCountryName)
            .then(function(response){
                $scope.flagUrl = response.data;

            },function errorCallback(response){
                $scope.data = "There was an error, try again later!";
            });
    };

    getFlag();

}]);
