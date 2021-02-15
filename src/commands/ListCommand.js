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
      .addField({ name: `${process.env.EMOJI_INFO} Whitelisted Players`, value: list.map(user => `\`${user}\``).join(', ') })
      .setTimestamp(new Date())
      .setColor(0x0FABDD)
    msg.channel.send(embed)
  }
}

module.exports = RemoveCommand
