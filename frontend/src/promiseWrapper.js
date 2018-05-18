const makeCancellable = (promise) => {
    let hasCancelled = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => (hasCancelled ? reject(new Error('Promise cancelled')) : resolve(val)),
            error => (hasCancelled ? reject(new Error('Promise cancelled')) : reject(error))
        );
    });
  
    return {
        then(resolve, reject) {
            return wrappedPromise.then(resolve, reject);
        },
        cancel() {
            hasCancelled = true;
        }
    };
};

export default makeCancellable;
