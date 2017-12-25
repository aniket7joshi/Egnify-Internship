/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewReport.css';
import axios from 'axios';
import RefreshIndicator from 'material-ui/RefreshIndicator';
// import history from '../../../history';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import xlsIcon from "../../components/ViewReport/downloadIcon.svg";

var fileDownload = require('react-file-download');

const fieldStyle = {
  // width: '12em',
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
  padding: '0px 10px 0px 10px',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  margin: '5px',
  fontSize: '0.9em',
};

const tableStyle = {
  borderRadius: '10px',
  margin: '10px',
  // width: '100%',
  overflowX: 'hidden',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  // maxWidth: '750px',
}

const tableRowStyle = {
  fontFamily: "'Raleway', 'Segoe UI', 'HelveticaNeue-Light', sans-serif",
  // overflowX: 'auto',
  // overflowX: 'hidden',
  // cursor: 'pointer',
};

const tableContentRowColumnStyle = {
  height: '60px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '0.8em',
  textAlign: 'center',
};

const tableHeaderColumnStyle = {
  overflowX: 'hidden',
  verticalAlign: 'bottom',
  color: 'rgba(0, 0, 0, 0.9)',
  fontSize: '0.8em',
  textAlign: 'center',
};


const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

const headings = [
	'Campus Name',
	'Section Name',
	'Number of Students',
	'Rank',
	'Student Name',
  'Physics',
  'Chemistry',
  'Maths',
  'Total',
  'Subject',
  'Marks',
];


class ViewReport extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    api: PropTypes.string.isRequired,
    // testName: PropTypes.string.isRequired,
    reportName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      heading: null,
      eheading: null,
      filters: null,
      efilters: null,
    };
  }

  populateTable(data) {
  	let keys = Object.keys(data[0]);
    let header = [];
    let eheader = [];
    let filters = [];
  	for (let heading of headings) {
  		let encoded = heading.toLowerCase().replace(/ /g,"_");
  		if (keys.indexOf(encoded) > -1) {
        eheader.push(encoded);
  			header.push(heading);
      }
      if (typeof(data[0][encoded]) === 'string') {
        filters.push({
          name: heading,
          var: encoded,
          selected: [],
        });
      }
  	}
    this.setState({heading: header, eheading: eheader, filters});
  }

  componentDidMount() {
    console.log(this.props);
    axios.get(this.props.api).then(response => {
      this.setState({loading: false});
      if (response.data.length > 0) {
      	console.log(response);
        response.data = response.data.map(function(obj) {
          obj.visible = true;
          return obj;
        })
        this.setState({data: response.data});
        this.populateTable(response.data);
      }
    });
  }

  filterItems() {
    let {data, filters} = this.state;
    data = data.map(function(row, i) {
      row.visible = filters.reduce(function(ans, filter) {
        return ans && (filter.selected.length === 0 || filter.selected.indexOf(row[filter.var]) > -1);
      }, true);
    })
  }

  handleChange(event, index, values, i) {
    let newState = this.state;
    newState.filters[i].selected = values;
    this.setState(newState);
    this.filterItems();
  };

  getFilterItems(filter) {
    let {filters, data} = this.state;
    let items = data.map(function(row, i) {
      return (
        filters.reduce(function(ans, cfilter) {
          return ans && (cfilter.var === filter.var || cfilter.selected.length === 0 || cfilter.selected.indexOf(row[cfilter.var]) > -1);
        }, true) ? 
        row[filter.var] :
        null
      );
    });
    items = items.sort();
    let set = [...new Set(items)]
    return set.map(function(item, i) {
      return (
        <MenuItem value={item} primaryText={item} key={i}/>
      );
    });
  }

  getFilters() {
    let self = this;
    return this.state.filters && this.state.filters.map(function(filter, i) {
      let efilter = filter.var;
      return (
        <SelectField
          multiple={true}
          hintText={filter.name}
          style={fieldStyle}
          value={self.state.filters[i].selected}
          underlineShow={false}
          onChange={(evt, idx, vals) => self.handleChange(evt, idx, vals, i)}
          key={i}
        >
          {self.getFilterItems(filter)}
        </SelectField>
      );
    });
  }

  getHeadings() {
  	let {heading} = this.state;
    return heading && heading.map(function(heading, i) {
      return (
        <TableHeaderColumn key={i} style={tableHeaderColumnStyle}>{heading}</TableHeaderColumn>
      );
    })
  }

  getRow(row, i) {
  	let {eheading} = this.state;
    return eheading && eheading.map(function(elem, j) {
      return (
        <TableRowColumn key={j} style={tableContentRowColumnStyle}>{typeof(row[elem]) === 'number' ? row[elem].toFixed(2) : row[elem]}</TableRowColumn>
      );
    });
  }

  getRows() {
    let self = this;
    let {data} = this.state;
    return data && data.map(function(row, i) {
      return (
          row.visible ?
          <TableRow key={i} style={tableRowStyle} >
            {self.getRow(row, i)}
          </TableRow> :
          null
      );
    });
  }

  downloadFile = (event) => {
    axios.get(
    	'/api/download/download',
    	{ params: {
 				testName: this.props.reportName.replace(/ /g, '_'),
    	}},
    )
    .then(response => {
      console.error(response);
      fileDownload(response.data, this.props.reportName + '.csv');
    })
    .catch(error => {
      console.log(error);
    });
    event.preventDefault();
  }

  render() {
  	let {reportName} = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.title}>
            {reportName}
          </div>
          <div className={s.downloadIcon}>
          	<img src={xlsIcon} onClick={this.downloadFile}/>
          </div>
          {
            this.state.loading ?
            <div className={s.loadingContainer}>
              <RefreshIndicator
                percentage={100}
                size={40}
                left={0}
                top={0}
                color="red"
                status="loading"
                style={style.refresh}
              />
            </div> :
            <div className={s.pageContent}>
              <div className={s.filtersContainer}>
                {this.getFilters()}
              </div>
              <div>
                <Table className={s.table} wrapperStyle={tableStyle} onCellClick={rowNumber => console.log(rowNumber)}>
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow style={{ fontFamily: "'Raleway', 'Segoe UI', 'HelveticaNeue-Light', sans-serif" }} >
                      {this.getHeadings()}
                    </TableRow>
                  </TableHeader>
                  <TableBody
                    displayRowCheckbox={false}
                    showRowHover={true}
                  >
                    {this.getRows()}
                  </TableBody>
                </Table>
              </div>            
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ViewReport);
