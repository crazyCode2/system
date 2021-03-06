/**
 * 项目入口文件
 */
/**
 * babel-polyfill
 * 为当前环境提供一个垫片
 * 用于实现浏览器不支持原生功能的代码
 */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
/**
 * 引入 react-redux
 * Provider 提供的是一个顶层容器的作用，实现store的上下文传递
 * connect 可以把state和dispatch绑定到react组件，使得组件可以访问到redux的数据
 */
import { Provider } from 'react-redux';

import store ,{ history } from './store';
import { ConnectedRouter } from 'react-router-redux';
/**
 * 引入 react-router-dom
 * Route 是路由的一个原材料，它是控制路径对应显示的组件。我们经常用的是exact、path以及component属性。
 * Switch 常常会用来包裹Route，它里面不能放其他元素，用来只显示一个路由。
 */
import {
  Route,
  Switch
} from 'react-router-dom';
/**
 * 获取所有路由数据
 */
import { getRouterData } from './common/router';
/**
 * 引入 ant-design 样式表
 */
import 'ant-design-pro/dist/ant-design-pro.css';

import Authorized from './utils/Authorized';
// Authorized.AuthorizedRoute
const { AuthorizedRoute } = Authorized;
// 所有路由数据
const routerData = getRouterData();
// 后台布局
const BaseLayout = routerData['/'].component;
// 登录布局
const UserLayout = routerData['/user'].component;

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route 
          path="/user"
          component={UserLayout}
        />
        <AuthorizedRoute
          path="/"
          render={props => <BaseLayout {...props} />}
          redirectPath="/user/login" // 权限异常时重定向的页面路由
        />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)