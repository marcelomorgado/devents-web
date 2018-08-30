import EmbarkJS from 'Embark/EmbarkJS';
import TicketStore from 'Embark/contracts/TicketStore';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import { CssBaseline, Button, Typography, Grid, TextField, FormControlLabel, Checkbox, Input } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import dateFormat from 'dateformat';
import { withSnackbar } from 'material-ui-snackbar-provider'

const styles = theme => ({
  input: {
    display: 'none',
  },
});

ValidatorForm.addValidationRule('isDatetime', (value) => {
  var regEx = /^\d{4}-\d{2}-\d{2}\ \d{2}\:\d{2}$/;
  return value.match(regEx) != null;

});

class DEventForm extends React.Component {

  constructor(props){
      super(props);

      this.action = (props.dEvent) ? 'EDIT' : 'CREATE';

      this.imageFileInput;

      this.state = {
        title: "",
        shortInfo: "",
        url: "",
        start: "",
        end: "",
        price: ""
      };

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
  }


  componentDidMount() {

    if(this.action === 'CREATE')
      return;

    const { dEvent } = this.props;

    let startDate = new Date(Number(dEvent.start)*1000);
    let endDate = new Date(Number(dEvent.end)*1000);

    this.setState({
      title: dEvent.title,
      shortInfo: dEvent.shortInfo,
      url: dEvent.url,
      start: dateFormat(startDate, "yyyy-mm-dd hh:MM"), //2018-10-10 10:00
      end: dateFormat(endDate, "yyyy-mm-dd hh:MM"),
      price: web3.utils.fromWei(dEvent.price, 'ether')
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.action === 'CREATE') {
      this.handleCreation();
    } else {
      this.handleEdition();
    }
  }

  handleCreation() {

    new Promise((resolve, reject) => {
      if(this.imageFileInput != null)
        resolve(EmbarkJS.Storage.uploadFile(this.imageFileInput));
      else
        resolve("QmUwZjYy5JYaAVwF3WXSQmasPK4KhdiVpWLVXxa4ewk7EV");
    })
    .then((_fileHash) => {
      TicketStore.methods.createDEvent(
        this.state.title,
        _fileHash,
        this.state.shortInfo,
        this.state.url,
        new Date(this.state.start).getTime()/1000,
        new Date(this.state.end).getTime()/1000,
        web3.utils.toWei(this.state.price, 'ether')
      )
      .send({from: web3.eth.defaultAccount})
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber == 1) {
          this.props.snackbar.showMessage('Transaction confirmed', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+receipt.transactionHash, "_blank"));
          this.props.afterSubmit();
        }
      })
      .on("transactionHash", txHash => {
        this.props.snackbar.showMessage('Transaction sent', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+txHash, "_blank"));
        this.props.afterSubmit();
      });
    }).catch((err) => {
      if(err){
        this.props.snackbar.showMessage("Error => " + err.message);
      }
    });
  }

  handleEdition() {

    new Promise((resolve, reject) => {
      if(this.imageFileInput != null)
        resolve(EmbarkJS.Storage.uploadFile(this.imageFileInput));
      else
        resolve(this.props.dEvent.imageHash);
    })
    .then((_fileHash) => {
      TicketStore.methods.updateDEvent(
        this.props.dEvent.id,
        this.state.title,
        _fileHash,
        this.state.shortInfo,
        this.state.url,
        new Date(this.state.start).getTime()/1000,
        new Date(this.state.end).getTime()/1000,
        web3.utils.toWei(this.state.price, 'ether')
      )
      .send({from: web3.eth.defaultAccount})
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber == 1) {
          this.props.snackbar.showMessage('Transaction confirmed', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+receipt.transactionHash, "_blank"));
          this.props.afterSubmit();
        }
      })
      .on("transactionHash", txHash => {
        this.props.snackbar.showMessage('Transaction sent', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+txHash, "_blank"));
        this.props.afterSubmit();
      });
    }).catch((err) => {
      if(err){
        this.props.snackbar.showMessage("Error => " + err.message);
      }
    });
  }

  handleFileUpload(e){
    this.imageFileInput = [e.target];
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { classes } = this.props;
    const { title, shortInfo, url, start, end, price} = this.state;

    return (
      <React.Fragment>
        <Typography variant="display1" align="center">
          {this.props.dEvent ?
            'Edit Event'
            :
            'Create an Event'
          }

        </Typography>
        <Typography variant="title" gutterBottom>
        </Typography>
        <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
        >
          <Grid container spacing={24}>
            <Grid item xs={12} >
            </Grid>
            <Grid item xs={12} >
              <input
                accept="image/*"
                className={classes.input}
                id="flat-button-file"
                multiple
                type="file"
                onChange={(e) => this.handleFileUpload(e)}
              />
              <label htmlFor="flat-button-file">
                <Button
                  fullWidth
                  size="small"
                  component="span"
                  color="default"
                  variant="contained"
                >
                  Upload Cover Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} >
              <TextValidator
                name="title"
                value={title}
                label="Event Title"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} >
              <TextValidator
                name="shortInfo"
                value={shortInfo}
                label="Short Info"
                fullWidth
                multiline={true}
                rows={2}
                rowsMax={4}
                onChange={this.handleInputChange}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} >
              <TextValidator
                name="url"
                value={url}
                label="URL"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextValidator
                name="start"
                value={start}
                label="Start"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required', 'isDatetime']}
                errorMessages={['this field is required', 'format yyyy-mm-dd hh:mm']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextValidator
                name="end"
                value={end}
                label="End"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required', 'isDatetime']}
                errorMessages={['this field is isDatetime', 'format yyyy-mm-dd  hh:mm']}
              />
            </Grid>
            <Grid item xs={12} >
              <TextValidator
                name="price"
                value={price}
                label="Price (&#926;)"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required', 'isFloat', 'isPositive']}
                errorMessages={['this field is required', 'should be a number', 'should be positive']}
              />
            </Grid>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit">
                Save
              </Button>
          </Grid>
        </ValidatorForm>
      </React.Fragment>);
  }
}

DEventForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

DEventForm = withStyles(styles)(DEventForm);
export default withSnackbar()(DEventForm)
