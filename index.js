function base64Encode(byteArray) {
  return btoa(Array.from(new Uint8Array(byteArray)).map(val => {
      return String.fromCharCode(val);
  }).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

async function setRealIP(request) 
{
  var ip=""
  // Get the X-Forwarded-For header if it exists
  ip = request.headers.get("X-Forwarded-For")
  if (!ip) {
     //console.log("X-Forwarded-For was null")
     ip = request.headers.get("Cf-Connecting-Ip")
     //console.log("Getting IP from CF-Connecting-IP:"+ip)
  }
  
  // Add Real IP to header
  request = new Request(request)
  request.headers.set('True-Client-IP', ip)
  
  return request
}

addEventListener('fetch', event => {
event.respondWith(handleRequest(event.request))
})
  
async function handleRequest(request) {
const url = new URL(request.url)
request = await setRealIP(request)
const { pathname, search } = url

if (pathname == "/") {
  return Response.redirect("https://milgradesec.github.io/paesadns/", 301)
}
//console.log("method");console.log(request.method)

var ok="false"
if (  request.method == "GET" )  { ok="true" }
if (  request.method == "POST" ) { ok="true" }
//console.log("ok");console.log(ok)

if (ok == "false") {
  return new Response(`Method ${request.method} not allowed. (CF)`, { status: 405 }) }





const newURL = `https://${DOH_ADDRESS}${pathname}${search}`

if ( pathname == "/dns-query") {   newURL = `https://${ALT_DOH_ADDRESS_JSON}${pathname}${search}`  }
if ( pathname == "/resolve")   {   newURL = `https://${ALT_DOH_ADDRESS}${pathname}${search}`       }

const newRequest = new Request(newURL, {
  body: request.body,
  headers: request.headers,
  method: request.method,
  redirect: request.redirect
})
//transfer post param to body
if (  request.method == "POST" )  { 


////  let body = await request.text()
////  let formData = new URLSearchParams(body)
////  let newRequest  =  new Request(newURL, {
//////    body: body,
//////    headers: request.headers,
////    method: "GET",
//////       redirect: request.redirect
////  })

  let body = await request.text()
  let formData = new URLSearchParams(body)
  
  const params = {}
  const queryString = body.split('=')
  queryString.forEach(item => {
  const kv = item.split('=')
  if (kv[0]) params[kv[0]] = kv[1] || true
  })
  var query = JSON.stringify(params);
  //newURL = `https://${ALT_DOH_ADDRESS}${pathname}${query}` 
  console.log(newURL)
  let newRequest  =  new Request(newURL, {
        headers: request.headers,
        method: "GET"
    })


    newRequest.headers.delete("Content-Length")
    newRequest.headers.delete("content-length")
    

} // end post
//return await fetch(newRequest)

    // Fetch response from origin server.
return await fetch(newRequest, {
      cf: {
          cacheTtl: 14400,
          //cacheEverything: true,
      },
  })

}