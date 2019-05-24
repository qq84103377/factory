export function isPhone(val) {
    const reg = /^1[34578]\d{9}$/;
    return reg.test(val.trim());
}