import style from "./main.css";
import App from "./App";

console.log(`I'm a silly entry point`);

const arr = [1,2,3];

const jsES6 = () => console.log(...arr);

window.jsES6 = jsES6;

