import React from 'react';

import SearchBar from './search-bar';
import Tree from './tree';

export default class TreeSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchedValue: ''
    };
  }
  onSearchBarChange(value) {
    console.log(value);
    this.setState({
      searchedValue: value
    });
  }
  render() {
    const {
      searchBar: { hintText },
      tree: {
        defaultValue,
        dataSource,
        columns,
        valueColumn,
        expanded,
        singleSelectable,
        multiSelectable,
        checked,
        branchNodeSelectable,
        treeStyle,
        arrowIconStyle,
        singleSelectIconStyle,
        multiSelectIconStyle,
        nodeStyle,
        checkedColor,
        uncheckedColor
      }
    } = this.props;
    console.log('this.state.searchedValue===', this.state.searchedValue);
    return (
      <div>
        <SearchBar
          componentStyle={{
            margin: '10px 16px 18px'
          }}
          inputStyle={{}}
          hintText={hintText}
          hintStyle={{
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.38)'
          }}
          onSearchBarChange={this.onSearchBarChange.bind(this)}
        />
        <Tree
          defaultValue={defaultValue}
          dataSource={dataSource}
          columns={columns}
          valueColumn={valueColumn}
          expanded={expanded}
          singleSelectable={singleSelectable}
          multiSelectable={multiSelectable}
          checked={checked}
          searchable={true}
          searchedText={this.state.searchedValue}
          // searchedText={this.state.searchedValue}
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
      </div>
    );
  }
}
