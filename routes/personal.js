const express = require('express');
const router = express.Router(); 
const constant = require('../utils/constants');
const API_URL = require('../utils/query');
var nodemailer = require('nodemailer');

// UPDATE personal set status=1

module.exports = router;
var Transport = nodemailer.createTransport('SMTP',{
    
    auth: {
        user: "riftsettler@gmail.com",
        pass: "1ve17cs082"
    }
  });


//------------------***addddddd--------------------//
router.post('/add', function(req,res){
    var today = new Date();
    var expId=Math.floor(Math.random() * 1000000);
 //console.log(today)
    try{
        req.getConnection(function(err,conn){
            
                        conn.query(API_URL.postQuery("personal",["'"+req.body.userId+"'","'"+today+"'","'"+req.body.description+"'","'"+req.body.amount+"'",true,"'"+expId+"'"] ),function(error, result){
                            console.log(result);
                            if(error){
                                
                                console.log(error);
                
                            }
                            else{
                                
                                res.status(constant.HTML_STATUS_CODE.SUCCESS).json('Data Stored Successfully');
                                console.log("posted sucessfully");
                            }
                    });
                 }); 
                }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
});


//------------------***GET--------------------//
router.get('/getPersonalExp/:userId', function(req,res){
   
    try{
        req.getConnection(function(err,conn){
            
            conn.query(`SELECT * FROM PERSONAL WHERE userId='${req.params.userId}' AND status=1`,function(error, result){
                            //console.log(result);
                            if(error){
                                res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                                console.log(error);
                
                            }
                            else{
                                res.jsonp({status:"sent",message:" data sent ",data:result});
                                
                            }
                    });
                 }); 
                }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
});


//------------------settleUp--------------------//
router.get('/settleUp/:userId', function(req,res){
   
    try{
        req.getConnection(function(err,conn){
            //console.log(req.body.description)
            conn.query(`UPDATE personal set status=0` ,function(error, result){
                            //console.log(result[0]);
                            if(error){
                                res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                                console.log(error);
                
                            }
                            else{
                                res.jsonp({status:"sent",message:" data sent ",data:result});
                                
                            }
                    });
                 }); 
                }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
});

//------------------deletePExp--------------------//
router.get('/deletePExp/:expId', function(req,res){
   
    try{
        req.getConnection(function(err,conn){
           // console.log(req.body.description)
            conn.query(`delete from personal where expId='${req.params.expId}'` ,function(error, result){
                            //console.log(result[0]);
                            if(error){
                                res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                                console.log(error);
                
                            }
                            else{
                                res.jsonp({status:"delete",message:" expDelete ",data:result});
                                
                            }
                    });
                 }); 
                }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
});
//------------------sendMail--------------------//
router.post('/sendMail', function(req,res){
   
    try{
        req.getConnection(function(err,conn){
        var mailOptions={
                        
            from:'riftsettler@gmail.com',
            to : req.body.email,
            subject:'total expenses',
            text : expenses,
            html:`<br><p style="color:blue;">This is your last time expenses. <br> <h1 style="color:orange;">${req.body.amount}</h1> </p>`
         };
         setTimeout(function(){
            Transport.sendMail(mailOptions, function(error, response){

                if(error){
                console.log(error);
                res.end("error");
                }else{
                console.log("Message sent: " + response.message);
                }
                })
        })
    })
    }
         catch(error){
            res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
        }


    });

