const c = require('centra')
const { MessageEmbed } = require('discord.js')

const Command = require('../../lib/command/Command')

class RemoveCommand extends Command {
  constructor (client) {
    super(client, 'remove')
  }

  execute (msg, args) {
    console.info(`Trying to remove ${args.length === 1 ? 'user' : 'users'} ${args.join(', ')}...`)
    const executions = []
    args.forEach(arg => executions.push(c(`https://api.mojang.com/users/profiles/minecraft/${arg}`).send()))
    Promise.all(executions).then(results => {
      this.handle(msg, args, results)
    }).catch(error => {
      console.error(error)
      const embed = new MessageEmbed()
        .setTitle(`${process.env.EMOJI_ERROR} ${error.message}`)
        .setDescription(`\`\`\`${error}\`\`\``)
        .setTimestamp(new Date())
        .setColor(0xff6961)
      msg.channel.send(embed)
    })
  }

  async handle (msg, args, results) {
    const proceedRemove = []
    const foundResults = []
    const notFoundResults = []
    const unknownResults = []  
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.statusCode === 200) {
        const body = await result.json()
        proceedRemove.push(body)
        foundResults.push(args[i])
      } else if (result.statusCode === 204) {
        notFoundResults.push(args[i])
      } else {
        unknownResults.push(args[i])
      }
    }
    const fields = []
    if (foundResults.length > 0) {
      fields.push({ name: `${process.env.EMOJI_CHECK} Success`, value: `Removing ${foundResults.length === 1 ? 'user' : 'users'} ${foundResults.map(user => `\`${user}\``).join(', ')}` })
    }
    if (notFoundResults.length > 0) {
      fields.push({ name: `${process.env.EMOJI_ERROR} Not Found`, value: `Didn't find ${notFoundResults.length === 1 ? 'user' : 'users'} ${notFoundResults.map(user => `\`${user}\``).join(', ')}` })
    }
    if (unknownResults.length > 0) {
      fields.push({ name: `${process.env.EMOJI_WARN} Warn`, value: `Couldn\'t verify ${unknownResults.length === 1 ? 'user' : 'users'} ${unknownResults.map(user => `\`${user}\``).join(', ')}` })
    }
    const embed = new MessageEmbed()
      .addFields(fields)
      .setTimestamp(new Date())
      .setColor(0x0FABDD)
    msg.channel.send(embed)
    this.client.whitelist.remove(proceedRemove)
  }
}

module.exports = RemoveCommand
