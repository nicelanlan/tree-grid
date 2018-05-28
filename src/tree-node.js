import React from "react";
import Checkbox from "material-ui/Checkbox";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import ActionArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ActionArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CheckedCheckbox from 'material-ui/svg-icons/toggle/check-box';
import HalfCheckedCheckbox from 'material-ui/svg-icons/toggle/indeterminate-check-box';
import UnCheckedCheckbox from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedRadioButton from 'material-ui/svg-icons/toggle/radio-button-checked';
import UncheckedRadioButton from 'material-ui/svg-icons/toggle/radio-button-unchecked';

// https://github.com/react-component/tree/blob/master/src/TreeNode.jsx
export default class TreeNode extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      display: false,
      radioButtonValue: -1
    };
  }

  componentDidMount() {
    this.setState({
      display: this.props.expanded || this.props.parentExpanded ? "table-ow" : "none"
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
      expanded ? this.expandedElement(treeIndex, element) : this.collapseElement(treeIndex, element);
      if (element.nextSibling) {
        this.setNextSiblingStyle(treeIndex, element.nextSibling, expanded);
      }
    }
  }

  onClickHandler(e) {
    e.stopPropagation();
    if (e.target.nodeName.toLowerCase() === "input") {
      return;
    }
    if (this.props.isLeaf) {
      return;
    }
    const currentTarget = e.currentTarget;
    const treeIndex = currentTarget.dataset.treeIndex;
    this.setNextSiblingStyle(treeIndex, currentTarget.nextSibling, !this.props.expanded);
    this.props.updateTreeExpanded(this.props.index);
  }

  selectTreeNode(e, value) {
    e.stopPropagation();
    // this.resetRadioButtonChecked();
    // e.target.checked = true;
    this.setState({
      radioButtonValue: value
    });
    this.props.onSelect(this.props.index, e.currentTarget.checked);
  }

  resetRadioButtonChecked() {
    const nodeList = document.getElementsByName("tree-grid-radio-button");
    console.log(nodeList);
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].checked = false;
    }
    // nodeList.forEach(item => {
    //   item.checked = false;
    //   return true;
    // });
    console.log(nodeList);
  }

  getArrowIconStyle() {
    const { arrowIconStyle, isLeaf } = this.props;
    return {
      ...arrowIconStyle,
      verticalAlign: 'middle',
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
            <td className="tree-node-item" key={`p${data.key}${index}`} style={style}>
              {value}
            </td>
          );
        })
    );
    return content;
  }

  getSingleSelectElement() {
    const { index, checked, checkedColor, uncheckedColor, singleSelectIconStyle } = this.props;
    return (
      <td>
        <RadioButtonGroup
          name="tree-grid-radio-button"
          valueSelected={checked ? index : null}
          onChange={this.selectTreeNode.bind(this)}
        >
          <RadioButton
            // checked={checked}
            value={index}
            label=""
            checkedIcon={<CheckedRadioButton style={{fill: checkedColor}} />}
            uncheckedIcon={<UncheckedRadioButton style={{fill: uncheckedColor}} />}
            style={singleSelectIconStyle}
          />
        </RadioButtonGroup>
        {/* <input type="radio" onClick={this.selectTreeNode.bind(this)} /> */}
      </td>
    );
  }

  getMultiSelectElement() {
    const { checked, halfChecked, checkedColor, uncheckedColor, multiSelectIconStyle } = this.props;
    return (
      <td>
        <Checkbox
          checked={checked}
          checkedIcon={<CheckedCheckbox style={{fill: checkedColor}} />}
          uncheckedIcon={
            halfChecked ? (
              <HalfCheckedCheckbox style={{fill: uncheckedColor}} />
            ) : (
              <UnCheckedCheckbox style={{fill: uncheckedColor}} />
            )
          }
          label=""
          style={multiSelectIconStyle}
          onCheck={this.selectTreeNode.bind(this)}
        />
        {/* <input type="checkbox" checked={checked} onClick={this.selectTreeNode.bind(this)} /> */}
      </td>
    );
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
      singleSelectable,
      multiSelectable,
      isLeaf,
      branchNodeSelectable
    } = this.props;
    const dataIconStyle = {
      height: nodeStyle.nodeHeight,
      paddingRight: 40
    };
    const iconArrow = expanded ? (
      <ActionArrowDown style={this.getArrowIconStyle()} />
    ) : (
      <ActionArrowRight style={this.getArrowIconStyle()} />
    );
    const showSelect = branchNodeSelectable || (!branchNodeSelectable && isLeaf);
    let selectElement = (
      <td>
        <span style={{ display: "inline-block" }} />
      </td>
    );
    if (showSelect) {
      if (singleSelectable) {
        selectElement = this.getSingleSelectElement();
      }
      if (multiSelectable) {
        selectElement = this.getMultiSelectElement();
      }
    }
    // const selectElement = showSelect
    //   ? singleSelectable
    //     ? this.getSingleSelectElement()
    //     : multiSelectable
    //       ? this.getMultiSelectElement()
    //       : null
    //   : null;
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
        {selectElement}
        {null}
        <td key={`div${data.key}`} style={dataIconStyle}>
          <span
            style={{
              display: "inline-block",
              width: nodeStyle.paddingLeft * deepth,
              height: 1
            }}
          />
          {!isLeaf && iconArrow}
          <span style={{ display: "inline-block" }}>{data[columns[0].dataIndex]}</span>
        </td>
        {this.renderData()}
      </tr>
    );
  }
}
