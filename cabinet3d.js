import * as THREE from 'three';
import { OrbitControls } from './vendor/three/OrbitControls.js';

export function initCabinet({objects,fullName,onPick}) {
 const stage=document.querySelector('#stage'),status=document.querySelector('#scene-status');
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x090909);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','ตู้สะสม 3D ลากเพื่อหมุน เลื่อนเพื่อซูม หรือใช้ปุ่มลูกศรหมุน และปุ่มบวกหรือลบซูม');stage.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100),cabinet=new THREE.Group();scene.add(cabinet);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=false;controls.minDistance=8;controls.maxDistance=35;controls.minPolarAngle=.18*Math.PI;controls.maxPolarAngle=.8*Math.PI;controls.rotateSpeed=.65;controls.zoomSpeed=.75;controls.target.set(0,0,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x343434,2.4));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(5,8,7);scene.add(key);
 const rim=new THREE.DirectionalLight(0xdde6ff,2.5);rim.position.set(-6,4,-6);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xffffff,1.4);fill.position.set(-6,1,5);scene.add(fill);
 const shell=new THREE.MeshStandardMaterial({color:0x252527,roughness:.53,metalness:.34});
 const shelf=new THREE.MeshStandardMaterial({color:0x323234,roughness:.48,metalness:.32});
 const back=new THREE.MeshStandardMaterial({color:0x171719,roughness:.8,metalness:.08});
 const stand=new THREE.MeshStandardMaterial({color:0x444446,roughness:.5,metalness:.35});
 const led=new THREE.MeshBasicMaterial({color:0xf4f3e8});
 const picks=[],frames=new Map(),photos=new Map();let visible=true,disposed=false,tween=0,filter='all';
 function box(w,h,d,x,y,z,material=shell){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);cabinet.add(m);return m;}
 // Solid six-sided body with an open front. The back and sides occlude every exhibit.
 box(8.4,6.65,.18,0,0,-.74,back);box(.18,6.65,1.6,-4.11,0,0);box(.18,6.65,1.6,4.11,0,0);
 box(8.4,.18,1.6,0,3.24,0);box(8.4,.24,1.6,0,-3.21,0);
 box(8.05,.11,1.44,0,0,.04,shelf);box(8.05,.11,1.44,0,-1.57,.04,shelf);box(3.99,.11,1.44,2,1.57,.04,shelf);
 box(.1,6.3,1.44,0,0,.04,shelf);box(.09,1.5,1.44,2,2.36,.04,shelf);box(.09,3.12,1.44,2,-1.57,.04,shelf);
 for(const x of [-3.65,3.65])for(const z of [-.5,.5])box(.22,.28,.22,x,-3.47,z,shelf);
 // A clean, framed back panel and inset manufacturer's plate make the reverse a finished surface.
 box(7.9,6.15,.04,0,0,-.85,shell);
 const slots={
 '001':[-2,1.57,3.95,3.04],'002':[1,2.35,1.94,1.48],'003':[3,2.35,1.94,1.48],
 '004':[2,.79,3.94,1.45],'005':[-2,-.79,3.94,1.45],'010':[1,-.79,1.94,1.45],'006':[3,-.79,1.94,1.45],
 '007':[-2,-2.35,3.94,1.48],'008':[1,-2.35,1.94,1.48],'009':[3,-2.35,1.94,1.48]};
 function textPlane(text,width,height,x,y,z,rotation=0,size=40,color='#ddd'){const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#202022';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.font=`500 ${size}px sans-serif`;ctx.textBaseline='middle';ctx.fillText(text,26,64,970);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:t,side:THREE.FrontSide}));m.position.set(x,y,z);m.rotation.y=rotation;cabinet.add(m);return m;}
 textPlane('raf3 museum  /  PERSONAL COLLECTION',3.8,.46,0,-2.65,-.88,Math.PI,42);
 textPlane('raf3 museum',2,.24,-2.8,-3.2,.815,0,46);
 const loader=new THREE.TextureLoader();let loaded=0,failures=0;
 objects.forEach(o=>{const [x,y,w,h]=slots[o.id],bottom=y-h/2;
  const group=new THREE.Group();cabinet.add(group);photos.set(o.id,group);
  box(w*.76,.035,.045,x,y+h/2-.08,.58,led);
  const light=new THREE.PointLight(0xffffff,o.favorite?7:2.5,4,2);light.position.set(x,y+h/2-.19,.57);cabinet.add(light);
  box(w*.65,.09,.58,x,bottom+.25,.16,stand);
  const label=textPlane(`${o.id}${o.favorite?' / FAVORITE':''}   ${fullName(o)}`,w-.18,.19,x,bottom+.1,.805,0,o.favorite?35:38);label.userData.id=o.id;picks.push(label);
  const mat=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.FrontSide});
  const image=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat);image.position.set(x,y+.08,.41);image.userData.id=o.id;group.add(image);picks.push(image);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1,1,.045),new THREE.MeshStandardMaterial({color:0x555559,roughness:.4,metalness:.5}));frame.position.set(x,y+.08,.377);group.add(frame);frames.set(o.id,frame);
  loader.load(o.image,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);mat.map=texture;mat.needsUpdate=true;const aspect=texture.image.width/texture.image.height;let pw=w-.42,ph=pw/aspect;if(ph>h-.58){ph=h-.58;pw=ph*aspect;}image.scale.set(pw,ph,1);frame.scale.set(pw+.045,ph+.045,1);loaded++;updateStatus();render();},undefined,()=>{failures++;updateStatus();});
 });
 function updateStatus(){if(loaded+failures===objects.length){status.textContent=failures?`ภาพ ${failures} ชิ้นโหลดไม่สำเร็จ ดูได้ในมุมมองรายการ`:'';status.hidden=!failures;}}
 // A dark studio floor grounds the model without hiding its lower edges.
 const floor=new THREE.Mesh(new THREE.CircleGeometry(25,64),new THREE.MeshBasicMaterial({color:0x0e0e0f}));floor.rotation.x=-Math.PI/2;floor.position.y=-3.62;scene.add(floor);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=256;const ctx=shadowCanvas.getContext('2d'),g=ctx.createRadialGradient(128,128,12,128,128,128);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(12,5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-3.61;scene.add(shadow);
 function render(){if(visible&&!disposed&&!document.hidden)renderer.render(scene,camera);}
 function fitDistance(){const a=Math.max(stage.clientWidth,1)/Math.max(stage.clientHeight,1);return Math.max(11.5,8.8/(2*Math.tan(THREE.MathUtils.degToRad(19))*a))*1.16;}
 let distance=13;
 function move(angle,instant=false){cancelAnimationFrame(tween);distance=THREE.MathUtils.clamp(fitDistance(),controls.minDistance,controls.maxDistance-1);const end=new THREE.Vector3(Math.sin(angle)*distance,1.05,Math.cos(angle)*distance),start=camera.position.clone();if(instant||matchMedia('(prefers-reduced-motion: reduce)').matches){camera.position.copy(end);controls.update();render();return;}const t0=performance.now();function tick(t){const p=Math.min(1,(t-t0)/650),e=1-Math.pow(1-p,4);camera.position.lerpVectors(start,end,e);controls.update();render();if(p<1)tween=requestAnimationFrame(tick);}tween=requestAnimationFrame(tick);}
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(camera.position.length()>0){camera.position.sub(controls.target).setLength(THREE.MathUtils.clamp(fitDistance(),controls.minDistance,controls.maxDistance-1)).add(controls.target);controls.update();}render();}
 const observer=new ResizeObserver(resize);observer.observe(stage);resize();move(.22,true);
 controls.addEventListener('change',render);controls.addEventListener('start',()=>cancelAnimationFrame(tween));
 let down=null,moved=0,multi=false;const pointers=new Set(),ray=new THREE.Raycaster(),point=new THREE.Vector2();
 renderer.domElement.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);multi=pointers.size>1;if(!multi){down={x:e.clientX,y:e.clientY,id:e.pointerId};moved=0;}});
 renderer.domElement.addEventListener('pointermove',e=>{if(down)moved=Math.max(moved,Math.hypot(e.clientX-down.x,e.clientY-down.y));});
 renderer.domElement.addEventListener('pointerup',e=>{pointers.delete(e.pointerId);if(!down||multi||moved>6||e.pointerId!==down.id){down=null;return;}const r=renderer.domElement.getBoundingClientRect();point.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(point,camera);const first=ray.intersectObjects(cabinet.children,true)[0];const id=first?.object.userData.id;if(id&&objects.some(o=>o.id===id&&(filter==='all'||o.type===filter)))onPick(id);down=null;});
 renderer.domElement.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);down=null;multi=false;});
 function zoom(factor){cancelAnimationFrame(tween);const v=camera.position.clone().sub(controls.target),d=THREE.MathUtils.clamp(v.length()*factor,controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(v.setLength(d));controls.update();render();}
 const angles={front:0,right:Math.PI/2,back:Math.PI,left:-Math.PI/2};document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>move(angles[b.dataset.angle])));
 document.querySelector('#zoom-in').addEventListener('click',()=>zoom(.85));document.querySelector('#zoom-out').addEventListener('click',()=>zoom(1.18));
 renderer.domElement.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')move(0);else if(['+','='].includes(e.key))zoom(.85);else if(e.key==='-')zoom(1.18);else{const v=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(v);if(e.key==='ArrowLeft')s.theta-=.18;if(e.key==='ArrowRight')s.theta+=.18;if(e.key==='ArrowUp')s.phi=Math.max(controls.minPolarAngle,s.phi-.12);if(e.key==='ArrowDown')s.phi=Math.min(controls.maxPolarAngle,s.phi+.12);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update();render();}}});
 document.addEventListener('visibilitychange',render);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='การแสดงผล 3D หยุดชั่วคราว กรุณาดูแบบรายการหรือโหลดหน้าใหม่';});renderer.domElement.addEventListener('webglcontextrestored',()=>{status.hidden=true;render();});
 return {filter(type){filter=type;objects.forEach(o=>{const active=type==='all'||o.type===type;photos.get(o.id).children.forEach(m=>{m.material.color.setHex(active?(m===frames.get(o.id)?0x555559:0xffffff):0x252525);});});render();},select(id){frames.forEach((frame,key)=>{frame.material.emissive.setHex(key===id?0x777777:0x000000);});render();},setVisible(value){visible=value;if(value){resize();render();}}};
}
