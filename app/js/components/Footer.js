import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

class Footer extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {

        const { classes } = this.props;

        return (<React.Fragment>
          <footer className={classes.footer}>
            <Typography variant="title" align="center" gutterBottom>
              ERC-721 Supporter
            </Typography>
            <Typography variant="subheading" align="center" color="textSecondary" component="p">
              <a href="https://github.com/marcelomorgado/devents-web" target="_blank">Github</a>
            </Typography>
          </footer>
        </React.Fragment>
        );
    }
}





export default withStyles(styles)(Footer);
