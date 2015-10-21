app.controller('questionnaireController',['countryPage','userRecommendations','questionnaire','$rootScope','$scope','$location', '$http',function(countryPage,userRecommendations,questionnaire,$rootScope,$scope,$location,$http){

    if(!$rootScope.user.username){
        $location.path('/');
    }

    var questions = questionnaire.questions;
    var questionResponses = {};
    var userQuestionnaire = {};

    $scope.questionNum = 0;
    $scope.data = {};
    $scope.data = {};
    $scope.answers = [];


    $scope.querySearch = function(query) {
        return query ? $scope.list.filter( createFilterFor(query) ) : $scope.list;
    };

    function loadAll() {

        return $scope.list.map( function (item) {
            return {
                value: item.toLowerCase(),
                display: item
            };
        });
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }

    $scope.pushAnswer = function(answer){
        if(answer){
            $scope.answers.push(answer);
            $scope.data.showAnswers = true;
            $scope.searchText = '';
        }
    };
    if($rootScope.user.username){
        $http.get('/api/questionnaire/'+$rootScope.user.username).
            then(function(userAnswers){
                if(typeof userAnswers.data == 'object'){
                    $http.post('/api/worldFactbook',{languageOption:true,language:userAnswers.data.question1}).
                        then(function(countriesToSearch){
                            $scope.recommendations = questionnaire.determineRecommendations(userAnswers.data,countriesToSearch.data);
                            userRecommendations.countries = $scope.recommendations;
                        });
                }else{
                    $scope.getQuestion();
                    $scope.list = loadAll();
                }
            });
    }


    $scope.getQuestion = function(){
        $scope.data.showAnswers = false;

        if($scope.questionNum==questions.length){
            $scope.question = 'Your list is being generated!';
            userQuestionnaire.username = $rootScope.user.username;
            userQuestionnaire.questionResponses = questionResponses;
            $http.post('/api/questionnaire',userQuestionnaire);
            $http.post('/api/worldFactbook',{languageOption:true,language:questionResponses.question1}).
                then(function(countriesToSearch){
                    $scope.recommendations = questionnaire.determineRecommendations(questionResponses,countriesToSearch.data);
                    userRecommendations.countries = $scope.recommendations;
                    $location.path('/');
                });
            $scope.type = '';
        }else{
            $scope.question = questions[$scope.questionNum].question;
            $scope.type = questions[$scope.questionNum].type;
            if($scope.type == 'list'){
                $scope.list = questions[$scope.questionNum].answerOptions;
            }

        }
    };
    $scope.logAnswer = function(answer){
        $scope.data.showAnswers = false;

        $scope.questionNum++;

        if(answer.constructor === Array){
            answer = answer.join(' ')
        }
        questionResponses["question"+($scope.questionNum)] = answer;

        $scope.answers = [];
        $scope.searchText = '';

    };

    $scope.addCountry = function(){
        $http.post('/api/userCountries',{username: $rootScope.user.username,userCountries: ['france','germany','spain']}).
            then(function(response){
                $scope.userCountries = response.userCountries;
            })
    };

    $scope.deleteQuestionnaire = function(){
        $http.delete('api/questionnaire/'+$rootScope.user.username)
            .then(function(response){
                userRecommendations = {};
                $scope.recommendations = false;
                $scope.questionNum = 0;
                $scope.getQuestion();
                $scope.list = loadAll();
            });
    }

}]);
