app.controller('homeController', ['authService','countryPage','questionnaire','userRecommendations','$http','$rootScope','$scope','$location', function(authService,countryPage,questionnaire,userRecommendations,$http,$rootScope,$scope,$location){

    $rootScope.user = authService.getUser();
    if($rootScope.user && $rootScope.user.username){
        $http.get('/api/questionnaire/'+$rootScope.user.username).
            then(function(userAnswers){
                if(typeof userAnswers.data == 'object'){
                    $http.post('/api/worldFactbook',{languageOption:true,language:userAnswers.data.question1}).
                        then(function(countriesToSearch){
                            $scope.recommendations = questionnaire.determineRecommendations(userAnswers.data,countriesToSearch.data);
                            userRecommendations.countries = $scope.recommendations;
                        });
                }else {
                    $location.path('/questionnaire');
                }
            });


    } else{
        var introQuestions = [{question: "Have you been here before?", route:'login'},
            {question: "Would you like to sign up?", route: 'signUp'},
            {question: "Okay, you won't be able to do much..."}];
        $scope.question = introQuestions[0].question;
        var questionNum = 0;
        $scope.showButtons = true;
        $scope.getQuestion = function(answer) {
            var questionText = introQuestions[questionNum].question;
            var route = introQuestions[questionNum].route;
            if (answer) {
                $location.path(route);
            } else{
                questionNum++;
                $scope.question = introQuestions[questionNum].question;
                if(questionNum == introQuestions.length-1){
                    $scope.showButtons = false;
                }
            }
        };
    }

    $scope.setCountryPage = function(country){

        countryPage.name = country.countryName;
        countryPage.abbreviation = country.abbreviation;
        countryPage.largestCityName = country.largestCityName ? country.largestCityName : "No Information";
        countryPage.largestCityPop = country.largestCityPop ? country.largestCityPop : "No Information";
        countryPage.majorityLanguage = country.majorityLanguage;
        countryPage.medianAge = country.medianAge;
        //countryPage = country;

        $location.path('/country');


    };

}]);
