import React from "react";
import TreeNode from "./tree-node";
import "./tree.css";

const nodeList = [];
let dataSourceIndex = 0;
export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeNodeList: []
    };
    this.onTreeNodeClick = this.onTreeNodeClick.bind(this);
  }
  componentDidMount() {
    // this.setState({
    //   treeNodeList: nodeList
    // });
  }

  onTreeNodeClick(e) {
    e.stopPropagation();
    console.log(e.currentTarget.dataset);
    console.log(e.currentTarget.rowIndex);
    console.log(nodeList);
  }
  renderData(data, columns, parentItemIndex = '', index = 1) {
    const { nodeStyle, iconStyle } = this.props;
    const content = [];
    // const nodeList = [];
    data.map((item, itemIndex) => {
      // const treeNode = {
      //   key: `treenode${index}${item.key || item.id}`,
      //   data: item,
      //   index: `${index}-${itemIndex}`,
      //   children: item.children,
      //   isLeaf: !item.children,
      //   left: nodeStyle.paddingLeft * index
      // };
      // nodeList.push(treeNode);
      const treeIndex = parentItemIndex ? `${parentItemIndex}-${itemIndex}` : itemIndex + '';
      console.log(treeIndex)
      content.push(
        <TreeNode
          key={`treenode${index}${item.key || item.id}`}
          data={item}
          columns={columns}
          treeIndex={treeIndex}
          index={index}
          children={item.children}
          isLeaf={!item.children}
          left={nodeStyle.paddingLeft * index}
          className={`parent${treeIndex}`}
          iconStyle={iconStyle}
          nodeStyle={nodeStyle}
          // onClick={this.onTreeNodeClick}
          {...this.props}
        />
      );
      if (item.children) {
        content.push(this.renderData(item.children, columns, treeIndex, index + 1));
      }
      dataSourceIndex++;
      return content;
    });
    return content;
  }
  render() {
    const { dataSource, columns, treeStyle } = this.props;
    return (
      <table className="tree-container" style={treeStyle} key="top">
        <tbody>{this.renderData(dataSource, columns)}</tbody>
      </table>
    );
  }
}
