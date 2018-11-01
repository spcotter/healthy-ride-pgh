import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import * as d3 from 'd3';


import AppLayout from './AppLayout';
import AllStations from './AllStations';
import SingleStation from './SingleStation';

import history from './history';

class App extends Component {
  state = {
    loading: true,
    fromToData: null,
    stationTotals: null,
    stations: null,
    locations: null,
    clusters: null,
    overallTotal: null,
    clustersK: 'c6',
  }


  componentDidMount = () => {
    this.loadRideData()
    .then(this.loadStationData)
    .then(this.loadClusterData)
    .then(this.categorizeStations)
    .finally(() => this.setState({loading: false}));
  }

  loadRideData = () => {
    return d3.csv('from_to_data.csv', d => {
      return { from: d.from, to: d.to, freq: +d.freq, duration: +d.duration_s / 60 };
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


  loadClusterData = () => {
    return d3.csv('clusters.csv')
      .then(clusterArray => {
        const clusters = {};
        clusterArray.forEach(c => clusters[c.station_number] = c);
        console.log('clusters', clusters);
        this.setState({ clusters });
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

  categorizeStations = () => {
    const { stations, fromToData, stationTotals } = this.state;
    stations.forEach(s => {
      const trips = fromToData.filter(t => t.from === s.number).sort((a,b) => d3.descending(a.freq,b.freq));
      s.category = trips[0].to === s.number ? 'Out-and-back' : 'Commuter';
      s.majority_return = s.category === 'Out-and-back' && trips[0].freq >= 0.5 * stationTotals[s.number];
      console.log(s.number, s.category, s.majority_return, trips[0].freq, stationTotals[s.number]);
    });

    console.log('stations', stations);
  }

  onChangeClustersK = e => {
    this.setState({ clustersK: e.target.value });
  }



  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route
            exact
            path="/"
            component={props => {
              const params = {...this.state, ...props, onChangeClustersK: this.onChangeClustersK};

              return (
                <AppLayout {...this.state}>
                  <AllStations {...params}/>
                </AppLayout>
              );
            }}
          />
          <Route
            exact
            path="/:stationNumber"
            component={props => {
                const params = {...this.state, ...props, onChangeClustersK: this.onChangeClustersK};

                return (
                <AppLayout {...this.state}>
                  <SingleStation {...params}/>
                </AppLayout>
              );
            }}
          />

        </Switch>
      </Router>
    );
  }
}

export default App;
