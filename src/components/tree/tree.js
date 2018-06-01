import React from 'react';
import PropTypes from 'prop-types';

import TreeNode from './tree-node';

// import './tree.css';

export default class Tree extends React.Component {
  static defaultProps = {
    className: 'tree-container',
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

  constructor(props) {
    super(props);
    this.state = {
      treeNodeList: [],
      defaultSelectNodeList: [],
      selectedNodeDataList: [],
      isFirstTimeRender: true,
    };
  }

  componentDidMount() {
    const { defaultSelectNodeList } = this.state;
    const treeNodeList = this.setFinalTreeNodeList(this.props, defaultSelectNodeList);

    this.setSelectDataToState(treeNodeList);

    this.setState({
      defaultSelectNodeList,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchedText !== this.props.searchedText) {
      const treeNodeList = this.setFinalTreeNodeList(nextProps, this.state.treeNodeList);
      this.setSelectDataToState(treeNodeList);
    }
  }

  setSelectDataToState(treeNodeList) {
    if (this.props.afterSelect) {
      const selectedNodeDataList = this.getSelectData(treeNodeList);
      this.props.afterSelect(selectedNodeDataList);
      this.setState({
        selectedNodeDataList,
      });
    }
  }

  setFinalTreeNodeList(props, defaultSelectNodeList) {
    const treeNodeList = [];
    const { defaultValue, dataSource, columns, valueColumn, searchedText } = props;
    this.generateTreeNodeList(searchedText, dataSource, columns, treeNodeList);
    treeNodeList.map((item, index) => {
      if (item === null || item === undefined) {
        treeNodeList.splice(index, 1);
        return null;
      }
      // set default value
      const itemValue = item.data[valueColumn];
      this.state.isFirstTimeRender && defaultValue && defaultValue.map(defaultValueItem => {
        if (itemValue === defaultValueItem) {
          item.checked = true;
          defaultSelectNodeList && defaultSelectNodeList.push(item.index);
        }
        return true;
      });

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
      isFirstTimeRender: false,
    });
    return treeNodeList;
  }

  generateTreeNodeList(
    searchedText,
    data,
    columns,
    treeNodeList,
    parentIndex = -1,
    parentTreeIndex = '',
    deepth = 1,
    parentExpanded = true,
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
        const childrenNodes = this.generateTreeNodeList(
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

  isHitSearch(data, searchedText, columns) {
    if (!searchedText) {
      return true;
    }
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      if (data[item.dataIndex] && data[item.dataIndex].toLowerCase().indexOf(searchedText.toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
  }

  updateTreeExpanded(index) {
    const treeNodeList = this.state.treeNodeList;
    const clickedTreeNode = treeNodeList[index];
    const expanded = !clickedTreeNode.expanded;
    treeNodeList[index].expanded = expanded;
    if (!expanded) {
      this.setChildrenAttr(index, 'expanded', expanded, treeNodeList);
    }
    this.setState({
      treeNodeList
    });
  }

  onSelect(index, selected) {
    const { treeNodeList } = this.state;
    const { singleSelectable, multiSelectable, afterSelect, parentRelated } = this.props;

    if (multiSelectable) {
      treeNodeList[index].checked = selected;
      if (parentRelated) {
        this.resetAttr('halfChecked', false, treeNodeList);
        this.setChildrenAttr(index, 'checked', selected, treeNodeList);
        this.setParentChecked(index, 'checked', selected, treeNodeList);
      }

    } else if (singleSelectable) {
      this.resetAttr('checked', false, treeNodeList);
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
  }

  resetAttr(attrName, attrValue, treeNodeList) {
    treeNodeList.map(item => {
      item[attrName] = attrValue;
      return true;
    });
  }

  setChildrenAttr(index, attrName, attrValue, treeNodeList) {
    const children = treeNodeList[index].children;
    children &&
      children.map(item => {
        if (!item) {
          return false;
        }
        treeNodeList[item][attrName] = attrValue;
        treeNodeList[item].halfChecked = false;
        this.setChildrenAttr(item, attrName, attrValue, treeNodeList);
        return treeNodeList;
      });
  }

  setParentChecked(index, attrName, attrValue, treeNodeList) {
    const parentIndex = treeNodeList[index].parent;
    if (parentIndex === -1) {
      return true;
    }
    treeNodeList[parentIndex][attrName] = attrValue;
    const parent = treeNodeList[parentIndex];
    const childrenForParent = parent.children;
    const isAllChildrenCheckedBool = this.isAllChildrenChecked(childrenForParent, treeNodeList);
    treeNodeList[parentIndex][attrName] = isAllChildrenCheckedBool;
    if (!isAllChildrenCheckedBool) {
      treeNodeList[parentIndex].halfChecked = true;
    }
    // set parent's parent
    this.setParentChecked(parentIndex, attrName, attrValue, treeNodeList);
  }

  isAllChildrenChecked(children, treeNodeList) {
    for (let i = 0; i < children.length; i++) {
      const childItem = treeNodeList[children[i]];
      if (!childItem.checked) {
        return false;
      }
      const childrenForChild = childItem.children;
      childrenForChild && childrenForChild.length > 0 && this.isAllChildrenChecked(childrenForChild, treeNodeList);
    }
    return true;
  }

  getSelectData(treeNodeList) {
    const finalList = [];
    treeNodeList.map(item => {
      if (item.checked) {
        const nodeData = item.data;
        const finalData = Object.assign({}, nodeData);
        delete finalData.children;
        finalList.push(finalData)
      }
      return true;
    });
    return finalList;
  }

  getTreeNodeById(id, treeNodeList) {
    for (let i = 0; i < treeNodeList.length; i++) {
      const item = treeNodeList[i];
      if (item.data.id === id) {
        return item;
      }
    }
    return null;
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
    this.state.treeNodeList.map((item, itemIndex) => {
      content.push(
        <TreeNode
          key={item.key}
          data={item.data}
          columns={columns}
          index={itemIndex}
          treeIndex={item.treeIndex}
          deepth={item.deepth}
          children={item.children}
          isLeaf={item.isLeaf}
          className={`parent${item.treeIndex}`}
          arrowIconStyle={arrowIconStyle}
          nodeStyle={nodeStyle}
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
          updateTreeExpanded={this.updateTreeExpanded.bind(this)}
          onSelect={this.onSelect.bind(this)}
        />
      );
      return content;
    });
    return content;
  }
  render() {
    const { className, treeStyle } = this.props;
    return (
      <table className={className} style={treeStyle} key="top">
        <tbody>{this.renderData()}</tbody>
      </table>
    );
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
