import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// import TreePage from './pages/tree';

import RangePickerPage from './pages/range-picker';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <RangePickerPage />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
