import fs from 'node:fs'
import Cfg from './model/Cfg.js'

if (!fs.existsSync(Cfg.file))
  fs.mkdirSync(Cfg.file)

let file = fs.readdirSync(`${Cfg.defile}`).filter(file => file.endsWith('.yaml'))
for (let item of [...file, 'mys.json'])
  if (!fs.existsSync(`${Cfg.file}/${item}`))
    fs.copyFileSync(`${Cfg.defile}/${item}`, `${Cfg.file}/${item}`)

try {
  for (let type of ['white', 'banuid', 'api', 'equip', 'command', 'lable', 'config']) {
    let isNew = true
    let data = Cfg.getConfig(type)
    let defdata = Cfg.getdef(type)

    if (['lable', 'command'].includes(type)) {
      for (let i in defdata)
        if (!(i in data)) isNew = false

      if (!isNew) {
        let config = Cfg.getdef(type, false)
        for (let i in defdata)
          if (i in data)
            config = config.replace(new RegExp(`${i}:(.*)`, 'g'), `${i}: ${data[i]}`)

        Cfg.setConfig(type, config, false)
      }
    } else {
      for (let i in defdata)
        if (!(i in data)) isNew = false

      if (!isNew) {
        for (let i in defdata)
          if (i in data)
            defdata[i] = data[i]

        Cfg.setConfig(type, defdata)
      }
    }
  }
  logger.mark('[寄]配置文件更新完成')
} catch (error) {
  logger.error(error)
}

const files = fs.readdirSync('./plugins/bujidao/apps').filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(`bujidao/${name}.js`)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

export { apps }
