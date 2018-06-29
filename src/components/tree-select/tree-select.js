import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from '../search-bar';
import Tree from './tree';

/**
 * Tree with a search bar, which can be single/multiple selected.
 *
 * @export TreeSelect
 * @class TreeSelect
 * @extends {React.Component}
 */
export default class TreeSelect extends React.Component {
  state = {
    searchedValue: ''
  };

  static defaultProps = {
    className: 'fms-tree-select',
    searchBar: {},
    tree: {}
  };

  /**
   * When search text changed, set the search text to state.
   * @param {string} value searching text
   * @memberof TreeSelect
   */
  onSearchBarChange = value => {
    this.setState({
      searchedValue: value
    });
  };

  render() {
    const { className, searchBar, tree, afterSelect } = this.props;
    return (
      <div className={className}>
        <SearchBar onSearchBarChange={this.onSearchBarChange} {...searchBar} />
        <div className={`${className}__select-title`}>
          <p>Select</p>
        </div>
        <Tree searchedText={this.state.searchedValue} afterSelect={afterSelect} {...tree} />
      </div>
    );
  }
}

TreeSelect.propTypes = {
  className: PropTypes.string,
  searchBar: PropTypes.shape({
    hintText: PropTypes.string,
    componentStyle: PropTypes.object,
    textFieldStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintStyle: PropTypes.object
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
    uncheckedColor: PropTypes.string
  }),
  afterSelect: PropTypes.func.isRequired
};
