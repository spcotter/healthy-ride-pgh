import React from 'react';
import { Navbar } from 'react-bootstrap';


class AppNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return (
      <Navbar staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home" onClick={e => e.preventDefault()}>Healthy Ride Pgh</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }

}

export default AppNav;