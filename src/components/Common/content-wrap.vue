<!-->带小黄条的box<-->
<template>
	<div class="content_wrap">
		<div class="content_wrap--head" :class="{big: type==='big'}">
			<div class="head-left">
                <span class="content_wrap--title">{{title}}</span>
                <span class="title-desc" v-if="$slots.titleDesc">
                    <slot name="titleDesc">
                    </slot>
                </span>
			</div>
            <div class="head-right" v-if="$slots.headRight">
                <slot name="headRight">
                </slot>
			</div>
		</div>
		<div class="content_wrap--content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
			    type: String,
			    default: '标题'
			},
			type: {
				type: String,
				default: 'small'
			}
        }
	}
</script>

<style lang="scss" scoped>
.content_wrap {
	&--head {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
		margin-bottom: 10px;
		font-size: 14px;
        color: #3b3b3b;
        .title-desc {
            font-size: 14px;
            vertical-align: middle;
        }
        .head-left {
            flex: 1
        }
    }
    &--title {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding-left: 14px;
        &::before {
            position: absolute;
            left: 0;
            top: 50%;
            content: '';
            display: block;
            width: 6px;
            height: 100%;
            transform: translateY(-50%);
            background: #ffa914;
        }
    }
	&--content {
        // overflow: hidden;
		padding: 10px 0;
	}
	.big {
        .content_wrap--title {
            font-size: 20px;
        }
	}
}
</style>
