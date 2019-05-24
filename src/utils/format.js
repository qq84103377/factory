var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatDate: function (date, pattern) {
        pattern = pattern || DEFAULT_PATTERN;
        return pattern.replace(SIGN_REGEXP, function ($0) {
            switch ($0.charAt(0)) {
                case 'y': return padding(date.getFullYear(), $0.length);
                case 'M': return padding(date.getMonth() + 1, $0.length);
                case 'd': return padding(date.getDate(), $0.length);
                case 'w': return date.getDay() + 1;
                case 'h': return padding(date.getHours(), $0.length);
                case 'm': return padding(date.getMinutes(), $0.length);
                case 's': return padding(date.getSeconds(), $0.length);
            }
        });
    },
    parseDate: function (dateString, pattern) {
        var matchs1 = pattern.match(SIGN_REGEXP);
        var matchs2 = dateString.match(/(\d)+/g);
        if (matchs1.length == matchs2.length) {
            var _date = new Date(1970, 0, 1);
            for (var i = 0; i < matchs1.length; i++) {
                var _int = parseInt(matchs2[i]);
                var sign = matchs1[i];
                switch (sign.charAt(0)) {
                    case 'y': _date.setFullYear(_int); break;
                    case 'M': _date.setMonth(_int - 1); break;
                    case 'd': _date.setDate(_int); break;
                    case 'h': _date.setHours(_int); break;
                    case 'm': _date.setMinutes(_int); break;
                    case 's': _date.setSeconds(_int); break;
                }
            }
            return _date;
        }
        return null;
    },
    countDown(endDate) {
        const star = new Date();
        endDate = new Date(endDate);
        let time = endDate - star;
        const day = parseInt((time / 1000 / 60 / 60 / 24))
            , h = parseInt((time / 1000 / 60 / 60 % 24))
            , m = parseInt((time / 1000 / 60 % 60))
            , s = parseInt((time / 1000 % 60));
        return {
            d: day,
            h: h,
            m: m,
            s: s
        }
    }
};

export function looseEqual (a, b) {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
    try {
        const isArrayA = Array.isArray(a)
        const isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
            return looseEqual(e, b[i])
        })
        } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
            return looseEqual(a[key], b[key])
        })
        } else {
        /* istanbul ignore next */
        return false
        }
    } catch (e) {
        /* istanbul ignore next */
        return false
    }
    } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
    } else {
    return false
    }
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }