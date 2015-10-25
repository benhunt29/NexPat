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
                question: 'What climate would you prefer?',
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
