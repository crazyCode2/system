/**
 * 登录页数据
 */
/**
 * 引入 redux-saga
 * takeLatest
 在发起的 action 与 pattern 匹配时派生指定的 saga。并且自动取消之前启动的所有 saga 任务（如果在执行中）
 */
import { put, takeLatest, call, select } from 'redux-saga/effects';
/**
 * 引入 react-router-redux
 * push 页面跳转
 */
import { push } from 'react-router-redux';
// 登录 请求
import { login } from '../services/api';

//声明时需要添加*，普通函数内部不能使用yield关键字，否则会出错
function* logincheck({payload}){
  // 向后端请求数据,并获取返回值
  const response = yield call(login, payload);
  console.log(response);
  yield put({
  	type: 'commonlogin',
  	payload: {
  	  ...response,
  	}
  })

  if(response.status === 'ok'){
    // put 相当于触发某个action,作用和dispatch相同
  	yield put(push("/"))
  }
}

// 注销
function* logout({payload}){

  try {
    // 获取位置路径名
    const urlParams = new URL(window.location.href);
    const pathname = yield select(state => state.routerReducer.location.pathname);
    // 在URL中添加参数
    urlParams.searchParams.set('redirect', pathname);
    window.history.replaceState(null, 'login', urlParams.href);
  } finally {
    yield put({
      type: 'tologin',
      payload: {
        status: "",
      },
    });
    yield put(push('/user/login'));
  }
}

// 异步登录
function* loginSaga(){
  // 获取token
  yield takeLatest('getToken', logincheck)
  // 注销
  yield takeLatest('logout', logout)
}

export default loginSaga;