/**
 * 菜单配置文件
 */
import { isUrl } from '../utils/utils';
// 数据
const menuData = [
  {
    name: '漫画',
    icon: 'book',
    path: 'dashboard',
    children: [{
      name: '腾讯漫画',
      path: 'analysis',
    }],
  },
  {
    name: '视频',
    icon: 'youtube',
    path: 'syster',
    children: [{
      name: '优酷视频',
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
