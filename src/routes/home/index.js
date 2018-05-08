/**
 * 主页面(Main)
 */
import React ,{Component} from 'react';
// 页面标题
import DocumentTitle from 'react-document-title';
// 引入 antd UI 库
import { Layout } from 'antd';
// 引入 路由
import {Switch,Route} from 'react-router-dom';
// 媒体查询(页面自适应)
import { enquireScreen } from 'enquire-js';
// 侧边菜单栏
import SiderMenu from '../../components/SiderMenu';
// 页头
import GlobalHeader from '../../components/GlobalHeader';
// 用户管理页
import User from '../user';

const { Content } = Layout;

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});
 
class Main extends Component{
  state = {
    collapsed: false,
  };

  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });   
  }

  getPageTitle() {
    return "主页";
  }

  // 渲染
  render() {
    const layout = (
      <Layout>
        {/*侧边菜单栏*/}
        <SiderMenu 
          collapsed={this.state.collapsed}
          isMobile={this.state.isMobile}  
        />
        <Layout>
          {/*顶部 header 栏*/}
          <GlobalHeader 
            collapsed={this.state.collapsed}
          />
          {/*内容部分*/}
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Switch>
              <Route exact path="/user" component={User} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    );
  }
}

export default Main;
