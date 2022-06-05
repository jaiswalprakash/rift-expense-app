function signUp(){
    var name=$("#name").val();
    var email=$("#email").val();
    var phone=$("#phone").val();
    var password=$("#pwd").val();
    
    
    var signUp={
                name:name,
                email:email,
                password:password,
                phone:phone
      }
      console.log(JSON.stringify(signUp));
      if (name==null || name==""||password==null || password==""||email==null || email==""||phone==null || phone=="" ){  
        alert("FILL ALL THE attributes");  
        return false;  
      }
      else{
      $.post("/user/signup",
      signUp,
     function(data, status){
     alert("Data: " + data + "\nStatus: " + status);
     window.location.href = 'index.html';
      });
      }
    }


   


