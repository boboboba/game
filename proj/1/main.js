
let		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');

// game set
const 	width 		= canvas.width  = window.innerWidth,
		height 		= canvas.height = window.innerHeight,
		half_width 	= Math.floor(width/2),
		half_height = Math.floor(height/2),
		tile 		= 32,
		fov 		= Math.PI/2,
		num_rays	= 60,
		max_dist	= 2000,
		d_angle		= fov/num_rays,
		surface_dist= num_rays / (2*Math.tan(fov/2)),
		scale		= Math.floor(width/num_rays)+2,


//map
		text_map = [
		'@@@@@@@@@@@@@@@@',
		'@......@....@..@',
		'@..@........@..@',
		'@.....@@..@....@',
		'@..@........@..@',
		'@......@.......@',
		'@..@@@..@.@..@.@',
		'@..............@',	
		'@.....@...@@...@',	
		'@.....@@....@..@',	
		'@.@@@..........@',	
		'@......@.@...@.@',	
		'@....@.........@',	
		'@..@....@...@..@',	
		'@......@...@...@',	
		'@@@@@@@@@@@@@@@@',	
		];


		

// colors
		black 	= 'rgb(0,0,0)',
		white 	= 'rgb(255,255,255)',
		red 	= 'rgb(255, 0, 0)',
		yellow 	= 'rgb(255, 255, 0)',
		green	= 'rgb(0, 128, 0)',
		blue	= 'rgb(0, 0, 255)'

		bgcolor = white;

//player set
let		player_set 	= {
			x		: 673,
			y 		: 220,
			angle	: -3.799999999,
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
		cos = Math.cos(player.angle);
		sin = Math.sin(player.angle);		
		if (keys[4]) {
			player.angle -= 0.05;
		}  
		if (keys[5]) {    
			player.angle += 0.05;
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
	

}

player = new Player();


document.querySelector('body').appendChild(canvas);

let map = new Set();

text_map.forEach((row, y) => {
	Array.from(row).forEach((cell, x) => {
		
		if (cell == '@') {
			map.add(String(x*tile)+','+String(y*tile));
			
	}
	});
});

function getWall(x,y){
	return map.has(String(x-x%tile)+','+String(y-y%tile));
}
console.log(scale);

function rayCast(Px,Py,angle){
	cur_angle = angle - fov/2;
	let xo = Px,
		yo = Py,
		sin,cos,x,y,d;
	for (let i = 0; i<num_rays;++i){
		sin = Math.sin(cur_angle);
		cos = Math.cos(cur_angle);
		for (let dist=0; dist < max_dist; dist+=1){
			x = xo + dist*cos;
			y = yo + dist*sin;
			if (getWall(x,y)){
				ctx.lineWidth = 3;
				ctx.moveTo(player.x,player.y);
				// ctx.lineTo(player.x+dist*Math.cos(cur_angle),player.y+dist*Math.sin(cur_angle));
				ctx.stroke();
				dist *= Math.cos(player.angle - cur_angle);
				ctx.beginPath();
				let c = 255/dist*128;
				ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
				//ctx.fillRect(i*width/num_rays, (height - scale*surface_dist*tile/dist)/2,scale, scale*surface_dist*tile/dist);
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
	
	text_map.forEach((row,i) => {

		
		ctx.fillStyle = blue;
		console.log(row)
		Array.from(row).forEach((coloumn,j) => {
			if (coloumn == '@'){
				ctx.fillRect(j*tile,i*tile,tile,tile);
			}
		})
	});
	


}

function redraw(){
	ctx.moveTo(player.x,player.y);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(255,0,0)';
	ctx.lineTo(player.x+64*Math.cos(player.angle),player.y+64*Math.sin(player.angle));
	ctx.stroke()
	ctx.beginPath();
	ctx.fillStyle = green;
	ctx.strokeStyle = green;
	ctx.arc(player.x, player.y, 7, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	ctx.moveTo(player.x,player.y);
	
	
	
}
function gameLoop(){
	player.movement();
	redrawBackground();
	redraw();
	rayCast(player.x,player.y,player.angle);
	requestAnimationFrame(gameLoop);
	console.log(player.angle)
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