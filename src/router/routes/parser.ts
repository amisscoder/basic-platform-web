import type { RouteRecordNormalized } from 'vue-router';
import { Menu } from '@/api/basic/types/menu';
import { DEFAULT_LAYOUT } from './base';
import { App, Component } from '../types';

class Parser {
  // 应用名称集合
  apps: App[] = [];

  // 菜单列表集合
  menus: Map<string, RouteRecordNormalized[]> = new Map();

  // 首页路由
  homes: Map<string, string> = new Map();

  // 组件
  components: Record<string, () => Promise<unknown>>;

  // 路由
  routers: RouteRecordNormalized[];

  // 指令
  permissions: string[];

  // 临时变量homePath
  homePath = '';

  // 初始化构造函数
  constructor(menus: Menu[]) {
    // 加载组件，最大支持5个层级
    this.components = {
      ...import.meta.glob(`@/views/*/*/*.vue`),
      ...import.meta.glob(`@/views/*/*/*/*.vue`),
      ...import.meta.glob(`@/views/*/*/*/*/*.vue`),
    };

    this.permissions = [];
    this.routers = [];
    // 循环获取应用路由
    menus.forEach((menu) => {
      this.apps.push(Parser.GetApp(menu));

      // 获取路由指令
      if (menu.children) {
        // 获取指令/路由/首页
        const routers: RouteRecordNormalized[] = [];
        this.handler(menu.children, routers);
        this.homes.set(menu.app, this.homePath);
        this.menus.set(menu.app, routers);
        this.routers = this.routers.concat(routers);
      }
    });
  }

  // GetApp 获取App
  private static GetApp = (menu: Menu): App => {
    return {
      keyword: menu.app,
      title: menu.title,
      icon: menu.icon as string,
    };
  };

  // 获取首页路由
  GetHomePath = () => {
    return this.homes;
  };

  // 获取路由
  GetRouter = () => {
    return this.routers;
  };

  // 获取路由
  GetMenu = () => {
    return this.menus;
  };

  GetApps = () => {
    return this.apps;
  };

  // handler 加载菜单以及指令
  private handler = (menus: Menu[], routers: RouteRecordNormalized[]) => {
    menus.forEach((menu) => {
      // 处理菜单
      let router: any = null;

      if (menu.type === 'M') {
        if (menu.is_home) this.homePath = menu.path; // 获取首页

        // 加载组件
        let component: Component;
        if (menu.component !== 'Layout') {
          if (!this.components[`/src/views/${menu.component}.vue`]) {
            // eslint-disable-next-line no-console
            console.error(`不存在组件：/src/views/${menu.component}.vue`);
            return;
          }
          component = () =>
            this.components[`/src/views/${menu.component}.vue`]();
        }

        router = {
          path: menu.path,
          name: menu.name,
          component: menu.component === 'Layout' ? DEFAULT_LAYOUT : component,
          redirect: menu.redirect,
          activeMenu: menu.name,
          children: [],
          meta: {
            app: menu.app,
            requiresAuth: true,
            title: menu.title,
            icon: `icon-${menu.icon}`,
            hideInMenu: menu.is_hidden,
            order: -menu.weight,
            ignoreCache: !menu.is_cache,
          },
        };
        routers.push(router);
      }

      // 处理指令
      if (menu.permission) {
        this.permissions.push(menu.permission);
      }

      // 处理子菜单
      if (menu.children) {
        if (router) {
          this.handler(menu.children, router.children);
        } else {
          this.handler(menu.children, routers);
        }
      }
    });
  };

  // 获取指令
  GetPermission = (): string[] => {
    return this.permissions;
  };
}

export default Parser;
