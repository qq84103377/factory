let options = {
    todayCurve: [
        {
            type: 'line',
            data: [820, 932, 901, 934, 1290, 1330, 100],
            animationEasing: 'backIn',
            animationDuration: '1500',
            symbolSize: [12, 12],
            symbol: 'image://https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_5b5916639b70fb47b4f53fa14f07da4a',
            lineStyle: {
                color: '#76d3fc',
                shadowColor: '#2fade4',
                shadowBlur: 10
            },
            label: {
                show: true,
                color: 'rgb(255, 255, 255)',
                fontWeight: 'bold',
                fontFamily: 'STHeitiSC',
                fontSize: '14px',
                textShadowColor: 'rgb(6, 11, 45)',
                textShadowBlur: 4,
                formatter: (params) => {
                    if (params.value == 0) {
                        return ''
                    }
                }
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#76d3fc' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(118, 211, 252, 0.0)' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                opacity: 0.1
            },
            smooth: true
        },
        {
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310],
            smooth: true,
            animationDuration: '1500',
            animationEasing: 'backIn',
            symbolSize: [12, 12],
            symbol: 'image://https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_5b5916639b70fb47b4f53fa14f07da4a',
            lineStyle: {
                color: '#f7835a',
                shadowColor: '#f1a185',
                shadowBlur: 10
            },
            label: {
                show: false,
                color: 'rgb(255, 255, 255)',
                fontWeight: '300',
                fontFamily: 'STHeitiSC',
                fontSize: '12px',
                textShadowColor: 'rgb(6, 11, 45)',
                textShadowBlur: 4,
                formatter: (params) => {
                    if (params.value == 0) {
                        return ''
                    }
                }
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#f7835a' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: '#f1a185' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                opacity: 0.1
            }
        },
        {
            type: 'line',
            symbol: 'none',
            data: [150, 232, 201, 154, 190, 330, 410],
            smooth: true,
            animationEasing: 'backIn',
            animationDuration: '1500',
            symbolSize: [12, 12],
            symbol: 'image://https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_5b5916639b70fb47b4f53fa14f07da4a',
            lineStyle: {
                color: '#ef4377',
                shadowColor: '#fa6d98',
                shadowBlur: 10
            },
            label: {
                show: false,
                color: 'rgb(255, 255, 255)',
                fontWeight: '300',
                fontFamily: 'STHeitiSC',
                fontSize: '12px',
                textShadowColor: 'rgb(6, 11, 45)',
                textShadowBlur: 4,
                formatter: (params) => {
                    if (params.value == 0) {
                        return ''
                    }
                }
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#ef4377' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(248, 120, 175, 0.0)' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                opacity: 0.1
            }
        },
        {
            type: 'line',
            symbol: 'none',
            data: [320, 332, 301, 334, 390, 330, 320],
            smooth: true,
            animationEasing: 'backIn',
            animationDuration: '1500',
            symbolSize: [12, 12],
            symbol: 'image://https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_5b5916639b70fb47b4f53fa14f07da4a',
            lineStyle: {
                color: '#4b4f8e',
                shadowColor: '#4b4f8e',
                shadowBlur: 10,
                type: 'dashed'
            },
            label: {
                show: false,
                color: 'rgb(255, 255, 255)',
                fontWeight: '300',
                fontFamily: 'STHeitiSC',
                fontSize: '12px',
                textShadowColor: 'rgb(6, 11, 45)',
                textShadowBlur: 4,
                formatter: (params) => {
                    if (params.value == 0) {
                        return ''
                    } else {
                        return params.value.toFixed(2)
                    }
                }
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#4b4f8e' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: '#4b4f8e' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                opacity: 0.1
            }
        }
    ],
    weekCurve: [
        {
            type: 'line',
            data: [820, 932, 901, 934, 1290, 1330, 100],
            animationEasing: 'backIn',
            animationDuration: '1500',
            symbolSize: [12, 12],
            symbol: 'image://https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_5b5916639b70fb47b4f53fa14f07da4a',
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#76d3fc' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(98, 91, 213, 0.5)' // 100% 处的颜色
                        }
                    ],
                    globalCoord: false // 缺省为 false
                },
                width: 4,
                shadowColor: 'rgba(97, 90, 234, 0.5)',
                // {
                //     type: 'linear',
                //     x: 1,
                //     y: 0,
                //     x2: 0,
                //     y2: 0,
                //     colorStops: [
                //         {
                //             offset: 0,
                //             color: 'rgb(62,60,152)' // 0% 处的颜色
                //         },
                //         {
                //             offset: 1,
                //             color: 'rgb(108, 183, 232)' // 100% 处的颜色
                //         }
                //     ],
                //     globalCoord: false // 缺省为 false
                // },
                shadowBlur: 3,
                shadowOffsetY: 10
            },
            label: {
                show: true,
                color: 'rgb(255, 255, 255)',
                fontWeight: '300',
                fontFamily: 'STHeitiSC',
                fontSize: '12px',
                textShadowColor: 'rgb(6, 11, 45)',
                textShadowBlur: 4,
                formatter: (params) => {
                    if (params.value == 0) {
                        return ''
                    }
                }
            },
            smooth: true
        }
    ]
};
export default options;
