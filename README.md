# NextPat

## Description ##
Next Pat is an application designed to aide those interested in moving abroad. Users are matched to countries based on their responses to a questionnaire. 

## Data ##
The recommendation questions are designed to correspond to relevant data sourced from the [CIA World Factbook](https://github.com/factbook/factbook.json). The country list is first filtered by language (matches are countries with a given language listed in their CIA World Factbook language listing). The remaining questions are used to generate a match score. The top 5 (or less) countries with the highest match score are returned. Mongo databases are used to store data.

## User Accounts ##
Users can create accounts through NextPat or using Google. Users' match responses will be stored and accessed on each login to regenerate the recommendations.

## Country Pages ##
Each country has a country page that can be accessed through the recommendations list. The country page displays some information from the CIA World Factbook, some data from the [World Data Bank API](http://data.worldbank.org/developers/api-overview), and a flag image sourced from the [MediaWiki API](https://www.mediawiki.org/wiki/API:Tutorial)
