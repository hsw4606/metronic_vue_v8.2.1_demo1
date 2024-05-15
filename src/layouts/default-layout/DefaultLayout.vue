<template>
  <!--begin::App-->
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <KTHeader />
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <KTSidebar />
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid">
            <KTToolbar />
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <KTContent></KTContent>
            </div>
          </div>
          <!--end::Content wrapper-->
          <KTFooter />
        </div>
        <!--end:::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
  <!--end::App-->

  <KTDrawers />
  <KTScrollTop />
  <KTModals />
  <KTCustomize />
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  watch,
} from "vue";
import KTHeader from "@/layouts/default-layout/components/header/Header.vue";
import KTSidebar from "@/layouts/default-layout/components/sidebar/Sidebar.vue";
import KTContent from "@/layouts/default-layout/components/content/Content.vue";
import KTToolbar from "@/layouts/default-layout/components/toolbar/Toolbar.vue";
import KTFooter from "@/layouts/default-layout/components/footer/Footer.vue";
import KTDrawers from "@/layouts/default-layout/components/drawers/Drawers.vue";
import KTModals from "@/layouts/default-layout/components/modals/Modals.vue";
import KTScrollTop from "@/layouts/default-layout/components/extras/ScrollTop.vue";
import KTCustomize from "@/layouts/default-layout/components/extras/Customize.vue";
import { useRoute } from "vue-router";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import LayoutService from "@/core/services/LayoutService";

export default defineComponent({
  name: "default-layout",
  components: {
    KTHeader,
    KTSidebar,
    KTContent,
    KTToolbar,
    KTFooter,
    KTDrawers,
    KTScrollTop,
    KTModals,
    KTCustomize,
  },
  setup() {
    const route = useRoute();

    onBeforeMount(() => {
      LayoutService.init();
    });

    onMounted(() => {
      // onMounted 로 인한 onMounted 내부의 스크립트등으로 발생하는 DOM 업데이트등... onMounted 로 인한 작업이 다 끝난다음 nextTick 안의 스크립트를 실행한다.
      nextTick(() => {
        reinitializeComponents();
      });
    });

    watch(
      () => route.path,
      () => {
        // route.path 변경 로 인한 내부의 스크립트등으로 발생하는 DOM 업데이트등... 작업이 다 끝난다음 nextTick 안의 스크립트를 실행한다.
        nextTick(() => {
          reinitializeComponents();
        });
      }
    );
  },
});
</script>
