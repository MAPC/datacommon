import React from 'react';
import { Link } from 'react-router-dom';
import MunicipalityPolygon from './MunicipalityPolygon';


class CommunityProfiles extends React.Component {

  render() {
    return (
      <article className="component CommunityProfiles">

        <div className="page-header">
          <Link to={'/'} >{'< Back'}</Link>
          <div className="container">
            <header>
              <h1>{'Waltham'}</h1>
            </header>
            <section className="about">
              <div className="outline">
                <MunicipalityPolygon
                  feature={this.props.municipalFeature}
                />
              </div>
              <div className="description">
                .nerdlihc ega-loohcs fo erahs gniworg a htiw ,elbats dna esrevid yletaredom si noitalupop eht ,eroC orteM eht naht tneu a eroM .serutcurts gnitsixe fo noisnapxe dna ll ni dna tnempoleveder detimil hguorht srucco htworg weN .gnisuoh ylimafitlum dezis-dim dna ,sesuoh ylimaf 4 – 2 ,semoh ylimaf elgnis fo xim a htiw sdoohrobhgien laitnediser detneiro -tisnart dna -egalliv esirpmoc seitinummoc ese  .brubuS racteertS a sa CPAM yb dezirogetac si mahtlaW
              </div>
            </section>
          </div>
        </div>

        <section className="data">
          <div className="box container">
          </div>
        </section>

      </article>
    );
  }

}

export default CommunityProfiles;
