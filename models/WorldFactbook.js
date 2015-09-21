var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a Mongoose Schema
var worldFactbookSchema = new Schema({
    name: {
        name: {type: String},
        abbreviation: {type: String}
    },
    intro: {
        background: {
            text: {type: String}
        }
    },
    geo: {
            maritime_claims : {
                text : {type: String}
            },
            area : {
                total : {type: String},
                land : {type: String},
                water : {type: String}
            },
            land_boundaries : {
                total : {type: String},
                    border_countries : {type: String}
            },
            coastline : {
                text : {type: String}
            },
            geographic_coordinates : {
                text : {type: String}
            },
            natural_resources : {
                text : {type: String}
            },
            irrigated_land : {
                text : {type: String}
            },
            natural_hazards : {
                text : {type: String}
            },
            environment_current_issues : {
                text : {type: String}
            },
            geography_note : {
                text : {type: String}
            },
            map_references : {
                text : {type: String}
            },
            climate : {
                text : {type: String}
            },
            elevation_extremes : {
                highest_point : {type: String},
                    lowest_point : {type: String}
            },
            land_use : {
                other : {type: String},
                    arable_land : {type: String},
                    permanent_crops : {type: String}
            },
            environment_international_agreements : {
                party_to : {type: String},
                signed_but_not_ratified : {type: String}
            },
            location : {
                text : {type: String}
            },
            area_comparative : {
                text : {type: String}
            },
            terrain : {
                text : {type: String}
            }
    },
    people: {
        nationality: {
            noun: {type: String},
            adjective: {type: String}
        },
        ethnic_groups: {
            text: {type: String}
        },
        languages: {
            text: {type: String}
        },
        religions: {
            text: {type: String}
        },
        population: {
            text: {type: String}
        },
        age_structure: {
            "0_14_years": {type: String},
            "15_24_years": {type: String},
            "25_54_years": {type: String},
            "55_64_years": {type: String},
            "65_years_and_over": {type: String}
        },
        median_age: {
            total: {type: String},
            male: {type: String},
            female: {type: String}
        },
        population_growth_rate: {
            text: {type: String}
        },
        birth_rate: {
            text: {type: String}
        },
        death_rate: {
            text: {type: String}
        },
        net_migration_rate: {
            text: {type: String}
        },
        urbanization: {
            urban_population: {type: String},
            rate_of_urbanization: {type: String}
        },
        major_urban_areas_population: {
            text: {type: String}
        },
        sex_ratio: {
            at_birth: {type: String},
                "0_14_years": {type: String},
                "15_24_years": {type: String},
                "25_54_years": {type: String},
                "55_64_years": {type: String},
                "65_years_and_over": {type: String},
                total_population: {type: String}
        },
        infant_mortality_rate: {
            total: {type: String},
            male: {type: String},
            female: {type: String}
        },
        life_expectancy_at_birth: {
            total_population: {type: String},
            male: {type: String},
            female: {type: String}
        },
        total_fertility_rate: {
            text: {type: String}
        },
        health_expenditures: {
            text: {type: String}
        },
        physicians_density: {
            text: {type: String}
        },
        hospital_bed_density: {
            text: {type: String}
        },
        drinking_water_source: {
            improved: {type: String}
        },
        sanitation_facility_access: {
            improved: {type: String}
        },
        hiv_aids_adult_prevalence_rate: {
            text: {type: String}
        },
        hiv_aids_people_living_with_hiv_aids: {
            text: {type: String}
        },
        hiv_aids_deaths: {
            text: {type: String}
        },
        obesity_adult_prevalence_rate: {
            text: {type: String}
        },
        education_expenditures: {
            text: {type: String}
        },
        literacy: {
            definition: {type: String},
            total_population: {type: String},
            male: {type: String},
            female: {type: String}
        },
        school_life_expectancy_primary_to_tertiary_education: {
            total: {type: String},
            male: {type: String},
            female: {type: String}
        }
    },
    govt: {
        country_name: {
            conventional_long_form: {type: String},
            conventional_short_form: {type: String},
            local_long_form: {type: String},
            local_short_form: {type: String}
        },
        government_type: {
            text: {type: String},
            capital: {type: String},
            name: {type: String},
            geographic_coordinates: {type: String},
            time_difference: {type: String},
            daylight_saving_time: {type: String}
        },
        administrative_divisions: {
            text: {type: String}
        },
        independence: {
            text: {type: String}
        },
        national_holiday: {
            text: {type: String}
        },
        constitution: {
            text: {type: String}
        },
        legal_system: {
            text: {type: String}
        },
        international_law_organization_participation: {
            text: {type: String}
        },
        suffrage: {
            text: {type: String}
        },
        executive_branch: {
            chief_of_state: {type: String},
            head_of_government: {type: String},
            cabinet: {type: String},
            elections: {type: String},
            election_results: {type: String}
        },
        legislative_branch: {
            text: {type: String},
            elections: {type: String},
            election_results: {type: String}
        },
        judicial_branch: {
            highest_courts: {type: String},
            judge_selection_and_term_of_office: {type: String},
            subordinate_courts: {type: String}
        },
        political_parties_and_leaders: {
            text: {type: String},
            note: {type: String}
        },
        international_organization_participation: {
            text: {type: String}
        },
        diplomatic_representation_in_the_us: {
            chief_of_mission: {type: String},
                chancery: {type: String},
                telephone: {type: String},
                fax: {type: String}
        },
        diplomatic_representation_from_the_us: {
            text: {type: String}
        },
        flag_description: {
            text: {type: String},
            note: {type: String}
        },
        national_anthem: {
            name: {type: String},
            lyrics_music: {type: String},
            note: {type: String}
        }
    },
    econ: {
        economy_overview: {
            text: {type: String}
        },
        gdp_purchasing_power_parity: {
            text: {type: String},
            note: {type: String}
        },
        gdp_official_exchange_rate: {
            text: {type: String}
        },
        gdp_real_growth_rate: {
            text: {type: String}
        },
        gdp_per_capita_ppp: {
            text: {type: String}
        },
        gdp_composition_by_sector_of_origin: {
            agriculture: {type: String},
            industry: {type: String},
            services: {type: String}
        },
        agriculture_products: {
            text: {type: String}
        },
        industries: {
            text: {type: String}
        },
        industrial_production_growth_rate: {
            text: {type: String}
        },
        labor_force: {
            text: {type: String}
        },
        labor_force_by_occupation: {
            agriculture: {type: String},
            industry: {type: String},
            services: {type: String}
        },
        unemployment_rate: {
            text: {type: String}
        },
        population_below_poverty_line: {
            text: {type: String}
        },
        household_income_or_consumption_by_percentage_share: {
            "lowest_10%": {type: String},
            "highest_10%": {type: String}
        },
        budget: {
            revenues: {type: String},
            expenditures: {type: String}
        },
        taxes_and_other_revenues: {
            text: {type: String}
        },
        budget_surplus_or_deficit: {
            text: {type: String}
        },
        fiscal_year: {
            text: {type: String}
        },
        inflation_rate_consumer_prices: {
            text: {type: String}
        },
        exports: {
            text: {type: String}
        },
        exports_commodities: {
            text: {type: String}
        },
        imports: {
            text: {type: String}
        },
        imports_commodities: {
            text: {type: String}
        },
        debt_external: {
            text: {type: String}
        },
        exchange_rates: {
            text: {type: String}
        }
    },
    energy: {
            electricity_production: {
                text: {type: String}
            },
            electricity_consumption: {
                text: {type: String}
            },
            electricity_exports: {
                text: {type: String}
            },
            electricity_imports: {
                text: {type: String}
            }
        },
    comm: {
        telephones_main_lines_in_use: {
            text: {type: String}
        },
        telephones_mobile_cellular: {
            text: {type: String}
        },
        telephone_system: {
            general_assessment: {type: String},
            domestic: {type: String},
            international: {type: String}
        },
        broadcast_media: {
            text: {type: String}
        },
        internet_country_code: {
            text: {type: String}
        },
        internet_hosts: {
            text: {type: String}
        },
        internet_users: {
            text: {type: String}
        }
    },
    trans: {
        roadways: {
            total: {type: String}
        }
    },
    military: {
        military_branches: {
            text: {type: String}
        },
        manpower_available_for_military_service: {
            males_age_16_49: {type: String}
        },
        manpower_fit_for_military_service: {
            males_age_16_49: {type: String},
                females_age_16_49: {type: String}
        },
        manpower_reaching_militarily_significant_age_annually: {
            male: {type: String},
            female: {type: String}
        },
        military_note: {
            text: {type: String}
        }
    },
    issues: {
        disputes_international: {
            text: {type: String}
        }
    }
});

var WorldFactbook = mongoose.model('WorldFactbook', worldFactbookSchema);

module.exports = WorldFactbook;

