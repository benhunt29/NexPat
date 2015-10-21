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