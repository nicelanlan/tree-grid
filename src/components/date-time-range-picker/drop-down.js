import React from 'react';
import classnames from 'classnames';
import RaisedButton from 'material-ui/RaisedButton';
import DateTimePicker from '../date-time-picker';
import OutsideClick from '../utils/outside-click';

const prefix = 'range-picker-dropdown';

const STYLES = {
  dateTimePicker: {
    display: 'inline-block'
  }
};
export default class DropDown extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateTimePickerOpened: false
    };
  }

  handleRequestClose = () => {
    this.props.onClose && this.props.onClose();
  };
  onCancelClickHandler = () => {
    this.handleRequestClose();
  };
  onOkClickHandler = () => {
    this.props.onApply && this.props.onApply();
  };
  onStartPickerAccept = date => {
    this.props.onAccept && this.props.onAccept(date, this.props.endTime);
  };
  onEndPickerAccept = date => {
    this.props.onAccept && this.props.onAccept(this.props.startTime, date);
  };
  onClickOutside = () => {
    if (!this.state.dateTimePickerOpened) {
      this.handleRequestClose();
    }
  };
  onDateTimePickerShow = () => {
    this.setState({
      dateTimePickerOpened: true
    });
  };
  onDateTimePickerDismiss = () => {
    this.setState({
      dateTimePickerOpened: false
    });
  };
  render() {
    const display = this.props.open ? 'block' : 'none';
    return (
      <div className={prefix} style={{ display }}>
        <OutsideClick onClickOutside={this.onClickOutside.bind(this)}>
          <div className={`${prefix}__content`}>
            <p className={`${prefix}__title`}>Time range</p>
            <div className={`${prefix}__separate`} />
            <div className={`${prefix}__start`}>
              <DateTimePicker
                className={`${prefix}__datepicker`}
                errorText={this.props.errorText}
                dateTime={this.props.startTime}
                hintText="From"
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                textFieldStyle={STYLES.dateTimePicker}
                onAccept={this.onStartPickerAccept.bind(this)}
                onShow={this.onDateTimePickerShow.bind(this)}
                onDismiss={this.onDateTimePickerDismiss.bind(this)}
              />
            </div>
            <div className={`${prefix}__end`}>
              <DateTimePicker
                className={classnames(`${prefix}__datepicker`, {
                  [`${prefix}__datepicker-error`]: this.props.errorText
                })}
                errorText={this.props.errorText}
                dateTime={this.props.endTime}
                hintText="To"
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                textFieldStyle={STYLES.dateTimePicker}
                onAccept={this.onEndPickerAccept.bind(this)}
                onShow={this.onDateTimePickerShow.bind(this)}
                onDismiss={this.onDateTimePickerDismiss.bind(this)}
              />
              {this.props.errorText && (
                <p className={`${prefix}__error-text`}>{this.props.errorText}</p>
              )}
            </div>
            <div className={`${prefix}__separate`} />
            <div className={`${prefix}__btns`}>
              <RaisedButton
                className={`${prefix}__btn`}
                key="datetimepickerdropdown0"
                label="Cancel"
                labelStyle={{ color: '#4d4d4e' }}
                primary={true}
                onClick={this.onCancelClickHandler}
              />
              <RaisedButton
                className={`${prefix}__btn`}
                className={classnames(`${prefix}__btn`, {
                  [`${prefix}__btn-error`]: this.props.errorText
                })}
                key="datetimepickerdropdown1"
                disabled={
                  (!this.props.startTime && !this.props.endTime) || this.props.errorText !== ''
                }
                disabledLabelColor="#999"
                label="Apply"
                labelStyle={{ color: '#4d4d4e' }}
                primary={true}
                onClick={this.onOkClickHandler}
              />
            </div>
          </div>
        </OutsideClick>
      </div>
    );
  }
}
