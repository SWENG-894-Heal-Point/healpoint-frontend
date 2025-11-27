let setLoadingFn = null;

export const loadingHandler = {
    register(fn) {
        setLoadingFn = fn;
    },
    show() {
        if (setLoadingFn) setLoadingFn(true);
    },
    hide() {
        if (setLoadingFn) setLoadingFn(false);
    },
};
