let timer = null;
export const debounce = function(fn, delay = 300) {
    return function() {
        clearTimeout(timer);
        const context = this;
        const args = [].slice.call(arguments);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    }
}