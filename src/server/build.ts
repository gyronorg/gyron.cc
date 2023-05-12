import {
  buildBrowserEsmWithEsbuild,
  transformWithBabel,
} from '@gyron/babel-plugin-jsx'
import { build } from 'esbuild'
import { RequestHandler } from 'express'

export const withBuild: RequestHandler = async (req, res, next) => {
  const { main, sources } = req.body

  try {
    const { plugin } = buildBrowserEsmWithEsbuild(main, {
      sources,
    })
    const content = await transformWithBabel(main.code, main.name, main, true)
    const bundle = await build({
      stdin: {
        contents: content.code,
        sourcefile: main.name,
      },
      bundle: true,
      write: false,
      format: 'esm',
      plugins: [plugin],
    })

    if (bundle.warnings.length) {
      res.send({
        data: bundle.warnings.map((item) => item.text).join('\n'),
        code: 1,
      })
    } else {
      res.send({
        data: {
          text: bundle.outputFiles[0].text,
          metafile: bundle.metafile,
        },
        code: 0,
      })
    }
  } catch (e) {
    console.error(e.message)
    res.send({
      data: e.message,
      code: 1,
    })
  }
}
