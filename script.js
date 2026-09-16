const canvas =
document.getElementById("holoCanvas");


const ctx =
canvas.getContext("2d");


canvas.width =
window.innerWidth;


canvas.height =
window.innerHeight;



// =====================
// MOUSE
// =====================

let mouse={

x:canvas.width/2,

y:canvas.height/2

};


window.addEventListener(
"mousemove",
(e)=>{

mouse.x=e.clientX;

mouse.y=e.clientY;

}

);



// =====================
// PARTICLES
// =====================


let particles=[];


for(let i=0;i<250;i++){

particles.push({

angle:Math.random()*Math.PI*2,

radius:
80+Math.random()*180,

speed:
0.002+Math.random()*0.008,


size:
Math.random()*3+1

});


}



// =====================
// ANIMATION
// =====================


let time=0;



function animate(){


requestAnimationFrame(animate);


time+=0.02;


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



let cx =
canvas.width/2;


let cy =
canvas.height/2;



// floating movement

let floatY =
Math.sin(time)*20;



cy+=floatY;



// =====================
// PARTICLE FIELD
// =====================


particles.forEach(p=>{


p.angle+=p.speed;



let x =
cx+
Math.cos(p.angle)
*p.radius;


let y =
cy+
Math.sin(p.angle)
*p.radius;


ctx.beginPath();


ctx.arc(
x,
y,
p.size,
0,
Math.PI*2
);


ctx.fillStyle=
"cyan";


ctx.shadowBlur=15;

ctx.shadowColor=
"cyan";


ctx.fill();



});



// =====================
// HOLOGRAM BODY
// =====================


let bodySize =
120+
Math.sin(time)*10;



ctx.save();


ctx.translate(cx,cy);



ctx.globalAlpha =
0.35+
Math.sin(time)*0.1;



ctx.strokeStyle=
"#00ffff";


ctx.lineWidth=3;



ctx.shadowBlur=30;

ctx.shadowColor=
"#00ffff";



// head

ctx.beginPath();

ctx.arc(
0,
-80,
50,
0,
Math.PI*2
);

ctx.stroke();



// body

ctx.beginPath();


ctx.ellipse(

0,
30,

80,
120,

0,
0,
Math.PI*2

);


ctx.stroke();



// shoulders

ctx.beginPath();

ctx.moveTo(-80,0);

ctx.lineTo(80,0);

ctx.stroke();



ctx.restore();



// =====================
// FACE
// =====================


let eyeMove =
(mouse.x-cx)/50;



ctx.fillStyle=
"#00ffff";


ctx.shadowBlur=20;


ctx.beginPath();


ctx.arc(

cx-20+eyeMove,

cy-90,

8,

0,

Math.PI*2

);


ctx.fill();



ctx.beginPath();


ctx.arc(

cx+20+eyeMove,

cy-90,

8,

0,

Math.PI*2

);


ctx.fill();



// =====================
// SCANLINES
// =====================


ctx.globalAlpha=0.15;


for(
let y=0;
y<canvas.height;
y+=5
){


ctx.fillStyle="cyan";


ctx.fillRect(
0,
y,
canvas.width,
1
);


}



ctx.globalAlpha=1;



// distortion flicker


if(Math.random()<0.03){


ctx.fillStyle=
"rgba(0,255,255,0.2)";


ctx.fillRect(

Math.random()*canvas.width,

0,

20,

canvas.height

);


}



}


animate();
