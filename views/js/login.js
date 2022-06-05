
    //----login----//
    $(document).ready(function() { 

      
      let userData = JSON.parse(localStorage.getItem('user'));
      if (userData){
        window.location.href='personal.html'
      }
   });

function logIn(){
   
    var email=$("#emailL").val();
    var password=$("#pwdL").val();
    
    var logIn={
                
                email:email,
                password:password
      }
     console.log(JSON.stringify(logIn));
     if (email==null || email==""||password==null || password=="" ){  
      alert("Enter email and password than login");  
      return false;  
    }
 else{
$.post("/user/login",
logIn,
  function(data, status){
    
    if(data.status == 'NOTEXIST'){
    alert(data.message);
    return;

    }else if (data.status == 'WRONGPASS'){
      alert(data.message);
    return;


    }else if(data.status == 'SUCCESS'){
     
      localStorage.setItem('user', JSON.stringify(data.data));
      window.location.href = 'personal.html';
    }else{
      alert(status);
      return;
    }
 

  });
    }
  }

    //----forgot password----//


    function forgotPassword(){
   
     var email=$("#emailF").val(); 
        var forgotPassword={
        email:email,
        }
        console.log(JSON.stringify(forgotPassword));
        if (email==null || email==""){  
          alert("Enter email");  
          return false;  
        }
     else{
     $.post("/user/forget",
         forgotPassword,
        function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
        $("#emailF").val('');
         $('#myModal').modal('hide');
         });
         }
        }
            
        
             //----reset password----//

    function resetPassword(){
     var newPassword=$("#nPwd").val();
     var otp=$("#otp").val();   
     var resetPassword={               
                  otp:otp,
                  newPassword:newPassword           
        }
     console.log(JSON.stringify(resetPassword));
     if (otp==null || otp==""||newPassword==null || newPassword=="" ){  
      alert("Enter otp and newPassword");  
      return false;  
    }
 else{
     $.post("/user/update",
     resetPassword,
      function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
      $("#nPwd").val('');
      $("#otp").val('');
         $('#myChange').modal('hide');
         $('#myModal').modal('hide');
     });
      }
    }
       