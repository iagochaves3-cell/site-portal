const dialog=document.getElementById('image-dialog'),image=document.getElementById('viewer-image'),stage=document.getElementById('viewer-stage');
let trigger=null,scale=1,baseWidth=0,savedScroll=0;
const pointers=new Map();let gesture=null;
function zoom(value){scale=Math.min(8,Math.max(.5,value));image.style.width=`${baseWidth*scale}px`;document.getElementById('viewer-reset').textContent=`Ajustar (${Math.round(scale*100)}%)`;}
function fit(){baseWidth=Math.min(image.naturalWidth||900,Math.max(240,stage.clientWidth-32));zoom(1);stage.scrollTop=stage.scrollLeft=0;}
image.addEventListener('load',()=>{document.getElementById('viewer-error').hidden=true;fit()});
image.addEventListener('error',()=>{document.getElementById('viewer-error').hidden=false});
for(const link of document.querySelectorAll('[data-image-viewer]'))link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!dialog.showModal)return;
 event.preventDefault();trigger=link;savedScroll=window.scrollY;
 document.getElementById('viewer-title').textContent=link.querySelector('img').alt;
 document.getElementById('viewer-original').href=link.href;
 document.getElementById('viewer-error').hidden=true;image.alt=link.querySelector('img').alt;
 dialog.showModal();document.body.classList.add('viewer-open');image.src=link.href;
 if(image.complete&&image.naturalWidth)fit();document.getElementById('viewer-close').focus();
});
function close(){dialog.close()}
document.getElementById('viewer-close').addEventListener('click',close);
dialog.addEventListener('close',()=>{pointers.clear();gesture=null;document.body.classList.remove('viewer-open');window.scrollTo({top:savedScroll,behavior:'instant'});trigger?.focus({preventScroll:true})});
document.getElementById('viewer-in').addEventListener('click',()=>zoom(scale*1.25));
document.getElementById('viewer-out').addEventListener('click',()=>zoom(scale/1.25));
document.getElementById('viewer-reset').addEventListener('click',fit);
dialog.addEventListener('keydown',event=>{if(event.key==='+'||event.key==='='){event.preventDefault();zoom(scale*1.25)}if(event.key==='-'){event.preventDefault();zoom(scale/1.25)}});
stage.addEventListener('pointerdown',event=>{pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});stage.setPointerCapture(event.pointerId);if(pointers.size===2){const [a,b]=[...pointers.values()];gesture={distance:Math.hypot(a.x-b.x,a.y-b.y),scale}}});
stage.addEventListener('pointermove',event=>{const previous=pointers.get(event.pointerId);if(!previous)return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size===2&&gesture){event.preventDefault();const[a,b]=[...pointers.values()];zoom(gesture.scale*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance)}else if(pointers.size===1){stage.scrollLeft+=previous.x-event.clientX;stage.scrollTop+=previous.y-event.clientY}});
for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,event=>{pointers.delete(event.pointerId);gesture=null});
