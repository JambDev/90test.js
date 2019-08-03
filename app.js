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
var DomainsToCheck = {
    "127.0.0.1": [
        // meganukebmp's Switch_90DNS_tester hostnames
        "nintendo.com",
        "nintendo.net",
        "nintendo.jp",
        "nintendo.co.jp",
        "nintendo.co.uk",
        "nintendo-europe.com",
        "nintendowifi.net",
        "nintendo.es",
        "nintendo.co.kr",
        "nintendo.tw",
        "nintendo.com.hk",
        "nintendo.com.au",
        "nintendo.co.nz",
        "nintendo.at",
        "nintendo.be",
        "nintendods.cz",
        "nintendo.dk",
        "nintendo.de",
        "nintendo.fi",
        "nintendo.fr",
        "nintendo.gr",
        "nintendo.hu",
        "nintendo.it",
        "nintendo.nl",
        "nintendo.no",
        "nintendo.pt",
        "nintendo.ru",
        "nintendo.co.za",
        "nintendo.se",
        "nintendo.ch",
        "potato.nintendo.com",
        
        // 90dnstester.py
        "sun.hac.lp1.d4c.nintendo.net",
    ],
    "95.216.149.205": ["90dns.test", "conntest.nintendowifi.net", "ctest.cdn.nintendo.net"]
};


function fatal(msg) {
    console.log(ColorMap.BgRed + ColorMap.FgYellow + "FATAL: " + msg);
}

// TODO: Add more checks if possible (perhaps check if there are only numbers and periods)
function isValidIPv4(server) {
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
 * @param {string} server Primary DNS Server
 * @param {string} server2 Secondary DNS Server
 */
function dnsCheck(server, server2) {
    if (!isValidIPv4(server) || !isValidIPv4(server2))
        return;
    const dns = require('dns');
    dns.setServers([server, server2]);
    console.log(ColorMap.FgWhite + "Using DNS Servers: " + ColorMap.FgCyan + server + ", " + server2);
    for (let target in DomainsToCheck) {
        var domains = DomainsToCheck[target];
        if (!Array.isArray(domains))
            domains = [domains];
        for (let index in domains) {
            let domainToCheck = domains[index];
            dns.resolve(domainToCheck, function (err, address) {
                if (Array.isArray(address))
                    address = address[0];
                if (err == null && address == target)
                    console.log(ColorMap.FgYellow + domainToCheck + ColorMap.FgGreen + " => " + ColorMap.FgGreen + target);
                else {
                    if (err != null)
                        fatal("Failed to resolve " + domainToCheck);
                    else
                        console.log(ColorMap.FgYellow + domainToCheck + " => " + ColorMap.FgRed + address);
                }
            }, domainToCheck);
        }
    }
}

dnsCheck("163.172.141.219", "45.248.48.62");