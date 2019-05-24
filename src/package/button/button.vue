<template>
  <button :disabled="disabled" class="nf-button"
    @click.stop="handleClick"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'nf-button--' + type : '',
      size ? 'nf-button--' + size : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain
      }
    ]"
    :style="{
      'background': noBackground ? 'none' : '',
      'width':width?width+'px':'',
      'fontSize':fsize?fsize+'px':'16px'
    }"
  >
  	<svg
  		v-if="svg"
    		class="icon"
    		:class="svg"
    		width="16"
    		height="16"
    		aria-hidden="true">
        	<use :xlink:href="'#' + svg"></use>
    	</svg>
    <i class="el-icon-loading" v-if="loading" @click="handleInnerClick"></i>
    <i :class="icon" class="nf-icon" v-if="icon && !loading" @click="handleInnerClick"></i>
    <span v-if="$slots.default" @click="handleInnerClick"><slot></slot></span>
  </button>
</template>
<script>
export default {
    name: 'NfButton',
    props: {
        svg: {
            type: String
        },
        type: {
            type: String,
            default: 'default'
        },
        size: String,
        icon: {
            type: String,
            default: ''
        },
        nativeType: {
            type: String,
            default: 'button'
        },
        width: {
            // default: 98
        },
        fsize: {
            default: 14
        },
        noBackground: Boolean,
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean, // 背景色
        autofocus: Boolean
    },
    methods: {
        handleClick(evt) {
            // if (this.loading) return;
            this.$emit('click', evt);
        },
        handleInnerClick(evt) {
            if (this.disabled) {
                evt.stopPropagation();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.nf-icon {
    font-size: 12px;
    margin-right: 4px;
}
.icon {
    transform: scale(.8)
}
.nf-button {
    padding: 7px 0;
    font-size: 16px;
    background: none;
    cursor: pointer;
    border-radius: 2px;
    box-sizing: border-box;
    &.is-loading {
        opacity: 0.5;
        pointer-events: none;
    }
}
.nf-button--primary,
.nf-button--default,
.nf-button--success,
.nf-button--warning,
.nf-button--danger,
.nf-button--warningsimple,
.nf-button--unimportance {
    // width: 130px;
    padding-left: 16px;
    padding-right: 16px;
    transition: all 0.5s;
}
.nf-button--primary,
.nf-button--success,
.nf-button--warning,
.nf-button--danger {
    color: #ffffff;
}
.nf-button--default,
.nf-button--warningsimple {
    color: #808080;
    border: solid 1px #dce0e6;
    &:hover {
        border-color: #adafb3;
        background: #fafafa;
    }
}
.nf-button--primary,
.nf-button--success,
.nf-button--warning,
.nf-button--danger {
    color: #ffffff;
}
.nf-button--primary {
    border-color: #1ca1ff;
    background: #1ca1ff;
    &:hover {
        background: #1a97f0;
    }
}
.nf-button--warning {
    background: #ff9c38;
    border: 1px solid #ff9c38;
    &:hover {
        background: #eb8f34;
    }
}
.nf-button--success {
    background: #6edb58;
    border: 1px solid #6edb58;
    &:hover {
        background: #63c750;
    }
}
.nf-button--danger {
    background: #f55d5d;
    border: 1px solid #f55d5d;
    &:hover {
        background: #e05555;
    }
}
.nf-button--warningsimple {
    &:hover {
        color: #ff9c38;
        border-color: #ff9c38;
        // background: #ff9c38;
    }
}
.nf-button--block {
    display: block;
    width: 100%;
    height: 45px;
    font-size: 16px;
    // color: #ffffff;
}
/*.nf-button--small {*/
    /*width: 98px;*/
/*}*/
/*.nf-button--large {*/
    /*width: 180px;*/
/*}*/
/*.nf-button--medium {*/
    /*width: 130px;*/
/*}*/
.nf-button--small {
    padding: 5px 16px;
    /*width: 56px;*/
    /*height: 24px;*/
    font-size: 12px;
}
.nf-button--big {
    padding: 8px 40px;
    /*width: 56px;*/
    /*height: 24px;*/
    font-size: 12px;
}
.is-plain {
    background: none;
    border: 1px solid #d0d2d6;
    color: #d0d2d6;
    // padding: 7px 24px;
    &.nf-button--warning {
        border-color: #ff9c38;
        color: #ff9c38;
        &:hover {
            color: #ffffff;
            border-color: #ff9c38;
            background: #ff9c38;
        }
    }
}

.nf-button--upload {
    width: 80px;
    height: 34px;
    color: #1ca1ff;
    border: solid 1px #1ca1ff;
    background: #f7fafc;
    &:hover {
        background: #f0f6fa;
        border: solid 1px #1ca1ff;
    }
}
.nf-button--unimportance {
    // width: 80px;
    // height: 34px;
    color: #ff9c38;
    border: solid 1px #ff9c38;
    &:hover {
        // background: #f0f6fa;
        color: #eb8d2f;
        border: solid 1px #eb8d2f;
    }
}
.nf-button--filter {
    color: rgb(255, 255, 255);
    border-radius: 2px;
    border: 1px solid rgb(84, 209, 188);
    background-color: rgb(84, 209, 188);
}
.nf-button.is-disabled {
    color: #bfcbd9!important;
    cursor: not-allowed;
    background-color: #eef1f6;
    border-color: #d1dbe5!important;
    &:hover {
        color: #bfcbd9;
        background-color: #eef1f6;
        border-color: #d1dbe5;
    }
}
</style>
