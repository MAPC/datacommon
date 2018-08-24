import colors from '~/app/constants/colors';
import locations from '~/app/constants/locations';

export default {
  'demographics' : {

    'race_ethnicity': {
      type: 'stacked-bar',
      title: 'Race and Ethnicity',
      xAxis: { label: '2012-2016 5-Year Estimates', },
      yAxis: { label: 'Population', format: d => `${(d/1000).toFixed(0)}k` },
      tables: {
        'tabular.b03002_race_ethnicity_acs_m': {
          yearCol: 'acs_year',
          latestYearOnly: true,
          columns: [
            'acs_year',
            'nhwhi',
            'nhaa',
            'nhna',
            'nhas',
            'nhpi',
            'nhoth',
            'nhmlt',
            'lat',
          ],
        },
      },
      labels: {
        'nhwhi': 'Non-hispanic White',
        'nhaa': 'Non-hispanic Black or African American',
        'nhapi': 'Non-hispanic Asian and Pacific Islander',
        'nhother': 'Non-hispanic Other',
        'lat': 'Hispanic or Latino',
      },
      colors: {
        'nhwhi': colors.CHART.get('LIGHT_YELLOW'),
        'nhaa': colors.CHART.get('DARK_RED'),
        'nhapi': colors.CHART.get('TEAL_GREEN'),
        'nhother': colors.CHART.get('BLUE'),
        'lat': colors.CHART.get('PINK'),
      },
      source: 'ACS',
      timeframe: '2012-2016 5-Year Estimates',
      datasetLinks: { 'Race and Ethnicity Estimates (Municipal)': 6 },
      transformer: (tables, chart) => {
        const raceEthnicityData = tables['tabular.b03002_race_ethnicity_acs_m'];
        const tableDef = chart.tables['tabular.b03002_race_ethnicity_acs_m'];
        if (raceEthnicityData.length < 1) { return []; }
        const row = raceEthnicityData[0];
        const groupings = {
          'nhwhi': row['nhwhi'],
          'nhaa': row['nhaa'],
          'nhapi': row['nhas'] + row['nhpi'],
          'nhother': row['nhoth'] + row['nhmlt'] + row['nhna'],
          'lat': row['lat'],
        };
        return Object.keys(groupings).reduce((set, key) =>
          (tableDef.yearCol == key ? set : set.concat([{
            x: row[tableDef.yearCol],
            y: groupings[key],
            z: chart.labels[key],
            color: chart.colors[key],
          }]))
        , []);
      },
    },

    'pop_by_age': {
      type: 'stacked-bar',
      title: 'Population by Age',
      xAxis: { label: 'Year',  },
      yAxis: { label: 'Population', format: d => `${(d/1000).toFixed(0)}k` },
      tables: {
        'tabular.census2010_p12_pop_by_age_m': {
          yearCol: 'years',
          latestYearOnly: true,
          columns: [
            'years',
            'totpop',
            'pop_u18',
            'pop18_24',
            'pop25_34',
            'pop35_39',
            'pop40_44',
            'pop45_49',
            'pop50_54',
            'pop55_59',
            'pop60_61',
            'pop62_64',
            'pop65_66',
            'pop67_69',
            'pop70_74',
            'pop75_79',
            'pop80_84',
            'pop85o',
          ],
        }
      },
      labels: {
        pop_u18: 'Under 18',
        pop18_24: '18-24',
        pop25_34: '25-34',
        pop35_49: '35-49',
        pop50_64: '50-64',
        pop65_74: '65-74',
        pop75o: '75 and over',
      },
      source: '2010 Census',
      timeframe: '2010',
      datasetLinks: { 'Population by Age (Municipal)': 220 },
      transformer: (tables, chart) => {
        const popData = tables['tabular.census2010_p12_pop_by_age_m'];
        if (popData.length < 1) { return []; }
        const row = popData[0];
        const data = {
          pop_u18: row['pop_u18'],
          pop18_24: row['pop18_24'],
          pop25_34: row['pop25_34'],
          pop35_49: row['pop35_39'] + row['pop40_44'] + row['pop45_49'],
          pop50_64: row['pop50_54'] + row['pop55_59'] + row['pop60_61'] + row['pop62_64'],
          pop65_74: row['pop65_66'] + row['pop67_69'] + row['pop70_74'],
          pop75o: row['pop75_79'] + row['pop80_84'] + row['pop85o'],
        };
        return Object.keys(data).map(k => ({
          x: row[chart.tables['tabular.census2010_p12_pop_by_age_m'].yearCol],
          y: data[k],
          z: chart.labels[k],
        }));
      },
    },
  },
  'economy': {
    'resident_employment': {
      type: 'stacked-bar',
      title: 'Employment of Residents',
      xAxis: { label: '5-Year Estimates', format: d => String(d) },
      yAxis: { label: 'Population', format: d => `${(d/1000).toFixed(0)}k` },
      tables: {
        'tabular.b23025_employment_acs_m': {
          yearCol: 'acs_year',
          years: [
            '2007-11',
            '2012-16',
          ],
          columns: [
            'acs_year',
            'emp',
            'unemp',
          ],
        }
      },
      labels: {
        emp: 'Employed',
        unemp: 'Unemployed',
      },
      source: 'Executive Office of Labor and Workforce Development (EOLWD)',
      timeframe: '2007-2011 and 2012-2016 5-Year Estimates',
      datasetLinks: { 'Labor Force (Municipal)': 129 },
      transformer: (tables, chart) => {
        const empData = tables['tabular.b23025_employment_acs_m'];
        if (empData.length < 1) { return []; }
        return empData.reduce((acc, row) => acc.concat(Object.keys(chart.labels).map((key) => ({
          x: row[chart.tables['tabular.b23025_employment_acs_m'].yearCol],
          y: row[key],
          z: chart.labels[key],
        }))), []);
      },
    },
    'emp_by_sector': {
      type: 'stacked-area',
      title: 'Employment by Industry',
      xAxis: { label: 'Year', format: d => d },
      yAxis: { label: 'Employment by Industry', format: d => `${(d/1000).toFixed(0)}k`},
      tables: {
        'tabular.econ_es202_naics_2d_m': {
          yearCol: 'cal_year',
          columns: [
            'cal_year',
            'naicstitle',
            'naicscode',
            'avgemp',
          ],
        }
      },
      labels: {
        '11+21': 'Agriculture, Forestry, Fishing, Hunting, and Mining',
        '22': 'Construction',
        '31-33': 'Manufacturing',
        '42+44-45': 'Wholesale and Retail Trade',
        '22+48-49': 'Transportation, warehousing, and utilities',
        '51': 'Information',
        '52+53': 'Finance, Insurance, Real Estate, and Rental and Leasing',
        '54+55+56': 'Professional, technical, management, administrative, and waste management services',
        '61+62': 'Education, health, and social services',
        '71+72': 'Arts, entertainment, recreation, accommodation, and food services',
        '81': 'Other services (other than public administration)',
        '92': 'Public administration',
      },
      source: 'Executive Office of Labor and Workforce Development (EOLWD)',
      timeframe: '2001-2016',
      datasetLinks: { 'Occupational Employment and Wages by Industry (NAICS) (MA)': 319 },
      transformer: (tables, chart) => {
        const indData = tables['tabular.econ_es202_naics_2d_m'];
        if (indData.length < 1) { return []; }
        const mapping = {};
        indData.forEach((row) => {
          if (!mapping[row['cal_year']]) {
            mapping[row['cal_year']] = {}
          }
          mapping[row['cal_year']][row['naicscode']] = row['avgemp'] || 0;
        });

        const combineCategories = (year) => {
          const getOrZero = (obj, key) => (obj[key] || 0);
          return {
            '11+21': getOrZero(year, '11') + getOrZero(year, '21'),
            '22': getOrZero(year, '22'),
            '31-33': getOrZero(year, '31-33'),
            '42+44-45': getOrZero(year, '42') + getOrZero(year, '44-45'),
            '22+48-49': getOrZero(year, '22') + getOrZero(year, '48-49'),
            '51': getOrZero(year, '51'),
            '52+53': getOrZero(year, '52') + getOrZero(year, '53'),
            '54+55+56': getOrZero(year, '54') + getOrZero(year, '55') + getOrZero(year, '56'),
            '61+62': getOrZero(year, '61') + getOrZero(year, '62'),
            '71+72': getOrZero(year, '71') + getOrZero(year, '72'),
            '81': getOrZero(year, '81'),
            '92': getOrZero(year, '92'),
          };
        };
        const data = Object.keys(mapping).reduce((acc, year) => {
          const yearData = combineCategories(mapping[year]);
          return acc.concat(Object.keys(yearData).map((key) => ({
            x: parseInt(year),
            y: yearData[key],
            z: chart.labels[key],
          })));
        }, []);
        return data;
      },
    },
  },
  'education': {
    'school_enrollment': {
      type: 'stacked-bar',
      title: 'School Enrollment',
      xAxis: { label: 'Year', format: d => d },
      yAxis: { label: 'Enrollment', format: d => d },
      tables: {
        'tabular.educ_enrollment_by_year_districts': {
          specialFetch: async (municipality, dispatchUpdate) => {
            const spatial_api = `${locations.BROWSER_API}?token=${locations.GISDATA_TOKEN}&query=`;
            const tabular_api = `${locations.BROWSER_API}?token=${locations.DS_TOKEN}&query=`;
            const gis_query = `${spatial_api}`
              + `SELECT districtid, district, madisttype, town_reg, municipal `
              + `FROM mapc.school_districts_poly `
              + `JOIN mapc.ma_municipalities `
              + `ON ST_Intersects(mapc.school_districts_poly.shape, mapc.ma_municipalities.shape) `
              + `WHERE `
              + `municipal ilike '${municipality}' `
              + `AND madisttype in ('Local School', 'Regional Academic') `
              + `AND (ST_Area(ST_Intersection(mapc.school_districts_poly.shape, mapc.ma_municipalities.shape)) / ST_Area(mapc.ma_municipalities.shape)) > 0.5`;
            const gis_response = await fetch(gis_query);
            const gis_payload = await gis_response.json() || {};
            if (!gis_payload.rows || gis_payload.rows.length < 1) { return dispatchUpdate([]); }
            const districtIds = gis_payload.rows.map((district) => `'${district['districtid']}'`);
            const query = `${tabular_api}`
              + `SELECT district, districtid, schoolyear, grade_k, grade_1,`
              + `grade_2, grade_3, grade_4, grade_5, grade_6, grade_7, grade_8,`
              + `grade_9, grade_10, grade_11, grade_12 `
              + `FROM tabular.educ_enrollment_by_year_districts `
              + `WHERE districtid IN (${districtIds.join(',')})`;
            const response = await fetch(query);
            const payload = await response.json() || {};
            return dispatchUpdate(payload.rows);
          },
        },
      },
      labels: {
        'grade_k': { label: 'Kindergarden', order: 0 },
        'grade_1': { label: '1st Grade', order: 1 },
        'grade_2': { label: '2nd Grade', order: 2 },
        'grade_3': { label: '3rd Grade', order: 3 },
        'grade_4': { label: '4th Grade', order: 4 },
        'grade_5': { label: '5th Grade', order: 5 },
        'grade_6': { label: '6th Grade', order: 6 },
        'grade_7': { label: '7th Grade', order: 7 },
        'grade_8': { label: '8th Grade', order: 8 },
        'grade_9': { label: '9th Grade', order: 9 },
        'grade_10': { label: '10th Grade', order: 10 },
        'grade_11': { label: '11th Grade', order: 11 },
        'grade_12': { label: '12th Grade', order: 12 },
      },
      source: 'MA Department of Elementary and Secondary Education',
      timeframe: '2007-2018',
      datasetLinks: { 'Enrollment by School Year (School Districts)': 320 },
      transformer: (tables, chart) => {
        const rows = tables['tabular.educ_enrollment_by_year_districts'];
        if (rows.length < 1) { return []; }
        const data = rows.reduce((acc, district) =>
          acc.concat(Object.keys(district).reduce((group, key) => (
            key == 'district' || key == 'districtid' || key == 'schoolyear' ? group : group.concat([{
              x: `${district['schoolyear']} ${district['district']}`,
              y: district[key],
              z: chart.labels[key].label,
              order: chart.labels[key].order,
            }])
          ), []))
        , []);
        return data;
      },
    },
    'edu_attainment_by_race': {
      type: 'stacked-bar',
      title: 'Educational Attainment by Race',
      xAxis: { label: '2012-2016 5-Year Estimates'},
      yAxis: { label: 'Attainment', format: d => `${d * 100}%`},
      tables: {
        'tabular.c15002_educational_attainment_by_race_acs_m': {
          yearCol: 'acs_year',
          columns: [
            'acs_year',
            'nhwlh',
            'nhwhs',
            'nhwsc',
            'nhwbd',
            'aalh',
            'aahs',
            'aasc',
            'aabd',
            'nalh',
            'nahs',
            'nasc',
            'nabd',
            'aslh',
            'ashs',
            'assc',
            'asbd',
            'pilh',
            'pihs',
            'pisc',
            'pibd',
            'othlh',
            'othhs',
            'othsc',
            'othbd',
            'mltlh',
            'mlths',
            'mltsc',
            'mltbd',
            'latlh',
            'laths',
            'latsc',
            'latbd',
          ],
        }
      },
      labels: {
        'lh': 'Less than high school diploma',
        'hs': 'High school diploma',
        'sc': 'Some college or associate degree',
        'bd': 'Bachelor degree or higher',
        'nhw': 'Non-hispanic White',
        'aa': 'Black and African American',
        'api': 'Asian and Pacific Islander',
        'oth': 'Other',
        'lat': 'Hispanic or Latino',
      },
      source: 'ACS',
      timeframe: '2012-2016 5-Year Estimates',
      datasetLinks: { 'Educational Attainment by Race (Municipal)': 202 },
      transformer: (tables, chart) => {
        const eduData = tables['tabular.c15002_educational_attainment_by_race_acs_m'];
        if (eduData.length < 1) { return []; }
        const row = Object.assign({}, eduData[0]);
        const raceKeys = ['nhw', 'aa', 'na', 'as', 'pi', 'oth', 'mlt', 'lat'];
        const combinedRaceKeys = ['nhw', 'aa', 'api', 'oth', 'lat'];
        const eduKeys = ['lh', 'hs', 'sc', 'bd'];
        const totals = eduKeys.reduce((obj, edu) => Object.assign(obj, {
          [edu]: raceKeys.reduce((sum, k) => sum + row[`${k}${edu}`], 0)
        }), {});
        const consolidatedRow = eduKeys.reduce((obj, edu) => {
          return Object.assign(obj, {
            [`nhw${edu}`]: (row[`nhw${edu}`]) / totals[edu],
            [`aa${edu}`]: (row[`aa${edu}`]) / totals[edu],
            [`lat${edu}`]: (row[`lat${edu}`]) / totals[edu],
            [`api${edu}`]: (row[`as${edu}`] + row[`pi${edu}`]) / totals[edu],
            [`oth${edu}`]: (row[`oth${edu}`] + row[`mlt${edu}`] + row[`na${edu}`]) / totals[edu],
          });
        }, {});
        return combinedRaceKeys.reduce((raceAcc, race) =>
          raceAcc.concat(eduKeys.reduce((eduAcc, edu) => eduAcc.concat([{
            x: chart.labels[edu],
            y: consolidatedRow[`${race}${edu}`],
            z: chart.labels[race],
          }]), []))
        , []);
      },
    },
  },
  'governance': {
    'tax_levy': {
      type: 'pie',
      title: 'Tax Levy Share',
      xAxis: { label: 'Year' },
      yAxis: { label: 'Attainment' },
      tables: {
        'tabular.econ_municipal_taxes_revenue_m': {
          yearCol: 'fy',
          latestYearOnly: true,
          columns: [
            'fy',
            'res_taxes',
            'os_taxes',
            'comm_taxes',
            'ind_taxes',
            'p_prop_tax',
            'tot_rev',
          ],
        }
      },
      labels: {
        'res_taxes': 'Residential',
        'os_taxes': 'Open Space',
        'comm_taxes': 'Commercial',
        'ind_taxes': 'Industrial',
        'p_prop_tax': 'Personal Property',
        'other': 'Non-Property',
      },
      source: 'MA Dept. of Revenue',
      timeframe: '2016',
      datasetLinks: { 'Municipal General Fund Revenue and Taxes (Municipal)': 383 },
      transformer: (tables, chart) => {
        const taxData = tables['tabular.econ_municipal_taxes_revenue_m'];
        if (taxData.length < 1) { return []; }
        const row = taxData[0];
        const directRev = ['res_taxes', 'os_taxes', 'comm_taxes', 'ind_taxes', 'p_prop_tax'];
        const withImplied = Object.assign(row, {
          'other': row['tot_rev'] - directRev.reduce((sum, k) => sum + row[k], 0),
        });
        return Object.keys(chart.labels).map((key) => ({
          value: withImplied[key],
          label: chart.labels[key],
        }));
      },
    },
  },
  'environment': {
    'water_usage_per_cap': {
      type: 'line',
      title: 'Water Usage per Capita',
      xAxis: { label: 'Year', format: x => x.toFixed(0), ticks: 7 },
      yAxis: { label: 'Resident Gallons per Capita Day', format: y => y.toFixed(1), min: 0 },
      tables: {
        'tabular.env_dep_reviewed_water_demand_m': {
          columns: [
            'rgpcd2009',
            'rgpcd2010',
            'rgpcd2011',
            'rgpcd2012',
            'rgpcd2013',
            'rgpcd2014',
            'rgpcd2015',
          ],
        }
      },
      labels: {
      },
      source: 'MassDEP',
      timeframe: '2009-15',
      datasetLinks: { 'Annual Average Residential Water Use (Municipal)': 260 },
      transformer: (tables, chart) => {
        const waterData = tables['tabular.env_dep_reviewed_water_demand_m'];
        if (waterData.length < 1) { return []; }
        const row = waterData[0];
        return [{
          label: 'Water Usage per Capita',
          values: [
            [2009, row['rgpcd2009']],
            [2010, row['rgpcd2010']],
            [2011, row['rgpcd2011']],
            [2012, row['rgpcd2012']],
            [2013, row['rgpcd2013']],
            [2014, row['rgpcd2014']],
            [2015, row['rgpcd2015']],
          ],
        }];
      },
    },
    'energy_usage_gas': {
      type: 'stacked-area',
      title: 'Thermal Energy Usage (Gas, oil, etc.)',
      xAxis: { label: 'Year', format: x => (x % 1 == 0 ? x.toFixed(0) : ''), ticks: 3 },
      yAxis: { label: 'Energy Costs ($)' },
      tables: {
        'tabular.energy_masssave_elec_gas_ci_consumption_m': {
          yearCol: 'cal_year',
          columns: [
            'cal_year',
            'sector',
            'mwh_use',
            'therm_use',
          ],
        },
        'tabular.energy_masssave_elec_gas_res_li_consumption_m': {
          yearCol: 'cal_year',
          columns: [
            'cal_year',
            'sector',
            'mwh_use',
            'therm_use',
          ],
        },
      },
      labels: {
        'therm_use': 'Annual Therm Usage',
      },
      source: 'MassSave',
      timeframe: '2013-2015',
      datasetLinks: {
        'MassSave Comm & Industrial Incentives and Savings (Municipal)': 251,
        'MassSave Res & Low Income Incentives and Savings (Municipal)': 252,
      },
      transformer: (tables, chart) => {
        const commData = tables['tabular.energy_masssave_elec_gas_ci_consumption_m'];
        const resData = tables['tabular.energy_masssave_elec_gas_res_li_consumption_m'];
        const rows = commData.concat(resData);
        if (rows.length < 1) { return []; }
        const data = rows.reduce((acc, row) => {
          return acc.concat([{
            x: row['cal_year'],
            y: row['therm_use'],
            z: `${row['sector']} ${chart.labels['therm_use']}`,
          }]);
        }, []);
        return data;
      },
    },
    'energy_usage_electricity': {
      type: 'stacked-area',
      title: 'Electrical Energy Usage',
      xAxis: { label: 'Year', format: x => (x % 1 == 0 ? x.toFixed(0) : '') },
      yAxis: { label: 'Energy Costs ($)' },
      tables: {
        'tabular.energy_masssave_elec_gas_ci_consumption_m': {
          yearCol: 'cal_year',
          columns: [
            'cal_year',
            'sector',
            'mwh_use',
            'therm_use',
          ],
        },
        'tabular.energy_masssave_elec_gas_res_li_consumption_m': {
          yearCol: 'cal_year',
          columns: [
            'cal_year',
            'sector',
            'mwh_use',
            'therm_use',
          ],
        },
      },
      labels: {
        'mwh_use': 'Annual MWh Usage',
      },
      source: 'MassSave',
      timeframe: '2013-2015',
      datasetLinks: {
        'MassSave Comm & Industrial Incentives and Savings (Municipal)': 251,
        'MassSave Res & Low Income Incentives and Savings (Municipal)': 252,
      },
      transformer: (tables, chart) => {
        const commData = tables['tabular.energy_masssave_elec_gas_ci_consumption_m'];
        const resData = tables['tabular.energy_masssave_elec_gas_res_li_consumption_m'];
        const rows = commData.concat(resData);
        if (rows.length < 1) { return []; }
        return rows.reduce((acc, row) => {
          return (row['mwh_use'] ? acc.concat([{
            x: row['cal_year'],
            y: row['mwh_use'],
            z: `${row['sector']} ${chart.labels['mwh_use']}`,
          }]) : acc);
        }, []);
      },
    },
  },
  'housing': {
    'cost_burden': {
      type: 'stacked-bar',
      title: 'Housing Cost Burden',
      xAxis: { label: 'Cost Burden Categories'},
      yAxis: { label: 'Owner-Renter Ratio', format: y => `${(y*100).toFixed(0)}%` },
      tables: {
        'tabular.b25091_b25070_costburden_acs_m': {
          yearCol: 'acs_year',
          years: ['2012-16'],
          columns: [
            'acs_year',
            'occv2',
            'cb',
            'o_notcb',
            'r_notcb',
            'ocb3050',
            'rcb3050',
            'cb_3050',
            'o_cb50',
            'r_cb50',
            'cb_50',
          ],
        }
      },
      labels: {
        'not_cb': 'Not Cost Burdened',
        'p3050': 'Paying 30-50% of Income',
        'p50+': 'Paying 50%+ of Income',
        'owner': 'Owner Occupied',
        'renter': 'Renter Occupied',
      },
      source: 'ACS',
      timeframe: '2012-2016 5-Year Estimates',
      datasetLinks: { 'Cost Burdened Households (Municipal)': 185 },
      transformer: (tables, chart) => {
        const costData = tables['tabular.b25091_b25070_costburden_acs_m'];
        if (costData.length < 1) { return []; }
        const row = costData[0];
        return [{
          x: chart.labels['not_cb'],
          y: row['o_notcb'] / (row['occv2'] - row['cb']),
          z: chart.labels['owner'],
        }, {
          x: chart.labels['not_cb'],
          y: row['r_notcb'] / (row['occv2'] - row['cb']),
          z: chart.labels['renter'],
        }, {
          x: chart.labels['p3050'],
          y: row['ocb3050'] / row['cb_3050'],
          z: chart.labels['owner'],
        }, {
          x: chart.labels['p3050'],
          y: row['rcb3050'] / row['cb_3050'],
          z: chart.labels['renter'],
        }, {
          x: chart.labels['p50+'],
          y: row['o_cb50'] / row['cb_50'],
          z: chart.labels['owner'],
        }, {
          x: chart.labels['p50+'],
          y: row['r_cb50'] / row['cb_50'],
          z: chart.labels['renter'],
        }];
      },
    },
    'units_permitted': {
      type: 'stacked-area',
      title: 'Housing Units Permitted',
      xAxis: { label: 'Year' },
      yAxis: { label: 'Units Permitted'},
      tables: {
        'tabular.hous_building_permits_m': {
          yearCol: 'cal_year',
          where: 'months_rep = 12 AND cal_year >= 2001 AND cal_year <= 2017',
          columns: [
            'cal_year',
            'months_rep',
            'sf_units',
            'mf_units',
          ],
        }
      },
      labels: {
        'sf_units': 'Single Family Units',
        'mf_units': 'Multi Family Units',
      },
      source: 'Census Building Permit Survey',
      caveat: '*Ignoring years for which the municipality did not report all 12 months.',
      timeframe: '2001-2017',
      datasetLinks: { 'Building Permits by Type and Year (Municipal)': 384 },
      transformer: (tables, chart) => {
        const [ offset, numYears ] = [ 2001, 17 ];
        const permitData = tables['tabular.hous_building_permits_m'];
        const tableDef = chart.tables['tabular.hous_building_permits_m'];
        if (permitData.length < 1) { return []; }
        let rowIndex = 0;
        const allData = new Array(numYears);
        for (let yearIndex = 0; yearIndex < numYears; yearIndex += 1) {
          if (permitData[rowIndex] && permitData[rowIndex][tableDef.yearCol] == (offset + yearIndex)) {
            allData[yearIndex] = permitData[rowIndex];
            rowIndex += 1;
          } else {
            allData[yearIndex] = { [tableDef.yearCol]: `${(offset + yearIndex)}*`, 'mf_units': 0, 'sf_units': 0 };
          }
        }
        return allData.reduce((acc, year) => acc.concat([{
          x: String(year[tableDef.yearCol]),
          y: year['mf_units'],
          z: chart.labels['mf_units'],
        }, {
          x: String(year[tableDef.yearCol]),
          y: year['sf_units'],
          z: chart.labels['sf_units'],
        }]), []);
      },
    },
  },
  'public-health': {
    'premature_mortality_rate': {
      type: 'stacked-bar',
      title: 'Premature Mortality Rate by Race',
      xAxis: { label: '5 Year Average'},
      yAxis: { label: 'Age Adjusted Rate per 100,000' },
      tables: {
        'tabular.health_premature_mortality_race_m': {
          yearCol: 'years',
          columns: [
            'years',
            'whi_art',
            'whi_artlci',
            'whi_artuci',
            'aa_art',
            'aa_artlci',
            'aa_artuci',
            'api_art',
            'api_artlci',
            'api_artuci',
            'na_art',
            'na_artlci',
            'na_artuci',
            'oth_art',
            'oth_artlci',
            'oth_artuci',
            'lat_art',
            'lat_artlci',
            'lat_artuci',
          ],
        }
      },
      labels: {
        'whi_art': 'White',
        'aa_art': 'Black and African American',
        'api_art': 'Asian and Pacific Islander',
        'na_art': 'Native American',
        'oth_art': 'Other',
        'lat_art': 'Hispanic and Latino',
      },
      colors: {
        'whi_art': colors.CHART.get('LIGHT_YELLOW'),
        'aa_art': colors.CHART.get('DARK_RED'),
        'api_art': colors.CHART.get('TEAL_GREEN'),
        'na_art': colors.CHART.get('CYAN'),
        'oth_art': colors.CHART.get('BLUE'),
        'lat_art': colors.CHART.get('PINK'),
      },
      source: 'MA Dept. of Public Health',
      timeframe: '2003-2007, 2008-2012 5-year averages',
      datasetLinks: { 'Premature Mortality (Municipal)': 386 },
      transformer: (tables, chart) => {
        const premoData = tables['tabular.health_premature_mortality_race_m'];
        if (premoData.length < 1) { return []; }
        const raceKeys = [
          'whi_art',
          'aa_art',
          'api_art',
          'na_art',
          'oth_art',
          'lat_art',
        ];
        return raceKeys.reduce((acc, key) =>
          acc.concat(premoData.map((yearData) => ({
            x: yearData['years'],
            y: yearData[key] || 0,
            z: chart.labels[key],
            color: chart.colors[key],
          })))
        , []);
      },
    },
    'hospitalizations': {
      type: 'stacked-bar',
      title: 'Hypertension Hospitalizations by Race',
      xAxis: { label: 'Cause', format: d => d },
      yAxis: { label: 'Age Adjusted Rate per 100,000', format: d => String(d) },
      tables: {
        // TODO: Heart failure data not loaded at this time.
        // 'tabular.health_hospitalizations_heart_failure_m': {
        //   yearCol: 'cal_years',
        //   columns: [
        //     'cal_years',
        //     'whi_num',
        //     'aa_num',
        //     'api_num',
        //     'na_num',
        //     'oth_num',
        //     'lat_num',
        //   ],
        // },
        'tabular.health_hospitalizations_hypertension_m': {
          yearCol: 'cal_years',
          years: ['2008-2012'],
          columns: [
            'cal_years',
            'whi_arte',
            'aa_arte',
            'api_arte',
            'na_arte',
            'oth_arte',
            'lat_arte',
          ],
        },
      },
      labels: {
        'whi_arte': 'White',
        'aa_arte': 'Black and African American',
        'api_arte': 'Asian and Pacific Islander',
        'na_arte': 'Native American',
        'oth_arte': 'Other',
        'lat_arte': 'Hispanic and Latino',
      },
      colors: {
        'whi_arte': colors.CHART.get('LIGHT_YELLOW'),
        'aa_arte': colors.CHART.get('DARK_RED'),
        'api_arte': colors.CHART.get('TEAL_GREEN'),
        'na_arte': colors.CHART.get('CYAN'),
        'oth_arte': colors.CHART.get('BLUE'),
        'lat_arte': colors.CHART.get('PINK'),
      },
      source: 'MA Dept. of Public Health',
      timeframe: '2008-2012 5-year averages',
      datasetLinks: { 'Hypertension Related Hospitalizations (Municipal)': 385 },
      transformer: (tables, chart) => {
        const hyperData = tables['tabular.health_hospitalizations_hypertension_m'];
        if (hyperData.length < 1) { return []; }
        const row = hyperData[0];
        const raceKeys = [
          'whi_arte',
          'aa_arte',
          'api_arte',
          'na_arte',
          'oth_arte',
          'lat_arte',
        ];
        return raceKeys.reduce((acc, key) =>
          acc.concat([{
            x: 'Hypertension',
            y: row[key],
            z: chart.labels[key],
            color: chart.colors[key],
          }])
        , []);
        return [];
      },
    },
  },
  'transportation': {
    'daily_vmt': {
      type: 'stacked-area',
      title: 'Daily Vehicle Miles Traveled per Household',
      xAxis: { label: 'Year', format: y => String(y), ticks: 3 },
      yAxis: { label: 'Daily household vehicle miles traveled' },
      tables: {
        'tabular.trans_mavc_public_summary_m': {
          columns: [
            'quarter',
            'hh_est',
            'pass_vmt',
            'comm_vmt',
          ],
        },
      },
      labels: {
        'pass_vmt_hh': 'Passenger vehicles',
        'comm_vmt_hh': 'Commercial vehicles',
      },
      source: 'MAPC and MA RMV',
      timeframe: '2009-2015',
      datasetLinks: { 'Massachusetts Vehicle Municipal Summary Statistics (Municipal)': 330 },
      transformer: (tables, chart) => {
        const vmtData = tables['tabular.trans_mavc_public_summary_m'];
        if (vmtData.length < 1) { return []; }
        const quarterToYear = (quarter) => {
          const [ year, fourth ] = quarter.split('_q');
          return parseInt(year) + (parseInt(fourth) / 4);
        };
        return vmtData.reduce((acc, row) => acc.concat([{
          x: quarterToYear(row['quarter']),
          y: row['pass_vmt'] / row['hh_est'],
          z: chart.labels['pass_vmt_hh'],
        }, {
          x: quarterToYear(row['quarter']),
          y: row['comm_vmt'] / row['hh_est'],
          z: chart.labels['comm_vmt_hh'],
        }]), []);
      },
    },
    'commute_to_work': {
      type: 'pie',
      title: 'Commute to Work',
      tables: {
        'tabular.b08301_means_transportation_to_work_by_residence_acs_m': {
          yearCol: 'acs_year',
          latestYearOnly: true,
          columns: [
            'acs_year',
            'ctvsngl',
            'carpool',
            'pub',
            'taxi',
            'mcycle',
            'bicycle',
            'walk',
            'other',
          ],
        }
      },
      labels: {
        'ctvsngl': 'Drive alone to work',
        'carpool': 'Carpool',
        'pub': 'Public transportation',
        'taxi': 'Taxi',
        'mcycle': 'Motorcycle',
        'bicycle': 'Bicycle',
        'walk': 'Walk',
        'other': 'Other',
      },
      source: 'ACS',
      timeframe: '2012-2016 5-Year Estimates',
      datasetLinks: { 'Transportation to Work from Residence (Municpal)': 38 },
      transformer: (tables, chart) => {
        const commData = tables['tabular.b08301_means_transportation_to_work_by_residence_acs_m'];
        if (commData.length < 1) { return []; }
        const row = commData[0];
        return Object.keys(chart.labels).map((key) => ({
          value: row[key],
          label: chart.labels[key],
        }));
      },
    },
  },
};
