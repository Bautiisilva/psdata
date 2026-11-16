const $=s=>document.querySelector(s),N=240,L=880,ds=L/N;
const fmt=t=>{const m=Math.floor(t/60);return m+':'+(t-m*60).toFixed(3).padStart(6,'0')};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
/* pista */
const ctrl=[[60,200],[150,70],[290,55],[400,120],[350,190],[260,170],[230,250],[330,310],[470,290],[560,220],[540,120],[620,90],[690,170],[650,290],[500,360],[300,370],[130,340],[50,290]];
const cr=(p0,p1,p2,p3,t)=>[0,1].map(k=>.5*(2*p1[k]+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t));
const dense=[],M=ctrl.length;
for(let i=0;i<M;i++)for(let j=0;j<24;j++)dense.push(cr(ctrl[(i+M-1)%M],ctrl[i],ctrl[(i+1)%M],ctrl[(i+2)%M],j/24));
const cum=[0];for(let i=1;i<=dense.length;i++){const a=dense[i-1],b=dense[i%dense.length];cum.push(cum[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
const tot=cum[cum.length-1],pts=[];let kk=0;
for(let i=0;i<N;i++){const d=i/N*tot;while(cum[kk+1]<d)kk++;const f=(d-cum[kk])/(cum[kk+1]-cum[kk]),a=dense[kk],b=dense[(kk+1)%dense.length];pts.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f])}
let cv=pts.map((b,i)=>{const a=pts[(i+N-1)%N],c=pts[(i+1)%N],u=[b[0]-a[0],b[1]-a[1]],w=[c[0]-b[0],c[1]-b[1]];return Math.abs(Math.atan2(u[0]*w[1]-u[1]*w[0],u[0]*w[0]+u[1]*w[1]))});
cv=cv.map((_,i)=>{let s=0;for(let j=-4;j<=4;j++)s+=cv[(i+j+N)%N];return s/9});
const cmax=Math.max(...cv);
let base=cv.map(c=>(82-46*Math.min(1,Math.pow(c/cmax,.7)*1.15))/3.6);
for(let r=0;r<2;r++){for(let i=0;i<N;i++){const p=base[(i+N-1)%N];base[i]=Math.min(base[i],Math.sqrt(p*p+10*ds))}
for(let i=N-1;i>=0;i--){const n=base[(i+1)%N];base[i]=Math.min(base[i],Math.sqrt(n*n+22*ds))}}
const T0=base.reduce((s,v)=>s+ds/v,0);base=base.map(v=>v*T0/46);
/* pilotos y vueltas */
const D=[{n:'Mateo Ríos',c:'#D62839',s:1,ph:0,pts:112,w:3},{n:'Lucía Ferrer',c:'#2F6FDE',s:.994,ph:2,pts:98,w:2},{n:'Tomás Bravo',c:'#12936B',s:.987,ph:4,pts:87,w:1},{n:'Sofía Molina',c:'#E09A00',s:.982,ph:1,pts:75,w:0},{n:'Nico Paz',c:'#8A55D8',s:.972,ph:3,pts:64,w:0}];
D.forEach((d,di)=>{const r=rng(di*97+11);d.laps=[];
for(let l=0;l<10;l++){const sec=[0,1,2].map(()=>(r()-.5)*.016),lf=(l==0?.965:1)*(1+(r()-.5)*.012);
const v=base.map((b,i)=>b*3.6*d.s*lf*(1+sec[Math.floor(i/N*3)]+.012*Math.sin(i/N*6.283*3+d.ph)));
const t=[0];for(let i=0;i<N;i++)t.push(t[i]+ds/(v[i]/3.6));d.laps.push({v,t,time:t[N]})}
d.bi=d.laps.reduce((b,x,i)=>x.time<d.laps[b].time?i:b,0);d.best=d.laps[d.bi];
const g=d.laps.slice(1).map(x=>x.time),m=g.reduce((a,b)=>a+b)/g.length;d.sd=Math.sqrt(g.reduce((a,b)=>a+(b-m)**2,0)/g.length)});
/* utilidades */
const st={tab:'a',A:0,B:1,la:'best',lb:'best',i:40,f:0};
const li=(d,l)=>l==='best'?D[d].bi:l,get=(d,l)=>D[d].laps[li(d,l)];
const lerp=(a,b,t)=>Math.round(a+(b-a)*t),col=v=>{const t=Math.max(0,Math.min(1,(v-34)/50));return`rgb(${lerp(228,45,t)},${lerp(56,212,t)},${lerp(74,191,t)})`};
const path='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
function mapSVG(lap,dots){let s='';
if(lap)for(let i=0;i<N;i++){const a=pts[i],b=pts[(i+1)%N];s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col(lap.v[i])}" stroke-width="9" stroke-linecap="round"/>`}
const a=pts[0],b=pts[1],dx=b[0]-a[0],dy=b[1]-a[1],h=Math.hypot(dx,dy),nx=-dy/h*17,ny=dx/h*17;
return`<svg class="map" viewBox="0 0 740 420" role="img" aria-label="Trazado de la pista"><path d="${path}" fill="none" stroke="var(--line)" stroke-width="28" stroke-linejoin="round"/>${s}<line x1="${a[0]-nx}" y1="${a[1]-ny}" x2="${a[0]+nx}" y2="${a[1]+ny}" stroke="var(--ink)" stroke-width="5"/>${dots}</svg>`}
const dot=(id,c)=>`<circle id="${id}" r="11" fill="${c}" stroke="var(--surf)" stroke-width="3" cx="${pts[0][0]}" cy="${pts[0][1]}"/>`;
const mv=(id,i)=>{const e=$('#'+id),p=pts[((i%N)+N)%N];if(e){e.setAttribute('cx',p[0]);e.setAttribute('cy',p[1])}};
let raf=0;const stop=()=>cancelAnimationFrame(raf);
/* Análisis */
function vA(v){
const A=D[st.A],B=D[st.B],la=get(st.A,st.la),lb=get(st.B,st.lb);
const opts=s=>D.map((d,i)=>`<option value="${i}"${i===s?' selected':''}>${d.n}</option>`).join('');
const lab=(d,l)=>l==='best'?'mejor vuelta (V'+(D[d].bi+1)+')':'vuelta '+(l+1);
const X=i=>36+i/(N-1)*690,Y=s=>10+(100-s)/80*170;
const dl=la.t.map((t,i)=>lb.t[i]-t),m=Math.max(.1,Math.max(...dl.map(Math.abs))*1.2),Z=d=>250-d/m*38;
const line=(a,c)=>`<polyline fill="none" stroke="${c}" stroke-width="2.5" points="${a.v.slice(0,N).map((s,i)=>X(i).toFixed(1)+','+Y(s).toFixed(1)).join(' ')}"/>`;
let grid='';[40,60,80,100].forEach(g=>grid+=`<line x1="36" x2="726" y1="${Y(g)}" y2="${Y(g)}" stroke="var(--line)"/><text x="0" y="${Y(g)+4}">${g}</text>`);
let rows='';for(let l=0;l<10;l++){const c=(k,d,sel)=>`<td><button data-k="${k}" data-l="${l}" class="${l===D[d].bi?'best':''} ${l===li(d,sel)?'on':''}">${fmt(D[d].laps[l].time)}</button></td>`;
rows+=`<tr><td>&nbsp;${l+1}</td>${c('a',st.A,st.la)}${c('b',st.B,st.lb)}</tr>`}
v.innerHTML=`<div class="two">
<div class="card"><select id="sa" aria-label="Piloto A">${opts(st.A)}</select><div class="big"><i class="chip" style="background:${A.c}"></i>${fmt(la.time)}</div><div class="mut">${lab(st.A,st.la)}</div></div>
<div class="card"><select id="sb" aria-label="Piloto B">${opts(st.B)}</select><div class="big"><i class="chip" style="background:${B.c}"></i>${fmt(lb.time)}</div><div class="mut">${lab(st.B,st.lb)}</div></div></div>
<div class="card"><div class="mut">Mapa de velocidad de ${A.n.split(' ')[0]} · rojo frena, verde agua acelera</div>${mapSVG(la,dot('dB',B.c)+dot('dA',A.c))}</div>
<div class="card"><div class="mut">Deslizá sobre el gráfico para recorrer la vuelta</div>
<svg id="ch" class="chart" viewBox="0 0 740 300" role="img" aria-label="Velocidad y diferencia de tiempo por metro">${grid}${line(la,A.c)}${line(lb,B.c)}
<text x="36" y="206">Diferencia de tiempo (s): arriba, ${A.n.split(' ')[0]} va más rápido</text><line x1="36" x2="726" y1="250" y2="250" stroke="var(--line)"/>
<polyline fill="none" stroke="var(--ink)" stroke-width="2" points="${dl.slice(0,N).map((d,i)=>X(i).toFixed(1)+','+Z(-d).toFixed(1)).join(' ')}"/>
<line id="cur" y1="6" y2="292" stroke="var(--ink)" stroke-width="1.5"/></svg>
<div class="read" id="rd"></div></div>
<div class="card"><table><tr><th>Vuelta</th><th>${A.n.split(' ')[0]}</th><th>${B.n.split(' ')[0]}</th></tr>${rows}</table></div>`;
const sc=i=>{st.i=i;$('#cur').setAttribute('x1',X(i));$('#cur').setAttribute('x2',X(i));mv('dA',i);mv('dB',i);
const d=dl[i];$('#rd').textContent=`${Math.round(i*ds)} m · ${A.n.split(' ')[0]} ${Math.round(la.v[i])} km/h · ${B.n.split(' ')[0]} ${Math.round(lb.v[i])} km/h · ${B.n.split(' ')[0]} ${d>=0?'+':'−'}${Math.abs(d).toFixed(3)} s`};
const ch=$('#ch');const mvp=e=>{const r=ch.getBoundingClientRect(),f=(e.clientX-r.left)/r.width*740;sc(Math.max(0,Math.min(N-1,Math.round((f-36)/690*(N-1)))))};
ch.addEventListener('pointerdown',mvp);ch.addEventListener('pointermove',mvp);sc(st.i);
$('#sa').onchange=e=>{st.A=+e.target.value;st.la='best';view()};$('#sb').onchange=e=>{st.B=+e.target.value;st.lb='best';view()};
v.querySelectorAll('td button').forEach(b=>b.onclick=()=>{st[b.dataset.k==='a'?'la':'lb']=+b.dataset.l;view()})}
/* Sesiones y cuentas */
const PISTAS=['HMS Clockwise','HMS Counter-Clockwise','HMS (sin horquilla)'];
const TIPOS=['Shifter','L206','Rotax Sr','Rotax Jr','K100 Sr','K100 Jr','DD2','Micro Mini','Bambino'];
const MOTORES=['60cc 2T','IAME X30 125cc','Rotax Max 125cc','Vortex 125cc','KZ 125cc (con cambios)','Honda GX 4T','Briggs & Stratton 4T','Eléctrico'];
const SK='psdata-sesiones',AK='psdata-auth',PK='psdata-drivers',DOM='@psdata.app',CFG=window.PSDATA_DB||{},CLOUD=!!(CFG.url&&CFG.key),BASE=CLOUD?CFG.url.replace(/\/+$/,''):'';
const uid=()=>crypto.randomUUID?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
const lsGet=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const lsSet=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const loadS=()=>{const a=lsGet(SK,[]);let ch=false;const b=a.map(x=>{if(x&&x.id)return x;ch=true;return{...x,id:uid(),p:1}});if(ch)lsSet(SK,b);return b};
const pendientes=()=>loadS().filter(x=>x.p);
const saveS=a=>lsSet(SK,a);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fdate=d=>{const[y,m,dd]=d.split('-');return dd+'/'+m+'/'+y};
const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const flong=d=>{const[y,m,dd]=d.split('-').map(Number),w=new Date(y,m-1,dd).getDay();return`${DIAS[w][0].toUpperCase()+DIAS[w].slice(1)} ${dd} de ${MESES[m-1]} de ${y}`};
const desc=(a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora);
const norm=x=>({id:x.id,piloto:x.piloto,fecha:String(x.fecha).slice(0,10),hora:String(x.hora).slice(0,5),kart:String(x.kart),tipo:x.tipo,motor:x.motor,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?Number(x.mejor_vuelta):null,vueltas:Array.isArray(x.vueltas)?x.vueltas.map(Number):null});
const COLS='?select=id,piloto,fecha,hora,kart,tipo,motor,pista,archivo,archivo_nombre,mejor_vuelta,vueltas';
const BK='archivos',MAXF=50*1024*1024;
const slug=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'archivo';
const fsize=n=>n<1048576?Math.max(1,Math.round(n/1024))+' KB':(n/1048576).toFixed(1)+' MB';
const parseLap=t=>{t=String(t||'').trim().replace(',','.');if(!t)return null;let m=t.match(/^(\d{1,2}):(\d{1,2}(?:\.\d+)?)$/),s=m?(+m[1])*60+(+m[2]):/^\d+(\.\d+)?$/.test(t)?+t:NaN;return s>5&&s<600?Math.round(s*1000)/1000:NaN};
/* Lectura de tiempos del CSV de Race Studio (MyChron / AiM) */
function lapsFromCSV(txt){const lines=String(txt).replace(/^\ufeff/,'').split(/\r?\n/).slice(0,400);if(!lines.length)return null;
const h=lines.find(l=>l.trim())||'',d=(h.split(';').length>h.split(',').length)?';':',';
const cells=l=>l.split(d).map(c=>c.trim().replace(/^"|"$/g,'').trim());
const row=keys=>{for(const l of lines){const c=cells(l);if(keys.includes((c[0]||'').toLowerCase()))return c.slice(1).filter(x=>x!=='')}return null};
const toks=a=>a.join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).filter(Boolean).map(t=>d===';'?t.replace(',','.'):t);
const tsec=t=>{const m=t.match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/);return m?(+m[1])*60+(+m[2]):/^\d+(\.\d+)?$/.test(t)?+t:NaN};
let laps=[];const bm=row(['beacon markers']);
if(bm){const m=toks(bm).map(tsec).filter(x=>!isNaN(x));for(let i=1;i<m.length;i++)laps.push(m[i]-m[i-1])}
if(!laps.length){const st=row(['segment times','lap times']);if(st){const t=toks(st).map(tsec).filter(x=>!isNaN(x));laps=t.length>=3?t.slice(1,-1):t}}
laps=laps.map(x=>Math.round(x*1000)/1000).filter(x=>x>5&&x<600);if(!laps.length)return null;
let bi=0;laps.forEach((x,i)=>{if(x<laps[bi])bi=i});return{laps,best:laps[bi],bestIdx:bi}}
const fmtLap=s=>{if(s==null||isNaN(s))return'—';const m=Math.floor(s/60),r=(s-m*60).toFixed(3);return m?m+':'+r.padStart(6,'0'):r};
const topOf=(a,k)=>{const c=new Map();a.forEach(x=>{if(x[k])c.set(x[k],(c.get(x[k])||0)+1)});const t=[...c].sort((p,q)=>q[1]-p[1])[0];return t?t[0]:'—'};
/* conexión y sesión de usuario */
const pubH=()=>({apikey:CFG.key,...(CFG.key.startsWith('sb_')?{}:{Authorization:'Bearer '+CFG.key})});
let AUTH=lsGet(AK,null);
const setAuth=a=>{AUTH=a;lsSet(AK,a)};
const jerr=async r=>{const t=await r.text();let j={};try{j=JSON.parse(t)}catch(e){}const e=new Error(j.message||j.error_description||j.msg||j.error||('HTTP '+r.status));e.status=r.status;throw e};
async function tok(grant,body){const r=await fetch(BASE+'/auth/v1/token?grant_type='+grant,{method:'POST',headers:{...pubH(),'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)await jerr(r);const j=await r.json();
return{access_token:j.access_token,refresh_token:j.refresh_token,expires_at:j.expires_at||Math.floor(Date.now()/1000)+(j.expires_in||3600),uid:j.user&&j.user.id}}
let refP=null;
const refresh=()=>refP||(refP=tok('refresh_token',{refresh_token:AUTH.refresh_token}).then(a=>setAuth({...AUTH,...a})).catch(e=>{if(e.status&&e.status<500)setAuth(null);else throw e}).finally(()=>{refP=null}));
async function hdr(){if(AUTH&&Date.now()/1000>AUTH.expires_at-60)await refresh();return AUTH?{apikey:CFG.key,Authorization:'Bearer '+AUTH.access_token}:pubH()}
async function req(path,o={},retry=true){const r=await fetch(BASE+path,{...o,headers:{...(await hdr()),...(o.headers||{})}});
if(r.status===401&&AUTH&&retry){await refresh();if(AUTH)return req(path,o,false)}
if(!r.ok)await jerr(r);const t=await r.text();try{return t?JSON.parse(t):null}catch(e){return t}}
const J={'Content-Type':'application/json'};
const api=(q,o={})=>req('/rest/v1/sesiones'+q,{...o,headers:{...J,...(o.headers||{})}});
const rpc=(fn,b)=>req('/rest/v1/rpc/'+fn,{method:'POST',headers:J,body:JSON.stringify(b)});
const stor=(path,o={})=>req('/storage/v1/object/'+BK+'/'+path,o);
const getPerfiles=()=>req('/rest/v1/perfiles?select=id,usuario,nombre,rol&order=nombre');
async function login(u,p){const a=await tok('password',{email:String(u).trim().toLowerCase()+DOM,password:p});setAuth(a);
const[pf]=await req('/rest/v1/perfiles?select=id,usuario,nombre,rol&id=eq.'+a.uid);if(!pf){setAuth(null);throw new Error('Esta cuenta no tiene perfil. Pedile al administrador que la revise.')}setAuth({...AUTH,perfil:pf})}
async function whoami(){try{const[pf]=await req('/rest/v1/perfiles?select=id,usuario,nombre,rol&id=eq.'+AUTH.uid);if(pf)setAuth({...AUTH,perfil:pf});else setAuth(null)}catch(e){/* sin conexión: usa el perfil guardado */}return AUTH}
function logout(){if(AUTH)fetch(BASE+'/auth/v1/logout',{method:'POST',headers:{apikey:CFG.key,Authorization:'Bearer '+AUTH.access_token}}).catch(()=>{});setAuth(null);lsSet(SK,pendientes());lsSet(PK,null);location.reload()}
const ubar=()=>AUTH&&AUTH.perfil?`<div class="ubar"><span>Conectado como <b>${esc(AUTH.perfil.nombre)}</b> <span class="mut">@${esc(AUTH.perfil.usuario)}${AUTH.perfil.rol==='admin'?' · administrador':''}</span></span><button type="button" class="ghost" id="lo">Salir</button></div>`:'';
const bindUbar=()=>{const b=$('#lo');if(b)b.onclick=logout};
function gate(v,title,sub,done){v.innerHTML=`<form class="card col login" id="lf"><h2>${title}</h2><p class="mut">${sub}</p>
<label>Usuario<input name="u" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>
<label>Contraseña<input name="p" type="password" autocomplete="current-password" required></label>
<button class="cta" type="submit">Entrar</button><div class="mut" id="lm" role="status"></div></form>`;
$('#lf').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),b=e.target.querySelector('button');b.disabled=true;$('#lm').textContent='Entrando…';
try{await login(f.get('u'),f.get('p'));done()}catch(err){$('#lm').textContent=/invalid login/i.test(err.message)?'Usuario o contraseña incorrectos.':/fetch/i.test(err.message)?'No hay conexión. Probá de nuevo.':err.message;b.disabled=false}}}
/* archivos (privados: se descargan con un link temporal) */
const flink=(x,txt)=>x.archivo&&CLOUD?`<button type="button" class="file" data-file="${esc(x.archivo)}" data-name="${esc(x.archivo_nombre||'')}">${txt}</button>`:'';
document.addEventListener('click',async e=>{const b=e.target.closest('[data-file]');if(!b)return;const old=b.innerHTML;b.textContent='Abriendo…';b.disabled=true;
try{const j=await req('/storage/v1/object/sign/'+BK+'/'+b.dataset.file,{method:'POST',headers:J,body:JSON.stringify({expiresIn:300})});
location.href=BASE+'/storage/v1'+(j.signedURL||j.signedUrl)+'&download='+encodeURIComponent(b.dataset.name||'archivo')}
catch(err){alert('No se pudo descargar el archivo: '+err.message)}b.innerHTML=old;b.disabled=false});
/* Sesiones (solo administrador) */
async function vS(v){
if(CLOUD&&!AUTH){const np=pendientes().length;gate(v,'Ingresá como administrador','La carga de sesiones es solo para el administrador. Los pilotos ven sus tandas en Drivers.',()=>vS(v));if(np)$('#lf h2').insertAdjacentHTML('afterend',`<div class="sync warn">Hay ${np} ${np===1?'sesión guardada':'sesiones guardadas'} solo en este navegador. Ingresá como administrador y se suben solas. No borres los datos del navegador hasta que se suban.</div>`);return}
if(CLOUD){await whoami();if(!AUTH)return vS(v);
if(AUTH.perfil.rol!=='admin'){v.innerHTML=ubar()+`<div class="card"><h2 class="h2">Solo para el administrador</h2><p>Tus tandas están en tu perfil.</p><a class="cta" href="drivers.html">Ir a Drivers</a></div>`;bindUbar();return}}
let S=loadS(),P=lsGet(PK,[]),filt='',busy=false,again=false;const open=new Set();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const now=new Date(),pad=n=>String(n).padStart(2,'0'),hoy=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,hora=`${pad(now.getHours())}:${pad(now.getMinutes())}`;
const dl=(id,a)=>`<datalist id="${id}">${[...new Set(a)].map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`;
const lastOf=k=>S.length?S[S.length-1][k]:'';
const sel=(name,list,ph)=>`<select name="${name}" required><option value="" disabled${list.includes(lastOf(name))?'':' selected'}>${ph}</option>${list.map(t=>`<option${t===lastOf(name)?' selected':''}>${esc(t)}</option>`).join('')}</select>`;
v.innerHTML=ubar()+`<div class="ses"><form class="card col" id="fs" autocomplete="off"><h2>Nueva sesión</h2>
<label>Piloto<span id="pwrap"></span></label>
<div class="pair"><label>Fecha<input name="fecha" type="date" required value="${hoy}"></label><label>Hora de la sesión<input name="hora" type="time" required value="${hora}"></label></div>
<label>Pista${sel('pista',PISTAS,'Elegí la pista')}</label>
<label>Número de kart<input name="kart" type="number" inputmode="numeric" min="0" max="999" required placeholder="Ej: 17" value="${esc(lastOf('kart'))}"></label>
<label>Tipo de kart${sel('tipo',TIPOS,'Elegí el tipo de kart')}</label>
<label>Tipo de motor<input name="motor" list="dlm" required placeholder="Elegí o escribí" value="${esc(lastOf('motor'))}"></label>
<label>Mejor vuelta <span class="opt">(se completa sola con el CSV)</span><input name="mv" inputmode="decimal" autocomplete="off" placeholder="Ej: 49.123 o 0:49.123"></label><div class="mut csvi" id="csvi"></div>
<label class="drop">Archivo del logger <span class="opt">(opcional)</span><input name="archivo" type="file" id="fa"><span class="fn" id="fn">Tocá para elegir el archivo exportado (MyChron, AiM…)</span></label>
<button class="cta" type="submit" id="gs">Guardar sesión</button><div class="mut" id="msg" role="status"></div></form>
<div class="card col"><div class="head"><h2>Sesiones guardadas <span class="mut" id="cnt"></span></h2>
<div class="tools"><select id="fp" aria-label="Filtrar por piloto"></select><button type="button" class="ghost" id="csv">Exportar CSV</button></div></div>
<div class="sync" id="sync" role="status"></div>
<div class="tw"><table class="db"><thead><tr><th>Piloto</th><th>Fecha</th><th>Hora</th><th>Pista</th><th>Kart</th><th>Tipo</th><th>Motor</th><th>Mejor vuelta</th><th>Archivo</th><th></th></tr></thead><tbody id="tb"></tbody></table></div></div>
<aside class="card col" aria-labelledby="dh"><h2 id="dh">Drivers sessions</h2><div id="dv"></div></aside></div>
<div id="dls"></div>`;bindUbar();
const setSt=(k,t)=>{const e=$('#sync');e.className='sync '+k;e.textContent=t};
const drawP=()=>{if(!CLOUD){$('#pwrap').innerHTML=`<input name="piloto" list="dlp" required placeholder="Elegí o escribí un nombre" value="${esc(lastOf('piloto'))}">`;return}
const w=$('#pwrap'),cur=w.querySelector('select')?w.querySelector('select').value:lastOf('piloto'),ns=P.filter(p=>p.rol==='piloto').map(p=>p.nombre);
w.innerHTML=ns.length?`<select name="piloto" required><option value="" disabled${ns.includes(cur)?'':' selected'}>Elegí el piloto</option>${ns.map(n=>`<option${n===cur?' selected':''}>${esc(n)}</option>`).join('')}</select>`
:`<select name="piloto" required><option value="" selected disabled>Primero creá la cuenta del piloto en Drivers</option></select><a class="mini" href="drivers.html">Ir a Drivers →</a>`};
const drawD=()=>{const g={};S.forEach(x=>(g[x.piloto]=g[x.piloto]||[]).push(x));
const names=Object.keys(g).sort((a,b)=>g[b].length-g[a].length||a.localeCompare(b)),acc=new Set(P.map(p=>p.nombre));
$('#dv').innerHTML=names.length?names.map(n=>{const a=g[n].sort(desc);
return`<details class="drv" data-n="${esc(n)}"${open.has(n)?' open':''}><summary><i class="chip" style="background:var(--acc)"></i><span class="dn">${esc(n)}</span>${CLOUD&&!acc.has(n)?'<span class="nocc" title="Este nombre no tiene cuenta en Drivers">sin cuenta</span>':''}<span class="dc">${a.length} ${a.length===1?'tanda':'tandas'}</span></summary>
<dl class="dinfo"><div><dt>Última</dt><dd>${fdate(a[0].fecha)}</dd></div><div><dt>Kart habitual</dt><dd>#${esc(topOf(a,'kart'))}</dd></div><div><dt>Tipo</dt><dd>${esc(topOf(a,'tipo'))}</dd></div><div><dt>Motor</dt><dd>${esc(topOf(a,'motor'))}</dd></div></dl>
<ol class="tandas">${a.map((x,k)=>`<li><b>Tanda ${a.length-k}</b><span>${fdate(x.fecha)} · ${esc(x.hora)} · kart #${esc(x.kart)}</span>${x.pista?`<span>${esc(x.pista)}</span>`:''}<span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.mejor_vuelta!=null?' · mejor vuelta '+fmtLap(x.mejor_vuelta):''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 '+esc(x.archivo_nombre||'Archivo'))}</li>`).join('')}</ol></details>`}).join('')
:'<p class="mut">Cuando cargues sesiones, acá aparece cada piloto con todas sus tandas.</p>'};
const draw=()=>{const ps=[...new Set(S.map(x=>x.piloto))].sort();if(filt&&!ps.includes(filt))filt='';
$('#fp').innerHTML=`<option value="">Todos los pilotos</option>`+ps.map(p=>`<option${p===filt?' selected':''}>${esc(p)}</option>`).join('');
const rows=S.filter(x=>!filt||x.piloto===filt).sort(desc);
$('#cnt').textContent='· '+rows.length;
$('#tb').innerHTML=rows.length?rows.map(x=>`<tr${x.p&&CLOUD?' class="pend" title="Todavía no se subió a la nube"':''}><td>${esc(x.piloto)}</td><td>${fdate(x.fecha)}</td><td>${esc(x.hora)}</td><td>${x.pista?esc(x.pista):'<span class="mut">—</span>'}</td><td class="num">${esc(x.kart)}</td><td>${esc(x.tipo)}</td><td>${esc(x.motor)}</td><td class="t">${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'<span class="mut">—</span>'}</td><td>${flink(x,'📎 Descargar')||'<span class="mut">—</span>'}</td><td><button type="button" class="del" data-id="${esc(x.id)}" aria-label="Borrar sesión de ${esc(x.piloto)} del ${fdate(x.fecha)}">✕</button></td></tr>`).join(''):`<tr><td colspan="10" class="mut empty">${S.length?'No hay sesiones de este piloto.':'Todavía no cargaste ninguna sesión.'}</td></tr>`;
$('#dls').innerHTML=dl('dlp',S.map(x=>x.piloto))+dl('dlm',[...MOTORES,...S.map(x=>x.motor)]);
drawD()};
async function sync(){if(!CLOUD)return;if(busy){again=true;return}busy=true;setSt('busy','Sincronizando con la nube…');
try{const pend=S.filter(x=>x.p);
if(pend.length)await api('?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(pend.map(({p,...x})=>({...x,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?x.mejor_vuelta:null,vueltas:Array.isArray(x.vueltas)?x.vueltas:null,kart:parseInt(x.kart,10)||0})))});
const[rows0,pf]=await Promise.all([api(COLS),getPerfiles()]),rows=rows0.map(norm),ids=new Set(rows.map(x=>x.id)),sent=new Set(pend.map(x=>x.id));
S=[...rows,...S.filter(x=>x.p&&!ids.has(x.id)&&!sent.has(x.id))];saveS(S);P=pf;lsSet(PK,P);
setSt('ok',`Guardado en la nube · ${S.length} ${S.length===1?'sesión':'sesiones'}`)}
catch(e){if(!AUTH){location.reload();return}setSt('err',`Sin conexión con la base de datos (${e.message}). Las sesiones quedan en este dispositivo y se suben solas cuando vuelva la conexión.`)}
busy=false;drawP();draw();if(again){again=false;sync()}}
drawP();draw();if(CLOUD)sync();else setSt('warn','Guardadas solo en este navegador. Para que queden guardadas siempre, conectá la base de datos (pasos en LEEME.txt).');
addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});setInterval(()=>{if(!document.hidden)sync()},60000);
$('#dv').addEventListener('toggle',e=>{const n=e.target.dataset.n;if(n!==undefined)e.target.open?open.add(n):open.delete(n)},true);
const fin=$('#fa'),fnl=$('#fn'),fdef=fnl.textContent;
let LAPS=null;
fin.onchange=async()=>{const fl=fin.files[0];fnl.textContent=fl?`${fl.name} · ${fsize(fl.size)}`:fdef;fnl.parentElement.classList.toggle('has',!!fl);LAPS=null;const ci=$('#csvi');ci.textContent='';ci.className='mut csvi';if(!fl)return;
if(fl.size>MAXF)return;let r=null;try{r=lapsFromCSV(await fl.slice(0,2*1024*1024).text())}catch(e){}
if(r){LAPS=r.laps;$('#fs').mv.value=fmtLap(r.best);ci.className='mut csvi ok';ci.textContent=`Leído del archivo: ${r.laps.length} ${r.laps.length===1?'vuelta':'vueltas'}, la mejor fue la ${r.bestIdx+1}ª con ${fmtLap(r.best)}.`}
else{ci.className='mut csvi warn';ci.textContent=/\.csv$/i.test(fl.name)?'No encontré tiempos de vuelta en este CSV. Escribí la mejor vuelta a mano.':'Este archivo no es un CSV: no puedo leer los tiempos. Exportalo como CSV desde Race Studio 3 o escribí la mejor vuelta a mano.'}};
$('#fs').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),x={id:uid(),p:1};['piloto','fecha','hora','pista','kart','tipo','motor'].forEach(k=>x[k]=String(f.get(k)||'').trim());
if(!x.piloto||!x.pista||!x.tipo||!x.motor)return;const mv=parseLap(f.get('mv'));if(Number.isNaN(mv)){$('#msg').textContent='La mejor vuelta no se entiende. Escribila como 49.123 o 0:49.123 (segundos con milésimas).';e.target.mv.focus();return}x.mejor_vuelta=mv;x.vueltas=LAPS;const fl=fin.files[0],btn=$('#gs');
if(fl){if(!CLOUD){$('#msg').textContent='Para adjuntar archivos hace falta la base de datos conectada.';return}
if(fl.size>MAXF){$('#msg').textContent=`El archivo pesa ${fsize(fl.size)}. El máximo es 50 MB.`;return}
const m=fl.name.match(/\.([A-Za-z0-9]{1,8})$/),ext=m?'.'+m[1].toLowerCase():'';
const path=`${slug(x.piloto)}/${x.fecha}_${x.hora.replace(':','')}_kart${slug(x.kart)}_${x.id.slice(0,8)}${ext}`;
btn.disabled=true;btn.textContent='Subiendo archivo…';$('#msg').textContent='';
try{await stor(path,{method:'POST',headers:{'Content-Type':fl.type||'application/octet-stream','x-upsert':'false'},body:fl})}
catch(err){btn.disabled=false;btn.textContent='Guardar sesión';$('#msg').textContent='No se pudo subir el archivo. Revisá la conexión y probá de nuevo. ('+err.message+')';return}
btn.disabled=false;btn.textContent='Guardar sesión';x.archivo=path;x.archivo_nombre=`${x.piloto} - ${x.fecha} ${x.hora.replace(':','.')} - kart ${x.kart}${ext}`}
S.push(x);const ok=saveS(S);open.add(x.piloto);fin.value='';fin.onchange();e.target.mv.value='';
$('#msg').textContent=ok?`Sesión de ${x.piloto} guardada${fl?' con su archivo':''}.`:'Se agregó a la tabla, pero este navegador no permite guardarla.';draw();sync()};
$('#fp').onchange=e=>{filt=e.target.value;draw()};
$('#tb').onclick=async e=>{const b=e.target.closest('.del');if(!b)return;const x=S.find(s=>s.id===b.dataset.id);if(!x||!confirm(`¿Borrar la sesión de ${x.piloto} del ${fdate(x.fecha)} a las ${x.hora}?`))return;
if(CLOUD){try{await api('?id=eq.'+encodeURIComponent(x.id),{method:'DELETE',headers:{Prefer:'return=minimal'}})}catch(err){$('#msg').textContent='No se pudo borrar: no hay conexión con la base de datos. Probá de nuevo en un rato.';return}}
if(CLOUD&&x.archivo){$('#msg').textContent='Borrando archivo…';await stor(x.archivo,{method:'DELETE'}).catch(()=>{})}
S=S.filter(s=>s.id!==x.id);saveS(S);$('#msg').textContent='Sesión borrada.';draw()};
$('#csv').onclick=()=>{const q=t=>'"'+String(t).replace(/"/g,'""')+'"',rows=[['Piloto','Fecha','Hora','Pista','Kart','Tipo de kart','Motor','Mejor vuelta','Archivo'],...S.filter(x=>!filt||x.piloto===filt).sort(desc).map(x=>[x.piloto,x.fecha,x.hora,x.pista||'',x.kart,x.tipo,x.motor,x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'',x.archivo_nombre||''])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv'}));a.download='sesiones-psdata.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}}
/* Drivers: perfil de cada piloto y cuentas (administrador) */
function perfilHTML(nombre,rows){const a=rows.filter(x=>x.piloto===nombre).sort(desc);
if(!a.length)return`<h2 class="pn">${esc(nombre)}</h2><p class="mut">Todavía no hay tandas cargadas. Cuando el administrador cargue una sesión con tu nombre, aparece acá sola.</p>`;
const dias={};a.forEach(x=>(dias[x.fecha]=dias[x.fecha]||[]).push(x));const fechas=Object.keys(dias).sort().reverse();
const st=(k,v)=>`<div class="st"><div class="big">${v}</div><div class="mut">${k}</div></div>`;
const cb=a.filter(x=>x.mejor_vuelta!=null).sort((p,q)=>p.mejor_vuelta-q.mejor_vuelta)[0];
return`<h2 class="pn">${esc(nombre)}</h2><div class="stats">${st('tandas',a.length)}${st(fechas.length===1?'día en pista':'días en pista',fechas.length)}${st(cb?'mejor vuelta · '+esc(cb.pista||''):'mejor vuelta',cb?fmtLap(cb.mejor_vuelta):'—')}${st('kart habitual','#'+esc(topOf(a,'kart')))}</div>
<div class="mut hab">Última sesión: <b>${fdate(a[0].fecha)}</b> · Pista habitual: <b>${esc(topOf(a,'pista'))}</b> · Tipo: <b>${esc(topOf(a,'tipo'))}</b> · Motor: <b>${esc(topOf(a,'motor'))}</b></div>
${fechas.map(f=>{const t=dias[f].slice().sort((p,q)=>p.hora.localeCompare(q.hora));return`<section class="dia"><h3>${flong(f)} <span class="mut">· ${t.length} ${t.length===1?'tanda':'tandas'}</span></h3>
<ol class="tandas">${t.map((x,i)=>`<li><b>Tanda ${i+1} · ${esc(x.hora)}</b><span>${x.pista?esc(x.pista)+' · ':''}kart #${esc(x.kart)}</span><span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.mejor_vuelta!=null?' · mejor vuelta <b class="tl">'+fmtLap(x.mejor_vuelta)+'</b>':''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 Descargar archivo')}</li>`).join('')}</ol></section>`}).join('')}`}
async function vDr(v){
if(!CLOUD){v.innerHTML='<div class="card"><p>Para usar cuentas de pilotos hace falta conectar la base de datos (pasos en LEEME.txt).</p></div>';return}
if(!AUTH)return gate(v,'Ingresá a tu perfil','Usá el usuario y la contraseña que te dio tu entrenador.',()=>vDr(v));
await whoami();if(!AUTH)return vDr(v);
const me=AUTH.perfil,admin=me.rol==='admin';let S=lsGet(SK,[]).filter(x=>!x.p),P=lsGet(PK,[]),ver=admin?lsGet('psdata-ver',''):me.nombre,stamp='';
v.innerHTML=ubar()+(admin?`<div class="dad"><div class="stack"><form class="card col" id="fc" autocomplete="off"><h2>Nuevo driver</h2>
<label>Nombre del piloto<input name="n" list="dln" required placeholder="Como lo cargás en Sesiones"></label>
<label>Usuario<input name="u" required autocapitalize="none" autocorrect="off" spellcheck="false" pattern="[a-zA-Z0-9._\\-]{3,30}" title="De 3 a 30 letras, números, punto, guion o guion bajo" placeholder="Ej: tomas"></label>
<label>Contraseña<span class="pw"><input name="c" required minlength="6" autocomplete="off" placeholder="Mínimo 6 caracteres"><button type="button" class="ghost" id="gen">Generar</button></span></label>
<button class="cta" type="submit">Crear cuenta</button><div class="mut" id="cm" role="status"></div></form>
<div class="card col"><h2>Drivers <span class="mut" id="pc"></span></h2><div id="pl"></div></div></div>
<div class="card col" id="pf"></div></div><datalist id="dln"></datalist>`:`<div class="card col solo" id="pf"></div>`)+`<p class="mut upd" id="up"></p>`;bindUbar();
const drawPf=()=>{const el=$('#pf');if(admin&&!ver){el.innerHTML='<h2>Perfil</h2><p class="mut">Tocá un driver de la lista para ver su perfil tal como lo ve él.</p>';return}el.innerHTML=perfilHTML(ver,S)};
const drawList=()=>{if(!admin)return;const cnt=n=>S.filter(x=>x.piloto===n).length,ps=P.filter(p=>p.rol==='piloto'),acc=new Set(P.map(p=>p.nombre));
$('#pc').textContent='· '+ps.length;
$('#pl').innerHTML=(ps.length?ps.map(p=>`<div class="acc${p.nombre===ver?' on':''}"><button type="button" class="an" data-ver="${esc(p.nombre)}"><b>${esc(p.nombre)}</b><span class="mut">@${esc(p.usuario)} · ${cnt(p.nombre)} ${cnt(p.nombre)===1?'tanda':'tandas'}</span></button>
<button type="button" class="ghost sm" data-pw="${p.id}" data-n="${esc(p.nombre)}">Contraseña</button><button type="button" class="del" data-rm="${p.id}" data-n="${esc(p.nombre)}" aria-label="Borrar la cuenta de ${esc(p.nombre)}">✕</button></div>`).join(''):'<p class="mut">Todavía no creaste ninguna cuenta.</p>')
+(()=>{const sin=[...new Set(S.map(x=>x.piloto))].filter(n=>!acc.has(n));return sin.length?`<p class="mut sin">Con sesiones pero sin cuenta: ${sin.map(n=>`<button type="button" class="chipb" data-pre="${esc(n)}">${esc(n)}</button>`).join(' ')}</p>`:''})();
$('#dln').innerHTML=[...new Set(S.map(x=>x.piloto))].filter(n=>!acc.has(n)).map(n=>`<option value="${esc(n)}">`).join('')};
async function load(){try{const[r,pf]=await Promise.all([api(COLS),admin?getPerfiles():Promise.resolve(P)]);S=r.map(norm);if(admin){P=pf;lsSet(PK,P);const ids=new Set(S.map(x=>x.id));lsSet(SK,[...S,...pendientes().filter(x=>!ids.has(x.id))])}
const d=new Date();stamp=`Actualizado a las ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}. Se actualiza solo.`}
catch(e){if(!AUTH){location.reload();return}stamp='Sin conexión: mostrando lo último guardado.'}
$('#up').textContent=stamp;drawList();drawPf()}
drawList();drawPf();load();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});setInterval(()=>{if(!document.hidden)load()},60000);addEventListener('online',load);
if(!admin)return;
const cm=$('#cm');
$('#gen').onclick=()=>{const c='abcdefghjkmnpqrstuvwxyz23456789',r=crypto.getRandomValues(new Uint8Array(8));$('#fc').c.value=[...r].map(x=>c[x%c.length]).join('')};
$('#fc').onsubmit=async e=>{e.preventDefault();const f=e.target,n=f.n.value.trim(),u=f.u.value.trim().toLowerCase(),c=f.c.value,b=f.querySelector('.cta');b.disabled=true;cm.textContent='Creando cuenta…';
try{await rpc('crear_usuario',{p_usuario:u,p_clave:c,p_nombre:n,p_rol:'piloto'});cm.innerHTML=`Cuenta creada. Pasale a <b>${esc(n)}</b>: usuario <b>${esc(u)}</b> · contraseña <b>${esc(c)}</b>`;f.reset();ver=n;lsSet('psdata-ver',n);await load()}
catch(err){cm.textContent='No se pudo crear: '+err.message}b.disabled=false};
$('#pl').onclick=async e=>{const t=e.target.closest('button');if(!t)return;
if(t.dataset.ver!==undefined){ver=t.dataset.ver;lsSet('psdata-ver',ver);drawList();drawPf();if(innerWidth<900)$('#pf').scrollIntoView({behavior:'smooth'});return}
if(t.dataset.pre!==undefined){$('#fc').n.value=t.dataset.pre;$('#fc').u.value=slug(t.dataset.pre).toLowerCase();$('#fc').u.focus();return}
if(t.dataset.pw){const c=prompt(`Nueva contraseña para ${t.dataset.n} (mínimo 6 caracteres):`);if(c==null)return;
try{await rpc('cambiar_clave',{p_id:t.dataset.pw,p_clave:c});cm.innerHTML=`Contraseña de <b>${esc(t.dataset.n)}</b> cambiada a <b>${esc(c)}</b>.`}catch(err){cm.textContent='No se pudo cambiar: '+err.message}return}
if(t.dataset.rm){if(!confirm(`¿Borrar la cuenta de ${t.dataset.n}? Ya no va a poder entrar. Sus sesiones no se borran.`))return;
try{await rpc('eliminar_usuario',{p_id:t.dataset.rm});cm.textContent=`Cuenta de ${t.dataset.n} borrada.`;if(ver===t.dataset.n){ver='';lsSet('psdata-ver','')}await load()}catch(err){cm.textContent='No se pudo borrar: '+err.message}}}}
/* Ranking (datos reales: mejor vuelta de cada sesión) */
async function vR(v){
if(!CLOUD){v.innerHTML='<div class="card"><p>Para el ranking hace falta conectar la base de datos (pasos en LEEME.txt).</p></div>';return}
if(!AUTH)return gate(v,'Ingresá para ver el ranking','Usá tu usuario y contraseña de psData.',()=>vR(v));
await whoami();if(!AUTH)return vR(v);
const me=AUTH.perfil;let R=lsGet('psdata-rank',[]),fP=lsGet('psdata-rank-pista',''),fT=lsGet('psdata-rank-tipo',''),fD='',stamp='';
v.innerHTML=ubar()+`<div class="card rf"><label>Pista<select id="rp"></select></label><label>Tipo de kart<select id="rt"></select></label></div>
<div class="rk"><section class="card col"><div class="head"><h2>Ranking del día</h2><select id="rd" aria-label="Día"></select></div><div id="rday"></div></section>
<section class="card col"><h2>Récords globales</h2><p class="mut sm">La mejor vuelta de cada piloto en esta pista. Si alguien la baja, se actualiza sola.</p><div id="rglo"></div></section></div><p class="mut upd" id="up"></p>`;bindUbar();
const opts=(el,list,cur,todas)=>{el.innerHTML=(todas?`<option value="">${todas}</option>`:'')+list.map(x=>`<option${x===cur?' selected':''}>${esc(x)}</option>`).join('')};
const best=rows=>{const m=new Map();rows.forEach(x=>{const b=m.get(x.piloto);if(!b||x.mejor_vuelta<b.mejor_vuelta||(x.mejor_vuelta===b.mejor_vuelta&&x.fecha<b.fecha))m.set(x.piloto,x)});return[...m.values()].sort((a,b)=>a.mejor_vuelta-b.mejor_vuelta||a.fecha.localeCompare(b.fecha))};
const tabla=(rows,extra)=>{if(!rows.length)return'<p class="mut">Todavía no hay tiempos cargados acá.</p>';const p1=rows[0].mejor_vuelta;
return`<table class="db rank"><thead><tr><th>#</th><th>Piloto</th><th>Mejor vuelta</th><th>Dif.</th><th>${extra.h}</th></tr></thead><tbody>${rows.map((x,i)=>`<tr class="${x.piloto===me.nombre?'yo':''}"><td class="pos">${i+1}</td><td>${esc(x.piloto)}${extra.badge?extra.badge(x,i):''}</td><td class="t">${fmtLap(x.mejor_vuelta)}</td><td class="mut">${i?'+'+(x.mejor_vuelta-p1).toFixed(3):'—'}</td><td class="mut">${extra.c(x)}</td></tr>`).join('')}</tbody></table>`};
const draw=()=>{const pistas=[...new Set([...PISTAS,...R.map(x=>x.pista).filter(Boolean)])];
if(!pistas.includes(fP)){const c=new Map();R.forEach(x=>c.set(x.pista,(c.get(x.pista)||0)+1));fP=[...c].sort((a,b)=>b[1]-a[1]).map(x=>x[0]).find(Boolean)||pistas[0]}
const enP=R.filter(x=>x.pista===fP),tipos=[...new Set(enP.map(x=>x.tipo))].sort();if(fT&&!tipos.includes(fT))fT='';
opts($('#rp'),pistas,fP);opts($('#rt'),tipos,fT,'Todas');
const F=enP.filter(x=>!fT||x.tipo===fT),G=best(F),rec=new Map(G.map(x=>[x.piloto,x]));
const dias=[...new Set(F.map(x=>x.fecha))].sort().reverse();if(!dias.includes(fD))fD=dias[0]||'';
$('#rd').innerHTML=dias.length?dias.map(d=>`<option value="${d}"${d===fD?' selected':''}>${flong(d)}</option>`).join(''):'<option>Sin días con tiempos</option>';$('#rd').disabled=!dias.length;
const day=F.filter(x=>x.fecha===fD),cnt=n=>day.filter(x=>x.piloto===n).length;
$('#rday').innerHTML=tabla(best(day),{h:'Tandas',c:x=>cnt(x.piloto),badge:(x,i)=>G[0]&&G[0].piloto===x.piloto&&G[0].fecha===fD&&G[0].mejor_vuelta===x.mejor_vuelta?' <span class="bdg rec">Récord de pista</span>':rec.get(x.piloto)&&rec.get(x.piloto).fecha===fD&&rec.get(x.piloto).mejor_vuelta===x.mejor_vuelta?' <span class="bdg pb">Mejor personal</span>':''});
$('#rglo').innerHTML=tabla(G,{h:'Fecha',c:x=>fdate(x.fecha),badge:(x,i)=>i===0?' <span class="bdg rec">Récord</span>':''});$('#up').textContent=stamp};
async function load(){try{R=(await rpc('ranking_datos',{})||[]).map(x=>({piloto:x.piloto,fecha:String(x.fecha).slice(0,10),pista:x.pista,tipo:x.tipo,mejor_vuelta:Number(x.mejor_vuelta)}));lsSet('psdata-rank',R);
const d=new Date();stamp=`Actualizado a las ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}. Se actualiza solo.`}
catch(e){if(!AUTH){location.reload();return}stamp='Sin conexión: mostrando lo último guardado.'}draw()}
$('#rp').onchange=e=>{fP=e.target.value;lsSet('psdata-rank-pista',fP);fD='';draw()};$('#rt').onchange=e=>{fT=e.target.value;lsSet('psdata-rank-tipo',fT);fD='';draw()};$('#rd').onchange=e=>{fD=e.target.value;draw()};
draw();load();document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});setInterval(()=>{if(!document.hidden)load()},60000);addEventListener('online',load)}
const pg=document.body.dataset.page;
const fn={h:v=>{v.innerHTML=mapSVG(D[0].best,'')},a:vA,r:vR,s:vS,d:vDr}[pg];
const view=()=>{stop();fn($('#view'))};
if(fn&&$('#view'))view();
