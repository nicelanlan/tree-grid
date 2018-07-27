import React, { Component } from 'react';

// import TreeSelect from './components/tree-select';
import Tree from '../../components/tree';
import { multipleDataList } from '../../data/multiple';

class TreePage extends Component {
  state = {
    dataSource: [],
    expanded: true,
    toggleExpanded: true
  };
  afterSelect(value) {
    console.log('you select value is ', value);
  }
  render() {
    const columns = [
      {
        dataIndex: 'name',
        text: 'name',
        width: 200
      },
      {
        dataIndex: 'desc',
        text: 'desc',
        width: 200
      }
    ];
    // const searchBar = {
    //   componentStyle: {
    //     margin: '10px 16px 18px',
    //   },
    //   inputStyle: {},
    //   textFieldStyle: {
    //     width: '100%',
    //   },
    //   hintText: 'search',
    //   hintStyle: {
    //     fontFamily: 'Roboto',
    //     fontStyle: 'normal',
    //     fontSize: 16,
    //     color: 'rgba(0, 0, 0, 0.38)',
    //   },
    //   searchFn: this.searchFn,
    // };
    // const treePageProps = {
    //   className: 'treePage-container',
    //   defaultValue: [3, 4],
    //   dataSource: multipleDataList,
    //   columns: columns,
    //   valueColumn: 'id',
    //   // expanded: true,
    //   // checked: false,
    //   // singleSelectable: true,
    //   multiSelectable: true,
    //   branchNodeSelectable: true,
    //   treeStyle: {
    //     margin: '0 16px',
    //   },
    //   arrowIconStyle: {
    //     marginRight: 0,
    //     height: 24,
    //     width: 24,
    //   },
    //   singleSelectIconStyle: {},
    //   multiSelectIconStyle: {},
    //   nodeStyle: {
    //     paddingLeft: 40,
    //     height: 80,
    //     fontSize: 16,
    //   },
    //   checkedColor: '#ee0000',
    //   uncheckedColor: '#999999',
    // };
    return (
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

export default TreePage;
