/**
 * 登录布局
 * 抽离出用于登陆注册页面的通用布局
 */
import React from 'react';
// 页面标题
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
// 经授权的
import Authorized from '../utils/Authorized';
import { Switch, Link, Route, Redirect } from 'react-router-dom';
// 底边栏
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import { getRoutes } from '../utils/utils';
// 引入 层叠样式表
import styles from './UserLayout.less';
// logo 图标
import logo from '../assets/logo.svg';
// 引入 登录页
import LoginPage from '../routes/login/index';
// 获取授权
import { getAuthority } from '../utils/authority';
// 版权
const copyright = <div>Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品</div>;
// 登录布局
class UserLayout extends React.PureComponent {
  
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container} style={{ minHeight: '100vh' }}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Ant Design</span>
                </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  // <AuthorizedRoute
                  //   key={item.key}
                  //   path={item.path}
                  //   component={item.component}
                  //   exact={item.exact}
                  //   authority={item.authority}
                  //   redirectPath="/exception/403"
                  // />
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              {/*重定向*/}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;