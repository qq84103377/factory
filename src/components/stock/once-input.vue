<template>
    <div class="input-wrap">
        <input
        v-if="scope.row.lengths &&
        !scope.row.lengths.length"
        class="column-input"
        type="text"
        v-model="scope.row.stockNum"
        @input="handleInputRowValue(scope.row, scope.$index)" />
        <input
        v-if="scope.row.lengths &&
        scope.row.lengths.length &&
        onceInputModel[scope.row.id + '/'  + scope.row.colorId + '/' + lengthItem.standardId]"
        v-for="(lengthItem, index) in scope.row.lengths"
        :key="index"
        class="column-input"
        type="text"
        v-model="onceInputModel[scope.row.id + '/'  + scope.row.colorId + '/' + lengthItem.standardId].stockNum"
        @input="handleInputRowValue(scope.row, scope.$index, lengthItem)" />
    </div>
<!-- <div class="input-item">
    <input
        v-if="!isLength"
        class="column-input"
        type="text"
        v-model="row.stockNum"
        @input="handleInputRowValue" />
    <input
    v-if="isLength && onceInputModel[skuIdStr]"
    class="column-input"
    type="text"
    v-model="onceInputModel[skuIdStr].stockNum"
    @input="handleInputRowValue" />
</div> -->
</template>

<script>
export default {
    props: {
        onceInputModel: {},
        // lengthItem: {},
        scope: {}
    },
    computed: {
        // skuIdStr() {
        //     const row = this.row;
        //     return this.isLength && `${row.id}/${row.colorId}/${this.lengthItem.standardId}`;
        // },
        // isLength() {
        //     return this.lengthItem;
        // }
    },
    methods: {
        handleInputRowValue(row, index, lengthItem) {
            this.$emit('on-input', row, index, lengthItem)
        }
    }
}
</script>

<style lang="scss" scoped>
    input {
        width: 100%;
        height: 36px;
        padding: 0;
        text-align: center;
        box-sizing: border-box;
        background: none;
        &:not(:last-child) {
            border-bottom: 1px solid rgb(223, 228, 236)
        }
        &:focus {
            border: 1px solid #ffa914;
        }
    }
</style>

