
let		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

// game set
const 	width 		= canvas.width  = window.innerWidth,
		height 		= canvas.height = window.innerHeight,
		half_width 	= Math.floor(width/2),
		half_height = Math.floor(height/2),
		tile 		= 100,
		fov 		= Math.PI/3,
		num_rays	= 60,
		max_dist	= 500,
		d_angle		= fov/num_rays,


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

console.log(map);

function rayCast(Sx,Sy,angle){
	cur_angle = angle - fov/2;
	let xo = Sx,
		yo = Sy,
		sin,cos,x,y,dx,
		xm,ym = Math.floor(x/tile)*tile,Math.floor(y/tile)*tile;
	ctx.strokeStyle = green;
	for (let i = 0; i<num_rays;++i){
		sin = Math.sin(cur_angle);
		cos = Math.cos(cur_angle);
		if (cos >= 0){
			x = xm + tile;
			dx = 1
		}
		else{
			x = xm;
			dx = -1
		}
		for (let j =0; j<tile;j+=tile){
			dist_vert = 
		}
		
		
	
	cur_angle += d_angle;

	}
}

function redrawBackground(){
	ctx.beginPath();
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0,0,width,height);
	ctx.closePath();
	
	map.forEach((row,i) => {

		
		ctx.fillStyle = blue;
		ctx.fillRect(row[0],row[1],tile,tile);
		
	});
	


}

function redraw(){
	ctx.beginPath();
	ctx.fillStyle = green;
	ctx.strokeStyle = green;
	ctx.arc(player.posx, player.posy, 12, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	
	
	
}
function gameLoop(){
	player.movement();
	redrawBackground();
	redraw();
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