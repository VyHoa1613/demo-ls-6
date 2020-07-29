var express = require('express')
var app = express()
var port = 3000
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var shortid = require('shortid')

var adapter = new FileSync('db.json')
var db = low(adapter)

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

db.defaults( {todoList: [] })
  .write()

app.get("/todoList",(req, res) => {
    res.render("users", {
        todos:db.get("todoList").value()
    })
})

app.get("/todoList/create",(req, res) => {
    res.render("create")
})


app.get("/todoList/:id",(req, res) => {
    var id = req.params.id;
    var getUser = db.get('todoList').find({id:id}).value();
    res.render('view',{
      newTodo:getUser
    })
   })

app.get("/todoList/:id/delete",(req, res) => {
    var todos = db.get("todoList").value();
    var id = req.params.id;
    db.get("todoList").remove({id:id}).write();
    res.redirect("/todoList")
})   


   app.get("/todoList/search", (req, res) => {
    var q = req.query.q;
    var match = todoList.filter(function(newTodo){
       return newTodo.name.toLowerCase().indexOf(q.toLowerCase()) !==-1;
  });
    res.render('search',{
      todoList:match
    });
    })

app.post("/todoList/create", (req, res) => {
    req.body.id = shortid.generate();
    db.get("todoList").push(req.body).write();
    res.redirect("/todoList");
})

app.listen(port, () => console.log('local host is conecting'+ port));