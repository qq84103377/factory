<template>
    <div class="good-type">
        <div class="good-type-item hover-green"
        :class="{'is-selected': activeIndex === 0, 'default-active': (isUnReport || isQuality) && activeIndex === ''}"
        @click="handleSelectType(0)">
            <i class="icon-good-type icon-quality"></i>
            <p class="good-type-desc">{{ qualityText }}</p>
            <span class="icon-checked"
            :class="{'default-active': activeIndex === ''}"
            v-show="activeIndex === 0"></span>
        </div>
        <div class="good-type-item hover-orange"
        :class="{'is-selected': activeIndex === 1, 'default-active': isDefective && activeIndex === ''}"
        @click="handleSelectType(1)">
            <i class="icon-good-type icon-defective"></i>
            <p class="good-type-desc">{{ defectiveText }}</p>
            <p class="good-type-desc defective-desc" v-show="isDefective">点击再次返修</p>
            <span class="icon-checked" v-show="activeIndex === 1"></span>
        </div>
        <div class="good-type-item hover-red"
        :class="{'is-selected': activeIndex === 2, 'default-active': isWasted && activeIndex === ''}"
        @click="handleSelectType(2)">
            <i class="icon-good-type icon-waste"></i>
            <p class="good-type-desc">{{ wastedText }}</p>
            <span class="icon-checked" v-show="activeIndex === 2"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activeIndex: [String, Number],
        status: [String, Number],
        reportingData: []
    },
    data() {
        return {
            qualityText: '合格品',
            defectiveText: '次品',
            wastedText: '废品'
        }
    },
    computed: {
        // 未上报
        isUnReport() {
            return this.status === 4;
        },
        // 合格品
        isQuality() {
            return this.status === 1;
        },
        // 次品
        isDefective() {
            console.log(this.status);
            return this.status === 2;
        },
        // 废品
        isWasted() {
            return this.status === 3;
        }
    },
    watch: {
        reportingData(val) {
            this.renderQualityText();
        }
    },
    mounted() {
        if (!this.isUnReport) {
            this.renderQualityText();
        } 
    },
    methods: {
        handleSelectType(index) {
            this.$emit('on-item-click', index);
        },
        renderQualityText() {
            let [qualityText, defectiveText, wastedText] = ['改为合格品', '改为次品', '改为废品'];
            if (this.isQuality) {
                qualityText = '当前合格品';
            }
            else if (this.isDefective) {
                defectiveText = '当前次品';
            }
            else if (this.isWasted) {
                wastedText = '当前废品';
            }
            else if (this.isUnReport) {
                [qualityText, defectiveText, wastedText] = ['合格品', '次品', '废品'];
            }
            this.qualityText = qualityText;
            this.defectiveText = defectiveText;
            this.wastedText = wastedText;
        }
    }
}
</script>

<style lang="scss" scoped>
%green {
    color: #23c811;
    border-color: #23c811;
    .icon-quality {
        background: url(../../../assets/images/pic_qualified-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #23c811
    }
}
%orange {
    color: #ff7f14;
    border-color: #ff7f14;
    .icon-defective {
        background: url(../../../assets/images/pic_defective-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #ff7f14
    }
}
%red {
    color: #fa4150;
    border-color: #fa4150;
    .icon-waste {
        background: url(../../../assets/images/pic_waste-pick.png) no-repeat;
    }
    .icon-checked {
        border-bottom-color: #fa4150
    }
}
.good-type {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
.good-type-item {
    position: relative;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    padding-top: 25px;
    text-align: center;
    font-size: 14px;
    color: #a2abb8;
    cursor: pointer;
    border-radius: 2px;
    border: solid 1px #c4c6cc;
    &.default-active {
        &.hover-green {
            @extend %green;
        }
        &.hover-orange {
            @extend %orange;
        }
        &.hover-red {
            @extend %red;
        }
    }
    // &.is-highlight {
    //     &.hover-green {
    //         @extend %green;
    //     }
    //     &.hover-orange {
    //         @extend %orange;
    //     }
    //     &.hover-red {
    //         @extend %red;
    //     }
    // }
    &.is-selected {
        &.hover-green {
            @extend %green;
        }
        &.hover-orange {
            @extend %orange;
        }
        &.hover-red {
            @extend %red;
        }
    }
    .icon-good-type {
        display: inline-block;
        width: 54px;
        height: 46px;
    }
    p {
        margin-top: 9px;
    }
    .defective-desc {
        margin-top: 5px;
        font-size: 12px;
        color: #ff7f14;
    }
    .icon-quality {
        background: url(../../../assets/images/pic_qualified-disable.png) no-repeat;
        background-size: 100% 100%;
    }
    .icon-defective {
        background: url(../../../assets/images/pic_defective-disable.png) no-repeat;
        background-size: 100% 100%;
    }
    .icon-waste {
        background: url(../../../assets/images/pic_waste-disable.png) no-repeat;
        background-size: 100% 100%;
    }
    .icon-checked {
        position: absolute;
        display: block;
        right: 0;
        bottom: 0;
        border-bottom: 35px solid #c4c6cc;
        border-left: 35px solid transparent;
        &::after {
            position: absolute;
            top: 15px;
            right: 5px;
            display: block;
            content: '';
            width: 6px;
            height: 12px;
            border-radius: 2px;
            transform: rotate(45deg);
            border-right: 3px solid #fff;
            border-bottom: 3px solid #fff; 
        }
    }
}
</style>
