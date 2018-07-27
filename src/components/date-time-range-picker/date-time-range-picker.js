import React from 'react';
import dateformat from 'dateformat';
import { TextField } from 'material-ui';
import DropDown from './drop-down';

export default class DateTimeRangePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dropDownOpen: false,
      startTime: props.startTime ? props.startTime : new Date(),
      endTime: props.endTime ? props.endTime : new Date(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.startTime.getTime() !== nextProps.startTime.getTime() ||
      this.props.endTime.getTime() !== nextProps.endTime.getTime()
    ) {
      this.setState({
        startTime: nextProps.startTime,
        endTime: nextProps.endTime,
      });
    }
  }

  openDropDown = e => {
    e.preventDefault();
    this.setState({
      dropDownOpen: true,
    });
  };
  closeDropDown = () => {
    this.setState({
      dropDownOpen: false,
    });
  };

  getDisplayTime = () => {
    const { startTime, endTime } = this.state;

    return `${dateformat(startTime, 'dd-mm-yyyy HH:MM:ss')} - ${dateformat(
      endTime,
      'dd-mm-yyyy HH:MM:ss',
    )}`;
  };

  onAccept = (startTime, endTime) => {
    this.setState({
      startTime: startTime,
      endTime: endTime,
    });
    this.props.onAccept && this.props.onAccept(startTime, endTime);
  };

  onApply = () => {
    this.setState({
      dropDownOpen: false,
    });
    this.props.onChange &&
      this.props.onChange(
        dateformat(this.state.startTime, 'yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\''),
        dateformat(this.state.endTime, 'yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\''),
      );
  };

  render() {
    return (
      <div>
        <TextField
          id="date-time-picker-textfield"
          className="range-picker-textfield"
          onClick={this.openDropDown}
          value={this.props.showHintText ? '' : this.getDisplayTime()}
          hintText={this.props.hintText}
          // style={{ ...STYLES.textField }}
        />
        <DropDown
          open={this.state.dropDownOpen}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          errorText={this.props.errorText}
          onClose={this.closeDropDown.bind(this)}
          onAccept={this.onAccept.bind(this)}
          onApply={this.onApply.bind(this)}
        />
      </div>
    );
  }
}
