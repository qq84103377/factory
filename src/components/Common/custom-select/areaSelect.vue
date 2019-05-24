<template>
    <div class="area-select">
        <el-cascader
                v-model="selected"
                :placeholder="placeholder"
                show-all-levels
                :options="options"
                clearable
                @change="handleChange"
                @active-item-change="handleItemChange"
                :props="props">
        </el-cascader>
    </div>
</template>

<script>
    import {getPosition} from "@/api/api";
    export default {
        name: "area-select",
        props:['value','placeholder'],
        data() {
            return {
                selected:[],
                options: [],
                props: {
                    value: "code",
                    label: "label",
                    children: "cities"
                },
                arr:[],
            }
        },
        watch:{
            async value(val){
                console.log(val,'传进来的地区')
                if(val !== this.selected){
                    if(val[0]){
                        await this.handleItemChange([val[0]])
                    }
                    if(val[0]&&val[1]){
                        await this.handleItemChange([val[0],val[1]])
                    }
                    this.selected = val
                }
            }
        },
        methods:{
            //获取省
            cityData() {
                getPosition({}).then(res => {
                    for (let i = 0; i < res.data.positionList.length; i++) {
                        let obj = {};
                        obj.label = res.data.positionList[i].name;
                        obj.code = res.data.positionList[i].id;
                        obj.cities = [];
                        this.options.push(obj);
                    }
                });
            },
            //回传出去
            handleChange(val) {
                console.log(val,'选择的地区')
                this.$emit('input',val)
            },
            //根据父级，查找子级城市/区域
            async handleItemChange(val) {
                if (val.length == 1) {
                    var v = val[0];
                } else {
                    v = val[1];
                }
                let params = {
                    id: v
                };
                if(this.contains(this.arr,v)){
                    return false;
                }
                this.arr.push(v);
                await getPosition(params).then(res => {
                    let city = [];
                    if (val.length == 1) {
                        for (let i = 0; i < res.data.positionList.length; i++) {
                            let obj = {};
                            obj.label = res.data.positionList[i].name;
                            obj.value = res.data.positionList[i].id;
                            obj.code = res.data.positionList[i].id;
                            obj.cities = [];
                            city.push(obj);
                            setTimeout(_ => {
                                for (let i = 0; i < this.options.length; i++) {
                                    if (this.options[i].code == v) {
                                        this.options[i].cities.push(obj);
                                    }
                                }
                            }, 100);
                        }
                    } else {
                        let areas = [];
                        for (let i = 0; i < res.data.positionList.length; i++) {
                            let obj = {};
                            obj.label = res.data.positionList[i].name;
                            obj.value = res.data.positionList[i].id;
                            obj.code = res.data.positionList[i].id;
                            obj.areas = [];
                            obj.areas.push(obj);
                            setTimeout(_ => {
                                for (let i = 0; i < this.options.length; i++) {
                                    if (this.options[i].code == val[0]) {
                                        let arr = this.options[i];
                                        for (
                                            let j = 0;
                                            j < arr.cities.length;
                                            j++
                                        ) {
                                            if (arr.cities[j].code == val[1]) {
                                                arr.cities[j].cities.push(obj);
                                            }
                                        }
                                    }
                                }
                            }, 100);
                        }
                    }
                });
            },
            //用于判断是否存在于当前数组
            contains(arr, obj) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == obj) {
                        return true;
                    }
                }
                return false;
            },
        },
        created(){
            this.cityData()
        }
    }
</script>

<style lang="scss">

</style>
