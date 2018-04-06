import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CupboardPage from './components/CupboardPage';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
        <CupboardPage />
    </MuiThemeProvider>
);

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
