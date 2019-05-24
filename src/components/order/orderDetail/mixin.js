export default {
  methods: {
    regroupTaleData(skuList, isNull) {
      let colors = [],
        lengths = [],
        sizes = [],
        skuVal = {},
        json = {};
      lengths = this.mixGetLengths(skuList);
      const isHideLength = (lengths.length === 1 && lengths[0].value === '无');
      for (let item of skuList) {
        const skuIdStr = `${item.color_id}-${item.size_id}${(!isHideLength && item.standard_id && item.standard_value)
          ? '-' + item.standard_id
          : ''}`;
        skuVal[skuIdStr] = {
          skuId: item.id,
          num: isNull ? '' : '0'
        }
        if (!json[item.color_id]) {
          colors.push({
            name: item.color_no_name || item.color_name,
            id: item.color_id
          });
          json[item.color_id] = item.color_id;
        }
        if (!json[item.size_value]) {
          sizes.push({
            value: item.size_value,
            id: item.size_id,
            sizeTypeCategory:item.sizeTypeCategory
          });
          json[item.size_value] = item.size_value;
        }
        // if (item.standard_id && !json[item.standard_id]) {
        //     lengths.push({
        //         value: item.standard_value || '无',
        //         id: item.standard_id
        //     });
        //     json[item.standard_id] = item.standard_id;
        // }
      }

      if (isHideLength) {
        lengths = [];
      }
      return {
        colors,
        lengths,
        sizes,
        skuVal
      };
    },
    mixGetLengths(skuList) {
      let arr = [];
      for (let skuItem of skuList) {
        const had = arr.some(item => item.id === skuItem.standard_id);
        !had && arr.push({value: skuItem.standard_value || '无', id: skuItem.standard_id});
      }
      return arr;
    }
  }
}