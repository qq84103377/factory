<template>
    <div :id="`${id}Chart`" class="my-chart"></div>
</template>
<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/markPoint');
import options from './lineOptions'
export default {
    props: {
        id: {
            type: String
        },
        chartData: {
            type: Object,
            default: {
                times: [],
                series: []
            }
        },
        yAxisData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // 图标数据
            lineBarData: [],
            // 曲线配置与数据
            lineBarOptions: [],
            // X轴坐标数据
            lineBarXaxisData: []
        };
    },
    methods: {
        // 渲染图表
        drawChart() {
            let vm = this;
            vm.myChart = echarts.init(
                document.getElementById(`${vm.id}Chart`)
            );
            vm.myChart.setOption({
                grid: {
                    left: '10',
                    right: '0',
                    bottom: '0',
                    top: '38',
                    containLabel: true,
                    show: true,
                    width: '95%',
                    height: '75%',
                    backgroundColor: 'transparent',
                    borderWidth: 0
                },
                axisPointer: {
                    show: false
                },
                xAxis: {

                    axisLine: {
                        lineStyle: {
                            opacity: 0
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#333272',
                            width: '2'
                        }
                    },
                    axisLabel: {
                        color: '#7d86de',
                        fontSize: '12',
                        align: 'center',
                        margin: 12
                    },
                    data: vm.lineBarXaxisData,
                    nameGap: 30
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#7d86de',
                        fontSize: '12',
                        align: 'right',
                        margin: 14
                    }
                },
                series: vm.lineBarOptions
            });
            if (vm.id == 'today') {
                vm.myChart.on('mouseover', (params) => {
                    let series = [...vm.lineBarOptions]
                    series[params.seriesIndex].label.show = true;
                    vm.myChart.setOption({
                        series: series
                    })
                })
                vm.myChart.on('mouseout', (params) => {
                    let series = [...vm.lineBarOptions]
                    series[params.seriesIndex].label.show = false;
                    vm.myChart.setOption({
                        series: series
                    })
                })
            }
        },
        // 返回产能曲线相应配置
        returnLineBarOptions() {
            // this.lineBarOptions = options
            for (let i in this.lineBarData) {
                if (this.id == 'today') {
                    this.lineBarOptions[i] = options.todayCurve[i]
                } else {
                    this.lineBarOptions[i] = options.weekCurve[i]
                }
                this.lineBarOptions[i].data = this.lineBarData[i].data
                // this.lineBarOptions[0].markPoint.data[0].coord = [this.lineBarXaxisData.length - 1, this.lineBarData[0].data[this.lineBarData[0].data.length - 1]]
            }
            this.drawChart()

        }
    },
    watch: {
        chartData: {
            handler(val) {
                this.lineBarData = val.series;
                this.lineBarXaxisData = val.times
                this.returnLineBarOptions()
            },
            deep: true
        },
    },
    mounted() {

    }
};
</script>

<style lang="scss" scoped>
.my-chart {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
