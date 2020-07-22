import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg';
const August = () => (
  <>
    <h1 className="calendar-viz__title">Paycheck Protection Program</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/07/15/ppp.html" className="calendar-viz__iframe" id="july-iframe" title="Map of PPI scores across region" />
    </div>
    <p>Racial groups in Greater Boston are not equally exposed to pollutants. To be sure, most of us in the region live near a source of significant vehicular pollution. Eighty-eight percent of the population lives within 150 meters – a little less than 500 feet – of a major roadway. However, while 29 percent of the region’s White residents live in the most polluted areas, that percentage jumps to 45 for Black residents, 47 for Asian residents, and 54 for Latino residents.</p>
    <p>This inequity matters: research shows strong correlations between high exposure to air pollutants and increased risk of heart and lung diseases. These conditions, in turn, are linked to higher death rates among COVID-19 patients.</p>
    <p>MAPC quantified the disparate exposure to pollution with a metric called the Pollution Proximity Index (PPI). The PPI scores traffic emissions within 150 meters of roadways. The higher an area’s score, the higher its level of pollutants. We used the PPI to create a color-coded road network that highlights the roads with the highest emission levels.</p>
    <p>One-third of the region’s residents live in areas with the top PPI score of five, but that’s not the whole story. As you move from low to high PPI areas, the share of residents of color increases. This pattern holds true not only in high-density areas such as the Inner Core, but across the region.</p>
    <p>The correlation between large populations of color and areas with high pollution is not accidental. Discriminatory policies and practices resulted in communities of color being located in neighborhoods close to high-polluting roadways, and in new roads being built through existing minority neighborhoods.</p>
    <p>Working against such a systemic issue requires action on many fronts. For example, improving building ventilation systems will keep polluted air out of existing homes; improving alternative transportation options and shifting motor vehicles from fossil fuels to electricity will reduce future pollutants.</p>
    <p>To learn more about the racial disparities in proximity to vehicle air pollution, you can read the <a href="https://www.mapc.org/pollution-disparities-covid19/" className="calendar-viz__link">full report</a> or look at its <a href="http://www.mapc.org/wp-content/uploads/2020/05/PPA_Technical_Memorandum.pdf" className="calendar-viz__link">technical memorandum</a>. If you have additional questions, reach out to Conor Gately at <a href="mailto:cgately@mapc.org" className="calendar-viz__link">cgately@mapc.org</a>.</p>
  </>
);

export default August;
