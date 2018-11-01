import React from 'react';
import {Link} from 'react-router-dom';
import {Label, Button} from 'react-bootstrap';
import { commas, percent, decimals } from './format';
import { getDistanceFromLatLonInKm, km2mi  } from './distance';
import SplitDataBar from './SplitDataBar';
import ClusterDot from './ClusterDot';


class StationDetails extends React.Component {

  render(){
    const {
      stations,
      stationTotals,
      overallTotal,
      fromToData,
      stationNumber,
      clusters,
      clustersK
    } = this.props;

    const stationsByNumber = {};
    stations.forEach(s => stationsByNumber[s.number] = s);
    const station = stationsByNumber[stationNumber];
    const rides = stationTotals[station.number];

    return (
      <div>
        <div>
          <div style={{ backgroundColor: 'whitesmoke', padding: 15 }}>
            {/* <Button componentClass={Link} to="/">
              <i className="fas fa-arrow-back"/>
            </Button> */}
            <h4>
              <Label className="pull-right" bsStyle="primary" bsSize="medium">{ station.category }</Label>
              { station.name }
            </h4>
            <h5>
              { commas(rides) } or { percent( rides / overallTotal ) } of all rides
            </h5>

          </div>
          <div style={styles.popularHeading}>
            Popular destinations from this station:
          </div>
        </div>
        <div style={{ position: 'absolute', overflowY: 'scroll', top: 122, right: 0, bottom: 0, left: 0 }}>

            {
              fromToData.map( (d,i) => {
                const to = stationsByNumber[d.to];
                if(!to) {
                  return null;
                }
                const p = d.freq / stationTotals[station.number];
                const dist = getDistanceFromLatLonInKm(
                  station.latitude, station.longitude,
                  to.latitude, station.longitude,
                );
                return (
                  <div key={i} style={styles.destination}>
                    <ClusterDot clusters={clusters} clustersK={clustersK} stationNumber={d.to}/>
                    <div style={styles.destinationName}>{stationsByNumber[d.to].name}</div>
                    <div style={styles.p}> { percent(p) }, { decimals( km2mi(dist) ) } mi, { commas(d.duration) } m</div>
                    <SplitDataBar outerWidth={p} widths={[1]} fills={d.to === station.number ? ['#398BFB'] : ['#9cc5fd'] } />
                  </div>
                );
              })
            }
        </div>
      </div>
    );
  }

}

export default StationDetails;

const styles = {
  popularHeading: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    fontSize: 12,
    borderBottom: '1px solid whitesmoke',
    backgroundColor: 'rgb(235,235,235)',
  },
  destination: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottom: '1px solid whitesmoke'
  },
  destinationName: {
    fontSize: 14,
    color: '#555'
  },
  p: {
    fontSize: 12
  }
};

//   padding: 5px 10px 5px 10px;
//   border-bottom: 1px solid whitesmoke;
//   font-size: 12px;
//   background-color: rgb(235,235,235);
// }



