<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <!-- 상위컴포넌트에서 넘어온 slot 만큼 v-for문을 돌려서 하위컴포넌트의 slot으로 보낸다. -->
      <!-- 그리고 하위컴포넌트에서 넘어온 row 의 값을 item 변수로 치환한다. -->
      <template v-for="(_, idx) in $slots" v-slot:[idx]="{ row: item }">
        <!-- 하위컴포넌트에서 넘어온 row 의 값을 item 변수로 치환해서 상위컴포넌트에 row 프로퍼티로 해서 넘긴다. -->
        <slot :name="idx" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "kt-datatable",
  props: {
    // 상위 컴포넌트로 부터 넘어온 테이블의 헤더정보
    header: { type: Array, required: true },
    // 상위 컴포넌트로 부터 넘어온 테이블의 모든 데이터 목록
    data: { type: Array, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
  ],
  components: {
    TableContent,
    TableFooter,
  },
  setup(props, { emit }) {
    // 현재 페이지
    const currentPage = ref(props.currentPage);
    // 페이지당 row 수
    const itemsInTable = ref<number>(props.itemsPerPage);

    // itemsInTable 값이 변경된 경우 감지되서 실행되는 함수
    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    // page 가 변경된 경우 실행되는 함수
    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    // 실제 테이블상에 보여줄 데이터목록
    const dataToDisplay = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.data;
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
          return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
        }
      }
      return [];
    });

    // 총 데이터갯수
    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    // 정렬을 실행
    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    // 테이블에서 특정 row 를 선택한 경우 실행되는 함수
    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
    };
  },
});
</script>
