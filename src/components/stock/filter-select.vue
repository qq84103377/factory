<template>
    <div class="nf-select-wrap">
        <span class="nf-select__title">{{ title }}：</span>
        <ul>
            <li class="nf-select__item"
            @click="handleSelectAll('ALL')"
            :class="{'nf-select__active': value[0]=='ALL'}">
                <span>全部</span>
            </li>
            <li class="nf-select__item"
            @click="handleSelectAll('NOTHING')"
            :class="{'nf-select__active': value[0]=='NOTHING'}">
                <span>无</span>
            </li>
            <slot></slot>
        </ul>
    </div>
</template>

<script>
    export default {
        componentName: 'FilterSelect',
        props: {
            value: {},
            title: String
        },
        data() {
            return {
                isSelect: true
            }
        },
        methods: {
            handleOptionSelect(options) {
                let value = this.value.slice();
                const optionIndex = this.getValueIndex(value, options.value);
                if (this.getValueIndex(value, 'ALL') > -1) {
                    value.splice(optionIndex, 1)
                }
                if (optionIndex > -1) {
                    value.splice(optionIndex, 1)
                }
                else {
                    value.push(options.value)
                }
                this.$emit('input', value)
                this.$emit('change', value)
            },
            getValueIndex(arr = [], value) {
                return arr.indexOf(value)
            },
            handleSelectAll(val) {
                this.$emit('input', [val])
                this.$emit('change', [val])
            }
        },
        created () {
            this.$on('handleOptionClick', this.handleOptionSelect);
        }
    }
</script>

<style lang="scss" scoped>
    .nf-select-wrap {
        display: flex;
        align-items: center;
        .nf-select__title {
            margin-right: 12px;
            font-size: 14px;
            color: #aaaaaa;
        }
        ul {
            flex: 1;
        }

    }
    .nf-select__item {
        display: inline-block;
        padding: 4px 12px;
        font-size: 12px;
        color: #636363;
        cursor: pointer;
        border-radius: 2px;
        border: 1px solid #d0d2d6;
    }
    .nf-select__active {
        color: #ff9c38;
        border-color: #ff9c38;
    }
</style>

