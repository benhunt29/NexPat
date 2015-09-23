
var countryList = function(searchResults){
    var countries = [];

    function returnedCountry(countryName,labor,climate,perCapitaPPP,urbanPopulation,medianAge,internetUsagePerCapita){
        this.countryName = countryName;
        this.labor = labor;
        this.climate = climate;
        this.perCapitaPPP = perCapitaPPP;
        this.urbanPopulation = urbanPopulation;
        this.medianAge = medianAge;
        this.internetUsagePerCapita = internetUsagePerCapita;
    }

    searchResults.forEach(function(item,index) {
        var returnedCountry = {};
        var countryName = item.name.name;
        var laborAg = parseFloat(item.econ.labor_force_by_occupation.agriculture);
        var laborInd = parseFloat(item.econ.labor_force_by_occupation.industry);
        var laborSvc = parseFloat(item.econ.labor_force_by_occupation.services);
        var labor = {laborAg: laborAg, laborInd: laborInd, laborSvc: laborSvc};
        var climate = item.geo.climate.text;
        var perCapitaPPP = item.econ.gdp_per_capita_ppp.text;

        if (perCapitaPPP) {
            perCapitaPPP = parseFloat(perCapitaPPP.match(/([^\s]+)/)[0].replace(/[^\d\.]/g, ''));
        }
        var urbanPopulation = parseFloat(item.people.urbanization.urban_population);
        var medianAge = parseFloat(item.people.median_age.total);
        var internetUsagePerCapita = parseFloat(item.comm.internet_users.text) / parseFloat(item.people.population.text);
        var country = new returnedCountry(countryName,labor,climate,perCapitaPPP,urbanPopulation,medianAge,internetUsagePerCapita);
        countries.push(country);
    });
};

module.exports = countryList;