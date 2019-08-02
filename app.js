const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.close();
const ColorMap = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};
var actualLog = console.log;
console.log = (message) => actualLog(message + ColorMap.Reset);
const ServersToCheck = [

];

const Settings = {
    "90dns": true
};

function compare(ip1, ip2) {
    
}

const Expected90DNS = "95.216.149.205";

function fatal(msg) {
    console.log(ColorMap.BgRed + ColorMap.FgWhite + "FATAL: " + msg);
}

function validateIPv4(server) {
    if (server == null) {
        fatal("Null DNS server");
        return false;
    }
    if (server.length == 0) {
        fatal("Invalid DNS server");
        return false;
    }
    var splitted;
    if ((splitted = server.split(".")).length != 4) {
        fatal("Specified DNS Server is not a IPv4 Address (IPv6 is not supported)");
        return false;
    }
    for (var index in splitted) {
        var str = splitted[index];
        var lengthOfStr = str.length;
        if (str.includes(":"))
            // lmao too lazy to add checks for ports
            continue;
        if (lengthOfStr > 4 || lengthOfStr < 1) {
            fatal("Specified DNS Server is not a valid IPv4 Address");
            return false;
        }
    }
    return true;
}


/**
 * Runs checks
 * @param {string} server DNS Server to check
 */
function dnsCheck(server) {
    if (!validateIPv4(server))
        return;
    const dns = require('dns');
    dns.setServers([server, server]);
    console.log(ColorMap.FgWhite + "Using DNS Server: " + ColorMap.FgCyan + server);
    if (Settings["90dns"]) {
        dns.resolve("90dns.test", function (err, address) {
            if(Array.isArray(address))
                address = address[0];
            if (err == null && address == Expected90DNS)
                console.log(ColorMap.FgMagenta + "90dns.test" + ColorMap.FgGreen + " => " + ColorMap.FgGreen + Expected90DNS);
            else {
                if (err != null)
                    fatal("Failed to resolve 90dns.test");
                else
                    fatal("90dns.test => " + address + " instead of " + Expected90DNS);
                process.exit();
            }
        });
    }
    for (var key in Object.keys(ServersToCheck)) {
        var value = ServersToCheck[key];
        if (value == ServersToCheck.Localhost) {

            continue;
        }

    }
}
// 163.172.141.219
dnsCheck("127.0.0.1:53");