import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewReports.css';
import axios from 'axios';
import Link from '../../../components/Link';
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
};

const tableContentRowColumnStyle = {
  height: '60px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontSize: '1em',
};

const tableHeaderColumnStyle = {
  verticalAlign: 'bottom',
  color: 'rgba(0, 0, 0, 0.9)',
  fontSize: '1.1em',
};

class ViewReports extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { data: undefined };
  }

  componentDidMount() {
    // axios.get('/api/filesList/getList').then(response => {
    // if (response.data.length > 0)
    // this.setState({ data: response.data});
    // console.log(response); // do something with the response
    // });
  }

  getTableRows() {
    return this.state.data.map((row, i) => (
      <TableRow key={i} style={tableRowStyle}>
        <TableRowColumn style={tableContentRowColumnStyle}>
          {row.filename}
        </TableRowColumn>
        <TableRowColumn style={tableContentRowColumnStyle}>
          04/11/2017
        </TableRowColumn>
        <TableRowColumn style={tableContentRowColumnStyle}>
          {row.check ? (
            <div className={s.tick}>
              <img
                src={tick}
                style={{
                  position: 'relative',
                  height: '9px',
                  top: '-1px',
                  left: '5px',
                }}
              />
            </div>
          ) : (
            <div className={s.cross}>
              <img
                src={cross}
                style={{
                  position: 'relative',
                  height: '12px',
                  top: '-2px',
                  left: '6px',
                }}
              />
            </div>
          )}
        </TableRowColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {this.state.data === undefined && (
            <SingleButton
              title="Nothing to display, please click the button to get started"
              buttonTitle="Upload Reports"
              buttonLink="/tests/newTest"
            />
          )}
          {this.state.data && (
            <div>
              <br />
              <div className={s.button}>
                <Link to="/tests/newTest" className={s.link}>
                  Upload Reports
                </Link>
              </div>
              <br /> <br />
              <Table className={s.table} wrapperStyle={tableStyle}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow style={tableRowStyle}>
                    <TableHeaderColumn style={tableHeaderColumnStyle}>
                      Name
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableHeaderColumnStyle}>
                      Date Uploaded
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableHeaderColumnStyle}>
                      Report Generated
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

export default withStyles(s)(ViewReports);
