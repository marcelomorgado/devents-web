/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, DialogTitle, Modal, Typography } from '@material-ui/core';
import DEventForm from './DEventForm';
import TicketIssueForm from './TicketIssueForm';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    width: 600,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class SimpleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTicketIssuance = this.handleTicketIssuance.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleTicketIssuance() {

    this.setState({ open: false });
    this.props.afterIssuance();
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button onClick={this.handleOpen} fullWidth size="small" color="primary" variant="contained">
          Issue Ticket
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <TicketIssueForm
              afterIssuance={this.handleTicketIssuance}
              dEventId={this.props.dEventId} />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

//export default SimpleModalWrapped;

class TicketIssueButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickOpen() {
    this.setState({ open: true, });
  };

  handleClose(value) {
    this.setState({ open: false });
  };

  render() {
    return (<React.Fragment>
        <SimpleModalWrapped
          dEventId={this.props.dEventId}
          afterIssuance={this.props.afterIssuance}
        />
      </React.Fragment>
    );
  }
}

export default TicketIssueButton;
