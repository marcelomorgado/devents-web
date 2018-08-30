import React from 'react';
import classNames from 'classnames';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DEventCard from './DEventCard';
import EmbarkJS from 'Embark/EmbarkJS';
import TicketStore from 'Embark/contracts/TicketStore';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  noDEventMessage: {
    margin: '0 auto',
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
});

class ListAllDEvents extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {this.props.dEvents.length == 0 &&
                <Typography
                  color="secondary"
                  align="center"
                  variant="title"
                  className={classes.noDEventMessage}
                >
                  No dEvents registered
                </Typography>
              }

              {this.props.dEvents.map(dEvent => (
                <DEventCard
                  key={dEvent.id}
                  dEvent={dEvent}
                  afterIssuance={this.props.afterIssuance}
                  afterTransfer={this.props.afterTransfer}
                  afterEdition={this.props.afterEdition}
                />
              ))}
            </Grid>
          </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(ListAllDEvents);
