import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useAppStore } from '@/store';
import { getMenuList } from '@/api/basic/user';
import Parser from '../routes/parser';
import { NOT_FOUND_ROUTE, REDIRECT_MAIN } from '../routes/base';

export const WHITE_LIST = ['notFound', 'login'];

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();

    // 白名单直接路由
    if (WHITE_LIST.includes(to.name as string)) {
      next();
      NProgress.done();
      return;
    }

    if (!appStore.apps.length) {
      // 从服务端获取菜单
      const { data } = await getMenuList();

      // 初始化解析器
      const parser = new Parser(data);

      // 获取路由并注册
      const routers = parser.GetRouter();
      routers.forEach((item) => {
        router.addRoute(item);
      });

      // 添加到路由中
      router.addRoute(REDIRECT_MAIN);
      router.addRoute(NOT_FOUND_ROUTE);

      // 保存指令
      appStore.setPermissions(parser.GetPermission());

      // 保存菜单
      appStore.setMenus(parser.GetMenu());

      // 保存主页
      appStore.setHomes(parser.GetHomePath());

      // 设置应用列表
      appStore.setApps(parser.GetApps());

      // 设置默认的应用
      appStore.setCurrentApp();

      if (to.path === '/') {
        if (appStore.appHome) {
          next({ path: appStore.appHome, replace: true });
        } else {
          const menu = appStore.appMenu;
          next({ path: menu[0].path, replace: true });
        }
      } else {
        next({ ...to, replace: true });
      }
    } else {
      next();
    }
    NProgress.done();
  });
}
