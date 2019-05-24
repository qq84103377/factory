<template>
    <div>
        <div class="all">
            <!--完成情况-->
            <div v-if="label==0" class="ing" :class="{'ingSuccess':num==sum,'ingOut':num>sum,}"
                 :style="{'width':(num/sum)*100+'%'}">
                <div class="num" :class="{'num0':num==0,'numSuccess':num==sum,'numoutShow':num>sum}">
                    <span v-if="num<=sum">{{num}}</span>
                    <span v-if="num>sum">{{sum}}</span>
                    <div class="num-angle" :class="{'num-angle0':num==0,'num-angleSuccess':num>=sum}"></div>
                </div>
                <div class="numout" :class="{'num0':num==0,'numSuccess':num==sum}" v-show="num>sum">
                    超额：
                    <span v-if="!reportNum">{{num-sum}}</span>
                    <span v-if="reportNum">{{add(num,reportNum)-sum}}</span>
                    <div class="num-angle" :class="{'num-angle0':num==0,'num-angleSuccess':num==sum}"></div>
                </div>
            </div>
            <!--未完成情况-->
            <div v-if="label==1" class="ing_unfinished" :class="{'ingSuccess':num==sum,'ingOut':num>sum,'kuan':flag}"
                 :style="{'width':(unfinished/sum)*100+'%'}">
                <div class="num" :class="{'num0':num==0,'numSuccess':num==sum,'numoutShow':num>sum && !flag,'numoutShow_weizhi':flag}">
                    <span v-if="num<=sum && !flag">{{unfinished}}</span>
                    <span v-if="num>sum && !flag">{{sum}}</span>
                    <span v-if="flag">{{unfinished}}</span>
                    <div class="num-angle" :class="{'num-angle0':num==0,'num-angleSuccess':num>=sum}"></div>
                </div>
                <!--<div class="numout" :class="{'num0':num==0,'numSuccess':num==sum}" v-show="num>sum">-->
                <!--超额：-->
                <!--<span v-if="!reportNum">{{num-sum}}</span>-->
                <!--<span v-if="reportNum">{{add(num,reportNum)-sum}}</span>-->
                <!--<div class="num-angle" :class="{'num-angle0':num==0,'num-angleSuccess':num==sum}"></div>-->
                <!--</div>-->
            </div>

            <div v-if="add(num,reportNum)<=sum" class="input-ing"
                 :class="{'input-ingSuccess':add(num,reportNum)==sum,'input-ingOut':add(num,reportNum)>sum}"
                 :style="{'width':(add(num,reportNum)/sum)*100+'%'}">
                <div :class="{'num0':add(num,reportNum)==0,'numSuccess':add(num,reportNum)==sum,'numoutShow':add(num,reportNum)>sum}"
                     v-if="report" class="input-num">
                    <span>{{add(num,reportNum)}}</span>
                    <div class="num-angle"
                         :class="{'num-angle0':add(num,reportNum)==0,'num-angleSuccess':add(num,reportNum)>=sum}"></div>
                </div>
            </div>
            <!--超额的进度条-->
            <div v-if="label==0" :class="{'outNum':num>sum}"></div>
            <!-- <div style="display:flex;justify-content:center;position:relative;top:14px;" v-if="num!=0&&report">
                {{num}} / {{sum}}
            </div> -->
            <div style="display:flex;justify-content:center;position:relative;top:14px;" v-if="num==0&&!report">未开始
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['sum', 'num', 'reportNum', 'report', 'label'],
        data() {
            return {
                unfinished: 0,
                flag: false,
            }
        },
        watch: {
            label() {
                this.unfinished = this.sum - this.num
                if (this.num > this.sum) {
                    this.unfinished = 0
                    this.flag = true
                }
                console.log(this.unfinished, 'this.unfinished');
                // console.log(this.num, 'num');
                // console.log(this.sum, 'sum');
                // console.log(this.label, 'label');
            }
        },
        methods: {
            add(a, b) {
                return a + Number(b);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .all {
        border-radius: 5px;
        max-width: 600px;
        height: 10px;
        background-color: #f0f3f7;
        margin: 52px 0;
        position: relative;
        /*完成情况*/
        .ing {
            /*position: absolute;*/
            left: 0;
            top: 0;
            height: 100%;
            max-width: 600px;
            border-radius: 5px;
            background-image: linear-gradient(to right, #1ca1ff, #3dcfff);
            z-index: 10;
            .num {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                border-radius: 4px;
                top: -40px;
                right: -24px;
                min-width: 48px;
                height: 30px;
                box-shadow: 0 3px 5px 0 rgba(25, 144, 230, 0.50);
                background-image: linear-gradient(to bottom, #3CCFFF 0%, #1CA1FF 100%);
                z-index: 2;
                .num-angle {
                    position: absolute;
                    bottom: -13px;
                    z-index: -1;
                    left: 17px;
                    border-top: 8px solid #1CA1FF;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 8px solid transparent;
                }
            }
            .num0 {
                background-image: linear-gradient(to bottom, #DDE5ED 0%, #CCD2DE 100%);
                box-shadow: 0 3px 5px 0 rgba(143, 163, 204, 0.5);
                .num-angle0 {
                    bottom: -14px;
                    border-top: 8px solid #CCD2DE;
                }
            }
            .numSuccess {
                background-image: linear-gradient(to bottom, #65e0b7 0%, #23c811 100%);
                /*box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5);*/
                .num-angleSuccess {
                    border-top: 8px solid #23c811;
                }
            }
            .numoutShow {
                right: 77px;
                background-image: linear-gradient(to bottom, #65e0b7 0%, #23c811 100%);
                box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5);
                .num-angleSuccess {
                    border-top: 8px solid #23c811;
                }
            }
            .numout {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                border-radius: 4px;
                bottom: -40px;
                right: 2px;
                min-width: 74px;
                padding: 0 8px;
                height: 30px;
                box-shadow: 0 3px 5px 0 rgba(255, 169, 20, 0.50);
                background-image: linear-gradient(to bottom, #f7d23e 0%, #ffa914 100%);
                .num-angle {
                    position: absolute;
                    top: -14px;
                    left: 40px;
                    border-top: 8px solid transparent;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 8px solid #f7d23e;
                }
            }
        }
        /*未完成*/
        .ing_unfinished {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            max-width: 600px;
            border-radius: 5px;
            background-image: linear-gradient(to right, #FF0000, #FF0000);
            z-index: 10;
            .num {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                border-radius: 4px;
                top: -40px;
                right: -24px;
                min-width: 48px;
                height: 30px;
                box-shadow: 0 3px 5px 0 rgba(25, 144, 230, 0.50);
                background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%);
                z-index: 2;
                .num-angle {
                    position: absolute;
                    bottom: -13px;
                    z-index: -1;
                    left: 17px;
                    border-top: 8px solid #FF0000;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 8px solid transparent;
                }
            }
            .num0 {
                background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%);
                box-shadow: 0 3px 5px 0 rgba(143, 163, 204, 0.5);
                .num-angle0 {
                    bottom: -14px;
                    border-top: 8px solid #FF0000;
                }
            }
            .numSuccess {
                background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%);
                box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5);
                .num-angleSuccess {
                    border-top: 8px solid #FF0000;
                }
            }
            .numoutShow {
                right: 77px;
                background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%);
                box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5);
                .num-angleSuccess {
                    border-top: 8px solid #FF0000;
                }
            }
            .numout {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                border-radius: 4px;
                bottom: -40px;
                right: 2px;
                min-width: 74px;
                padding: 0 8px;
                height: 30px;
                box-shadow: 0 3px 5px 0 rgba(255, 169, 20, 0.50);
                background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%);
                .num-angle {
                    position: absolute;
                    top: -14px;
                    left: 40px;
                    border-top: 8px solid transparent;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 8px solid #FF0000;
                }
            }
        }

        .ingSuccess {
            background-image: linear-gradient(to right, #23c811 0%, #65e0b7 100%);
        }
        .ingOut {
            background-image: linear-gradient(to right, #ffa914 85%, #f7d23e 100%);
        }
        .input-ing {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            max-width: 600px;
            border-radius: 5px;
            background-image: linear-gradient(to right, #3dcfff 85%, #1ca1ff 100%);
            opacity: 0.5;
            .input-num {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                border-radius: 4px;
                top: 24px;
                right: -24px;
                min-width: 48px;
                height: 30px;
                box-shadow: 0 3px 5px 0 rgba(25, 144, 230, 0.50);
                background-image: linear-gradient(to bottom, #1CA1FF 0%, #3CCFFF 100%);
                z-index: 1;
                .num-angle {
                    position: absolute;
                    top: -16px;
                    z-index: -1;
                    left: 17px;
                    border-top: 8px solid transparent;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 8px solid #1CA1FF;
                }
            }

            .numSuccess {
                background-image: linear-gradient(to bottom, #65e0b7 0%, #23c811 100%);
                box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5);
                .num-angleSuccess {
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid #23c811;
                }
            }
        }
        .input-ingSuccess {
            background-image: linear-gradient(to right, #23c811 0%, #65e0b7 100%);
        }
        .input-ingOut {
            background-image: linear-gradient(to right, #ffa914 85%, #f7d23e 100%);
        }
    }

    .outNum {
        width: 500px;
        background-image: linear-gradient(135deg, #23c811 0%, #65e0b7 100%);
        z-index: 10;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 5px 0 0 5px;
    }

    .outNum_outNum {
        width: 500px;
        background-image: linear-gradient(135deg, #FF0000 0%, #FF0000 100%);
        z-index: 10;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 5px 0 0 5px;
    }

    .kuan {
        width: 500px !important;
        background-color: #f0f3f7 !important;
        background-image: linear-gradient(to right, #f0f3f7, #f0f3f7) !important;
    }
    .numoutShow_weizhi {
        right: 473px !important;
        background-image: linear-gradient(to bottom, #FF0000 0%, #FF0000 100%) !important;
        box-shadow: 0 3px 5px 0 rgba(35, 200, 17, 0.5) !important;
    }
</style>
