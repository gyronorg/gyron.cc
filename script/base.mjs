// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderConfig } from './config.mjs'
import { fork } from 'child_process'
import esbuild from 'esbuild'
import fs from 'fs-extra'

let task
/**
 * @param {string} tempPath
 * @param {string} name
 */
function runServer(tempPath, name) {
  if (task) {
    task.send('restart')
  }
  task = fork(`${tempPath}/server/${name}`)
  task.once('data', (stdout) => {
    console.log(stdout)
  })
}

/**
 * @param {object} outputs esbuild meta file outputs
 * @returns {{js: string; css: string}}
 */
function formatEntryMeta(outputs) {
  const name = Object.keys(outputs)
    .filter((name) => /index.*\.(js|css)$/.test(name))
    .reduce(
      (prev, filepath) => {
        const path = filepath.split('/')
        const name = path[path.length - 1]
        const key = name.replace(/.+\./, '')
        prev[key] = name
        return prev
      },
      {
        js: null,
        css: null,
      }
    )

  return name
}

/**
 * @param {boolean} watch
 * @param {string} tempPath
 * @param {{ js: string; css: string; }} clientMetaFile
 */
export async function buildServer(watch, tempPath, clientMetaFile) {
  // server
  try {
    const result = await esbuild.build({
      ...renderConfig(watch, true),
      entryPoints: ['src/server/index.tsx'],
      outdir: watch ? `${tempPath}/server` : 'dist/server',
      format: 'cjs',
      platform: 'node',
      watch: watch
        ? {
            onRebuild(err, result) {
              runServer(tempPath, formatEntryMeta(result.metafile.outputs).js)
            },
          }
        : false,
      define: {
        __DEV__: String(watch),
        __WARN__: String(false),
        __TMP__: JSON.stringify(watch ? tempPath : '../'),
        __CLIENT__: JSON.stringify(clientMetaFile),
      },
    })
    const filename = formatEntryMeta(result.metafile.outputs).js
    if (watch) {
      runServer(tempPath, filename)
    } else {
      fs.writeFileSync('dist/server/index.js', `require('./${filename}')\n`, {
        encoding: 'utf-8',
      })
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

/**
 * @param {boolean} watch
 * @param {string} tempPath
 */
export async function buildClient(watch, tempPath) {
  // client
  try {
    const result = await esbuild.build({
      ...renderConfig(watch, watch),
      entryPoints: ['src/client/index.tsx'],
      outdir: watch ? `${tempPath}/client` : 'dist/client',
      format: 'esm',
      splitting: true,
      platform: 'browser',
      define: {
        __DEV__: String(watch),
        __WARN__: String(false),
        'process.env.NODE_ENV': JSON.stringify(
          watch ? 'development' : 'production'
        ),
      },
    })
    return formatEntryMeta(result.metafile.outputs)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export async function buildAPP() {
  try {
    await esbuild.build({
      ...renderConfig(true, false),
      entryPoints: ['src/app/index.tsx'],
      outfile: 'dist/app/index.mjs',
      format: 'esm',
      platform: 'browser',
      watch: false,
      external: ['@gyron/runtime', '@gyron/router'],
      define: {
        __DEV__: String(false),
        __WARN__: String(false),
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    })
    const { App, ExposeRoutes } = await import('../dist/app/index.mjs')
    return { App, ExposeRoutes }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
