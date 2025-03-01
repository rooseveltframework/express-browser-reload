(function refresh () {
  let socketUrl = window.location.origin
  if (!window.location.origin.match(/:[0-9]+/)) socketUrl = window.location.origin + ':80'
  socketUrl = socketUrl.replace() // this is dynamically populated by the reload.js file before it is sent to the browser
  let firstChangeFlag = false // the first change flag is used to tell reload to wait until the socket closes at least once before we allow the page to open on a socket open event. otherwise reload will go into a inifite loop, as the page will have a socket on open event once it loads for the first time
  let navigatedAwayFromPageFlag // the navigatedAwayFromPageFlag is set to true in the event handler onbeforeunload because we want to short-circuit reload to prevent it from causing the page to reload before the navigation occurs.
  let socket

  function websocketWaiter () {
    setTimeout(() => {
      socket = new WebSocket(socketUrl) // eslint-disable-line

      socket.onopen = (msg) => {
        if (firstChangeFlag === true && navigatedAwayFromPageFlag !== true) {
          firstChangeFlag = false // reset the firstChangeFlag to false so that when the socket on open events are being fired it won't keep reloading the page
          window.location.reload() // now that everything is set up properly we reload the page
        }
      }

      socket.onclose = (msg) => {
        firstChangeFlag = true // we encountered a change so we set firstChangeFlag to true so that as soon as the server comes back up and the socket opens we can allow the reload
        websocketWaiter() // call the webSocketWaiter function so that we can open a new socket and set the event handlers
      }

      socket.onmessage = (msg) => msg.data === 'reload' && socket.close()
    }, 250)
  }

  // wait until the page loads for the first time and then call the webSocketWaiter function so that we can connect the socket for the first time
  window.addEventListener('DOMContentLoaded', () => websocketWaiter())

  // if the user navigates away from the page, we want to short-circuit reload to prevent it from causing the page to reload before the navigation occurs
  window.addEventListener('beforeunload', () => { navigatedAwayFromPageFlag = true })
})()
