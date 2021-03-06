const Service = require('../../lib/service/Service')

class ReconnectService extends Service {
  constructor (client) {
    super(client)
  }

  init () {
    this.client.rcon.on('connect', () => {
      console.info('Successfully connected to RCON session, starting to authenticate!')
    })
    this.client.rcon.on('authenticated', () => {
      console.info('Successfully authenticated RCON session!')
    })
    this.client.rcon.on('end', () => {
      console.warn('RCON session ended abruptly! Attempting to reconnect in 1000ms...')
      setTimeout(() => {
        this.reconnect()
      }, 1000)
    })
    this.client.rcon.on('error', (err) => {
      console.error(err)
    })
  }

  async reconnect () {
    console.info('Trying to reconnect to RCON session...')
    try {
      await this.client.rcon.connect()
    } catch (err) {
      console.error('Failed to reconnect to RCON session! Retrying in 5000ms...')
      setTimeout(() => {
        this.reconnect()
      }, 5000)
    }
  }
}

module.exports = ReconnectService
