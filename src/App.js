import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';
import Tree from './tree';
// import {singleDataList} from './data/single';
import { multipleDataList } from './data/multiple';

class App extends Component {
  componentDidMount() {}
  render() {
    // const columns1 = [
    //   {
    //     dataIndex: 'name',
    //     width: 100,
    //   },
    // ];
    const columns2 = [
      {
        dataIndex: 'name',
        width: 200
      },
      {
        dataIndex: 'desc',
        width: 200
      }
    ];
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          {/* <Tree 
            dataSource={singleDataList}
            columns={columns1}
            expanded={false}
            iconStyle={{
              marginRight: 10, 
              height: 24, 
              width: 24
            }}
            nodeStyle={{
              // marginLeft: 10, 
              nodeHeight: 40, 
              fontSize: 16, 
              }} /> */}

          <Tree
            dataSource={multipleDataList}
            columns={columns2}
            expanded={true}
            // singleSelectable={true}
            multiSelectable={true}
            // checked={true}
            treeStyle={{}}
            iconStyle={{
              marginRight: 0,
              height: 24,
              width: 24
            }}
            nodeStyle={{
              paddingLeft: 40,
              nodeHeight: 40,
              fontSize: 16
            }}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
