import { ref } from "vue";
import { defineStore } from "pinia";
import { ThemeModeComponent } from "@/assets/ts/layout";

export const THEME_MODE_LS_KEY = "kt_theme_mode_value";
export const THEME_MENU_MODE_LS_KEY = "kt_theme_mode_menu";

export const useThemeStore = defineStore("theme", () => {
  const mode = ref<"light" | "dark" | "system">(
    localStorage.getItem(THEME_MODE_LS_KEY) as "light" | "dark" | "system"
  );

  /**
   * theme 모드를 localstorage 에 저장한다.
   * 그리고 html dom 의 root(즉 html 태그) 에 data-bs-theme 속성값으로 셋팅한다.
   * @param payload
   */
  function setThemeMode(payload: "light" | "dark" | "system") {
    let currentMode = payload;
    localStorage.setItem(THEME_MODE_LS_KEY, currentMode);
    localStorage.setItem(THEME_MENU_MODE_LS_KEY, currentMode);
    mode.value = currentMode;

    if (currentMode === "system") {
      currentMode = ThemeModeComponent.getSystemMode();
    }

    document.documentElement.setAttribute("data-bs-theme", currentMode);
    ThemeModeComponent.init();
  }

  return {
    mode,
    setThemeMode,
  };
});
