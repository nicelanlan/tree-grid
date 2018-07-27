import React from 'react';
import dateformat from 'dateformat';
import classnames from 'classnames';
import { TextField } from 'material-ui';
import DateTimePickerDialog from './date-time-picker-dialog';
import IconDateRange from 'material-ui/svg-icons/action/date-range';

const STYLES = {
  icon: {
    marginLeft: -30,
  },
};
export default class DateTimeRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: props.dateTime ? props.dateTime : new Date(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dateTime.getTime() !== nextProps.dateTime.getTime()) {
      this.setState({
        dateTime: nextProps.dateTime,
      });
    }
  }

  openDatePicker = e => {
    e.preventDefault();
    this.timePicker.show();
  };

  getDisplayTime = () => {
    const { dateTime } = this.state;

    return dateformat(dateTime, 'dd-mm-yyyy HH:MM:ss');
  };

  onAcceptHandler = date => {
    this.setState({
      dateTime: date,
    });
    this.props.onAccept && this.props.onAccept(date);
  };

  onShow = () => {
    this.props.onShow && this.props.onShow();
  };

  onDismiss = () => {
    this.props.onDismiss && this.props.onDismiss();
  };

  render() {
    return (
      <div
        className="date-time-picker"
        style={{ ...this.props.textFieldStyle }}
        onClick={this.openDatePicker}
      >
        <TextField
          name="date-time-picker-textfield"
          className="date-time-picker-textfield"
          className={classnames('date-time-picker-textfield', {
            ['date-time-picker-textfield-error']: this.props.errorText,
          })}
          value={this.getDisplayTime()}
          style={{ ...STYLES.textField }}
        />
        <IconDateRange style={STYLES.icon} />

        <DateTimePickerDialog
          ref={node => {
            this.timePicker = node;
          }}
          firstDayOfWeek={0}
          format="24hr"
          minutesStep={5}
          // dialogStyle={STYLES.timeDialogStyle}
          style={{ color: 'blue', transform: 'translate(0, 0)', paddingLeft: '50%' }}
          initialDate={this.state.dateTime}
          initialTime={this.state.dateTime}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          onAccept={this.onAcceptHandler.bind(this)}
          onShow={this.onShow.bind(this)}
          onDismiss={this.onDismiss.bind(this)}
          // bodyStyle={timePickerBodyStyle}
          // format={timeFormat}
          // okLabel={okLabel}
          // autoOk={autoOkTimePicker}
          // style={timePickerDialogStyle}
          // minutesStep={minutesStep}
        />
      </div>
    );
  }
}
