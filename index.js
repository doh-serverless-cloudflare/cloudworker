const runtime = require('./lib/runtime')
const kv = require('./lib/kv')

module.exports = require('./lib/cloudworker')

module.exports.fetch = runtime.fetch
module.exports.FetchEvent = runtime.FetchEvent
module.exports.URL = runtime.URL
module.exports.Headers = runtime.Headers
module.exports.Request = runtime.Request
module.exports.Response = runtime.Response
module.exports.ReadableStream = runtime.ReadableStream
module.exports.WritableStream = runtime.WritableStream
module.exports.TransformStream = runtime.TransformStream
module.exports.TextDecoder = runtime.TextDecoder
module.exports.TextEncoder = runtime.TextEncoder
module.exports.atob = runtime.atob
module.exports.btoa = runtime.btoa
module.exports.KeyValueStore = kv.KeyValueStore
function base64Encode(byteArray) {
    return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
        return String.fromCharCode(val);
    }).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname, search } = url

  if (pathname == "/") {
    return Response.redirect("https://milgradesec.github.io/paesadns/", 301)
  }

  if (! (request.method == "GET" || request.method == "POST") ) {
    return new Response(`Method ${request.method} not allowed.`, { status: 405 })
  }

  const newURL = `https://${DOH_ADDRESS}${pathname}${search}`

  const newRequest = new Request(newURL, {
    body: request.body,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect
  })

  //return await fetch(newRequest)

      // Fetch response from origin server.
  return await fetch(newRequest, {
        cf: {
            cacheTtl: 14400,
            //cacheEverything: true,
        },
    })

}
