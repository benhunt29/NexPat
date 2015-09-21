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
        console.log(questionNum);
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

app.controller('signUpController',['$scope', function($scope){

}]);

app.controller('loginController',['$scope', function($scope){

}]);

app.controller('helpController',['$scope', function($scope){
    $scope.message = "I'm a help page that currently doesn't help at all";
}]);

app.controller('questionnaireController',['$scope','$location', function($scope,$location){

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

}]);