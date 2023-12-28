(function () {
    var names = new Array();
    names[0]="Ace";
    names[1]="john";
    names[2]="Jason";
    names[3]="Jerry";
    names[4]="Luffy";
    names[5]="Zoro";
    names[6]="Dazai";
    names[7]="Fyodor";
    names[8]="Jester.N ";
    names[9]="Sigma";

    for (var i = 0; i < names.length; i++) {
        var firstchar = names[i].charAt(0).toLowerCase();
        if (firstchar=="j") {
            byeSpeaker.speak(names[i]);      
        } else  {
            helloSpeaker.speak(names[i]);
        } 
    }   

})();
  
  