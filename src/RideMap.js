import React from 'react';
import * as d3 from 'd3';
import { Map, TileLayer, CircleMarker, Circle, Polyline } from 'react-leaflet'
import history from './history';

class RideMap extends React.Component {

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

  onClick = fromStation => {
    history.push(`/${ fromStation }`)
  }

  render(){
    const { fromToData, stationTotals, stations, locations, loading } = this.props;

    if(loading) {
      return <div>Loading...</div>;
    }
    const bounds = this.bounds(stations);


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

    const extent = d3.extent(lineData, d => d.percent);
    const opacityScale = d3.scalePow(0.5).domain(extent).range([0, 1]);
    const widthScale = d3.scaleLog().domain(extent).range([0.2, 4]);

    const toDiffPlace = lineData.filter(r => r.to !== r.from)
    const toSamePlace = lineData.filter(r => r.to === r.from)

    return (
      <Map
        bounds={bounds}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <TileLayer
          attribution="&copy; <a href='http/://cartodb.com/attributions'>CartoDB</a>"
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          subdomains="abcd"
          opacity={0.35}
        />

          {
            toDiffPlace.map((l,i) => (
              <Polyline
                positions={l.line}
                key={`Polyline-${i}`}
                weight={ widthScale(l.percent) }
                opacity={ opacityScale(l.percent) }
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
                weight={ widthScale(l.percent) }
                opacity={ opacityScale(l.percent) }
              />
            ))
          }

          {
            stations.map(s => (
                <CircleMarker
                  key={`CircleMarker-${s.number}`}
                  center={[s.latitude, s.longitude]}
                  radius={4}
                  color="transparent"
                  fillOpacity={0.5}
                  fillColor="#555555"
                  onClick={() => this.onClick(s.number)}
                  tabIndex={0}
                />
            ))
          }


      </Map>
    );
  }

}

export default RideMap;