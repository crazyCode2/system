/**
 * 经授权的
 */
// 权限组件，通过比对现有权限与准入权限，决定相关元素的展示
import RenderAuthorized from 'ant-design-pro/lib/Authorized';
// 获取权限
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// 重新加载权限组件
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;