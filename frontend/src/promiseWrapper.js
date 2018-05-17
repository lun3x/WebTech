const makeCancellable = (promise) => {
    let hasCancelled = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => (hasCancelled ? reject(new Error('Promise cancelled')) : resolve(val)), // eslint-disable-line prefer-promise-reject-errors
            error => (hasCancelled ? reject(new Error('Promise cancelled')) : reject(error)) // eslint-disable-line prefer-promise-reject-errors
        );
    });
  
    return {
        promise: wrappedPromise,
        then(resolve, reject) {
            return wrappedPromise.then(resolve, reject);
        },
        cancel() {
            hasCancelled = true;
        }
    };
};

export default makeCancellable;
