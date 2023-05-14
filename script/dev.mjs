// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildClient, buildServer } from './base.mjs'
import fs from 'fs-extra'
import ora from 'ora'

const spinner = ora('Building...')
spinner.start()

const tempPath = 'dist'

process.on('SIGINT', () => {
  fs.removeSync(tempPath)
  process.exit()
})

buildClient(false, tempPath, true).then((clientMetafile) => {
  buildServer(false, tempPath, clientMetafile, true).then(() => {
    fs.copySync('public/assets', `${tempPath}/assets`)
    fs.copySync('node_modules/gyron/dist/browser', `${tempPath}/assets/gyron`)
    fs.copySync('public/assets', `${tempPath}/assets`)
    spinner.succeed('Build Complete.', tempPath)
  })
})
