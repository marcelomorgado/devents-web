import EmbarkJS from 'Embark/EmbarkJS';
import TicketStore from 'Embark/contracts/TicketStore';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import { CssBaseline, Button, Typography, Grid, TextField, FormControlLabel, Checkbox, Input } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { withSnackbar } from 'material-ui-snackbar-provider'

const styles = theme => ({
  input: {
    display: 'none',
  },
});

ValidatorForm.addValidationRule('isAddress', (value) => {
  return web3.utils.isAddress(value);
});

class TicketIssueForm extends React.Component {

  constructor(props){
      super(props);

      this.state = {
        recipient: "",
      };

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);    
  }


  handleSubmit(e) {
    e.preventDefault();

    TicketStore.methods.issueTicket(this.props.dEventId, this.state.recipient)
    .send({from: web3.eth.defaultAccount})
    .on('confirmation', (confirmationNumber, receipt) => {
      if(confirmationNumber == 1) {
        this.props.snackbar.showMessage('Transaction confirmed', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+receipt.transactionHash, "_blank"));
        this.props.afterIssuance();
      }
    })
    .on("transactionHash", txHash => {
      this.props.snackbar.showMessage('Transaction sent', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+txHash, "_blank"));
      this.props.afterIssuance();
    });
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
    const { classes, dEvent } = this.props;
    const { recipient } = this.state;

    return (
      <React.Fragment>
        <Typography variant="display1" align="center">
          Issue a Ticket
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
              <TextValidator
                name="recipient"
                value={recipient}
                label="Recipient address"
                fullWidth
                onChange={this.handleInputChange}
                validators={['required','isAddress']}
                errorMessages={['this field is required','should be a valid address']}
              />
            </Grid>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              type="submit">
              Issue Ticket
            </Button>
          </Grid>
        </ValidatorForm>
      </React.Fragment>);
  }
}

TicketIssueForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

TicketIssueForm = withStyles(styles)(TicketIssueForm);
export default withSnackbar()(TicketIssueForm);
