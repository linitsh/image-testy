const express = require('express')
const app     = express()
const port    = 3000
const fs      = require('fs')
let index     = fs.readFileSync('./index.html', 'utf8')
/**
 * HOSTNAME:
 * {
    KUBERNETES_PORT: 'tcp://10.96.0.1:443',
    KUBERNETES_SERVICE_PORT: '443',
    NODE_VERSION: '22.9.0',
    HOSTNAME: 'dpl-testy-b9c9f4f54-w4mh4',
    SVC_NP_TESTY_SERVICE_HOST: '10.98.130.33',
    YARN_VERSION: '1.22.22',
    SVC_NP_TESTY_PORT_8090_TCP_ADDR: '10.98.130.33',
    SHLVL: '1',
    HOME: '/root',
    SVC_NP_TESTY_PORT_8090_TCP_PORT: '8090',
    SVC_NP_TESTY_PORT_8090_TCP_PROTO: 'tcp',
    SVC_NP_TESTY_SERVICE_PORT: '8090',
    SVC_NP_TESTY_PORT: 'tcp://10.98.130.33:8090',
    SVC_NP_TESTY_PORT_8090_TCP: 'tcp://10.98.130.33:8090',
    KUBERNETES_PORT_443_TCP_ADDR: '10.96.0.1',
    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    KUBERNETES_PORT_443_TCP_PORT: '443',
    KUBERNETES_PORT_443_TCP_PROTO: 'tcp',
    KUBERNETES_SERVICE_PORT_HTTPS: '443',
    KUBERNETES_PORT_443_TCP: 'tcp://10.96.0.1:443',
    KUBERNETES_SERVICE_HOST: '10.96.0.1',
    PWD: '/app',
    SVC_NP_TESTY_SERVICE_PORT_HTTP: '8090'
  }
*/
const replacer = {
  "{IMAGE}"       : `${'linitsh/testy'}`,
  "{VERSION}"     : `${'0.1.0'}`,
  "{POD}"         : `${process.env.HOSTNAME}`,
  "{DESCRIPTION}" : `${'null'}`,
  "{CODE}"        : `${JSON.stringify(process.env)}`,
}
for (const [key, value] of Object.entries(replacer)) {
  index = index.replace(key, value)
}

app.get('/', (req, res) => {
  console.log(process.env)
  res.setHeader("Content-Type", "text/html")
  res.send(index)
})

app.get('/healthcheck', (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.send("<style>*{color: limegreen; background: #272727;}</style>OK")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})