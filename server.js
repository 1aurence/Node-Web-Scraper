const rp = require('request-promise');
const cheerio = require('cheerio');
const helmet = require('helmet');
const http = require('http');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var fs = require('fs');
server.timeout = 1000;

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on ${port}`));

const options = {
  uri: null,
  transform: function (body) {
    return cheerio.load(body);
  }
};

app.get('/', function async (req, res) {
  res.sendFile(__dirname + '/index.html');
  io.on('connection', function (socket) {

    socket.on('searchRequest', function (data) {
      options.uri = data.url;
      rp(options)

        .then(($) => {
          // searchResult = $('body').find(data.keyword)
          searchResult = $(`*:contains(${data.keyword})`)
          fs.writeFile('response.doc', searchResult.text(), (err) => {
            if (err) throw err
            console.log('response written')

            socket.emit('searchResult')
          })


        }).catch(err => socket.emit('err', err.message))
    });


  });
});

app.get('/download', (req, res) => {
  console.log('req made for download')
  let file = __dirname + '/response.doc'
  res.download(file)
})

app.get('/webview', (req, res) => {
  console.log('req made for html view')
  let file = __dirname + '/response.doc'
  try {
    res.sendFile(file)
  } catch (err) {
    res.write('Error')
  }
})