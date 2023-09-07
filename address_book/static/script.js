"use strict";

// write JS code here.
var contactentry = [];

async function listContacts(){
    console.log("fetch_contacts running")
    fetch_username();
    let url = "/fetch_contacts";
    let response = await fetch(url)
    if (response.status ==200){
        let reply = await response.json();
        console.log(reply);
        for (var k in reply){
            var newcontact = new Entry(reply[k]['name'], reply[k]['telephone'], reply[k]["email"]);
            console.log(newcontact);
            contactentry.push(newcontact);
            addEntry(contactentry.length, newcontact);
        }
    }
}

async function fetch_username(){
    let url = "/fetch_username";
    let response = await fetch(url)
    if (response.status ==200){
        let reply = await response.json();
        console.log(reply[0]);
    let user_display = document.getElementById("user_display");
    user_display.innerText = 'Hi '+ reply[0]['username'];
    return 1;
    }
}


function Entry(firstname, tel, email){
        this.firstname = firstname;
        this.tel=tel;
        this.email=email;    
}

function editcontact(){

}


function settings(){
    var settingicon = document.getElementById("settingPanel");
    settingicon.style.display = "";
    
    document.getElementById("setting").onclick = settingPanel;
}

function settingPanel(){
    var settingicon = document.getElementById("settingPanel");
    settingicon.style.display = "none";
    document.getElementById("setting").onclick = settings;
}


function makeChanges(){
    var theelementcategory = document.getElementById("category");
    var fontstyle = document.getElementById("font");
    var textsizeoption = document.getElementById("fontsize");
    var theelement = theelementcategory.value;
    var thefont = fontstyle.value;
    
    var fontsize = textsizeoption.value;
    var size = fontsize +"px";
   

    var emailobject = document.getElementsByTagName("a");
    var name = document.getElementsByTagName("h2");
    var tel = document.getElementsByTagName("p");
    
    if (theelement == "email"){
        for (let i of emailobject){
            i.style.fontFamily = thefont;
            i.style.fontSize = size;
        }
    }
    else if (theelement == "name"){
        for (let j of name){
            console.log(j);
            j.style.fontFamily = thefont;
            j.style.fontSize = size;
        }
    }
    else if(theelement == "tel"){
        for (let k of tel){
            k.style.fontFamily = thefont;
            k.style.fontSize = size;
        }
    }
}

function displaymatch(){
    var searchterm = document.getElementById("search");
    var searchstring = searchterm.value.toString();
    var searchcompare = searchstring.toUpperCase();
    var container = document.getElementById("contactlist");
    var list = container.getElementsByTagName("li");
    for (let i=0; i<list.length; i++){
        var allElements = list[i].getElementsByClassName("entryclass");
        for (let j=0; j<allElements.length; j++){
            var textinElements = allElements[j].textContent.toUpperCase() || allElements[j].innerText.toUpperCase;
           
            if (textinElements.indexOf(searchcompare) > -1){
                list[i].style.display="";
                break;
            }       
            else{
                list[i].style.display = "none";
            }
        }
        

    }

}

//displaying the added entries in the website 
function addEntry(id, entry){
    var entrybox = document.getElementById("contactlist");
    var entryA = document.createElement("li");
    entryA.id=id;
    
    entryA.innerHTML = '<h2 class = "entryclass">' + entry.firstname + '</h2> <p class = "entryclass">'+entry.tel +
                        '</p> <a class = "entryclass" href="mailto:'+ entry.email + '">' + entry.email +
                        '</a> <img src="static/edit.png" width="10px;" id="edit"><img src="static/trash.png" width="15px;" class="trash" onclick="confirmation('+ id +')">';
    entrybox.appendChild(entryA);
}

//adding a new entry to the Entry class
function addnewentry(){
    var nameobject = document.getElementById("name");
    var name = nameobject.value;
    if (name==""){
        window.alert("Name field must not be empty! Try Again!")
    }
    else{
        var telobject = document.getElementById("tel");
        var tel = telobject.value;
        var emailobject = document.getElementById("email");
        var email = emailobject.value;
        if(tel==""){
            if(email==""){
              window.alert("Either the Telephone or the Email has to be filled in");  
            }
        }
        var newcontact = new Entry(name, tel, email);
        //contactentry.push(newcontact); //appending the new entry to the contactentry list
        addEntry(contactentry.length, newcontact); //runs the addEntry function

    }
    
}

function confirmation(id){
    console.log(id);
    let sure = "Are you sure ?";
    if (confirm(sure)==true){
        removetheList(id);
        
    }
    else{
        
    }
}


function removetheList(id){
    var theList = document.getElementById(id);
    var contactdetails = contactentry[id-1];
    console.log(contactdetails);
    var email_to_delete = contactdetails['email'];
    send_json(email_to_delete);
    console.log(email_to_delete);

    /* $.ajax({
        type: "POST",
        url: "/delete_contact",
        contentType : "application/json",
        data: JSON.stringify({
            'email':email_to_delete}),
        dataType: "json",
        success: function (response) {
            console.log(response);
        },
        error: function (err) {
            console.log(err);
        }
    })
 */
    
    theList.onclick = theList.parentNode.removeChild(theList);
    contactentry.splice(id,1);
    //console.log(id);
    //console.log(theList);
  }

async function send_json(email_to_delete){
    await fetch('/delete_contact',{
        headers:{
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            'email':email_to_delete
        })
    })
    console.log(email_to_delete);
  /*   .then(function (response){

        if(response.ok) {
            response.json()
            .then(function(response) {
                console.log(response);
            });
        }
        else {
            throw Error('Something went wrong');
        }
    })
    .catch(function(error) {
        console.log(error);
    }); */

}



function displayInitial(){
    for (let i of contactentry){
        var contactname = i;
        var index = contactentry.indexOf(i);
        addEntry(index, contactname);
    }
    
}

function shownewentrybox(){
    var entrybox = document.getElementById("newentry");
    entrybox.style.display = "";
}

function hideentrybox(){
    var entrybox = document.getElementById("newentry");
    entrybox.style.display = "none";
}

//matching checks if the telephone and email are in the correct format 
function matching(){
    var tel = document.getElementById("tel");
    var email = document.getElementById("email");


    var telpattern = tel.getAttribute("pattern");
    var emailpattern = email.getAttribute("pattern");
    
    var regtel = new RegExp("^"+telpattern+"$");
    var regemail = new RegExp("^"+emailpattern+"$");
    
    if (tel.value != ""){
        if (regtel.test(tel.value)){
            if (email.value !=""){
                if (regemail.test(email.value)){
                    addnewentry();
                }
                else{
                    window.alert("Email not in correct format");
                }
            }
            else{
                addnewentry();
            }
        }
        else{
            window.alert("telephone number not in correct format");
        }
    }
    else{
        if (email.value !=""){
            if (regemail.test(email.value)){
                addnewentry();
            }
            else{
                window.alert("Email not in correct format");
            }
        }
        else{
            window.alert("Please type at least one of Telephone or Email");
    }
    }
}


window.onload = function(){   
    listContacts();
    var newentrybox = document.getElementById("newentry");
    newentrybox.style.display = "none";
    var settingsicon = document.getElementById("settingPanel");
    settingsicon.style.display = "none";
    displayInitial();

    document.getElementById("addnew").onclick = shownewentrybox;
    document.getElementById("cross").onclick = hideentrybox;

    document.getElementById("change").onclick = makeChanges;
    document.getElementById("search").onkeyup = displaymatch;
    document.getElementById("setting").onclick = settings;
    var addbutton = document.getElementById("add");
    //addbutton.onclick = matching;

    //document.getElementById("logging_out").onclick = logout;

    var trashicon = document.getElementsByClassName("trash");
    for (let i=0; i<trashicon.length; i++){
        var parentId = trashicon[i].parentElement.id;
        console.log(parentId);
    }
}