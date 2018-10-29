import React from 'react';
import * as d3 from 'd3';
import {Link} from 'react-router-dom';

import SplitDataBar from './SplitDataBar';

const commas = d3.format(',.0f');
const percent = d3.format('.1%');

class StationList extends React.PureComponent {

  render(){

    const {
      loading,
      stations,
      stationTotals,
      overallTotal,
      fromToData,
    } = this.props;

    if(loading) {
      return <div/>;
    }

    const max = stationTotals[ stations[0].number ];

    return (
      <div>
        {
          stations.map(s => {
            const n = stationTotals[s.number];
            const same = fromToData.find(f => f.from === s.number && f.to === s.number).freq;

            const w = n / max;
            const sameWidth = same / n;
            const diffWidth = (n - same) / n;
            const scale = d3.scaleLinear()
            const widths = [ sameWidth, diffWidth ];

            return (
              <Link style={{ textDecoration: 'none' }} to={`/${s.number}`} key={s.number} >
                <div style={styles.listItem}>
                  <div style={styles.nameWrapper}>
                    <div style={styles.name}>{s.name}</div>
                  </div>
                  <div style={styles.barWrapper}>
                    <div style={styles.number}>
                      { commas(n) } rides, { percent(n / overallTotal) } of total
                    </div>
                    <div>
                      <SplitDataBar outerWidth={w} widths={widths} fills={['#398BFB', '#9cc5fd']}/>
                    </div>
                  </div>
                </div>
              </Link>
            )

          })
        }
      </div>
    );
  }

}


const styles = {
  listItem: {
    padding: 10,
    marginBottom: 5,
    paddingBottom: 20,
    borderBottom: '1px solid whitesmoke'
  },
  nameWrapper: {
    height: 20, position: 'relative'
  },
  name: {
    width: `calc(100% - 40px)`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: '#555'
  },
  barWrapper: {
    height: 20, position: 'relative'
  },
  number: {
    fontSize: 12,
    color: 'black'
  },

};


export default StationList;