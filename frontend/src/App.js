import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import './App.css';
import AuthPage from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Redirect from="/" to="/auth" exact/>
                    <Route path="/auth" component={AuthPage}/>
                    <Route path="/events" component={Events}/>
                    <Route path="/bookings" component={Bookings}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;