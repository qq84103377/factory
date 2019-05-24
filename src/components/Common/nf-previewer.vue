<template>
    <div  class="pswp nf-previewer" ref="pswp" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>
            <div class="pswp__ui pswp__ui--hidden">
                <div class="pswp__top-bar">
                    <div class="pswp__counter"></div>

                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                    <button class="pswp__button pswp__button--share" title="Share"></button>

                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                </button>

                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                </button>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import UI from 'photoswipe/dist/photoswipe-ui-default'
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        value: {
            type: String,
            default: 'src'
        }
    },
    data() {
        return {
            photoswipe: {},
            options: {
                // optionName: 'option value'
                // for example:
                index: 0 // start at first slide
            }
        }
    },
    computed: {
        currentList() {
            return this.list.map(item => {
                if (typeof item.w === 'undefined') {
                    item.w = 0;
                    item.h = 0;
                    item.src = item[this.value]
                }
                return item
            })
        }
    },
    mounted() {
        // this.init();
    },
    methods: {
        init(index) {
            const self = this
            const showItem = this.currentList[index]
            if (!showItem.w || !showItem.h || showItem.w < 5 || showItem.h < 5) {
                const img = new Image()
                img.onload = function () {
                    showItem.w = this.width
                    showItem.h = this.height
                    self.doInit(index)
                }
                img.src = showItem.src
            } else {
                this.doInit(index)
            }
        },
        doInit (index) {
            const self = this;
            this.photoswipe = new PhotoSwipe(this.$el, UI, this.currentList, this.options)

            this.photoswipe.listen('gettingData', function (index, item) {
                if (!item.w || !item.h || item.w < 1 || item.h < 1) {
                    const img = new Image()
                    img.onload = function () {
                        item.w = this.width
                        item.h = this.height
                        self.photoswipe.updateSize(true)
                    }
                    img.src = item.src
                }
            })
            this.photoswipe.init()
            this.photoswipe.listen('close', () => {
                this.$emit('on-close')
            })
        },
        show(index) {
            this.init(index)
        }
    }
}
</script>

<style src="photoswipe/dist/photoswipe.css"></style>
<style src="photoswipe/dist/default-skin/default-skin.css"></style>
<style lang="scss" scoped>
    .nf-previewer{
        z-index: 999999 !important;
    }
    .pswp__bg {
        opacity: .7!important;
    }
</style>

