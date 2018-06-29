import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import TreeNode from './tree-node';

export default class Tree extends React.Component {
  state = {
    treeNodeList: [],
    defaultSelectedIndexList: [],
    selectedNodeDataList: [],
    isFirstTimeRender: true
  };

  static defaultProps = {
    className: 'fms-tree__tree-container',
    expanded: true,
    checked: false,
    singleSelectable: false,
    multiSelectable: false,
    searchable: false,
    branchNodeSelectable: false,
    parentRelated: false,
    valueColumn: 'id',
    nodeStyle: {},
    checkedColor: '#ee0000',
    uncheckedColor: '#999999'
  };

  componentWillMount() {
    const { defaultSelectedIndexList } = this.state;
    const treeNodeList = this.setFinalTreeNodeListToState(this.props, defaultSelectedIndexList);

    this.setSelectDataToState(treeNodeList);
    if (this.props.parentRelated) {
      this.setDefaultHalfCheckedNodes(defaultSelectedIndexList, treeNodeList);
    }

    this.setState({
      defaultSelectedIndexList
    });
  }

  renderData() {
    const {
      nodeStyle,
      arrowIconStyle,
      columns,
      singleSelectable,
      multiSelectable,
      singleSelectIconStyle,
      multiSelectIconStyle,
      checkedColor,
      uncheckedColor
    } = this.props;
    const content = [];
    this.state.treeNodeList.map((item, itemIndex) =>
      content.push(
        <TreeNode
          key={item.key}
          data={item.data}
          columns={columns}
          index={itemIndex}
          treeIndex={item.treeIndex}
          deepth={item.deepth}
          isLeaf={item.isLeaf}
          arrowIconStyle={arrowIconStyle}
          nodeStyle={{ paddingLeft: 40, ...nodeStyle }}
          expanded={item.expanded}
          checked={item.checked}
          halfChecked={item.halfChecked}
          parentExpanded={item.parentExpanded}
          singleSelectable={singleSelectable}
          multiSelectable={multiSelectable}
          branchNodeSelectable={item.branchNodeSelectable}
          singleSelectIconStyle={singleSelectIconStyle}
          multiSelectIconStyle={multiSelectIconStyle}
          checkedColor={checkedColor}
          uncheckedColor={uncheckedColor}
          updateTreeExpanded={this.updateTreeExpanded}
          onSelect={this.onSelect}
        />
      )
    );
    return content;
  }

  /**
   * return the table header elements.
   *
   * @returns Elements with table header
   * @memberof Tree
   */
  renderTableHeader() {
    return this.props.columns.map((item, index) => <th key={`th${index}`}>{item.text}</th>);
  }

  render() {
    const { className, treeStyle, singleSelectable, multiSelectable } = this.props;
    return (
      <table className={className} style={treeStyle} key="top">
        {!singleSelectable &&
          !multiSelectable && (
            <thead>
              <tr>
                <th />
                {this.renderTableHeader()}
              </tr>
            </thead>
          )}
        <tbody>{this.renderData()}</tbody>
      </table>
    );
  }

  /**
   * Rerender components when props(searchText, dataSource, expanded) changed
   *
   * @param {any} nextProps
   * @memberof Tree
   */
  componentWillReceiveProps(nextProps) {
    let treeNodeList = this.state.treeNodeList;
    const defaultSelectedIndexList = this.state.defaultSelectedIndexList;
    // search text changed or datasource changed
    if (
      nextProps.searchedText !== this.props.searchedText ||
      !R.equals(nextProps.dataSource, this.props.dataSource)
    ) {
      treeNodeList = this.setFinalTreeNodeListToState(nextProps, defaultSelectedIndexList);
      // when search something on tree, should expand all nodes
      if (!nextProps.searchedText) {
        this.resetField('expanded', true, treeNodeList);
        this.resetField('parentExpanded', true, treeNodeList);
      }
      if (nextProps.parentRelated) {
        this.setDefaultHalfCheckedNodes(defaultSelectedIndexList, treeNodeList);
      }
      this.setSelectDataToState(treeNodeList);
    }
    // expanded props changed
    if (
      nextProps.expanded !== this.props.expanded ||
      nextProps.toggleExpanded !== this.props.toggleExpanded
    ) {
      this.resetField('expanded', nextProps.expanded, treeNodeList);
      this.resetField('parentExpanded', nextProps.expanded, treeNodeList);
      treeNodeList[0].parentExpanded = true;
      this.setSelectDataToState(treeNodeList);
    }
  }

  /**
   * Iterator the whole tree, add index of tree-node that with a checked radio button/checkbox to state[selectedNodeDataList]
   * @param {array} treeNodeList
   */
  setSelectDataToState(treeNodeList) {
    if (this.props.afterSelect) {
      const selectedNodeDataList = this.getSelectData(treeNodeList);
      this.props.afterSelect(selectedNodeDataList);
      this.setState({
        selectedNodeDataList
      });
    }
  }

  /**
   * Set 'halfChecked' attribute of each tree-node before tree load
   *
   * @param {Array} defaultSelectedIndexList default value index
   * @param {*} treeNodeList
   * @memberof Tree
   */
  setDefaultHalfCheckedNodes(defaultSelectedIndexList, treeNodeList) {
    if (defaultSelectedIndexList && defaultSelectedIndexList.length > 0) {
      defaultSelectedIndexList.forEach(item => {
        this.setCheckValueWhenParentRelated(item, true, treeNodeList);
      });
    }
  }

  /**
   * Add default checked value and children before TreeNodeList sets to state
   * @param {object} props
   * @param {array} defaultSelectedIndexList
   */
  setFinalTreeNodeListToState(props, defaultSelectedIndexList) {
    const treeNodeList = [];
    const { defaultValue, dataSource, columns, valueColumn, searchedText } = props;
    this.generateTreeNodeList(searchedText, dataSource, columns, treeNodeList);
    treeNodeList.forEach((item, index) => {
      if (item === null || item === undefined) {
        treeNodeList.splice(index, 1);
        return null;
      }
      // set default value
      const itemValue = item.data[valueColumn];
      if (this.state.isFirstTimeRender && defaultValue) {
        defaultValue.forEach(defaultValueItem => {
          if (itemValue === defaultValueItem) {
            item.checked = true;
            defaultSelectedIndexList && defaultSelectedIndexList.push(item.index);
          }
        });
      }
      let hasChild = false;
      const childrenNodes = item.childrenNodes;
      if (childrenNodes && childrenNodes.length > 0) {
        item.children = childrenNodes.map(childItem => {
          hasChild = hasChild ? hasChild : childItem !== null;
          return childItem ? childItem.index : null;
        });
      }
      item.isLeaf = !hasChild;
      return treeNodeList;
    });
    this.setState({
      treeNodeList,
      isFirstTimeRender: false
    });
    return treeNodeList;
  }

  /**
   * Datasource is tree structure, convert to flat array structure
   * @param {string} searchedText
   * @param {array} data
   * @param {array} columns
   * @param {array} treeNodeList
   * @param {number} parentIndex
   * @param {string} parentTreeIndex
   * @param {number} deepth
   * @param {bool} parentExpanded
   */
  generateTreeNodeList(
    searchedText,
    data,
    columns,
    treeNodeList,
    parentIndex = -1,
    parentTreeIndex = '',
    deepth = 1,
    parentExpanded = true
  ) {
    return data.map((item, itemIndex) => {
      const originTreeNode = this.getTreeNodeById(item.id, this.state.treeNodeList);
      const isHitSearchBool = this.isHitSearch(item, searchedText, columns);
      const treeIndex = parentTreeIndex ? `${parentTreeIndex}-${itemIndex}` : itemIndex + '';
      const treeNode = {
        key: `treenode${deepth}${item.id || item.id}`,
        data: item,
        index: treeNodeList.length,
        parent: parentIndex,
        deepth: deepth,
        treeIndex,
        expanded: originTreeNode ? originTreeNode.expanded : this.props.expanded,
        checked: originTreeNode ? originTreeNode.checked : this.props.checked,
        halfChecked: originTreeNode ? originTreeNode.halfChecked : false,
        parentExpanded,
        branchNodeSelectable: this.props.branchNodeSelectable
      };
      if (isHitSearchBool) {
        // set the node to parent's node's childrenNodes
        if (parentIndex !== -1) {
          const childrenNodes = treeNodeList[parentIndex].childrenNodes || [];
          childrenNodes[childrenNodes.length] = treeNode;
          treeNodeList[parentIndex].childrenNodes = childrenNodes;
        }
        treeNodeList.push(treeNode);
      }
      if (item.children && item.children.length > 0) {
        this.generateTreeNodeList(
          searchedText,
          item.children,
          columns,
          treeNodeList,
          isHitSearchBool ? treeNode.index : parentIndex, // parentIndex
          isHitSearchBool ? treeIndex : parentTreeIndex, // parentTreeIndex
          isHitSearchBool ? deepth + 1 : deepth, // deepth
          originTreeNode ? originTreeNode.expanded : this.props.expanded
        );
        // treeNode.childrenNodes = childrenNodes;
      }
      return isHitSearchBool ? treeNode : null;
    });
  }

  /**
   * If the data's field has contain the searched text, return true, otherwise return false
   * @param {object} data
   * @param {string} searchedText
   * @param {array} columns
   * @returns {bool}
   */
  isHitSearch(data, searchedText, columns) {
    if (!searchedText) {
      return true;
    }
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      if (
        data[item.dataIndex] &&
        data[item.dataIndex].toLowerCase().indexOf(searchedText.toLowerCase()) !== -1
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Update the state[treeNodeList]'s field "expanded", contain it's children
   * @param {number} index
   */
  updateTreeExpanded = index => {
    const treeNodeList = this.state.treeNodeList;
    const clickedTreeNode = treeNodeList[index];
    const clickedTreeNodeParent = treeNodeList[clickedTreeNode.parent];
    const expanded = !clickedTreeNode.expanded;
    treeNodeList[index].expanded = expanded;
    treeNodeList[index].parentExpanded = clickedTreeNodeParent
      ? clickedTreeNodeParent.expanded
      : true;
    if (!expanded) {
      this.setChildrenField(index, 'expanded', expanded, treeNodeList);
    } else {
      this.resetChildrenField(
        'parentExpanded',
        expanded,
        treeNodeList[index].children,
        treeNodeList
      );
    }
    this.setState({
      treeNodeList
    });
  };

  /**
   * when check or uncheck a tree-node, update the state[treeNodeList]'s field "checked", contain it's parent and children
   * @param {number} index
   * @param {bool} selected
   */
  onSelect = (index, selected) => {
    const { treeNodeList } = this.state;
    const { singleSelectable, multiSelectable, afterSelect, parentRelated } = this.props;

    if (multiSelectable) {
      treeNodeList[index].checked = selected;
      if (parentRelated) {
        this.setCheckValueWhenParentRelated(index, selected, treeNodeList);
      }
    } else if (singleSelectable) {
      this.resetField('checked', false, treeNodeList);
      for (let i = 0; i < treeNodeList.length; i++) {
        if (i === index) {
          treeNodeList[i].checked = true;
          break;
        }
      }
    }
    const selectedNodeDataList = this.getSelectData(treeNodeList);
    this.setState({
      treeNodeList,
      selectedNodeDataList
    });
    afterSelect && afterSelect(selectedNodeDataList);
  };

  /**
   * Reset the attrName to attrValue of given treeNodeList
   * @param {string} attrName
   * @param {bool} attrValue
   * @param {array} treeNodeList
   */
  resetField(attrName, attrValue, treeNodeList) {
    treeNodeList.map(item => (item[attrName] = attrValue));
  }

  resetChildrenField(attrName, attrValue, children, treeNodeList) {
    if (children) {
      children.map(item => (treeNodeList[item][attrName] = attrValue));
    }
  }

  /**
   * Set object's children's field
   * @param {number} index
   * @param {string} attrName
   * @param {bool} attrValue
   * @param {array} treeNodeList
   */
  setChildrenField(index, attrName, attrValue, treeNodeList) {
    const children = treeNodeList[index].children;
    children &&
      children.map(item => {
        if (!item) {
          return false;
        }
        treeNodeList[item][attrName] = attrValue;
        treeNodeList[item].halfChecked = false;
        if (attrName === 'expanded') {
          treeNodeList[item].parentExpanded = attrValue;
        }
        this.setChildrenField(item, attrName, attrValue, treeNodeList);
        return treeNodeList;
      });
  }

  /**
   * Set object's parent's "checked" field
   * @param {number} index
   * @param {string} attrName
   * @param {bool} attrValue
   * @param {array} treeNodeList
   */
  setParentChecked(index, attrName, attrValue, treeNodeList) {
    const parentIndex = treeNodeList[index].parent;
    if (parentIndex === -1) {
      return true;
    }
    treeNodeList[parentIndex][attrName] = attrValue;
    const parent = treeNodeList[parentIndex];
    const childrenForParent = parent.children;
    const isAllChildrenCheckedBool = this.isAllChildrenChecked(parentIndex, childrenForParent, treeNodeList);
    treeNodeList[parentIndex][attrName] = isAllChildrenCheckedBool;
    // if (!isAllChildrenCheckedBool) {
    //   treeNodeList[parentIndex].halfChecked = true;
    // }
    // set parent's parent
    this.setParentChecked(parentIndex, attrName, attrValue, treeNodeList);
  }

  /**
   * If the whole children have been checked return true, otherwise return false
   * @param {array} children
   * @param {array} treeNodeList
   */
  isAllChildrenChecked(index, children, treeNodeList) {
    let hasOneChecked = false;
    let hasOneUnchecked = false;
    for (let i = 0; i < children.length; i++) {
      const childItem = treeNodeList[children[i]];
      // if (!childItem.checked) {
      //   return false;
      // }
      if (!hasOneChecked && childItem.checked) {
        hasOneChecked = true;
      }
      if (!hasOneUnchecked && !childItem.checked) {
        hasOneUnchecked = true;
      }
      const childrenForChild = childItem.children;
      if (childrenForChild && childrenForChild.length > 0) {
        let childrenChecked = this.isAllChildrenChecked(childItem.index, childrenForChild, treeNodeList);
        if (childrenChecked) {
          hasOneChecked = true;
        } else {
          hasOneUnchecked = true;
        }
      }
      if (hasOneChecked && hasOneUnchecked) {
        // treeNodeList[index].halfChecked = true;
        this.setHalfChecked(index, treeNodeList);
        return false;
      }
    }
    return hasOneUnchecked ? false : true;
  }

  setHalfChecked(index, treeNodeList) {
    treeNodeList[index].halfChecked = true;
    const parentIndex = treeNodeList[index].parent;
    if (parentIndex !== -1) {
      this.setHalfChecked(parentIndex, treeNodeList);
    }
  }

  /**
   * When props of 'parentRelated' is true, set parent's 'checked' and 'halfChecked' attribute
   *
   * @param {number} index tree node index
   * @param {boolean} selected has been checked, true|false
   * @param {Array} treeNodeList
   * @memberof Tree
   */
  setCheckValueWhenParentRelated(index, selected, treeNodeList) {
    this.resetField('halfChecked', false, treeNodeList);
    this.setChildrenField(index, 'checked', selected, treeNodeList);
    this.setParentChecked(index, 'checked', selected, treeNodeList);
  }

  /**
   * Return the selected tree-node's data field
   * @param {array} treeNodeList
   */
  getSelectData(treeNodeList) {
    const finalList = [];
    treeNodeList.map(item => {
      if (item.checked) {
        const nodeData = item.data;
        const finalData = Object.assign({}, nodeData);
        delete finalData.children;
        finalList.push(finalData);
      }
      return true;
    });
    return finalList;
  }

  /**
   * Return the tree-node item by the given id.
   * @param {number} id
   * @param {array} treeNodeList
   */
  getTreeNodeById(id, treeNodeList) {
    for (let i = 0; i < treeNodeList.length; i++) {
      const item = treeNodeList[i];
      if (item.data.id === id) {
        return item;
      }
    }
    return null;
  }
}

Tree.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.any,
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  valueColumn: PropTypes.string,
  expanded: PropTypes.bool,
  checked: PropTypes.bool,
  singleSelectable: PropTypes.bool,
  multiSelectable: PropTypes.bool,
  searchable: PropTypes.bool,
  searchedText: PropTypes.string,
  branchNodeSelectable: PropTypes.bool,
  parentRelated: PropTypes.bool,
  treeStyle: PropTypes.object,
  arrowIconStyle: PropTypes.object,
  singleSelectIconStyle: PropTypes.object,
  multiSelectIconStyle: PropTypes.object,
  nodeStyle: PropTypes.object,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string
};
