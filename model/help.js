import base from './base.js'
import Cfg from './Cfg.js'
import _ from 'lodash'

export default class Help extends base {
  constructor(e) {
    super(e)
    this.model = 'help'
  }

  static async get(e) {
    let html = new Help(e)
    return await html.getData()
  }

  async getData() {
    let helpData = Cfg.getdef('help')

    return {
      ...this.screenData,
      saveId: 'help',
      helpData
    }
  }

  async admin(regRet) {
    this.model = 'admin'
    let config = Cfg.getConfig('config')
    let cfgSchemaMap = Cfg.getCfgSchemaMap()

    if (regRet[1]) {
      // 设置模式
      let val = regRet[2] || ''

      let cfgSchema = cfgSchemaMap[regRet[1]]
      if (cfgSchema.type !== 'cron')
        if (cfgSchema.input)
          config[cfgSchema.cfgKey] = Number(cfgSchema.input(val))
        else
          config[cfgSchema.cfgKey] = cfgSchema.type == 'num' ? (Number(val) || cfgSchema.def) : !/关闭/.test(val)

      Cfg.setConfig('config', config)
    }

    return {
      ...this.screenData,
      schema: Cfg.getCfgSchema(),
      cfg: Cfg.getConfig('config')
    }
  }
}
