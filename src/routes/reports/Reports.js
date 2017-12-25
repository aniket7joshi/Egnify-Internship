import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reports.css';
import SingleButton from '../../components/Templates/SingleButton';
import axios from 'axios';
import Link from '../../components/Link';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const tableStyle = {
  borderRadius: '10px',
  margin: '10px',
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  maxWidth: '750px',
};

const tableRowStyle = {
  fontFamily: "'Raleway', 'Segoe UI', 'HelveticaNeue-Light', sans-serif",
  // cursor: 'pointer',
};

const tableContentRowColumnStyle1 = {
  height: '60px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '1em',
  width: '20%',
  textAlign: 'center',
};

const tableContentRowColumnStyle2 = {
  height: '60px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '1em',
  width: '80%',
  textAlign: 'center',
};

const tableHeaderColumnStyle1 = {
  verticalAlign: 'bottom',
  color: 'rgba(0, 0, 0, 0.9)',
  fontSize: '1.1em',
  width: '20%',
  textAlign: 'center',
};

const tableHeaderColumnStyle2 = {
  verticalAlign: 'bottom',
  color: 'rgba(0, 0, 0, 0.9)',
  fontSize: '1.1em',
  width: '80%',
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

const data = [
  {
    title: 'Overall Average',
    route: '/reports/overAllAverages/total',
  },
  {
    title: 'Campus Average',
    route: '/reports/overAllAverages/campus',
  },
  {
    title: 'Campus Subject Topper',
    route: '/reports/campusToppers/topper',
  },
  {
    title: 'Campus Topper',
    route: '/reports/campusToppers/campusTopper',
  },
  {
    title: 'Section Average',
    route: '/reports/sectionAverages/section',
  },
  {
    title: 'Section Overall Topper',
    route: '/reports/sectionAverages/sectionToppers',
  },
];

class Reports extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { data: undefined, open: false, loading: true, reports: false };
  }

  componentDidMount() {
    axios.get('/api/filesList/getList').then(response => {
      console.log(response);
      if (response.data.filedetails.length > 0)
        this.setState({ loading: false, reports: true });
    });
  }

  getTableRows() {
    return data.map((row, i) => (
      <TableRow key={i} style={tableRowStyle}>
        <TableRowColumn style={tableContentRowColumnStyle1}>
          {i + 1}
        </TableRowColumn>
        <TableRowColumn style={tableContentRowColumnStyle2}>
          <Link to={row.route} key={i} className={s.link2}>
            {row.title}
          </Link>
        </TableRowColumn>
      </TableRow>
    ));
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton label="Cancel" primary onClick={this.handleClose} />,
    ];

    return (
      <div className={s.root}>
          <div className={s.title}>
            Reports
          </div>
        <div className={s.container}>
          {this.state.loading && (
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
            </div>
          )}
          {!this.state.loading && !this.state.reports && (
            <SingleButton
              title="Nothing to display, please click the button to get started"
              buttonTitle="Upload Reports"
              buttonLink="/tests/newTest"
            />
          )}
          {!this.state.loading && this.state.reports && (
            <div>
              <br />
              <Table
                className={s.table}
                wrapperStyle={tableStyle}
              >
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow
                    style={{
                      fontFamily:
                        "'Raleway', 'Segoe UI', 'HelveticaNeue-Light', sans-serif",
                    }}
                  >
                    <TableHeaderColumn style={tableHeaderColumnStyle1}>
                      #
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableHeaderColumnStyle2}>
                      Report Name
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover>
                  {this.getTableRows()}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Reports);
