var scores = [];
var playerName = " ";
var scoreEntry = " ";

jQuery("#scoresbtn").on("click", function() {
jQuery("#content").empty();
console.log(scores[0]);
console.log(scores[1]);
console.log(scores[2]);
jQuery("#content").append(
  "<p>" + "</p>" +
  "<p>"+ "the highest scorers are:"+ "</p>"+
  "<ol>"+
    "<li class=gold>"+ scores[0] +"</li>"+
    "<li class=silver>"+ scores[1] +"</li>"+
    "<li class=bronze>"+ scores[2] +"</li>"+
  "</ol>"+
"</div>"
);
});

jQuery("#creditsbtn").on("click", function() {
jQuery("#content").empty();
jQuery("#content").append(
"<p>" + "</p>" + "<div>" + "<p>"+"game created by divya kartik" + "</p>"+ "</div>"
);
});

jQuery("#helpbtn").on("click", function() {
jQuery("#content").empty();
jQuery("#content").append(
"<p>" + "</p>" + "<ul>"+ "<li>" + "press SPACE to jump" + "</li>" + "<li>" + "avoid the incoming bones" + "</li>" + "</ul>"
);
});

function registerScore(score){
  playerName = prompt("what's your name?");
    if (score>=3){
      scoreEntry =  playerName + ": ";
      scores.push([scoreEntry, score]);
    }
  scores.sort(scoreSort);
}

function scoreSort(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}
