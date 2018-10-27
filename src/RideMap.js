import React from 'react';
import * as d3 from 'd3';
import { Grid, Row, Col } from 'react-bootstrap';
import { Map, TileLayer, CircleMarker, Circle, Polyline } from 'react-leaflet'
import './RideMap.css';

class RideMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      fromToData: null,
      stationTotals: null,
      stations: null,
      locations: null,
      bounds: null,
    };
  }

  componentDidMount = () => {
    this.loadRideData()
    .then(this.loadStationData)
    .finally(() => this.setState({loading: false}));
  }

  loadRideData = () => {
    return d3.csv('from_to_data.csv', d => {
      return { from: d['From.station.id'], to: d['To.station.id'], freq: +d['Freq'] };
    })
    .then(fromToData => {
      const totals = this.totals(fromToData);
      this.setState({
        fromToData: fromToData.filter(f => f.freq > 0),
        stationTotals: totals.byStation,
        overallTotal: totals.overall,
      });
    });
  }

  loadStationData = () => {
    return d3.csv('healthyridestations2017.csv', d => {
      return {
        number: d['Station #'],
        name: d['Station Name'],
        racks: +d['# of Racks'],
        latitude: +d['Latitude'],
        longitude: +d['Longitude']
      };
    })
    .then(stations => {
      const bounds = this.bounds(stations);

      const { stationTotals } = this.state
      stations = stations.sort((a,b) => {
        return d3.descending(stationTotals[a.number], stationTotals[b.number])
      });

      const locations = {};
      stations.forEach(s => {
        locations[s.number] = [s.latitude, s.longitude];
      });

      this.setState({ stations, bounds, locations });
    });
  }

  totals = fromToData => {
    let overall = 0;
    const byStation = {};
    fromToData.forEach(d => {
      let s = byStation[d.from] || 0;
      s += d.freq;
      overall += d.freq;
      byStation[d.from] = s;
    });
    return { byStation, overall };
  }

  bounds = stations => {
    let bottomLeft = [0, 0];
    let topRight = [0, 0];
    stations.forEach(s => {
      bottomLeft = [
        Math.min(s.latitude, bottomLeft[0] || s.latitude),
        Math.min(s.longitude, bottomLeft[1] || s.longitude)
      ];
      topRight = [
        Math.max(s.latitude, topRight[0] || s.latitude),
        Math.max(s.longitude, topRight[1] || s.longitude)
      ];
    });
    return [bottomLeft, topRight];
  }

  render(){
    const { fromToData, stationTotals, stations, locations, bounds } = this.state;
    if(!bounds) {
      return <div>Loading...</div>;
    }

    console.log('fromToData', fromToData);

    const max = stationTotals[ stations[0].number ];

    const lineData = fromToData.filter(r => (
      locations[r.from] && locations[r.to]
    ))
    .map(r => {
      return {
        from: r.from,
        to: r.to,
        line: [ locations[r.from] , locations[r.to] ],
        percent: r.freq / stationTotals[r.from],
      }
    });

    const toDiffPlace = lineData.filter(r => r.to !== r.from)
    const toSamePlace = lineData.filter(r => r.to === r.from)

    // const position = [40.44750354615384, -79.96693514153846];
    return (
      <div>
        <div style={{ top: 0, right: '40%', bottom: 0, left: 0, position: 'absolute' }}>
          <Map
            bounds={bounds}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <TileLayer
              attribution="&copy; <a href='http/://cartodb.com/attributions'>CartoDB</a>"
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
              subdomains="abcd"
              opacity={0.5}
            />

              {
                toDiffPlace.map((l,i) => (
                  <Polyline
                    positions={l.line}
                    key={`Polyline-${i}`}
                    weight={Math.round(10 * l.percent)}
                    opacity={Math.min( 3 * l.percent, 1)}
                  />
                ))
              }

              {
                toSamePlace.map((l,i) => (
                  <CircleMarker
                    center={l.line[0]}
                    key={`Circle-${i}`}
                    fillOpacity={0}
                    radius={10}
                    weight={Math.round(10 * l.percent)}
                    opacity={Math.min( 3 * l.percent, 1)}
                  />
                ))
              }

              {
                stations.map(s => (
                  <CircleMarker
                    key={`CircleMarker-${s.number}`}
                    center={[s.latitude, s.longitude]}
                    radius={2}
                    stroke={false}
                    fillOpacity={1}
                    fillColor="#555555"
                  />
                ))
              }


          </Map>
        </div>
        <div style={{ top: 0, right: 0, bottom: 0, left: '60%', position: 'absolute', overflowY: 'scroll' }}>
            <div style={{ padding: 15 }}>
          {
            stations.map(s => {
              const n = stationTotals[s.number] ;
              const w = `${( n / max ) * 100}%`;
              return (
                <div key={s.number}>
                  <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{s.name}</div>
                  <div style={{ height: 20, position: 'relative' }}>
                    <div style={{ fontSize: 12 }}>{ stationTotals[s.number] }</div>
                    <div style={{ width: `calc(${w} - 40px)`, left: 40, top: 3, position: 'absolute', backgroundColor: '#3388ff', height: 10 }}/>
                  </div>
                </div>
              )

            })
          }
          </div>
        </div>
      </div>
    );
  }

}

export default RideMap;