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
        getTableData(skuList,quantities) {
            let colorArr = [],
                lengthArr = [],
                sizeArr = [],
                skuVal = {};
            lengthArr = this.getLengthArr(skuList);
            const lengthBol = !lengthArr.length; // 表示无内长；
            if(skuList){
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
                        num: ''
                    }
                    if (!json[item.color_id]) {
                        const { color_no_name, color_name, color_id } = item;
                        // 生产订单预下单的时候直接按skc填数
                        if(this.skcCode){
                            colorArr.push({
                                color_no_name,
                                color_name,
                                color_id,
                                lengthArr:JSON.parse(JSON.stringify(lengthArr)) || []
                            });
                        }else {
                            colorArr.push({
                                color_no_name,
                                color_name,
                                color_id
                            });
                        }

                        json[item.color_id] = item.color_id;
                    }
                    if (!json[item.size_id]) {
                        const { size_value, size_id ,sizeTypeCategory} = item;
                        sizeArr.push({
                            size_value,
                            size_id,
                            sizeTypeCategory,
                        });
                        json[item.size_id] = item.size_id;
                    }
                    return json;
                }, {});
            }

            if(quantities){
              //生产订单预下单按skc详情
                quantities.forEach(item=>{
                    colorArr.forEach($item=>{
                        if(item.colorId===$item.color_id){
                            $item.num = item.num
                            $item.id = item.id
                        }
                    })
                })
            }
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
            if(skuList){
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.standard_id === skuItem.standard_id);
                    !had && arr.push({color_id:skuItem.color_id, standard_value: skuItem.standard_value || '无', standard_id: skuItem.standard_id,codeConfigNum:[],codeConfigSelId:[]});
                }
            }

            arr.forEach((item,index)=>{
                arr.forEach(($item,index)=>{
                    item.codeConfigNum.push('')
                    item.codeConfigSelId.push('')
                })

            })

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
