var fs = require('fs');
var express = require('express');
var app = express();
var randomization = require('shuffle-array');
var math=require('math');
var wri= fs.createWriteStream("out.txt");
const readline = require('readline');
const bodyparser=require('body-parser');
let MongoClient = require('mongodb').MongoClient;
app.use(bodyparser());
app.use(function (req, res, next) {
    let logfile = fs.createWriteStream("logfile.txt", { 'flags': 'a' });//Middleware function
    logfile.write("browser access" + new Date() + "\n");//creating logfile
    logfile.end();
    next();
})
app.get('/',function(req,res)
{
    res.sendFile('login.html',{root: './'});
    res.end('hi');
});
let url = 'mongodb://localhost/test';
app.post('/',function(req, response) {
    let filepath=req.body.Path;//taking data from browser
    let size=req.body.Size;//taking size of each team from browser
        var teamdata=[];
        var teamdata1=[];
        fs.readFile(filepath, function (err,data) {
            
         var parsed = JSON.parse(data);
        
        MongoClient.connect(url, function(err, db) {
            db.collection('members').insertMany(parsed, function(err, res) {
                if(err){throw err;}
            });
            db.collection('members').find({}).toArray(function(err,res){
            if (err) {
                res.send("unable to retreive members data from the database.");
            }
            teamdata=res;
            for(var x in teamdata)
            {
                teamdata1.push(parsed[x]);
            }
                console.log(teamdata1);
                randomization(teamdata1);
                
                if(size>teamdata1.length)
                {
                  console.log('team size exceeded');
                }
                else
                {
                  if(teamdata1.length%size==0)
                  {
                      console.log("teams can be divided into equal parts");
                  }
                  else{
                      console.log("teams cant be divided into equal parts but we can divide into un equal parts");
                  }
        }
        var noteams=math.floor(teamdata1.length/size);
        var lsize=math.floor(size/1);//for operations on variable n storing into other variable
        console.log("lsize"+lsize);
        console.log("noofteams"+noteams);
        var teamnumber=1;
        for(var i=0;i<noteams;i++)
        {
            wri.write("\n\n");
            wri.write("team"+teamnumber+":"+"\n\n");//this line  is for writing to the file
            teamnumber++;
            var k=math.floor(i*lsize);
            var m=math.floor(lsize+i*lsize);//for reducing time for program calculating outside of loop
            for(var j=k; j< m; j++)
            {
                wri.write(JSON.stringify(teamdata1[j])+"\n");//this line  is for writing to the file
            }      
        }
        if ( teamdata1.length%lsize!=0)
        {
        wri.write("\n\n");//this line  is for writing to the file
        wri.write("team"+teamnumber+":"+"\n\n");
        }
        
        for(;j<teamdata1.length;j++)
        {
            wri.write(JSON.stringify(teamdata1[j])+"\n");//this line  is for writing to the file
            //converting into string format
        }
        var readStream = fs.createReadStream("out.txt");
        readStream.pipe(response);//piping the data to the browser
        });
        db.close();
    });
});
});
    app.listen(7000);
        