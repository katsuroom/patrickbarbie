import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { StoreContextProvider } from './store';
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
    MUIExit,
    MainScreen,
    TitleBar,
    StatusBar,
    EditScreen,
    Discovery,
} from './components'

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
                    <Route path="/publishMap/" exact component={MUIPublishMap} />
                    <Route path="/deleteMap/" exact component={MUIDeleteMap} />
                    {/* <Route path="/saveMap/" exact component={MUISaveChanges} /> */}
                    <Route path="/forkMap/" exact component={MUIForkMap} />
                    <Route path="/uploadMap/" exact component={MUIUploadMap} />
                    <Route path="/createMap/" exact component={MUICreateMap} />
                    <Route path="/exportMap/" exact component={MUIExportMap} />
                    <Route path="/heatmap/" exact component={PHeatmap} />
                    <Route path="/sort/" exact component={Sort} />
                    <Route path="/MUIExit/" exact component={MUIExit} />
                    <Route path="/edit/" exact component={EditScreen} />
                    <Route path="/discovery/" exact component={Discovery} />
                </Switch>
                <StatusBar />
            </StoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App