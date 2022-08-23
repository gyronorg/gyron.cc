// @ts-nocheck
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from '@babel/parser'
import { remark } from 'remark'
import generator from '@babel/generator'
import traverse from '@babel/traverse'
import prettier from 'prettier'
import config from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const _base = path.resolve(__dirname, '../src/app/source/api')

function template({ name, descripe, type, code, params, returns }) {
  let markdown = `## ${name}\n\n${descripe}\n\n**示例**\n
\`\`\` ${code.lang} ${code.meta ? code.meta : ''}
${code.value}
\`\`\`\n`

  if (params) {
    markdown += `\n**参数说明**\n\n${params
      .map((item) => `- ${item.key} - ${item.value}`)
      .join('\n')}\n`
  }
  if (returns) {
    markdown += `\n**返回值**\n\n${returns}\n`
  }
  if (type) {
    markdown += `\n**类型声明**\n\n\`\`\` ts d\n${type}\n\`\`\``
  }
  return markdown
}

/**
 * @param {import('mdast').Root} ast
 * @param {string} value
 */
function normalized(ast, value) {
  let i = 0
  let code, descripe, api, params, returns
  while (i < ast.children.length) {
    const node = ast.children[i]
    if (node.type === 'paragraph') {
      const start = node.position?.start.offset
      const end = node.position?.end.offset
      const text = value.slice(start, end)
      if (text.includes('@api')) {
        const obj = text
          .split('\n')
          .map((item) => {
            const t = item.trim()
            const key = t.match(/^@[a-z]+\s/)?.[0]
            return {
              key: key?.slice(1, -1),
              value: t.replace(key || '', ''),
            }
          })
          .reduce((prev, cur) => {
            if (cur.key === 'param') {
              const s = prev.find((item) => item.key === 'param')
              if (s) {
                s.value.push(cur.value)
              } else {
                prev.push({
                  key: 'param',
                  value: [cur.value],
                })
              }
            } else {
              prev.push(cur)
            }
            return prev
          }, [])
        api = obj.find((item) => item.key === 'api')?.value
        params = obj
          .find((item) => item.key === 'param')
          ?.value?.map((item) => {
            const v = item.split(' ')
            return {
              key: v[0],
              value: v.slice(1).join(' '),
            }
          })
        returns = obj.find((item) => item.key === 'returns')?.value
      } else {
        const {
          start: { offset: start },
          end: { offset: end },
        } = node.position
        descripe = value.slice(start, end)
      }
    } else if (node.type === 'code') {
      code = node
    }
    i++
  }
  return {
    code,
    descripe,
    api,
    params,
    returns,
  }
}

/**
 * @param {{[key: string]: string[]}} data
 */
function toMDX(data) {
  for (const [key, value] of Object.entries(data)) {
    const banner =
      '> 为了保持 API 文档实时更新，文档由`index.d.ts`文件自动生成。'
    const content = `${banner}\n\n${value.join('\n\n')}\n`
    fs.writeFileSync(
      path.resolve(_base, key + '.mdx'),
      prettier.format(
        content,
        Object.assign(config.prettier, { parser: 'mdx' })
      )
    )
  }
}

void (function () {
  fs.readFile(
    path.join(__dirname, '../node_modules/@gyron/runtime/dist/index.d.ts'),
    { encoding: 'utf8' },

    (err, data) => {
      const result = parse(data, {
        sourceType: 'module',
        plugins: [['typescript', { dts: true }]],
      })

      if (result) {
        const ret = {}
        /** @type {import('@babel/traverse').Visitor} */
        const visitor = {
          TSDeclareFunction(path) {
            if (path.node.leadingComments) {
              const commentBlock = path.node.leadingComments[0]
              if (commentBlock.value.includes('@api')) {
                const name = path.node.id?.name
                path.node.leadingComments = []
                path.node.trailingComments = []
                const declare = generator.default(path.node).code
                const type = declare
                  .slice(-(path.node.end - commentBlock.end - 2))
                  .replace(/^\n/, '')
                const value = commentBlock.value.replace(/\*/g, '')
                const ast = remark.parse(value)
                const { code, descripe, api, params, returns } = normalized(
                  ast,
                  value
                )
                const markdown = template({
                  name,
                  descripe,
                  type,
                  code,
                  params,
                  returns,
                })
                if (ret[api]) {
                  ret[api].push(markdown)
                } else {
                  ret[api] = [markdown]
                }
              }
            }
          },
        }

        traverse.default(result, visitor)

        toMDX(ret)
      }
    }
  )
})()
