var http = require('http');
var fs = require('fs');
var path = require("path");
var util = require("util");
var value = 0;
var date;

var server = http.createServer(function(req, res) {
    fs.readFile(path.join("/tmp/current.dat"), 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        content = util.format(data).trim().split(/\r?\n/);
        //console.log(content);
        var values = content[content.length - 1].split(/,/);
        date = values[0].split(/\./)[0];
        value = values[3];
        console.log('values: ', values);
    });
    
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

    console.log('date::::', date, value);
    var newHtml = html.replace('\{\{myvar\}\}', value).replace('\{\{date\}\}', date);
    res.writeHead(200);
    res.write(newHtml);
    res.end();
});

server.listen(3000);