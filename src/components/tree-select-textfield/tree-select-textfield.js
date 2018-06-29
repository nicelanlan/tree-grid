import React from 'react';
import PropTypes from 'prop-types';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import R from 'ramda';

import TreeSelectDialog from './tree-select-dialog';

const defaultPrefix = 'fms-tree-select-textfield';

// rewrite dialog's contentStyle
const styles = {
  customSelectFieldIconStyle: {
    float: 'right',
    opacity: 0.54,
    marginTop: 34
  }
};

export default class TreeSelectTextField extends React.Component {
  state = {
    dialogOpened: false, // whether dialog should be opened or closed, true : open the dialog, otherwise close the dialog
    treeSelectedValue: [], // All selected value on tree, item is object from props of "dataSource"
    fieldShowValue: '', // value need to show at the textfield
    fieldValue: '', // Selected value of the tree
    errorText: '', // When validation doesn't pass, show this text on textfield
    showingErrorText: false // Is showing error text or not
  };

  /**
   * Language context, use both for can not distinguish which is being used in page
   */
  static contextTypes = {
    intl: PropTypes.object,
    langData: PropTypes.object
  };

  componentWillMount() {
    // "treeSelectedValue" is empty before tree loaded, so need to iterator the data source immediately when the text field is load.
    this.setDefaultState(this.props);
  }

  render() {
    const { intl, langData } = this.context;
    const messages = intl ? intl.messages : langData;
    const { disable, dialog, searchBar, tree, selectFieldStyle, selectFieldLabelStyle, selectFieldTextStyle, selectFieldIconStyle, selectField } = this.props;
    const hintText = this.props.selectField && this.props.selectField.hintText ? this.props.selectField.hintText : '';
    const errorText = messages ? messages[this.state.errorText] : 'Mandatory';
    const arrowDropDownStyle = { ...styles.customSelectFieldIconStyle, ...selectFieldIconStyle };
    const isShowingHintText = !this.state.fieldShowValue || this.state.fieldShowValue === hintText;
    const prefix = this.props.className ? this.props.className : defaultPrefix;
    const className = this.state.showingErrorText
      ? `${defaultPrefix}__field ${defaultPrefix}__field-error`
      : isShowingHintText
        ? `${defaultPrefix}__field ${defaultPrefix}__field-initial`
        : `${defaultPrefix}__field`;
    const treeProps = { ...tree, defaultValue: this.state.fieldValue };
    return (
      <div className={defaultPrefix}>
        <div className={className} style={selectFieldStyle} onClick={this.openDialog}>
          {!isShowingHintText && <label style={selectFieldLabelStyle}>{hintText}</label>}
          <span style={selectFieldTextStyle}>{this.state.fieldShowValue}</span>
          <ArrowDropDown style={arrowDropDownStyle} />
        </div>
        {this.state.showingErrorText && (
          <div className={`${defaultPrefix}__field-errortext`}>
            <span>{errorText}</span>
          </div>
        )}
        {!disable && <TreeSelectDialog
          dialogOpened={this.state.dialogOpened}
          dialog={dialog}
          searchBar={searchBar}
          tree={treeProps}
          afterSelect={this.afterSelect}
          closeDialog={this.closeDialog}
          onSelectButtonClickHandler={this.onSelectButtonClickHandler}
        />}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    // when default value or data source changed, re-set state of default value
    if (
      nextProps.defaultValue !== this.props.defaultValue ||
      !R.equals(nextProps.tree.dataSource, this.props.tree.dataSource)
    ) {
      this.setDefaultState(nextProps);
    }
  }

  /**
   * Get the state field(fieldShowValue, fieldValue, treeSelectedValue) with default value and data soruce
   *
   * @param {object} props
   * @returns {object} state
   * @memberof TreeSelectTextField
   */
  setDefaultState(props) {
    const {
      defaultValue,
      tree: { dataSource, columns, valueColumn }
    } = props;
    const hintText = props.selectField && props.selectField.hintText ? props.selectField.hintText : '';
    const defaultValueArr = defaultValue && defaultValue.toString().split(',');
    const fieldTextValueList = [];
    const treeSelectedValue = [];
    if (defaultValueArr) {
      // Set default state value according to props of "defaultValue" and "dataSource"
      defaultValueArr.map(valueItem => {
        if (valueItem) {
          this.setDefaultStateByIterator(
            valueItem,
            dataSource,
            fieldTextValueList,
            treeSelectedValue
          );
          return true;
        }
        return false;
      });
    }
    this.setState({
      fieldShowValue: fieldTextValueList.join(',') || hintText,
      fieldValue: defaultValueArr,
      treeSelectedValue
    });
  }

  /**
   * Value column name, it's value is 'valueColumn' of tree's config, "id" is the default name
   *
   * @returns {string} value column name
   * @memberof TreeSelectTextField
   */
  getValueColumn() {
    return this.props.tree.valueColumn || 'id';
  }

  /**
   * The column name of tree for showing text in the Textfield.
   * The value comes from props "showColumn", default is first column of tree's props "colulmns"
   *
   * @returns
   * @memberof TreeSelectTextField
   */
  getShowColumn() {
    return this.props.tree.columns[0].dataIndex;
  }

  /**
   * Set default state value according to props of "defaultValue" and "dataSource"
   *
   * @param {string} defaultValueItem item of "defaultValue" props
   * @param {string} data "dataSource" props or children of item
   * @param {Array} fieldTextValueList Array value of showed text of textfield
   * @param {Array} defaultItemList Object list choosed according to default value, item is a data from dataSource
   * @returns
   * @memberof TreeSelectTextField
   */
  setDefaultStateByIterator(defaultValueItem, data, fieldTextValueList, defaultItemList) {
    const valueColumn = this.getValueColumn();
    const showColumn = this.getShowColumn();
    const columns = this.props.tree.columns;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item[valueColumn] && item[valueColumn].toString() === defaultValueItem.toString()) {
        fieldTextValueList.push(item[showColumn]);
        defaultItemList.push(item);
        return true;
      }
      if (item.children) {
        const valueFromChildren = this.setDefaultStateByIterator(
          defaultValueItem,
          item.children,
          fieldTextValueList,
          defaultItemList
        );
      }
    }
  }

  /**
   * Close the dialog
   *
   * @memberof TreeSelectTextField
   */
  closeDialog = () => {
    this.setState({
      dialogOpened: false
    });
  };

  /**
   * Open the dialog
   *
   * @memberof TreeSelectTextField
   */
  openDialog = () => {
    this.setState({
      dialogOpened: true
    });
  };

  /**
   * After tree selected, set the selected value to state
   *
   * @memberof TreeSelectTextField
   */
  afterSelect = value => {
    this.setState({
      treeSelectedValue: value
    });
  };

  /**
   * When clicked the "select" button on dialog, close the dialog ,set value to textfield
   *
   * @memberof TreeSelectTextField
   */
  onSelectButtonClickHandler = () => {
    const fieldValue = this.getSelectFieldValue(this.state.treeSelectedValue);
    const fieldShowValue = this.getSelectFieldShowValue(this.state.treeSelectedValue);
    this.setState({
      dialogOpened: false,
      fieldShowValue: fieldShowValue.join(','),
      fieldValue,
      showingErrorText: fieldValue ? false : true
    });
    this.props.onChange && this.props.onChange(fieldValue.toString(), this.state.treeSelectedValue);
  };

  /**
   * Get the value array by selected nodes on tree.
   *
   * @param {Array} treeSelectedValue
   * @returns {Array} Array with value item
   * @memberof TreeSelectTextField
   */
  getSelectFieldValue(treeSelectedValue) {
    const valueColumn = this.getValueColumn();
    return treeSelectedValue.map(item => item[valueColumn]);
  }

  /**
   * Get the showed text array by selected nodes on tree.
   *
   * @param {Array} treeSelectedValue
   * @returns {Array} Array with showed text value item
   * @memberof TreeSelectTextField
   */
  getSelectFieldShowValue(treeSelectedValue) {
    const showColumn = this.getShowColumn();
    return treeSelectedValue.map(item => item[showColumn]);
  }

  /**
   * validate the text field.
   * Validation passed, return the selected tree value; otherwise return the error text
   *
   * @memberof TreeSelectTextField
   */
  getValue = () => {
    const validation = this.props.validation;
    if (validation) {
      for (const func of validation) {
        let message = func(this.state.fieldValue);
        if (message !== true) {
          // this.refs[this.props.name].input.focus();
          this.setState({ errorText: message, showingErrorText: true });
          return this.props.errorText;
        } else {
          this.setState({ errorText: '', showingErrorText: false });
          return this.state.fieldValue.toString();
        }
      }
    }
  };

  /**
   * Get the tree selected values of tree, item is an object.
   *
   * @memberof TreeSelectTextField
   */
  getTreeSelectedValue = () => {
    return this.state.treeSelectedValue;
  };
}

TreeSelectTextField.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
  selectField: PropTypes.object,
  selectFieldStyle: PropTypes.object,
  selectFieldTextStyle: PropTypes.object,
  selectFieldIconStyle: PropTypes.object,
  showColumn: PropTypes.string,
  dialog: PropTypes.shape({
    title: PropTypes.string,
    actions: PropTypes.array,
    actionsConfig: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        primary: PropTypes.bool,
        labelStyle: PropTypes.object,
        style: PropTypes.object,
        onTouchTap: PropTypes.func
      })
    ),
    modal: PropTypes.bool,
    contentStyle: PropTypes.object,
    onRequestClose: PropTypes.func
  }),
  searchBar: PropTypes.shape({
    hintText: PropTypes.string,
    componentStyle: PropTypes.object,
    textFieldStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    hintStyle: PropTypes.object
  }),
  tree: PropTypes.shape({
    className: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    valueColumn: PropTypes.string,
    expanded: PropTypes.bool,
    checked: PropTypes.bool,
    singleSelectable: PropTypes.bool,
    multiSelectable: PropTypes.bool,
    branchNodeSelectable: PropTypes.bool,
    treeStyle: PropTypes.object,
    arrowIconStyle: PropTypes.object,
    singleSelectIconStyle: PropTypes.object,
    multiSelectIconStyle: PropTypes.object,
    nodeStyle: PropTypes.object,
    checkedColor: PropTypes.string,
    uncheckedColor: PropTypes.string
  }),
  onChange: PropTypes.func
};
