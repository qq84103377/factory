module.exports = {
    contains: contains,
    removeByValue: removeByValue,
    dateFormatter: dateFormatter,
    same:same,
    searchKeys: searchKeys,
    truncate: truncate,
    uniqeByKeys:uniqeByKeys,
    mul:mul,
    add:add,
    sub:sub,
    div:div
}
//用于判断是否存在于当前数组
function contains(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == obj) {
            return true;
        }
    }
    return false;
};
//用于移除数组中已存在的值
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
function dateFormatter(str) { //默认返回yyyy-MM-dd HH-mm-ss
    var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
    var d = new Date(str);
    var year = d.getFullYear();
    var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    if (hasTime) {
        return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
    } else {
        return [year, month, day].join('-');
    }
}

function same(arr) {
    var ary = new Array(arr);

    var nary = ary.sort();

    for (var i = 0; i < ary.length; i++) {

        if (nary[i] == nary[i + 1]) {
            return nary[i];
            console.log("数组重复内容：" + nary[i],i);

        }

    }
}

function searchKeys(arr) {
    var str = "";
    var strary = [];
    for (var i = 0; i < arr.length; i++) {
        var hasRead = false;
        for (var k = 0; k < strary.length; k++) {
            if (strary[k] == arr[i]) {
                hasRead = true;
            }
        }
        if (!hasRead) {
            var _index = i,
                haveSame = false;
            for (var j = i + 1; j < arr.length; j++) {
                if (j == parseInt(i)) {
                    _index++;
                }
                if (arr[i] == arr[j]) {
                    _index += "," + (parseInt(j));
                    haveSame = true;
                }
            }
            if (haveSame) {
                strary.push(arr[i]);
                str += _index + "个";
                var is;
                is+=_index;

            }
        }
    }
    return str;
}

function truncate(arr) {
    var m = [];
    for (var i = 0; i < arr.length - 1; i++) {
        m.push(arr[i]);
    }
    return m;
}

//将对象元素转换成字符串以作比较  
function obj2key(obj, keys) {
    var n = keys.length,
        key = [];
    while (n--) {
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
//去重操作  
function uniqeByKeys(array, keys) {
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr.push(array[i]);
        }
    }
    return arr;
}

// 乘
function mul(a, b) {
  let c = 0
  const d = a.toString()
  const e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) { console.log() }
  try {
    c += e.split('.')[1].length
  } catch (f) { console.log() }
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

// 加
function add(a, b) {
  let c = 0
  let d = 0
  let e = 0
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (mul(a, e) + mul(b, e)) / e
}

// 减
function sub(a, b) {
  let c = 0
  let d = 0
  let e = 0
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (mul(a, e) - mul(b, e)) / e
}

// 除
function div(a, b) {
  let c = 0
  let d = 0
  let e = 0
  let f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) { console.log() }
  try {
    f = b.toString().split('.')[1].length
  } catch (g) { console.log() }
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  return mul(c / d, Math.pow(10, f - e))
}