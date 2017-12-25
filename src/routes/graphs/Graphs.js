import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graphs.css';
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
import xlsIcon from "./downloadIcon.svg";
import { PieChart, Pie, Sector, Cell } from 'recharts';
import jsPDF from 'jspdf';
// import 'd3plus/d3plus.js';

// var d3 = require("d3");
// var d3plus = require("d3plus");
var fileDownload = require('react-file-download');

const COLORS = ['#4CAF50', '#F44336', '#0088FE'];
const fieldStyle = {
  // width: '12em',
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
  padding: '0px 10px 0px 10px',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  margin: '5px',
  fontSize: '0.9em',
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


class Graphs extends React.Component {
  static propTypes = {
    // title: PropTypes.string.isRequired,
    // api: PropTypes.string.isRequired,
    // testName: PropTypes.string.isRequired,
    // reportName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      // heading: null,
      // eheading: null,
      filters: [
			  {
			    name: 'Campus Name',
			    var: 'campus_name',
			    selected: [],
			  },
			  {
			    name: 'Section Name',
			    var: 'section_name',
			    selected: [],
			  },
			  {
			    name: 'Student Name',
			    var: 'student_name',
			    selected: [],
			  },
			],
      Physics: [],
      Chemistry: [],
      Maths: [],
      // efilters: null,
    };
  }

  // populateTable(data) {
  //   let keys = Object.keys(data[0]);
  //   let header = [];
  //   let eheader = [];
  //   let filters = [];
  //   for (let heading of headings) {
  //     let encoded = heading.toLowerCase().replace(/ /g,"_");
  //     if (keys.indexOf(encoded) > -1) {
  //       eheader.push(encoded);
  //       header.push(heading);
  //     }
  //     if (typeof(data[0][encoded]) === 'string') {
  //       filters.push({
  //         name: heading,
  //         var: encoded,
  //         selected: [],
  //       });
  //     }
  //   }
  //   this.setState({heading: header, eheading: eheader, filters});
  // }

  getGraph(params) {
    let self = this;
    axios.get('/api/graphData/data').then(function(response) {
      self.setState({loading: false, data: response.data});
      console.log(response);
    });
    axios.get('/api/getData/fetchData', {params}).then(response => {
      let charts = response.data;
      // console.log(Object.keys(self.state.charts));
      let newState = {
        Physics: [],
        Chemistry: [],
        Maths: [],
      };
      // Object.keys(self.state.charts).map(function(key, i) {
        // self.state.charts[key] = [];
      // })

      console.log(response);
      // console.log(newCharts);

      charts.map(function(chart, i) {
        let subject = chart.group;
        if (subject in newState)
          newState[subject].push({
            name: chart.name,
            value: chart.value,
          })
      });

      self.setState(newState);
      console.log(self.state);
      // console.log(newState);
      // this.setState({loading: false, data: response.data});
        // console.log(response);
      // if (response.data.length > 0) {
      //   console.log(response);
      //   response.data = response.data.map(function(obj) {
      //     obj.visible = true;
      //     return obj;
      //   })
      //   this.setState({data: response.data});
      //   this.populateTable(response.data);
      // }
    });
  }

  componentDidMount() {
    // console.log(Recharts);
    this.getGraph({
      campus: null,
      section: null,
      student: null,
    })
  }

  filterItems() {
    // let {data, filters} = this.state;
    // data = data.map(function(row, i) {
    //   row.visible = filters.reduce(function(ans, filter) {
    //     return ans && (filter.selected.length === 0 || filter.selected.indexOf(row[filter.var]) > -1);
    //   }, true);
    // })
  }

  handleChange(event, index, values, i) {
    let newState = this.state;
    newState.filters[i].selected = values;
    this.setState(newState);
    this.filterItems();
    let params = {
      campus: newState.filters[0].selected,
      section: newState.filters[1].selected,
      student: newState.filters[2].selected,
    };
    this.getGraph(params);
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
        <MenuItem value={item} primaryText={item} />
      );
    });
  }

  getFilters() {
    let self = this;
    return this.state.filters.map(function(filter, i) {
      let efilter = filter.var;
      return (
        <SelectField
          // multiple={true}
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

  // getHeadings() {
  //   let {heading} = this.state;
  //   return heading && heading.map(function(heading, i) {
  //     return (
  //       <TableHeaderColumn key={i} style={tableHeaderColumnStyle}>{heading}</TableHeaderColumn>
  //     );
  //   })
  // }

  // getRow(row, i) {
  //   let {eheading} = this.state;
  //   return eheading && eheading.map(function(elem, j) {
  //     return (
  //       <TableRowColumn key={j} style={tableContentRowColumnStyle}>{typeof(row[elem]) === 'number' ? row[elem].toFixed(2) : row[elem]}</TableRowColumn>
  //     );
  //   });
  // }

  // getRows() {
  //   let self = this;
  //   let {data} = this.state;
  //   return data && data.map(function(row, i) {
  //     return (
  //         row.visible ?
  //         <TableRow key={i} style={tableRowStyle} >
  //           {self.getRow(row, i)}
  //         </TableRow> :
  //         null
  //     );
  //   });
  // }

  downloadFile = (event) => {
    console.log("ASDF");
    if (this.state.filters[2].selected.length > 0) {
    }
    else {
    	axios.get(
    	  '/api/download/pdf',
    	  { params: {
    	    testName: "campus",
    	  }},
    	)
    	.then(response => {
    	  console.error(response);
    	  fileDownload(response.data, "Overall Average Report.csv");
    	})
    	.catch(error => {
    	  console.log(error);
    	});

    }
    event.preventDefault();
  }

  downloadPDF() {
    var doc = new jsPDF();

    var specialElementHandlers = {
     '#editor': function(element, renderer){
      return true;
     }
    };

    var x = document.getElementById('app');

    console.log(x);
    doc.fromHTML(x, 15, 15, {
     'width': 170, 
     'elementHandlers': specialElementHandlers
    });

    doc.save('Report.pdf');
  }

  render() {
    let self = this;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.title}>
            Graphs
          </div>
          <div className={s.downloadIcon}>
            <img src={xlsIcon} onClick={() => this.downloadPDF()}/>
          </div>
          {
            self.state.loading ?
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
              <div className={s.chartsContainer}>
	              <div>
	              <PieChart width={260} height={350} onMouseEnter={this.onPieEnter} className={s.piechart}>
	                <Pie
	                  data={this.state.Physics} 
	                  cx={120} 
	                  cy={200} 
	                  innerRadius={60}
	                  outerRadius={80} 
	                  fill="#8884d8"
	                  paddingAngle={5}
	                  label={true}
	                  labelLine={false}
	                >
	                  {
	                    self.state.Physics.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
	                  }
	                </Pie>
	              </PieChart>
	              	<br/>Physics
	              </div>
	              <div>
	              <PieChart width={260} height={350} onMouseEnter={this.onPieEnter} className={s.piechart}>
	                <Pie
	                  data={this.state.Chemistry} 
	                  cx={120} 
	                  cy={200} 
	                  innerRadius={60}
	                  outerRadius={80} 
	                  fill="#8884d8"
	                  paddingAngle={5}
	                  label={true}
	                  labelLine={false}
	                >
	                  {
	                    self.state.Chemistry.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
	                  }
	                </Pie>
	              </PieChart>
	              	<br/>Chemistry
	              </div>
	              <div>
	              <PieChart width={260} height={350} onMouseEnter={this.onPieEnter} className={s.piechart}>
	                <Pie
	                  data={this.state.Maths} 
	                  cx={120} 
	                  cy={200} 
	                  innerRadius={60}
	                  outerRadius={80} 
	                  fill="#8884d8"
	                  paddingAngle={5}
	                  label={true}
	                  labelLine={false}
	                >
	                  {
	                    self.state.Maths.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
	                  }
	                </Pie>
	              </PieChart>
	              	<br/>Maths
	              </div>
	            </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Graphs);
