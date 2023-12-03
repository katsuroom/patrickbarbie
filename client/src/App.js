import './App.css';
import React, {useEffect, useState  } from 'react'
import { BrowserRouter, Route, Switch, useParams  } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { StoreContextProvider } from './store';
import {
    SplashScreen,
    LoginScreen,
    RegisterScreen,
    PasswordRecoveryPage,
    PHeatmap,
    Sort,
    MUIExit,
    MainScreen,
    TitleBar,
    StatusBar,
    EditScreen,
    Discovery,
    ResetPassword
} from './components'


const QueryParameterExtractor = () => {
    let { email, token } = useParams();
    token = token.replace(/SPECIAL_ESCAPE_CHAR/g, "/");

    console.log('Email:', email);
    console.log('Token:', token);
  
    return <ResetPassword email={email} token={token}/>;
  };

  
const App = () => {


    return (
        <BrowserRouter>
            <AuthContextProvider>
            <StoreContextProvider>
                <TitleBar />
                <Switch>
                    <Route path="/" exact component={SplashScreen} />
                    <Route path="/login/" exact component={LoginScreen} />
                    <Route path="/register/" exact component={RegisterScreen} />
                    <Route path="/recovery/" exact component={PasswordRecoveryPage} />
                    <Route path="/main/" exact component={MainScreen} />
                    <Route path="/heatmap/" exact component={PHeatmap} />
                    <Route path="/sort/" exact component={Sort} />
                    <Route path="/MUIExit/" exact component={MUIExit} />
                    <Route path="/edit/" exact component={EditScreen} />
                    <Route path="/discovery/" exact component={Discovery} />
                    <Route path="/password-recovery/:email/:token" component={QueryParameterExtractor} />
                    
                </Switch>
                <StatusBar />
            </StoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App