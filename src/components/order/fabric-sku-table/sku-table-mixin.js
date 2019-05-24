function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;
    
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        getTableData(skuList) {
            let colorArr = [],
                lengthArr = [],
                sizeArr = [],
                skuVal = {};
            lengthArr = this.getLengthArr(skuList);
            const lengthBol = !lengthArr.length; // 表示无内长；
            skuList.reduce((json, item, index) => {
                    let _key;
                    if (lengthBol) {
                        // 无内长是key
                        _key = `${item.color_id}-${item.size_id}`;
                    }
                    else if (!lengthBol && item.standard_id && item.standard_value) {
                        // 有内长是key
                        _key = `${item.color_id}-${item.size_id}-${item.standard_id}`;
                    }
                    skuVal[_key] = {
                        skuId: item.id,
                        storeyQuantity: '',
                        num: ''
                    }
                    if (!json[item.color_id]) {
                        const { color_no_name, color_name, color_id } = item;
                        colorArr.push({
                            color_no_name,
                            color_name,
                            color_id,
                            index: index
                        });
                        json[item.color_id] = item.color_id;
                    }
                    if (!json[item.size_id]) {
                        const { size_value, size_id } = item;
                        sizeArr.push({
                            size_value,
                            size_id
                        });
                        json[item.size_id] = item.size_id;
                    }
                    return json;
            }, {});
            return {
                colorArr,
                lengthArr,
                sizeArr,
                skuVal
            };
        },
        // 获取内长列表
        getLengthArr(skuList) {
            let arr = [];
            for (let skuItem of skuList) {
                const had = arr.some(item => item.standard_id === skuItem.standard_id);
                !had && arr.push({ standard_value: skuItem.standard_value || '无', standard_id: skuItem.standard_id});
            }
            if (arr.length === 1 && arr[0].standard_value === '无') {
                // 表示无内长
                return [];
            };
            return arr;
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
          }
    }
}