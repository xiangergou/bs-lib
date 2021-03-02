<template>
  <div class="boss-tree__input" :style="{ 'background-color': backgroundColor }">
    <div v-if="showTitle" class="boss-tree__input_title">
      <span v-if="title.require" style="color: red;">*</span>
      <span :title="title.tip">{{ title.tip }}:&nbsp;&nbsp;</span>
    </div>
    <el-select
      ref="selectRef"
      class="boss-tree__input_select"
      :size="size"
      :disabled="selectDisabled"
      :popper-class="className"
      :filter-method="selectFilter"
      :value="valueTitle"
      clearable
      filterable
      :placeholder="editConfigIn.placeholder"
      @visible-change="showSelectBox"
      @click.native="selectFocus"
      @clear="clearHandle"
      @keyup.native.enter="enterFilter"
    >
      <el-option v-loading="treeLoading" :value="valueTitle" :label="valueTitle">
        <el-tree
          ref="selectTree"
          class="boss-tree__input_tree"
          :show-checkbox="checkbox"
          :data="data"
          :props="props"
          :node-key="props.value"
          :empty-text="emptyText"
          :default-expanded-keys="defaultExpandedKey"
          :filter-node-method="filterNode"
          @dblclick.native="dblNodeClick"
        />
      </el-option>
    </el-select>
  </div>
</template>
<script>
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
  methods: {
    // ...mapMutations('basicInfo', ['setBossTree']),
    // 初始化参数
    initData() {
      this.initEditConfig()
    },

    // 初始化api服务数据
    initEditConfig() {
      this.editConfigIn = Object.assign(
        {},
        this.editConfigIn,
        this.editConfig
      )
    },

    // 判断是否为对象
    isObject(obj) {
      return (Object.prototype.toString.call(obj) === '[object Object]')
    },

    // 监听value变化， value改变时改变valueId及curNode的值
    initValue() {
      if (this.checkbox) {
        this.initCheckValue()
        return
      }
      if (this.isObject(this.value)) {
        this.valueId = this.value[`${this.treePrefix}id`]
        this.curNode.id = this.value[`${this.treePrefix}id`]
        this.curNode.code = this.value[`${this.treePrefix}code`]
        this.curNode.name = this.value[`${this.treePrefix}name`]
      } else {
        this.valueId = this.value.split('##')[0]
        this.curNode.id = this.value.split('##')[0]
        this.curNode.code = this.value.split('##')[1]
        this.curNode.name = this.value.split('##')[2]
      }

      let node = {
        code: (this.curNode.code && this.curNode.code !== ' ') ? this.curNode.code : '',
        name: (this.curNode.name && this.curNode.name !== ' ') ? this.curNode.name : ''

      }
      this.formatValueTitle(node)
    },

    formatValueTitle(node) {
      if (this.openFormatLabel) {
        let fmt = this.formatter
        let fmtArr = this.formatter.split('-')
        for (let j = 0; j < fmtArr.length; j++) {
          fmt = fmt.replace(
            fmtArr[j],
            node[fmtArr[j].replace('#', '')] || ''
          )
        }

        fmt = fmt === '-' ? '' : fmt
        this.valueTitle = fmt
      } else {
        // 默认显示为code与name拼接
        this.valueTitle = (node.name && node.code) ? node.code + '-' + node.name : ''
      }
    },

    // 下拉框输入时时时触发自动过滤,如果树是支持录入，则不支持时时过滤，只支持enter过滤
    selectFilter(newVal) {
      this.inputval = newVal
      if (this.editConfigIn.allowInput) {
        this.lineData = `${newVal}## ##${newVal}`

        /**
         * lineData改变时触发
         * @event input
         * @params  {any} newVal
         */
        this.$emit('input', this.lineData)
        return
      }

      this.filterTree(newVal)
    },

    // enter进行过滤查询
    enterFilter(e) {
      if (!this.editConfigIn.allowInput) {
        return
      }
      const newVal = e.target.value
      this.filterTree(newVal)
    },

    filterTree(newVal) {
      this.$refs.selectTree && this.$refs.selectTree.filter(newVal)
    },

    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode(value, data) {
      // 搜索过滤
      if (!value) return true
      let valArr = value.split(',')
      let isOk = false
      for (let i = 0; i < valArr.length; i++) {
        if (isOk) {
          break
        }
        isOk = data.label.indexOf(valArr[i]) !== -1
      }
      return isOk
    },

    // 格式化树的label
    formatLabel(data) {
      if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          data[i].name = data[i].name || data[i].label
          data[i].label = data[i].name
          if (this.openFormatLabel) {
            let fmt = this.formatter
            let fmtArr = this.formatter.split('-')
            for (let j = 0; j < fmtArr.length; j++) {
              fmt = fmt.replace(
                fmtArr[j],
                data[i][fmtArr[j].replace('#', '')] || ''
              )
            }

            data[i][this.props.label] = data[i]['label'] = fmt
          }
          if (data[i].children) { // 非底级节点
            data[i].isleaf = '0'
            data[i].leaf = false
            this.formatLabel(data[i].children)
          } else { // 底级节点
            data[i].isleaf = '1'
            data[i].leaf = true
          }

          // 节点级别，如果没有则为0
          data[i].levels = data[i].levelno || 0
        }
      }
    },

    // input框单击，查询树数据，支持关闭
    selectFocus() {
      if (this.selectDisabled) {
        return
      }

      if (this.reloaddata) {
        this.initTree()
      }
      this.$refs.selectTree && this.$refs.selectTree.filter('') // 每次显示数据清除掉之前的过滤
    },

    setValue(val) {
      this.valueId = val
      if (!val) {
        this.clearHandle()
      }
      this.setTreeData()
    },

    // 加载完后处理数据
    dealDataAfterLoad() {
      this.$nextTick(() => {
        this.formatLabel(this.data)
        this.setTreeData()
        if (!this.editConfigIn.allowInput) {
          this.selectFilter('')
        }
        this.$nextTick(() => {
          this.afterloadmethod(this.data)
        })
      })
    },

    // 获取缓存数据
    getCacheData() {
      this.data = this.cacheData
      this.dealDataAfterLoad()
    },

    // 获取请求数据
    async getHttpData() {
      let self = this
      if (this.treeLoading) {
        return
      }
      this.emptyText = ''
      self.openLoading && (self.treeLoading = true)
      let ajaxFormat = this.ajaxType === 'postStringify' ? 'application/x-www-form-urlencoded' : ''
      await this.$http[this.ajaxType](this.questUri, this.params, false, ajaxFormat)
        .then(res => {
          self.data = (res && Array.isArray(res)) ? res : ((res.rscode === '100000' || res.rscode === '200') ? res.data : [])
          // self.data = [{ ...res[0] }]
          // console.log(self.data)

          this.treeLoading = false
        })
        .catch(err => {
          this.treeLoading = false
          console.log(err)
        })
      this.emptyText = '暂无数据'
      this.dealDataAfterLoad()
      // 缓存数据
      this.setBossTree({
        params: this.treeParams,
        treeData: this.data
      })
    },
    // 初始化值
    async initTree() {
      if (this.isServer) {
        this.getHttpData()
        // this.cacheData = this.cacheTree(this.treeParams)
        // // console.log(55, this.useTreeCache, this.cacheData)
        // if (this.useTreeCache && this.cacheData) {
        //   // console.log('来自树缓存数据')
        //   this.getCacheData()
        // } else {
        //   // console.log('来自树请求数据')
        //   this.getHttpData()
        // }
      } else {
        if (this.data.length) { // 说明是传入的树数据
          this.dealDataAfterLoad()
        }
      }
    },

    // 下拉框出现/隐藏时触发 出现则为 true，隐藏则为 false
    showSelectBox(isShow) {
      if (!isShow) {
        if (this.checkbox) {
          this.changeSelectBoxMultiSelect()
        } else {
          (this.editConfigIn && this.editConfigIn.allowInput) ? this.changeSelectBoxEditInput() : this.changeSelectBoxNoEditInput()
        }
        this.emitLineData()
      }
    },

    // 多选时，下拉框改变时处理逻辑
    changeSelectBoxMultiSelect() {
      let nodes = this.$refs.selectTree.getCheckedNodes()
      nodes = this.dealCheckDataByisLeaf(nodes)

      if (nodes.length > 0) {
        let allValueId = ''
        let allValueTitle = ''
        for (let i = 0; i < nodes.length; i++) {
          if (i === nodes.length - 1) {
            allValueId += nodes[i][this.props.value] + ''
            allValueTitle += nodes[i][this.props.label] + ''
          } else {
            allValueId += nodes[i][this.props.value] + ','
            allValueTitle += nodes[i][this.props.label] + ','
          }
        }
        this.valueId = allValueId
        this.valueTitle = allValueTitle
      } else {
        this.valueId = ''
        this.valueTitle = ''
      }
      this.afterNodeChecked(nodes, this.valueId)
    },

    // 树不支持录入时， 下拉框改变时处理逻辑
    changeSelectBoxNoEditInput() {
      if (!this.strTrim(this.valueId)) {
        // 当前不为空
        let node = this.$refs.selectTree.getCurrentNode()

        if (this.isleaf) {
          this.changeSelectByisLeaf(node)
        } else {
          if (node) {
            this.valueTitle = node[this.props.label]
            this.valueId = node[this.props.value]
          } else {
            this.$refs.selectTree.setCurrentKey(null)
            this.valueTitle = ''
            this.$refs.selectTree.filter('')
          }
        }
      } else {
        if (typeof this.valueId === 'string' && !String(this.valueId).includes('initId')) {
          this.$refs.selectTree.setCurrentKey(this.valueId)
        }
      }
    },

    // 改变选择的树节点，当开启级别后，数据处理
    changeSelectByisLeaf(node) {
      // 如果是底级
      if (node && this.levelno === -1) {
        if (node.leaf) {
          // 是底级就显示
          this.valueTitle = node[this.props.label]
          this.valueId = node[this.props.value]
        } else {
          // 不是底级就清楚树的选中
          this.$refs.selectTree.setCurrentKey(null)
          this.valueTitle = ''
          this.$refs.selectTree.filter('')
        }
      }

      if (node && this.levelno !== -1) {
        if (this.levelno === node.levels) {
          // 是选择的级别就显示
          this.valueTitle = node[this.props.label]
          this.valueId = node[this.props.value]
        } else {
          // 不是选择的级别就清除树的选中
          this.$refs.selectTree.setCurrentKey(null)
          this.valueTitle = ''
          this.$refs.selectTree.filter('')
        }
      }
    },

    // 树支持录入时，下拉框改变时处理逻辑
    changeSelectBoxEditInput() {
      if (!this.valueId) {
        // 当前不为空
        let node = this.$refs.selectTree.getCurrentNode()
        if (node) {
          if (this.inputval && this.inputval !== '' && this.inputval !== node.label
          ) {
            this.valueTitle = this.inputval
            this.valueId = this.inputval
            this.$refs.selectTree.setCurrentKey(null)
          } else {
            if (this.isleaf) {
              this.changeSelectByisLeaf(node)
            } else {
              if (node) {
                this.valueTitle = node[this.props.label]
                this.valueId = node[this.props.value]
              } else {
                this.$refs.selectTree.setCurrentKey(null)
                this.valueTitle = ''
                this.$refs.selectTree.filter('')
              }
            }
          }
        } else {
          if (this.inputval && this.inputval !== '') {
            this.valueTitle = this.inputval
            this.valueId = this.inputval
            this.$refs.selectTree.setCurrentKey(null)
          }
        }
      } else {
        let node = this.$refs.selectTree.getCurrentNode()
        if (!node) {
          this.valueTitle = this.inputval
          this.valueId = this.inputval
          this.$refs.selectTree.setCurrentKey(null)
        } else {
          if (this.inputval && this.inputval !== '' && this.inputval !== node.label) {
            this.valueTitle = this.inputval
            this.valueId = this.inputval
            this.$refs.selectTree.setCurrentKey(null)
          } else {
            if (this.isleaf) {
              this.changeSelectByisLeaf(node)
            } else {
              if (node) {
                this.valueTitle = node[this.props.label]
                this.valueId = node[this.props.value]
              } else {
                this.$refs.selectTree.setCurrentKey(null)
                this.valueTitle = ''
                this.$refs.selectTree.filter('')
              }
            }
          }
        }
      }
    },

    afterNodeChecked(nodes, values) {
      if (this.aftercheckmethod) {
        this.aftercheckmethod(nodes, values)
      }
    },

    // 树单击事件
    handleNodeClick($event, node) {
      // window.event.stopPropagation()
      // window.event.preventDefault()
      if (this.isleaf) {
        if (this.levelno === -1) {
          if (node.leaf) {
            this.curNode = node
          } else {
            this.throwWarn()
          }
        }

        if (this.levelno !== -1) {
          if (this.levelno === node.levels) {
            this.curNode = node
          } else {
            this.throwErroWarn()
          }
        }
      } else {
        this.curNode = node
      }
    },

    // 非底级节点提示
    throwWarn() {
      this.$message({ message: '非底级节点不能选中!', type: 'warning' })
    },
    // 非传入的级别节点提示
    throwErroWarn() {
      this.$message({ message: '非期望的节点不能选中!', type: 'warning' })
    },

    // 树双击事件【只有checkbox为false情况下触发】
    dblNodeClick(event) {
      if (!this.checkbox) {
        const node = this.$refs.selectTree.getCurrentNode()

        if (this.isleaf) {
          if (this.levelno === -1 && !node.leaf) {
            this.throwWarn()
            return
          }

          if (this.levelno !== -1 && this.levelno !== node.levels) {
            this.throwErroWarn()
            return
          }
        }

        this.$refs.selectRef.blur()
        this.onDropdownMenuClosed(node, event)
        this.inputval = ''
        // 值修改监控事件
        this.emitLineData()
      }
    },

    // 双击选中后触发
    onDropdownMenuClosed(data, event) {
      this.dropdownmethod(data, event)
      /**
       * 双击选中后触发
       * @event clickSelect
       * @params  {any} data
       */
      this.$emit('clickSelect', data)
    },

    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.inputval = ''
      this.defaultExpandedKey = []
      if (this.checkbox) {
        this.$refs.selectTree.setCheckedKeys([])
      } else {
        this.$refs.selectTree.setCurrentKey(null)
      }
      this.emitClearLineData()
    },

    dealCss() {
      var uldiv = this.$el.getElementsByClassName(
        'el-select-dropdown__wrap el-scrollbar__wrap'
      )
      var ul = this.$el.getElementsByClassName(
        'el-scrollbar__view el-select-dropdown__list'
      )
      if (uldiv.length) {
        uldiv[0].style.marginBottom = '0px'
        uldiv[0].style.marginRight = '0px'
        uldiv[0].style.overflow = 'auto'
      }
      if (ul.length) {
        ul[0].style.padding = 0
      }
    },

    // 设置树数据【input显示  默认选中  默认展开】
    setTreeData() {
      if (!this.checkbox) {
        if (this.valueId && !String(this.valueId).includes('initId')) {
          let node = this.$refs.selectTree && this.$refs.selectTree.getNode(this.valueId)
          if (this.editConfigIn.allowInput) {
            const name = this.lineData[this.prefix + 'name']
            if (name) {
              this.inputval = name
            }
            this.valueTitle = (node && node.data[this.props.label]) || this.inputval || name || ''
          } else {
            this.valueTitle = (node && node.data[this.props.label]) || ''// 初始化显示
          }

          this.$refs.selectTree && this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
          this.defaultExpandedKey = [this.valueId] // 设置默认展开
        }
      } else {
        if (this.valueId) {
          let valArr = this.valueId.split(',')
          this.valueTitle = ''
          this.defaultExpandedKey = []
          for (let i = 0; i < valArr.length; i++) {
            if (i === valArr.length - 1) {
              if (this.$refs.selectTree.getNode(valArr[i])) {
                this.valueTitle += this.$refs.selectTree.getNode(valArr[i]).data[this.props.label] // 初始化显示
                this.defaultExpandedKey.push(valArr[i])
              }
            } else {
              if (this.$refs.selectTree.getNode(valArr[i])) {
                this.valueTitle +=
                  this.$refs.selectTree.getNode(valArr[i]).data[this.props.label] + ',' // 初始化显示
                this.defaultExpandedKey.push(valArr[i])
              }
            }
            this.$refs.selectTree.setCheckedKeys(this.defaultExpandedKey)
          }
        }
      }
    },

    // select  双击  清空，影响了lineData改变
    emitLineData() {
      const curVal = this.getData()
      if (this.checkbox) {
        this.emitLineDataChecks(curVal)
        return
      }
      if (this.isObject(this.value)) {
        this.lineData[`${this.treePrefix}id`] = curVal.id
        this.lineData[`${this.treePrefix}code`] = curVal.code
        this.lineData[`${this.treePrefix}name`] = curVal.name
      } else {
        this.formatValueTitle(curVal)
        this.lineData = `${curVal.id}##${curVal.code}##${curVal.name}`
      }
      // console.log(77, this.lineData)
      this.$emit('input', this.lineData)
    },

    // 清空 回调
    emitClearLineData() {
      let timeStamp = +new Date()
      if (this.isObject(this.value)) {
        this.lineData[`${this.treePrefix}id`] = 'initId' + timeStamp
        this.lineData[`${this.treePrefix}code`] = ' '
        this.lineData[`${this.treePrefix}name`] = ' '
      } else {
        this.lineData = `initId${timeStamp}## ## `
      }
      // console.log(78, this.lineData)
      this.$emit('input', this.lineData)
    },

    splitLineData() {
      let lineDataObj = Object.create(null)
      if (this.isObject(this.value)) {
        lineDataObj.id = this.lineData[`${this.treePrefix}id`]
        lineDataObj.code = this.lineData[`${this.treePrefix}code`]
        lineDataObj.name = this.lineData[`${this.treePrefix}name`]
      } else {
        [lineDataObj.id, lineDataObj.code, lineDataObj.name] = this.lineData.split('##')
      }

      return lineDataObj
    },

    strTrim(str) {
      let strCp = typeof str !== 'string' ? String(str) : str
      return (strCp || '').trim()
    },

    //= =============================给调用者暴露的方法==============================//

    // 返回select对象和树对象
    treeInputOptionFn() {
      return {
        selectRef: this.$refs.selectRef,
        selectTree: this.$refs.selectTree
      }
    },

    // 刷新树
    refreshTree() {
      this.initTree()
    },

    // 获取树数据
    getData() {
      let rdata
      let timeStamp = +new Date()
      const defaultObj = {
        id: 'initId' + timeStamp,
        code: ' ',
        name: ' '
      }
      if (this.checkbox) {
        rdata = this.$refs.selectTree.getCheckedNodes() || this.splitLineDataChecks()
      } else {
        // console.log(44, this.$refs.selectTree.getCurrentNode())
        rdata = this.$refs.selectTree.getCurrentNode() || this.splitLineData()
      }
      return rdata || defaultObj
    }

    //= =============================给调用者暴露的方法==============================//

  },
  mounted() {
    this.initData()
    if (this.editConfigIn.initLoadTree) {
      this.initTree()
    }
    this.initValue()
    this.$nextTick(() => {
      this.dealCss()
    })
  },
  created() {

  },
  watch: {
    editConfig: {
      handler() {
        this.initEditConfig()
      },
      deep: true,
      immediate: true
    },
    showcheckbox(val) {
      this.checkbox = val
    },
    disabled(val) {
      this.selectDisabled = val
    },
    prefix(val) {
      this.treePrefix = val
    },
    openTreeCache(val) {
      this.useTreeCache = val
    },
    questUri(val) {
      this.questUri = val
    },
    datas: { // 表格配置监听
      handler(newvalue) {
        this.data = newvalue
      },
      immediate: true
    },
    titleConfig: {
      handler(newValue) {
        this.title = newValue
      },
      deep: true,
      immediate: true
    },
    queryparams: {
      handler(newValue, oldValue) {
        const flag = JSON.stringify(newValue) === JSON.stringify(oldValue)
        if (!flag) {
          this.params = newValue
        }
        if (this.openQuerySeach && !flag && oldValue) {
          this.initTree()
        }
        if (this.queryByInput && !flag && oldValue) {
          this.params = newValue
          this.initTree()
        }
      },
      deep: true,
      immediate: true
    },
    value: {
      handler() {
        const val = this.isObject(this.value) ? this.value[`${this.treePrefix}id`] : (this.checkbox ? this.value.split(',').length : this.value.split('##')[0])
        if (this.value && val) {
          this.initValue()
          this.lineData = this.value
        }
      },
      deep: true,
      immediate: true
    },
    valueTitle() { // 解决from加载树时，只有一个id没有code和name时需要回显名称问题
      if (!this.editConfigIn.allowInput) {
        if (this.checkbox) {
          return
        }
        let data = Object.create(null)
        if (this.isObject(this.value)) {
          data = this.lineData
        } else {
          const arr = this.lineData.split('##')
          data[this.treePrefix + 'id'] = arr[0]
          data[this.treePrefix + 'code'] = arr[1]
          data[this.treePrefix + 'name'] = arr[2]
        }

        let _id = this.strTrim(data[this.treePrefix + 'id'])
        let _code = this.strTrim(data[this.treePrefix + 'code'])
        let _name = this.strTrim(data[this.treePrefix + 'name'])
        if (_id && !String(_id).includes('initId') && !_code && !_name) {
          let timeStamp = +new Date()
          const defaultObj = {
            id: 'initId' + timeStamp,
            code: ' ',
            name: ' '
          }
          const curVal = this.$refs.selectTree.getCurrentNode() || defaultObj
          if (this.isObject(this.value)) {
            this.lineData[`${this.treePrefix}id`] = curVal.id
            this.lineData[`${this.treePrefix}code`] = curVal.code
            this.lineData[`${this.treePrefix}name`] = curVal.name
          } else {
            this.lineData = `${curVal.id}##${curVal.code}##${curVal.name}`
          }
          this.$emit('input', this.lineData)
        // console.log(99, this.lineData)
        }
      }
    },
    inputval: { // 监听用户输入
      handler(newvalue) {
        // 如果配置为true则改变查询条件
        if (this.queryByInput && newvalue !== '') {
          // 把用户输入拼接到查询条件上
          this.queryparams.condition[this.treePrefix] = {
            'all': newvalue
          }
        }
      },
      immediate: true
    }

  }
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
