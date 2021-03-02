export default {
  data() {
    return {

    }
  },
  methods: {
    initCheckValue() {
      if (this.isObject(this.value)) {
        this.valueId = this.value[`${this.treePrefix}id`]
        this.curNode.id = this.value[`${this.treePrefix}id`]
        this.curNode.code = this.value[`${this.treePrefix}code`]
        this.curNode.name = this.value[`${this.treePrefix}name`]
      } else {
        let { id, code, name } = this.strToNode(this.value)
        this.curNode.id = this.valueId = id
        this.curNode.code = code
        this.curNode.name = name
      }

      let node = {
        code: (this.curNode.code && this.curNode.code !== ' ') ? this.curNode.code : '',
        name: (this.curNode.name && this.curNode.name !== ' ') ? this.curNode.name : ''

      }

      if (!node.name) {
        return
      }

      this.valueTitle = '' // 初始化
      if (this.openFormatLabel) {
        let fmt = this.formatter
        let fmtArr = this.formatter.split('-')
        for (let j = 0; j < fmtArr.length; j++) {
          fmt = fmt.replace(
            fmtArr[j],
            node[fmtArr[j].replace('#', '')] || ''
          )
        }
        this.valueTitle = fmt
      } else {
        // 默认显示为code与name拼接
        const names = node.name && node.name.split(',')
        const codes = node.code && node.code.split(',')
        if (names.length === codes.length) {
          for (let i = 0, len = names.length; i < len; i++) {
            this.valueTitle += (codes[i] + '-' + names[i])
            if (i < len - 1) {
              this.valueTitle += ','
            }
          }
        } else {
          console.log('code,name数量匹配不上')
        }
      }
      // console.log('100', this.valueTitle, this.curNode.id)
    },
    emitLineDataChecks(nowVal) {
      let curVal = null
      if (Array.isArray(nowVal)) {
        curVal = this.dealCheckDataByisLeaf(nowVal)
      } else {
        curVal = nowVal
      }

      if (this.isObject(this.value)) {
        // 如果curVal是数组
        if (Array.isArray(curVal)) {
          let { id, code, name } = this.arrToNode(curVal)
          this.lineData[`${this.treePrefix}id`] = id
          this.lineData[`${this.treePrefix}code`] = code
          this.lineData[`${this.treePrefix}name`] = name
        }

        // 如果curVal是对象
        if (this.isObject(curVal)) {
          this.lineData[`${this.treePrefix}id`] = curVal.id
          this.lineData[`${this.treePrefix}code`] = curVal.code
          this.lineData[`${this.treePrefix}name`] = curVal.name
        }
      } else {
        // 如果curVal是数组
        if (Array.isArray(curVal)) {
          this.lineData = this.arrToStr(curVal)
        }

        // 如果curVal是对象
        if (this.isObject(curVal)) {
          this.lineData = this.nodeToStr(curVal)
        }
      }
      // console.log(77, this.lineData)
      this.$emit('input', this.lineData)
    },
    splitLineDataChecks() {
      if (this.isObject(this.value)) {
        let lineDataObj = Object.create(null)
        lineDataObj.id = this.lineData[`${this.treePrefix}id`]
        lineDataObj.code = this.lineData[`${this.treePrefix}code`]
        lineDataObj.name = this.lineData[`${this.treePrefix}name`]

        return lineDataObj
      } else {
        return this.strToArr(this.lineData)
      }
    },
    dealCheckDataByisLeaf(nodes) {
      let nodesCp = [...nodes]
      // 没有开启哪级，则返回所有选中
      if (!this.isleaf) {
        return nodes
      }

      let fileternodes = []
      for (let i = 0; i < nodesCp.length; i++) {
        if (this.levelno === -1 && nodesCp[i].leaf) {
          fileternodes.push(nodesCp[i])
        }
        if (this.levelno !== -1 && this.levelno === nodesCp[i].levels) {
          fileternodes.push(nodesCp[i])
        }
      }

      return fileternodes
    },
    /**
     * 数组转id, code, name
     *[{ id: 'abc', code: '121', name: 'hello' }, { id: 'ccc', code: '22', name: 'wang' }]
     * To {id:'abc,ccc', code: '121,22', name: 'hello,wang'}
     * @param {*} nodes
     */
    arrToNode(nodes = []) {
      let id = ''
      let code = ''
      let name = ''
      for (let i = 0, len = nodes.length; i < len; i++) {
        let item = nodes[i]
        if (!item) {
          continue
        }
        id += item.id + ','
        code += item.code + ','
        name += item.name + ','
      }
      id = id.substr(0, id.length - 1)
      code = code.substr(0, code.length - 1)
      name = name.substr(0, name.length - 1)

      return {
        id,
        code,
        name
      }
    },
    /**
     * str转id, code, name
     * 'abc##121##hello,ccc##22##wang'
     * To {id:'abc,ccc', code: '121,22', name: 'hello,wang'}
     * @param {*} nodes
     */
    strToNode(str = '') {
      let nodes = str.split(',')
      let id = ''
      let code = ''
      let name = ''
      for (let i = 0, len = nodes.length; i < len; i++) {
        let item = nodes[i]
        if (!item) {
          continue
        }
        id += item.split('##')[0] + ','
        code += item.split('##')[1] + ','
        name += item.split('##')[2] + ','
      }
      id = id.substr(0, id.length - 1)
      code = code.substr(0, code.length - 1)
      name = name.substr(0, name.length - 1)

      return {
        id,
        code,
        name
      }
    },
    /**
     * id, code, name 转 数组
     * { id: 'abc,ccc', code: '121,22', name: 'hello,wang' }
     * To [{ id: 'abc', code: '121', name: 'hello' }, { id: 'ccc', code: '22', name: 'wang' }]
     */
    nodeToArr(node = {}) {
      const ids = (node.id && node.id.split(',')) || []
      const codes = (node.code && node.code.split(',')) || []
      const names = (node.name && node.name.split(',')) || []
      let arr = []
      if (ids.length === names.length) {
        for (let i = 0, len = ids.length; i < len; i++) {
          let item = {
            id: ids[i],
            code: codes[i],
            name: names[i]
          }

          arr.push(item)
        }
      } else {
        console.log('tip: id,name数量匹配不上')
      }

      return arr
    },
    /**
     * str 转 数组
     * 'abc##121##hello,ccc##22##wang'
     * To [{ id: 'abc', code: '121', name: 'hello' }, { id: 'ccc', code: '22', name: 'wang' }]
     */
    strToArr(str = '') {
      const nodes = str.split(',')
      let data = []
      for (let i = 0, len = nodes.length; i < len; i++) {
        let item = nodes[i]
        if (!item) {
          continue
        }
        let node = {
          id: item.split('##')[0],
          code: item.split('##')[1],
          name: item.split('##')[2]
        }

        data.push(node)
      }

      return data
    },
    /**
     * 数组 转 str
     *[{ id: 'abc', code: '121', name: 'hello' }, { id: 'ccc', code: '22', name: 'wang' }]
     * To 'abc##121##hello,ccc##22##wang'
     */
    arrToStr(nodes = []) {
      let line = ''
      for (let i = 0, len = nodes.length; i < len; i++) {
        let item = nodes[i]
        if (!item) {
          continue
        }
        line += `${item.id}##${item.code}##${item.name}`
        if (i < len - 1) {
          line += ','
        }
      }

      return line
    },
    /**
    * id, code, name 转 str
    * { id: 'abc,ccc', code: '121,22', name: 'hello,wang' }
    * To 'abc##121##hello,ccc##22##wang'
    */
    nodeToStr(node) {
      const ids = (node.id && node.id.split(',')) || []
      const codes = (node.code && node.code.split(',')) || []
      const names = (node.name && node.name.split(',')) || []
      let line = ''
      if (ids.length === names.length) {
        for (let i = 0, len = ids.length; i < len; i++) {
          line += `${ids[i]}##${codes[i]}##${names[i]}`
          if (i < len - 1) {
            line += ','
          }
        }
      } else {
        console.log('tip: id,name数量匹配不上')
      }

      return line
    }
  }
}
