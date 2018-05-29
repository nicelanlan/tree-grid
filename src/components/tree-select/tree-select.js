import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from '../search-bar';
import Tree from '../tree';

export default class TreeSelect extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchedValue: '',
    };
  }

  onSearchBarChange(value) {
    this.setState({
      searchedValue: value
    });
  }

  render() {
    const {
      searchBar: { hintText, componentStyle, textFieldStyle, inputStyle, hintStyle },
      tree: {
        className,
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
      },
      afterSelect
    } = this.props;
    console.log('this.state.searchedValue===', this.state.searchedValue);
    return (
      <div>
        <SearchBar
          componentStyle={componentStyle}
          inputStyle={inputStyle}
          hintText={hintText}
          hintStyle={hintStyle}
          textFieldStyle={textFieldStyle}
          onSearchBarChange={this.onSearchBarChange.bind(this)}
        />
        <Tree
          className={className}
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
          branchNodeSelectable={branchNodeSelectable}
          treeStyle={treeStyle}
          arrowIconStyle={arrowIconStyle}
          singleSelectIconStyle={singleSelectIconStyle}
          multiSelectIconStyle={multiSelectIconStyle}
          nodeStyle={nodeStyle}
          checkedColor={checkedColor}
          uncheckedColor={uncheckedColor}
          afterSelect={afterSelect}
        />
      </div>
    );
  }
}

TreeSelect.propTypes = {
  searchBar: PropTypes.shape({
    hintText: PropTypes.string,
    componentStyle: PropTypes.object,
    textFieldStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintStyle: PropTypes.object,
  }),
  tree: PropTypes.shape({
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    valueColumn: PropTypes.string,
    expanded: PropTypes.bool,
    checked: PropTypes.bool,
    singleSelectable: PropTypes.bool,
    multiSelectable: PropTypes.bool,
    branchNodeSelectable: PropTypes.bool,
    treeStyle: PropTypes.object,
    arrowIconStyle: PropTypes.object,
    singleSelectIconStyle: PropTypes.object,
    multiSelectIconStyle: PropTypes.object,
    nodeStyle: PropTypes.object,
    checkedColor: PropTypes.string,
    uncheckedColor: PropTypes.string,
  }),
  afterSelect: PropTypes.func.isRequired,
};