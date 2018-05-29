import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Search from 'material-ui/svg-icons/action/search';

const styles = {
  barStyle: {
    display: 'flex',
    height: 46,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: 'solid 1px rgb(216, 216, 216)',
    borderRadius: null,
    boxShadow: null,
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  searchIcon: {
    width: '17.5px',
    height: '17.5px',
    marginLeft: '17px',
    marginRight: '17px'
  },
  searchHint: {
    width: '110px',

    opacity: '0.3',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontStretch: 'normal',
    textAlign: 'center',
    color: '#565656'
  },
  bodyStyle: {
    display: 'flex',
    alignItems: 'center'
  }
};

export default class SearchBar extends React.PureComponent {
  onKeyDown = event => {
    if (event.keyCode === 27) {
      this.setState({
        searchValue: '',
        dataView: null,
        hintText: this.props.hintText
      });
      return;
    }
    //enter
    if (event.keyCode === 13) {
      this.props.onSearchBarChange(event.target.value);
    }
  };
  /**
   *  set search_text value
   * @param event
   */
  handleChange = (event, newValue) => {
    let value = newValue;
    if (value) {
      this.setState({ hintText: '' });
    } else {
      this.setState({ hintText: this.props.hintText, searchValue: value });
      this.props.onSearchBarChange(newValue);
      return;
    }
    this.setState({
      searchValue: value
    });
    this.props.onSearchBarChange(value);
  };
  handleBlur = event => {
    console.info('handleBlur');
    let value = event.target.value;
    if (value.trim() === '') {
      // this.setState({dataView: null});
      return;
    }
    this.props.onSearchBarChange(value);
  };

  constructor(props) {
    super(props);
    this.state = {
      // data: this.props.data,
      searchValue: '',
      dataView: null,
      hintText: this.props.hintText
    };
  }

  render() {
    let totalStyle = Object.assign({}, styles.bodyStyle, this.props.componentStyle);

    return (
      <div>
        <Paper style={totalStyle}>
          <div style={styles.searchIcon}>
            <Search color="#000000" />
          </div>
          <TextField
            id="__searchBar"
            ref={item => (this.__searchBar = item)}
            value={this.state.searchValue}
            onChange={this.handleChange.bind(this)}
            /*  onBlur={this.handleBlur}*/
            inputStyle={(this.props.inputStyle, { marginLeft: '5px' })}
            underlineShow={false}
            hintText={this.state.hintText}
            hintStyle={Object.assign({}, styles.searchHint, this.props.hintStyle)}
            style={this.props.textFieldStyle}
            onKeyDown={this.onKeyDown}
          />
        </Paper>
      </div>
    );
  }
}

SearchBar.propTypes = {
  componentStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  underlineStyle: PropTypes.object,
  hintText: PropTypes.string,
  hintStyle: PropTypes.object,
  textFieldStyle: PropTypes.object,
  onSearchBarChange: PropTypes.func
};
