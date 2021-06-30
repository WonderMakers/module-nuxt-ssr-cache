// https://www.npmjs.com/package/lru-cache
const LruCache = require('lru-cache')

const cache = new LruCache(500)
const isProd = process.env.NODE_ENV !== 'development'

export default function () {
  const { nuxt } = this
  
  // hooks https://nuxtjs.org/docs/2.x/internals-glossary/internals-renderer
  nuxt.hook('render:route', async function (url, result, context) {
    const cacheControl = context.res.getHeader('Cache-Control') || ''
    const match = cacheControl.match(/\d+/) || [0]
    const age = +match[0]
    if (!result.redirected && age && isProd) {
      cache.set(url, result.html, age * 1000)
    }
  })
  
  // module https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware
  this.addServerMiddleware((req, res, next) => {
    const html = cache.get(req.url)
    if (html) {
      res.end(html)
    } else {
      next()
    }
  })
}
