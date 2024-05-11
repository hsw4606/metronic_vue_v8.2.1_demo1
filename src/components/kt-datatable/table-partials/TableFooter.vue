<template>
  <div class="row">
    <!-- TableItemsPerPageSelect 컴포넌트에 itemsPerPage 라는 이름의 prop 로 itemsCountInTable 값을 v-model 로 바인딩 지정한다. -->
    <TableItemsPerPageSelect
      v-model:itemsPerPage="itemsCountInTable"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
    <TablePagination
      v-if="pageCount > 1"
      :total-pages="pageCount"
      :total="count"
      :per-page="itemsPerPage"
      :current-page="page"
      @page-change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import TableItemsPerPageSelect from "@/components/kt-datatable/table-partials/table-content/table-footer/TableItemsPerPageSelect.vue";
import TablePagination from "./table-content/table-footer/TablePagination.vue";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  type WritableComputedRef,
} from "vue";

export default defineComponent({
  name: "table-footer",
  components: {
    TableItemsPerPageSelect,
    TablePagination,
  },
  props: {
    count: { type: Number, required: false, default: 5 },
    itemsPerPage: { type: Number, default: 5 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: ["update:itemsPerPage", "page-change"],
  setup(props, { emit }) {
    const page = ref(props.currentPage);
    const inputItemsPerPage = ref(props.itemsPerPage);

    // 총 데이터갯수가 변경된 경우 1 페이지로 변경
    watch(
      () => props.count,
      () => {
        page.value = 1;
      }
    );

    // 페이지당 row갯수가 변경된 경우 1 페이지로 변경
    watch(
      () => inputItemsPerPage.value,
      () => {
        page.value = 1;
      }
    );

    onMounted(() => {
      inputItemsPerPage.value = props.itemsPerPage;
    });

    const pageChange = (newPage: number) => {
      page.value = newPage;
      emit("page-change", page.value);
    };

    // TableItemsPerPageSelect 컴포넌트에 v-model 로 바인딩해서 보낼
    // 페이지당 row 수
    const itemsCountInTable: WritableComputedRef<number> = computed({
      // 위의 v-model:itemsPerPage="itemsCountInTable" 을 통해 가져갈 경우
      get(): number {
        return props.itemsPerPage;
      },
      // 위의 v-model:itemsPerPage="itemsCountInTable" 을 통해 변경된 경우
      set(value: number): void {
        inputItemsPerPage.value = value;
        // 상위 컴포넌트의 v-model:itemsPerPage 로 해당값을 올려보낸다.
        emit("update:itemsPerPage", value);
      },
    });

    const pageCount = computed(() => {
      return Math.ceil(props.count / itemsCountInTable.value);
    });

    return {
      pageChange,
      pageCount,
      page,
      itemsCountInTable,
      inputItemsPerPage,
    };
  },
});
</script>
