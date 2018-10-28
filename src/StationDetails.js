import React from 'react';
import { commas, percent } from './format';


class StationDetails extends React.Component {

  render(){
    const {
      stations,
      stationTotals,
      overallTotal,
      fromToData,
      stationNumber
    } = this.props;

    const stationsByNumber = {};
    stations.forEach(s => stationsByNumber[s.number] = s);
    const station = stationsByNumber[stationNumber];
    const rides = stationTotals[station.number];

    return (
      <div style={{ padding: 15 }}>
        <h4>{ station.name }</h4>
        <h5>
          { commas(rides) } or { percent( rides / overallTotal ) } of all rides
        </h5>
        <p>
          If you rent a bike here, your most likely destinations are:
        </p>
        <ul>
          {
            fromToData.map( (d,i) => {
              const to =  stationsByNumber[d.to];
              if(!to) {
                return null;
              }
              console.log('stationsByNumber[d.to]', stationsByNumber[d.to]);
              return (
                <li key={i}>
                  {stationsByNumber[d.to].name} with probability { percent(d.freq / stationTotals[station.number]) }
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

}

export default StationDetails;