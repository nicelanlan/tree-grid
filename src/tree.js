import React from 'react';
import PropTypes from 'prop-types'

import TreeNode from './tree-node';

import './tree.css';

export default class Tree extends React.Component {

  static defaultProps = {
    expanded: false,
    singleSelectable: false,
    multiSelectable: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      treeNodeList: []
    };
  }

  updateTreeExpanded(index) {
    const treeNodeList = this.state.treeNodeList;
    const clickedTreeNode = treeNodeList[index];
    const expanded = !clickedTreeNode.expanded;
    const clickedTreeNodeTreeIndex = clickedTreeNode.treeIndex;
    const currentIndex = index;
    for (; index < treeNodeList.length; index++) {
      const currentItem = treeNodeList[index];
      if (expanded && currentIndex === index) {
        currentItem.expanded = expanded;
      }
      if (!expanded && currentItem.treeIndex.startsWith(clickedTreeNodeTreeIndex)) {
        currentItem.expanded = expanded;
      }
    }
    this.setState({
      treeNodeList,
    });
  }

  componentDidMount() {
    const { dataSource, columns } = this.props;
    const treeNodeList = [];
    this.setState({
      treeNodeList: this.generateTreeNodeList(dataSource, columns, treeNodeList)
    });
  }

  generateTreeNodeList(data, columns, treeNodeList, parentItemIndex = '', deepth = 1) {
    data.map((item, itemIndex) => {
      const treeIndex = parentItemIndex ? `${parentItemIndex}-${itemIndex}` : itemIndex + '';
      const treeNode = {
        key: `treenode${deepth}${item.key || item.id}`,
        data: item,
        deepth: deepth,
        treeIndex,
        children: item.children,
        isLeaf: !item.children,
        expanded: this.props.expanded
      };
      treeNodeList.push(treeNode);
      if (item.children) {
        this.generateTreeNodeList(item.children, columns, treeNodeList, treeIndex, deepth + 1);
      }
      return treeNodeList;
    });
    return treeNodeList;
  }

  renderData() {
    const { nodeStyle, iconStyle, columns, singleSelectable, multiSelectable } = this.props;
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
          singleSelectable={singleSelectable}
          multiSelectable={multiSelectable}
          updateTreeExpanded={this.updateTreeExpanded.bind(this)}
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
  singleSelectable: PropTypes.bool.isRequired,
  multiSelectable: PropTypes.bool.isRequired,
  treeStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  nodeStyle: PropTypes.object,
};
