import style from './main.css';
import App from './App';


// just uselessly test some es6 features to see if babel is working

let x = 1;
console.log(`I'm a silly ${x} entry point`);

const arr = [ 1, 2, 3 ];

const jsES6 = () => console.log(...arr);

window.jsES6 = jsES6;

