/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

const October = () => (
  <>
    <h1 className="calendar-viz__title">Changing Forms of Municipal Government</h1>
    <div className="calendar-viz__iframe-wrapper">
      <iframe src="https://mapc.github.io/MapboxEmbeds/2020/08/19/government-types.html" className="calendar-viz__iframe" id="october-iframe" title="Sliding map comparing Massachusetts' municipal governments" />
    </div>
    <p>Although the types of municipal government that the Massachusetts Constitution permits all have their own challenges and idiosyncrasies, MAPC generally supports municipalities moving toward structures that allow for greater professionalism and accountability. It’s important that local governments enable dedicated professionals to plan and act strategically, and to focus on the long-range viability of the community alongside its regional neighbors.</p>
    <p>Open town meeting, for example, allows for a disproportionate impact of special interest groups, and effectively disenfranchises residents who find it difficult to attend town meeting sessions. Most towns in the MAPC region have populations large enough and challenges complex enough to warrant the use of representative town meetings as opposed to open town meetings.</p>
    <p>With data from the Massachusetts Municipal Association (MMA) <a href="https://www.mma.org/about-mma/publications/2020-21-massachusetts-municipal-directory/" className="calendar-viz__link">Municipal Directory</a>, we can look across the Commonwealth to see changes in policy board, legislative bodies, and chief official titles. The accompanying split map displays 2018-2019 information (published in August 2018) on the left and the 2019-2020 data (published in August 2019) on the right. Explore the map and drag the slider to compare changes to a particular city or town.</p>
    <p>The data shows 55 changes from 48 municipalities, with Amherst, Gill, North Attleborough, and Wakefield each reporting multiple updates. Four municipalities updated their chief municipal officer role from being the chair of the select board to a town administrator, though two more went the other way. Five others moved from having a town administrator to a town manager, two went from the chair to an administrator coordinator, and one more swapped the chair for an executive secretary.</p>
    <p>Only two municipalities made substantive changes to their legislative bodies, with Amherst and North Attleborough changed from representative town meeting to council forms of government.</p>
    <p>The most marked trend was toward gender-neutral titles. Three municipalities switched from aldermen to councils, and 26 towns changed their policy boards from boards of selectmen to select boards.</p>
    <p>The 2020-2021 Municipal Directory is set to release this fall, this time in a fully electronic format. To learn more about how to access a copy, you can visit their website at <a href="https://www.mma.org/about-mma/publications/2020-21-massachusetts-municipal-directory/" className="calendar-viz__link">https://www.mma.org/about-mma/publications/2020-21-massachusetts-municipal-directory</a>.</p>
  </>
);

export default October;
