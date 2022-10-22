module.exports = {
    html: function (title, list, body, control) {
    return   `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/style.css">
        <script src="js/color.js"></script>
    </head>
    <body>
        <h1><a href="/?id=INDEX" target="_blank">WEB</a></h1>
        <input id="night_day" type="button" value="night" onclick="
        nightdayHandler(this);
        ">
        <div id="grid">
        ${list}
        ${control}
        <div id="article">
            ${body}
        </div>
    </div>
    </body>
    </html>
    `;
},

    list: function (filelist) {
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list+'</ul>';
    return list;
    }
};