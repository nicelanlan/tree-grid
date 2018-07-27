import React from 'react';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DateTimePicker from '../date-time-picker';

export default class RangePicker extends React.Component {
  constructor() {
    super();
    this.state = {
      dateValue: null,
      timeValue: null
    };
  }

  onDateChange = (event, date) => {
    console.log('date change==', date);
    this.setState({
      dateValue: date
    });
  };

  onTimeChange = (event, date) => {
    console.log('time change==', date);
    const dateValue = this.state.dateValue;
    this.setState({
      timeValue: new Date(
        dateValue.getFullYear(),
        dateValue.getMonth() + 1,
        dateValue.getDate(),
        date.getHours(),
        date.getMinutes()
      )
    });
  };

  render() {
    return (
      <div>
        <DateTimePicker
          hintText="Select"
          value={new Date()} // picker value moment/string/number/js Date
          format="MMM DD, YYYY hh:mm A"
          timePickerDelay={300}
          returnMomentDate={false} // if true will return moment object
          className="datetime-container"
          textFieldClassName="datetime-input"
          name="picker" // form value name
          datePickerMode="portrait" // or landscape
          openToYearSelection={false}
          disableYearSelection={false}
          hideCalendarDate={false}
          firstDayOfWeek={1}
          minutesStep={1}
          showCurrentDateByDefault={false}
          clearIcon={<ClearIcon />} // set null to not render nothing
          // available callbacks
          onChange={() => {}}
          onTimePickerShow={() => {}}
          onDatePickerShow={() => {}}
          onDateSelected={() => {}}
          onTimeSelected={() => {}}
          shouldDisableDate={() => {}}
          DatePicker={DatePickerDialog}
          TimePicker={TimePickerDialog}
          // styles
          clearIconStyle={{}}
          textFieldStyle={{}}
          style={{}} // root
          timePickerBodyStyle={{}}
        />
      </div>
    );
  }
}
