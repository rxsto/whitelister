const Service = require('../../lib/service/Service')

class WhiteListService extends Service {
  constructor (client) {
    super(client)
  }

  add (users) {
    const executions = []
    console.info(`Adding ${users.length === 1 ? 'user' : 'users'} ${users.map(user => user.name).join(', ')}...`)
    users.forEach(user => this.client.rcon.send(`whitelist add ${user.name}`))
    Promise.all(executions).then(results => {
      console.info(results.join('\n'))
      console.info(`Successfully added ${users.length} ${users.length === 1 ? 'user' : 'users'}!`)
    }).catch(error => {
      console.error(error)
      throw new Error(error)
    })
  }

  remove (users) {
    const executions = []
    console.info(`Removing ${users.length === 1 ? 'user' : 'users'} ${users.map(user => user.name).join(', ')}...`)
    users.forEach(user => this.client.rcon.send(`whitelist remove ${user.name}`))
    Promise.all(executions).then(results => {
      console.info(results.join('\n'))
      console.info(`Successfully removed ${users.length} ${users.length === 1 ? 'user' : 'users'}!`)
    }).catch(error => {
      console.error(error)
      throw new Error(error)
    })
  }

  async list () {
    return await this.client.rcon.send(`whitelist list`)
  }
}

module.exports = WhiteListService
