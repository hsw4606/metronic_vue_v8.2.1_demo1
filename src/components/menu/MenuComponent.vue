<template>
  <slot name="toggle"></slot>
  <slot name="content"></slot>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "kt-menu-component",
  components: {},
  props: {
    menuSelector: { type: String, required: true },
  },
  setup(props) {
    onMounted(() => {
      // onMounted 로 인한 onMounted 내부의 스크립트등으로 발생하는 DOM 업데이트등... onMounted 로 인한 작업이 다 끝난다음 nextTick 안의 스크립트를 실행한다.
      nextTick(() => {
        MenuComponent.createInsance(props.menuSelector);
      });
    });
  },
});
</script>
