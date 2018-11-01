import React from 'react';
import * as d3 from 'd3';
import {Link} from 'react-router-dom';
import { Label } from 'react-bootstrap';

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
            const widths = [ sameWidth, diffWidth ];

            return (
              <div style={styles.listItem} key={s.number} >
                <div style={styles.nameWrapper}>
                  <Link to={`/${s.number}`} >
                  <div style={styles.name}>{s.name}</div>
                  </Link>
                </div>
                <div style={styles.barWrapper}>
                  <Label className="pull-right" style={styles.category}>
                    { s.category }
                  </Label>
                  <div style={styles.number}>
                    { commas(n) } rides, { percent(n / overallTotal) } of total
                  </div>
                  <div>
                    <SplitDataBar outerWidth={w} widths={widths} fills={['#398BFB', '#9cc5fd']}/>
                  </div>
                </div>
              </div>
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
  category: {
    color: '#337ab7',
    backgroundColor: 'whitesmoke'
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