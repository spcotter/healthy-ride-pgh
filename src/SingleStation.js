import React from 'react';
import { Redirect } from 'react-router-dom';
import * as d3 from 'd3';

import Layout from './Layout';
import RideMap from './RideMap';
import StationDetails from './StationDetails';

export default props => {
  if(props.loading) {
    return <Redirect to="/"/>;
  }

  const stationNumber = props.match.params.stationNumber;
  const fromToData = props.fromToData
    .filter(d => d.from === stationNumber && d.freq > 0)
    .sort((a,b) => d3.descending(a.freq, b.freq));
  const includedStations = fromToData.map(d => d.to).concat([stationNumber]);
  console.log('includedStations', includedStations);

  const filteredProps = {
    ...props,
    fromToData,
    stations: props.stations.filter(s => includedStations.indexOf(s.number) > -1),
  };

  filteredProps.stationNumber = stationNumber;

  console.log('filteredProps', filteredProps);
  return (
    <Layout
      left = {
        <RideMap {...filteredProps}/>
      }
      right={
        <StationDetails {...filteredProps}/>
      }
    />
  );
}
