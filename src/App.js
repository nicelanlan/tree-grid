import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';
import TreeSelect from './tree-select';
import { multipleDataList } from './data/multiple';

class App extends Component {
  componentDidMount() {}
  searchFn(value) {
    console.log(value);
  }
  render() {
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
    const searchBar = {
      componentStyle: {
        margin: '10px 16px 18px'
      },
      inputStyle: {},
      hintText: 'search',
      hintStyle: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.38)'
      },
      searchFn: this.searchFn
    };
    const treeProps = {
      defaultValue: [3,4],
      dataSource: multipleDataList,
      columns: columns2,
      valueColumn: 'id',
      expanded: true,
      singleSelectable: true,
      multiSelectable: true,
      checked: false,
      branchNodeSelectable: true,
      treeStyle: {
        margin: '0 16px'
      },
      arrowIconStyle: {
        marginRight: 0,
        height: 24,
        width: 24
      },
      singleSelectIconStyle: {},
      multiSelectIconStyle: {},
      nodeStyle: {
        paddingLeft: 40,
        nodeHeight: 40,
        fontSize: 16
      },
      checkedColor: '#ee0000',
      uncheckedColor: '#999999'
    };
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <TreeSelect
            searchBar={searchBar}
            tree={treeProps}
          />
          {/* <SearchBar
            componentStyle={{
              margin: '10px 16px 18px'
            }}
            inputStyle={{}}
            hintText={'search'}
            hintStyle={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.38)'
            }}
            searchFn={this.searchFn}
          /> */}
          {/* <Tree
            defaultValue={[3, 4]}
            dataSource={multipleDataList}
            columns={columns2}
            valueColumn={'id'}
            expanded={true}
            singleSelectable={true}
            // multiSelectable={true}
            // checked={true}
            searchable={true}
            searchedText={'s'}
            branchNodeSelectable={true}
            treeStyle={{}}
            arrowIconStyle={{
              marginRight: 0,
              height: 24,
              width: 24
            }}
            singleSelectIconStyle={{}}
            multiSelectIconStyle={{}}
            nodeStyle={{
              paddingLeft: 40,
              nodeHeight: 40,
              fontSize: 16
            }}
            checkedColor={'#ee0000'}
            uncheckedColor={'#999999'}
            // multiSelectIconColor={'#ee0000'}
          /> */}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
