import React from 'react';
import DateTimeRangePicker from '../../components/date-time-range-picker';
import { getStartOfMonth, subtractMonths } from '../../components/date-time-picker/date-utils';
import './index.scss';

export default class RangePickerPage extends React.Component {
  constructor() {
    super();
    this.state = {
      errorText: '',
      startTime: subtractMonths(new Date(), 1),
      endTime: new Date()
    };
  }
  render() {
    return (
      <DateTimeRangePicker
        key="date-time-picker"
        hintText="Time range"
        // showHintText={showDefaultValue}
        errorText={this.state.errorText}
        onAccept={this.onAccept.bind(this)}
        onChange={this.handleDateChange.bind(this)}
        startTime={this.state.startTime}
        endTime={this.state.endTime}
      />
    );
  }

  onAccept = (startTime, endTime) => {
    this.setState({
      startTime,
      endTime
    });
    const endTimeClone = new Date(endTime);
    if (subtractMonths(getStartOfMonth(endTimeClone), 1) > startTime) {
      this.setState({
        errorText: 'Start time and end time must be in two month nearby.'
      });
    } else if (startTime > endTime) {
      this.setState({
        errorText: 'Start time should be less than end time.'
      });
    } else {
      this.setState({
        errorText: ''
      });
    }
  };

  handleDateChange = () => {};
}
