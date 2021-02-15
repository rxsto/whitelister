const Service = require('../../lib/service/Service')

class ReconnectService extends Service {
  constructor (client) {
    super(client)
  }

  init () {
    this.client.rcon.on('connect', () => {
      console.info('Successfully connected to RCON session!')
    })
    this.client.rcon.on('authenticated', () => {
      console.info('Successfully authenticated RCON session!')      
    })
    this.client.rcon.on('end', () => {
      console.warn('RCON session ended abruptly! Attempting reconnect in 1000ms...')
      setTimeout(() => {
        try {
          this.reconnect()
        } catch (err) {
          console.error('Failed to initialize reconnect loop! Aborting...')
        }
      }, 1000)
    })
    this.client.rcon.on('error', (err) => {
      if (err.message.includes('ECONNREFUSED')) {
        console.error('Failed to reconnect to RCON session! Retrying in 5000ms...')
        setTimeout(() => {
          this.reconnect()
        }, 5000)
      } else {
        console.error(err.message)
      }
    })
  }

  reconnect () {
    console.info('Trying to reconnect to RCON session...')
    try {
      this.client.rcon.connect()
    } catch (err) {
      console.error('Failed to reconnect to RCON session! Retrying in 5000ms...')
      setTimeout(() => {
        this.reconnect()
      }, 5000)
    }
  }
}

module.exports = ReconnectService
