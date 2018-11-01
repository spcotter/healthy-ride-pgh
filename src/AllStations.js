import React from 'react';
import Layout from './Layout';

import StationList from './StationList';
import RideMap from './RideMap';

export default props => {
  if(props.loading) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <i className="fas fa-bicycle fa-spin fa-3x"/>
      </div>
    );
  }

  return (
    <Layout
      left = {
        <RideMap {...props}/>
      }
      right={
        <StationList
          {...props}
        />
      }
    />
  );
}
