import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { App } from '@/router/types';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => {
    const setting: AppState = {
      ...defaultSettings,
      menus: new Map(),
      permissions: [],
      apps: [],
      app: '',
      homes: new Map(),
    };
    return setting;
  },

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appMenu(state: AppState) {
      return state.menus.get(state.app) || [];
    },
    appList(state: AppState) {
      return state.apps || [];
    },
    appPermissions(state: AppState) {
      return state.permissions;
    },
    appHome(state: AppState) {
      return state.homes.get(state.app) || '';
    },
    currentApp(state: AppState) {
      return state.app;
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    clearMenu() {
      this.menus = new Map();
    },
    setApps(apps: App[]) {
      this.apps = apps;
    },
    setMenus(menus: Map<string, RouteRecordNormalized[]>) {
      this.menus = menus;
    },
    setPermissions(ps: string[]) {
      this.permissions = ps;
    },
    setHomes(homes: Map<string, string>) {
      this.homes = homes;
    },
    setCurrentApp(app?: string) {
      if (app) {
        this.app = app;
      } else {
        this.app = this.apps[0].keyword;
      }
    },
  },
});

export default useAppStore;
