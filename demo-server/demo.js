var path = require('path');
var http = require('http');
var url = require('url');
const util = require('util')
const fs = require('fs')

http.createServer((req,res) => {
  // res.statusCode = 200;
  // res.setHeader('Content-Type','text/plain; charset=utf-8');
  var pathname = url.parse(req.url).pathname;
  console.log(pathname)
  fs.readFile(pathname.substring(1),(err,data)=>{
    if(err){
      res.writeHead(404,{
        'Content-Type':'text/html'
      })
    }else{
      res.writeHead(200,{
        'Content-Type':'text/html'
      })
    }
    console.log(data)
    res.write(data.toString())
    res.end()
  })
  // res.end(util.inspect(url.parse(req.url)))
}).listen(3000,()=>{
  console.log('服务器已经连接')
})
