
$(document).ready(function(){
  getTotalExpense();
  settleDetail();
  totalMyExpenses();
  $("#group").text(window.localStorage.getItem('groupId'));
  $("#userName").text(" HELLO ! :- "+getLoggedInData().name);// set in paragraph

})

function getTotalExpense(){
  
  $.get("/addGroup/getGroupExp/"+window.localStorage.getItem('groupId'),
    function(data, status){
   $('#ttbody').html('');//clear 
    let arrayData =  data.data;
    var amount=0;
    for(let i =0;i<arrayData.length;i++){
      let apiDate = new Date(arrayData[i].date);
      let finalDate = apiDate.getFullYear() +'-'+ (apiDate.getMonth()+1) +'-'+ apiDate.getDate();
      let  arr = ` <tr> 
      <td>${finalDate}</td>
      <td>${arrayData[i].name}</td>
      <td>${arrayData[i].description}</td>
      <td>${arrayData[i].amount}</td>
      <td>${ `<button type="button" class="btn btn-danger btn-sm"  onclick="deletePExp('${arrayData[i].expId}')" ><i class="far fa-trash-alt"></i></button>`}</td>
      </tr>`
    amount=amount+arrayData[i].amount;
      $('#ttbody').append(arr);
    }
    $("#totalAmount").text(amount);
     });
}

function deletePExp(expId)
{
  localStorage.setItem('expId',expId);
  $.get("/addGroup/deletePExp/"+window.localStorage.getItem('expId'),
  function(data, status){
    getTotalExpense();
    totalMyExpenses();
  })


}
/*---------------------------total my expenses---------------*/

function totalMyExpenses(){

  var totalMyExpenses={ 

               userId:getLoggedInData().userId,
              groupId:window.localStorage.getItem('groupId') 

  }

  console.log(totalMyExpenses);
  
  $.post("/addGroup/totalMyExpenses/",
  totalMyExpenses,
  function(data, status){
    let arrayData =  data.data;
    var amount=0;
    for(let i =0;i<arrayData.length;i++){
      amount=amount+arrayData[i].amount;
    }
    $("#totalMyExpenses").text(amount);
  });
}




///-----addExpenses---------////



function add(){
   
    var description=$("#item").val();
    var amount=$("#amount").val();
    
    var add={
                
        description:description,
        amount:amount,
        userId:getLoggedInData().userId,
        name:getLoggedInData().name,
        groupId:window.localStorage.getItem('groupId')
              
      }
      console.log(JSON.stringify(add));
      if (description==null || description==""||amount==null || amount=="" ){  
        alert("enter description and amount ");  
        return false;  
      }
      else{
      $.post("addGroup/addExpences",
      add,
     function(data, status){
     //alert("Data: " + data + "\nStatus: " + status);
     $("#item").val('');
      $("#amount").val(''); 
         $('#myModal').modal('hide');
         getTotalExpense();
         totalMyExpenses();
      });
      }
    } 
 
    ///------invite member---------////

function inviteMem(){

        var email=$("#emailI").val();
        var inviteMem={      
            email:email,
            groupId:window.localStorage.getItem('groupId'),
            groupName:window.localStorage.getItem('groupName')
          }
          console.log(JSON.stringify(inviteMem));
          if (email==null || email==""){  
            alert("Enter email");  
            return false;  
          }
          else{

       $.post("addGroup/invite",
       inviteMem,
      function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
      $("#emailI").val('');
      
         $('#myMember').modal('hide');
       });
       }
      }

 ///------------------------------delete--------------------------////    
function deleteGroup(){
  $.get("/addGroup/delete/"+window.localStorage.getItem('groupId'),
  function(data, status){
    $('#delete').modal('hide');
    
     window.location.href = 'group_list.html';

  })
}

function settleDetail()
{
  $('#settleHistory').html('');
$.get("addGroup/settleDetail/"+window.localStorage.getItem('groupId'),
function(data, status)
{
 let arrayData =  data.data;
 for(let i =arrayData.length-1;i>=0;i--){
let apiDate = new Date(arrayData[0].date);
let finalDate = apiDate.getFullYear() +'-'+ (apiDate.getMonth()+1) +'-'+ apiDate.getDate();
let  arr = `   <div class="col-sm-12" )">
 <div class="alert alert-warning well1" >
 <h3>Settled Date:</h3><h3> ${finalDate}</h3>
 <br>
 <span>GROUPId:${arrayData[i].groupId}</span>
 <br>
 <span>TotalExpenses:</span><span>${arrayData[i].totalExp}</span>
 <br>
 <table class="table table-hover table-responsive">
    <thead>
      <tr>
        <th>UserName</th>
        <th>Expense</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody id="userAppend${i}"> 
         
    </tbody>
  </table>
 
  
 
 </div>
 </div>`

$('#settleHistory').append(arr);
 }
 for(let i =arrayData.length-1;i>=0;i--){
let userDetail = JSON.parse(arrayData[i].userDetail);
for(let j=0; j<userDetail.length;j++){
 let tableData =`<tr><td>${userDetail[j].userId}</td>
  <td>${userDetail[j].expense}</td>
  <td>${userDetail[j].balance}</td></tr>`
  $('#userAppend'+i).append(tableData);
} 
} 
})
}


///----------------------settleUp-------------------------------////    

function settleUp()
{
 
  $.get("/addGroup/getGroupExp/"+window.localStorage.getItem('groupId'),
  function(data, status){
      var finalObj = {
      date:new Date(),
      groupId:window.localStorage.getItem('groupId')
    };
    var arrayData =  data.data;
    var totalAmount=0;
    user = new Array();
    if(arrayData.length==0)
    {

    }
    else
    {
        for(let i =0;i<arrayData.length;i++)
        {
          totalAmount= totalAmount+arrayData[i].amount;
          user[i]=arrayData[i].name;
        }
        finalObj['totalExp'] = totalAmount;
        console.log('amount'+totalAmount);
        console.log(user);
        var uniqueNames = [];
        $.each(user, function(i, el)
        {
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        var userDet = [];
        for(let usr of uniqueNames)
        {
            var userExp ={};
            var usrAmount = 0;
            for(let exp of arrayData )
            {
               if(usr === exp.name)
               {
                 usrAmount += exp.amount;
               }
            }
          userExp['expense']=usrAmount;
          userExp['userId'] = usr;
          userExp['balance'] = usrAmount-totalAmount/uniqueNames.length ;
          userDet.push(userExp);    
        }
      finalObj['userDetail'] = userDet;

      /*-----------------api call------------------------*/
        $.post("addGroup/store",
        finalObj,
        function(data, status)
        {
          $('#settleUp').modal('hide');
          getTotalExpense();
          totalMyExpenses();
          settleDetail();
          // $.get("addGroup/deleteExp/"+window.localStorage.getItem('groupId'),
          // function(data, status)
          // {
             
                
          // })
        })
        //settleDetail();
     
     
  }// closing of else
  });
}//function closing
