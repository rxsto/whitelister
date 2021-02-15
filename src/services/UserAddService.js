const Service = require('../../lib/service/Service')

class UserAddService extends Service {
  constructor (client) {
    super(client)
  }

  add (users) {
    const executions = []
    users.forEach(user => this.client.rcon.send(`whitelist add ${user.name}`))
    Promise.all(executions).then(results => {
      console.info(results.join('\n'))
    }).catch(error => {
      console.error(error)
      throw new Error(error)
    })
  }
}

module.exports = UserAddService
