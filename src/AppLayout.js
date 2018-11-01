import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import { commas } from './format';


class AppNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }


  legendBox = (color, text) => {
    return (
      <div style={{ position: 'relative', textAlign: 'right' }}>
        <div className="clearfix" style={{ marginBottom: 5, fontSize: 10, lineHeight: '10px', position: 'relative' }}>
          <div className="pull-right" style={{ width: 10, height: 10, backgroundColor: color }}/>
          <div style={{ marginRight: 15, color: '#777'}}>{ text }</div>
        </div>
      </div>
    )
  }

  render(){
    const {overallTotal, children} = this.props;

    return (
      <div>
        <Grid fluid>
          <Row>
            <Col sm={6}>
              <Link to="/">
                <h2 style={{ marginBottom: 0 }}>Healthy Ride</h2>
              </Link>
            </Col>
            <Col sm={6} style={{ textAlign: 'right' }}>
              <h2 style={{ marginTop: 15, marginBottom: 5 }}>
                <small>{ commas(overallTotal) } rides</small>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <small>May 31, 2015 - June 30, 2018</small>
            </Col>
            <Col sm={6}>
                <div className="pull-right">
                  <div>{ this.legendBox('#3C8AF1', 'Returned to same station') }</div>
                  <div>{ this.legendBox('#9EC6FB', 'Returned to another station') }</div>
                </div>
            </Col>
          </Row>
        </Grid>
        <div style={{ position: 'absolute', top: 90, bottom: 0, right: 0, left: 0, borderTop: '1px solid whitesmoke' }}>
          { children }
        </div>
      </div>
    );
  }

}

export default AppNav;