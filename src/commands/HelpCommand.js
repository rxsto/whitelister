const { MessageEmbed } = require('discord.js')

const Command = require('../../lib/command/Command')

class RemoveCommand extends Command {
  constructor (client) {
    super(client, 'help')
  }

  async execute (msg) {
    const list = this.client.commands.keyArray()
    const embed = new MessageEmbed()
      .addField(`${process.env.EMOJI_INFO} Commands`, list.map(command => `\`${command}\``).join(', '))
      .setTimestamp(new Date())
      .setColor(0x0FABDD)
    msg.channel.send(embed)
  }
}

module.exports = RemoveCommand
