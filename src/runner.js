/* @flow */
import path from 'path'
import puppeteer from 'puppeteer'
import { BACKDOOR_FOR_STORE, RECORDING_START, REPLACEABLE } from './constants'

function wait(n: number) {
  return new Promise(resolve => setTimeout(resolve, n))
}

async function getPerformanceMetrics(page) {
  const { metrics } = await page._client.send('Performance.getMetrics')
  return metrics.reduce((acc, i) => ({ ...acc, [i.name]: i.value }), {})
}

function dispatchInPage(page, action) {
  return page.evaluate(
    (a, b) => window[b].dispatch(a),
    action,
    BACKDOOR_FOR_STORE
  )
}

function report(results) {
  let prev = results.shift()
  let next: any = null

  const targetKeys = Object.keys(prev.metrics)
  while ((next = results.shift())) {
    const delta = targetKeys.reduce((acc, key) => {
      const p = prev.metrics[key]
      const n = next.metrics[key]
      if (p !== n) {
        return { ...acc, [key]: n - p }
      } else {
        return acc
      }
    }, {})
    console.log('delta >', next.dispatchedAction.type, delta)
    prev = next
  }
}

function createScreenshotContext(page, opts) {
  const outdir = path.join(opts.out || 'e2e', 'screenshots')
  let cnt = 0
  return async () => {
    if (opts.screenshot) {
      const outpath = path.join(outdir, `${cnt++}.png`)
      await page.screenshot({
        path: outpath
      })
    }
  }
}

type MODE = 'wait' | 'no-wait' | 'realtime'
export default async function run(
  data: any,
  opts: { screenshot: boolean, mode?: MODE, wait: ?number, out?: string }
) {
  const actions = data.actionSeries.map(d => d.dispatchedAction)
  const results = []

  const browser = await puppeteer.launch(opts)
  const page = await browser.newPage()
  await page.goto(data.url)
  await page._client.send('Performance.enable')
  page.on('console', msg => console.log('PAGE LOG:', ...msg.args))

  const shot = createScreenshotContext(page, opts)

  // Dispatch first action as REPLACEABLE
  const first = actions.shift()
  if (first.type === RECORDING_START) {
    await dispatchInPage(page, {
      type: REPLACEABLE,
      payload: first.payload.state
    })
    await shot()
  }

  const mode = opts.mode || 'no-wait'
  const waitTime = opts.wait || 100

  for (const action of actions) {
    await dispatchInPage(page, action)
    results.push({
      dispatchedAction: action,
      metrics: await getPerformanceMetrics(page)
    })
    console.log('dispatched', action)
    await shot()
    if (mode === 'wait') {
      wait(waitTime)
    }
  }

  await browser.close()

  report(results)
}
