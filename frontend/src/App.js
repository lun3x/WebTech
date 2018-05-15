import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LandingPage from './components/LandingPage';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider style={{ height: '100%', width: '100%' }}>
        <LandingPage style={{ height: '100%', width: '65%', margin: 'auto' }} />
    </MuiThemeProvider>
);

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
