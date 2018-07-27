import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import Calendar from 'material-ui/DatePicker/Calendar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { dateTimeFormat } from 'material-ui/DatePicker/dateUtils';
import Clock from 'material-ui/TimePicker/Clock';
import { setDateByDay, setDateByTime } from './date-utils';

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dateTime: props.dateTime ? props.dateTime : new Date()
    };
  }
  static propTypes = {
    className: PropTypes.string,
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    disableYearSelection: PropTypes.bool,
    firstDayOfWeek: PropTypes.number,
    hideCalendarDate: PropTypes.bool,
    initialDate: PropTypes.object,
    locale: PropTypes.string,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    open: PropTypes.bool,
    openToYearSelection: PropTypes.bool,
    shouldDisableDate: PropTypes.func,
    style: PropTypes.object,
    utils: PropTypes.object
  };

  static defaultProps = {
    className: 'date-time-picker-dialog',
    DateTimeFormat: dateTimeFormat,
    cancelLabel: 'Cancel',
    // container: 'dialog',
    locale: 'en-US',
    okLabel: 'OK',
    openToYearSelection: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  show = () => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }

    this.setState({
      open: true
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }

    this.setState({
      open: false
    });
  };

  handleTouchTapDay = (event, date) => {
    this.setState({
      dateTime: setDateByDay(this.state.dateTime, date)
    });
  };

  handleTouchTapCancel = () => {
    this.dismiss();
  };

  onOkClickHandler = () => {
    // if (this.props.onAccept && !this.refs.calendar.isSelectedDateDisabled()) {
    //   this.props.onAccept(this.refs.calendar.getSelectedDate());
    // }
    this.props.onAccept && this.props.onAccept(this.state.dateTime);
    this.dismiss();
  };

  onChangeMinutes = (minutes) => {
    this.setState({
      dateTime: setDateByTime(this.state.dateTime, minutes)
    });
    // this.dismiss();
  };

  handleWindowKeyUp = event => {
    switch (keycode(event)) {
    case 'enter':
      this.onOkClickHandler();
      break;
    default:
      break;
    }
  };

  render() {
    const {
      className,
      DateTimeFormat,
      autoOk,
      cancelLabel,
      containerStyle,
      disableYearSelection,
      initialDate,
      firstDayOfWeek,
      locale,
      maxDate,
      minDate,
      mode,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      openToYearSelection,
      shouldDisableDate,
      hideCalendarDate,
      style, // eslint-disable-line no-unused-vars
      animation,
      utils,
      format,
      minutesStep,
      initialTime,
      ...other
    } = this.props;

    const { open } = this.state;

    const styles = {
      dialogContent: {
        width: !hideCalendarDate && mode === 'landscape' ? 779 : 619
      },
      dialogBodyContent: {
        padding: 0,
        minHeight: hideCalendarDate || mode === 'landscape' ? 330 : 434,
        minWidth: hideCalendarDate || mode !== 'landscape' ? 590 : 759
      }
    };
    const actions = [
      <FlatButton key="datetimepickerdialog0" label={cancelLabel} primary={true} onClick={this.handleTouchTapCancel.bind(this)} />,
      <FlatButton key="datetimepickerdialog1" label={okLabel} primary={true} onClick={this.onOkClickHandler.bind(this)} />
    ];
    return (
      <div {...other} ref="root">
        <Dialog
          animation={animation} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          contentClassName={className}
          actionsContainerClassName={`${className}__actions`}
          ref="dialog"
          repositionOnUpdate={true}
          open={open}
          actions={actions}
          onRequestClose={this.dismiss}
          style={Object.assign(styles.dialogBodyContent, containerStyle)}
        >
          <EventListener target="window" onKeyUp={this.handleWindowKeyUp} />
          <div className={`${className}__content`}>
            <div className={`${className}__content-date`}>
              <Calendar
                autoOk={autoOk}
                DateTimeFormat={DateTimeFormat}
                // cancelLabel={cancelLabel}
                disableYearSelection={disableYearSelection}
                firstDayOfWeek={firstDayOfWeek}
                initialDate={initialDate}
                locale={locale}
                onTouchTapDay={this.handleTouchTapDay.bind(this)}
                maxDate={maxDate}
                minDate={minDate}
                mode={mode}
                open={open}
                ref="calendar"
                // onTouchTapCancel={this.handleTouchTapCancel}
                // onTouchTapOk={this.onOkClickHandler}
                // okLabel={okLabel}
                openToYearSelection={openToYearSelection}
                shouldDisableDate={shouldDisableDate}
                hideCalendarDate={hideCalendarDate}
                utils={utils}
              />
            </div>
            <div className={`${className}__content-time`}>
              <Clock
                ref="clock"
                format={format}
                initialTime={initialTime}
                onChangeHours={this.onChangeMinutes.bind(this)}
                onChangeMinutes={this.onChangeMinutes.bind(this)}
                minutesStep={minutesStep}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default DateTimePicker;
