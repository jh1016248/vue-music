var express = require('express')
var bodyParser = require('body-parser')
var session = require("express-session")
var request = require("request")
var multiparty = require('multiparty') //上传中间件
var fs = require("fs")

//数据
var User = require("../dbo/user")
var Music = require("../dbo/music")
var Counters = require("../dbo/counters")

var jsonParser = bodyParser.json()
var app = express();
app.use(session({
    secret: 'hello music',
    cookie: { maxAge: 60 * 1000 * 1000 }
}))

//api
//user
app.post("/register", jsonParser, function(req, res) {
    var body = req.body;
    User.find({ "userName": body.userName }, function(err, doc) {
        if (!err) {
            if (doc.length > 0) {
                res.status(200)
                res.json({ "ret": "0" })
            } else {
                getLastCount("userId", function(ind) {
                    ind = ind + 1;
                    var user = new User({
                        "userId": ind,
                        "userName": body.userName,
                        "password": body.password,
                        "nickName": body.userName,
                        "pic": "http://k2.jsqq.net/uploads/allimg/1705/7_170524143440_5.jpg"
                    })
                    User.create(user, function(err, docs) {
                        setLastCount("userId", ind, function() {
                            req.session.sign = true;
                            req.session.userName = body.userName;
                            res.status(200);
                            res.json({ "ret": "1" })
                        });
                    })
                })
            }
        }
    })
})

app.post("/login", jsonParser, function(req, res) {
    var body = req.body;
    var jsonStr = {};
    User.find({ "userName": body.userName, "password": body.password }, function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            if (docs.length > 0) {
                req.session.sign = true;
                req.session.userName = docs[0].userName;
                jsonStr = {
                    ret: 1,
                    userName: docs[0].userName,
                    nickName: docs[0].nickName,
                    pic: docs[0].pic
                }
            } else {
                jsonStr = {
                    ret: 0
                }
            }
            res.status(200)
            res.json(jsonStr)
        }
    })
})

app.get("/loginout", function(req, res) {
    delete req.session.user;
    res.json({ ret: 1 })
})

app.get("/getInfo", function(req, res) {
    var ss = req.session;
    if (ss.sign == undefined) {
        res.status(200)
        res.json({ ret: 0 })
    } else {
        User.find({ "userName": ss.userName }, function(err, doc) {
            if (err) {
                console.log(err)
            } else {
                var jsonStr = {
                    ret: 1,
                    userName: doc[0].userName,
                    nickName: doc[0].nickName,
                    pic: doc[0].pic
                }
                res.status(200)
                res.json(jsonStr)
            }
        })
    }
})

app.post("/upload", function(req, res) {
    var form = new multiparty.Form({ uploadDir: './static/user-pic/' });
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
            res.json({ ret: '0' });
        } else {
            console.log(files.file[0].headers)
            console.log(fields)
            var uploadedPath = files.file[0].path;
            var dstPath = 'static/user-pic/' + fields.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if (err) {
                    console.log('rename error: ' + err);
                    res.json({ ret: '0' });
                } else {
                    console.log(req.session.userName);
                    var userName = req.session.userName;
                    User.update({ userName: userName }, { pic: dstPath }, function() {
                        res.json({ ret: '1' });
                    })
                }
            });
        }
    })
})

app.post('/userUpdateInfo', jsonParser, function(req, res) {
    var body = req.body;
    var tag = body.tag;
    var value = body.value;
    User.find({ tag: value }, function(err, doc) {
        if (!err) {
            if (doc.length > 0) {
                res.json({ ret: '2' })
            } else {
                User.update({ userName: req.session.userName }, { tag: value }, function(err, doc) {
                    if (!err) {
                        res.json({ ret: "1" })
                    } else {
                        res.json({ ret: "0" })
                    }
                })
            }
        }
    })
})

app.get('/getNormMusic', function(req, res) {
    Music.find({}).limit(10).exec(function(err, doc) {
        console.log(doc)
        res.json({ "music": doc })
    })
})

function getLastCount(tag, callback) {
    Counters.find({ "tag": tag }, function(err, doc) {
        if (!err) {
            callback(doc[0].value)
        }
    })
}

function setLastCount(tag, ind, callback) {
    Counters.update({ "tag": tag }, { "value": ind }, function(err, doc) {
        if (!err) {
            if (callback) {
                callback();
            }
        }
    })
}


//获取音乐
//getMusicList("324688344");
//getMusicUrl(0);

//获取音乐列表
function getMusicList(id) {
    request('http://localhost:3000/playlist/detail?id=' + id, function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var data = JSON.parse(body).playlist.tracks;
            var list = [];
            getLastCount("musicId", function(ind) {
                for (var i = 0; i < data.length; i++) {
                    ind++;
                    var item = data[i];
                    var singer = item.ar[0].name;
                    list.push({
                        id: ind,
                        musicId: item.id,
                        name: item.al.name,
                        picUrl: item.al.picUrl,
                        singer: singer,
                    })
                }
                Music.create(list, function(err, docs) {
                    if (!err) {
                        console.log(docs)
                        setLastCount("musicId", ind);
                    }
                })
            })
        }
    })
}

//获取音乐url
function getMusicUrl(start) {
    Music.find({}).limit(10).skip(start).exec(function(err, doc) {
        var str = '';
        var list = [];
        if (doc.length == 0) {
            console.log("ok")
            return
        }
        console.log("---" + start)
        for (var i = 0; i < doc.length; i++) {
            str += doc[i].musicId + ',';
        }
        str = str.slice(0, str.length - 1);
        request("http://localhost:3000/music/url?id=" + str, function(err, res, body) {
            if (!err && res.statusCode == 200) {
                var data = JSON.parse(body).data
                for (var i = 0; i < data.length; i++) {
                    list.push({
                        "id": data[i].id,
                        "url": data[i].url
                    })
                }
                MusicUrl.create(list, function(err, docs) {
                    if (!err) {
                        //getMusicUrl(start+10)
                    }
                })
            }
        })
    })
}

module.exports = app;