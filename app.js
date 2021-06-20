var express=require("express");
var bodyParser=require("body-parser");
var bcrypt = require('bcryptjs');

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Employee_details",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() =>
{
console.log("connection is successful");
}).catch((e) => {
    console.log("No connection");
})

var db=mongoose.connection;

var app=express();
app.use(express.static(__dirname));


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));




app.post('/sign_up', function(req,res){
	console.log(req.body);
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	var cp= req.body.confirmpassword;
	var phone =req.body.phone;
	var gender = req.body.gender;
	var id=req.body._id;
   
	// to encrypt pasword using bcrypt. in this only encoding is present no decoding is present.
	var salt = bcrypt.genSaltSync(10);
    var hashpass = bcrypt.hashSync(pass, salt);
	var hashcpass = bcrypt.hashSync(cp, salt);

	var data = {
		"name": name,
		"email":email,
		"password":hashpass,
		"confirmpassword":hashcpass,
		"phone":phone,
		"gender":gender,
		"_id":id
	}
	db.collection('details').findOne({_id:id},function(err,result) {
		if(err) throw err;
		console.log(result);
		if(result)
		return res.redirect("invalid_id.html");
		else
	{
    if(cp===pass)
	{
		db.collection('details').insertOne(data,function(err, collection){
			if (err) throw err;
			console.log("Record inserted Successfully");		
		});
    }
	else
	return res.redirect('signup_unsuccess.html');
		
	return res.redirect('signup_success.html');
}
	})
})


app.get('/',function(req,res){
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('index.html');
})

app.get("/login",(req,res) => {
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('login.html');
})

app.post('/login',(req,res) => {

	var id=req.body._id;
	var password=req.body.password;

	var data={
		"_id":id
	}

	db.collection('details').findOne(data,function(err,result) {
		if(err) throw err;
		console.log(result);
		//console.log(result.password);       //agar result=null rahta hai toh uah result.password access nahi kar payega.
		//console.log(bcrypt.compareSync(password,result.password));
		if(result)
		{
		if(bcrypt.compareSync(password,result.password)==true)  // to check password with bcrypt password that is stored in maongodb database.
		return res.send(result);
		else
		return res.redirect("error.html");
		}
		return res.redirect("error.html");  // redirect is used for connecting error.html page .if simply want to print use res.send(error);
		
	})
})

app.listen(3000);

console.log("server listening at port 3000");


