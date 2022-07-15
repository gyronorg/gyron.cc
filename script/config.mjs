// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { babelESBuildJsx } from '@gyron/babel-plugin-jsx'
import {
  rehypeMetaAsAttributes,
  rehypeHighlight,
} from '@gyron/rehype-highlight'
import mdx from '@mdx-js/esbuild'
import remarkGfm from 'remark-gfm'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import fs from 'fs'
import path from 'path'
import tailwindcss from 'tailwindcss'
import syntax from 'postcss-syntax'
import less from 'less'
import postcssNested from 'postcss-nested'

/**
 * @param {string} uri
 * @returns
 */
function exist(uri) {
  try {
    return fs.lstatSync(uri).isFile()
  } catch (e) {
    return false
  }
}

function Postcss() {
  return {
    name: 'esbuild:postcss',
    /** @type {import('esbuild').Plugin['setup']} */
    setup(build) {
      build.onLoad({ filter: /\.(less|css)$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8')
        const filename = path.relative(process.cwd(), args.path)
        const ext = path.extname(args.path)

        let content = source
        if (ext === '.less') {
          const { css } = await less.render(source, {
            filename: filename,
          })
          content = css
        }

        const result = await postcss([
          autoprefixer,
          tailwindcss,
          postcssNested,
        ]).process(content, {
          from: args.path,
          syntax: syntax,
        })

        return {
          contents: result.content,
          loader: 'css',
          watchFiles: [args.path],
        }
      })
    },
  }
}

function LoadHtml() {
  return {
    name: 'esbuild:html',
    /** @type {import('esbuild').Plugin['setup']} */
    setup(build) {
      build.onLoad({ filter: /\.html$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8')
        return {
          contents: source,
          loader: 'text',
        }
      })
    },
  }
}

function Alias() {
  return {
    name: 'esbuild:alias',
    /** @type {import('esbuild').Plugin['setup']} */
    setup(build) {
      build.onResolve({ filter: /^@\// }, async (args) => {
        const uri = path.join(
          process.cwd(),
          '/src/app',
          args.path.replace(/^@\//, '')
        )
        if (exist(uri)) {
          return {
            path: uri,
          }
        }
        const extensions = ['.tsx', '.ts', '.js', '.less', '.css', '.json']
        const url = extensions.map((ext) => uri + ext).find((uri) => exist(uri))
        if (url) {
          return {
            path: url,
          }
        }
        const urlNormalize = path.normalize(`${uri}/index`)
        const fallback = extensions
          .map((ext) => urlNormalize + ext)
          .find((uri) => exist(uri))
        if (fallback) {
          return {
            path: fallback,
          }
        }
        console.warn(args, `No ${uri} module found`)
      })
    },
  }
}

function Mdx() {
  return mdx({
    jsxImportSource: '@gyron',
    pragma: 'reactCreateElement',
    pragmaFrag: 'Fragment',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeMetaAsAttributes, [rehypeHighlight, {}]],
  })
}

/**
 * @param {boolean} watch
 */
export function renderConfig(watch, __DEV__) {
  return {
    bundle: true,
    sourcemap: true,
    metafile: true,
    watch: watch,
    entryNames: watch ? '[dir]/[name]' : '[dir]/[name]-[hash]',
    plugins: [
      Alias(),
      LoadHtml(),
      Postcss(),
      Mdx(),
      babelESBuildJsx({
        hmr: Boolean(__DEV__),
      }),
    ],
  }
}
