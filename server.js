const rp = require('request-promise');
const cheerio = require('cheerio');
var app = require('express')();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);var fs = require('fs');

var port = process.env.port || 3000;
server.listen(port, () => console.log(`Server running on ${port}`));

var options = {
    uri: null,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    io.on('connection', function (socket) {

      socket.on('searchRequest', function (data) {
          options.uri = data.url;
          rp(options)

          .then(($) => {
           searchResult = $('body').find(data.keyword)
           fs.writeFile('response', searchResult.text(), (err) => {
               if(err) throw err
            console.log('response written')
           
             socket.emit('searchResult', searchResult)
            })
  
              
        }).catch(err =>socket.emit('err', err.message))
      });
    
    });
  });
  


  