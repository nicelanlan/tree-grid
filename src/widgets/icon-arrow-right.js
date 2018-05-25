import React from 'react';
import ActionArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

const IconArrowRight = ({style={width: 20}}) => (
    <ActionArrowRight style={{...style, verticalAlign: 'middle'}} />
);

export default IconArrowRight;