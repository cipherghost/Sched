import React, { Component } from 'react';
import Header from './components/header';

import { BrowserRouter, Route } from 'react-router-dom';
//import {Button} from 'semantic-ui-react';
import Authenticate from './components/authenticate';
import Signin from './components/signin';
import Home from './components/home';
//import Index from './components/index';

class App extends Component{
  render(){
    return (
      <BrowserRouter>   
        <Route exact path='/signup' component={Authenticate} />
        <Route exact path='/' component={Signin} />
        <Route path='/home' component={Home} />
        </BrowserRouter>   
    );
  }
}

export default App;