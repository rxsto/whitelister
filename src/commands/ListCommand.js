const { MessageEmbed } = require('discord.js')

const Command = require('../../lib/command/Command')

class RemoveCommand extends Command {
  constructor (client) {
    super(client, 'list')
  }

  async execute (msg) {
    const list = await this.client.whiteListService.list()
    const embed = new MessageEmbed()
      .setTitle(`All whitelisted players`)
      .setDescription(list)
      .setTimestamp(new Date())
      .setColor(0x0FABDD)
    msg.channel.send(embed)
  }
}

module.exports = RemoveCommand
