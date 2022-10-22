var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    if(pathName == '/') {
      if(queryData.id == undefined) {      
        fs.readdir('./data', function(error, filelist) {
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        })
      } else {
        fs.readdir('./data', function(error, filelist) {
          var filteredId = path.parse(queryData.id).base;
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
              var title = queryData.id;
              var sanintizedTitle = sanitizeHtml(title);
              var sanitizedDescription = sanitizeHtml(description);
              var list = template.list(filelist);
              var html = template.html(title, list, `<h2>${sanintizedTitle}</h2>${sanitizedDescription}`, 
              `<a href="/create">create</a> 
              <a href="/update?id=${sanintizedTitle}">update</a> 
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanintizedTitle}">
                <input type="submit" value="delete">
              </form>`);
              response.writeHead(200);
              response.end(html);
            });
          });
        }
      } else if(pathName == '/create') {
        fs.readdir('./data', function(error, filelist) {
          var title = 'WEB - create';
          var list = template.list(filelist);
          var html = template.html(title, list, `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit" value="create">
                </p>
              </form>
            `, ``);
            response.writeHead(200);
            response.end(html);
        });
      } else if(pathName == '/create_process') {
        var body = '';
        request.on('data', function(data) {
          body = body + data;
        });
        request.on('end', function() {
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('success');
          })
        });
      } else if(pathName == '/update') {
        fs.readdir('./data', function(error, filelist) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
              var title = queryData.id;
              var list = template.list(filelist);
              var template = template.html(title, list, 
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                      <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                  <p>
                    <input type="submit" value="update">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
              response.writeHead(200);
              response.end(template);
            });
          });
      } else if(pathName == '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error){
              fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
              })
            });
        });
      } else if(pathName == '/delete_process') {
          var body = '';
          request.on('data', function(data) {
              body = body + data;
          });
          request.on('end', function() {
              var post = qs.parse(body);
              var id = post.id;
              var filteredId = path.parse(id).base;
              fs.unlink(`data/${filteredId}`, function(error) {
                response.writeHead(302, {Location: `/`});
                response.end();
              })
          });
      } else {
        response.writeHead(404);
        response.end('Not found');
      }
    });
app.listen(3000);