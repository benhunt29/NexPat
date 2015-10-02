var app = angular.module('NextPat', ['ngRoute','ngMaterial','ngMessages','validation.match']);

app.config(['$httpProvider','$routeProvider','$locationProvider','$mdThemingProvider', function($httpProvider,$routeProvider, $locationProvider,$mdThemingProvider){

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push('authInterceptor');

    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('grey')
        .warnPalette('red')
        .backgroundPalette('blue-grey');

    $routeProvider.when('/',
        {
            templateUrl: '/views/home.html',
            controller: 'homeController'
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
            controller: 'signUpController'
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

app.controller('homeController', ['authService','countryPage','questionnaire','userRecommendations','$http','$rootScope','$scope','$location', function(authService,countryPage,questionnaire,userRecommendations,$http,$rootScope,$scope,$location){

    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        if(!$scope.recommendations){
            if (userRecommendations.countries){
                $scope.recommendations = userRecommendations.countries;
            } else {
                $http.get('/api/questionnaire/'+$rootScope.user.username).
                    then(function(userAnswers){
                        console.log($rootScope.user.username);
                        if(typeof userAnswers.data == 'object'){
                            $http.post('/api/worldFactbook',{languageOption:true,language:userAnswers.data.question1}).
                                then(function(countriesToSearch){
                                    console.log(userAnswers,countriesToSearch);
                                    $scope.recommendations = questionnaire.determineRecommendations(userAnswers.data,countriesToSearch.data);
                                    userRecommendations.countries = $scope.recommendations;
                                });
                        }else {
                            $location.path('/questionnaire');
                        }
                    });
            }
        }
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

    $scope.setCountryPage = function(countryName,abbreviation){

        countryPage.name = countryName;
        countryPage.abbreviation = abbreviation;
        $location.path('/country');
    };

}]);

app.controller('aboutController', ['$scope',function($scope){
}]);

app.controller('contactController',['$scope', function($scope){
    $scope.message = "I'm a page that tells you how to yell (by writing an all-caps email) at the developer!";
}]);

app.controller('signUpController',['$location','$scope','$http', function($location,$scope,$http){
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
                console.log(response);
                $location.path('/login');
            });
    }

}]);

app.controller('countryController', ['sharedService','countryPage','$scope','$http', function(sharedService,countryPage,$scope,$http){
    $scope.countryName = countryPage.name;
    $scope.abbreviation = countryPage.abbreviation;
    $scope.worldBankData = {
        column1: {
            indicator: "ARE YOU ",
            year: "READY FOR ",
            value: "SOME DATA?!"
        }
    };

    var getData = function(){
        $http.get('/externalAPIs/worldBankData/'+$scope.abbreviation)
            .then(function(response){
                console.log(response.data.length);
                $scope.worldBankData.column1 = response.data.slice(0,response.data.length/2);
                $scope.worldBankData.column2 = response.data.slice(response.data.length/2,response.data.length);

                //sharedService.worldBankDataUpdate();
                console.log(response.data);

            },function errorCallback(response){
                $scope.data = "There was an error, try again later!";
                console.log(response);
                //$scope.$apply();
            });
    };

    //$scope.$on('update',function(){
    //    getData();
    //});

    getData();

    var mediWikiCountryName = $scope.countryName.replace(/\s/g,'_');

    var getFlag = function(){
        $http.get('/externalAPIs/mediWiki/'+ mediWikiCountryName)
            .then(function(response){
                $scope.flagUrl = response.data;
                //sharedService.worldBankDataUpdate();
                console.log($scope.flagUrl);

            },function errorCallback(response){
                $scope.data = "There was an error, try again later!";
                console.log(response);
                //$scope.$apply();
            });
    };

    getFlag();

}]);

app.controller('loginController', ['$scope', '$http', 'authService', '$location', '$rootScope', function($scope, $http, authService, $location, $rootScope){
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
            });
    };

}]);

app.controller('navCtrl', ['authService','$scope','$rootScope','$location','$http', function(authService, $scope,$rootScope, $location,$http){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    $scope.logout = function(){
        $http.get('/api/questionnaire/'+$rootScope.user.username);
        $http.get('/api/logout').
            then(function(response){
                console.log(response);
            });
        authService.logout();
        $rootScope.user = authService.getUser();
        $location.path("/home");
    }
}]);

app.controller('helpController',['$scope', function($scope){
    $scope.message = "I'm a help page that currently doesn't help at all";
}]);

app.controller('questionnaireController',['countryPage','userRecommendations','questionnaire','$rootScope','$scope','$location', '$http','$log','$q',function(countryPage,userRecommendations,questionnaire,$rootScope,$scope,$location,$http,$log,$q){

    if(!$rootScope.user.username){
        $location.path('/login');
    }

    var questions = questionnaire.questions;
    var questionResponses = {};
    var userQuestionnaire = {};

    $scope.questionNum = 0;
    $scope.data = {};
    $scope.data = {};
    $scope.answers = [];


    $scope.querySearch = function(query) {
        //console.log(query);
        //console.log($scope.list);
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

    $http.get('/api/questionnaire/'+$rootScope.user.username).
        then(function(userAnswers){
            console.log($rootScope.user.username);
            if(typeof userAnswers.data == 'object'){
                $http.post('/api/worldFactbook',{languageOption:true,language:userAnswers.data.question1}).
                    then(function(countriesToSearch){
                        console.log(userAnswers,countriesToSearch);
                        $scope.recommendations = questionnaire.determineRecommendations(userAnswers.data,countriesToSearch.data);
                        userRecommendations.countries = $scope.recommendations;
                });
            }else{
                $scope.getQuestion();
                $scope.list = loadAll();
            }
        });

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
            console.log($scope.question, $scope.type);
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

    $scope.setCountryPage = function(countryName){
        countryPage.name = countryName;
    };

    $scope.deleteQuestionnaire = function(){
        $http.delete('api/questionnaire/'+$rootScope.user.username)
            .then(function(response){
                console.log('deleted!');
                userRecommendations = {};
                $scope.recommendations = false;
                $scope.questionNum = 0;
                $scope.getQuestion();
                $scope.list = loadAll();
        });
    }

}]);

app.service('authService', ['$window', function ($window) {
    this.parseJwt = function (token) {
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        } else {
            return {};
        }
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
            console.log(config.url);
            if (authService.isAuthed()) {
                config.headers.Authorization = 'Bearer ' + authService.getToken();
            }
            return config;
        },
        response: function (response) {
            if($location.search().access_token){
                authService.saveToken($location.search().access_token);
                $location.search('access_token', undefined);
                $location.path("/");
            }

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

                if (value >= lowerLimit && value <= upperLimit){
                    return 10;
                }else{
                    var limit = Math.abs(value-lowerLimit) > Math.abs(value-upperLimit) ? upperLimit : lowerLimit;
                    var multiplier = value > limit ? 0.5 : 1.5;
                    var score = 20*(1 - Math.min(1,Math.abs(value - multiplier*limit)/limit));
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

                var userLargestCityPop = questionnaireAnswers.question4;
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
                var largestCityPopScore = getProportionalScore(lowerLimit,upperLimit,country.largestCityPop) || 0;

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
});

app.factory('userRecommendations',function(){
    return {};
});

app.factory('sharedService', ['$rootScope',function($rootScope){
    var mySharedService = {};

    mySharedService.values = {};

    mySharedService.worldBankDataUpdate = function(){
        $rootScope.$broadcast('update');
    };

    return mySharedService;
}]);
