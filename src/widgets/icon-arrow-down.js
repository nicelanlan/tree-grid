import React from 'react';
import ActionArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

const IconArrowDown = ({style={width: 20}}) => (
  <ActionArrowDown style={{...style, verticalAlign: 'middle'}} />
);

export default IconArrowDown;