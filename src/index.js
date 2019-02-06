import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import registerServiceWorker from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Redirect, Route} from "react-router";
import {Router} from "react-router-dom";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createBrowserHistory from "history/createBrowserHistory";
import Login from "./features/Login";
import Home from "./features/Home";
import Album from "./features/Album";


const muiTheme = getMuiTheme({
    appBar: {
        color: "#37517E",
        height: 50
    },
});

const customHistory = createBrowserHistory();
const Root = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={customHistory}>
            <div>
                <Route path="/login" component={Login}/>
                <Route path="/app/home" component={Home}/>
                <Route path="/app/album" component={Album}/>
                <Redirect from="/" to="/app/home"/>
            </div>
        </Router>
    </MuiThemeProvider>
);
ReactDOM.render(<Root />, document.getElementById('root'));

registerServiceWorker(null);
