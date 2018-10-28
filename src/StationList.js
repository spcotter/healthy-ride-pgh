import React from 'react';
import * as d3 from 'd3';
import {Link} from 'react-router-dom';

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

            const w = percent( n / max );
            const sameWidth = percent(same / n);
            const diffWidth = percent((n - same) / n);

            return (
              <Link style={{ textDecoration: 'none' }} to={`/${s.number}`} key={s.number} >
                <div style={styles.listItem}>
                  <div style={styles.nameWrapper}>
                    <div style={styles.name}>{s.name}</div>
                    <div style={styles.share}>{ percent(n / overallTotal) }</div>
                  </div>
                  <div style={styles.barWrapper}>
                    <div style={styles.number}>{ commas(n) }</div>
                    <div style={{...styles.bar, width: `calc(${w} - 40px)`}}>
                      <svg width="100%" height={10}>
                        <rect x={0} y={0} height={10} width={sameWidth} fill="#398BFB" />
                        <rect x={sameWidth} y={0} height={10} width={diffWidth} fill="#9cc5fd" />
                      </svg>
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
  share: {
    width: `40px`,
    height: 20,
    top: 0,
    right: 0,
    position: 'absolute',
    fontSize: 12,
    color: '#777',
    textAlign: 'right'
  },
  barWrapper: {
    height: 20, position: 'relative'
  },
  number: {
    fontSize: 12,
    color: 'black'
  },
  bar: {
    left: 40,
    top: 0,
    position: 'absolute',
    // backgroundColor: '#3388ff',
    height: 10
  }
};


export default StationList;