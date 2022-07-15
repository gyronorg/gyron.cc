// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { buildClient, buildServer } from './base.mjs'
import tmp from 'tmp'
import fs from 'fs-extra'

const tempPath = tmp.dirSync().name

process.on('SIGINT', () => {
  fs.removeSync(tempPath)
  process.exit()
})

buildClient(true, tempPath).then((clientMetafile) => {
  buildServer(true, tempPath, clientMetafile).then(() => {
    fs.copySync('public/assets', `${tempPath}/assets`)
    console.log(tempPath)
  })
})
