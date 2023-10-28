import { Component } from 'vue';
import { NavigationGuard, RouteMeta } from 'vue-router';

export interface Menu {
  app: string;
  path: string;
  type: string;
  title: string;
  icon?: string;
  is_hidden: boolean;
  is_cache: boolean;
  is_affix: boolean;
  is_home: boolean;
  permission?: string;
  name?: string | symbol;
  meta?: RouteMeta;
  redirect?: string;
  weight: number;
  component: Component | string;
  children?: Menu[];
  alias?: string | string[];
  props?: Record<string, any>;
  beforeEnter?: NavigationGuard | NavigationGuard[];
  fullPath?: string;
}
