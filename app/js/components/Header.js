import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link } from 'react-router-dom'

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flexGrow: 1,
  },
  topButton: {
    margin: theme.spacing.unit,
  },
});

class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {

        const { classes } = this.props;

        return (<React.Fragment>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex}>
                D&#926;vents
              </Typography>
            </Toolbar>
          </AppBar>
        </React.Fragment>
        );
    }
}

export default withStyles(styles)(Header);
//export default Header;
