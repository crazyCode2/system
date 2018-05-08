/**
 * 菜单配置文件
 */
import { isUrl } from '../utils/utils';
// 数据
const menuData = [
  {
    name: '控制台',
    icon: 'dashboard',
    path: 'dashboard',
    children: [{
      name: '总览',
      path: 'analysis',
    }],
  },
  {
    name: '系统设置',
    icon: 'user',
    path: 'syster',
    children: [{
      name: '用户管理',
      path: 'user',
    }]
  }
]

// 数据过滤处理
function formatter(data, parentPath = '') {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);