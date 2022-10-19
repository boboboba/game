'use strict'

let		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),


		w		= canvas.width  = window.innerWidth,
		h 		= canvas.height = window.innerHeight;

		document.querySelector('body').appendChild(canvas);

// game set
let		tile		= 64,
		fov			= 70   * Math.PI/180,
		num_rays	= w/3,
		max_dist	= 1000,
		delta_angle		= fov/num_rays,
		surface_dist= (num_rays/2) / Math.tan(fov/2),
		coef = 1/5,


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
const texture = new Image();
texture.src = '4.png';
const sky = new Image();
sky.src = 'sky.jpg'



		

// colors
let		black	= 'rgb(0,0,0)',
		white	= 'rgb(255,255,255)',
		red		= 'rgb(255, 0, 0)',
		yellow	= 'rgb(255, 255, 0)',
		green	= 'rgb(0, 128, 0)',
		blue	= 'rgb(0, 0, 255)',
		brown 	= 'rgb(150, 75, 0)',
		lightblue = '	rgb(128,128,255)',

		bgcolor = black;

//player set
let		player_set	= {
			x		:100,
			y 		:100,
			speed	:3
		},
		scale		= Math.ceil(w/num_rays),
		rays		= [];
		
window.onresize = function(){
		w			= canvas.width 	= innerWidth,
		h			= canvas.height = innerHeight;   
		scale		= Math.ceil(w/num_rays);   
		surface_dist= (num_rays/2) / Math.tan(fov/2);
		};



let keys = [false,false,false,false,false,false,false,false];

class Player{
	constructor(){
		this.x = player_set.x;
		this.y = player_set.y;
		this.angle = 0;
		this.vangle = 0; //Math.atan(2/4);
	}

	movement(){		
		let cos = Math.cos(this.angle),
			sin = Math.sin(this.angle);		
		// if (keys[4]) {
		// 	this.angle -= 0.02;
		// }  
		// if (keys[5]) {    
		// 	this.angle += 0.02;
		// }
		let nextX = this.x,
			nextY = this.y,
			dx,dy;
		if (keys[0]) {
			nextX += player_set.speed*cos;
			nextY += player_set.speed*sin;
		}
		if (keys[1]) {
			nextX += player_set.speed*sin;
			nextY -= player_set.speed*cos;
		}
		if (keys[2]) {
			nextX -= player_set.speed*cos;
			nextY -= player_set.speed*sin;
		}
		if (keys[3]) {
			nextX -= player_set.speed*sin;
			nextY += player_set.speed*cos;
		}

		if (!getWall(nextX,this.y)){
			this.x = nextX
		}

		if (!getWall(this.x, nextY)){
			this.y = nextY
		}
		
	}
};

// class Enemy(){
// 	constructor(x,y){
// 		this.x = x;
// 		this.y = y;
// 	}
// }

class Ray{
	constructor(dist,wall,orient){
		this.dist = dist;
		this.wall = wall;
		this.orient = orient;
	}
}

let player = new Player();


let map = new Set();
let b = new Array(0,0);
text_map.forEach((row, y) => {
	Array.from(row).forEach((cell, x) => {
		
		if (cell == '@') {
			map.add(String(x*tile)+','+String(y*tile));
			
	}
	});
});

console.log(Boolean(0));

function getWall(x,y){
	return map.has(String(x-x%tile)+','+String(y-y%tile));
}

function getVerticalCollision(Px,Py,angle){
	const sin = Math.sin(angle),
		  cos = Math.cos(angle),
		  tan = Math.tan(angle);
	let x,xa,y,ya,dist,da;

	
	if (cos > 0){
		xa = tile;
		x = Math.floor(Px / tile) * tile;
	}
	else{
		xa = - tile;
		x = Math.floor(Px / tile) * tile + tile - 1;
	}
	ya = xa*tan;
	y = Py - (Px - x) * tan;

	for (let j = 0; j < text_map[0].length; j++){
		x += xa;
		y += ya;
		if (getWall(x,y)){
			dist = Math.sqrt((x - Px)*(x - Px) + (y - Py)*(y - Py))+1;
			break
		}
	}
	if (dist < max_dist & dist > 0){
		return{
			dist,
			x,
			y,
			vertical: true,
		}
	}
	else {
		return{
			dist: false,
			x,
			y,
			vertical: true,
		}
	}
}

function getHorizontalCollision(Px,Py,angle){
	const sin = Math.sin(angle),
		  cos = Math.cos(angle),
		  tan = Math.tan(angle);
	let x,xa,y,ya,dist,da;

	if (sin > 0){
		ya = tile;
		y = Math.floor(Py / tile) * tile;
	}
	else{
		ya = - tile;
		y = Math.floor(Py / tile) * tile + tile - 1;
	}

	xa = ya/tan;
	x = Px - (Py - y) / tan;
	dist = -Math.sqrt((Px - x)*(Px - x) + (Py - y)*(Py - y));
	da = Math.sqrt(xa*xa + ya*ya);
	
	for (let j = 0; j < text_map.length; j++){
		x += xa;
		y += ya;
		if (getWall(x,y)){
			dist = Math.sqrt((x - Px)*(x - Px) + (y - Py)*(y - Py))+1;
			break
		}
	}
	if (dist < max_dist & dist > 0){
		return{
			dist,
			x,
			y,
			vertical: false,
		}
	}
	else {
		return{
			dist: false,
			x,
			y,
			vertical: false,
		}
	}
}

function getCollision(Px,Py,cur_angle){
	if ( (getHorizontalCollision(Px,Py,cur_angle).dist > 1) &  (getVerticalCollision(Px,Py,cur_angle).dist > 1)){
		if (getHorizontalCollision(Px,Py,cur_angle).dist>getVerticalCollision(Px,Py,cur_angle).dist){
			return getVerticalCollision(Px,Py,cur_angle);
		}
		else{
			return getHorizontalCollision(Px,Py,cur_angle);
	 }
	}
	else {
		if (getHorizontalCollision(Px,Py,cur_angle).dist<getVerticalCollision(Px,Py,cur_angle).dist){
			return getVerticalCollision(Px,Py,cur_angle);
		}
		else{
			return getHorizontalCollision(Px,Py,cur_angle);
		}
	}
	
}

function rayCast(Px,Py,angle){
	let cur_angle = angle - fov/2;
	
	for (let i = 0; i<num_rays;i++){

		let ray = getCollision(Px,Py,cur_angle);
		let dist = ray.dist;
		let offset;
		// ctx.moveTo(player.x * coef,player.y * coef);
		// ctx.lineTo(player.x * coef+dist*Math.cos(cur_angle) * coef,player.y * coef+dist*Math.sin(cur_angle) * coef);
		// ctx.stroke();
		dist *= Math.cos(cur_angle - angle);
		
		if (ray.vertical){
			offset = ray.y % tile; 
		}
		if (!ray.vertical){
			offset = ray.x % tile;
		}
		// if (offset < 1 || offset > tile - 1){
		// 	offset = Math.floor(offset)
		// }
		let c = dist/max_dist;
		ctx.drawImage(texture, Math.floor(texture.width * offset / tile), 0,  1,texture.height,
						i*scale,  h*player.vangle+(h - scale*surface_dist*tile/dist)/2, scale,scale*surface_dist*tile/dist);
		ctx.fillStyle = 'rgba(0,0,0,' + c + ')';
		// ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
		ctx.fillRect(i*scale,  h*player.vangle+(h - scale*surface_dist*tile/dist)/2, scale,scale*surface_dist*tile/dist);		
		// ctx.fill();
	
		
		cur_angle += delta_angle;
	
	}
}

let lastCalledTime,
	fps,
	sec = Date.now(),
	delta;
function getFPS() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	if (Date.now() - sec>1000){
		sec = Date.now();
	}


} 





function redrawBackground(){
	let skyoffset = -player.angle*w/Math.PI % w;
	ctx.drawImage(sky,skyoffset+w,h*player.vangle+(h/2 - w),w,w);
	ctx.drawImage(sky,skyoffset,h*player.vangle+(h/2 - w),w,w);
	ctx.drawImage(sky,skyoffset-w,h*player.vangle+(h/2 - w),w,w);
	ctx.beginPath();
	// ctx.fillStyle = lightblue;
	// ctx.fillRect(0,0,w, h*player.vangle+h/2);
	ctx.fillStyle = brown;
	ctx.fillRect(0, h*player.vangle+h/2,w,h - h*player.vangle+h/2);
	ctx.closePath();
	
	// map.forEach((row,i) => {

		
	// 	ctx.fillStyle = blue;
	// 	ctx.fillRect(row[0],row[1],tile,tile);
		
	// });
	


}

function minimap(){
	let line = getCollision(player.x,player.y,player.angle).dist
	ctx.beginPath();
	ctx.fillStyle = red;
	ctx.fillRect(0,0,text_map[0].length * tile * coef, text_map.length * tile * coef);
	ctx.fillStyle = green;
	ctx.strokeStyle = green;
	ctx.arc(player.x * coef, player.y * coef, 5, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	ctx.moveTo(player.x * coef,player.y * coef);
	ctx.lineTo((player.x + line * Math.cos(player.angle)) * coef,(player.y + line * Math.sin(player.angle)) * coef);
	ctx.stroke()
	map.forEach((row,i) => {

		let a = row.split(',');
		ctx.fillStyle = blue;
		ctx.fillRect(a[0]* coef,a[1]* coef,tile* coef,tile* coef);
		
	});
	
	
}
setInterval(function gameLoop(){
	player.movement();
	redrawBackground();
	rayCast(player.x,player.y,player.angle);
	minimap();
	// requestAnimationFrame(gameLoop);
	//getFPS();


},15);


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
	// if (e.keyCode === 37) {
	// 	keys[4] = true;
	// }
	// if (e.keyCode === 39) {
	// 	keys[5] = true;
	// }

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
// 	if (e.keyCode === 37) {
// 		keys[4] = false;
// 	}
// 	if (e.keyCode === 39) {
// 		keys[5] = false;
// 	}
 });

document.addEventListener("mousemove", function (event) {
  player.angle += event.movementX*fov/w;
  if (Math.abs(player.vangle - event.movementY*fov*16/9/w) < Math.PI/8)
  player.vangle -= event.movementY*fov*16/9/w/2;
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});
