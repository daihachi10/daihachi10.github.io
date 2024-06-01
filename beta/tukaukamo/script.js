var w = window.innerWidth;
var h = window.innerHeight;
var d = 60;
var n = 60;
var points = new Array(n);
function setup() {
  createCanvas(w, h);
  console.log("画面の横幅: " + windowWidth + "px");
  console.log("画面の縦幅: " + windowHeight + "px");
  background(0);//white
  stroke(30, 30, 50);
  for(i =0; i < n;i++){
    points[i] = [random(w), random(h), 1, random(-1, 1), random(-1, 1)];
  }
}

function draw(){
  background(0);
  for(i =0; i < n;i++){
    var x = points[i][0];
    var y = points[i][1];
    for(j=0;j < n;j++){
      if(i !== j){
        var distans = sqrt((x - points[j][0]) * (x - points[j][0]) + (y - points[j][1]) * (y - points[j][1]));
        if(distans < d){
          stroke(50);
          strokeWeight(0.2);
          line(x, y, points[j][0], points[j][1]);
          points[i][2]++;
        }
      }
    }
  }
  noStroke();
  fill(100);
  for(i =0; i < n;i++){
    ellipse(points[i][0], points[i][1], points[i][2] * 1.5);
    points[i][0] = (points[i][0] + points[i][3]) % w;
    points[i][1] = (points[i][1] + points[i][4]) % h;
    points[i][2] = 1;
  }
}
