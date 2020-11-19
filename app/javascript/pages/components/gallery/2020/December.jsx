import React, { useEffect } from 'react';

const December = () => {
  useEffect(() => {
    const divElement = document.getElementById('viz1605722746908');
    const vizElement = divElement.getElementsByTagName('object')[0];
    if (divElement.offsetWidth > 800) {
      vizElement.style.width = '100%';
      vizElement.style.height = `${divElement.offsetWidth * 0.75}px`;
    } else if (divElement.offsetWidth > 500) {
      vizElement.style.width = '100%';
      vizElement.style.height = `${divElement.offsetWidth * 0.75}px`;
    } else {
      vizElement.style.width = '100%';
      vizElement.style.height = '727px';
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
  }, []);
  return (
    <>
      <h1 className="calendar-viz__title">The Need for Speed</h1>
      <div className="calendar-viz__iframe-wrapper">
        <div className="tableauPlaceholder" id="viz1605722746908" style={{ position: 'relative', height: '500px' }}>
          <noscript>
            <a href="#">
              <img alt=" " src="https://public.tableau.com/static/images/20/2020BroadbandSpeeds_16057214918480/RegionalBroadband/1_rss.png" style={{ border: 'none' }} />
            </a>
          </noscript>
          <object className="tableauViz" style={{ display: 'none' }}>
            <param name="host_url" value="https://public.tableau.com/" />
            <param name="embed_code_version" value="3" />
            <param name="site_root" value="" />
            <param name="name" value="2020BroadbandSpeeds_16057214918480/RegionalBroadband" />
            <param name="tabs" value="no" />
            <param name="toolbar" value="yes" />
            <param name="static_image" value="https:/public.tableau.com/static/images/20/2020BroadbandSpeeds_16057214918480/RegionalBroadband/1.png" />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="language" value="en" />
          </object>
        </div>
      </div>
      <p>Have you ever used that convenient widget that appears at the top of Google searches for “speed test”? Maybe your Zoom video keeps cutting out and you hop over to Google for a quick speed test. Ever wonder where all that data goes or how you compare with your neighbors? Well, Google partners with the Measurement Lab (M-Lab) to run those speed tests. M-Lab is committed to making the non-identifiable data open and available to the public.</p>
      <p>We took speed tests submitted by users and averaged the results of all speed tests made by a single user on a single day. Mapped are these median speeds by municipality for 2020. In the tooltip we show the distribution for each municipality. We put those averages into 5 megabit per second bins. The higher the bar in the histogram, the more people that have experienced speeds within the range for the bin (example 0-5Mbps). While there may be some clustering around speed tiers offered by internet service providers, there are a lot of factors that contribute to speed from equipment performance to heavy use with multiple family members sharing a connection.</p>
      <p>Despite broadband currently not treated as a public utility, it has been become an even more an essential resource in 2020. Across the Commonwealth, governments and communities are looking to make investments in the infrastructure, equipment and training that can increase access to the internet and the need speed to keep residents connected.</p>
      <p>---</p>
      <p>Despite broadband currently not being treated as a public utility, it has been become an essential resource in 2020.  The COVID pandemic has created an environment where multiple members of the same household may need to be accessing video calls, online cloud storage, and other digital tools for work, school, and healthcare – potentially at the same time.  Having access to high speed and reliable internet is now no longer an amenity, it is a critical tool for daily life.</p>
      <p>The issue of internet access, broadly referred to as the “Digital Divide”, is a function of three critical elements:</p>
      <ol>
        <li>A adequate device.  A phone of tablet may be good for entertainment but nor for school or work.</li>
        <li>Literacy:  The ability to use the device to access the tools and resources an individual needs.</li>
        <li>Connection:  A household or building connection to an internet service provider at a price that they can afford. </li>
      </ol>
      <p>Many Massachusetts communities have only one or two internet service providers, with lower income communities lacking some of the more expensive high speed providers such as Verizon FIOS.  Some communities have taken it upon themselves to provide internet through a municipal broadband initiative.</p>
      <p>To better understand where there might be issues of quality connectivity or service provision, MAPC took M-Lab speed tests submitted by users and averaged the results of all speed tests made by a single user on a single day. Mapped are these median speeds by municipality for 2020. In the tooltip we show the distribution for each municipality. We put those averages into 5 megabit per second bins. The higher the bar in the histogram, the more people that have experienced speeds within the range for the bin (example 0-5Mbps). While there may be some clustering around speed tiers offered by internet service providers, there are a lot of factors that contribute to speed from equipment performance to heavy use with multiple family members sharing a connection.</p>
      <p>Across the Commonwealth,  communities are looking to make investments in the infrastructure, equipment and training that can increase quality access to the internet.  MAPC believes that municipalities can play a leading role in ensuring internet access and connectivity for families, students, seniors, and other individuals who are needing to use digital resources in new ways.</p>
      <p>MAPC proposes a three step approach to tackling municipal Digital Divide issues:</p>
      <ol>
        <li>Understanding the specific needs of the community: Identifying the specific barriers that individuals and households are facing across a community is an important first step to addressing Digital Divide issues.</li>
        <li>Developing a Digital Access Plan:  Similar to a Master Plan or Housing Production Plan, a Municipal Digital Access Plan can lay out the vision and actors needed to address digital divide issues in a community.</li>
        <li>Infrastrucutre Evaluation:  Evaluating the existing and needed infrastructure to improve connectivity can be an important final step in improving digital access.  Knowing where existing resources such as dark fiber lines, carrier hotels, and other components of internet infrastructure can provide direction for a municipality looking to improve connectivity for it’s residents and businesses.</li>
      </ol>
      <p>MAPC also believes that this should not sit a vaccuum – something about workforce tie in...</p>
      <p>If your community is interested in exploring issues related to the digital divide, please reach out to (Josh/Ryan/Matt) and we would be happy to discuss how to produce these elements...</p>
    </>
  );
};

export default December;
