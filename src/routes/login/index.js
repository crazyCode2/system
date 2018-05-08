/**
 * 登录页
 */
import React, { Component } from 'react';
/**
 * Provider 提供的是一个顶层容器的作用，实现store的上下文传递
 * connect 可以把state和dispatch绑定到react组件，使得组件可以访问到redux的数据
 */
import { connect } from 'react-redux';
// 引入 antd UI库
import { Alert, Checkbox } from 'antd';
// 引入 ant-design-pro
import Login from 'ant-design-pro/lib/Login';
// 引入 样式表
import styles from './login.less';
// 引入 react-router-redux
// import { push } from 'react-router-redux';

const { UserName, Password, Submit } = Login;

// 登录页 组件
class LoginPage extends Component {
  // 初始化 state
  state = {
    type: 'account',
    autoLogin: true,
  }

  // 登录按钮点击事件
  onSubmit = (err, values) => {
    const { type } = this.state;

    if(!err){
      // 向 redux 传参,调用 action
      this.props.dispatch({
        type: 'loading' // 触发 redux --> login
      })

      setTimeout(() => {
        this.props.dispatch({
          type:'getToken', // 触发 saga --> loginSaga
          payload:{
            ...values, // {username:'',password:''}
            type,
          }
        })
      }, 1200);
    }
  }

  // 自定登录选中和取消事件
  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  // 页面渲染
  render(){
    const { login } = this.props;
    // console.log(this.props);

    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.onSubmit}
        >
          {
            login.status === 'error' &&
            login.type === 'account' &&
            <Alert style={{marginBottom: 24}} message={'账号密码错误'} type="error" showIcon closable />
          }
          <UserName name="username" placeholder="请输入用户名"  />
          <Password name="password" placeholder="请输入密码" />
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
          </div>
          <Submit loading={login.submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}

export default connect(({login}) => {
  return{
    login,
  }
})(LoginPage)
