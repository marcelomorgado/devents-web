import EmbarkJS from 'Embark/EmbarkJS';
import TicketStore from 'Embark/contracts/TicketStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'material-ui-snackbar-provider';
import { AppBar, Button, Typography, Toolbar,
  Card, CardActions, CardContent, CardHeader,
  CardMedia, Grid } from '@material-ui/core';
import dateFormat from 'dateformat';
import TicketIssueButton from './TicketIssueButton';
import TicketTransferButton from './TicketTransferButton';
import DEventEditButton from './DEventEditButton';

const styles = theme => ({
  card: {
  //  height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
   backgroundColor: theme.palette.grey[200],
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

class DEventCard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          userBalance: 0
        };

        this.handleTicketIssuance = this.handleTicketIssuance.bind(this);
        this.handleTicketTransfer = this.handleTicketTransfer.bind(this);
        this.handleTicketBuy = this.handleTicketBuy.bind(this);
        this.handleWithdrawal = this.handleWithdrawal.bind(this);
    }

    componentDidMount() {
      this._refreshUserBalance();
    }

    _refreshUserBalance() {
      TicketStore.methods.eventBalanceOf(
        web3.eth.defaultAccount,
        this.props.dEvent.id
      ).call().then(_balance => {
        this.setState({ userBalance: _balance });
        return null;
      });
    }

    handleTicketIssuance() {
      this._refreshUserBalance();
      this.props.afterIssuance();
    }

    handleTicketTransfer() {
      this._refreshUserBalance();
      this.props.afterTransfer();
    }

    handleTicketBuy() {

      let dEventId = this.props.dEvent.id;
      let ticketPrice = this.props.dEvent.price;

      TicketStore.methods.buyTicket(dEventId)
      .send({from: web3.eth.defaultAccount, value: ticketPrice })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber == 2) {
          this.props.snackbar.showMessage('Transaction confirmed', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+receipt.transactionHash, "_blank"));
          this._refreshUserBalance();
        }
      })
      .on("transactionHash", txHash => {
        this.props.snackbar.showMessage('Transaction sent', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+txHash, "_blank"));
        this._refreshUserBalance();
      });
    }


    handleWithdrawal() {

      let dEventId = this.props.dEvent.id;

      TicketStore.methods.withdrawal(dEventId)
      .send({from: web3.eth.defaultAccount })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber == 2) {
          this.props.snackbar.showMessage('Transaction confirmed', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+receipt.transactionHash, "_blank"));
          this._refreshUserBalance();
        }
      })
      .on("transactionHash", txHash => {
        this.props.snackbar.showMessage('Transaction sent', 'Details', ()=> window.open("https://ropsten.etherscan.io/tx/"+txHash, "_blank"));
        this._refreshUserBalance();
      });
    }

    render() {
        const { classes, dEvent } = this.props;

        let startDate = new Date(Number(dEvent.start)*1000);
        let endDate = new Date(Number(dEvent.end)*1000);

        let start = dateFormat(startDate, "mmm d");
        let end = dateFormat(endDate, "mmm d");

        let dateLabel = start;
        if(start !== end)
          dateLabel += ' - ' + end;
        dateLabel += ', ' + dateFormat(startDate, "yyyy");

        let imageUrl = 'https://ipfs.io/ipfs/' + dEvent.imageHash;
        let isHost = dEvent.host === web3.eth.defaultAccount;
        let isRunning = (dEvent.start*1000) <= Date.now() && Date.now() <= (dEvent.end*1000);
        let isFinished = (dEvent.end*1000) < Date.now();
        let cardHeader = "balance: " + this.state.userBalance;
        let price = web3.utils.fromWei(dEvent.price, 'ether');
        let eventBalance = web3.utils.fromWei(dEvent.balance, 'ether');

        return (<React.Fragment>
          <Grid item sm={6} md={4} lg={4}>
            <Card className={classes.card}>
              <CardHeader
                title=""
                subheader={cardHeader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'right' }}
                className={classes.cardHeader}
              />
              <CardMedia
                className={classes.cardMedia}
                image={imageUrl}
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="headline" component="h2">
                  {dEvent.title}
                </Typography>
                <Typography variant="subheading" paragraph={true}>
                  {dateLabel}
                </Typography>
                <Typography >
                  {dEvent.shortInfo}
                </Typography>
              </CardContent>
              {!isFinished &&
                <CardActions>
                  <Button onClick={this.handleTicketBuy} fullWidth size="small" color="primary" variant="contained">
                    Buy Ticket / &#926;{price}
                  </Button>
                </CardActions>
              }
              {this.state.userBalance > 0 &&
                <CardActions>
                  <TicketTransferButton
                    dEventId={dEvent.id}
                    afterTransfer={this.handleTicketTransfer}
                  />
                </CardActions>
              }
              {isHost &&
                <CardActions>
                  <DEventEditButton
                    dEvent={dEvent}
                    afterEdition={this.props.afterEdition}
                  />
                  <TicketIssueButton
                    dEventId={dEvent.id}
                    afterIssuance={this.handleTicketIssuance}
                  />
                </CardActions>
              }
              {isHost &&
                <CardActions>
                  <Button onClick={this.handleWithdrawal} fullWidth size="small" color="secondary" variant="contained">
                    Withdraw / &#926;{eventBalance}
                  </Button>
                </CardActions>
              }
            </Card>
          </Grid>
        </React.Fragment>
        );
    }
}

DEventCard = withStyles(styles)(DEventCard);
export default withSnackbar()(DEventCard)
