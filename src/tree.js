import React from "react";
import PropTypes from "prop-types";

import TreeNode from "./tree-node";

import "./tree.css";

export default class Tree extends React.Component {
  static defaultProps = {
    expanded: false,
    singleSelectable: false,
    multiSelectable: false,
    searchable: false,
    branchNodeSelectable: false,
    checked: false,
    valueColumn: 'id',
  };

  constructor(props) {
    super(props);
    this.state = {
      treeNodeList: [],
    };
  }

  componentDidMount() {
    const { defaultValue, dataSource, columns, valueColumn } = this.props;
    const treeNodeList = [];
    this.generateTreeNodeList(dataSource, columns, treeNodeList);
    treeNodeList.map((item, index) => {
      if (item === null || item === undefined) {
        treeNodeList.splice(index, 1);
        return null;
      }
      // set default value
      const itemValue = item.data[valueColumn];
      defaultValue.map(defaultValueItem => {
        if (itemValue === defaultValueItem) {
          item.checked = true;
        }
        return true;
      });
      
      const childrenNodes = item.childrenNodes;
      if (childrenNodes) {
        item.children = childrenNodes.map(childItem => {
          return childItem.index;
        });
      }
      return treeNodeList;
    });
    this.setState({
      treeNodeList: treeNodeList,
    });
  }

  generateTreeNodeList(
    data,
    columns,
    treeNodeList,
    parentIndex = -1,
    parentTreeIndex = "",
    deepth = 1,
    parentExpanded = true
  ) {
    return data.map((item, itemIndex) => {
      const isHitSearchBool = this.isHitSearch(item);
      const children = this.getChildrenBySearchText(item);
      console.log(itemIndex, children);
      const treeIndex = parentTreeIndex ? `${parentTreeIndex}-${itemIndex}` : itemIndex + "";
      const treeNode = {
        key: `treenode${deepth}${item.key || item.id}`,
        data: item,
        index: treeNodeList.length,
        parent: parentIndex,
        deepth: deepth,
        treeIndex,
        children: children,
        isLeaf: children && children.length === 0,
        expanded: this.props.expanded,
        checked: this.props.checked,
        halfChecked: false,
        parentExpanded,
        branchNodeSelectable: this.props.branchNodeSelectable,
      };
      console.log(treeNode);
      if (isHitSearchBool) {
        treeNodeList.push(treeNode);
      }
      if (children) {
        const childrenNodes = this.generateTreeNodeList(
          children,
          columns,
          treeNodeList,
          treeNode.index,
          treeIndex,
          deepth + 1,
          this.props.expanded
        );
        treeNode.childrenNodes = childrenNodes;
      }
      return isHitSearchBool ? treeNode : null;
    });
  }

  getChildrenBySearchText(data) {
    const { searchedText, columns } = this.props;
    const childrenList = [];
    if (!data || !data.children || data.children.length === 0) {
      return childrenList;
    }
    if (!searchedText) {
      return data.children;
    }
    data.children.map(dataItem => {
      for (let i = 0; i < columns.length; i++) {
        const item = columns[i];
        if (
          dataItem[item.dataIndex] &&
          dataItem[item.dataIndex].toLowerCase().indexOf(searchedText.toLowerCase()) !== -1
        ) {
          childrenList.push(dataItem);
          return true;
        }
      }
      return childrenList;
    });
    return childrenList;
  }

  isHitSearch(data) {
    const { searchedText, columns } = this.props;
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
      this.setChildrenAttr(index, "expanded", expanded, treeNodeList);
    }
    this.setState({
      treeNodeList
    });
  }

  onSelect(index, selected) {
    const { treeNodeList } = this.state;
    const { singleSelectable, multiSelectable } = this.props;
    if (singleSelectable) {
      this.resetAttr("checked", false, treeNodeList);
      for (let i = 0; i < treeNodeList.length; i++) {
        if (i === index) {
          treeNodeList[i].checked = true;
          break;
        }
      }
    }
    if (multiSelectable) {
      this.resetAttr("halfChecked", false, treeNodeList);
      treeNodeList[index].checked = selected;
      this.setChildrenAttr(index, "checked", selected, treeNodeList);
      this.setParentChecked(index, "checked", selected, treeNodeList);
    }
    this.setState({
      treeNodeList,
    });
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
    if (!attrValue) {
      treeNodeList[parentIndex][attrName] = false;
    } else {
      const parent = treeNodeList[parentIndex];
      const childrenForParent = parent.children;
      const isAllChildrenCheckedBool = this.isAllChildrenChecked(childrenForParent, treeNodeList);
      treeNodeList[parentIndex][attrName] = isAllChildrenCheckedBool;
      if (!isAllChildrenCheckedBool) {
        treeNodeList[parentIndex].halfChecked = true;
      }
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

  renderData() {
    const { nodeStyle, arrowIconStyle, columns, singleSelectable, multiSelectable, singleSelectIconStyle, multiSelectIconStyle, checkedColor, uncheckedColor } = this.props;
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
    console.log(this.state.treeNodeList);
    const { treeStyle } = this.props;
    return (
      <table className="tree-container" style={treeStyle} key="top">
        <tbody>{this.renderData()}</tbody>
      </table>
    );
  }
}

Tree.propTypes = {
  defaultValue: PropTypes.any,
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  valueColumn: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  singleSelectable: PropTypes.bool.isRequired,
  multiSelectable: PropTypes.bool.isRequired,
  searchable: PropTypes.bool.isRequired,
  searchedText: PropTypes.string,
  branchNodeSelectable: PropTypes.bool,
  treeStyle: PropTypes.object,
  arrowIconStyle: PropTypes.object,
  singleSelectIconStyle: PropTypes.object,
  multiSelectIconStyle: PropTypes.object,
  nodeStyle: PropTypes.object,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string
};
