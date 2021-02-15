const { MessageEmbed } = require('discord.js')

const Command = require('../../lib/command/Command')

class RemoveCommand extends Command {
  constructor (client) {
    super(client, 'list')
  }

  async execute (msg) {
    const result = await this.client.whitelist.list()
    const list = result.split('players: ')[1].split(', ')
    const embed = new MessageEmbed()
      .addField(`${process.env.EMOJI_INFO} Players`, list.map(user => `\`${user}\``).join(', '))
      .setTimestamp(new Date())
      .setColor(0x0FABDD)
    msg.channel.send(embed)
  }
}

module.exports = RemoveCommand
