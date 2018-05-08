/**
 * 路由配置文件
 */
// import {createElement} from 'react';
/**
 * dva路由跳转
 * dynamic(app, model, component )
 * 第一个参数为挂载的对象，就是你要将这个router挂载到哪个实例上。
 * 第二个参数为这个router所需要的model。
 * 第三个参数为这个router的组件。
 */
// import dynamic from 'dva/dynamic';
// 获取侧边菜单数据
import { getMenuData } from './menu';
// 路由正则验证
import pathToRegexp from 'path-to-regexp';

// 登录页
import LoginPage from '../routes/login/index';
// 首页
// import Main from '../routes/home/index';
// 基础页面(页面布局--普通用户)
import BasicLayout from '../layouts/BaseLayout';
// 用户管理页
// import User from '../routes/user/index';
// 用户管理页(页面布局--管理员)
import UserLayout from '../layouts/UserLayout';
// 分析页
import Analysis  from '../routes/Dashboard/Analysis'
// 用户管理页
import UserManager from '../routes/user';
// 用户列表页
import UserList from '../routes/user/list';
// 添加用户页
import UserAdd from '../routes/user/add';
// 403 无权访问
import Unauthorized from '../routes/Exception/403';
// 404 访问的页面不存在
import NotFound from '../routes/Exception/404';
// 500 服务器出错
import ServerError from '../routes/Exception/500';

// 路由数据
// let routerDataCache;

// 获取菜单层级数据
function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) }; // 递归
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = () => {
  // 配置路由
  const routerConfig = {
    "/":{
      component: BasicLayout, // 后台布局
    },
    "/user":{
      component:UserLayout, // 登录布局
    },
    "/user/login":{
      component:LoginPage, // 登录页
    },
    "/dashboard/analysis":{
      component:Analysis, // 总览
    },
    "/syster/user":{
      component:UserManager, // 用户管理页
    },
    "/syster/user/list":{
      component:UserList, // 用户列表
    },
    "/syster/user/add":{
      component:UserAdd, // 添加用户
    },
    '/exception/403': { // 无权访问该页面
      component: Unauthorized,
    },
    '/exception/404': { // 访问的页面不存在
      component: NotFound,
    },
    '/exception/500': { // 服务器出错
      component: ServerError,
    },
  }
  
  // 从 ./menu.js 中获取名称或将其设置在路由器数据中
  const menuData = getFlatMenuData(getMenuData());
  // 路由配置数据
  const routerData = {};

  // 路由匹配菜单
  Object.keys(routerConfig).forEach((path) => {
    // 匹配项名称规则
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // 如果menuKey不是空的
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // 如果需要配置复杂参数路由
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });

  Object.values(routerConfig).forEach((v)=>{
    let {component} = v;
    component.defaultProps={routerData}
  })

  return routerData;
}