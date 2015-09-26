var app = angular.module('NextPat', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $routeProvider.when('/',
        {
            templateUrl: '/views/home.html',
            controller: 'mainController'
        }).when('/about',
        {
            templateUrl: '/views/about.html',
            controller: 'aboutController'
        }).when('/contact',
        {
            templateUrl: '/views/contact.html',
            controller: 'contactController'
        }).when('/login',
        {
            templateUrl: '/views/login.html',
            controller: 'loginController'
        }).when('/signUp',
        {
            templateUrl: '/views/signUp.html',
            controller: 'loginController'
        }).when('/questionnaire',
        {
            templateUrl: '/views/questionnaire.html',
            controller: 'questionnaireController'
        }).when('/help',
        {
            templateUrl: '/views/help.html',
            controller: 'helpController'
        }).when('/country',
        {
            templateUrl: '/views/country.html',
            controller: 'countryController'
        }).otherwise({
        redirectTo: '/'
    });
}]);

app.controller('mainController', ['$scope','$location', function($scope,$location){

    var introQuestions = [{question: "Have you been here before?", route:'login'},
        {question: "Would you like to sign up?", route: 'signUp'},
        {question: "Okay, your information will not be saved."}];
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
}]);

app.controller('aboutController', ['$scope',function($scope){
    $scope.message = "I'm a page that describes this application!";
}]);

app.controller('contactController',['$scope', function($scope){
    $scope.message = "I'm a page that tells you how to yell (by writing an all-caps email) at the developer!";
}]);

app.controller('signUpController',['$scope','$http', function($scope,$http){
}]);

app.controller('countryController', ['countryPage','$scope','$http', function(countryPage,$scope,$http){
    $scope.countryName = countryPage.name;
    console.log($scope.nationMasterLink);
}]);

app.controller('loginController', ['$scope', '$http', 'authService', '$location', '$rootScope', function($scope, $http, authService, $location, $rootScope){
    $scope.submit = function(){
        $http.post('api/login', $scope.form)
            .then(function (response) {
                authService.saveToken(response.data);
                $rootScope.user = authService.getUser();
                $location.path("/questionnaire");
            });
    };
}]);

app.controller('navCtrl', ['authService','$scope','$rootScope','$location','$http', function(authService, $scope,$rootScope, $location,$http){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/questionnaire');
    }

    $scope.logout = function(){
        $http.get('/api/questionnaire/'+$rootScope.user.username);
        $http.get('/api/logout').
            then(function(response){
                console.log(response);
            });
        authService.logout();
        $rootScope.user = authService.getUser();
        $location.path("/login");
    }
}]);

app.controller('helpController',['$scope', function($scope){
    $scope.message = "I'm a help page that currently doesn't help at all";
}]);

app.controller('questionnaireController',['countryPage','questionnaire','$rootScope','$scope','$location', '$http', function(countryPage,questionnaire,$rootScope,$scope,$location,$http){



    var questions = questionnaire.questions;
    var questionResponses = {};
    var userQuestionnaire = {};
    var recommendations;
    var questionNum = 0;
    $scope.data = {
        answer: ''
        };

    $http.get('/api/questionnaire/'+$rootScope.user.username).
        then(function(userAnswers){
            if(typeof userAnswers.data == 'object'){
                $http.post('/api/worldFactbook',{languageOption:true,language:userAnswers.data.question1}).
                    then(function(countriesToSearch){
                        $scope.recommendations = questionnaire.determineRecommendations(userAnswers.data,countriesToSearch.data);
                });
            }else{
                $scope.getQuestion();
            }
        });

    //$scope.type = questions[0].type;
    //console.log(questions[0].answerOptions);
    //$scope.question = questions[0].question;
    //$scope.list = questions[0].answerOptions;
    $scope.getQuestion = function(){

        if(questionNum==questions.length){
            questionNum++;
            questionResponses["question"+(questionNum-1)] = $scope.data.answer;
            $scope.question = 'Your list is being generated!';
            userQuestionnaire.username = $rootScope.user.username;
            userQuestionnaire.questionResponses = questionResponses;
            $http.post('/api/questionnaire',userQuestionnaire);
            $http.post('/api/worldFactbook',{languageOption:true,language:questionResponses.question1}).
                then(function(countriesToSearch){
                    $scope.recommendations = questionnaire.determineRecommendations(questionResponses,countriesToSearch.data);
                });
            $scope.type = '';
        }else{
            $scope.question = questions[questionNum].question;
            $scope.type = questions[questionNum].type;

            if($scope.type == 'list'){
                $scope.list = questions[questionNum].answerOptions;
            }
            questionNum++;
        }
    };
    $scope.logAnswer = function(){
        questionResponses["question"+(questionNum-1)] = $scope.data.answer;
    };

    $scope.addCountry = function(){

        //console.log($rootScope.username);
        //$http.post('/api/userCountries',{username: $rootScope.user.username}).
        //    then(function(response){
        //        $scope.userCountries = response.userCountries;
        //    });
        $http.post('/api/userCountries',{username: $rootScope.user.username,userCountries: ['france','germany','spain']}).
            then(function(response){
                $scope.userCountries = response.userCountries;
            })
    }

    $scope.setCountryPage = function(countryName){
        countryPage.name = countryName;
    }

}]);

app.service('authService', ['$window', function ($window) {
    this.parseJwt = function (token) {
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        } else return {};
    };

    this.saveToken = function (token) {
        $window.localStorage.jwtToken = token;
        console.log('Saved token:',$window.localStorage.jwtToken);
    };

    this.getToken = function () {
        return $window.localStorage.jwtToken;
    };

    this.isAuthed = function () {
        var token = this.getToken();
        if (token) {
            var params = this.parseJwt(token);
            var notExpired = Math.round(new Date().getTime() / 1000) <= params.exp;
            if (!notExpired) {
                this.logout();
            }
            return notExpired;
        } else {
            return false;
        }
    };

    this.logout = function () {
        delete $window.localStorage.jwtToken;
    };

    // expose user as an object
    this.getUser = function () {
        return this.parseJwt(this.getToken())
    };
}]);

app.factory('authInterceptor', ['$q', '$location', 'authService', function ($q, $location, authService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (authService.isAuthed()) {
                config.headers.Authorization = 'Bearer ' + authService.getToken();
            }
            return config;
        },
        response: function (response) {

            if (response.status === 401) {

                // handle the case where the user is not authenticated
                $location.path("/login");
            }
            return response || $q.when(response);
        }, responseError: function (response) {
            if (response.status === 401) {
                $location.path("/login");

            } else {
                console.log(response);
            }
            return $q.reject(response);
        }
    };
}]);

app.factory('questionnaire', function () {
    return {
        questions: [
            {
                question: "What language(s) do you speak?", type: 'list',
                answerOptions: ['Adyghe', 'Albanian', 'Aragonese', 'Armenian', 'Aromanian', 'Arpitan', 'Asturian', 'Avar', 'Azerbaijani', 'Bashkir', 'Basque', 'Belarusian', 'Bosnian', 'Breton', 'Bulgarian', 'Catalan', 'Chechen', 'Chuvash', 'Cornish', 'Corsican', 'Crimean', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Erzya', 'Estonian', 'Faroese', 'Finnish', 'French', 'Frisian', 'Gagauz', 'Galician', 'Gallo', 'Georgian', 'German', 'Greek', 'Hungarian', 'Icelandic', 'Ingrian', 'Irish', 'Italian', 'Kabardian', 'Kashubian', 'Kazakh', 'Ladin', 'Latin', 'Latvian', 'Laz', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Maltese', 'Manx', 'Mari', 'Mingrelian', 'Mirandese', 'Montenegrin', 'Norwegian', 'Occitan', 'Ossetian', 'Picard', 'Polish', 'Portuguese', 'Romani', 'Romanian', 'Romansh', 'Russian', 'Sami', 'Sardinian', 'Scots', 'Scottish','Gaelic', 'Serbian', 'Silesian', 'Slovak', 'Slovene', 'Sorbian', 'Spanish', 'Svan', 'Swedish', 'Tabasaran', 'Tatar', 'Turkish', 'Ukrainian', 'Vepsian', 'Võro', 'Walloon', 'Welsh', 'Wymysorys']
            },
            {
                question: 'What field do you work in?',
                type: 'list',
                answerOptions: ['Agriculture', 'Industry', 'Services']
            },
            {
                question: 'What climate(s) would you prefer?',
                type: 'list',
                answerOptions: ['Temperate', 'Mediterranean', 'Tropical', 'Arid', 'Desert', 'Maritime', 'Wet']
            },
            {
                question: 'What is the ideal size for the largest metropolitan area?',
                type: 'list',
                answerOptions: ['Small (<100,000)', 'Medium (100,000-1 million)', 'Large (>1 million)']
            },
            {
                question: 'Would you like the population distribution to be mostly urban?',
                type: 'boolean'
            },
            {
                question: 'What would your ideal median age range be?', type: 'list',
                answerOptions: ['20-30yrs', '30-40yrs', '40+years']
            },
            {
                question: 'What cost of living should your destination have?', type:'list',
                answerOptions: ['High','Average','Low']
            },
            {
                question: 'What percentage of the population should be internet users?', type:'list',
                answerOptions: ['<25%','25%-50%','50%-75%','>75%']
            }
        ],
        determineRecommendations: function(questionnaireAnswers,countriesToSearch){

            countries = [];

            function getProportionalScore(lowerLimit,upperLimit,value){

                console.log('value',value);
                console.log(upperLimit,lowerLimit);
                if (value >= lowerLimit && value <= upperLimit){
                    return 10;
                }else{
                    var limit = Math.abs(value-lowerLimit) > Math.abs(value-upperLimit) ? upperLimit : lowerLimit;
                    var multiplier = value > limit ? 0.5 : 1.5;
                    var score = 20*(1 - Math.min(1,Math.abs(value - multiplier*limit)/limit));
                    console.log(score);
                    return score;
                }
            }

            countriesToSearch.forEach(function(country,index) {
                var score = 0, upperLimit, lowerLimit, climateString;
                var laborPercent = country.labor[questionnaireAnswers.question2] || 0;
                //if user's specified industry is more than 75% of the country's workforce, set score to 10
                var laborScore = laborPercent/7.5 > 10 ? 10 : laborPercent/10;
                //create Regular Expression to check climate string for climate answers
                if (typeof questionnaireAnswers.question3 == 'array') {
                    climateString = new RegExp(questionnaireAnswers.question3.join('|'),'i');
                }else{
                    climateString = new RegExp(questionnaireAnswers.question3,'i');
                }
                //if climate string contains one of the climate answers, set score to 10
                var climateScore = country.climate.match(climateString) != null ? 10: 0;


                //if (country.perCapitaPPP > lowerLimit && country.perCapitaPPP < upperLimit){
                //    perCapitaPPPScore = 10;
                //}else{
                //    var lowPerCapitaPPPScore = 1 - Math.abs(country.perCapitaPPP - lowerLimit)/lowerLimit;
                //    var highPerCapitaPPPScore = 1 - Math.abs(country.perCapitaPPP - lowerLimit)/upperLimit;
                //    perCapitaPPPScore = 10*(Math.min(lowLargestCityPopScore,highLargestCityPopScore));
                //}

                var userLargestCityPop = questionnaireAnswers.question4;
                console.log(userLargestCityPop);
                switch(userLargestCityPop){
                    case 'Small (<100,000)':
                        lowerLimit = 0;
                        upperLimit = 1E5;
                        break;
                    case 'Medium (100,000-1 million)':
                        lowerLimit = 1E5;
                        upperLimit = 1E6;
                        break;
                    case 'Large (>1 million)':
                        lowerLimit = 1E6;
                        upperLimit = 1E20;
                        break;
                    default:
                        break;
                }
                console.log(country.countryName);
                var largestCityPopScore = getProportionalScore(lowerLimit,upperLimit,country.largestCityPop) || 0;

                //if (country.largestCityPop > lowerLimit && country.largestCityPop < upperLimit){
                //    largestCityPopScore = 10;
                //}else{
                //    var lowLargestCityPopScore = 1 - Math.abs(country.largestCityPop - lowerLimit)/lowerLimit;
                //    var highLargestCityPopScore = 1 - Math.abs(country.largestCityPop-upperLimit)/upperLimit;
                //
                //    largestCityPopScore = 10*(Math.min(lowLargestCityPopScore,highLargestCityPopScore));
                //}
                var userUrbanPopulation = questionnaireAnswers.question5;
                var urbanPopulationScore;
                if(userUrbanPopulation){
                    urbanPopulationScore = country.urbanPopulation > 50 ? 10 : 10*country.urbanPopulation/50;
                }else{
                    urbanPopulationScore = country.urbanPopulation < 50 ? 10 : 10*50/country.urbanPopulation;
                }

                var userMedianAge = questionnaireAnswers.question6;
                switch(userMedianAge){
                    case '20-30yrs':
                        lowerLimit = 0;
                        upperLimit = 30;
                        break;
                    case '30-40yrs':
                        lowerLimit = 30;
                        upperLimit = 40;
                        break;
                    case '40+years':
                        lowerLimit = 40;
                        upperLimit = 150;
                        break;
                    default:
                        break;
                }

                var medianAgeScore = getProportionalScore(lowerLimit,upperLimit,country.medianAge);

                var userPerCapitaPPP = questionnaireAnswers.question7;
                switch(userPerCapitaPPP){
                    case 'High':
                        lowerLimit = 60000;
                        upperLimit = 1E10;
                        break;
                    case 'Average':
                        lowerLimit = 30000;
                        upperLimit = 60000;
                        break;
                    case 'Low':
                        lowerLimit = 0;
                        upperLimit = 30000;
                        break;
                    default:
                        break;
                }
                var perCapitaPPPScore = getProportionalScore(lowerLimit,upperLimit,country.perCapitaPPP);

                var userInternetUsagePerCapita = questionnaireAnswers.question8;
                switch(userInternetUsagePerCapita){
                    case '<25%':
                        lowerLimit = 0;
                        upperLimit = 25;
                        break;
                    case '25%-50%':
                        lowerLimit = 25;
                        upperLimit = 50;
                        break;
                    case '50%-75%':
                        lowerLimit = 50;
                        upperLimit = 75;
                        break;
                    default:
                        lowerLimit = 75;
                        upperLimit = 100;
                        break;
                }

                var internetUsageScore = getProportionalScore(lowerLimit,upperLimit,country.internetUsagePerCapita);
                console.log('laborScore',laborScore,'climateScore',climateScore,'largestCityPopScore',largestCityPopScore,'urbanPopulationScore',urbanPopulationScore,'perCapitaPPPScore',perCapitaPPPScore,'medianAgeScore',medianAgeScore,'internetUsageScore',internetUsageScore);
                score = score + laborScore + climateScore + largestCityPopScore + urbanPopulationScore + perCapitaPPPScore + medianAgeScore + internetUsageScore;
                country.score = score;
                countries.push(country);
            });

            countries.sort(function (a, b) {
                    if (a.score > b.score) {
                        return -1;
                    }
                    if (a.score < b.score) {
                        return 1;
                    }
                    if(a.countryName > b.countryName){
                        return 1;
                    }
                    if(a.countryName < b.countryName){
                        return -1;
                    }
                    return 0;
                });

                return countries.slice(0,4);
        }
    };
});

app.factory('countryPage',function(){
    return {};
})