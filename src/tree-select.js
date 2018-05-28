import React from 'react';

import SearchBar from './search-bar';

export default class TreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedValue: ''
    };
  }
  onSearchBarChange(value) {
    this.setState({
      searchedValue: value
    });
  }
  render() {
    const {
      searchBar: { hintText },
      tree: { defaultValue, dataSource, columns, valueColumn, expanded, singleSelectable, multiSelectable, checked, branchNodeSelectable,treeStyle, arrowIconStyle,singleSelectIconStyle,multiSelectIconStyle,nodeStyle,checkedColor,uncheckedColor}
    } = this.props;
    <div>
      <SearchBar
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
        onSearchBarChange={this.onSearchBarChange}
      />
      <Tree
        defaultValue={defaultValue}
        dataSource={dataSource}
        columns={columns}
        valueColumn={valueColumn}
        expanded={expanded}
        singleSelectable={true}
        multiSelectable={true}
        checked={true}
        searchable={true}
        searchedText={this.state.searchedValue}
        branchNodeSelectable={branchNodeSelectable}
        treeStyle={treeStyle}
        arrowIconStyle={arrowIconStyle}
        singleSelectIconStyle={singleSelectIconStyle}
        multiSelectIconStyle={multiSelectIconStyle}
        nodeStyle={nodeStyle}
        checkedColor={checkedColor}
        uncheckedColor={uncheckedColor}
        // multiSelectIconColor={'#ee0000'}
      />
    </div>;
  }
}
