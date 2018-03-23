
//re-usable functions


function dom_display(display, id){ //show hide dom 
    if(display==="show"){
      return document.getElementById(id).style.display="block";
    }
     if(display==="hide"){
        document.getElementById(id).style.display="none";
    }
    
}

function on_click(_event_, id){//onclick event
    return document.getElementById(id).onclick=_event_;
}

function get_value(id){ // return html element value
    return document.getElementById(id).value;
}
function dom_write(_value, id){// add html element value
    document.getElementById(id).innerHTML=_value;
}

//global variables

//geolocation

function gps_location(){ // gps
   if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(current_position, gps_error());
   }    
}
//gps no conncetion
    function gps_error(){ 
     var no_gps=confirm("Error 254 : no GPS connection. Retry?");
        if(no_gps==true){ //retry
          //return window.location.reload();//loding too quick
        }
        else{//exit
            alert("Please close browser");
        }
    }

//gps coordinates
function current_position(myPosition){
    var mylongitude=myPosition.coords.longitude.toFixed(2);
    var mylatitude=myPosition.coords.latitude.toFixed(2);
  //alert(mylatitude+" "+mylongitude);
   gps_cords_test(mylongitude, mylatitude); 
    
}



function gps_cords_test(longi, lati){//test cordinates
  
 
    if( lati!=28.06){
       dom_display("show", "login_container");
     
    }
    else{
        var wrong_location=confirm("Error 255 : Incorrect login place. Retry?");
        if(wrong_location==true){ //retry
            window.location.reload();
        }
        else{//exit
            alert("Please close browser");
        }
    }
}

// controll buttons----------
function user_register_link(){ //user register link
    dom_display("hide", "login_container");
    dom_display("show", "register_container");
}
function user_login_link(){//user login link
    dom_display("hide", "register_container");
    dom_display("show", "login_container");
    
}


//------------------------------

//log in plus database
var db=new PouchDB("utapp");
var online_db=new PouchDB("https://6bd30398-1d34-4cfa-9296-e0c41660b6a6-bluemix.cloudant.com/umuzitrafficapp");

//db sync
function db_sync(){//call database sycing
    
  db.sync(online_db).then(function(sucess){alert("Online sync complete: "+JSON.stringify(sucess))}).catch(function(fail){alert("online sync faulty: "+JSON.stringify(fail))});   
}
db_sync();//calling sync at first start
// login
//-----------------------------------------------
   //db.get("tsehla.nkhi@gmail.com").then(function(results){document.getElementById("test").innerHTML=JSON.stringify(results);
  //  }).catch(function(error){document.getElementById("test").innerHTML=JSON.stringify(error);});
//------------------------------------------------

function user_login(){//user login in
    
//clear dom element messages on start
dom_write("", "login_passowrd_text");
dom_write("", "email_field_text");
    
  var my_email=get_value("email_field");   
  var my_password=get_value("password_field"); 
    
var stored_email=db.get(my_email).then(function(results){// get db email    
//also checks if email exists    
                    dom_write("Email okay", "email_field_text");
    
                    
  }).catch(function(error){ 
                    
                  return dom_write("connection error/email doesnt exist", "email_field_text");
  }); 
    
 var stored_password=db.get(my_email).then(function(results){// get db password
                
     if(my_password==results.password){// show dashboard
         dom_display("hide", "login_container");   
         dom_display("show", "body_contents_container");
         success_login(results);//when login is successful fill data
            
   }
     else{return dom_write("Wrong password", "login_passowrd_text")}
   
                 
  }).catch(function(error){ 
                    
                   return dom_write("connection error/password doesnt exist", "login_passowrd_text"+JSON.stringify(error));
                          
                          });    
}

//user register
function user_register(){//user registration
    var my_name=get_value("register_name");
    var my_surname=get_value("register_surname");
    var my_nickname=get_value("register_display_name");
    var my_department=get_value("register_department");
    var my_start_date=get_value("register_date");
    var my_email=get_value("register_email_field");
    var my_password=get_value("register_password_field");    
   //check content not empty 
   if(my_name!="" && my_surname!="" && my_nickname!="" && my_department!="" && my_start_date!="" && my_email!="" && my_password!=""){
    
db.get(my_email).then(function(results){// check email duplicates before register 
       
 return alert("Error account exists, please login");
                    
  }).catch(function(error){// if theres error means email does not exist in database                   
          
    db.put({_id:my_email, //add user to database
            name:my_name,
            surname:my_surname,
            nickname:my_nickname,
            department:my_department,
            startDate:my_start_date,
            myEmail:my_email,
            password:my_password,
            umuzi_identity:"",//start date plus user birth day, too lazy to add birth 
            clockin_time:"",//changed once a day
            occupation:"Leaner",//can be changed to suit admin
            last_seen:"",//if time is x minutes after, person declared offline
            position:"",//user position, periodic check
            profice_image:"",//user profile pic
            recieved_messages:[],//will contain user email, en nameplus message, popup to send message to them as reply, 
            send_messages:"",//probably future feature
            status:"Changing the narative",//status
            
            }).then(function(sucess){//account created
        alert("Account greated, please login "+JSON.stringify(sucess));
        dom_display("hide", "register_container");
        dom_display("show", "login_container");
        db_sync();//sync new data
    
    }).catch(function(error){
         alert("Problem encountered during registration, try again later"+JSON.stringify(error));
          
     });
     
  });     
       
}
//if something empty    
   if(my_name=="" || my_surname=="" || my_nickname=="" || my_department=="" || my_start_date=="" || my_email=="" || my_password==""){
       alert("something empty");
   }
    
}

//-----------------------------------------------------------
// on sucessful login
function success_login(results){
    //images link
    var profile_picture="<img src='http://www.contribcity.com/images/dummy-profile-pic.png'>";
    
     dom_write(results.name+" "+results.surname, "name");//name
     dom_write(results.nickname, "nickname");//nick name
     dom_write(results.status, "status");//status
     dom_write(results.umuzi_identity, "identity");//identity number
     dom_write(results.clockin_time, "login");//clocked in
     dom_write(results.position, "position");//position
     dom_write(results.last_seen, "lastseen");//lastseen
     dom_write(results.department, "department_value");//department
     dom_write(profile_picture, "profile_picture");//profile image
    
    //images function
    
    
    //user online function
    
    
    
}



//-------------------------------------------------------------

gps_location();//gps start

