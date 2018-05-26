import React from "react";
import PropTypes from "prop-types";

import TreeNode from "./tree-node";

import "./tree.css";

let nodeIndex = 0;

export default class Tree extends React.Component {
  static defaultProps = {
    expanded: false,
    singleSelectable: false,
    multiSelectable: false,
    checked: false
  };

  constructor(props) {
    super(props);
    this.state = {
      treeNodeList: []
    };
  }

  componentDidMount() {
    const { dataSource, columns } = this.props;
    const treeNodeList = [];
    this.generateTreeNodeList(dataSource, columns, treeNodeList);
    treeNodeList.map((item, index) => {
      const childrenNodes = item.childrenNodes;
      if (childrenNodes) {
        item.children = childrenNodes.map(childItem => {
          return childItem.index;
        });
      }
      return treeNodeList;
    });
    console.log(treeNodeList);
    this.setState({
      treeNodeList: treeNodeList
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
      const treeIndex = parentTreeIndex
        ? `${parentTreeIndex}-${itemIndex}`
        : itemIndex + "";
      const treeNode = {
        key: `treenode${deepth}${item.key || item.id}`,
        data: item,
        index: nodeIndex++,
        parent: parentIndex,
        deepth: deepth,
        treeIndex,
        children: item.children,
        isLeaf: !item.children,
        expanded: this.props.expanded,
        checked: this.props.checked,
        parentExpanded
      };
      treeNodeList.push(treeNode);
      if (item.children) {
        const childrenNodes = this.generateTreeNodeList(
          item.children,
          columns,
          treeNodeList,
          treeNode.index,
          treeIndex,
          deepth + 1,
          this.props.expanded
        );
        treeNode.childrenNodes = childrenNodes;
      }
      return treeNode;
    });
    // return treeNodeList;
  }

  updateTreeExpanded(index) {
    const treeNodeList = this.state.treeNodeList;
    const clickedTreeNode = treeNodeList[index];
    const expanded = !clickedTreeNode.expanded;
    // const clickedTreeNodeTreeIndex = clickedTreeNode.treeIndex;
    // const currentIndex = index;
    treeNodeList[index].expanded = expanded;
    if (!expanded) {
      this.setChildrenAttr(index, "expanded", expanded, treeNodeList);
    }
    // for (; index < treeNodeList.length; index++) {
    //   const currentItem = treeNodeList[index];
    //   if (expanded && currentIndex === index) {
    //     currentItem.expanded = expanded;
    //   }
    //   if (
    //     !expanded &&
    //     currentItem.treeIndex.startsWith(clickedTreeNodeTreeIndex)
    //   ) {
    //     currentItem.expanded = expanded;
    //   }
    // }
    this.setState({
      treeNodeList
    });
  }

  onSelect(index, selected) {
    const { treeNodeList } = this.state;
    const { singleSelectable, multiSelectable } = this.props;
    if (singleSelectable) {
      for (let i = 0; i < treeNodeList.length; i++) {
        if (i === index) {
          treeNodeList[i].checked = true;
        } else {
          treeNodeList.checked = false;
        }
      }
    }
    if (multiSelectable) {
      // this.setMultiSelectCheckedNodes(index, selected, treeNodeList);
      treeNodeList[index].checked = selected;
      this.setChildrenAttr(index, "checked", selected, treeNodeList);
    }
    this.setState({
      treeNodeList
    });
  }

  setChildrenAttr(index, attrName, attrValue, treeNodeList) {
    const children = treeNodeList[index].children;
    children &&
      children.map(item => {
        treeNodeList[item][attrName] = attrValue;
        this.setChildrenAttr(item, attrName, attrValue, treeNodeList);
        return treeNodeList;
      });
  }

  setMultiSelectCheckedNodes(index, selected, treeNodeList) {
    const node = treeNodeList[index];
    treeNodeList[index].checked = selected;
    const children = node.children;
    children.map(item => {
      treeNodeList[item].checked = selected;
      return treeNodeList;
    });
    // for (; index < treeNodeList.length; index++) {
    //   const item = treeNodeList[index];
    //   if (item.treeIndex.startsWith(node.treeIndex)) {
    //   }
    // }
  }

  renderData() {
    const {
      nodeStyle,
      iconStyle,
      columns,
      singleSelectable,
      multiSelectable
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
          iconStyle={iconStyle}
          nodeStyle={nodeStyle}
          expanded={item.expanded}
          checked={item.checked}
          parentExpanded={item.parentExpanded}
          singleSelectable={singleSelectable}
          multiSelectable={multiSelectable}
          updateTreeExpanded={this.updateTreeExpanded.bind(this)}
          onSelect={this.onSelect.bind(this)}
        />
      );
      return content;
    });
    return content;
  }
  render() {
    const { treeStyle } = this.props;
    return (
      <table className="tree-container" style={treeStyle} key="top">
        <tbody>{this.renderData()}</tbody>
      </table>
    );
  }
}

Tree.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  expanded: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  singleSelectable: PropTypes.bool.isRequired,
  multiSelectable: PropTypes.bool.isRequired,
  treeStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  nodeStyle: PropTypes.object
};
