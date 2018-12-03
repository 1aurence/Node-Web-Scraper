const rp = require('request-promise');
const cheerio = require('cheerio');
const http = require('http');
const app = require('express')();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);var fs = require('fs');

const port = process.env.port || 3000;
server.listen(port, () => console.log(`Server running on ${port}`));

const options = {
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
           fs.writeFile('response.doc', searchResult.text(), (err) => {
               if(err) throw err
            console.log('response written')
           
             socket.emit('searchResult')
            })
  
              
        }).catch(err =>socket.emit('err', err.message))
      });
     
    
    });
  });
  app.get('/download', (req, res) => {
    console.log('req made')
    let file = __dirname + '/response.doc'
    res.download(file)
  })
  


  