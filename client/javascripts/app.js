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

    var questions = [{question: "Are you interested in living abroad?",type:'boolean'},
        {question:"Do you speak any languages besides English?",type:'boolean'},
    {question:"What field do you work in?",type:'list',answerOptions:['Technology','Engineering','Finance','Law','Business']}];
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