import React from 'react';
import { storiesOf } from '@storybook/react';

import BasicTree from './basic-tree';

export default () => storiesOf('Tree Grid', module).add('Basic Tree', () => <BasicTree />);