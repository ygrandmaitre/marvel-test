import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { WhosWho } from './whoswho';

import './App.css';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={WhosWho} />
            </Router>
        );
    }
}

export { App };
