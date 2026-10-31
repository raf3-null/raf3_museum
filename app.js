const objects=[
{id:'001',brand:'Razer',name:'Viper V4 Pro',type:'Mouse',finish:'Black / สีดำ',display:'Viper<br>V4 Pro',favorite:true,image:'assets/viper-v4.jpg'},
{id:'002',brand:'Razer',name:'Viper V3 Pro',type:'Mouse',finish:'Black / สีดำ',display:'Viper<br>V3 Pro'},
{id:'003',brand:'ATK',name:'Zero Extreme',type:'Mouse',finish:'Black / สีดำ',display:'Zero<br>Extreme'},
{id:'004',brand:'Everglide',name:'AE68 Pro',type:'Keyboard',finish:'สีดำใส',display:'AE68<br>Pro'},
{id:'005',brand:'Evo',name:'75',type:'Keyboard',finish:'Anodized Basalt Grey',display:'Evo 75'},
{id:'006',brand:'Xraypad',name:'NOD CR',type:'Mousepad',finish:'',display:'NOD CR'},
{id:'007',brand:'Psyche Gear',name:'MID-01 Yeku',type:'Mousepad',finish:'',display:'MID–001'},
{id:'008',brand:'Artisan',name:'Hayate Otsu V2',type:'Mousepad',finish:'Red / สีแดง',display:'Hayate<br>Otsu V2'},
{id:'009',brand:'ONIXY',name:'Nyx — Micemod 5th Anniversary SE.',type:'Mousepad',finish:'Monochrome',display:'Nyx',edition:'Micemod 5th Anniversary SE.'},
{id:'010',brand:'Binary',name:'1900',type:'Audio',finish:'',display:'Binary<br>1900'},
{id:'011',brand:'Keychron',name:'G6 HE',type:'Mouse',finish:'White / สีขาว',display:'G6 HE'}];
const photographs={"001": {"image": "assets/viper-v4.jpg", "credit": "Razer", "source": "https://www.razer.com/gaming-mice/razer-viper-v4-pro/RZ01-05630100-R3U1"}, "002": {"image": "assets/object-002.webp", "credit": "Razer", "source": "https://www.razer.com/gaming-mice/razer-viper-v3-pro/RZ01-05120100-R3U1"}, "003": {"image": "assets/object-003.webp", "credit": "ATK", "source": "https://www.atk.store/products/atk-blazing-sky-zero-ultralight-wireless-gaming-mouse"}, "004": {"image": "assets/object-004.webp", "credit": "Keebforce", "source": "https://keebforce.com/keebforce-everglide-ae68-pro/"}, "005": {"image": "assets/object-005.webp", "credit": "Berserkeys", "source": "https://berserkeys.com.au/product/evo75-wireless-custom-mechanical-keyboard/"}, "006": {"image": "assets/object-006.webp", "credit": "Micemod", "source": "https://micemod.gg/en/collections/store-8-new-arrivals/products/x-raypad-nod"}, "007": {"image": "assets/object-007.webp", "credit": "Toronto KeyboardMan", "source": "https://torontokeyboardman.ca/products/psyche-gear-mid-01-yeku-glass-mousepad"}, "008": {"image": "assets/object-008.webp", "credit": "JP Gaming", "source": "https://jpgamingusa.com/products/artisan-fx-hayate-otsu-v2-mousepad"}, "009": {"image": "assets/object-009.webp", "credit": "Micemod", "source": "https://micemod.gg/collections/store-8-new-arrivals/products/onixy-nyx-micemod-5th-anniversary-se-monochrome"}, "010": {"image": "assets/object-010.webp", "credit": "Binary Acoustics", "source": "https://binary.audio/products/upcoming-binary-1900-10mm-dd-6mm-passive-diaphragm-4ba-in-ear-monitors"}};
photographs['011']={"image": "assets/object-011.webp", "credit": "Keychron", "source": "https://www.keychron.com/products/keychron-g6-he-ultra-light-wireless-mouse"};
objects.forEach(o=>Object.assign(o,photographs[o.id]));
const fullName=o=>o.brand==='Evo'?'Evo 75':`${o.brand} ${o.name}`;
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const dialog=document.querySelector('#object-dialog');
let activeFilter='all',returnFocus=null;
function photo(o,loading='lazy'){return `<img src="${o.image}" alt="${fullName(o)}${o.finish?' — '+o.finish:''}" loading="${loading}" width="1200" height="1000">`;}
const categories=[
 {type:'Mouse',title:'Mice.',note:'เมาส์ทั้ง 4 ตัวในคอลเลกชัน',caption:'pick your mouse'},
 {type:'Keyboard',title:'Keyboards.',note:'Everglide AE68 Pro และ Evo75',caption:'a couple of keyboards'},
 {type:'Mousepad',title:'Mousepads.',note:'แผ่นรองเมาส์ทั้ง 4 ชิ้น',caption:'a little more color'},
 {type:'Audio',title:'Audio.',note:'Binary 1900',caption:'and something to listen with'}
];
function renderList(){document.querySelector('#list-view').innerHTML=categories.filter(c=>activeFilter==='all'||activeFilter===c.type).map(c=>{const items=objects.filter(o=>o.type===c.type);return `<section class="category-section" aria-labelledby="category-${c.type}"><div class="category-intro"><h3 id="category-${c.type}">${c.title}</h3><p>${c.note}</p><span class="category-scribble">${c.caption}</span></div><div class="category-photos">${items.map(o=>`<a class="list-item${o.favorite?' featured-item':''}" href="#object-${o.id}" data-object="${o.id}"><div class="list-photo">${photo(o)}</div><div class="list-meta"><span>OBJ. ${o.id}</span>${o.favorite?'<span>my favorite!</span>':''}</div><h4>${fullName(o)}${arrow}</h4>${o.finish?`<p>${o.finish}</p>`:''}</a>`).join('')}</div></section>`;}).join('');}
function filter(type){activeFilter=type;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===type)));const count=objects.filter(o=>type==='all'||o.type===type).length;document.querySelector('#result-count').textContent=`อุปกรณ์ ${count} ชิ้น`;renderList();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
function closeObject(){if(dialog.open)dialog.close();location.hash='collection';}
function route(){const id=location.hash.match(/^#object-(\d{3})$/)?.[1],o=objects.find(o=>o.id===id);if(!o){if(dialog.open)dialog.close();document.body.classList.remove('viewing-object');document.querySelectorAll('.is-selected').forEach(el=>el.classList.remove('is-selected'));document.title='raf3 museum — My gear collection';if(returnFocus){returnFocus.focus({preventScroll:true});returnFocus=null;}return;}
 if(!dialog.open){returnFocus=document.activeElement;document.body.classList.add('viewing-object');}

 const i=objects.indexOf(o),prev=objects[(i+objects.length-1)%objects.length],next=objects[(i+1)%objects.length];
 document.querySelector('#object-detail').innerHTML=`<div class="detail-toolbar"><span>OBJECT ${o.id} / ${o.type.toUpperCase()}</span><button id="close-object" aria-label="กลับไปที่คอลเลกชัน">กลับไปที่คอลเลกชัน <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="detail-photo">${photo(o,'eager')}</div><div class="detail-body"><h2 id="object-title">${fullName(o)}</h2>${o.favorite?'<p class="favorite-note">เมาส์ตัวโปรดของ raf3</p>':''}<dl><div><dt>ประเภท</dt><dd>${o.type}</dd></div><div><dt>แบรนด์</dt><dd>${o.brand}</dd></div>${o.finish?`<div><dt>สี</dt><dd>${o.finish}</dd></div>`:''}${o.edition?`<div><dt>Edition</dt><dd>${o.edition}</dd></div>`:''}</dl><p class="photo-credit">ภาพสินค้า: <a href="${o.source}" target="_blank" rel="noopener">${o.credit}</a></p><nav class="detail-nav" aria-label="เปลี่ยนอุปกรณ์"><a href="#object-${prev.id}">← ${prev.id}</a><span>${i+1} / ${objects.length}</span><a href="#object-${next.id}">${next.id} →</a></nav></div>`;
 document.querySelector('#close-object').addEventListener('click',closeObject);if(!dialog.open)dialog.showModal();document.querySelector('#close-object').focus({preventScroll:true});document.title=`${fullName(o)} — raf3 museum`;
}
dialog.addEventListener('cancel',e=>{e.preventDefault();closeObject();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeObject();}});
window.addEventListener('hashchange',route);filter('all');route();
