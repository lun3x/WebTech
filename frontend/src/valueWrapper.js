import makeCancellable from './promiseWrapper';

const makeCancellableVal = (retVal) => {
    let promise = new Promise((resolve, reject) => resolve(retVal));
    return makeCancellable(promise);
};

export default makeCancellableVal;
