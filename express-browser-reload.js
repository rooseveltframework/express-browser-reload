const path = require('path')
const fs = require('fs')

module.exports = (app, httpServer, params) => {
  if (!app.get) throw new Error('express-browser-reload: `app` is not an Express app.')
  if (typeof httpServer !== 'object' || !Object.keys(httpServer).includes('keepAlive')) throw new Error('express-browser-reload: `httpServer` is not a Server object.')

  const originalUpgradeHandler = httpServer.listeners('upgrade')[0]
  httpServer.removeAllListeners('upgrade')
  httpServer.on('upgrade', (request, socket, head) => {
    if (originalUpgradeHandler) originalUpgradeHandler.call(httpServer, request, socket, head)
    socket.write([
      'HTTP/1.1 101 Web Socket Protocol Handshake',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${require('crypto')
        .createHash('sha1')
        .update(request.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64')}`
    ].join('\r\n') + '\r\n\r\n')
  })

  if (!params?.skipDeletingConnections) {
    const originalConnectionHandler = httpServer.listeners('connection')[0]
    httpServer.removeAllListeners('connection')
    const connections = {}
    httpServer.on('connection', (conn) => {
      if (originalConnectionHandler) originalConnectionHandler.call(httpServer, conn)
      const key = conn.remoteAddress + ':' + conn.remotePort
      connections[key] = conn
      conn.on('close', () => { delete connections[key] }) // once the connection closes, remove
    })
  }

  app.get(params?.route || '/express-browser-reload.js', (req, res) => {
    res.type('text/javascript')
    res.send(fs.readFileSync(path.join(__dirname, './reload-client.js'), 'utf8').replace('socketUrl.replace()', 'socketUrl.replace(/(^http(s?):\\/\\/)(.*:)(.*)/, (match, p1, p2, p3, p4) => `ws${p2 ? "s" : ""}://${p3}${p4}`)')) // eslint-disable-line
  })
}
