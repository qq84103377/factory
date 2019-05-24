<template>
	<div>
		<div id="remarkPicParent">
			<div id="remarkPic">
				<div :class="{'standard':remark.length>0}">
					<div v-if="remark" v-for="(item,index) in remark">
						<img :src="item.picPath">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				remark: [],
			}
		},
		props: ['data'],
		methods: {
			async remarkHtml() {
				await (this.remark = JSON.parse(this.data));
                let b = await document.querySelector("#remarkPicParent");
				await this.$emit('remarkPicHtml', b.innerHTML);
			},
		},
		watch: {
			data(val) {
				this.remarkHtml();
			}
		},
		mounted() {
			if(this.data.length > 0) {
				this.remarkHtml();
			}
		}
	}
</script>
<style lang="scss" scoped>
    #remarkPic{
        max-height: 100%;
        max-width:800px;
        // border: 1px solid #ccc;
        display: flex;
        justify-content: flex-start;
        .standard{
            display: flex;
            justify-content: flex-start; 
            flex-wrap: wrap;
            width:800px;
            // height: 600px; 
            align-items: center;
            padding-left:12px;
            padding:12px; 
            padding-left:0;
            // border:1px solid #000;  
            img{
                width:100%;
                height: 100%;
                padding:12px;
            }   
        }
    }
</style>
<style lang="scss">
    .vue-barcode-element {
        width:400px;
    }
    @media print {
    #remarkPic{
        max-height: 100%;
        max-width:800px;
        // border: 1px solid #ccc;
        display: flex;
        justify-content: flex-start;
        .standard{
            display: flex;
            justify-content: flex-start; 
            flex-wrap: wrap;
            width:800px;
            // height: 600px; 
            align-items: center;
            padding-left:12px;
            padding:12px; 
            padding-left:0;
            // border:1px solid #000;  
            img{
                width:100%;
                height: 100%;
                padding:12px;
            }   
        }
    }
    }
</style>

