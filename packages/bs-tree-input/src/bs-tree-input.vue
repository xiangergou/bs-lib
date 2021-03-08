<template>
  <div class="boss-tree__input" :style="{ 'background-color': backgroundColor }">
    <img :src="avatar" alt="">
  </div>
</template>
<script>
import merge from '../../utils/merge'
import avatar from '@/imgs/2.jpeg'
// import { mapGetters, mapMutations } from 'vuex'
import check from './config/check'
import {
  defaultEditConfig
} from './config/config'

/**
 * 以tree为options的下拉选框
 */
export default {
  name: 'bs-tree-input',
  mixins: [check],
  props: {
    /**
		 * el-tree配置选项
		 */
    props: { // el-tree配置选项
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'label', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    /**
		 * 双向绑定的值 支持对象和##拼接字符串
		 */
    value: {
      type: [Object, String],
      default() {
        return ' ## ## '
      }
    },
    /**
		 * 树数据
		 */
    datas: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
		 * select尺寸 medium/small/mini
		 */
    size: {
      type: String,
      default: ''
    },
    /**
		 * select是否禁用  默认不禁用
		 */
    disabled: { // select是否禁用  默认不禁用
      type: Boolean
    },
    /**
		 * 树是否多选，默认不是
		 */
    showcheckbox: {
      type: Boolean
    },
    /**
		 * 是否开启选择某一级别，默认不开启：全可选
		 */
    isleaf: {// 是否开启选择某一级别，默认不开启：全可选
      type: Boolean
    },
    /**
		 * 是否服务端加载 默认不是
		 */
    isServer: {
      type: Boolean
    },
    /**
		 *  http请求方式
		 */
    ajaxType: {
      type: String,
      default: 'post'
    },
    /**
		 *  获取数据访问uri，可自定义[微服务/url]
		 */
    serverUri: {
      type: String,
      default: 'plan-service/queryTreeAssistData'
    },
    /**
		 *  是否启用格式化label
		 */
    openFormatLabel: { // 是否启用格式化label
      type: Boolean
    },
    /**
		 *  树显示label格式化
		 */
    formatter: {
      type: String,
      default: '#code-#name'
    },
    /**
		 *  每次点击是否重新加载数据
		 */
    reloaddata: {// 每次点击是否重新加载数据
      type: Boolean,
      default() {
        return true
      }
    },
    /**
		 *  单选情况下双击选中事件后触发， 回调
		 */
    dropdownmethod: {
      type: Function,
      default: function() {}
    },
    /**
		 *  多选情况下勾选触发，回调
		 */
    aftercheckmethod: {
      type: Function,
      default: function() {}
    },
    /**
		 *  数据已经加载完， 回调
		 */
    afterloadmethod: {// 数据已经加载完， 回调
      type: Function,
      default: function() {}
    },
    /**
		 *  是否开启查询条件改变，进行查询控制开关，默认不开启
		 */
    openQuerySeach: {
      type: Boolean
    },
    /**
		 *  查询条件获取方法
		 */
    queryparams: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
		 *  节点前缀
		 */
    prefix: {
      type: String,
      default() {
        return ''
      }
    },
    /**
		 *  是否开启缓存，默认开启
		 */
    openTreeCache: {
      type: Boolean,
      default() {
        return true
      }
    },
    /**
		 *  // 是否开启loading 默认开启
		 */
    openLoading: {
      type: Boolean,
      default() {
        return true
      }
    },
    /**
		 * 树背景色
		 */
    backgroundColor: {
      type: String,
      default() {
        return '#ffffff'
      }
    },
    /**
		 * 标题内容配置
		 */
    titleConfig: {
      type: Object,
      default() {
        return {
          require: false,
          tip: ''

        }
      }
    },
    /**
		 * 树配置，以后扩展参数在这里写
		 */
    editConfig: {
      // 树编辑配置项
      type: Object,
      default() {
        return {}
      }
    },
    /**
		 * 根据用户输入来重新获取数据
		 */
    queryByInput: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      avatar,
      className: 'boss-tree__input_tree',
      questUri: this.serverUri,
      selectDisabled: this.disabled,
      valueId: '', // 初始值
      lineData: this.value, // 行数据
      valueTitle: '',
      inputval: '', // 记录一下文本框里面输入的值
      emptyText: '',
      defaultExpandedKey: [],
      data: this.datas,
      params: this.queryparams,
      checkbox: this.showcheckbox,
      curNode: {// 当前点击节点
        id: '',
        name: '',
        code: ''
      },
      treePrefix: this.prefix,
      cacheData: null,
      treeLoading: false,
      tempNode: null, // 临时的node值
      useTreeCache: this.openTreeCache,
      title: this.titleConfig,
      editConfigIn: { ...defaultEditConfig }
    }
  },
  computed: {
    // ...mapGetters('basicInfo', ['cacheTree']),
    treeParams() {
      return {
        ajaxType: this.ajaxType,
        serverUri: this.serverUri,
        params: this.queryparams
      }
    },
    showTitle() { // 是否显示title
      return !!this.title.tip
    },
    levelno() { // 树节点级别
      return (this.editConfigIn && this.editConfigIn.levelno) || '-1'
    }
  },
  mounted() {
    console.log(merge, 'merge')
  },
  created() {
  },
}
</script>
<style lang="scss" scope>
.boss-tree__input{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .boss-tree__input_title{
    line-height: 40px;
    flex-shrink: 0;
    max-width: 320px;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* padding-right: .8em; */
    font-size: 14px;
    vertical-align: middle;
    display: inline-block;
  }
  .el-select{
    display:block;
    height: 40px;
    display: inline-block;
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }
}
.boss-tree__input_tree{
  min-height: 200px;
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: 400 !important;
  }
}
</style>
