var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');
user = 'ram';
passwd = 'ranga';


try {
    credentialsFile = fs.readFileSync('credentails.json')
    credentails = JSON.parse(credentialsFile.toString())
} catch (e) {
    console.log(e);
    credentails = {}
}

user = credentails['user'] || user
passwd = credentails['password'] || passwd


function failrequest(req, res) {
    res.writeHead(401);
    res.write("None Shall Pass");
}
var proxy = httpProxy.createProxy();

var proxyServer = http.createServer(function(req, res) {

    match = (req.headers.authorization || '').match(/Basic\s+(\S+)/);
    if (match == null) {
        failrequest(req, res)
    } else {
        auth_str = Buffer.from(match[1] || '', 'base64').toString()
        credentails = auth_str.split(':')
        if (credentails.length < 2 ||
            !(credentails[0] == user &&
                credentails[1] == passwd)) {
            failrequest(req, res)
        } else {
            proxy.web(req, res, {
                target: 'http://selenium:4444'
            });
        }

    }

}).listen('8000');