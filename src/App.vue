<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted } from "vue";
import { RouterView } from "vue-router";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useBodyStore } from "@/stores/body";
import { themeConfigValue } from "@/layouts/default-layout/config/helper";
import { initializeComponents } from "@/core/plugins/keenthemes";

export default defineComponent({
  name: "app",
  components: {
    RouterView,
  },
  setup() {
    // 설정 store 사용
    const configStore = useConfigStore();
    // theme store 사용
    const themeStore = useThemeStore();
    // body store 사용
    const bodyStore = useBodyStore();

    onBeforeMount(() => {
      /**
       * 레이아웃 설정을 configStore 의 config 에 적용한다.
       */
      configStore.overrideLayoutConfig();

      /**
       * theme 모드를 설정한다.
       */
      themeStore.setThemeMode(themeConfigValue.value);
    });

    onMounted(() => {
      // onMounted 로 인한 onMounted 내부의 스크립트등으로 발생하는 DOM 업데이트등... onMounted 로 인한 작업이 다 끝난다음 nextTick 안의 스크립트를 실행한다.
      nextTick(() => {
        // 컴포넌트들의 초기화 작업을 진행한다.
        initializeComponents();

        // body에서 로딩바를 제거한다.
        bodyStore.removeBodyClassName("page-loading");
      });
    });
  },
});
</script>

<style lang="scss">
@import "bootstrap-icons/font/bootstrap-icons.css";
@import "apexcharts/dist/apexcharts.css";
@import "quill/dist/quill.snow.css";
@import "animate.css";
@import "sweetalert2/dist/sweetalert2.css";
@import "nouislider/dist/nouislider.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";
@import "socicon/css/socicon.css";
@import "line-awesome/dist/line-awesome/css/line-awesome.css";
@import "dropzone/dist/dropzone.css";
@import "@vueform/multiselect/themes/default.css";
@import "prism-themes/themes/prism-shades-of-purple.css";
@import "element-plus/dist/index.css";

// Main demo style scss
@import "assets/keenicons/duotone/style.css";
@import "assets/keenicons/outline/style.css";
@import "assets/keenicons/solid/style.css";
@import "assets/sass/element-ui.dark";
@import "assets/sass/plugins";
@import "assets/sass/style";

#app {
  display: contents;
}
</style>
