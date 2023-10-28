import { App } from '@/router/types';
import type { RouteRecordNormalized } from 'vue-router';

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menus: Map<string, RouteRecordNormalized[]>;
  permissions: string[];
  apps: App[];
  homes: Map<string, string>;
  app: string;
  [key: string]: unknown;
}
