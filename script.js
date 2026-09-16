// ======================================================
// NOVA v5
// DIGITAL LIFEFORMS SIMULATOR
// PART 1 - CORE ENGINE + DNA SYSTEM
// ======================================================


// ================================
// CANVAS SETUP
// ================================

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



window.addEventListener("resize",()=>{

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

});



// ================================
// WORLD ENGINE
// ================================


const World = {


    time:0,

    day:1,

    temperature:25,

    generation:1,


    creatures:[],

    plants:[],

    predators:[],


    population:0,


    maxFood:100,


};



// ================================
// MOUSE
// ================================


const mouse={

x:0,

y:0

};


window.addEventListener(
"mousemove",
(e)=>{

mouse.x=e.clientX;
mouse.y=e.clientY;

});



// ================================
// UTILITY FUNCTIONS
// ================================


function random(min,max){

return Math.random()*(max-min)+min;

}



function distance(a,b){

return Math.hypot(
a.x-b.x,
a.y-b.y
);

}



function clamp(value,min,max){

return Math.max(
min,
Math.min(max,value)
);

}



// ======================================================
// DNA SYSTEM
// ======================================================


class DNA{


constructor(parent1=null,parent2=null){


if(parent1 && parent2){


this.speed =
this.mutate(
(parent1.speed+parent2.speed)/2
);


this.size =
this.mutate(
(parent1.size+parent2.size)/2
);



this.vision =
this.mutate(
(parent1.vision+parent2.vision)/2
);



this.intelligence =
this.mutate(
(parent1.intelligence+
parent2.intelligence)/2
);



this.aggression =
this.mutate(
(parent1.aggression+
parent2.aggression)/2
);



this.curiosity =
this.mutate(
(parent1.curiosity+
parent2.curiosity)/2
);



}

else{


this.speed=random(1,3);

this.size=random(12,25);

this.vision=random(60,150);

this.intelligence=random(20,100);

this.aggression=random(0,100);

this.curiosity=random(0,100);


}



}



// mutation system

mutate(value){


let mutation =
random(-10,10);


return clamp(
value+mutation,
1,
100
);


}



}



// ======================================================
// CREATURE CLASS
// ======================================================


class Creature{


constructor(x,y,dna=null){


this.x=x;

this.y=y;



this.dna =
dna || new DNA();



this.energy=100;



this.age=0;



this.hunger=0;



this.alive=true;



this.velocity={

x:0,

y:0

};



// personality


this.personality={


bravery:
this.dna.aggression,


curiosity:
this.dna.curiosity,


intelligence:
this.dna.intelligence


};



this.color=
`hsl(${random(160,220)},100%,60%)`;



}



// ================================
// AI BRAIN
// ================================


think(){



let nearestFood=null;

let closest=9999;



World.plants.forEach(food=>{


let d=distance(
this,
food
);



if(
d<closest &&
d<this.dna.vision
){

closest=d;

nearestFood=food;

}


});



// if hungry search food


if(this.hunger>40 && nearestFood){


this.moveTowards(nearestFood);


}



// explore behavior


else{


let angle=random(
0,
Math.PI*2
);



this.velocity.x +=
Math.cos(angle)*0.05;



this.velocity.y +=
Math.sin(angle)*0.05;



}





}



// ================================
// MOVEMENT
// ================================


moveTowards(target){


let dx =
target.x-this.x;


let dy =
target.y-this.y;



let mag =
Math.sqrt(
dx*dx+dy*dy
);



if(mag>0){


this.velocity.x +=
(dx/mag)
*0.1
*this.dna.speed;



this.velocity.y +=
(dy/mag)
*0.1
*this.dna.speed;


}



}



// ================================
// UPDATE
// ================================


update(){


if(!this.alive)
return;



this.think();



this.x += this.velocity.x;

this.y += this.velocity.y;



this.velocity.x*=0.95;

this.velocity.y*=0.95;




// boundaries


this.x =
clamp(
this.x,
0,
canvas.width
);


this.y =
clamp(
this.y,
0,
canvas.height
);





// life


this.age +=0.01;


this.hunger +=0.05;


this.energy -=0.03;



if(this.hunger>100){

this.energy-=0.2;

}




if(this.energy<=0){


this.alive=false;


}





}



// ================================
// DRAW
// ================================


draw(){


if(!this.alive)
return;



ctx.save();



ctx.translate(
this.x,
this.y
);



// glow


ctx.shadowBlur=20;

ctx.shadowColor=this.color;



ctx.fillStyle=this.color;



ctx.beginPath();


ctx.arc(
0,
0,
this.dna.size,
0,
Math.PI*2
);


ctx.fill();



// eyes


ctx.fillStyle="white";


ctx.beginPath();

ctx.arc(
-5,
-5,
3,
0,
Math.PI*2
);


ctx.arc(
5,
-5,
3,
0,
Math.PI*2
);


ctx.fill();



ctx.restore();



}



}



// ======================================================
// CREATE INITIAL LIFE
// ======================================================


for(let i=0;i<10;i++){


World.creatures.push(

new Creature(
random(100,canvas.width-100),
random(100,canvas.height-100)
)

);


}



World.population =
World.creatures.length;



console.log(
"NOVA v5 CORE ONLINE"
);

// ======================================================
// NOVA v5
// PART 2 - ECOSYSTEM ENGINE
// ======================================================



// ======================================================
// PLANT SYSTEM
// ======================================================


class Plant{


constructor(){


this.x=random(
50,
canvas.width-50
);


this.y=random(
50,
canvas.height-50
);



this.energy=random(
20,
50
);



this.size=random(
4,
8
);



this.growth=0;



}



update(){


this.growth+=0.01;



if(this.growth>100){

this.growth=100;

}



}



draw(){


ctx.save();



ctx.fillStyle="#00ff88";


ctx.shadowBlur=15;

ctx.shadowColor="#00ff88";



ctx.beginPath();


ctx.arc(
this.x,
this.y,
this.size,
0,
Math.PI*2
);


ctx.fill();



ctx.restore();


}



}



// ======================================================
// CREATE PLANTS
// ======================================================


for(let i=0;i<80;i++){


World.plants.push(
new Plant()
);


}





// ======================================================
// CREATURE EATING SYSTEM
// ======================================================


Creature.prototype.eatPlants=function(){



for(
let i=World.plants.length-1;
i>=0;
i--
){


let plant =
World.plants[i];



if(
distance(this,plant)<20
){


this.energy+=plant.energy;



this.hunger-=40;



World.plants.splice(
i,
1
);



}



}



};






// ======================================================
// REPRODUCTION SYSTEM
// ======================================================


Creature.prototype.reproduce=function(){



if(
this.energy>150 &&
this.age>50
){



let partner=null;



World.creatures.forEach(c=>{


if(
c!==this &&
distance(this,c)<40 &&
c.energy>120
){


partner=c;


}


});



if(partner){



let childDNA =
new DNA(
this.dna,
partner.dna
);



let child =
new Creature(

this.x+random(-20,20),

this.y+random(-20,20),

childDNA

);



child.energy=80;



World.creatures.push(
child
);



this.energy-=60;


partner.energy-=60;



World.generation++;



console.log(
"NEW LIFE CREATED",
World.generation
);



}



}



};






// ======================================================
// PREDATOR SYSTEM
// ======================================================


class Predator{


constructor(){


this.x=random(
100,
canvas.width-100
);


this.y=random(
100,
canvas.height-100
);



this.speed=random(
1,
3
);



this.energy=150;



this.size=35;



this.color="#ff3366";



}



hunt(){



let target=null;


let closest=999;



World.creatures.forEach(creature=>{


let d =
distance(
this,
creature
);



if(
d<closest
&&
d<120
){


closest=d;

target=creature;


}



});



if(target){


let dx =
target.x-this.x;


let dy =
target.y-this.y;



let mag =
Math.sqrt(
dx*dx+dy*dy
);



this.x +=
(dx/mag)
*this.speed;


this.y +=
(dy/mag)
*this.speed;




if(
distance(this,target)<20
){



target.energy-=1;



this.energy+=0.5;



}



}


else{


this.x+=random(-1,1);

this.y+=random(-1,1);


}



}



draw(){



ctx.save();


ctx.translate(
this.x,
this.y
);



ctx.shadowBlur=30;

ctx.shadowColor=this.color;


ctx.fillStyle=this.color;



ctx.beginPath();


ctx.arc(
0,
0,
this.size,
0,
Math.PI*2
);


ctx.fill();




ctx.fillStyle="black";


ctx.beginPath();


ctx.arc(
-10,
-5,
5,
0,
Math.PI*2
);


ctx.arc(
10,
-5,
5,
0,
Math.PI*2
);



ctx.fill();



ctx.restore();



}



}



// ======================================================
// CREATE PREDATORS
// ======================================================


for(let i=0;i<3;i++){


World.predators.push(
new Predator()
);


}






// ======================================================
// EXTEND CREATURE UPDATE
// ======================================================


const oldUpdate =
Creature.prototype.update;



Creature.prototype.update=function(){



oldUpdate.call(this);



this.eatPlants();



this.reproduce();



};





// ======================================================
// WORLD GROWTH
// ======================================================


function growPlants(){



if(
World.plants.length<World.maxFood
){



if(
Math.random()<0.05
){


World.plants.push(
new Plant()
);


}



}



}






console.log(
"ECOSYSTEM ENGINE ONLINE"
);


// ======================================================
// NOVA v5
// PART 3 - WORLD SIMULATION ENGINE
// ======================================================


// ======================================================
// DAY NIGHT SYSTEM
// ======================================================


World.dayTime = 0;


World.night = false;



function updateEnvironment(){


World.time += 0.01;


World.dayTime +=0.005;



if(World.dayTime > 1){


World.dayTime = 0;


World.day++;


}



// night detection


World.night =
World.dayTime > 0.5;



// temperature


if(World.night){

World.temperature-=0.01;


}
else{


World.temperature+=0.01;


}



World.temperature =
clamp(
World.temperature,
10,
40
);



}





// ======================================================
// CREATURE CLEANUP
// ======================================================


function removeDead(){



World.creatures =
World.creatures.filter(
creature=>creature.alive
);



}






// ======================================================
// UPDATE EVERYTHING
// ======================================================


function updateWorld(){



updateEnvironment();



World.creatures.forEach(
creature=>{

creature.update();

}

);



World.predators.forEach(
predator=>{

predator.hunt();

}

);



World.plants.forEach(
plant=>{

plant.update();

}

);



growPlants();



removeDead();





World.population =
World.creatures.length;



}






// ======================================================
// BACKGROUND
// ======================================================


function drawWorld(){



// clear


ctx.fillStyle =
World.night
?
"#02030a"
:
"#061515";



ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);






// stars at night


if(World.night){



for(let i=0;i<100;i++){



ctx.fillStyle=
"rgba(255,255,255,0.5)";


ctx.fillRect(

Math.random()*canvas.width,

Math.random()*canvas.height,

1,

1

);



}



}




}








// ======================================================
// DRAW EVERYTHING
// ======================================================


function render(){



drawWorld();



World.plants.forEach(
plant=>{

plant.draw();

}

);



World.creatures.forEach(
creature=>{


creature.draw();


}

);



World.predators.forEach(
predator=>{


predator.draw();


}

);



drawHUD();



}







// ======================================================
// HUD
// ======================================================


function drawHUD(){



const info =
document.getElementById("info");



let strongest=null;



World.creatures.forEach(c=>{


if(
!strongest ||
c.energy>strongest.energy
){


strongest=c;


}



});




info.innerHTML=`

<b>NOVA WORLD STATUS</b>

<br><br>


🌎 Day:
${World.day}


<br>


🧬 Generation:
${World.generation}


<br>


🟢 Population:
${World.population}


<br>


🌱 Plants:
${World.plants.length}


<br>


🔴 Predators:
${World.predators.length}


<br><br>


🌡 Temperature:

${World.temperature.toFixed(1)}°C


<br>


${World.night
?
"🌙 Night"
:
"☀️ Day"
}


<br><br>


<b>Strongest Creature</b>


<br>


Energy:

${
strongest
?
strongest.energy.toFixed(1)
:
0
}



`;



}








// ======================================================
// PARTICLE EFFECT
// ======================================================


let particles=[];



function createParticles(){



World.creatures.forEach(c=>{



if(Math.random()<0.2){



particles.push({

x:c.x,

y:c.y,

life:30

});


}



});



}





function drawParticles(){



particles.forEach((p,index)=>{



ctx.fillStyle=
"rgba(0,255,255,0.5)";


ctx.beginPath();


ctx.arc(
p.x,
p.y,
2,
0,
Math.PI*2
);


ctx.fill();



p.life--;



if(p.life<=0){

particles.splice(index,1);

}


});



}








// ======================================================
// MAIN LOOP
// ======================================================



function loop(){



requestAnimationFrame(loop);



updateWorld();



createParticles();



render();



drawParticles();



}



console.log(
`
================================

      NOVA v5 ONLINE

 Digital Lifeform Simulator

 AI: ACTIVE
 Evolution: ACTIVE
 Ecosystem: ACTIVE

================================
`
);



loop();
