import * as http from 'http';
import Database from './database';

const database = new Database;

var server = http.createServer(async function(req, res) {
    var html = '\
    <html>\
    <head>\
        <meta http-equiv="refresh" content="60"/>\
        <meta charset="utf-8"/>\
    </head>\
    <body>\
    <p>\
    last modified: {{date}}\
    </p>\
    <p style="text-align:center">\
    <font size=7>今日のテレビ視聴時間は</font><br>\
    <div style="font-size:180;text-align:center">{{myvar}}分</div>\
    </p>\
    </body>\
    </html>';

    await database.get().then((row) => {
        const { date, total } = row;
        console.log('date::::', date, total);
        var newHtml = html.replace('\{\{myvar\}\}', total.toString()).replace('\{\{date\}\}', date);
        res.writeHead(200);
        res.write(newHtml);
        res.end();
    });

});

server.listen(3000);