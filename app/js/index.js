import React from 'react';
import ReactDOM from 'react-dom';
import DEvents from './components/DEvents';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
      return (<React.Fragment>
        <DEvents   />
      </React.Fragment>);
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
