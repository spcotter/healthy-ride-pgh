import React from 'react';

export default props => {
  return (
    <React.Fragment>
      <div style={styles.left}>
        {props.left}
      </div>
      <div style={styles.right}>
        {props.right}
      </div>
    </React.Fragment>
  )
}

const styles = {
  left: {
    top: 0,
    right: '40%',
    bottom: 0,
    left: 0,
    position: 'absolute'
  },
  right: {
    top: 0,
    right: 0,
    bottom: 0,
    left: '60%',
    position: 'absolute',
    overflowY: 'scroll'
  }
};
