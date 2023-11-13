import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import {
    SplashScreen,
    LoginScreen,
    RegisterScreen,
    Sort,
    PHeatmap
} from './components';

const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                           
                    <Switch>
                        <Route path="/" exact component={SplashScreen} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/heatmap/" exact component={PHeatmap} />
                        <Route path="/sort/" exact component={Sort} />
                    </Switch>
            
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App