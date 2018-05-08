/**
 * 后台布局
 * 基础页面布局，包含了头部导航，侧边栏和通知栏
 */
/**
 * PureComponent 纯组件
 * 把继承类从 Component 换成 PureComponent 即可，可以减少不必要的 render操作的次数，从而提高性能
 */
import React, { PureComponent } from 'react';
// 页面标题
import DocumentTitle from 'react-document-title';
// React.PropTypes返回的是一系列验证函数，用于确保接收的数据类似是否是有效的
import PropTypes from 'prop-types';
// 引入 antd UI库
import { Layout, message } from 'antd';
// 引入路由
import { Switch, Route, Redirect } from 'react-router-dom';
import classNames from 'classnames';
// 获取菜单栏信息
import { getMenuData } from '../common/menu';
// 响应css媒体查询的轻量级javascript库
import { enquireScreen } from 'enquire-js';
// 侧边菜单栏
import SiderMenu from '../components/SiderMenu';
// 顶部标题栏(页头)
import GlobalHeader from '../components/GlobalHeader';
// connect 可以把state和dispatch绑定到react组件，使得组件可以访问到redux的数据
import {connect} from 'react-redux';
// 获取路由器路由配置
import { getRoutes } from '../utils/utils';
// 媒体查询 响应式组件
import { ContainerQuery } from 'react-container-query';
// 布局--内容部分
const { Content } = Layout;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

/**
 * 媒体查询
 */
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends PureComponent{
  // 定义静态变量
  static childContextTypes = {
    location: PropTypes.object, // 验证,必须为对象
    breadcrumbNameMap: PropTypes.object,
  }
  
  // 初始化状态值
  state = {
    isMobile,
  };

  // 获取组件的传递的参数
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  
  // 生命周期--组件加载完毕
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });

    /**
     * 触发action
     * 获取当前用户信息
     */
    this.props.dispatch({
      type: 'fetchCurrent'
    });
  }
  
  // 菜单切换
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'changeLayoutCollapsed',
      payload: collapsed,
    });
  }

  // 获取页面标题
  getPageTitle() {
    return "主页";
  }

  // 底部header菜单栏点击事件
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'logout',
      });
    }
  }

  // 清空通知栏
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'clearNotices',
      payload: type,
    });
  }

  // 处理通知事项变更
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'fetchNotices',
      });
    }
  }
      
  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location,
    } = this.props;
    // 布局
    const layout = (
      <Layout>
        {/*侧边菜单栏*/}
        <SiderMenu
          menuData={getMenuData()}
          location={location}
          collapsed={collapsed}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />

        <Layout>
          {/*页头*/}
          <GlobalHeader
            fetchingNotices={fetchingNotices}
            notices={notices}
            currentUser={currentUser}
            collapsed={collapsed}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            onNoticeClear={this.handleNoticeClear}
          />
          {/*内容部分*/}
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Switch>
              {
                redirectData.map(item =>
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                )
              }

              {
                getRoutes(match.path, routerData).map(item =>
                  (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  )
                )
              }

              <Redirect exact from="/" to="/dashboard/analysis" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({routerReducer,global,user})=>{
  return {
    location:routerReducer.location,
    collapsed:global.collapsed, // 菜单切换
    currentUser:user.currentUser, // 当前用户
    fetchingNotices:global.fetchingNotices, // 请求通知数据
    notices:global.notices, // 通知数据
  }
})(BasicLayout);