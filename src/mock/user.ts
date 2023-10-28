import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar:
            '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    });

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: MockParams) => {
      const { username, password } = JSON.parse(params.body);
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000);
      }
      if (username === 'admin' && password === 'admin') {
        window.localStorage.setItem('userRole', 'admin');
        return successResponseWrap({
          token: '12345',
        });
      }
      if (username === 'user' && password === 'user') {
        window.localStorage.setItem('userRole', 'user');
        return successResponseWrap({
          token: '54321',
        });
      }
      return failResponseWrap(null, '账号或者密码错误', 50000);
    });

    // 登出
    Mock.mock(new RegExp('/api/user/logout'), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
        {
          app: 'basic',
          title: '用户中心',
          icon: 'user',
          type: 'R',
          children: [
            {
              app: 'basic',
              path: '/basic/dashboard',
              keyword: 'basicDashboard',
              component: 'Layout',
              redirect: '/basic/dashboard/workplace',
              is_hidden: false,
              type: 'M',
              permission: '',
              icon: 'dashboard',
              order: 1,
              is_home: false,
              title: '用户管理',
              weight: 10,
              children: [
                {
                  app: 'basic',
                  path: '/basic/dashboard/workplace',
                  keyword: 'basicWorkplace',
                  component: 'basic/dashboard/workplace/index',
                  redirect: '',
                  is_hidden: false,
                  type: 'M',
                  permission: '',
                  title: '用户管理1',
                  icon: 'dashboard',
                  weight: 10,
                },
                {
                  app: 'basic',
                  path: '/basic/dashboard/workplace2',
                  keyword: 'basicWorkplace2',
                  component: 'basic/dashboard/workplace2/index',
                  redirect: '',
                  is_hidden: false,
                  type: 'M',
                  is_home: true,
                  permission: '',
                  title: '用户管理2',
                  icon: 'dashboard',
                  weight: 10,
                },
              ],
            },
          ],
        },
        {
          app: 'configure',
          title: '配置中心',
          icon: 'user',
          type: 'R',
          children: [
            {
              app: 'configure',
              path: '/configure/dashboard',
              keyword: 'configureDashboard',
              component: 'Layout',
              redirect: '/configure/dashboard/workplace',
              is_hidden: false,
              type: 'M',
              permission: '',
              icon: 'dashboard',
              order: 1,
              is_home: false,
              title: '配置管理',
              weight: 10,
              children: [
                {
                  app: 'configure',
                  path: '/configure/dashboard/workplace',
                  keyword: 'configureWorkplace',
                  component: 'basic/dashboard/workplace/index',
                  redirect: '',
                  is_hidden: false,
                  type: 'M',
                  permission: '',
                  title: '配置中心1',
                  icon: 'dashboard',
                  weight: 10,
                },
                {
                  app: 'configure',
                  path: '/configure/dashboard/workplace2',
                  keyword: 'configureWorkplace2',
                  component: 'basic/dashboard/workplace2/index',
                  redirect: '',
                  is_hidden: false,
                  type: 'M',
                  is_home: true,
                  permission: '',
                  title: '配置中心2',
                  icon: 'dashboard',
                  weight: 10,
                },
              ],
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });
  },
});
