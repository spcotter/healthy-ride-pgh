import React, { Component } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import * as d3 from 'd3';


import AllStations from './AllStations';
import SingleStation from './SingleStation';
import { commas } from './format';

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
    const {overallTotal} = this.state;
    return (

      <div>
        <Grid fluid>
          <Row>
            <Col sm={6}>
              <h2>Healthy Ride</h2>
            </Col>
            <Col sm={6} style={{ textAlign: 'right' }}>
              <h2>
                <small>{ commas(overallTotal) } rides</small>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <small>May 31, 2015 - June 30, 2018</small>
            </Col>
            <Col sm={6}></Col>
          </Row>

          <h2 style={{ margin: 0 }}>
            <small className="pull-right">{ commas(overallTotal) } rides</small>
            Healthy Ride
          </h2>
          <div>
            <div className="pull-right">
              <div className="clearfix" style={{ marginBottom: 5, fontSize: 10, lineHeight: '10px', position: 'relative' }}>
                <div className="pull-left" style={{ width: 10, height: 10, backgroundColor: '#3C8AF1' }}/>
                <div>&nbsp;Returned to same station</div>
              </div>
              <div className="clearfix" style={{ marginBottom: 5, fontSize: 10, lineHeight: '10px', position: 'relative' }}>
                <div className="pull-left" style={{ width: 10, height: 10, backgroundColor: '#9EC6FB' }}/>
                <div>&nbsp;Returned to another station</div>
              </div>
            </div>

          </div>
        </Grid>
      <div style={{ position: 'absolute', top: 80, bottom: 0, right: 0, left: 0, borderTop: '1px solid whitesmoke' }}>
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
      </div>
    );
  }
}

export default App;
