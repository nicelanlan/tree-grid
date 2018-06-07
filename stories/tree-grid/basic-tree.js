import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withInfo } from '@storybook/addon-info';
import Tree from '../../src/components/tree';
import { multipleDataList } from './data/multiple';

const columns = [
  {
    dataIndex: 'name',
    text: 'name'
    // width: 200
  },
  {
    dataIndex: 'desc',
    text: 'desc'
    // width: 100
  },
  {
    dataIndex: 'operator',
    width: 100,
    renderer: value => {
      return <button onClick={() => console.log(value)}>BUTTON</button>;
    }
  }
];

class BasicTree extends React.Component {
  state = {
    dataSource: [],
    expanded: true,
    toggleExpanded: true
  };
  render() {
    return (
      <div className="story-demo">
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <div>
              <button onClick={this.onCollapseClickHandler}>Collapse All</button>
              <button onClick={this.onExpandClickHandler}>Expanded All</button>
            </div>
            <Tree
              // className="tree-container"
              // defaultValue={[3, 4]}
              dataSource={this.state.dataSource}
              // dataSource={[singleDataList.data]}
              columns={columns}
              // // valueColumn={'id'}
              expanded={this.state.expanded}
              toggleExpanded={this.state.toggleExpanded}
              // treeStyle={{}}
              // arrowIconStyle={{
              //   marginRight: 0,
              //   height: 24,
              //   width: 24
              // }}
              // nodeStyle={{
              //   paddingLeft: 40,
              //   nodeHeight: 40,
              //   fontSize: 16
              // }}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        dataSource: multipleDataList
      });
    }, 2000);
    // setTimeout(() => this.setState({ expanded: false }), 3000);
    // setTimeout(() => this.setState({ expanded: true }), 5000);
  }

  onCollapseClickHandler = () =>
    this.setState(prevState => {
      return { expanded: false, toggleExpanded: !prevState.toggleExpanded };
    });
  onExpandClickHandler = () =>
    this.setState(prevState => {
      return { expanded: true, toggleExpanded: !prevState.toggleExpanded };
    });
}

export default withInfo()(() => <BasicTree />);
