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
      <!-- 상위컴포넌트에서 넘어온 slot 만큼 v-for문을 돌려서 상위컴포넌트에서 보낸 slot 을 받을 slot 태그를 준비한다.
          그리고, 그대로 하위컴포넌트의 slot으로 보낸다. -->
      <!-- 그리고 하위컴포넌트에서 넘어온 row 의 값을 item 변수로 치환한다. -->
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <!-- 하위컴포넌트에서 넘어온 row 의 값을 item 변수로 치환해서 상위컴포넌트에 row 프로퍼티로 해서 넘긴다. -->
        <slot :name="name" :row="item" />
      </template>
    </TableContent>

    <!-- TableFooter 컴포넌트에 itemsPerPage 라는 이름의 prop 로 itemsInTable 값을 v-model 로 바인딩 지정한다. -->
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
    // 테이블의 헤더정보
    header: { type: Array, required: true },
    // 테이블의 모든 데이터 목록
    data: { type: Array, required: true },
    // 페이지당 row 수
    itemsPerPage: { type: Number, default: 10 },
    // 페이지당 row 수 변경 dropdown 활성화 여부
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 체크박스 사용여부
    checkboxEnabled: { type: Boolean, required: false, default: false },
    // 체크박스 대상 데이터 key
    checkboxLabel: { type: String, required: false, default: "id" },
    // 총 데이터수
    total: { type: Number, required: false },
    // 로딩바 보여주기 여부
    loading: { type: Boolean, required: false, default: false },
    // 최초 정렬할 대상
    sortLabel: { type: String, required: false, default: null },
    // 최초 정렬대상의 정렬 방식
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    // 데이터가 존재하지 않을경우 표시할 문구
    emptyTableText: { type: String, required: false, default: "No data found" },
    // 현재 페이지
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: [
    "page-change", // 페이지 이동 이벤트
    "on-sort", // 정렬 이벤트
    "on-items-select", // 체크박스 아이템 선택시 이벤트
    "on-items-per-page-change", // 페이지당 row 갯수 변경 이벤트
  ],
  components: {
    TableContent,
    TableFooter,
  },
  setup(props, { emit }) {
    // 현재 페이지
    // prop 자체는 변경이 불가하므로 이러한 방식으로 변경이 가능하도록 한다.
    // 변경이 가능해야 하는 이유는,
    // - 페이지당 row수가 변경되는 경우 1페이지부터 다시 시작해야 되기 때문
    const currentPage = ref(props.currentPage);

    // 페이지당 row 수
    const itemsInTable = ref<number>(props.itemsPerPage);

    // 하위컴포넌트(TableFooter)에 v-model 로 바인딩되어있는
    // itemsInTable 값이 변경된 경우 감지되서 실행되는 함수
    // 즉 페이지당 row 가 변경된 경우 currentPage 를 1로 변경하고
    // on-items-per-page-change 이벤트를 발생시키면서 현재페이지값을 넘겨준다.
    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    // 하위컴포넌트(TableFooter)에 의해 page 가 변경된 경우 실행되는 함수
    // 즉 여기서 하는 역할은 하위컴포넌트(TableFooter)에서
    // page 변경 이벤트가 발생한 경우 그대로 상위 컴포넌트에 이벤트를 넘긴다.
    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    // 정렬을 실행
    // 즉 여기서 하는 역할은 하위컴포넌트(TableContent)에서
    // 정렬변경 이벤트가 발생한 경우 그대로 상위 컴포넌트에 이벤트를 넘긴다.
    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    // 테이블에서 체크박스로 row 를 선택한 경우 실행되는 함수
    // 즉 여기서 하는 역할은 하위컴포넌트(TableContent)에서
    // 체크박스로 row 선택이벤트가 발생한 경우 그대로 상위 컴포넌트에 이벤트를 넘긴다.
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    // 실제 테이블상에 보여줄 데이터목록
    // page 가 변경될 경우 dataToDisplay 가 변경된다.
    // 실제 이러한 일이 발생되는 경우는...
    // 위의 watch 로 모니터링되고있는 하위컴포넌트(TableFooter)에 v-model 로 바인딩되어있는 itemsInTable 값이 변경되어서
    // page 가 변경처리되고
    // 그로인해 dataToDisplay 도 변경되는 상황이다.
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
