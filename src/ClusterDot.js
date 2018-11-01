import React from 'react';
import * as d3 from 'd3';
export default props => {
  const {
    clusters,
    clustersK,
    stationNumber
  } = props;

  if(!clustersK) {
    return null;
  }

  return (
    <div className="pull-right">
      <div style={{
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: d3.schemeCategory10[clusters[stationNumber][clustersK]]
      }}/>
    </div>
  );
}