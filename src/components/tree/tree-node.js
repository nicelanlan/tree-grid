import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ActionArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CheckedCheckbox from 'material-ui/svg-icons/toggle/check-box';
import HalfCheckedCheckbox from 'material-ui/svg-icons/toggle/indeterminate-check-box';
import UnCheckedCheckbox from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedRadioButton from 'material-ui/svg-icons/toggle/radio-button-checked';
import UncheckedRadioButton from 'material-ui/svg-icons/toggle/radio-button-unchecked';

const defaultSelectIconStyle = {
  width: 24,
  height: 24,
  marginLeft: 6
};

/**
 * Each node in a tree, which is a <tr> element.
 *
 * @export TreeNode
 * @class TreeNode
 * @extends {React.PureComponent}
 */
export default class TreeNode extends React.PureComponent {
  static defaultProps = {
    nodeStyle: {
      paddingLeft: 40,
    },
  };
  /**
   * Return the arrow icon's style
   * @returns {object} the arrow icon's style
   */
  getArrowIconStyle() {
    const { arrowIconStyle, isLeaf } = this.props;
    return {
      color: '#000',
      opacity: 0.54,
      paddingRight: 16,
      verticalAlign: 'middle',
      visibility: isLeaf ? 'hidden' : 'visible',
      ...arrowIconStyle
    };
  }

  /**
   * Table cell to be showed on a document with data.
   * @returns {Array} HTML
   */
  renderData() {
    const { data, columns } = this.props;
    const content = [];

    if (!data || data.length === 0) {
      return null;
    }
    content.push(
      columns &&
        columns.map((item, index) => {
          if (index === 0) {
            return null;
          }
          let value = data[item.dataIndex];
          if (item.renderer) {
            value = item.renderer(data);
          } else if (value instanceof Array) {
            if (item.subDataIndex) {
              value = value[0][item.subDataIndex];
            } else {
              value = value[0].toString();
            }
          } else if (item.subDataIndex) {
            value = value[item.subDataIndex];
          }
          const style = item.width && {
            width: item.width
          };
          return (
            <td key={`p${data.id}${index}`} style={style}>
              {value}
            </td>
          );
        })
    );
    return content;
  }

  /**
   * Return a table cell with a radio button
   * @returns {object} table cell with a radio button
   */
  getSingleSelectElement() {
    const { index, checked, checkedColor, uncheckedColor, singleSelectIconStyle } = this.props;
    return (
      <td style={{ width: 40 }} key={`select${this.props.data.id}`}>
        <RadioButtonGroup
          name="tree-grid-radio-button"
          valueSelected={checked ? index : null}
          onChange={this.changeTreeNodeCheckedValue}
        >
          <RadioButton
            value={index}
            checkedIcon={<CheckedRadioButton style={{ fill: checkedColor }} />}
            uncheckedIcon={<UncheckedRadioButton style={{ fill: uncheckedColor }} />}
            style={{ ...defaultSelectIconStyle, ...singleSelectIconStyle }}
          />
        </RadioButtonGroup>
      </td>
    );
  }

  /**
   * Return a table cell with a checkbox
   * @returns {object} table cell with a checkbox
   */
  getMultiSelectElement() {
    const { checked, halfChecked, checkedColor, uncheckedColor, multiSelectIconStyle } = this.props;
    return (
      <td style={{ width: 40 }} key={`select${this.props.data.id}`}>
        <Checkbox
          checked={checked}
          checkedIcon={<CheckedCheckbox style={{ fill: checkedColor }} />}
          uncheckedIcon={
            halfChecked ? (
              <HalfCheckedCheckbox style={{ fill: uncheckedColor }} />
            ) : (
              <UnCheckedCheckbox style={{ fill: uncheckedColor }} />
            )
          }
          label=""
          style={{ ...defaultSelectIconStyle, ...multiSelectIconStyle }}
          onCheck={this.changeTreeNodeCheckedValue}
        />
      </td>
    );
  }

  /**
   * Return raido button or checkbox button or a placehodler span
   *
   * @returns {object} HTML with raido button or checkbox button or a placehodler span
   * @memberof TreeNode
   */
  getSelectElement() {
    const { data, singleSelectable, multiSelectable, isLeaf, branchNodeSelectable } = this.props;
    // "branchNodeSelectable" from config : should branch-node with a select; "enable" from datasource
    let showSelect = false;
    if (singleSelectable || multiSelectable) {
      showSelect =
        data && data.enable !== undefined
          ? data.enable
          : branchNodeSelectable || (!branchNodeSelectable && isLeaf);
    }
    const multiOrSingleSelectElement = multiSelectable
      ? this.getMultiSelectElement()
      : this.getSingleSelectElement();

    const selectElement = showSelect ? (
      multiOrSingleSelectElement
    ) : (
      <td>
        <span style={{ display: 'inline-block', width: 1, height: 1 }} />
      </td>
    );
    return selectElement;
  }

  render() {
    const {
      data,
      nodeStyle,
      columns,
      index,
      treeIndex,
      deepth,
      expanded,
      parentExpanded,
      isLeaf
    } = this.props;
    const display = expanded || parentExpanded ? 'table-row' : 'none';
    const nodePaddingLeft = nodeStyle.paddingLeft * (deepth - 1);
    const iconArrow = expanded ? (
      <ActionArrowDown style={this.getArrowIconStyle()} />
    ) : (
      <ActionArrowRight style={this.getArrowIconStyle()} />
    );

    return (
      <tr
        key={`tr${data.id}`}
        data-expanded={expanded}
        data-index={index}
        data-tree-index={treeIndex}
        style={(nodeStyle, { display })}
      >
        {/* Show radio button or checkbox or a <span> placeholder */}
        {this.getSelectElement()}
        <td
          key={`column${data.id}`}
          data-expanded={expanded}
          data-index={index}
          data-tree-index={treeIndex}
          onClick={this.onArrowIconClickHandler}
        >
          {/* Tree element's indentation */}
          <span style={{ display: 'inline-block', width: nodePaddingLeft, height: 1 }} />
          {!isLeaf && iconArrow}
          {/* data to be showed */}
          <span style={{ display: 'inline-block' }}>{data[columns[0].dataIndex]}</span>
        </td>
        {columns.length > 1 && this.renderData()}
      </tr>
    );
  }

  /**
   * When arrow icon has been clicked.
   * Expand it's children to be showed or collapse it's children and grandchildren to be hide.
   * @param {object} e
   */
  onArrowIconClickHandler = e => {
    e.stopPropagation();
    this.toggleExpandedTreeNodes();
  };

  /**
   * Expand it's children to be showed or collapse it's children and grandchildren to be hide.
   */
  toggleExpandedTreeNodes() {
    if (this.props.isLeaf) {
      return;
    }
    this.props.updateTreeExpanded(this.props.index);
  }

  /**
   * When the radio button or checkbox has be clicked
   * @param {object} e
   */
  changeTreeNodeCheckedValue = e => {
    this.props.onSelect(this.props.index, e.currentTarget.checked);
  };
}

TreeNode.propTypes = {
  data: PropTypes.any.isRequired,
  columns: PropTypes.array.isRequired,
  index: PropTypes.number,
  treeIndex: PropTypes.string,
  deepth: PropTypes.number,
  isLeaf: PropTypes.bool,
  expanded: PropTypes.bool,
  checked: PropTypes.bool,
  halfChecked: PropTypes.bool,
  parentExpanded: PropTypes.bool,
  singleSelectable: PropTypes.bool,
  multiSelectable: PropTypes.bool,
  branchNodeSelectable: PropTypes.bool,
  parentRelated: PropTypes.bool,
  treeStyle: PropTypes.object,
  singleSelectIconStyle: PropTypes.object,
  multiSelectIconStyle: PropTypes.object,
  arrowIconStyle: PropTypes.object,
  nodeStyle: PropTypes.object,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string,
  updateTreeExpanded: PropTypes.func,
  onSelect: PropTypes.func,
};
