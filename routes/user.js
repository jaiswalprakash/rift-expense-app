const express = require('express');
const router = express.Router(); 
const constant = require('../utils/constants');
const API_URL = require('../utils/query');
var nodemailer = require('nodemailer');



module.exports = router;
var Transport = nodemailer.createTransport('SMTP',{
    
    auth: {
        user: "riftsettler@gmail.com",
        pass: "1ve17cs082"
    }
  });
  
///----------------signup--------------------------//
router.post('/signUp', function(req,res){
    try{
        //console.log(req.body);
        req.getConnection(function(err,conn){
            conn.query(API_URL.getQuery(['*'],"user","email="+"'"+req.body.email+"'" ),function(error, result){
                if(error)
                {
                    res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    
                }
              // console.log(result);
                var userId=('US'+Math.floor( Math.random() * 1000))
                if(result.length > 0)
                {
                        res.status( constant.HTML_STATUS_CODE.SUCCESS).json("data already exit");
                }
                else{
                        conn.query(API_URL.postQuery("user",["'"+req.body.name+"'","'"+userId+"'","'"+req.body.email+"'","'"+req.body.phone+"'","'"+req.body.otp+"'","'"+req.body.password+"'"] ),function(error, result){
                            
                            if(error){
                                res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                
                            }
                            else{
                               
                                res.send({'message':'data stored success'});
                                 console.log("posted sucessfully");
                                // console.log(result);
                            }
                    });
                 }

                });
         });// getCOnnection close
        }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
    
});

//----------------login--------------------------//

router.post('/login', function(req,res){
    try{

        req.getConnection(function(err,conn){
            conn.query(API_URL.getQuery(['*'],"user","email="+"'"+req.body.email+"'" ),function(error, result){
               
                if(error)
                {
                    res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    
                }
                
                if (result.length == 0)
                {
                        res.jsonp({status:"NOTEXIST",message:"account doesn't exit please signUp "});
                }
                else
                {
                     if(req.body.password == result[0].password)
                        {
                            delete result[0].password;
                            
                            res.jsonp({status:"SUCCESS",message:"Login Success ", data: result[0]});

            
                        }
                       
                        else 
                        {
                            res.jsonp({status:"WRONGPASS",message:"Please check your password"});

                        }
                    }
                   
                    
                
                });
         });// getConnection close
        }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
    
});

//------------------***forget**---------------------//

router.post('/forget', function(req,res){
    try{
        req.getConnection(function(err,conn){
            conn.query(API_URL.getQuery(['*'],"user","email="+"'"+req.body.email+"'" ),function(error, result){
                if(error)
                {
                    res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    
                }
                let otp = Math.floor(Math.random() * 1000000);
                //console.log(otp);
                 conn.query(API_URL.updateQuery("user","otp","'"+otp+"'","'"+req.body.email+"'" ),function(error, reslt){
                            if(error){
                                res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                
                            }
                            else{
                               
                               
                                 console.log("otp update");
                            }
                    });
               
                if(result.length == 0)
                {
                 res.status( constant.HTML_STATUS_CODE.SUCCESS).json("enter valid email ");
                }
                
                else{
                    var mailOptions={
                        
                        from:'riftsettler@gmail.com',
                        to : req.body.email,
                        subject:'otp',
                        text : otp,
                        html:`<br><p style="color:blue;">This is the otp for the forgot password. <br>Please enter the otp <h1 style="color:orange;">${otp}</h1> </p>`
                     };
                    setTimeout(function(){
                        Transport.sendMail(mailOptions, function(error, response){

                            if(error){
                            console.log(error);
                            res.end("error");
                            }else{
                            console.log("Message sent: " + response.message);
                            }
                            });
                    })
                   
                     

                }
                });
         });// getCOnnection close
        }
  
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
  
});

//------------------***update password**---------------------//
router.post('/update', function(req,res){
    try{
        req.getConnection(function(err,conn){
            conn.query(API_URL.getQuery(['*'],"user","otp="+"'"+req.body.otp+"'" ),function(error, result){
                console.log(result);
          
                if (result.length == 0)
                {
                        res.status( constant.HTML_STATUS_CODE.SUCCESS).json(" wrong otp ");
                }
                else
                {
                     if(req.body.otp == result[0].otp)
                        {
                            conn.query(API_URL.updateQuery("user","password","'"+req.body.newPassword+"'","'"+result[0].email+"'" ),function(error, result){
                                if(error){
                                    res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
                    
                                }
                                else{
                                     console.log("password changed");
                                     res.end("password changed"); 
                                }
                        });
                        }
                        else 
                        {
                            res.status( constant.HTML_STATUS_CODE.SUCCESS).json(" wrong password");

                        }
                    }
             
                });
         });// getConnection close
        }
    catch(error){
        res.status(error.status || constant.HTML_STATUS_CODE.INTERNAL_ERROR).json(error);
    }
    
});
