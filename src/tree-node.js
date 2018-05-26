import React from "react";

import IconArrowRight from "./widgets/icon-arrow-right";
import IconArrowDown from "./widgets/icon-arrow-down";

// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx
export default class TreeNode extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false
    };
  }

  componentDidMount() {
    this.setState({
      display:
        this.props.expanded || this.props.parentExpanded ? "table-ow" : "none"
    });
  }

  expandedElement(treeIndex, element) {
    const pattern = new RegExp(`^${treeIndex}-\\d$`, "g");
    if (pattern.test(element.dataset.treeIndex)) {
      element.style.display = "table-row";
    }
  }

  collapseElement(treeIndex, element) {
    if (element.dataset.treeIndex.startsWith(treeIndex)) {
      element.style.display = "none";
    }
  }

  setNextSiblingStyle(treeIndex, element, expanded) {
    if (element.dataset.treeIndex.startsWith(treeIndex)) {
      expanded
        ? this.expandedElement(treeIndex, element)
        : this.collapseElement(treeIndex, element);
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
    this.setNextSiblingStyle(
      treeIndex,
      currentTarget.nextSibling,
      !this.props.expanded
    );
    this.props.updateTreeExpanded(this.props.index);
  }

  selectTreeNode(e) {
    e.stopPropagation();
    this.props.onSelect(this.props.index, e.currentTarget.checked);
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
            return null;
          }
          const value = data[item.dataIndex];
          const style = {
            width: item.width
          };
          return (
            <td
              className="tree-node-item"
              key={`p${data.key}${index}`}
              style={style}
            >
              {value}
            </td>
          );
        })
    );
    return content;
  }

  render() {
    const {
      data,
      nodeStyle,
      columns,
      index,
      treeIndex,
      className,
      deepth,
      expanded,
      checked,
      singleSelectable,
      multiSelectable
    } = this.props;

    const dataIconStyle = {
      height: nodeStyle.nodeHeight,
      paddingRight: 40
    };
    return (
      <tr
        className={`tree-node-li ${className}`}
        key={`li${data.key}`}
        data-expanded={expanded}
        data-index={index}
        data-tree-index={treeIndex}
        style={(nodeStyle, { display: this.state.display })}
        onClick={this.onClickHandler.bind(this)}
      >
        {singleSelectable && (
          <td>
            <input type="radio" onClick={this.selectTreeNode.bind(this)} />
          </td>
        )}
        {multiSelectable && (
          <td>
            <input
              type="checkbox"
              checked={checked}
              onClick={this.selectTreeNode.bind(this)}
            />
          </td>
        )}
        <td key={`div${data.key}`} style={dataIconStyle}>
          <span
            style={{
              display: "inline-block",
              width: nodeStyle.paddingLeft * deepth,
              height: 1
            }}
          />
          {expanded ? (
            <IconArrowDown style={this.getIconStyle()} />
          ) : (
            <IconArrowRight style={this.getIconStyle()} />
          )}
          <span style={{ display: "inline-block" }}>
            {data[columns[0].dataIndex]}
          </span>
        </td>
        {this.renderData()}
      </tr>
    );
  }
}
