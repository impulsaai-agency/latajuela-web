(function(){
'use strict';

/* ── ESTILOS ── */
const css=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
:root{
  --tj-forest:#1a3a1a;
  --tj-gold:#d4a84b;
  --tj-cream:#f5f0e8;
  --tj-cream2:#ede8df;
  --tj-stone:#ddd8cf;
  --tj-text:#2d2d2d;
  --tj-muted:#999;
}
#tj-btn{position:fixed;left:24px;bottom:24px;width:58px;height:58px;border-radius:50%;background:var(--tj-forest);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:none;cursor:pointer;box-shadow:0 6px 22px rgba(26,58,26,.5);z-index:2147483640;transition:transform .25s;font-family:inherit}
#tj-btn:hover{transform:scale(1.08)}
#tj-bdg{position:absolute;top:-2px;right:-2px;background:#e63946;color:#fff;width:22px;height:22px;border-radius:50%;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--tj-cream)}
#tj-w{position:fixed;left:24px;bottom:92px;width:380px;max-width:calc(100vw - 48px);height:560px;max-height:calc(100vh - 130px);background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;z-index:2147483641;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
#tj-w.tj-open{display:flex;animation:tj-in .3s ease}
@keyframes tj-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
#tj-hd{background:var(--tj-forest);color:#fff;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
#tj-hd .tj-ct{font-family:'Cormorant Garamond',serif;font-size:1.25rem}
#tj-hd .tj-cs{font-size:.7rem;color:rgba(255,255,255,.7);letter-spacing:.08em;text-transform:uppercase}
#tj-hd button{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;opacity:.7;line-height:1}
#tj-hd button:hover{opacity:1}
#tj-body{flex:1;overflow-y:auto;padding:18px;background:var(--tj-cream);display:flex;flex-direction:column;gap:10px}
.tj-msg{max-width:85%;padding:11px 14px;border-radius:14px;font-size:.88rem;line-height:1.5}
.tj-msg.tj-bot{background:#fff;color:var(--tj-text);border:1px solid var(--tj-stone);border-bottom-left-radius:4px;align-self:flex-start}
.tj-msg.tj-usr{background:var(--tj-forest);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
.tj-msg a{color:var(--tj-gold);text-decoration:underline}
.tj-opts{display:flex;flex-direction:column;gap:6px;margin-top:6px}
.tj-opt{background:#fff;border:1px solid var(--tj-stone);padding:9px 13px;border-radius:10px;font-size:.83rem;color:var(--tj-forest);cursor:pointer;text-align:left;transition:background .2s,border-color .2s;width:100%}
.tj-opt:hover{background:var(--tj-cream2);border-color:var(--tj-gold)}
.tj-typ{display:inline-flex;gap:4px;padding:11px 14px;background:#fff;border-radius:14px;border:1px solid var(--tj-stone);align-self:flex-start}
.tj-typ span{width:6px;height:6px;background:var(--tj-muted);border-radius:50%;animation:tj-tp 1.2s infinite}
.tj-typ span:nth-child(2){animation-delay:.15s}
.tj-typ span:nth-child(3){animation-delay:.3s}
@keyframes tj-tp{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-5px);opacity:1}}
#tj-inp-w{padding:12px;border-top:1px solid var(--tj-stone);display:flex;gap:8px;background:#fff;flex-shrink:0}
#tj-inp{flex:1;border:1px solid var(--tj-stone);background:var(--tj-cream);border-radius:24px;padding:10px 16px;font-size:.85rem;outline:none;font-family:inherit}
#tj-inp:focus{border-color:var(--tj-gold)}
#tj-send{background:var(--tj-forest);color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:1.1rem;flex-shrink:0}
@media(max-width:500px){
  #tj-w{left:8px;right:8px;width:auto;bottom:88px}
  #tj-btn{width:52px;height:52px;font-size:1.4rem}
}
`;

/* ── INYECTAR CSS ── */
const style=document.createElement('style');
style.textContent=css;
document.head.appendChild(style);

/* ── INYECTAR HTML ── */
const html=`
<button id="tj-btn" onclick="tjOpen()" title="Asistente de reservas">
  <span>🌿</span><span id="tj-bdg">1</span>
</button>
<div id="tj-w">
  <div id="tj-hd">
    <div><div class="tj-ct">La Tajuela</div><div class="tj-cs">Asistente · En línea</div></div>
    <button onclick="tjClose()">×</button>
  </div>
  <div id="tj-body"></div>
  <div id="tj-inp-w" style="display:none">
    <input id="tj-inp" type="text" placeholder="Escribe aquí..."/>
    <button id="tj-send" onclick="tjSend()">➤</button>
  </div>
</div>
`;
const wrap=document.createElement('div');
wrap.innerHTML=html;
document.body.appendChild(wrap);

/* ── LÓGICA ── */
const body=document.getElementById('tj-body');
let started=false,currentCb=null,tjRes={};

window.tjOpen=function(){
  document.getElementById('tj-w').classList.add('tj-open');
  document.getElementById('tj-bdg').style.display='none';
  if(!started){started=true;tjStart()}
};
window.tjClose=function(){document.getElementById('tj-w').classList.remove('tj-open')};

const wait=ms=>new Promise(r=>setTimeout(r,ms));

function addM(txt,bot=true){
  return new Promise(res=>{
    const d=document.createElement('div');
    d.className='tj-msg '+(bot?'tj-bot':'tj-usr');
    d.innerHTML=txt;
    body.appendChild(d);
    body.scrollTop=body.scrollHeight;
    setTimeout(res,80);
  });
}
function addT(){
  const d=document.createElement('div');
  d.className='tj-typ';d.id='tj-typ';
  d.innerHTML='<span></span><span></span><span></span>';
  body.appendChild(d);body.scrollTop=body.scrollHeight;
}
function rmT(){const t=document.getElementById('tj-typ');if(t)t.remove()}
function clrO(){document.querySelectorAll('.tj-opts').forEach(o=>o.remove())}
function showO(opts){
  clrO();
  const w=document.createElement('div');w.className='tj-opts';
  opts.forEach(o=>{
    const b=document.createElement('button');b.className='tj-opt';b.innerHTML=o.l;
    b.onclick=()=>o.a();w.appendChild(b);
  });
  body.appendChild(w);body.scrollTop=body.scrollHeight;
}
function askInput(cb){
  document.getElementById('tj-inp-w').style.display='flex';
  const inp=document.getElementById('tj-inp');
  inp.value='';inp.focus();currentCb=cb;
}
function hideInput(){document.getElementById('tj-inp-w').style.display='none'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

window.tjSend=function(){
  const inp=document.getElementById('tj-inp');
  const v=inp.value.trim();if(!v)return;
  addM(esc(v),false);inp.value='';hideInput();
  if(currentCb){const c=currentCb;currentCb=null;c(v)}
};
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='tj-inp')tjSend();
});

/* ── FLUJO ── */
async function tjStart(){
  tjRes={fecha:'',noches:'',pers:'',nom:'',tel:''};
  addT();await wait(850);rmT();
  await addM('¡Hola! 👋 Soy el asistente de <strong>La Tajuela</strong>. ¿En qué te ayudo?');
  showO([
    {l:'📅 Consultar disponibilidad',a:startRes},
    {l:'❓ Preguntas frecuentes',a:showFAQ},
    {l:'📞 Hablar con el alojamiento',a:ctcto}
  ]);
}
async function showFAQ(){
  clrO();await addM('❓ Tengo una pregunta',false);addT();await wait(500);rmT();
  await addM('Dime, ¿sobre qué?');
  showO([
    {l:'💰 ¿Cuánto cuesta?',a:fPrecio},
    {l:'🏊 ¿La piscina está disponible?',a:fPiscina},
    {l:'🐾 ¿Admitís mascotas?',a:fMasc},
    {l:'🕐 Check-in y check-out',a:fCheck},
    {l:'🚗 ¿Cómo llego?',a:fLlego},
    {l:'⬅️ Volver',a:tjStart}
  ]);
}
async function fPrecio(){
  clrO();await addM('💰 Precios',false);addT();await wait(700);rmT();
  await addM('Precio orientativo:<br/><br/>🗓️ <strong>Entre semana</strong>: desde <strong>35 €/persona/noche</strong><br/>📅 <strong>Fin de semana y festivos</strong>: desde <strong>45 €/persona/noche</strong><br/><br/>✅ Incluye casa completa, pack bienvenida, piscina y 10% Bodegas Habla. Mínimo 2 noches.');
  showO([{l:'📅 Consultar mis fechas',a:startRes},{l:'⬅️ Más preguntas',a:showFAQ}]);
}
async function fPiscina(){
  clrO();await addM('🏊 La piscina',false);addT();await wait(600);rmT();
  await addM('¡Sí! 🏊 La piscina es <strong>privada</strong> — solo vuestro grupo, sin horarios ni compartir con nadie.');
  showO([{l:'📅 ¡Reservar!',a:startRes},{l:'⬅️ Más preguntas',a:showFAQ}]);
}
async function fMasc(){
  clrO();await addM('🐾 Mascotas',false);addT();await wait(500);rmT();
  await addM('Lo sentimos 🙏 <strong>No admitimos mascotas</strong> para garantizar la comodidad de todos los huéspedes.');
  showO([{l:'📅 Consultar disponibilidad',a:startRes},{l:'⬅️ Más preguntas',a:showFAQ}]);
}
async function fCheck(){
  clrO();await addM('🕐 Horarios',false);addT();await wait(500);rmT();
  await addM('📥 <strong>Check-in:</strong> 18:00 – 22:00 h<br/>📤 <strong>Check-out:</strong> 08:00 – 12:00 h<br/><br/>Flexibilidad bajo consulta previa.');
  showO([{l:'📅 Consultar disponibilidad',a:startRes},{l:'⬅️ Más preguntas',a:showFAQ}]);
}
async function fLlego(){
  clrO();await addM('🚗 Cómo llegar',false);addT();await wait(600);rmT();
  await addM('📍 <strong>Calle Real 31 · Bohonal de Ibor, Cáceres</strong><br/><br/>Autovía <strong>A-5</strong> dirección Badajoz → salida Navalmoral de la Mata. <strong>2h desde Madrid</strong>.<br/><br/><a href="https://maps.google.com/?q=Calle+Real+31+Bohonal+de+Ibor+Caceres" target="_blank">🗺️ Abrir en Google Maps</a>');
  showO([{l:'📅 Reservar',a:startRes},{l:'⬅️ Más preguntas',a:showFAQ}]);
}
async function ctcto(){
  clrO();await addM('📞 Hablar con el alojamiento',false);addT();await wait(600);rmT();
  await addM('Puedes contactar directamente:<br/><br/>📞 <strong>+34 630 44 09 42</strong><br/>✉️ <strong>hola@latajuelacasarural.es</strong><br/><br/><a href="https://wa.me/34630440942" target="_blank">💬 Abrir WhatsApp</a>');
  showO([{l:'⬅️ Volver al inicio',a:tjStart}]);
}
async function startRes(){
  clrO();await addM('📅 Quiero consultar fechas',false);addT();await wait(600);rmT();
  await addM('Perfecto 🙌 ¿Qué fecha de entrada tienes en mente? (Ej: 15/08/2026)');
  askFecha();
}
async function askFecha(){
  askInput(async v=>{
    const m=v.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
    if(!m){addT();await wait(500);rmT();
      await addM('No reconozco esa fecha 🤔 Escríbela en formato <strong>día/mes/año</strong>. Ej: <strong>15/08/2026</strong>');
      askFecha();return;}
    let [,d,mo,y]=m;if(y.length===2)y='20'+y;
    const f=new Date(+y,+mo-1,+d),hoy=new Date();hoy.setHours(0,0,0,0);
    if(isNaN(f)||f<hoy){addT();await wait(500);rmT();
      await addM('Esa fecha ya ha pasado o no es válida 📅 ¿Qué otra fecha te gustaría?');
      askFecha();return;}
    tjRes.fecha=v;askNoches();
  });
}
async function askNoches(){
  addT();await wait(500);rmT();
  await addM('¿Cuántas noches te quedarías? (mínimo 2)');
  askNochesV();
}
async function askNochesV(){
  askInput(async v=>{
    const n=parseInt(v);
    if(isNaN(n)||n<2||!/^\d+$/.test(v.trim())){addT();await wait(400);rmT();
      await addM('La estancia mínima es de 2 noches 🌙 Escribe solo el número. Ej: <strong>3</strong>');
      askNochesV();return;}
    tjRes.noches=n;askPers();
  });
}
async function askPers(){
  addT();await wait(500);rmT();
  await addM('¿Cuántas personas? (máx. 6 adultos + 2 bebés)');
  askPersV();
}
async function askPersV(){
  askInput(async v=>{
    const n=parseInt(v);
    if(isNaN(n)||n<1||n>8||!/^\d+$/.test(v.trim())){addT();await wait(400);rmT();
      await addM('Podemos alojar hasta 6 adultos y 2 bebés 👥 ¿Cuántas personas seríais?');
      askPersV();return;}
    tjRes.pers=v;askNom();
  });
}
async function askNom(){
  addT();await wait(500);rmT();
  await addM('¿Cuál es tu nombre?');
  askNomV();
}
async function askNomV(){
  askInput(async v=>{
    if(v.trim().length<2){addT();await wait(400);rmT();
      await addM('Por favor, dime tu nombre 😊');
      askNomV();return;}
    tjRes.nom=v;askTel();
  });
}
async function askTel(){
  addT();await wait(500);rmT();
  await addM('Por último, déjame tu teléfono y te confirmamos enseguida 📲');
  askTelV();
}
async function askTelV(){
  askInput(async v=>{
    const t=v.replace(/[\s\-\(\)\.]/g,'');
    if(!/^\+?[\d]{7,15}$/.test(t)){addT();await wait(400);rmT();
      await addM('No reconozco ese número 🤔 Ej: <strong>612 345 678</strong>');
      askTelV();return;}
    tjRes.tel=v;tjConfirm();
  });
}
async function tjConfirm(){
  hideInput();addT();await wait(800);rmT();
  await addM('¡Perfecto, '+esc(tjRes.nom)+'! 🎉<br/><br/>📅 Fecha: <strong>'+esc(tjRes.fecha)+'</strong><br/>🌙 Noches: <strong>'+esc(tjRes.noches)+'</strong><br/>👥 Personas: <strong>'+esc(tjRes.pers)+'</strong><br/>📞 Tel: <strong>'+esc(tjRes.tel)+'</strong><br/><br/>Te paso al WhatsApp del alojamiento para confirmar disponibilidad.');
  const msg=encodeURIComponent('Hola, quiero reservar en La Tajuela.\n\nFecha entrada: '+tjRes.fecha+'\nNoches: '+tjRes.noches+'\nPersonas: '+tjRes.pers+'\nNombre: '+tjRes.nom+'\nTeléfono: '+tjRes.tel);
  showO([
    {l:'💬 Enviar por WhatsApp',a:()=>window.open('https://wa.me/34630440942?text='+msg,'_blank')},
    {l:'⬅️ Volver al inicio',a:()=>{started=false;body.innerHTML='';tjStart();started=true}}
  ]);
}
})();
