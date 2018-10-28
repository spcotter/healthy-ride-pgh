import React, { Component } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import * as d3 from 'd3';

import AppNav from './AppNav';
import AllStations from './AllStations';
import SingleStation from './SingleStation';
// import RideMap from './RideMap';

import history from './history';

class App extends Component {
  state = {
    loading: true,
    fromToData: null,
    stationTotals: null,
    stations: null,
    locations: null,
    overallTotal: null,
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
      const { stationTotals } = this.state
      stations = stations.sort((a,b) => {
        return d3.descending(stationTotals[a.number], stationTotals[b.number])
      });

      const locations = {};
      stations.forEach(s => {
        locations[s.number] = [s.latitude, s.longitude];
      });

      this.setState({ stations, locations });
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


  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route
              exact
              path="/"
              component={props => (
                <AllStations {...this.state}/>
              )}
            />
            <Route
              exact
              path="/:stationNumber"
              component={props => {
                  const params = {...this.state, ...props};
                  return (
                    <SingleStation {...params}/>
                  );
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
