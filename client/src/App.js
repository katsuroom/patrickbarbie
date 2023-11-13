import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import {
    SplashScreen,
    LoginScreen,
    RegisterScreen,
    PasswordRecoveryPage,
    MUIPublishMap,
    MUIDeleteMap,
    MUISaveChanges,
    MUIForkMap,
    MUIUploadMap,
    MUICreateMap,
    MUIExportMap,
    PHeatmap,
    Sort,
} from './components'

const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>

                <Switch>
                    <Route path="/" exact component={SplashScreen} />
                    <Route path="/login/" exact component={LoginScreen} />
                    <Route path="/register/" exact component={RegisterScreen} />
                    <Route path="/recovery/" exact component={PasswordRecoveryPage} />
                    <Route path="/publishMap/" exact component={MUIPublishMap} />
                    <Route path="/deleteMap/" exact component={MUIDeleteMap} />
                    <Route path="/saveMap/" exact component={MUISaveChanges} />
                    <Route path="/forkMap/" exact component={MUIForkMap} />
                    <Route path="/uploadMap/" exact component={MUIUploadMap} />
                    <Route path="/createMap/" exact component={MUICreateMap} />
                    <Route path="/exportMap/" exact component={MUIExportMap} />
                    <Route path="/heatmap/" exact component={PHeatmap} />
                    <Route path="/sort/" exact component={Sort} />
                </Switch>

            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App