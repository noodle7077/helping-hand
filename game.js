import * as THREE from './assets/three.module.min.js';

const $ = id => document.getElementById(id);
const SAVE = 'signal-resident-v1';
const residents = [
 {name:'MARA / FACE DEPARTMENT',x:3,z:-8,item:0,request:'My face fell into an apple. It rolled into the western garden. Please bring it back before somebody eats me.',after:'That is my face. Thank you. You look like somebody who could continue existing. I have signed your departure form.',hint:'Blue apple · west garden',district:'CENTRAL SERVICES'},
 {name:'THE MINUTE INSPECTOR',x:-24,z:-20,item:1,request:'I misplaced eleven minutes and a yellow gentleman. My blue clock was last seen beside the eastern tower, north of the plaza. Time is a community resource.',after:'Excellent. We are now eleven minutes late together. That makes it legal. One signature for you.',hint:'Blue clock · northeast tower',district:'WESTERN ADMINISTRATION'},
 {name:'SOFT COMMITTEE',x:24,z:20,item:2,request:'My bear is waiting beside the eastern arcade. He thinks I forgot him. Can you explain that I am simply made of unrelated photographs?',after:'You brought him home. He forgives the photographs. I approve of your presence and also your eventual absence.',hint:'Brown bear · east arcade',district:'EASTERN FEELINGS'},
 {name:'UNSUBSCRIBE PERSON',x:0,z:24,item:3,request:'My telephone is west of the plaza. It keeps calling me from outside my body. Retrieve it. Do not answer. I am already here.',after:'At last. Nobody is calling. I have signed your form. If all twelve residents approve, the green exit north of the plaza will accept you.',hint:'Silver phone · west plaza',district:'SOUTHERN NOTIFICATIONS'}
];
const itemDefs = [
 {name:'FACE APPLE',short:'APPLE',x:-24,z:22},
 {name:'ELEVEN MINUTES',short:'CLOCK',x:24,z:-23},
 {name:'LONELY BEAR',short:'BEAR',x:22,z:3},
 {name:'OUTSIDE CALLER',short:'PHONE',x:-21,z:-3}
];

// The first four addresses and item IDs remain stable for existing saved visits.
const newRequests = [
 ['SISTER OF SHORTCUTS',0,-21,'A door has forgotten how to be a door. My silver ankh is in the southeast square. Bring it here and I will convince the door to remember.','The door remembers. Unfortunately it remembers being a window. Your signature is valid anyway.','Silver ankh · southeast square'],
 ['CITY ACCOUNTANT',-24,7,'The municipal sentence is missing its final punctuation. Someone borrowed my golden comma. It looks like a bullet. Look along the north avenue.','At last: a complete sentence. Nobody has to be fired. We are an accounting department, please stop looking frightened.','Golden comma · north avenue'],
 ['SMALL WEATHER SERVICE',24,-9,'My cloud has sunglasses and little feet. It escaped to the southwest corner. Please return the weather. The forecast has become personal.','The cloud says you are cool. That is an official weather warning. I have approved your humidity.','Cool dog · southwest corner'],
 ['CIVIC ORCHARD',7,24,'My unripe pear is green and made of metal. Do not pull its stem. Somebody put it by the west clock office. Fruit classification is a difficult job.','Correct. A pear. We will never speak of this again. Have a signature and enjoy being delicious.','Metal pear · northwest street'],
 ['EDGE ADVISOR',-8,0,'I cannot open a single letter. My ridiculous letter opener is beside the south gate. It has teeth. I respect that in an office supply.','Now I can finally open this envelope. It says DO NOT OPEN. This is why I needed a professional.','Letter opener · south avenue'],
 ['PINK AMBASSADOR',8,0,'My pink diplomatic assistant is wandering near the western garden. She has ears and no diplomatic immunity. Bring her home before she starts a country.','The negotiations were successful. She accepts your existence, with conditions. One pink signature.','Pink creature · western garden'],
 ['MAYOR OF BANANAS',-9,-24,'A tiny yellow employee resigned near the northeast corner. Bring him to me. My government requires at least one overall.','The cabinet is complete. He is now minister of being small. You have the approval of the entire banana republic.','Yellow employee · northeast corner'],
 ['NIGHT WINDOW',24,30,'The window is thirsty. Its green glass drink is beside the eastern arcade, south of the clock. Leave the cloth on. This window prefers formal beverages.','The window has consumed the concept of a drink. It is now looking back at you. Thank you for your service.','Green bottle · east arcade']
];
newRequests.forEach((r,j)=>residents.push({name:r[0],x:r[1],z:r[2],item:j+4,request:r[3],after:r[4],hint:r[5],district:'THE EXPANDED NEIGHBORHOOD'}));
const gossip = [
 ['MISSING PIXEL',-30,-24,'I used to be a cursor. You moved me here. Please be gentle with the mouse.'],
 ['SECOND HAND',-24,-30,'All these arms are second hand. None of them came with instructions.'],
 ['BROWSER HISTORY',30,-24,'I remember every embarrassing website you visited. Luckily I have no mouth of my own.'],
 ['DUPLICATE FILE',30,0,'There are two of me in the recycling bin. We are seeing other folders.'],
 ['SOUP MONITOR',-30,0,'The building behind you is a bowl of soup. Architects do not want you to know this.'],
 ['THE SPARE TUESDAY',0,30,'Today is Tuesday. Yesterday was also Tuesday. Tomorrow has requested a lawyer.'],
 ['PUBLIC EYEBALL',-30,24,'The crows are not spies. They are freelance observers. This is much worse.'],
 ['CLOTHING EXCHANGE',30,24,'My trousers have been approved for human use. My shirt is still on probation.'],
 ['MILD INCONVENIENCE',0,-4,'You are standing inside a very old website. Please wipe your feet on the hyperlink.'],
 ['LIVING POPUP',-4,12,'CONGRATULATIONS! YOU ARE OUR ONE MILLIONTH BODY. The prize is more paperwork.'],
 ['JPG CARETAKER',4,-14,'Never put your hands inside the sky. It is a photograph and it will crease.'],
 ['LOCAL FOREVER',-24,15,'I have been walking this street for nine years. It is an extremely short street.']
];
gossip.forEach((r,j)=>residents.push({name:r[0],x:r[1],z:r[2],item:null,request:r[3],district:'PUBLIC SPACE',wander:j%3!==0,axis:Math.abs(r[1])===24||Math.abs(r[1])<=4?'z':'x',origin:[r[1],r[2]]}));
const addedItems = [
 ['DOOR MEMORY','ANKH',27,24,'world04'],['GOLDEN COMMA','COMMA',0,-27,'world07'],
 ['PERSONAL WEATHER','DOG',-27,27,'world09'],['UNRIPE PEAR','PEAR',-27,-18,'world10'],
 ['LETTER OPENER','EDGE',3,29,'world11'],['PINK DIPLOMAT','PINK',-24,28,'world12'],
 ['TINY GOVERNMENT','MAYOR',28,-26,'world13'],['WINDOW DRINK','DRINK',27,8,'world14']
];
addedItems.forEach(r=>itemDefs.push({name:r[0],short:r[1],x:r[2],z:r[3],asset:r[4]+'-cutout.png'}));
['world05','world08','world06','world15'].forEach((a,i)=>itemDefs[i].asset=a+'-cutout.png');
const QUEST_COUNT = residents.filter(r=>r.item!==null).length;
const allApproved = ()=>state.completed.length===QUEST_COUNT;
const crows=[],oddities=[];

const LEVELS = [
 {name:'THE ORDINARY BLOCK',spacing:24,facades:['25','28','29','35'],ground:'30',road:'32',sky:'21',fog:'#402550',tint:0x71725b},
 {name:'MIRROR ESTATE',spacing:22,facades:['32','19','34','27'],ground:'32',road:'30',sky:'34',fog:'#667098',tint:0xaac5ff},
 {name:'GUTTER BROADCAST',spacing:18,facades:['35','33','31','26'],ground:'33',road:'31',sky:'18',fog:'#42231b',tint:0xcb8260},
 {name:'WRONG WEATHER ORCHARD',spacing:26,facades:['28','22','26','20'],ground:'28',road:'23',sky:'21',fog:'#9c446f',tint:0xffb4d9},
 {name:'THE CLOTHING COUNCIL',spacing:20,facades:['29','17','25','31'],ground:'30',road:'33',sky:'34',fog:'#564225',tint:0xffe095},
 {name:'FOREST FOLD',spacing:24,facades:['18','22','23','28'],ground:'22',road:'32',sky:'22',fog:'#1d3b36',tint:0x97c3b0},
 {name:'PUBLIC DREAM',spacing:26,facades:['24','20','16','26'],ground:'20',road:'30',sky:'34',fog:'#361480',tint:0xffffff},
 {name:'RECEIPT QUARTER',spacing:18,facades:['19','35','27','32'],ground:'31',road:'32',sky:'21',fog:'#595549',tint:0xd7cfb6},
 {name:'STAIRWELL CITY',spacing:22,facades:['33','31','17','16'],ground:'33',road:'23',sky:'18',fog:'#49282d',tint:0xba8eae},
 {name:'LAST KNOWN ADDRESS',spacing:20,facades:['27','24','19','20'],ground:'32',road:'28',sky:'21',fog:'#171228',tint:0x9c94cf}
];
const BASE_RESIDENTS=residents.map(r=>({...r,origin:r.origin?.slice()}));
const BASE_ITEMS=itemDefs.map(it=>({...it}));
let roadSpacing=24;
function randomFrom(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,rng){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function configureLevel(){
 const level=LEVELS[state.level];roadSpacing=level.spacing;
 residents.splice(0,residents.length,...BASE_RESIDENTS.map(r=>({...r,origin:r.origin?.slice()})));
 itemDefs.splice(0,itemDefs.length,...BASE_ITEMS.map(it=>({...it})));
 const rng=randomFrom((state.seed+state.level*982451653)>>>0),spriteOrder=shuffle(Array.from({length:24},(_,i)=>i),rng);
 residents.forEach((r,i)=>r.sprite=state.level===0&&state.legacyTown?i:spriteOrder[i]);
 if(state.level===0&&state.legacyTown)return;
 const points=[];const add=(x,z,axis)=>{if(Math.hypot(x,z-12)<4.5||Math.hypot(x,z+32)<5)return;if(points.every(p=>Math.hypot(p.x-x,p.z-z)>=4.5))points.push({x,z,axis});};
 for(const x of [-roadSpacing,0,roadSpacing])for(let z=-30;z<=30;z+=6)add(x,z,'z');
 for(const z of [-roadSpacing,0,roadSpacing])for(let x=-30;x<=30;x+=6)add(x,z,'x');
 const order=shuffle(points,rng);if(order.length<36)throw new Error('Neighborhood has too few addresses');
 residents.forEach((r,i)=>{const p=order[i];r.x=p.x;r.z=p.z;r.axis=p.axis;r.origin=[p.x,p.z];r.district=level.name;});
 itemDefs.forEach((it,i)=>{const p=order[24+i];it.x=p.x;it.z=p.z;});
 const intros=['I have been told to lose','The council confiscated','My other face borrowed','A crow filed a complaint about','This neighborhood refuses to acknowledge'];
 residents.forEach((r,i)=>{if(r.item===null){r.request+=' This is '+level.name.toLowerCase()+'. It was somewhere else last time.';return;}const it=itemDefs[r.item];const address=(it.x<0?'west':it.x>0?'east':'central')+' street, '+(it.z<0?'north end':'south end');r.hint=it.name+' · '+address;r.request=intros[Math.floor(rng()*intros.length)]+' my '+it.name.toLowerCase()+'. It is somewhere on the '+address+'. Bring it to me. I will approve your onward journey.';});
}


let renderer,scene,camera,ready=false,playing=false,paused=false,won=false,target=null;
let yaw=0,pitch=0,velocityY=0,feetY=0,jumpReady=true,time=0,last=performance.now(),bob=0;
const keys=new Set(),walls=[],solidMeshes=[],items=[],npcSprites=[],labels=[],floaters=[];
let npcImages=[],itemImages=[],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let state={collected:[],completed:[],met:[],pos:[0,12],yaw:0,pitch:0,level:0,seed:Math.floor(Math.random()*4294967296),visits:{},conquered:[],volume:.55};
try { const saved=JSON.parse(localStorage.getItem(SAVE));if(saved&&['collected','completed','met'].every(k=>Array.isArray(saved[k]))) {
 state={...state,...saved};if(!Number.isInteger(saved.level))state.legacyTown=true;for(const k of ['collected','completed','met'])state[k]=[...new Set(state[k].filter(i=>Number.isInteger(i)&&i>=0&&i<(k==='met'?residents.length:QUEST_COUNT)))];
 if(!Array.isArray(state.pos)||!state.pos.every(Number.isFinite))state.pos=[0,12];
 }} catch {}

state.level=Number.isInteger(state.level)&&state.level>=0&&state.level<10?state.level:0;
state.seed=Number.isInteger(state.seed)?state.seed>>>0:Math.floor(Math.random()*4294967296);
state.visits=state.visits&&typeof state.visits==='object'&&!Array.isArray(state.visits)?state.visits:{};
state.conquered=Array.isArray(state.conquered)?[...new Set(state.conquered.filter(n=>Number.isInteger(n)&&n>=0&&n<10))]:[];
state.volume=Number.isFinite(state.volume)?Math.max(0,Math.min(1,state.volume)):.55;
function snapshotVisit(){return {collected:state.collected.slice(),completed:state.completed.slice(),met:state.met.slice(),pos:state.pos.slice(),yaw:state.yaw,pitch:state.pitch};}
function save(){if(!camera||won)return;state.pos=[camera.position.x,camera.position.z];state.yaw=yaw;state.pitch=pitch;state.visits[state.level]=snapshotVisit();try{localStorage.setItem(SAVE,JSON.stringify(state));}catch{}}
function note(msg){$('toast').textContent=msg;$('toast').classList.add('visible');clearTimeout(note.timer);note.timer=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
function texture(image,rx=1,ry=1){const t=typeof image==='string'?new THREE.TextureLoader().load('assets/'+image):new THREE.CanvasTexture(image);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return t;}
function material(tex,color=0xffffff){return new THREE.MeshBasicMaterial({map:tex,color});}
function box(x,y,z,w,h,d,mat,collision=false){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);scene.add(m);if(collision){walls.push({x,z,w,d});solidMeshes.push(m);}return m;}
function signCanvas(text,bg='#a00025',fg='#dfff00',size=512){const c=document.createElement('canvas');c.width=size;c.height=size/2;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);g.strokeStyle=fg;g.lineWidth=5;g.setLineDash([12,8]);g.strokeRect(8,8,c.width-16,c.height-16);g.fillStyle=fg;g.font='bold 42px monospace';g.textAlign='center';text.split('\n').forEach((s,i)=>g.fillText(s,c.width/2,87+i*58));return c;}
function billboard(img,x,y,z,w,h,opts={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture(img),transparent:true,alphaTest:.1,side:THREE.DoubleSide,...opts}));m.position.set(x,y,z);scene.add(m);return m;}
function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Could not load '+src));im.src='assets/'+src;});}
// Atlas cells are trimmed to their alpha bounds, preserving the generated cutouts.
function atlasCells(image,cols,rows){const result=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
 const cw=Math.floor(image.width/cols),ch=Math.floor(image.height/rows),c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d');g.drawImage(image,x*cw,y*ch,cw,ch,0,0,cw,ch);
 const data=g.getImageData(0,0,cw,ch).data;let minX=cw,minY=ch,maxX=0,maxY=0;for(let j=0;j<ch;j++)for(let i=0;i<cw;i++)if(data[(j*cw+i)*4+3]>35){minX=Math.min(minX,i);maxX=Math.max(maxX,i);minY=Math.min(minY,j);maxY=Math.max(maxY,j);}
 if(minX>maxX)throw new Error('An atlas cell is empty');const cut=document.createElement('canvas');cut.width=maxX-minX+5;cut.height=maxY-minY+5;cut.getContext('2d').drawImage(c,minX,minY,maxX-minX+1,maxY-minY+1,2,2,maxX-minX+1,maxY-minY+1);result.push(cut);
 }return result;}

const GRAFFITI=[{"file": "graffiti-01.png", "aspect": 1.0968}, {"file": "graffiti-02.png", "aspect": 1.0669}, {"file": "graffiti-03.png", "aspect": 0.8728}, {"file": "graffiti-04.png", "aspect": 0.6133}, {"file": "graffiti-05.png", "aspect": 0.9916}, {"file": "graffiti-06.png", "aspect": 0.7722}, {"file": "graffiti-07.png", "aspect": 0.685}, {"file": "graffiti-08.png", "aspect": 0.5173}, {"file": "graffiti-09.png", "aspect": 0.8319}, {"file": "graffiti-10.png", "aspect": 0.9888}, {"file": "graffiti-11.png", "aspect": 0.3504}, {"file": "graffiti-12.png", "aspect": 0.6}];
function graffitiLayout(seed,level){
 const rng=randomFrom((seed+level*91621+5551)>>>0),S=LEVELS[level].spacing,W=S-10;
 const order=GRAFFITI.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 const result=[];let n=0;
 for(const x of [-S/2,S/2])for(const z of [-S/2,S/2])for(let side=0;side<4;side++)for(let k=0;k<2;k++){
  const index=order[n++%order.length],aspect=GRAFFITI[index].aspect;
  let width=1.5+rng()*1.5,height=width/aspect;if(height>3){height=3;width=height*aspect;}
  const offset=(k?1:-1)*W*.22+(rng()-.5)*W*.08,sign=side%2?-1:1;
  const position=side<2?[x+offset,1.7+rng()*1.2,z+sign*(W/2+.12)]:[x+sign*(W/2+.12),1.7+rng()*1.2,z+offset];
  const yaw=[0,Math.PI,Math.PI/2,-Math.PI/2][side];result.push({index,width,height,position,yaw,tilt:(rng()-.5)*.22});
 }return result;
}
function buildGraffiti(){
 const mats=GRAFFITI.map(g=>new THREE.MeshBasicMaterial({map:texture(g.file),transparent:true,depthWrite:false,alphaTest:.025,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 for(const d of graffitiLayout(state.seed,state.level)){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(d.width,d.height),mats[d.index]);m.position.set(...d.position);m.rotation.set(0,d.yaw,d.tilt);m.userData.graffiti=d.index;m.renderOrder=2;scene.add(m);
 }
}

function buildWorld(){
 const theme=LEVELS[state.level],rng=randomFrom(state.seed+state.level*17777),S=roadSpacing,W=S-10;
 scene=new THREE.Scene();scene.background=new THREE.Color(theme.fog);scene.fog=new THREE.Fog(theme.fog,state.level===5?22:48,state.level===5?85:130);
 camera=new THREE.PerspectiveCamera(76,innerWidth/innerHeight,.08,350);camera.rotation.order='YXZ';camera.position.set(...[state.pos[0],1.7,state.pos[1]]);yaw=Number.isFinite(state.yaw)?state.yaw:0;pitch=Number.isFinite(state.pitch)?state.pitch:0;
 const skyMats=[...Array(2).fill('world'+theme.sky+'.jpg'),'world34.jpg','world22.jpg',...Array(2).fill('world'+theme.sky+'.jpg')].map(src=>new THREE.MeshBasicMaterial({map:texture(src),side:THREE.BackSide,fog:false}));
 const sky=new THREE.Mesh(new THREE.BoxGeometry(220,220,220),skyMats);sky.rotation.y=.35;scene.add(sky);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(88,88),material(texture('world'+theme.ground+'.jpg',state.level===0?35:12,12),theme.tint));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;scene.add(ground);
 const roadMat=material(texture('world'+theme.road+'.jpg',2,18),state.level===0?0x777e98:0xcccccc);
 for(const x of [-roadSpacing,0,roadSpacing])box(x,0,0,8,.025,76,roadMat);
 for(const z of [-roadSpacing,0,roadSpacing])box(0,.015,z,76,.025,8,roadMat);
 box(0,.04,0,15,.04,15,material(texture('world28.jpg',5,5)));
 const lane=material(null,0xd7e7a0);for(const x of [-roadSpacing,0,roadSpacing])for(let z=-33;z<=33;z+=5)if(Math.abs(z)>8&&Math.abs(Math.abs(z)-24)>5)box(x,.055,z,.15,.01,1.6,lane);
 for(const z of [-roadSpacing,0,roadSpacing])for(let x=-33;x<=33;x+=5)if(Math.abs(x)>8&&Math.abs(Math.abs(x)-24)>5)box(x,.07,z,1.6,.01,.15,lane);
 const brick=material(texture('world31.jpg',4,3)),metal=material(texture('world33.jpg',2,4));
 const facades=theme.facades.map(id=>'world'+id+'.jpg').map(im=>material(texture(im,3,2))); 
 let seed=0;for(const x of [-S/2,S/2])for(const z of [-S/2,S/2]){
 const h=state.level===0?7+(seed%3)*3:5+Math.floor(rng()*11);box(x,h/2,z,W,h,W,facades[seed],true);
 box(x,h+.2,z,W+.6,.4,W+.6,material(null,seed%2?0xcf002c:0x03c6af));
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){
 const wx=x-W*.32+col*W*.32,yy=1.4+row*2.5;
 box(wx,yy,z-W/2-.035,1.65,1.55,.05,material(null,(row+col)%3?0x233969:0xc5ff00));
 box(wx,yy,z+W/2+.035,1.65,1.55,.05,material(null,(row+col)%2?0x361953:0x77ccce));
 box(x-W/2-.035,yy,z-W*.32+col*W*.32,.05,1.55,1.65,material(null,0x295185));box(x+W/2+.035,yy,z-W*.32+col*W*.32,.05,1.55,1.65,material(null,0x581333));
 }
 const poster=new THREE.Mesh(new THREE.PlaneGeometry(4.2,4.2),material(texture(['world24.jpg','world25.jpg','world20.jpg','world17.jpg'][seed])));poster.position.set(x,4,z+(z>0?-W/2-.07:W/2+.07));poster.rotation.y=z>0?Math.PI:0;scene.add(poster);
 seed++;
 }
 // Perimeter buildings frame every street without blocking the main routes.
 for(let k=0;k<8;k++){const p=-31+k*9,h=5+(k%3)*3;box(-37,h/2,p,5,h,7,material(texture(['world31.jpg','world33.jpg','world19.jpg','world18.jpg'][k%4],2,3)),true);box(37,h/2,p,5,h,7,material(texture(['world33.jpg','world23.jpg','world26.jpg','world22.jpg'][k%4],2,3)),true);}
 for(let k=0;k<8;k++){const p=-31+k*9;if(Math.abs(p)<7)continue;box(p,4,-37,7,8,5,brick,true);box(p,4,37,7,8,5,metal,true);}
 // Posters and transmissions deliberately disregard a common visual theme.
 const slogans=[['YOU ARE\nTHE LOCAL FILE',-4,-1],['WELCOME TO\nMY WWWEB WORLD',0,-28],['NO REFUNDS\nFOR YESTERDAY',-24,27],['FEELINGS\nDEPARTMENT',27,24],['YOUR SUCCESS\nHAS AN ADDRESS',24,-27]];
 for(const [txt,x,z]of slogans){const s=billboard(signCanvas(txt),x,5,z,6,3);labels.push(s);box(x,2,z,.12,4,.12,material(null,0x151326));}
 for(let i=0;i<10;i++){const ang=i/10*Math.PI*2,r=32,im=['world16.jpg','world20.jpg','world26.jpg','world27.jpg','world29.jpg','world35.jpg'][i%6];const m=billboard(im,Math.cos(ang)*r,9+(i%3)*2,Math.sin(ang)*r,5,5);floaters.push(m);}
 const wire=new THREE.MeshBasicMaterial({color:0xfe2ddd,wireframe:true});for(const x of [-24,24]){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.8,0),wire);m.position.set(x,10,0);scene.add(m);floaters.push(m);}
 residents.forEach((r,i)=>{const im=npcImages[r.sprite],height=r.item===null?2.5+(i%4)*.35:3.3+(i%3)*.3;const m=billboard(im,r.x,height/2,r.z,height*im.width/im.height,height);npcSprites.push(m);r.mesh=m;
 const name=billboard(signCanvas(r.name.split(' / ')[0],'#131325','#ccff00'),r.x,4.2,r.z,3.3,.75);labels.push(name);r.label=name;
 box(r.x,.08,r.z,2.4,.1,2.4,material(null,0x19192e));
 });
 itemDefs.forEach((it,i)=>{const im=itemImages[i],height=i===2?1.2:.85;const m=billboard(im,it.x,1.1,it.z,height*im.width/im.height,height);m.visible=!state.collected.includes(i)&&!state.completed.includes(i);items.push(m);it.mesh=m;
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.8,1,.3,8),material(texture('world30.jpg')));base.position.set(it.x,.15,it.z);scene.add(base);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.8,.025,5,20),material(null,0xc6ff00));ring.rotation.x=-Math.PI/2;ring.position.set(it.x,.32,it.z);scene.add(ring);it.ring=ring;
 });
 box(-2.7,2.3,-32,.6,4.6,.6,material(null,0xa7ff00),true);box(2.7,2.3,-32,.6,4.6,.6,material(null,0xa7ff00),true);box(0,4.5,-32,6,.6,.6,material(null,0xa7ff00));
 const gate=billboard(signCanvas('EXIT PENDING\nTWELVE SIGNATURES','#19132c','#aaff00'),0,4.5,-31.6,5.2,1.8);labels.push(gate);itemDefs.gate=gate;
 const veil=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4),new THREE.MeshBasicMaterial({color:0xff00aa,transparent:true,opacity:.45,side:THREE.DoubleSide}));veil.position.set(0,2,-32);scene.add(veil);itemDefs.veil=veil;
 if(blocked(camera.position.x,camera.position.z)){camera.position.set(0,1.7,12);}
 buildGraffiti();
 buildOddities();
 updateHUD();
}

function buildOddities(){
 // Low polygon crows: each has a body, beak, tail and two independently flapping wings.
 const black=material(null,0x11101b),beakMat=material(null,0x998a6c);
 const wingGeo=new THREE.BufferGeometry();wingGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.65,0,.16,.42,0,-.32],3));wingGeo.computeVertexNormals();
 const wingMat=new THREE.MeshBasicMaterial({color:0x171021,side:THREE.DoubleSide});
 for(let i=0;i<22+(state.level%3)*4;i++){
  const crow=new THREE.Group();
  const body=new THREE.Mesh(new THREE.SphereGeometry(.13,6,4),black);body.scale.set(1,.8,1.9);crow.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.10,6,4),black);head.position.set(0,.08,-.20);crow.add(head);
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.045,.17,4),beakMat);beak.rotation.x=-Math.PI/2;beak.position.set(0,.075,-.34);crow.add(beak);
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.11,.28,3),black);tail.rotation.x=Math.PI/2;tail.position.z=.29;crow.add(tail);
  const left=new THREE.Mesh(wingGeo,wingMat),right=new THREE.Mesh(wingGeo,wingMat);right.scale.x=-1;crow.add(left,right);scene.add(crow);
  crows.push({mesh:crow,left,right,phase:i*2.399,radius:9+(i%5)*4,altitude:5+(i%7)*1.4,speed:.12+(i%4)*.035});
 }
 // A disagreeable civic monument: an enormous employee rotating above a tiny plinth.
 const mayor=billboard(itemImages[10],-roadSpacing,9,0,5,8);oddities.push({kind:'mayor',mesh:mayor});
 billboard(signCanvas('EMPLOYEE OF\nTHE ENTIRE YEAR','#ffed00','#111111'),-roadSpacing,3.4,0,3.6,1.7);
 // Floating carpets made from the misty forest and road photographs.
 for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(3.3,4.2),material(texture(i%2?'world23.jpg':'world22.jpg')));m.material.side=THREE.DoubleSide;m.rotation.x=-Math.PI/2;m.position.set(-2+i*.8,6+i*.7,6-i*2);scene.add(m);oddities.push({kind:'carpet',mesh:m,base:m.position.y,phase:i});}
 // Eyes in public fountains; all decorations stay clear of the walking routes.
 for(const [x,z,img] of [[-30,-8,'world18.jpg'],[30,16,'world22.jpg']]){
  box(x,1.2,z,3,2.4,1,material(texture(img)));
  const eye=billboard('world16.jpg',x,3.4,z,2,2);labels.push(eye);
 }
 const portal=new THREE.Mesh(new THREE.TorusGeometry(2,.16,5,32),material(texture('world20.jpg',2,1)));portal.position.set(0,7,-32);scene.add(portal);oddities.push({kind:'portal',mesh:portal});
 // Silhouette echoes: tiny upside-down neighbors haunt the rooftops.
 for(let i=0;i<8;i++){const m=billboard(npcImages[4+i*2],i%2?-12:12,12+(i%4),i<4?-12:12,1.1,2.5);m.rotation.z=Math.PI;oddities.push({kind:'echo',mesh:m,base:m.position.y,phase:i});}
}
function animateNeighborhood(){
 residents.forEach((r,i)=>{if(!r.wander||reduced)return;const offset=Math.sin(time*.22+i)*(state.level===0?2.2:1.2);r[r.axis]=r.origin[r.axis==='x'?0:1]+offset;r.mesh.position.set(r.x,r.mesh.position.y,r.z);r.label.position.set(r.x,4.2,r.z);});
 crows.forEach((c,i)=>{const a=c.phase+(reduced?0:time*c.speed),x=Math.cos(a)*c.radius,z=Math.sin(a)*c.radius;
  c.mesh.position.set(x,c.altitude+(reduced?0:Math.sin(time*.9+c.phase)*.65),z);c.mesh.rotation.y=Math.PI-a;c.mesh.rotation.z=Math.sin(a)*.13;
  const flap=reduced?.15:Math.sin(time*11+c.phase)*.7;c.left.rotation.z=flap;c.right.rotation.z=-flap;
 });
 oddities.forEach(o=>{const m=o.mesh;if(o.kind==='mayor'){m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);m.position.y=9+(reduced?0:Math.sin(time*.7)*.5);m.rotation.z=reduced?0:Math.sin(time*.4)*.12;}
  if(o.kind==='carpet')m.position.y=o.base+(reduced?0:Math.sin(time*.8+o.phase)*.35);
  if(o.kind==='portal'){m.rotation.z=reduced?0:time*.12;m.scale.setScalar(1+state.completed.length*.025);}
  if(o.kind==='echo'){m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);m.position.y=o.base+(reduced?0:Math.sin(time+o.phase)*.3);}
 });
}
const LOGO_CAPTIONS=["You are the Hand","Be a little bit more like your dad","Just Run","Jumping is now included","Your head is now hurting","1+1=8","Some numbers are funny, like 69, 420 and 404","Say your name","My name is","Have Fun!","I'm sick like","Also checkout iPad Baby!","Fall down the cliff, but don't","Wash your hands before playing"];
// Rejection sampling avoids modulo bias: exactly one winning outcome in 88,888.
function rareLogoRoll(draw=()=>crypto.getRandomValues(new Uint32Array(1))[0]){
 const limit=Math.floor(4294967296/88888)*88888;let n;do{n=draw();}while(n>=limit);return n%88888===0;
}
let handTimer,rainTimer,ambientContext=null,ambientWait=8,atmosphereOn=true;
const ambientNodes=new Set();
function initializeTitleSecrets(){
 const rare=rareLogoRoll();$('logoCaption').textContent=rare?"404, I don't want you to play this game":LOGO_CAPTIONS[Math.floor(Math.random()*LOGO_CAPTIONS.length)];
 document.querySelector('.logo').classList.toggle('rareLogo',rare);
 const junk=$('homeJunk');
 for(let i=0;i<7;i++){const n=document.createElement('span');n.className='titleDoodle';n.textContent=['↗','✋','404','???','@','88888','↙'][i];n.style.cssText=`left:${5+Math.random()*90}%;top:${Math.random()*95}%;color:${['#ff00cf','#0ff','#ff0'][i%3]};transform:rotate(${Math.random()*80-40}deg);font-size:${22+Math.random()*35}px`;junk.append(n);}
 const normalized=id=>$(id).value.trim().toLowerCase();
 $('visitorName').oninput=()=>{const name=normalized('visitorName');if(name==='hand'){clearTimeout(handTimer);$('eggHand').hidden=false;handTimer=setTimeout(()=>{$('eggHand').hidden=true;},1500);}if(name==='penis')rainEgg('( ͡° ͜ʖ ͡°)');};
 $('visitorAge').oninput=()=>{const age=normalized('visitorAge');if(age==='69')rainEgg('XD');if(age==='67'){keys.clear();$('wrongAge').hidden=false;$('wrongAgeClose').focus();}};
 $('visitorFunnyWord').oninput=()=>{const word=normalized('visitorFunnyWord');$('wordReply').textContent=word==='penis'?"thats a really funny word":word==='fuck'?'YOU.':'';};
 $('wrongAgeClose').onclick=closeWrongAge;
 $('atmosphereToggle').onclick=()=>{atmosphereOn=!atmosphereOn;if(!atmosphereOn)stopAtmosphere();$('atmosphereToggle').textContent=atmosphereOn?'STRANGE SOUNDS ON':'STRANGE SOUNDS OFF';};
 document.addEventListener('click',()=>{const Context=window.AudioContext||window.webkitAudioContext;if(Context&&atmosphereOn&&state.volume){ambientContext??=new Context();ambientContext.resume().catch(()=>{});}});
}
function closeWrongAge(){$('wrongAge').hidden=true;$('visitorAge').focus();$('visitorAge').select();}
function rainEgg(text){
 clearTimeout(rainTimer);const rain=$('eggRain');rain.replaceChildren();
 for(let i=0;i<30;i++){const n=document.createElement('span');n.textContent=text;n.style.cssText=`left:${Math.random()*95}%;font-size:${17+Math.random()*22}px;animation-delay:${Math.random()*.3}s;animation-duration:${1.2+Math.random()*.5}s`;rain.append(n);}
 rainTimer=setTimeout(()=>rain.replaceChildren(),2000);
}
function stopAtmosphere(){for(const entry of ambientNodes){try{entry.osc.stop();}catch{}entry.osc.disconnect();entry.gain.disconnect();}ambientNodes.clear();}
function ambientTick(dt){
 if(!atmosphereOn||state.volume===0){stopAtmosphere();return;}
 ambientWait-=dt;if(ambientWait>0)return;ambientWait=7+Math.random()*15;
 const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
 ambientContext??=new Context();if(ambientContext.state!=='running'){ambientContext.resume().catch(()=>{});return;}
 const now=ambientContext.currentTime,type=Math.floor(Math.random()*4),duration=[.45,.8,1.3,.6][type];
 for(let i=0;i<(type===2?3:1);i++){
  const osc=ambientContext.createOscillator(),gain=ambientContext.createGain(),entry={osc,gain};
  osc.type=['sine','triangle','sine','square'][type];const hz=[480,95,220,820][type]*(1+Math.random()*.5)*(i+1);
  osc.frequency.setValueAtTime(hz,now);osc.frequency.exponentialRampToValueAtTime(hz*[.3,1.8,.7,.25][type],now+duration);
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(state.volume*.045,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain);gain.connect(ambientContext.destination);ambientNodes.add(entry);osc.onended=()=>{osc.disconnect();gain.disconnect();ambientNodes.delete(entry);};osc.start(now);osc.stop(now+duration);
 }
}

function randomHomepage(){
 const junk=$('homeJunk'),pictures=['world20.jpg','world26.jpg','world27.jpg','world19.jpg','world35.jpg','world16.jpg','world13-cutout.png','world09-cutout.png','world12-cutout.png','resident-18.png','resident-07.png','world04-cutout.png'];
 pictures.forEach((src,i)=>{const img=new Image();img.src='assets/'+src;img.alt='';img.className='homepageScrap';const left=i<6?[3,30,53,74,90,83][i]:[2,94,72,88,46,22][i-6];const top=i<6?[3,0,5,2,23,62][i]:[62,56,78,36,82,81][i-6];img.style.cssText=`left:${left+Math.random()*3}%;top:${top+Math.random()*5}%;width:${70+Math.random()*90}px;transform:rotate(${Math.random()*50-25}deg)`;junk.append(img);});
 const pool=['THIS PAGE HAS HANDS','best viewed with eyes','CLICK HERE TO BE HERE','webring of unrelated people','UNDER CONSTRUCTION FOREVER','NO HIT COUNTER CAN SAVE YOU','your address has been eaten','DO NOT TRUST THE SECOND SHOE','the birds have your receipt','THIS BUTTON OWES ME MONEY','one hand washes the website','somebody parked in my dream','PLEASE RETURN MY THURSDAY','there is soup in the motherboard','you look familiar to the pavement','ALL PANTS ARE LOCAL','THE SKY IS RENTED','free elbows / inquire within','your neighbor is buffering','THIS IS MY GOOD FACE','the gutter knows your password','HELPING IS A CONTACT SPORT','NO REFUNDS ON THE MOON','a crow approved this message','objects may remember you','EVERY WINDOW IS SOMEONE ELSE','PLEASE STAND INSIDE YOUR NAME','i have misplaced the horizon','the grass is doing its best','THIS STREET HAS A MOUTH'];
 const phrases=pool.map(txt=>({txt,rank:Math.random()})).sort((a,b)=>a.rank-b.rank).slice(0,8).map(p=>p.txt);
 phrases.forEach((txt,i)=>{const b=document.createElement('span');b.className='junkText junkText'+i;b.textContent=txt;b.style.transform=`rotate(${Math.random()*16-8}deg)`;junk.append(b);});
 initializeTitleSecrets();
 $('visitorCount').textContent=String(Math.floor(Math.random()*999999)).padStart(6,'0');
}

function blocked(x,z){if(Math.abs(x)>33.7||Math.abs(z)>34)return true;return walls.some(w=>Math.abs(x-w.x)<w.w/2+.38&&Math.abs(z-w.z)<w.d/2+.38);}
const ray=new THREE.Raycaster(),forward=new THREE.Vector3(),pos=new THREE.Vector3();
function getTarget(){
 camera.getWorldDirection(forward);let best=null,bestScore=-1;
 const possible=[...residents.map((r,i)=>({type:'npc',i,obj:r,mesh:r.mesh})),...itemDefs.map((it,i)=>({type:'item',i,obj:it,mesh:it.mesh})).filter(t=>t.mesh.visible),{type:'exit',obj:{x:0,z:-32},mesh:itemDefs.gate}];
 for(const t of possible){pos.set(t.obj.x,t.type==='npc'?1.9:t.type==='exit'?1.7:1.1,t.obj.z);const dist=pos.distanceTo(camera.position);if(dist>4.5)continue;const dir=pos.clone().sub(camera.position).normalize(),dot=dir.dot(forward);if(dot<.72)continue;ray.set(camera.position,dir);const hit=ray.intersectObjects(solidMeshes,false)[0];if(hit&&hit.distance<dist-.3)continue;const score=dot*3-dist*.12;if(score>bestScore){best=t;bestScore=score;}}
 return best;
}
function dialogue(name,text){$('speaker').textContent=name;$('speech').textContent=text;$('dialog').hidden=false;keys.clear();document.exitPointerLock?.();$('prompt').textContent='';}
function closeDialog(){$('dialog').hidden=true;keys.clear();stopVoice();save();captureMouse();}
function interact(){if(!playing||paused||won||!$('journal').hidden||!$('mapPanel').hidden)return;if(!$('dialog').hidden){closeDialog();return;}target=getTarget();if(!target){note('Move closer and face an object or resident.');return;}
 if(target.type==='item'){const i=target.i;state.collected.push(i);items[i].visible=false;itemDefs[i].ring.visible=false;note('COLLECTED: '+itemDefs[i].name);effect('menu',.3);$('hand').animate([{transform:'translateY(0)'},{transform:'translate(-30px,-45px)'},{transform:'translateY(0)'}],{duration:450});updateHUD();save();}
 else if(target.type==='npc'){const i=target.i,r=residents[i];const delivered=!state.completed.includes(i)&&r.item!==null&&state.collected.includes(r.item);voiceNPC(i,delivered);if(delivered)effect('delivery',.5);if(!state.met.includes(i))state.met.push(i);
 if(r.item===null){dialogue(r.name,r.request+' '+(state.completed.length>5?'The neighborhood has noticed your helping. The sky is taking notes.':''));}
 else if(state.completed.includes(i)){dialogue(r.name,'My paperwork is complete. '+(allApproved()?'You can leave through the green gate north of the plaza.':'The others are still waiting for you. Try the map if you lose your place.'));}
 else if(state.collected.includes(r.item)){state.collected=state.collected.filter(n=>n!==r.item);state.completed.push(i);dialogue(r.name,r.after);note('APPROVAL '+state.completed.length+' / '+QUEST_COUNT+' — '+r.name.split(' / ')[0]);}
 else dialogue(r.name,r.request);updateHUD();save();
 }else if(allApproved()){finish();}else dialogue('DEPARTURE DEPARTMENT','Your presence has not been approved for termination. Return all twelve lost objects to their residents. You have '+state.completed.length+' of '+QUEST_COUNT+' signatures.');
}
function updateHUD(){
 $('stampCount').textContent=state.completed.length+' / '+QUEST_COUNT+' APPROVALS · LEVEL '+(state.level+1)+' / 10';
 $('missionTitle').textContent=LEVELS[state.level].name;$('missionText').textContent='Return twelve lost objects. The north gate leads to the next neighborhood.';$('inventory').replaceChildren();
 for(let i=0;i<QUEST_COUNT;i++){const slot=document.createElement('div');slot.className='slot';if(state.collected.includes(i)){const img=new Image();img.src=itemImages[i].toDataURL();img.alt=itemDefs[i].name;slot.append(img);const label=document.createElement('span');label.textContent=itemDefs[i].short;slot.append(label);}else{slot.classList.add('empty');const label=document.createElement('span');label.textContent=state.completed.includes(i)?'DELIVERED ✓':'EMPTY';slot.append(label);}$('inventory').append(slot);}
 $('requestList').replaceChildren();residents.forEach((r,i)=>{if(r.item===null)return;const a=document.createElement('article');if(state.completed.includes(i))a.className='done';const img=new Image();img.src=npcImages[r.sprite].toDataURL();img.alt='Collage resident '+r.name;const info=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=(i+1)+'. '+r.name;p.textContent=state.completed.includes(i)?'SIGNED ✓ · object returned':state.met.includes(i)?r.hint+' · '+(state.collected.includes(r.item)?'in your pocket, ready to deliver':'missing'):'Request unknown. Find this resident in '+r.district.toLowerCase()+'.';info.append(h,p);a.append(img,info);$('requestList').append(a);});
 if(allApproved()){$('missionTitle').textContent='NEIGHBORHOOD APPROVED.';$('missionText').textContent='Use the green north gate to travel onward. '+(10-state.conquered.length)+' neighborhoods await approval.';$('pocketMessage').textContent='ONE NEW NOTIFICATION: you may leave';itemDefs.veil.visible=false;itemDefs.gate.material.map.dispose();itemDefs.gate.material.map=texture(signCanvas('NEXT NEIGHBORHOOD\nNORTH GATE','#aaff00','#111125'));itemDefs.gate.material.needsUpdate=true;}
 else $('pocketMessage').textContent=state.collected.length?'Somebody is waiting for these.':'NO NEW NOTIFICATIONS\nthat\'s probably good';
}
const AUDIO_MANIFEST={"music": ["level-01.mp3", "level-02.mp3", "level-03.mp3", "level-04.mp3", "level-05.mp3", "level-06.mp3", "level-07.mp3", "level-08.mp3", "level-09.mp3", "level-10.mp3"], "voices": [{"group": 1, "file": "voice-1-item-delivered.wav", "delivery": true}, {"group": 1, "file": "voice-1-talk1.wav", "delivery": false}, {"group": 1, "file": "voice-1-talk2.wav", "delivery": false}, {"group": 1, "file": "voice-1-talk3.wav", "delivery": false}, {"group": 2, "file": "voice-2-item-delivered.wav", "delivery": true}, {"group": 2, "file": "voice-2-talk1.wav", "delivery": false}, {"group": 2, "file": "voice-2-talk2.wav", "delivery": false}, {"group": 2, "file": "voice-2-talk3.wav", "delivery": false}, {"group": 2, "file": "voice-2-talk4.wav", "delivery": false}], "effects": {"menu": "menu_click.wav", "back": "menu_back.wav", "jump": "jump.wav", "land": "landing.wav", "footstep": "walking.wav", "delivery": "item-delivered.wav"}, "menuMusic": "main-menu.mp3"};

let musicPlayer=null,voicePlayer=null,lastStep=0,audioNotice=false;
const activeEffects=new Set();
function audioURL(src){return 'assets/audio/'+src;}
function effect(name,volume=.45,rate=1){const src=AUDIO_MANIFEST.effects[name];if(!src||state.volume===0)return;const a=new Audio(audioURL(src));a.volume=Math.min(1,state.volume*volume);a.playbackRate=rate;activeEffects.add(a);a.onended=a.onerror=()=>activeEffects.delete(a);a.play().catch(()=>activeEffects.delete(a));}
function stopVoice(){if(voicePlayer){voicePlayer.pause();voicePlayer=null;}setMusicVolume();}
function setMusicVolume(){if(musicPlayer)musicPlayer.volume=state.volume*(voicePlayer?.paused===false?.14:.48);}
function voiceNPC(index,delivered=false){stopVoice();const group=index%2+1,list=AUDIO_MANIFEST.voices.filter(v=>v.group===group&&v.delivery===delivered);if(!list.length)return;voicePlayer=new Audio(audioURL(list[Math.floor(Math.random()*list.length)].file));voicePlayer.volume=state.volume*.92;const current=voicePlayer;current.onended=()=>{if(voicePlayer===current){voicePlayer=null;setMusicVolume();}};current.play().then(setMusicVolume).catch(()=>{if(voicePlayer===current)voicePlayer=null;setMusicVolume();});}
function startMusic(){
 const src=AUDIO_MANIFEST.music[state.level];if(musicPlayer)musicPlayer.pause();
 const player=$('musicTrack');player.hidden=!src;musicPlayer=src?player:null;if(musicPlayer){musicPlayer.src=audioURL(src);musicPlayer.loop=true;setMusicVolume();musicPlayer.play().catch(()=>{if(!audioNotice){audioNotice=true;note('Click SOUND to enable the local broadcast.');}});}else{player.pause();player.removeAttribute('src');player.load();}updateSoundLabel();
}
function startMenuMusic(){
 if(playing||!AUDIO_MANIFEST.menuMusic)return;
 const player=$('musicTrack');musicPlayer=player;player.src=audioURL(AUDIO_MANIFEST.menuMusic);player.loop=true;setMusicVolume();
 player.play().then(()=>{$('menuMusic').textContent='♪ MENU THEME ON';}).catch(()=>{$('menuMusic').textContent='♪ PLAY MENU THEME';});
}
$('menuMusic').onclick=()=>{if(musicPlayer&&!musicPlayer.paused){musicPlayer.pause();$('menuMusic').textContent='♪ PLAY MENU THEME';}else startMenuMusic();};
function updateSoundLabel(){const src=AUDIO_MANIFEST.music[state.level];$('trackLabel').textContent=src?'LOCAL BROADCAST / TRACK '+String(state.level+1).padStart(2,'0'):'THIS NEIGHBORHOOD IS QUIET';$('soundButton').textContent=state.volume?'SOUND ON':'SOUND OFF';$('volume').value=Math.round(state.volume*100);}
function changeVolume(value){state.volume=Math.max(0,Math.min(1,value));setMusicVolume();if(voicePlayer)voicePlayer.volume=state.volume*.92;for(const a of activeEffects)a.volume=Math.min(a.volume,state.volume);updateSoundLabel();save();}

function enter(){if(!ready)return;const selected=Number($('startLevel').value);if(Number.isInteger(selected)&&selected!==state.level){switchLevel(selected);return;}playing=true;paused=false;won=false;$('start').hidden=true;$('pause').hidden=true;document.body.classList.add('playing');last=performance.now();keys.clear();startMusic();captureMouse();}
function pause(){if(!playing||won)return;paused=true;keys.clear();document.exitPointerLock?.();$('pause').hidden=false;if(musicPlayer)musicPlayer.pause();stopVoice();save();}
function resume(){paused=false;$('pause').hidden=true;keys.clear();last=performance.now();if(musicPlayer)musicPlayer.play().catch(()=>{});else startMusic();captureMouse();}
function reset(){try{localStorage.removeItem(SAVE);}catch{}location.reload();}

function disposeWorld(){
 const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const mat of(Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){materials.add(mat);if(mat.map)textures.add(mat.map);}});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
 for(const list of [walls,solidMeshes,items,npcSprites,labels,floaters,crows,oddities])list.length=0;
}
function switchLevel(index){
 if(!ready||!Number.isInteger(index)||index<0||index>=LEVELS.length)return;
 save();stopVoice();const visit=state.visits[index]||{collected:[],completed:[],met:[],pos:[0,12],yaw:0,pitch:0};
 state.level=index;for(const key of ['collected','completed','met'])state[key]=Array.isArray(visit[key])?visit[key].filter(n=>Number.isInteger(n)&&n>=0&&n<(key==='met'?24:12)):[];
 state.pos=Array.isArray(visit.pos)&&visit.pos.length===2&&visit.pos.every(Number.isFinite)?visit.pos.slice():[0,12];state.yaw=Number.isFinite(visit.yaw)?visit.yaw:0;state.pitch=Number.isFinite(visit.pitch)?visit.pitch:0;
 keys.clear();feetY=velocityY=0;target=null;time=0;lastStep=0;disposeWorld();configureLevel();buildWorld();resize();updateTravelMenus();
 for(const id of ['start','pause','journal','mapPanel','dialog','ending'])$(id).hidden=true;
 playing=true;paused=false;won=false;document.body.classList.add('playing');last=performance.now();startMusic();captureMouse();save();note('NEIGHBORHOOD '+(index+1)+' / 10 — '+LEVELS[index].name);
}
function updateTravelMenus(){
 for(const id of ['startLevel','pauseLevel']){const select=$(id);select.replaceChildren();LEVELS.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' / '+l.name+(state.conquered.includes(i)?' ✓':'');select.append(o);});select.value=state.level;}
 $('travelCounter').textContent=state.conquered.length+' / 10 NEIGHBORHOODS APPROVED';updateSoundLabel();
}
function finish(){
 if(!state.conquered.includes(state.level))state.conquered.push(state.level);save();updateTravelMenus();
 if(state.conquered.length<10){const next=Array.from({length:10},(_,i)=>(state.level+1+i)%10).find(i=>!state.conquered.includes(i));switchLevel(next);return;}
 won=true;document.exitPointerLock?.();$('ending').hidden=false;document.body.classList.remove('playing');keys.clear();stopVoice();if(musicPlayer)musicPlayer.pause();
}
function togglePanel(id){if(!playing||paused||won||!$('dialog').hidden)return;const open=$(id).hidden;$(id).hidden=!open;if(open){if(id==='journal')$('mapPanel').hidden=true;else $('journal').hidden=true;document.exitPointerLock?.();}keys.clear();save();if(!open)captureMouse();}
function mapDraw(){const c=$('map'),g=c.getContext('2d'),n=c.width,s=n/76,cx=x=>(x+38)*s,cz=z=>(z+38)*s;g.fillStyle='#101524';g.fillRect(0,0,n,n);g.strokeStyle='#3f5367';g.lineWidth=8*s;for(const v of [-roadSpacing,0,roadSpacing]){g.beginPath();g.moveTo(cx(v),0);g.lineTo(cx(v),n);g.stroke();g.beginPath();g.moveTo(0,cz(v));g.lineTo(n,cz(v));g.stroke();}
 g.fillStyle='#7d2144';walls.forEach(w=>g.fillRect(cx(w.x-w.w/2),cz(w.z-w.d/2),w.w*s,w.d*s));
 residents.forEach((r,i)=>{g.fillStyle=r.item===null?'#929bbc':state.completed.includes(i)?'#aaff00':'#ff69bd';g.beginPath();g.arc(cx(r.x),cz(r.z),5,0,7);g.fill();g.font='10px monospace';if(r.item!==null)g.fillText(String(i+1),cx(r.x)+8,cz(r.z)+3);});
 itemDefs.forEach((it,i)=>{if(!items[i].visible)return;g.fillStyle='#eaff00';g.fillRect(cx(it.x)-3,cz(it.z)-3,6,6);});g.fillStyle='#aaff00';g.fillRect(cx(-2),cz(-33),4*s,2*s);
 g.save();g.translate(cx(camera.position.x),cz(camera.position.z));g.rotate(-yaw);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-10);g.lineTo(-5,7);g.lineTo(5,7);g.closePath();g.fill();g.restore();
 g.fillStyle='#d3dee3';g.font='10px monospace';g.fillText('N ↑',8,16);g.fillText('LEVEL '+(state.level+1)+' / '+LEVELS[state.level].name,cx(-8),cz(2));
}
function frame(now){requestAnimationFrame(frame);if(!ready)return;const dt=Math.min((now-last)/1000,.045);last=now;time+=dt;
 const free=playing&&!paused&&!won&&$('dialog').hidden&&$('journal').hidden&&$('mapPanel').hidden;
 if(free){if(keys.has('ArrowLeft'))yaw+=dt*1.7;if(keys.has('ArrowRight'))yaw-=dt*1.7;if(keys.has('ArrowUp'))pitch=Math.min(.65,pitch+dt);if(keys.has('ArrowDown'))pitch=Math.max(-.65,pitch-dt);
 let f=Number(keys.has('KeyW'))-Number(keys.has('KeyS')),s=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));const norm=Math.hypot(f,s)||1,speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?7.3:4.2)*dt;f=f/norm*speed;s=s/norm*speed;
 const dx=-Math.sin(yaw)*f+Math.cos(yaw)*s,dz=-Math.cos(yaw)*f-Math.sin(yaw)*s;
 if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;
 if(keys.has('Space')&&feetY===0&&jumpReady){velocityY=4.4;jumpReady=false;effect('jump',.65);}if(!keys.has('Space'))jumpReady=true;
 const wasInAir=feetY>0;velocityY-=dt*12;feetY=Math.max(0,feetY+velocityY*dt);if(wasInAir&&feetY===0)effect('land',.7);if(feetY===0)velocityY=0;
 if(feetY===0&&Math.hypot(dx,dz)>.001&&time-lastStep>(speed/dt>6?.29:.43)){lastStep=time;effect('footstep',.48,.9+Math.random()*.2);}
 bob+=Math.hypot(dx,dz)*2.2;camera.position.y=1.7+feetY+(!reduced&&Math.hypot(dx,dz)>.001?Math.sin(bob*3)*.045:0);
 target=getTarget();$('prompt').textContent=target?target.type==='npc'?'E · TALK TO '+residents[target.i].name.split(' / ')[0]:target.type==='item'?'E · TAKE '+itemDefs[target.i].name:'E · '+(allApproved()?'NEXT NEIGHBORHOOD':'INSPECT GATE'):'';
 if(!reduced)$('hand').style.transform=`translate(${Math.sin(bob)*6}px,${Math.cos(bob*2)*6}px)`;
 }else $('prompt').textContent='';
 camera.rotation.set(pitch,yaw,0);
 animateNeighborhood();
 if(free)ambientTick(dt);else stopAtmosphere();
 for(const m of npcSprites)m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);
 for(const m of labels)m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);
 items.forEach((m,i)=>{m.rotation.y=Math.atan2(camera.position.x-m.position.x,camera.position.z-m.position.z);m.position.y=1.1+(reduced?0:Math.sin(time*2+i)*.12);itemDefs[i].ring.visible=m.visible;});
 if(!reduced)floaters.forEach((m,i)=>{m.rotation.y=time*.15+i;m.rotation.z=Math.sin(time*.4+i)*.08;});
 if(!$('mapPanel').hidden)mapDraw();
 const coord=v=>(v<0?'-':'+')+Math.abs(v).toFixed(0).padStart(2,'0');
 const heading=((Math.round(-yaw*180/Math.PI)%360)+360)%360;
 $('coordinates').textContent=`X ${coord(camera.position.x)} / Z ${coord(camera.position.z)} · ${['N','E','S','W'][Math.round(heading/90)%4]} ${heading}° / LEVEL ${state.level+1}/10 · ${allApproved()?'GATE OPEN':'SIGNAL FOUND'}`;
 renderer.render(scene,camera);
}
function resize(){if(!renderer)return;renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.35)*.8);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
$('enter').onclick=enter;$('fresh').onclick=reset;$('pauseButton').onclick=pause;$('resume').onclick=resume;$('restart').onclick=reset;$('again').onclick=reset;$('dialogClose').onclick=closeDialog;
$('startLevel').onchange=()=>{effect('menu',.3);};$('pauseLevel').onchange=()=>switchLevel(Number($('pauseLevel').value));
$('volume').oninput=e=>changeVolume(Number(e.target.value)/100);$('soundButton').onclick=()=>{changeVolume(state.volume?0:.55);if(playing&&!paused&&musicPlayer)musicPlayer.play().catch(()=>{});};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b)effect(/Close|UNDERSTOOD|resume|Continue/.test(b.textContent)?'back':'menu',.35);});
$('padButton').onclick=()=>{$('movePad').hidden=!$('movePad').hidden;keys.clear();};$('touchUse').onclick=interact;
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{if(playing&&!paused){e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);}};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key);});
$('journalButton').onclick=()=>togglePanel('journal');$('mapButton').onclick=()=>togglePanel('mapPanel');$('journalClose').onclick=()=>togglePanel('journal');$('mapClose').onclick=()=>togglePanel('mapPanel');
$('motion').checked=reduced;document.body.classList.toggle('reduced',reduced);$('motion').onchange=e=>{reduced=e.target.checked;document.body.classList.toggle('reduced',reduced);};

let mouseCaptureUnavailable=false;
function captureMouse(){
 if(!playing||paused||won||!$('dialog').hidden||!$('journal').hidden||!$('mapPanel').hidden)return;
 if(document.pointerLockElement||mouseCaptureUnavailable)return;
 const fallback=()=>{mouseCaptureUnavailable=true;note('Move your mouse over the game to look. Esc pauses.');};
 try{const result=$('world').requestPointerLock();result?.catch(fallback);}
 catch{fallback();}
}
$('lookButton').onclick=()=>{mouseCaptureUnavailable=false;captureMouse();};
let hadMouse=false;
document.addEventListener('pointerlockchange',()=>{const locked=!!document.pointerLockElement;$('lookButton').textContent=locked?'Mouse captured · Esc releases':'Capture mouse';keys.clear();if(hadMouse&&!locked&&playing&&!won&&$('dialog').hidden&&$('journal').hidden&&$('mapPanel').hidden)pause();hadMouse=locked;});
$('world').addEventListener('click',captureMouse);
document.addEventListener('pointermove',e=>{if((!document.pointerLockElement&&e.target!==$('world'))||!playing||paused||won||!$('dialog').hidden||!$('journal').hidden||!$('mapPanel').hidden)return;yaw-=e.movementX*.0024;pitch=Math.max(-1.05,Math.min(1.05,pitch-e.movementY*.0024));});
document.addEventListener('keydown',e=>{if(e.target.matches?.('input,textarea,select'))return;if(e.code==='Escape'&&!$('wrongAge').hidden){closeWrongAge();return;}if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.repeat)return;
 if(e.code==='Escape'){if(!$('journal').hidden){togglePanel('journal');return;}if(!$('mapPanel').hidden){togglePanel('mapPanel');return;}if(!$('dialog').hidden){closeDialog();return;}if(playing&&!won)paused?resume():pause();return;}
 if(e.code==='KeyE'){interact();return;}if(e.code==='KeyJ'){togglePanel('journal');return;}if(e.code==='KeyM'){togglePanel('mapPanel');return;}keys.add(e.code);
});document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(playing&&!won)pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();save();}});window.addEventListener('resize',resize);window.addEventListener('pagehide',save);setInterval(()=>{if(playing&&!won)save();},2500);
async function init(){try{
 renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:false,powerPreference:'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;
 const [npcAtlas,neighborAtlas,objectSources]=await Promise.all([loadImage('residents.png'),loadImage('neighbors.png'),Promise.all(itemDefs.map(it=>loadImage(it.asset))),loadImage('hand.png')]);npcImages=[...atlasCells(npcAtlas,4,1),...atlasCells(neighborAtlas,5,4)];itemImages=objectSources.map(im=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);return c;});
 configureLevel();buildWorld();randomHomepage();resize();ready=true;updateTravelMenus();startMenuMusic();$('enter').disabled=false;$('enter').textContent=state.met.length||state.collected.length||state.completed.length?'CONTINUE EXISTING →':'ENTER NEIGHBORHOOD →';$('loadStatus').textContent='Reality is ready. Your belongings are saved in this browser.';$('fresh').hidden=!(state.met.length||state.collected.length||state.completed.length);requestAnimationFrame(frame);
 }catch(e){console.error(e);$('loadStatus').textContent='The neighborhood could not load. '+e.message+' — Reload to try again. This game needs WebGL in a desktop browser.';$('enter').textContent='RELOAD REALITY';$('enter').disabled=false;$('enter').onclick=()=>location.reload();}}
init();

