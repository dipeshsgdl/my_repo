function init(){
    var startbutton = document.getElementById("start");
    startbutton.style.display = ""; 
    var gamepage = document.getElementById("board");
    var toplabel = document.getElementsByTagName("span");
    for ( let i=0; i<toplabel.length; i++){toplabel[i].style.display = "none";}
    gamepage.style.display = "none";
    startbutton.onclick=hide;

}




function hide(){
   
    var startbutton = document.getElementById("start");
    startbutton.style.display = "none"; 
    var toplabel = document.getElementsByTagName("span");
    for ( let i=0; i<toplabel.length; i++){toplabel[i].style.display = "";}
    var gamepage = document.getElementById("board");
    gamepage.style.display = "";
}

window.onload = init;