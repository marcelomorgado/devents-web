import EmbarkJS from 'Embark/EmbarkJS';
import TicketStore from 'Embark/contracts/TicketStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { CssBaseline, Typography, Grid, Button } from '@material-ui/core';
import Header from './Header';
import Footer from './Footer';
import ListAllDEvents from './ListAllDEvents';
import DEventForm from './DEventForm';
import DEventCreateButton from './DEventCreateButton';
import { SnackbarProvider } from 'material-ui-snackbar-provider';

const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },

});


class DEvents extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          dEvents: [],
          web3Account: null,
          web3HasProvider: false,
          web3IsUnlock: false
        };

        this.refreshAllEvents = this.refreshAllEvents.bind(this);
    }

    _verifyWeb3() {

      this.setState({ web3HasProvider: (web3.givenProvider !== null) });

      if(this.state.web3HasProvider) {

        this.setState({ web3IsUnlock: (web3.eth.defaultAccount !== null) });

        web3.eth.getAccounts().then((accounts) => {
          if (accounts[0] !== this.state.account) {
            this.setState({ web3Account: accounts[0] });
            web3.eth.defaultAccount = accounts[0];
            this._refreshAllEvents();
          }

          return null;
        });

      }
    }

    componentDidMount() {

      this.web3Checker = setInterval(
        () => this._verifyWeb3(),
        1000
      );

      EmbarkJS.onReady(() => {
        this._verifyWeb3();
        this._refreshAllEvents();
      });

    }

    componentWillUnmount() {
      clearInterval(this.web3Checker);
    }

    _refreshAllEvents() {
      TicketStore.methods.getDEventsCount().call().then(amount => {

        let dEventIds = [];
        for(var i = 0; i < amount; ++i)
          dEventIds.push(i);

        return Promise.all(dEventIds.map(dEventId => {
          return TicketStore.methods.devents(dEventId).call().then((dEvent) => {
            dEvent.id = dEventId;
            return dEvent;
          });
        }));

      }).then(dEvents => {
        this.setState({ dEvents: dEvents });
        return null;
      });
    }

    refreshAllEvents() {
      EmbarkJS.onReady(() => {
        this._refreshAllEvents();
      });
    }

    render() {
      const { classes } = this.props;

      if(!this.state.web3HasProvider) {
        return (<React.Fragment>
          <Typography variant="title" align="center" color="textSecondary" paragraph>
            Please Enable Metamask to Continue.
          </Typography>
          <Typography variant="title" align="center" color="textSecondary" paragraph>
            To interact with the Ethereum Blockchain, you need to install the Metamask Browser Extension.
          </Typography>
        </React.Fragment>
        );
      }
      else  if(!this.state.web3IsUnlock) {
        return (<React.Fragment>
          <Typography variant="title" align="center" color="textSecondary" paragraph>
            Please Unlock Metamask To Continue
          </Typography>
        </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <SnackbarProvider snackbarProps={{ autoHideDuration: 4000, variant: "info" }}>
            <CssBaseline />
            <Header />
            <main>
              {/* Hero unit */}
              <div className={classes.heroUnit}>
                <div className={classes.heroContent}>
                  <Typography variant="display3" align="center" color="textPrimary" gutterBottom>
                    D&#926;vents
                  </Typography>
                  <Typography variant="title" align="center" color="textSecondary" paragraph>
                    A decentralized tickets marketplace for cryptoevents
                  </Typography>
                  <div className={classes.heroButtons}>
                    <Grid container spacing={16} justify="center">
                      <Grid item>
                        <DEventCreateButton afterCreation={this.refreshAllEvents} />
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>

              <ListAllDEvents
                dEvents={this.state.dEvents}
                afterIssuance={this.refreshAllEvents}
                afterTransfer={this.refreshAllEvents}
                afterEdition={this.refreshAllEvents}
              />

            </main>
            <Footer />
          </SnackbarProvider>
        </React.Fragment>
      );
    }
}

export default withStyles(styles)(DEvents);
