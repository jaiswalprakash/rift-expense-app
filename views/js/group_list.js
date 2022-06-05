$(document).ready(function(){
    getGroup_list();

})

function getGroup_list(){
    $.get("/addGroup/getGroupList/"+getLoggedInData().userId,
      function(data, status){
     $('#group_list').html('');    //clear 
      let arrayData =  data.data;
      
     console.log(arrayData);
      for(let i =0;i<arrayData.length;i++){
      let memberData=arrayData[i].member;
        let  arr = `   <div class="col-sm-4"   onclick ="goto('${arrayData[i].groupId}','${arrayData[i].groupName}')">
        <div class="alert alert-warning well1" >
        <h3>GROUP_NAME:${arrayData[i].groupName}</h3>
        <br><br>
         
        <span>groupId: </span><span> ${arrayData[i].groupId}</span>
        <br><br>
        <span>GroupDescription: </span><span> ${arrayData[i].description}</span>
        <br><br>
        <span>createdBy: </span><span>${arrayData[i].createdby}</span>
        <br><br>
         <span>member: </span><span>${memberData}</span>
         <br><br>
        </div>
        </div>`
      $('#group_list').append(arr); // group_list is id and we r appending that to html code dynamically
      }
       });
}

function goto(groupId,groupName) 
{

  localStorage.setItem('groupId',groupId);
  localStorage.setItem('groupName',groupName);
   window.location.href = 'group1.html'; // it will move us to group1.html 
}

 ///------createGroup---------////

 function createGroup(){
  var groupName=$("#gName").val();
  var description=$("#description").val();
  
  
  var createGroup={
              
      description:description,
      groupName:groupName,
      userId:getLoggedInData().userId
            
    }
    console.log(JSON.stringify(createGroup));
    if (groupName==null || groupName==""||description==null || description==""){  
      alert("Enter groupName and description ");  
      return false;  
    }
    else{
  
    $.post("addGroup/createGroup",
    createGroup,
   function(data, status){
   // alert("Data: " + data + "\nStatus: " + status);
    $("#gName").val('');
    $("#description").val(''); 
       $('#myCreate').modal('hide');
       getGroup_list()
    });
    }
  }

  ///-----joinGroup---------////

function joinGroup(){
  var groupId=$("#groupId").val();

  var joinGroup={
      groupId:groupId,
      userId:getLoggedInData().userId
    }
    console.log(JSON.stringify(joinGroup));
    if (groupId==null || groupId==""){  
      alert("Enter  groupId ");  
      return false;  
    }
    else{
   $.post("addGroup/join",
      joinGroup,
      function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
        $("#groupId").val(''); 
        $('#myJoin').modal('hide');
        getGroup_list()
 });
 }
}

 
 