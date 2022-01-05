
let		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

// game set
const 	width 		= canvas.width  = window.innerWidth,
		height 		= canvas.height = window.innerHeight,
		half_width 	= Math.floor(width/2),
		half_height = Math.floor(height/2),
		tile 		= 100,
		fov 		= Math.PI/3,
		num_rays	= 480,
		max_dist	= 2000,
		d_angle		= fov/num_rays,
		surface_dist= num_rays / (2*Math.tan(fov/2)),
		scale		= Math.floor(width/num_rays)+2,


//map
		text_map = [
		'@@@@@@@@',
		'@......@',
		'@......@',
		'@..@...@',
		'@......@',
		'@..@...@',
		'@......@',
		'@@@@@@@@',		
		]


		

// colors
		black 	= 'rgb(0,0,0)',
		white 	= 'rgb(255,255,255)',
		red 	= 'rgb(255, 0, 0)',
		yellow 	= 'rgb(255, 255, 0)',
		green	= 'rgb(0, 128, 0)',
		blue	= 'rgb(0, 0, 255)'

		bgcolor = black;

//player set
let		player_set 	= {
			x		: half_width,
			y 		: half_height,
			angle	: 0,
			speed	: 5
		},

		cos,sin;


let keys = [false,false,false,false,false,false,false,false];

class Player{
	constructor(){
		this.x = player_set.x;
		this.y = player_set.y;
		this.angle = player_set.angle;
	}

	movement(){		
		cos = Math.cos(player_set.angle);
		sin = Math.sin(player_set.angle);		
		if (keys[4]) {
			player_set.angle -= 0.05;
		}  
		if (keys[5]) {    
			player_set.angle += 0.05;
		}
		if (keys[0]) {
			this.x += player_set.speed*cos;
			this.y += player_set.speed*sin;
		}
		if (keys[1]) {
			this.x += player_set.speed*sin;
			this.y -= player_set.speed*cos;
		}
		if (keys[2]) {
			this.x -= player_set.speed*cos;
			this.y -= player_set.speed*sin;
		}
		if (keys[3]) {
			this.x -= player_set.speed*sin;
			this.y += player_set.speed*cos;
		}
		

	}

	get posx(){
		return this.x;
	}

	get posy(){
		return this.y;
	}

	

}

player = new Player();


document.querySelector('body').appendChild(canvas);

let map = new Set();

text_map.forEach((row, y) => {
	Array.from(row).forEach((cell, x) => {
		if (cell == '@') {
			map.add([x*tile,y*tile])
	}
	});
});

console.log(scale);

function rayCast(Px,Py,angle){
	cur_angle = angle - fov/2;
	let xo = Px,
		yo = Py,
		sin,cos,x,y,d;
	for (let i = 0; i<num_rays;++i){
		sin = Math.sin(cur_angle);
		cos = Math.cos(cur_angle);
		for (let dist=0; dist < max_dist; dist+=2){
			x = xo + dist*cos;
			y = yo + dist*sin;
			if (x > width || x < 0 || y > height || y < 0){
				dist *= Math.cos(player_set.angle - cur_angle);
				ctx.beginPath();
				let c = 255/(1+dist*dist*0.0001)+16;
				ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
				ctx.fillRect(i*width/num_rays, half_height - 80000/dist/2, scale,80000/dist);
				ctx.closePath();
				ctx.fill();

				break
			}
		}
		cur_angle += d_angle;

	}
}

function redrawBackground(){
	ctx.beginPath();
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0,0,width,height);
	ctx.closePath();
	
	// map.forEach((row,i) => {

		
	// 	ctx.fillStyle = blue;
	// 	ctx.fillRect(row[0],row[1],tile,tile);
		
	// });
	


}

function redraw(){
	ctx.beginPath();
	ctx.fillStyle = green;
	ctx.strokeStyle = green;
	ctx.arc(player.posx, player.posy, 12, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	ctx.moveTo(player.posx,player.posy);
	ctx.lineTo(player.posx+500*Math.cos(player_set.angle),player.posy+500*Math.sin(player_set.angle));
	ctx.stroke()
	
	
	
}
function gameLoop(){
	player.movement();
	redrawBackground();
	//redraw();
	rayCast(player.posx,player.posy,player_set.angle);
	requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (e) => {
	if (e.keyCode=== 87) {
		keys[0] = true;
	}
	if (e.keyCode === 65) {
		keys[1] = true;
	}
	if (e.keyCode === 83) {
		keys[2] = true;
	}
	if (e.keyCode === 68) {
		keys[3] = true;
	}
	if (e.keyCode === 37) {
		keys[4] = true;
	}
	if (e.keyCode === 39) {
		keys[5] = true;
	}

		})
document.addEventListener("keyup", (e) => {
	if (e.keyCode=== 87) {
		keys[0] = false;
	}
	if (e.keyCode === 65) {
		keys[1] = false;
	}
	if (e.keyCode === 83) {
		keys[2] = false;
	}
	if (e.keyCode === 68) {
		keys[3] = false;
	}
	if (e.keyCode === 37) {
		keys[4] = false;
	}
	if (e.keyCode === 39) {
		keys[5] = false;
	}
});