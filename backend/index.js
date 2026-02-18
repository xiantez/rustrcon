var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// (Credentials are now entered by the user via the login page)

// Steam profile proxy - fetches player summary from Steam Web API
// Uses public XML profile as fallback (no API key needed)
app.get('/api/steam/:steamid', function(req, res) {
    var steamid = req.params.steamid;
    if (!/^\d{17}$/.test(steamid)) {
        return res.status(400).json({ error: 'Invalid SteamID' });
    }
    var https = require('https');
    var url = 'https://steamcommunity.com/profiles/' + steamid + '/?xml=1';
    https.get(url, function(resp) {
        var data = '';
        resp.on('data', function(chunk) { data += chunk; });
        resp.on('end', function() {
            try {
                var avatar = (data.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || [])[1] || '';
                var avatarMedium = (data.match(/<avatarMedium><!\[CDATA\[(.*?)\]\]><\/avatarMedium>/) || [])[1] || '';
                var personaName = (data.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/) || [])[1] || '';
                var realName = (data.match(/<realname><!\[CDATA\[(.*?)\]\]><\/realname>/) || [])[1] || '';
                var location = (data.match(/<location><!\[CDATA\[(.*?)\]\]><\/location>/) || [])[1] || '';
                var memberSince = (data.match(/<memberSince><!\[CDATA\[(.*?)\]\]><\/memberSince>/) || [])[1] || '';
                var vacBanned = (data.match(/<vacBanned>(\d+)<\/vacBanned>/) || [])[1] || '0';
                var onlineState = (data.match(/<onlineState><!\[CDATA\[(.*?)\]\]><\/onlineState>/) || [])[1] || (data.match(/<onlineState>(.*?)<\/onlineState>/) || [])[1] || '';
                var isPrivate = data.indexOf('<privacyMessage>') !== -1;
                res.json({
                    steamid: steamid,
                    personaName: personaName,
                    realName: realName,
                    avatarFull: avatar,
                    avatarMedium: avatarMedium,
                    location: location,
                    memberSince: memberSince,
                    vacBanned: vacBanned === '1',
                    onlineState: onlineState,
                    isPrivate: isPrivate
                });
            } catch(e) {
                res.json({ steamid: steamid, error: 'parse_error', isPrivate: true });
            }
        });
    }).on('error', function(e) {
        res.status(500).json({ error: 'Failed to fetch Steam profile' });
    });
});

var PORT = process.env.PORT || 3001;
var server = app.listen(PORT, function() {
    console.log("RCON Dashboard running on http://localhost:" + PORT);
});
server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.error('\n  ❌  Port ' + PORT + ' is already in use.');
        console.error('  💡  Either stop the other process or use a different port:');
        console.error('      PORT=3002 node index.js\n');
        process.exit(1);
    } else {
        throw err;
    }
});
