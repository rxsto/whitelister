class Command {
  constructor (client, name) {
    this.client = client
    this.name = name
  }

  execute () {
    throw new Error('This method needs to be overwritten!')
  }
}

module.exports = Command
