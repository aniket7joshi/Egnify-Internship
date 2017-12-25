import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NewTest.css';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import Link from '../../../components/Link';
import UploadedFile from '../../../components/UploadedFile';
import uploadMarksImage from './uploadMarks.svg';
import uploadErrorImage from './uploadError.svg';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import history from '../../../history';

const fieldStyle = {
  width: '100%',
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
  padding: '0px 10px 0px 10px',
  boxSizing: 'border-box',
};

class NewTest extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      testName: null,
      open: false,
      marksFile: undefined,
      errorFile: undefined,
      currentFile: undefined,
    };
  }

  handleUploadFile = event => {
    // console.log(event.target.files[0]);

    const data = new FormData();
    data.append('errorReport', event.target.files[0]);
    data.append('markingSchema', event.target.files[0]);
    data.append('testname', this.state.testName);
    // data.append('description', 'some value user types');
    // '/files' is your node.js route that triggers our middleware
    axios.post('/api/students/populateDb', data).then(response => {
      console.error(response); // do something with the response
    });
  };

  handleSubmit = event => {
    const data = new FormData();
    data.append('files', event.target.errorReport.files[0]);
    data.append('files', event.target.markingSchema.files[0]);
    data.append('testname', this.state.testName);
    data.append('description', 'some value user types');
    // '/files' is your node.js route that triggers our middleware
    axios.post('/api/masterResults/populateDb', data).then(response => {
      window.location.href = '/tests/uploaded';
    }).catch(reponse => {
      window.location.href = '/tests/uploadError';      
    });
    event.preventDefault();
  };

  handleChange = (event, index, value) => this.setState({ value });

  handleOpen = fileName => {
    this.setState({ open: true, currentFile: fileName });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMarksChange = evt => {
    // console.log(this.refs.markingSchema.files);
    this.setState({ marksFile: this.refs.markingSchema.files[0].name });
  };

  handleErrorChange = evt => {
    // console.log(this.refs.errorReport.files[0].name);
    this.setState({ errorFile: this.refs.errorReport.files[0].name });
  };

  render() {
    const actions = [
      <FlatButton
        label="Yes"
        primary
        onClick={() => {
          this.handleClose();
          if (this.state.currentFile === 'marksFile')
            this.setState({ marksFile: undefined });
          if (this.state.currentFile === 'errorFile')
            this.setState({ errorFile: undefined });
        }}
      />,
      <FlatButton
        label="No"
        primary
        onClick={() => {
          this.handleClose();
          console.log('Pressed No');
        }}
      />,
    ];

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.title}>
            Please choose the following to upload reports
          </div>
        </div>
        <div className={s.formContainer}>
          <div className={s.field}>
            Enter Test Name <br />
            <TextField
              hintText="Enter test name"
              onChange={this.handleTest}
              underlineShow={false}
              onChange={(event, newValue) => this.setState({ testName: newValue })}
              style={fieldStyle}
            />
            <br /> <br />
            Select Test Type <br />
            <SelectField
              hintText="Select test type"
              value={this.state.value}
              underlineShow={false}
              onChange={this.handleChange}
              style={fieldStyle}
              selectedMenuItemStyle={{ color: '#592dea' }}
            >
              <MenuItem value={1} primaryText="JEE Advance" />
              <MenuItem value={2} primaryText="JEE Advance 1" />
              <MenuItem value={3} primaryText="JEE Advance 2" />
            </SelectField>
            <br />
            Select Test Date <br />
            <DatePicker
              hintText="Select test date"
              underlineShow={false}
              dialogContainerStyle={{ color: 'green' }}
              style={fieldStyle}
            />
            <br />
            <div className={s.uploadIconLeft}>
              <img
                src={uploadMarksImage}
                className={s.uploadMarksIcon}
                onClick={() => this.refs.markingSchema.click()}
              />
              <div className={s.iconText}>Upload Marks Report</div>
            </div>
            <div className={s.uploadIconRight}>
              <img
                src={uploadErrorImage}
                className={s.uploadErrorIcon}
                onClick={() => this.refs.errorReport.click()}
              />
              <div className={s.iconText}>Upload Error Report</div>
            </div>
            <br /> <br /> <br /> <br />
          </div>
        </div>
        <div className={s.uploadSection}>
          {
            this.state.marksFile &&
            <UploadedFile
              text={`Uploaded: ${this.state.marksFile}`}
              callback={() => this.handleOpen('marksFile')}
            />
          }
          {
            this.state.errorFile &&
            <UploadedFile
              text={`Uploaded: ${this.state.errorFile}`}
              callback={() => this.handleOpen('errorFile')}
            />
          }
        </div>

        <div className={s.formContainer}>
          <div className={s.field}>
            <Dialog
              actions={actions}
              modal
              contentStyle={{
                width: '300px',
              }}
              open={this.state.open}
            >
              Are you sure to delete this file?
            </Dialog>

            <form onSubmit={this.handleSubmit}>
              <label htmlFor="errorReport">
                <input
                  ref="errorReport"
                  id="errorReport"
                  type="file"
                  accept=".csv"
                  onChange={this.handleErrorChange}
                />
              </label>

              <label htmlFor="markingSchema">
                <input
                  ref="markingSchema"
                  id="markingSchema"
                  type="file"
                  accept=".csv"
                  onChange={this.handleMarksChange}
                />
              </label>

              <input type="submit" className={s.button} value="Submit" />
            </form>

            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(NewTest);
