var express=require('express');
var session = require('express-session');
var app=express();
var mysql=require('mysql');
var bodyParser=require('body-parser');
var config = {
	user: 'root',
	password: 'root',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
    database: 'nodeDB'
};
app.use(session({secret: 'superdupersecret', saveUninitialized: true, resave: true}));
app.use( bodyParser.json() );
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname+"/public"));
//app.use(express.static(__dirname + '/JS'));
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'nodeDB'
});
var sessionVar;
var bookCount = 0;
connection.connect();
app.get('/', function(req, res) {
  //res.send('Hello Seattle\n');
  res.render('index.html');
  
});
app.get('/data',function(req,res){
	sessionVar=req.session;
	sessionVar.name = "Aditi";
	var userName = {"name" : sessionVar.name };
	connection.query('SELECT * from articles',function(err, rows, fields) {
		if (err) {
			console.error(err);
		}
		var data=[];
		for(i=0;i<rows.length;i++)
		{
			data.push(rows[i].author);
			console.log(rows[i].author);
		}
		data.push(userName);
		res.send(JSON.stringify(data));
	});
});
app.post('/insertion', function(req,res){
	console.log(req.body);
	//sessionVar.count = bookCount + 1;
	var article = {
		author: req.body.author,
		title: req.body.title,
		body: req.body.body
	};
	var query = connection.query('insert into articles set ?', article, function (err, result) {
		if (err) {
			console.error(err);
			return;
		}
		res.send("vuhoo inserted successfully");
	});
});
app.post('/getOtherBooks', function(req, res){
	console.log(req.body);
	var authorName = req.body.author;
	var query = connection.query('SELECT * from articles where author like "%' + authorName + '%"',function(err, rows, fields){
		if (err) {
			console.error(err);
		}
		var data=[];
		for(i=0;i<rows.length;i++)
		{
			var otherBooks = {
				'title' : rows[i].title,
				'genere' : rows[i].body
			};
			data.push(otherBooks);
		}
		res.send(JSON.stringify(data));
	});
});
app.listen(3001);
console.log('Listening on port 3001...');