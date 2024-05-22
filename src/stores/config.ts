import { ref } from "vue";
import { defineStore } from "pinia";
import objectPath from "object-path";
import type LayoutConfigTypes from "@/layouts/default-layout/config/types";
import layoutConfig from "@/layouts/default-layout/config/DefaultLayoutConfig";

export const LS_CONFIG_NAME_KEY = "config_" + import.meta.env.VITE_APP_DEMO;

export const useConfigStore = defineStore("config", () => {
  const config = ref<LayoutConfigTypes>(layoutConfig);
  const initial = ref<LayoutConfigTypes>(layoutConfig);

  function getLayoutConfig(path: string, defaultValue?: string) {
    return objectPath.get(config.value, path, defaultValue);
  }

  function setLayoutConfigProperty(property: string, value: any) {
    objectPath.set(config.value, property, value);
    localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
  }

  function resetLayoutConfig() {
    config.value = Object.assign({}, initial.value);
  }

  /**
   * 초기설정값을 레이아웃설정에 셋팅한다.
   * 만약 localstorage 에 초기설정값이 존재하지 않으면 기본값을 사용하고,
   * 존재하면하면 그 값으로 덮어쓴다.
   */
  function overrideLayoutConfig() {
    config.value = initial.value = Object.assign(
      {},
      initial.value,
      JSON.parse(window.localStorage.getItem(LS_CONFIG_NAME_KEY) || "{}")
    );
  }

  return {
    config,
    getLayoutConfig,
    setLayoutConfigProperty,
    resetLayoutConfig,
    overrideLayoutConfig,
  };
});
