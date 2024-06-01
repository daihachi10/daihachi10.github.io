let min = 50;
let colors = ["#ed3441", "#ffb03b", "#36acf5", "#ffd630", "#084e86", "#fcfeff"];

function setup() {
	createCanvas(800, 800);
	shuffle(colors, true);
	background(0);
	let off = 20;
	let p1 = createVector(off, off);
	let p2 = createVector(width - off, off);
	let p3 = createVector(width - off, height - off);
	let p4 = createVector(off, height - off);
	stroke(0);
	divideRect(p1, p2, p3, p4, 9);
}

function draw() {

}

function divideRect(p1, p2, p3, p4, n) {
	let col = random(colors);
	n--;
	if (n == 0) {
		fill(col);
		stroke(col);
		beginShape();
		vertex(p1.x, p1.y);
		vertex(p2.x, p2.y);
		vertex(p3.x, p3.y);
		vertex(p4.x, p4.y);
		endShape(CLOSE);
	} else if (n > 0) {
		let w = p5.Vector.dist(p1, p2) + p5.Vector.dist(p3, p4);
		let h = p5.Vector.dist(p1, p4) + p5.Vector.dist(p2, p3);
		let t = 3;
		let r1 = (1 / t) * int(random(1, t));
		let r2 = (1 / t) * int(random(1, t));
		if (w < h) {
			let v1 = p5.Vector.lerp(p1, p4, r1);
			let v2 = p5.Vector.lerp(p2, p3, r2);
			divideRect(p1, p2, v2, v1, n);
			divideRect(v1, v2, p3, p4, n);
		} else {
			let v1 = p5.Vector.lerp(p1, p2, r1);
			let v2 = p5.Vector.lerp(p3, p4, r2);
			divideRect(p1, v1, v2, p4, n);
			divideRect(v1, p2, p3, v2, n);
		}
	}
}
