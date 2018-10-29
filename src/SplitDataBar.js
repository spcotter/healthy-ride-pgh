import React from 'react';
import { percent } from './format';
import './SplitDataBar.css';

export default props => {
  const height = props.height || 10;
  const fills = props.fills || [];
  const widths = props.widths || [];
  const outerWidth = props.outerWidth || widths.reduce((a,b) => a + b, 0);

  let aggregator = 0;

  return (
    <div className="SplitDataBar">
      <svg width={percent(outerWidth)} height={height}>
      {
        widths.map((w,i) => {
          const x = aggregator;
          aggregator += w;

          return (
            <rect x={ percent(x) } y={ 0 } height={ height } width={ percent(w) } fill={ fills[i] } key={ i } />
          );
        })
      }
        {/* <rect x={0} y={0} height={height} width={sameWidth} fill="#398BFB" /> */}
        {/* <rect x={sameWidth} y={0} height={10} width={diffWidth} fill="#9cc5fd" /> */}
      </svg>
    </div>
  )
}
