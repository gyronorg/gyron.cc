import jsxDts from 'https://unpkg.com/gyron/dist/index.d.ts'
import gyronDts from 'https://unpkg.com/@gyron/runtime/dist/index.d.ts'

interface ExtraLibItem {
  path: string
  origin: string
  name: string
  text: string
}

class ExtraLib {
  [key: string]: ExtraLibItem
  constructor(record: Record<string, ExtraLibItem>) {
    Reflect.ownKeys(record).forEach((key: string) => {
      this[record[key].name.slice(0, -5)] = record[key]
      this[key] = record[key]
    })
  }
}

const cache = {}

const generateDTS = async () => {
  const libs = [
    'lib.dom.d.ts',
    'lib.dom.iterable.d.ts',
    'lib.es2015.collection.d.ts',
    'lib.es2015.core.d.ts',
    'lib.es2015.d.ts',
    'lib.es2015.generator.d.ts',
    'lib.es2015.iterable.d.ts',
    'lib.es2015.promise.d.ts',
    'lib.es2015.proxy.d.ts',
    'lib.es2015.reflect.d.ts',
    'lib.es2015.symbol.d.ts',
    'lib.es2015.symbol.wellknown.d.ts',
    'lib.es2016.array.include.d.ts',
    'lib.es2016.d.ts',
    'lib.es2016.full.d.ts',
    'lib.es2017.d.ts',
    'lib.es2017.full.d.ts',
    'lib.es2017.intl.d.ts',
    'lib.es2017.object.d.ts',
    'lib.es2017.sharedmemory.d.ts',
    'lib.es2017.string.d.ts',
    'lib.es2017.typedarrays.d.ts',
    'lib.es2018.asyncgenerator.d.ts',
    'lib.es2018.asynciterable.d.ts',
    'lib.es2018.d.ts',
    'lib.es2018.full.d.ts',
    'lib.es2018.intl.d.ts',
    'lib.es2018.promise.d.ts',
    'lib.es2018.regexp.d.ts',
    'lib.es2019.array.d.ts',
    'lib.es2019.d.ts',
    'lib.es2019.full.d.ts',
    'lib.es2019.intl.d.ts',
    'lib.es2020.d.ts',
    'lib.es2021.d.ts',
    'lib.es2022.d.ts',
    'lib.es5.d.ts',
    'lib.es6.d.ts',
    'lib.esnext.d.ts',
    'lib.webworker.d.ts',
  ].map(async (key) => {
    const text =
      cache[key] ||
      (cache[key] = await fetch('https://unpkg.com/typescript/lib/' + key).then(
        (res) => res.text()
      ))
    return {
      path: '/typescript/lib/' + key,
      origin: 'https://unpkg.com',
      name: key,
      text: text,
    }
  })

  const originLibs = (await Promise.all(libs)).reduce((prev, curr) => {
    prev['/' + curr.name] = curr
    return prev
  }, {})

  return new ExtraLib(
    Object.assign(
      {},
      {
        '/@gyron/runtime/dist/index.d.ts': {
          path: '/@gyron/runtime/dist/index.d.ts',
          origin: 'https://unpkg.com',
          name: 'gyron.d.ts',
          text: `declare module 'gyron' { ${gyronDts} }
      declare const Gyron`,
        },
        '/gyron/dist/index.d.ts': {
          path: '/gyron/dist/index.d.ts',
          origin: 'https://unpkg.com',
          name: 'jsx.d.ts',
          text: jsxDts,
        },
      },
      originLibs
    )
  )
}

export { jsxDts, gyronDts }

export default generateDTS
