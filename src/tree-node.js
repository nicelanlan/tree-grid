import React from "react";
import IconArrowRight from "./widgets/icon-arrow-right";
import IconArrowDown from "./widgets/icon-arrow-down";

// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx
export default class TreeNode extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }
  componentDidMount() {
    this.setState({
      expanded: !!this.props.expanded
    });
  }
  setNextSiblingStyle(treeIndex, element, expanded) {
    if (element.dataset.treeIndex.startsWith(treeIndex)) {
      element.style.display = expanded ? 'table-row' : 'none';
      if (element.nextSibling) {
        this.setNextSiblingStyle(treeIndex, element.nextSibling, expanded);
      }
    }
  }
  onClickHandler(e) {
    e.stopPropagation();
    if (this.props.isLeaf) {
      return;
    }
    const currentTarget = e.currentTarget;
    const treeIndex = currentTarget.dataset.treeIndex;
    this.setState((prevStat, prevProps) => {
      console.log("prevStat", prevStat);
      this.setNextSiblingStyle(treeIndex, currentTarget.nextSibling, !prevStat.expanded);
      return {
        expanded: !prevStat.expanded
      };
    });
  }

  getIconStyle() {
    const { iconStyle, isLeaf } = this.props;
    return {
      ...iconStyle,
      visibility: isLeaf ? "hidden" : "visible"
    };
  }

  renderData() {
    const { data, columns } = this.props;
    const content = [];

    content.push(
      columns &&
        columns.map((item, index) => {
          if (index === 0) {
            return "";
          }
          const value = data[item.dataIndex];
          const style = {
            // margin: '0 20px',
            // display: 'inline-block',
            width: item.width
          };
          return (
            <td className="tree-node-item" key={`p${data.key}${index}`} style={style}>
              {value}
            </td>
          );
        })
    );
    return content;
  }
  render() {
    const { data, nodeStyle, left, columns, index, treeIndex, className } = this.props;

    const dataIconStyle = {
      // width: 40,
      height: nodeStyle.nodeHeight,
      paddingRight: 40
      // lineHeight: iconStyle.height,
    };
    return (
      <tr className={`tree-node-li ${className}`} key={`li${data.key}`} style={nodeStyle} data-index={index} data-tree-index={treeIndex} onClick={this.onClickHandler.bind(this)}>
        <td key={`div${data.key}`} style={dataIconStyle}>
          <span style={{ display: "inline-block", width: left, height: 1 }} />
          {this.state.expanded ? (
            <IconArrowDown style={this.getIconStyle()} />
          ) : (
            <IconArrowRight style={this.getIconStyle()} />
          )}
          <span style={{ display: "inline-block" }}>{data[columns[0].dataIndex]}</span>
        </td>
        {this.renderData()}
      </tr>
    );
  }
}
