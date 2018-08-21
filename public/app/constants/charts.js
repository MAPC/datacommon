import colors from '~/app/constants/colors';
import locations from '~/app/constants/locations';

export default {
  'demographics' : {

    'race_ethnicity': {
      type: 'stacked-bar',
      title: 'Race and Ethnicity',
      xAxis: { label: 'Year', },
      yAxis: { label: 'Population', format: d => `${d/1000}k` },
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
      timeframe: '5 yr avg 2012-16',
      datasetId: 6,
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
            x: groupings[key],
            y: row[tableDef.yearCol],
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
      yAxis: { label: 'Population', format: d => `${d/1000}k` },
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
      datasetId: 220,
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
          x: data[k],
          y: row[chart.tables['tabular.census2010_p12_pop_by_age_m'].yearCol],
          z: chart.labels[k],
        }));
      },
    },
  },
  'economy': {
    'resident_employment': {
      type: 'stacked-bar',
      title: 'Employment of Residents',
      xAxis: { label: 'Year', format: d => String(d) },
      yAxis: { label: 'Population', format: d => `${d/1000}k` },
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
      source: 'ACS',
      timeframe: '2007-2011; 2012-2016',
      datasetId: 129,
      transformer: (tables, chart) => {
        const empData = tables['tabular.b23025_employment_acs_m'];
        if (empData.length < 1) { return []; }
        return empData.reduce((acc, row) => acc.concat(Object.keys(chart.labels).map((key) => ({
          x: row[key],
          y: row[chart.tables['tabular.b23025_employment_acs_m'].yearCol],
          z: chart.labels[key],
        }))), []);
      },
    },
    'emp_by_sector': {
      type: 'stacked-area',
      title: 'Employment by Industry',
      xAxis: { label: 'Year', format: d => d },
      yAxis: { label: 'Employment by Industry', format: d => `${d/1000}k`},
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
      source: 'MAPC',
      timeframe: '2001-2016',
      datasetId: 319,
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
      datasetId: 320,
      transformer: (tables, chart) => {
        const rows = tables['tabular.educ_enrollment_by_year_districts'];
        if (rows.length < 1) { return []; }
        const data = rows.reduce((acc, district) =>
          acc.concat(Object.keys(district).reduce((group, key) => (
            key == 'district' || key == 'districtid' || key == 'schoolyear' ? group : group.concat([{
              x: district[key],
              y: `${district['schoolyear']} ${district['district']}`,
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
      xAxis: { label: 'Year'},
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
      timeframe: '2012-2016',
      datasetId: 202,
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
            x: consolidatedRow[`${race}${edu}`],
            y: chart.labels[edu],
            z: chart.labels[race],
          }]), []))
        , []);
      },
    },
  },
  'transportation': {
    'commute_means': {
      type: 'pie',
      table: 'tabular.b08301_means_transportation_to_work_by_residence_acs_m',
      yearCol: 'acs_year',
      columns: {
        'ctvsngl_p': 'Drive (Alone)',
        'carpool_p': 'Drive (Carpool)',
        'pub_p': 'Public Transit',
        'taxi_p': 'Taxi',
        'mcycle_p': 'Motorcycle',
        'bicycle_p': 'Bicycle',
        'walk_p': 'Walk',
        'other_p': 'Other',
      },
    },
  },
};
