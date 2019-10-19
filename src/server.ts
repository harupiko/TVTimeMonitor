import * as http from 'http';
import Database from './database';

const database = new Database;

var server = http.createServer(async function (req, res) {
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
    <div style="font-size:180;text-align:center">{{hours}}時間{{minutes}}分</div>\
    </p>\
    </body>\
    </html>';

    await database.get().then((row) => {
        const { date, total } = row;
        console.log('date::::', date, total);
        const hours = Math.floor(total/60);
        const minutes = total%60;
        var newHtml = html.replace('\{\{hours\}\}', hours.toString()).replace('\{\{minutes\}\}', minutes.toString()).replace('\{\{date\}\}', date);
        res.writeHead(200);
        res.write(newHtml);
        res.end();
    });

});

server.listen(3000);