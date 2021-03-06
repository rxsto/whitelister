const fs = require('fs')
const path = require('path')
const figlet = require('figlet')

const { Client, Collection } = require('discord.js')
const { Rcon } = require('rcon-client')

const WhiteListService = require('../src/services/WhiteListService')
const ReconnectService = require('../src/services/ReconnectService')

class Application {
  constructor () {
    this.owners = process.env.OWNERS.split(',')
    this.discord = new Client()
    this.commands = new Collection()
    this.rcon = new Rcon({ host: process.env.RCON_HOST, port: process.env.RCON_PORT, password: process.env.RCON_TOKEN })
    this.reconnector = new ReconnectService(this)
    this.whitelist = new WhiteListService(this)
  }

  async init () {
    console.log(figlet.textSync('whitelister', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));
    this.reconnector.init()
    await this.rcon.connect()
    const commandFiles = await fs.readdirSync(path.join(process.cwd(), 'src/commands'))
    commandFiles.forEach(file => {
      const Command = require(`../src/commands/${file}`)
      const command = new Command(this)
      this.commands.set(command.name, command)
    })
    this.discord.login()
    this.ready()
    this.message()
  }

  ready () {
    this.discord.on('ready', () => {
      console.info(`Application ready! Listening to prefix ${process.env.PREFIX}`)
      this.discord.user.setActivity(`${process.env.PREFIX}help`, { type: 'LISTENING' })
    })
  }

  message () {
    this.discord.on('message', (msg) => {
      const content = msg.content
      if (!content.startsWith(process.env.PREFIX) && !content.startsWith(`<@${this.discord.user.id}>`) && !content.startsWith(`<@!${this.discord.user.id}>`)) return
      const args = content.startsWith(process.env.PREFIX) ? content.substring(3).split(' ') : content.split(' ').slice(1)
      const command = args.shift()
      if (this.commands.has(command)) {
        this.commands.get(command).execute(msg, args)
      }
    })
  }
}

module.exports = Application
