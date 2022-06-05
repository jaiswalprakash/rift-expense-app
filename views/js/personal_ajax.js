$(document).ready(function(){
    getExpense();
    $("#userId").text(getLoggedInData().userId);
    $("#userName").text(" HELLO ! :- "+getLoggedInData().name);// set in paragraph
})

function getExpense(){
    $.get("/personal/getPersonalExp/"+getLoggedInData().userId,
      function(data, status){
     $('#tbodyyy').html('');//clear 
      let arrayData =  data.data;
      var amount=0;
      for(let i =0;i<arrayData.length;i++){
        let apiDate = new Date(arrayData[i].date);
         let finalDate = apiDate.getFullYear() +'-'+ (apiDate.getMonth()+1) +'-'+ apiDate.getDate();
        // let finalDate = apiDate.getDate() +'-'+ (apiDate.getMonth()+1) +'-'+ apiDate.getFullYear();
        let  arr = ` <tr> 
                     <td>${finalDate}</td>
                     <td>${arrayData[i].description}</td>
                     <td>${arrayData[i].amount}</td>
                     <td>${ `<button type="button" class="btn btn-danger btn-sm"  onclick="deletePExp('${arrayData[i].expId}')" ><i class="far fa-trash-alt"></i></button>`}</td>
                    
                     </tr>`
      amount=amount+arrayData[i].amount;

      $('#tbodyyy').append(arr);
      }
      $("#totalAmount").text(amount);
      localStorage.setItem('TotalExp',amount);
       });
      

}
function sendMail()
{
  var sendMail={ 

    email:getLoggedInData().email,
   amount:window.localStorage.getItem('TotalExp') 

      }

console.log(sendMail);

$.post("/personal/sendMail",
sendMail,
function(data, status){

})
}

function settleUpCall(){
  sendMail();
  settleUp();

}



function deletePExp(expId)
{
  localStorage.setItem('expId',expId);
  $.get("/personal/deletePExp/"+window.localStorage.getItem('expId'),
  function(data, status){
    getExpense();
  })


}

////////// personal add expenses//////


function addPersonalExpense(){
   
    var description=$("#item").val();
    var amount=$("#amount").val();
    
    var addPersonalExpense={
                
        description:description,
        amount:amount,
        userId:getLoggedInData().userId
              
      }
      // console.log(JSON.stringify(add));
      if (description==null || description==""||amount==null || amount=="" ){  
        alert("Enter Description and Amount");  
        return false;  
      }
   else{
      $.post("/personal/add",
      addPersonalExpense,
        function(data, status){
          //alert("Data: " + data + "\nStatus: " + status);
            $("#item").val('');
            $("#amount").val('');
            $('#myModal').modal('hide');
        getExpense();
         });
         }
        }
  /* -----------------settleUp-----------------------*/
  function settleUp(){
    $.get("/personal/settleUp/"+getLoggedInData().userId,
      function(data, status){
       // alert("SETTLED_UP");
        $('#settleUp').modal('hide');
        //$("settleUp").text(amount);
        getExpense();
      })
    }

 
    function sendMail()
{
  var sendMail={ 

    email:getLoggedInData().email,
   amount:window.localStorage.getItem('TotalExp') 

      }

console.log(sendMail);

$.post("/personal/sendMail",
sendMail,
function(data, status){

})
}

function settleUpCall(){
  sendMail();
  settleUp();

}