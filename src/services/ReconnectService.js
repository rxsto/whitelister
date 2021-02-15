const Service = require('../../lib/service/Service')

class ReconnectService extends Service {
  constructor (client) {
    super(client)
    this.reconnecting = false
  }

  init () {
    this.client.rcon.on('connect', () => {
      console.info('Successfully connected to RCON session, starting to authenticate!')
    })
    this.client.rcon.on('authenticated', () => {
      console.info('Successfully authenticated RCON session!')
      this.reconnecting = false
    })
    this.client.rcon.on('end', () => {
      console.warn('RCON session ended abruptly! Attempting to reconnect in 1000ms...')
      setTimeout(() => {
        this.reconnect()
        this.reconnecting = true
      }, 1000)
    })
    this.client.rcon.on('error', (err) => {
      console.error(err)
    })
    // this.client.rcon.socket.on('close', (hadError) => {
    //   console.warn(`Raw socket session was closed abruptly${hadError ? ' and had an error' : ''}! Attempting to reconnect in 1000ms...`)
    //   setTimeout(() => {
    //     this.reconnect()
    //     this.reconnecting = true
    //   }, 1000)
    // })
    // this.client.rcon.socket.on('end', () => {
    //   console.warn('Raw socket session ended abruptly! Attempting to reconnect in 1000ms...')
    //   setTimeout(() => {
    //     this.reconnect()
    //     this.reconnecting = true
    //   }, 1000)
    // })
    // this.client.rcon.socket.on('error', () => {
    //   if (error.message.includes('ECONNREFUSED')) {
    //     console.warn('RCON endpoint is not reachable yet! Attempting to reconnect in 1000ms...')
    //     setTimeout(() => {
    //       this.reconnect()
    //       this.reconnecting = true
    //     }, 1000)  
    //   } else {
    //     console.error(err)
    //   }
    // })
  }

  async reconnect () {
    if (!this.reconnecting) {
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
}

module.exports = ReconnectService
