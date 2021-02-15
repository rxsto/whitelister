const Service = require('../../lib/service/Service')

class UserAddService extends Service {
  constructor (client) {
    super(client)
  }

  add (users) {
    const executions = []
    console.info(`Adding ${users.length === 1 ? 'user' : 'users'} ${users.join(', ')}...`)
    users.forEach(user => this.client.rcon.send(`whitelist add ${user.name}`))
    Promise.all(executions).then(results => {
      console.info(results.join('\n'))
      console.info(`Successfully added ${users.length} ${users.length === 1 ? 'user' : 'users'}!`)
    }).catch(error => {
      console.error(error)
      throw new Error(error)
    })
  }
}

module.exports = UserAddService
