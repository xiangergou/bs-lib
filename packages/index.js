/*
 * @Author: 轻语
 * @Date: 2021-03-02 17:33:28
 * @LastEditors: 轻语
 * @LastEditTime: 2021-03-02 17:35:00
 * @Description: 
 */


import BsTreeInput from "./bs-tree-input";

// 组件集合，用于遍历
const components = [BsTreeInput];

console.log({ components });

// 定义 install 方法
const install = function(Vue) {
  if (install.installed) return;
  // 遍历注册全局组件
  components.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}


export default {
  install, 
  BsTreeInput
};

