import React from 'react';
import Layout from './Layout';

import StationList from './StationList';
import RideMap from './RideMap';

export default props => {
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
