import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TreeSelect from './tree-select';

const styles = {
  customButtonStyle: {
    width: 130
  },
  customButtonLableStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    textTransform: 'none'
  },
  customCancelButtonLabelStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    textTransform: 'none',
    color: '#4d4d4e'
  }
};

/**
 * Tree with a search bar in a dialog, tree can be single/multiple selected.
 *
 * @export
 * @class TreeSelectDialog
 * @extends {React.Component}
 */
export default class TreeSelectDialog extends React.Component {
  state = {
    dialogOpened: false
  };

  static defaultProps = {
    className: 'fms-tree-select-dialog',
    dialogOpened: false,
    dialog: {
      title: 'Select',
      // Dialog's action config
      actionsConfig: [
        {
          label: 'Cancel',
          primary: true,
          labelStyle: styles.customCancelButtonLabelStyle,
          style: styles.customButtonStyle
        },
        {
          label: 'Select',
          primary: true,
          labelStyle: styles.customButtonLableStyle,
          style: styles.customButtonStyle
        }
      ],
      modal: false
    },
    searchBar: {},
    tree: {}
  };

  /**
   * Return the dialog's default actions
   *
   * @returns
   * @memberof TreeSelectDialog
   */
  getDefaultActionButtons() {
    const {
      dialog: { actionsConfig },
      closeDialog,
      onSelectButtonClickHandler
    } = this.props;
    const actions = [
      // cancel button
      <FlatButton
        label={actionsConfig[0].label}
        primary={actionsConfig[0].primary}
        labelStyle={actionsConfig[0].labelStyle}
        style={actionsConfig[0].style}
        onTouchTap={closeDialog}
      />,
      // delete button
      <RaisedButton
        label={actionsConfig[1].label}
        primary={actionsConfig[1].primary}
        labelStyle={actionsConfig[1].labelStyle}
        style={actionsConfig[1].style}
        onTouchTap={onSelectButtonClickHandler}
      />
    ];
    return actions;
  }

  render() {
    const { className, dialog, searchBar, tree, afterSelect, closeDialog } = this.props;
    return (
      <Dialog
        actionsContainerClassName={`${className}__actions`}
        autoScrollBodyContent={true}
        bodyClassName={`${className}__body`}
        contentClassName={`${className}`}
        // overlayClassName={`${className}__overlay`}
        // paperClassName={`${className}__paper`}
        titleClassName={`${className}__title`}
        title={dialog.title}
        actions={dialog.actions || this.getDefaultActionButtons()}
        modal={dialog.modal}
        open={this.props.dialogOpened}
        onRequestClose={dialog.onRequestClose}
      >
        <TreeSelect searchBar={searchBar} tree={tree} afterSelect={afterSelect} />
      </Dialog>
    );
  }
}

TreeSelectDialog.propTypes = {
  className: PropTypes.string,
  dialogOpend: PropTypes.bool,
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
    defaultValue: PropTypes.any,
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
  afterSelect: PropTypes.func.isRequired,
  closeDialog: PropTypes.func,
  onSelectButtonClickHandler: PropTypes.func
};
