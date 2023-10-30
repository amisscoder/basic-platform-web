import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useAppStore, useTabBarStore } from '@/store';
import { getMenuList } from '@/api/basic/auth';
import { TagProps } from '@/store/modules/tab-bar/types';
import Parser from '../routes/parser';
import { NOT_FOUND_ROUTE, REDIRECT_MAIN } from '../routes/base';
import { Home } from '../types';

export const WHITE_LIST = ['notFound', 'login'];

export function getHomeByMenu(router: Router): Home | undefined {
  const appStore = useAppStore();
  const menus = appStore.appMenu;

  const menu = menus[0];
  let { path } = menu;
  if (menu.redirect) {
    path = menu.redirect as string;
  }
  const hr = router.getRoutes().find((route) => route.path === path);
  if (!hr) {
    return undefined;
  }
  return <Home>{
    keyword: hr.name,
    path: hr.path,
    title: hr.meta.title,
  };
}

export function homeTransTag(home: Home): TagProps {
  return <TagProps>{
    fullPath: home.path,
    title: home.title,
    name: home.keyword,
  };
}

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const tabStore = useTabBarStore();

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
      appStore.setHomes(parser.GetHome());

      // 设置应用列表
      appStore.setApps(parser.GetApps());

      // 设置默认的应用
      const curRouter = router
        .getRoutes()
        .find((route) => route.path === to.path);
      appStore.setCurrentApp(curRouter?.meta.app);

      // 设置默认首页
      let home = appStore.appHome;
      if (!home) {
        home = getHomeByMenu(router);
        appStore.setAppHome(appStore.currentAppKey, home as Home);
      }
      tabStore.setHomeTag(homeTransTag(home as Home));

      // 默认跳转到首页
      if (to.path === '/') {
        next({ path: appStore.appHomePath, replace: true });
      } else {
        next({ ...to, replace: true });
      }
    } else {
      next();
    }
    NProgress.done();
  });
}
