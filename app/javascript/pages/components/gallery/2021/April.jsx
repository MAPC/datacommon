import React from 'react';

const April = () => (
  <>
    <h1 className="calendar-viz__title">Regional Wastewater Management</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2021/03/17/sewers.html" className="calendar-viz__iframe" id="april-iframe" title="Map of sewer systems in MAPC region" />
    </div>
    <p>
      Most of us forget about sewage as we flush. But how we dispose of wastewater has a profound influence on community growth, the economy, and the environment. Where there are no public sewers, the considerable land-area requirements of on-site wastewater treatment limits development potential. This contrasts with areas served by the Massachusetts Water Resources Authority (MWRA), which sends wastewater to Deer Island for processing. Indeed, the availability of sewers shapes land-use patterns in Metro Boston.
    </p>
    <p>
      For this reason, sewer system data was on MAPC&apos;s 2008 &quot;Most Wanted Datasets&quot; list. We have been slowly compiling the data ever since, focusing on the locations of existing wastewater collection pipes.
    </p>
    <p>
      As one might expect with information kept at the local level, data about pipe locations are stored in a variety of different formats and include a variety of information. Building upon work previously conducted by MassGIS, MAPC defined a basic data standard. We collected information from municipalities, from the U.S. Geological Survey, and from the MWRA. Unfortunately, some municipalities didn&apos;t share their data with us, and some of the data provided is incomplete or may now be out of date.
    </p>
    <p>
      Despite these limitations, the resulting dataset can be a valuable resource for planners and policy makers. For example, a new state law requires all MBTA-served communities to zone for multifamily housing. This sewer-system information will help identify the most promising sites for such zoning. MAPC has used this information to evaluate redevelopment potential at commercial sites across the region as part of a forthcoming &quot;Retrofitting Suburbia&quot; research report, and it is currently doing an analysis of wastewater and water supply capacity in the South Shore subregion.
    </p>
    <p>
      The lack of centralized sewer need not completely preclude denser development: modern &quot;package treatment,&quot; or other small-scale wastewater treatment facilities, can serve a large development or district while also protecting water quality. These are typically privately-owned facilities, but they could also be owned and operated by a municipality or public wastewater district. The feasibility, capacity, and cost of such facilities is influenced by site specific soil and hydrology as well as state and local regulations.
    </p>
  </>
);

export default April;
