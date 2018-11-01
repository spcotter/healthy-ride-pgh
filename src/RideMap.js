import React from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import { Map, TileLayer, CircleMarker, Circle, Polyline } from 'react-leaflet'
import history from './history';

class RideMap extends React.Component {
  onClick = fromStation => {
    history.push(`/${ fromStation }`)
  }

  render(){
    const { fromToData, stationTotals, stations, locations, loading, clusters, clustersK, onChangeClustersK } = this.props;

    if(loading) {
      return <div/>
    }
    // const bounds = this.bounds(stations);
    const bounds = new L.LatLngBounds(
      stations.map(s => [s.latitude, s.longitude])
    );


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
    const opacityScale = d3.scalePow(0.5).domain(extent).range([0.01, 1]);
    const widthScale = d3.scaleLog().domain(extent).range([0.01, 3]);
    const maxStationRides = stationTotals[stations[0].number];
    const radiusScale = d3.scalePow(0.5).domain([0, maxStationRides]).range([2, 12]);

    const toDiffPlace = lineData.filter(r => r.to !== r.from)
    const toSamePlace = lineData.filter(r => r.to === r.from)

    return (
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        <Map
          bounds={bounds}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          zoomControl={false}
        >

          <TileLayer
            attribution="&copy; <a href='http/://cartodb.com/attributions'>CartoDB</a>"
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
            subdomains="abcd"
            opacity={0.35}
          />
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toposm-color-relief/{z}/{x}/{y}.jpg"
            maxZoom={19}
            maxNativeZoom={12}
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
                  radius={radiusScale(stationTotals[l.from])}
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
                    radius={radiusScale(stationTotals[s.number])}
                    width={5}
                    color="transparent"
                    fillOpacity={0}
                    fillColor="#ffffff"
                    onClick={() => this.onClick(s.number)}
                  />
              ))
            }

            {
              stations.map((s,i) => (
                  <CircleMarker
                    key={`CircleCenter-${s.number}`}
                    center={[s.latitude, s.longitude]}
                    // radius={5}
                    radius={radiusScale(stationTotals[s.number])}
                    width={5}
                    opacity={0}
                    color="transparent"
                    fillOpacity={clustersK ? 0.7 : 0.25}
                    fillColor={ clustersK ? d3.schemeCategory10[clusters[s.number][clustersK]] : '#0462e2' }
                    onClick={() => this.onClick(s.number)}
                  />
              ))
            }


        </Map>
        <div style={{ position: 'absolute', top: 15, right: 15, width: 100, zIndex: 1000 }}>
            <select className="form-control input-sm" value={clustersK} onChange={onChangeClustersK}>
              <option value="">None</option>
              <option value="c2">2 Clusters</option>
              <option value="c3">3 Clusters</option>
              <option value="c4">4 Clusters</option>
              <option value="c5">5 Clusters</option>
              <option value="c6">6 Clusters</option>
              {/* <option value="c7">7 Clusters</option> */}
              {/* <option value="c8">8 Clusters</option> */}
            </select>
        </div>
      </div>
    );
  }

}

export default RideMap;