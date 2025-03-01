const { test, expect } = require('@playwright/test')
const { spawn } = require('child_process')
let server

async function startServer (which) {
  server = spawn('npm', ['run', `sample${which}`])
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      // uncomment this to debug
      // console.log(data.toString())
      if (data.toString().includes('server is running on')) {
        resolve()
      }
    })
  })
}

async function stopServer () {
  if (server) {
    server.kill()
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for the server to fully stop
  }
}

test.afterEach(async () => {
  await stopServer()
})

test.beforeEach(async ({ page }) => {
  // uncomment this to debug
  // page.on('console', msg => console.log(msg.text()))
})

test('should render the homepage correctly and handle server restart', async ({ page }) => {
  const which = 1 // which test server to use

  // start express server
  await startServer(which)

  // verify the /express-browser-reload.js route exists and serves JavaScript
  const response = await page.goto('/express-browser-reload.js')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('text/javascript; charset=utf-8')
  const scriptContent = await response.text()
  expect(scriptContent).toContain('socketUrl.replace')

  // verify initial page load
  await page.goto('/')
  const initialResultText = await page.textContent('p')
  expect(initialResultText).toBe('express-browser-reload express sample')

  // kill the server
  await stopServer()

  // restart the server
  await startServer(which)

  // wait for the page to detect the server restart and refresh
  await page.waitForFunction(() => document.readyState === 'complete')

  // verify the page refresh
  const refreshedResultText = await page.textContent('p')
  expect(refreshedResultText).toBe('express-browser-reload express sample')
})

test('should work with the route changed', async ({ page }) => {
  const which = 2 // which test server to use

  // start express server
  await startServer(which)

  // verify the /express-browser-reload.js route exists and serves JavaScript
  const response = await page.goto('/hfjdsjkfs.js')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('text/javascript; charset=utf-8')
  const scriptContent = await response.text()
  expect(scriptContent).toContain('socketUrl.replace')

  // verify initial page load
  await page.goto('/')
  const initialResultText = await page.textContent('p')
  expect(initialResultText).toBe('express-browser-reload express sample')

  // kill the server
  await stopServer()

  // restart the server
  await startServer(which)

  // wait for the page to detect the server restart and refresh
  await page.waitForFunction(() => document.readyState === 'complete')

  // verify the page refresh
  const refreshedResultText = await page.textContent('p')
  expect(refreshedResultText).toBe('express-browser-reload express sample')
})

test('should still work with skipDeletingConnections set to true', async ({ page }) => {
  const which = 3 // which test server to use

  // start express server
  await startServer(which)

  // verify the /express-browser-reload.js route exists and serves JavaScript
  const response = await page.goto('/express-browser-reload.js')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('text/javascript; charset=utf-8')
  const scriptContent = await response.text()
  expect(scriptContent).toContain('socketUrl.replace')

  // verify initial page load
  await page.goto('/')
  const initialResultText = await page.textContent('p')
  expect(initialResultText).toBe('express-browser-reload express sample')

  // kill the server
  await stopServer()

  // restart the server
  await startServer(which)

  // wait for the page to detect the server restart and refresh
  await page.waitForFunction(() => document.readyState === 'complete')

  // verify the page refresh
  const refreshedResultText = await page.textContent('p')
  expect(refreshedResultText).toBe('express-browser-reload express sample')
})
