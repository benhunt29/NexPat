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

app.controller('navCtrl', ['authService','$scope','$rootScope','$location', function(authService, $scope,$rootScope, $location){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/questionnaire');
    }

    $scope.logout = function(){
        authService.logout();
        $rootScope.user = authService.getUser();
        $location.path("/login");
    }
}]);

app.controller('helpController',['$scope', function($scope){
    $scope.message = "I'm a help page that currently doesn't help at all";
}]);

app.controller('questionnaireController',['$rootScope','$scope','$location', '$http', function($rootScope,$scope,$location,$http){

    var questionNum = 1;
    $scope.type = questions[0].type;
    $scope.question = questions[0].question;
    $scope.getQuestion = function(answer){

        if(questionNum==questions.length){
            $scope.question = 'Your list is being generated!';
            $scope.type = '';
        }else{
            $scope.question = questions[questionNum].question;
            $scope.type = questions[questionNum].type;

            if($scope.type == 'list'){
                $scope.list = questions[questionNum].answerOptions;
            }
            questions[questionNum-1].answer = answer;

            questionNum++;
        }
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

app.factory('questionnaire', ['$q', '$location', 'authService', function ($q, $location, authService) {
    return {
        questions: [
            {
                question: "What language(s) do you speak?", type: 'list',
                answerOptions: ['Adyghe', 'Albanian', 'Aragonese', 'Armenian', 'Aromanian', 'Arpitan', 'Asturian', 'Avar', 'Azerbaijani', 'Bashkir', 'Basque', 'Belarusian', 'Bosnian', 'Breton', 'Bulgarian', 'Catalan', 'Chechen', 'Chuvash', 'Cornish', 'Corsican', 'Crimean', 'Tatar', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Erzya', 'Estonian', 'Faroese', 'Finnish', 'French', 'Frisian', 'Gagauz', 'Galician', 'Gallo', 'Georgian', 'German', 'Greek', 'Hungarian', 'Icelandic', 'Ingrian', 'Irish', 'Italian', 'Kabardian', 'Kashubian', 'Kazakh', 'Ladin', 'Latin', 'Latvian', 'Laz', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Maltese', 'Manx', 'Mari', 'Mingrelian', 'Mirandese', 'Montenegrin', 'Norwegian', 'Occitan', 'Ossetian', 'Picard', 'Polish', 'Portuguese', 'Romani', 'Romanian', 'Romansh', 'Russian', 'Sami', 'Sardinian', 'Scots', 'Scottish' 'Gaelic', 'Serbian', 'Silesian', 'Slovak', 'Slovene', 'Sorbian', 'Spanish', 'Svan', 'Swedish', 'Tabasaran', 'Tatar', 'Turkish', 'Ukrainian', 'Vepsian', 'Võro', 'Walloon', 'Welsh', 'Wymysorys']
            },
            {
                question: 'What field do you work in?',
                type: 'list',
                answerOptions: ['Agriculture', 'Industry', 'Services']
            },
            {
                question: 'What climate would you prefer?',
                type: 'list',
                answerOptions: ['Temperate', 'Mediterranean', 'Tropical', 'Arid', 'Desert', 'Maritime', 'Wet']
            },
            {
                question: 'What is the ideal size for the largest metropolitan area?',
                type: 'list',
                answerOptions: ['Small (<100,000', 'Medium (100,000-1 million', 'Large (>1 million)']
            },
            {
                question: 'What is your ideal size for the largest metropolitan area?',
                type: 'list',
                answerOptions: ['Small (<100,000', 'Medium (100,000-1 million', 'Large (>1 million)']
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
            countriesToSearch.forEach(function(country,index) {
                var score = 0;
                labor = labor;
                climate = climate;
                perCapitaPPP;
                urbanPopulation;
                largestCityPop;
                medianAge;
                internetUsagePerCapita;
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

                var recommendedCountries = countries.slice(0,4);
        }

    };
}]);