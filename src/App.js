import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';
import TreeSelect from './components/tree-select';
// import Tree from './components/tree';
import { multipleDataList } from './data/multiple';

class App extends Component {
  componentDidMount() {}
  afterSelect(value) {
    console.log('you select value is ', value);
  }
  render() {
    const columns = [
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
      textFieldStyle: {
        width: '100%',
      },
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
      className: 'tree-container',
      defaultValue: [3,4],
      dataSource: multipleDataList,
      columns: columns,
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
            afterSelect={this.afterSelect.bind(this)}
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
            className={'tree-container'}
            defaultValue={[3, 4]}
            dataSource={multipleDataList}
            columns={columns}
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
