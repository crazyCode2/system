/**
 * 登录布局
 * 抽离出用于登陆注册页面的通用布局
 */
import React from 'react';
// 页面标题
import DocumentTitle from 'react-document-title';
// 图标
import { Icon } from 'antd';
// 路由
import { Switch, Link, Route, Redirect } from 'react-router-dom';
// 页脚
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
// 获取路由器路由配置
import { getRoutes } from '../utils/utils';
// 引入 层叠样式表
import styles from './UserLayout.less';
// logo 图标
import logo from '../assets/logo.svg';
// 引入 登录页
// import LoginPage from '../routes/login/index';
// 版权
const copyright = <div>Copyright <Icon type="copyright" /> 2018 雅典娜发展有限公司</div>;
// 登录布局
class UserLayout extends React.PureComponent {
  // 获取页面标题
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
                  <span className={styles.title}>漫画 && 视频</span>
                </Link>
              </div>
              <div className={styles.desc}>通过爬虫技术,获取最新漫画和视频</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
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
          {/*页脚*/}
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
