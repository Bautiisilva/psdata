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
<div class="card chartc"><div class="mut">Deslizá sobre el gráfico para recorrer la vuelta</div>
<svg id="ch" class="chart" viewBox="0 0 740 300" role="img" aria-label="Velocidad y diferencia de tiempo por metro">${grid}${line(la,A.c)}${line(lb,B.c)}
<text x="36" y="206">Diferencia de tiempo (s): arriba, ${A.n.split(' ')[0]} va más rápido</text><line x1="36" x2="726" y1="250" y2="250" stroke="var(--line)"/>
<polyline fill="none" stroke="var(--ink)" stroke-width="2" points="${dl.slice(0,N).map((d,i)=>X(i).toFixed(1)+','+Z(-d).toFixed(1)).join(' ')}"/>
<line id="cur" y1="6" y2="292" stroke="var(--ink)" stroke-width="1.5"/></svg>
<div class="read" id="rd"></div></div>
<div class="card mapc"><div class="mut">Mapa de velocidad de ${A.n.split(' ')[0]} · rojo frena, verde agua acelera</div>${mapSVG(la,dot('dB',B.c)+dot('dA',A.c))}</div>
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
const tC=x=>{const t=Date.parse(x.creado||'');return isNaN(t)?0:t};
const porCarga=(a,b)=>(tC(b)-tC(a))||(b.fecha+b.hora).localeCompare(a.fecha+a.hora);
const desc=(a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora)||((+b.tanda||0)-(+a.tanda||0));
const norm=x=>({id:x.id,piloto:x.piloto,fecha:String(x.fecha).slice(0,10),hora:String(x.hora).slice(0,5),kart:String(x.kart),tipo:x.tipo,motor:x.motor,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?Number(x.mejor_vuelta):null,tanda:x.tanda!=null?Number(x.tanda):null,creado:x.creado||null,vueltas:Array.isArray(x.vueltas)?x.vueltas.map(Number):null});
const COLS='?select=id,piloto,fecha,hora,kart,tipo,motor,pista,archivo,archivo_nombre,mejor_vuelta,vueltas,tanda,creado';
const BK='archivos',MAXF=50*1024*1024;
const slug=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'archivo';
const fsize=n=>n<1048576?Math.max(1,Math.round(n/1024))+' KB':(n/1048576).toFixed(1)+' MB';
const parseLap=t=>{t=String(t||'').trim().toLowerCase().replace(/\s+/g,'').replace(/,/g,'.');if(!t)return null;let m,s=NaN;
if((m=t.match(/^(\d{1,2})(?::|'|´|’|m|min)(\d{1,2}(?:\.\d+)?)(?:s|seg|"|'')?$/)))s=+m[2]<60?(+m[1])*60+(+m[2]):NaN;
else if((m=t.match(/^(\d{1,2})\.(\d{2})\.(\d{1,3})$/)))s=+m[2]<60?(+m[1])*60+(+m[2])+(+('0.'+m[3])):NaN;
else if((m=t.match(/^(\d+(?:\.\d+)?)(?:s|seg)?$/)))s=+m[1];
return s>5&&s<600?Math.round(s*1000)/1000:NaN};
/* Lectura de tiempos del CSV de Race Studio (MyChron / AiM) */
const MESN={jan:1,january:1,ene:1,enero:1,feb:2,february:2,febrero:2,mar:3,march:3,marzo:3,apr:4,april:4,abr:4,abril:4,may:5,mayo:5,jun:6,june:6,junio:6,jul:7,july:7,julio:7,aug:8,august:8,ago:8,agosto:8,sep:9,sept:9,september:9,septiembre:9,setiembre:9,oct:10,october:10,octubre:10,nov:11,november:11,noviembre:11,dec:12,december:12,dic:12,diciembre:12};
const p2=n=>String(n).padStart(2,'0');
function csvFecha(t){t=String(t||'').trim().toLowerCase();if(!t)return null;let m,y,mo,d;
if((m=t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/))){y=+m[1];mo=+m[2];d=+m[3]}
else if((m=t.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/))){let a=+m[1],b=+m[2];y=+m[3];if(y<100)y+=2000;if(b>12){mo=a;d=b}else{d=a;mo=b}}
else{const w=t.replace(/[,.]/g,' ').split(/\s+/).filter(Boolean);for(const x of w){if(MESN[x])mo=MESN[x];else if(/^\d{4}$/.test(x))y=+x;else if(/^\d{1,2}$/.test(x)&&!d)d=+x}}
if(!(y>2000&&mo>=1&&mo<=12&&d>=1&&d<=31))return null;return`${y}-${p2(mo)}-${p2(d)}`}
function csvHora(t){const m=String(t||'').trim().toLowerCase().match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\s*(a\.?\s*m\.?|p\.?\s*m\.?)?$/);if(!m)return null;let h=+m[1];const pm=m[3]&&m[3][0]==='p',am=m[3]&&m[3][0]==='a';if(pm&&h<12)h+=12;if(am&&h===12)h=0;return h<24&&+m[2]<60?`${p2(h)}:${m[2]}`:null}
function csvCells(l,d){const out=[];let cur='',q=false;for(let i=0;i<l.length;i++){const ch=l[i];if(q){if(ch==='"'){if(l[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}else if(ch==='"')q=true;else if(ch===d){out.push(cur.trim());cur=''}else cur+=ch}out.push(cur.trim());return out}
const csvDelim=t=>{const h=String(t).split(/\r?\n/).find(l=>l.trim())||'';return h.split(';').length>h.split(',').length?';':','};
function lapsFromCSV(txt){const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/).slice(0,400);if(!lines.length)return null;
const h=lines.find(l=>l.trim())||'',d=(h.split(';').length>h.split(',').length)?';':',';
const cells=l=>csvCells(l,d);
const row=keys=>{for(const l of lines){const c=cells(l);if(keys.includes((c[0]||'').toLowerCase()))return c.slice(1).filter(x=>x!=='')}return null};
const toks=a=>a.join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).filter(Boolean).map(t=>d===';'?t.replace(',','.'):t);
const tsec=t=>{const m=t.match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/);return m?(+m[1])*60+(+m[2]):/^\d+(\.\d+)?$/.test(t)?+t:NaN};
let laps=[];const bm=row(['beacon markers']);
if(bm){const m=toks(bm).map(tsec).filter(x=>!isNaN(x));for(let i=1;i<m.length;i++)laps.push(m[i]-m[i-1])}
if(!laps.length){const st=row(['segment times','lap times']);if(st){const t=toks(st).map(tsec).filter(x=>!isNaN(x));laps=t.length>=3?t.slice(1,-1):t}}
laps=laps.map(x=>Math.round(x*1000)/1000).filter(x=>x>5&&x<600);
const fr=row(['date','fecha']),hr=row(['time','hora']),fecha=fr?csvFecha(fr.join(d===','?', ':' ')):null,hora=hr?csvHora(hr[0]):null;
if(!laps.length&&!fecha&&!hora)return null;
let bi=0;laps.forEach((x,i)=>{if(x<laps[bi])bi=i});return{laps,best:laps.length?laps[bi]:null,bestIdx:bi,fecha,hora}}
const fmtLap=s=>{if(s==null||isNaN(s))return'—';const m=Math.floor(s/60),r=(s-m*60).toFixed(3);return m?m+':'+r.padStart(6,'0'):r};
const normN=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const lev=(a,b)=>{const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]};
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
<div class="pair"><label>Número de kart<input name="kart" type="number" inputmode="numeric" min="0" max="999" required placeholder="Ej: 17" value="${esc(lastOf('kart'))}"></label><label>Número de tanda<select name="tanda" required><option value="" disabled selected>Elegí</option>${[1,2,3,4,5,6,7].map(n=>`<option value="${n}">Tanda ${n}</option>`).join('')}</select></label></div>
<label>Tipo de kart${sel('tipo',TIPOS,'Elegí el tipo de kart')}</label>
<label>Tipo de motor<input name="motor" list="dlm" required placeholder="Elegí o escribí" value="${esc(lastOf('motor'))}"></label>
<label>Mejor vuelta <span class="opt">(se completa sola con el CSV)</span><input name="mv" inputmode="decimal" autocomplete="off" placeholder="Ej: 49.123 o 1:05.300"></label><div class="mut csvi" id="csvi"></div>
<label class="drop">Archivo del logger <span class="opt">(opcional)</span><input name="archivo" type="file" id="fa"><span class="fn" id="fn">Tocá para elegir el archivo exportado (MyChron, AiM…)</span></label>
<button class="cta" type="submit" id="gs">Guardar sesión</button><div class="mut" id="msg" role="status"></div></form>
<div class="card col"><div class="head"><h2>Sesiones guardadas <span class="mut" id="cnt"></span></h2>
<div class="tools"><select id="fp" aria-label="Filtrar por piloto"></select><button type="button" class="ghost" id="csv">Exportar CSV</button></div></div>
<div class="sync" id="sync" role="status"></div>
<div class="tw"><table class="db"><thead><tr><th>Piloto</th><th>Fecha</th><th>Hora</th><th class="c">Tanda</th><th>Pista</th><th>Kart</th><th>Tipo</th><th>Mejor vuelta</th><th>Archivo</th><th></th></tr></thead><tbody id="tb"></tbody></table></div></div>
<aside class="card col" aria-labelledby="dh"><h2 id="dh">Drivers sessions</h2><div id="dv"></div></aside></div>
<div id="dls"></div>`;bindUbar();
const setSt=(k,t)=>{const e=$('#sync');e.className='sync '+k;e.textContent=t};
let okNew='';
const known=()=>{const acc=P.filter(p=>p.rol==='piloto').map(p=>p.nombre);return{acc,all:[...new Set([...acc,...S.map(x=>x.piloto)])]}};
const sugg=n=>{const k=normN(n);if(!k)return null;let best=null,bd=9;for(const m of known().all){if(m===n)return null;const km=normN(m),fw=km.split(' ')[0],d=km===k?0:lev(km,k),lim=k.length<=4?1:2,dd=Math.min(d,!k.includes(' ')&&k.length>=3&&(fw===k||lev(fw,k)<=(k.length<=4?0:1))?1:9);if(dd<=lim&&dd<bd){bd=dd;best=m}}return best};
const updHint=()=>{const inp=$('#fs').piloto,h=$('#ph');if(!inp||!h)return;const v=inp.value.trim(),{acc,all}=known();h.className='phint';
if(!v){h.innerHTML='';return}
if(!CLOUD){h.innerHTML='';return}
if(acc.includes(v)){h.className='phint ok';h.textContent='✓ Tiene cuenta: la sesión aparece en su perfil.';return}
const sg=sugg(v);if(sg&&okNew!==v){h.className='phint warn';h.innerHTML=`¿Quisiste decir <b>${esc(sg)}</b>? <span class="pbtn"><button type="button" class="chipb" data-use="${esc(sg)}">Usar ${esc(sg)}</button><button type="button" class="chipb" data-new="1">No, es otro piloto</button></span>`;return}
h.textContent=all.includes(v)?'Sin cuenta todavía: creásela en Drivers con este mismo nombre para que vea sus tandas.':'Piloto nuevo sin cuenta: se guarda igual y después le creás la cuenta en Drivers.'};
const drawP=()=>{const w=$('#pwrap');if(!w.querySelector('input')){w.innerHTML=`<input name="piloto" list="dlp" required autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Elegí de la lista o escribí uno nuevo" value="${esc(lastOf('piloto'))}"><div class="phint" id="ph" role="status"></div>`;
w.querySelector('input').oninput=()=>{okNew='';updHint()};
w.onclick=e=>{const t=e.target.closest('button');if(!t)return;e.preventDefault();const inp=$('#fs').piloto;if(t.dataset.use){inp.value=t.dataset.use;okNew=''}else if(t.dataset.new){okNew=inp.value.trim()}updHint()}}
updHint()};
const drawD=()=>{const g={};S.forEach(x=>(g[x.piloto]=g[x.piloto]||[]).push(x));
const names=Object.keys(g).sort((a,b)=>g[b].length-g[a].length||a.localeCompare(b)),acc=new Set(P.map(p=>p.nombre));
$('#dv').innerHTML=names.length?names.map(n=>{const a=g[n].sort(desc);
return`<details class="drv" data-n="${esc(n)}"${open.has(n)?' open':''}><summary><i class="chip" style="background:var(--acc)"></i><span class="dn">${esc(n)}</span>${CLOUD&&!acc.has(n)?'<span class="nocc" title="Este nombre no tiene cuenta en Drivers">sin cuenta</span>':''}<span class="dc">${a.length} ${a.length===1?'tanda':'tandas'}</span></summary>
<dl class="dinfo"><div><dt>Última</dt><dd>${fdate(a[0].fecha)}</dd></div><div><dt>Kart habitual</dt><dd>#${esc(topOf(a,'kart'))}</dd></div><div><dt>Tipo</dt><dd>${esc(topOf(a,'tipo'))}</dd></div><div><dt>Motor</dt><dd>${esc(topOf(a,'motor'))}</dd></div></dl>
<ol class="tandas">${a.map((x,k)=>`<li><b>${x.tanda?'Tanda '+x.tanda:'Sesión'}</b><span>${fdate(x.fecha)} · ${esc(x.hora)} · kart #${esc(x.kart)}</span>${x.pista?`<span>${esc(x.pista)}</span>`:''}<span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.mejor_vuelta!=null?' · mejor vuelta <b class="tl">'+fmtLap(x.mejor_vuelta)+'</b>':''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 '+esc(x.archivo_nombre||'Archivo'))}</li>`).join('')}</ol></details>`}).join('')
:'<p class="mut">Cuando cargues sesiones, acá aparece cada piloto con todas sus tandas.</p>'};
const draw=()=>{const ps=[...new Set(S.map(x=>x.piloto))].sort();if(filt&&!ps.includes(filt))filt='';
$('#fp').innerHTML=`<option value="">Todos los pilotos</option>`+ps.map(p=>`<option${p===filt?' selected':''}>${esc(p)}</option>`).join('');
const rows=S.filter(x=>!filt||x.piloto===filt).sort(porCarga);
$('#cnt').textContent='· '+rows.length;
$('#tb').innerHTML=rows.length?rows.map(x=>`<tr${x.p&&CLOUD?' class="pend" title="Todavía no se subió a la nube"':''}><td>${esc(x.piloto)}</td><td>${fdate(x.fecha)}</td><td>${esc(x.hora)}</td><td class="c">${x.tanda?x.tanda:'<span class="mut">—</span>'}</td><td>${x.pista?esc(x.pista):'<span class="mut">—</span>'}</td><td class="num">${esc(x.kart)}</td><td>${esc(x.tipo)}</td><td class="t">${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'<span class="mut">—</span>'}</td><td>${flink(x,'📎 Descargar')||'<span class="mut">—</span>'}</td><td><button type="button" class="del" data-id="${esc(x.id)}" aria-label="Borrar sesión de ${esc(x.piloto)} del ${fdate(x.fecha)}">✕</button></td></tr>`).join(''):`<tr><td colspan="10" class="mut empty">${S.length?'No hay sesiones de este piloto.':'Todavía no cargaste ninguna sesión.'}</td></tr>`;
$('#dls').innerHTML=dl('dlp',[...P.filter(p=>p.rol==='piloto').map(p=>p.nombre),...S.map(x=>x.piloto)])+dl('dlm',[...MOTORES,...S.map(x=>x.motor)]);
drawD()};
async function sync(){if(!CLOUD)return;if(busy){again=true;return}busy=true;setSt('busy','Sincronizando con la nube…');
try{const pend=S.filter(x=>x.p);
if(pend.length)await api('?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(pend.map(({p,...x})=>({...x,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?x.mejor_vuelta:null,tanda:x.tanda!=null?+x.tanda:null,vueltas:Array.isArray(x.vueltas)?x.vueltas:null,kart:parseInt(x.kart,10)||0})))});
const[rows0,pf]=await Promise.all([api(COLS),getPerfiles()]),rows=rows0.map(norm),ids=new Set(rows.map(x=>x.id)),sent=new Set(pend.map(x=>x.id));
S=[...rows,...S.filter(x=>x.p&&!ids.has(x.id)&&!sent.has(x.id))];saveS(S);P=pf;lsSet(PK,P);
setSt('ok',`Guardado en la nube · ${S.length} ${S.length===1?'sesión':'sesiones'}`)}
catch(e){if(!AUTH){location.reload();return}setSt('err',`Sin conexión con la base de datos (${e.message}). Las sesiones quedan en este dispositivo y se suben solas cuando vuelva la conexión.`)}
busy=false;drawP();draw();if(again){again=false;sync()}}
drawP();draw();if(CLOUD)sync();else setSt('warn','Guardadas solo en este navegador. Para que queden guardadas siempre, conectá la base de datos (pasos en LEEME.txt).');
addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});setInterval(()=>{if(!document.hidden)sync()},60000);
$('#dv').addEventListener('toggle',e=>{const n=e.target.dataset.n;if(n!==undefined)e.target.open?open.add(n):open.delete(n)},true);
const fin=$('#fa'),fnl=$('#fn'),fdef=fnl.textContent;
let LAPS=null,tTouched=false;const fsF=$('#fs');
const sugT=()=>{if(tTouched)return;const pi=fsF.piloto.value.trim(),fe=fsF.fecha.value;if(!pi||!fe)return;const used=S.filter(x=>x.piloto===pi&&x.fecha===fe).map(x=>+x.tanda||0);const n=Math.min(7,Math.max(used.length,...used,0)+1);fsF.tanda.value=String(n)};
fsF.tanda.onchange=()=>{tTouched=true};fsF.fecha.addEventListener('change',sugT);fsF.piloto.addEventListener('change',sugT);fsF.piloto.addEventListener('blur',sugT);sugT();
$('#fs').mv.onblur=e=>{const v=parseLap(e.target.value);if(v!=null&&!isNaN(v))e.target.value=fmtLap(v)};
$('#fs').mv.oninput=()=>{LAPS=null;const ci=$('#csvi');if(ci.classList.contains('ok')){ci.textContent='';ci.className='mut csvi'}};
fin.onchange=async()=>{const fl=fin.files[0];fnl.textContent=fl?`${fl.name} · ${fsize(fl.size)}`:fdef;fnl.parentElement.classList.toggle('has',!!fl);LAPS=null;const ci=$('#csvi');ci.textContent='';ci.className='mut csvi';if(!fl)return;
if(fl.size>MAXF)return;let r=null;try{r=lapsFromCSV(await fl.slice(0,2*1024*1024).text())}catch(e){}
if(r){const fs=$('#fs'),partes=[];if(r.fecha){fs.fecha.value=r.fecha;partes.push('fecha '+fdate(r.fecha))}if(r.hora){fs.hora.value=r.hora;partes.push('hora '+r.hora)}
if(r.laps.length){LAPS=r.laps;fs.mv.value=fmtLap(r.best);partes.unshift(`${r.laps.length} ${r.laps.length===1?'vuelta':'vueltas'}, la mejor fue la ${r.bestIdx+1}ª con ${fmtLap(r.best)}`)}
if(r.fecha&&typeof sugT==='function')sugT();ci.className='mut csvi '+(r.laps.length?'ok':'warn');ci.textContent='Leído del archivo: '+partes.join(' · ')+'.'+(r.laps.length?'':' No encontré tiempos de vuelta: escribí la mejor vuelta a mano.')}
else{ci.className='mut csvi warn';ci.textContent=/\.csv$/i.test(fl.name)?'No encontré tiempos de vuelta en este CSV. Escribí la mejor vuelta a mano.':'Este archivo no es un CSV: no puedo leer los tiempos. Exportalo como CSV desde Race Studio 3 o escribí la mejor vuelta a mano.'}};
$('#fs').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),x={id:uid(),p:1,creado:new Date().toISOString()};['piloto','fecha','hora','tanda','pista','kart','tipo','motor'].forEach(k=>x[k]=String(f.get(k)||'').trim());
if(!x.piloto||!x.tanda||!x.pista||!x.tipo||!x.motor)return;x.tanda=+x.tanda;if(CLOUD&&!known().acc.includes(x.piloto)&&sugg(x.piloto)&&okNew!==x.piloto){updHint();$('#msg').textContent='Revisá el nombre del piloto antes de guardar.';e.target.piloto.focus();return}const mv=parseLap(f.get('mv'));if(Number.isNaN(mv)){$('#msg').textContent='La mejor vuelta no se entiende. Escribila en segundos (49.123) o en minutos y segundos (1:05.300).';e.target.mv.focus();return}x.mejor_vuelta=mv;x.vueltas=LAPS;const fl=fin.files[0],btn=$('#gs');
if(fl){if(!CLOUD){$('#msg').textContent='Para adjuntar archivos hace falta la base de datos conectada.';return}
if(fl.size>MAXF){$('#msg').textContent=`El archivo pesa ${fsize(fl.size)}. El máximo es 50 MB.`;return}
const m=fl.name.match(/\.([A-Za-z0-9]{1,8})$/),ext=m?'.'+m[1].toLowerCase():'';
const path=`${slug(x.piloto)}/${x.fecha}_${x.hora.replace(':','')}_kart${slug(x.kart)}_${x.id.slice(0,8)}${ext}`;
btn.disabled=true;btn.textContent='Subiendo archivo…';$('#msg').textContent='';
try{await stor(path,{method:'POST',headers:{'Content-Type':fl.type||'application/octet-stream','x-upsert':'false'},body:fl})}
catch(err){btn.disabled=false;btn.textContent='Guardar sesión';$('#msg').textContent='No se pudo subir el archivo. Revisá la conexión y probá de nuevo. ('+err.message+')';return}
btn.disabled=false;btn.textContent='Guardar sesión';x.archivo=path;x.archivo_nombre=`${x.piloto} - ${x.fecha} - tanda ${x.tanda} - kart ${x.kart}${ext}`}
S.push(x);const ok=saveS(S);open.add(x.piloto);fin.value='';fin.onchange();e.target.mv.value='';tTouched=false;sugT();
$('#msg').textContent=ok?`Sesión de ${x.piloto} guardada${fl?' con su archivo':''}.`:'Se agregó a la tabla, pero este navegador no permite guardarla.';draw();sync()};
$('#fp').onchange=e=>{filt=e.target.value;draw()};
$('#tb').onclick=async e=>{const b=e.target.closest('.del');if(!b)return;const x=S.find(s=>s.id===b.dataset.id);if(!x||!confirm(`¿Borrar la sesión de ${x.piloto} del ${fdate(x.fecha)} a las ${x.hora}?`))return;
if(CLOUD){try{await api('?id=eq.'+encodeURIComponent(x.id),{method:'DELETE',headers:{Prefer:'return=minimal'}})}catch(err){$('#msg').textContent='No se pudo borrar: no hay conexión con la base de datos. Probá de nuevo en un rato.';return}}
if(CLOUD&&x.archivo){$('#msg').textContent='Borrando archivo…';await stor(x.archivo,{method:'DELETE'}).catch(()=>{})}
S=S.filter(s=>s.id!==x.id);saveS(S);$('#msg').textContent='Sesión borrada.';draw()};
$('#csv').onclick=()=>{const q=t=>'"'+String(t).replace(/"/g,'""')+'"',rows=[['Piloto','Fecha','Hora','Tanda','Pista','Kart','Tipo de kart','Motor','Mejor vuelta','Archivo'],...S.filter(x=>!filt||x.piloto===filt).sort(desc).map(x=>[x.piloto,x.fecha,x.hora,x.tanda||'',x.pista||'',x.kart,x.tipo,x.motor,x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'',x.archivo_nombre||''])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv'}));a.download='sesiones-psdata.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}}
/* Drivers: perfil de cada piloto y cuentas (administrador) */
function perfilHTML(nombre,rows){const a=rows.filter(x=>x.piloto===nombre).sort(desc);
if(!a.length)return`<h2 class="pn">${esc(nombre)}</h2><p class="mut">Todavía no hay tandas cargadas. Cuando el administrador cargue una sesión con tu nombre, aparece acá sola.</p>`;
const dias={};a.forEach(x=>(dias[x.fecha]=dias[x.fecha]||[]).push(x));const fechas=Object.keys(dias).sort().reverse();
const st=(k,v,c='')=>`<div class="st ${c}"><div class="big">${v}</div><div class="mut">${k}</div></div>`;
const cb=a.filter(x=>x.mejor_vuelta!=null).sort((p,q)=>p.mejor_vuelta-q.mejor_vuelta)[0];
return`<h2 class="pn">${esc(nombre)}</h2><div class="stats">${st('tandas',a.length)}${st(fechas.length===1?'día en pista':'días en pista',fechas.length)}${st(cb?'mejor vuelta · '+esc(cb.pista||''):'mejor vuelta',cb?fmtLap(cb.mejor_vuelta):'—','mv')}${st('kart habitual','#'+esc(topOf(a,'kart')))}</div>
<div class="mut hab">Última sesión: <b>${fdate(a[0].fecha)}</b> · Pista habitual: <b>${esc(topOf(a,'pista'))}</b> · Tipo: <b>${esc(topOf(a,'tipo'))}</b> · Motor: <b>${esc(topOf(a,'motor'))}</b></div>
${fechas.map(f=>{const t=dias[f].slice().sort((p,q)=>((+p.tanda||99)-(+q.tanda||99))||p.hora.localeCompare(q.hora));return`<section class="dia"><h3>${flong(f)} <span class="mut">· ${t.length} ${t.length===1?'tanda':'tandas'}</span></h3>
<ol class="tandas">${t.map((x,i)=>`<li><b>Tanda ${x.tanda||i+1} · ${esc(x.hora)}</b><span>${x.pista?esc(x.pista)+' · ':''}kart #${esc(x.kart)}</span><span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.mejor_vuelta!=null?' · mejor vuelta <b class="tl">'+fmtLap(x.mejor_vuelta)+'</b>':''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 Descargar archivo')}</li>`).join('')}</ol></section>`}).join('')}`}
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
<section class="card col"><h2>Récords globales</h2><p class="mut sm">La mejor vuelta de cada piloto en esta pista, separada por tipo de kart. Si alguien la baja, se actualiza sola.</p><div id="rglo"></div></section></div><p class="mut upd" id="up"></p>`;bindUbar();
const opts=(el,list,cur,todas)=>{el.innerHTML=(todas?`<option value="">${todas}</option>`:'')+list.map(x=>`<option${x===cur?' selected':''}>${esc(x)}</option>`).join('')};
const best=rows=>{const m=new Map();rows.forEach(x=>{const b=m.get(x.piloto);if(!b||x.mejor_vuelta<b.mejor_vuelta||(x.mejor_vuelta===b.mejor_vuelta&&x.fecha<b.fecha))m.set(x.piloto,x)});return[...m.values()].sort((a,b)=>a.mejor_vuelta-b.mejor_vuelta||a.fecha.localeCompare(b.fecha))};
const tabla=(rows,extra)=>{if(!rows.length)return'<p class="mut">Todavía no hay tiempos cargados acá.</p>';const p1=rows[0].mejor_vuelta;
return`<table class="db rank"><thead><tr><th>#</th><th>Piloto</th><th>Mejor vuelta</th><th>Dif.</th><th>${extra.h}</th></tr></thead><tbody>${rows.map((x,i)=>`<tr class="${x.piloto===me.nombre?'yo':''}"><td class="pos">${i+1}</td><td>${esc(x.piloto)}${extra.badge?extra.badge(x,i):''}</td><td class="t">${fmtLap(x.mejor_vuelta)}</td><td class="mut">${i?'+'+(x.mejor_vuelta-p1).toFixed(3):'—'}</td><td class="mut">${extra.c(x)}</td></tr>`).join('')}</tbody></table>`};
const draw=()=>{const pistas=[...new Set([...PISTAS,...R.map(x=>x.pista).filter(Boolean)])];
if(!pistas.includes(fP)){const c=new Map();R.forEach(x=>c.set(x.pista,(c.get(x.pista)||0)+1));fP=[...c].sort((a,b)=>b[1]-a[1]).map(x=>x[0]).find(Boolean)||pistas[0]}
const enP=R.filter(x=>x.pista===fP),tipos=[...new Set(enP.map(x=>x.tipo))].sort();if(fT&&!tipos.includes(fT))fT='';
opts($('#rp'),pistas,fP);opts($('#rt'),tipos,fT,'Todas');
const F=enP.filter(x=>!fT||x.tipo===fT),ordT=t=>{const i=TIPOS.indexOf(t);return i<0?99:i},cats=[...new Set(F.map(x=>x.tipo))].sort((p,q)=>ordT(p)-ordT(q)||String(p).localeCompare(q));
const dias=[...new Set(F.map(x=>x.fecha))].sort().reverse();if(!dias.includes(fD))fD=dias[0]||'';
$('#rd').innerHTML=dias.length?dias.map(d=>`<option value="${d}"${d===fD?' selected':''}>${flong(d)}</option>`).join(''):'<option>Sin días con tiempos</option>';$('#rd').disabled=!dias.length;
const day=F.filter(x=>x.fecha===fD),vacio='<p class="mut">Todavía no hay tiempos cargados acá.</p>';
const sec=(t,n,html)=>`<div class="cat"><h3><span class="ct">${esc(t||'Sin tipo')}</span> <span class="mut">· ${n} ${n===1?'piloto':'pilotos'}</span></h3>${html}</div>`;
$('#rday').innerHTML=cats.filter(t=>day.some(x=>x.tipo===t)).map(t=>{const Gt=best(F.filter(x=>x.tipo===t)),rec=new Map(Gt.map(x=>[x.piloto,x])),dt=day.filter(x=>x.tipo===t),bd=best(dt),cnt=n=>dt.filter(x=>x.piloto===n).length;
return sec(t,bd.length,tabla(bd,{h:'Tandas',c:x=>cnt(x.piloto),badge:x=>Gt[0]&&Gt[0].piloto===x.piloto&&Gt[0].fecha===fD&&Gt[0].mejor_vuelta===x.mejor_vuelta?' <span class="bdg rec">Récord</span>':rec.get(x.piloto)&&rec.get(x.piloto).fecha===fD&&rec.get(x.piloto).mejor_vuelta===x.mejor_vuelta?' <span class="bdg pb">Mejor personal</span>':''}))}).join('')||vacio;
$('#rglo').innerHTML=cats.map(t=>{const Gt=best(F.filter(x=>x.tipo===t));return sec(t,Gt.length,tabla(Gt,{h:'Fecha',c:x=>fdate(x.fecha),badge:(x,i)=>i===0?' <span class="bdg rec">Récord</span>':''}))}).join('')||vacio;$('#up').textContent=stamp};
async function load(){try{R=(await rpc('ranking_datos',{})||[]).map(x=>({piloto:x.piloto,fecha:String(x.fecha).slice(0,10),pista:x.pista,tipo:x.tipo,mejor_vuelta:Number(x.mejor_vuelta)}));lsSet('psdata-rank',R);
const d=new Date();stamp=`Actualizado a las ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}. Se actualiza solo.`}
catch(e){if(!AUTH){location.reload();return}stamp='Sin conexión: mostrando lo último guardado.'}draw()}
$('#rp').onchange=e=>{fP=e.target.value;lsSet('psdata-rank-pista',fP);fD='';draw()};$('#rt').onchange=e=>{fT=e.target.value;lsSet('psdata-rank-tipo',fT);fD='';draw()};$('#rd').onchange=e=>{fD=e.target.value;draw()};
draw();load();document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});setInterval(()=>{if(!document.hidden)load()},60000);addEventListener('online',load)}
/* GPS de la tanda: CSV real de la MyChron (Race Studio) */
function parseTelemetry(txt){
const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/),d=csvDelim(txt);
const num=t=>{t=String(t==null?'':t).trim();if(d===';')t=t.replace(',','.');return t===''?NaN:+t};
let hi=-1;for(let i=0;i<Math.min(lines.length,500);i++){const c=csvCells(lines[i],d).map(x=>x.toLowerCase());if(c.some(x=>/latitud/.test(x))&&c.some(x=>/longitud/.test(x))){hi=i;break}}
if(hi<0)return{error:'Este CSV no trae datos de GPS (latitud y longitud). En Race Studio 3, exportá el CSV incluyendo los canales GPS.'};
const H=csvCells(lines[hi],d),find=re=>H.findIndex(x=>re.test(x));
let unidades=[],start=hi+1;const u=csvCells(lines[hi+1]||'',d);if(u.length&&isNaN(num(u[0]))){unidades=u;start=hi+2}
const iT=find(/^(time|tiempo)$/i),iLa=find(/latitud/i),iLo=find(/longitud/i);let iS=find(/^gps speed$/i);if(iS<0)iS=find(/speed|velocidad/i);
const iD=find(/^(distance|distancia)$/i);
if(iT<0)return{error:'No encontré la columna de tiempo (Time) en el CSV.'};
const R=[];for(let i=start;i<lines.length;i++){if(!lines[i].trim())continue;const c=csvCells(lines[i],d);const t=num(c[iT]);if(isNaN(t))continue;R.push(c)}
if(R.length<10)return{error:'El CSV casi no tiene datos.'};
const chans=[];H.forEach((n,j)=>{if(j===iT||j===iLa||j===iLo||!n)return;let ok=0;for(let k=0;k<R.length;k+=Math.max(1,Math.floor(R.length/50)))if(!isNaN(num(R[k][j])))ok++;if(ok>5)chans.push({j,name:n,unit:unidades[j]||''})});
const T=[],LA=[],LO=[],V=[],DI=[],CH={};chans.forEach(c=>CH[c.j]=[]);
R.forEach(c=>{T.push(num(c[iT]));LA.push(num(c[iLa]));LO.push(num(c[iLo]));V.push(iS>=0?num(c[iS]):NaN);DI.push(iD>=0?num(c[iD]):NaN);chans.forEach(ch=>CH[ch.j].push(num(c[ch.j])))});
const ok=LA.map((a,i)=>Math.abs(a)>0.0001&&Math.abs(LO[i])>0.0001&&!isNaN(a)&&!isNaN(LO[i]));
if(ok.filter(Boolean).length<10)return{error:'El GPS del CSV no tiene posiciones válidas (¿la MyChron tenía señal de GPS?).'};
// velocidad desde GPS si no hay canal
const m=[];const head=lines.slice(0,hi);for(const l of head){const c=csvCells(l,d);if(/^beacon markers$/i.test(c[0]||'')){c.slice(1).join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).forEach(t=>{const x=num(t);if(!isNaN(x))m.push(x)})}}
return{T,LA,LO,V,DI,CH,chans,ok,markers:m.sort((a,b)=>a-b),speedCol:iS>=0?H[iS]:null,speedUnit:iS>=0?(unidades[iS]||'km/h'):'km/h'}}
function vGPS(el){
el.innerHTML=`<section class="card col gpsc"><div class="head"><h2>GPS de la tanda</h2><div class="tools gtools"><select id="gs-ses" aria-label="Sesión guardada" hidden></select><label class="ghost filebtn">Abrir CSV<input type="file" accept=".csv,text/csv" id="gs-file" hidden></label></div></div>
<div class="gsel" hidden id="gs-sel"><label>Vuelta<select id="gs-lap"></select></label><label>Dato<select id="gs-ch"></select></label></div>
<div class="gwrap" id="gs-wrap" hidden><div class="gmap" id="gs-map"></div><div class="gchart"><div id="gs-chart"></div><div class="read" id="gs-read"></div></div></div>
<p class="mut" id="gs-msg"></p></section>`;
const msg=t=>{$('#gs-msg').textContent=t||''};let TD=null,lap=null,chJ=null,cur=0;
msg(CLOUD&&AUTH?'Elegí una sesión guardada con su CSV, o abrí un CSV de la compu.':'Abrí un CSV exportado de la MyChron. Si ingresás con tu usuario (en Drivers), también podés elegir tus sesiones guardadas.');
const vcol=(v,a,b)=>{const t=Math.max(0,Math.min(1,(v-a)/((b-a)||1)));return`rgb(${Math.round(228+(45-228)*t)},${Math.round(56+(212-56)*t)},${Math.round(74+(191-74)*t)})`};
function laps(){const T=TD.T,m=TD.markers,out=[];if(m.length>=2){for(let k=0;k+1<m.length;k++){const a=T.findIndex(t=>t>=m[k]);let b=T.findIndex(t=>t>=m[k+1]);if(b<0)b=T.length;if(a>=0&&b-a>5)out.push({n:k+1,a,b,t:m[k+1]-m[k]})}}
if(!out.length)out.push({n:0,a:0,b:T.length,t:T[T.length-1]-T[0]});return out}
let L=[];
function load(txt,nombre){const r=parseTelemetry(txt);if(r.error){$('#gs-wrap').hidden=true;$('#gs-sel').hidden=true;msg(r.error);return}
TD=r;L=laps();const best=L.reduce((p,q)=>q.n&&(!p.n||q.t<p.t)?q:p,L[0]);lap=best;
$('#gs-lap').innerHTML=L.map((x,i)=>`<option value="${i}"${x===best?' selected':''}>${x.n?`Vuelta ${x.n} · ${fmtLap(x.t)}${x===best&&L.length>1?' (mejor)':''}`:'Toda la sesión'}</option>`).join('');
const sp=TD.chans.find(c=>c.name===TD.speedCol);chJ=sp?sp.j:(TD.chans[0]||{}).j;
$('#gs-ch').innerHTML=TD.chans.map(c=>`<option value="${c.j}"${c.j===chJ?' selected':''}>${esc(c.name)}${c.unit?' ('+esc(c.unit)+')':''}</option>`).join('');
$('#gs-wrap').hidden=false;$('#gs-sel').hidden=false;msg((nombre?nombre+' · ':'')+`${L.filter(x=>x.n).length||1} ${L.filter(x=>x.n).length===1?'vuelta':'vueltas'} · ${TD.T.length} puntos de GPS. Mové el cursor sobre el gráfico (o tocá la pista) para ver dónde estaba el kart.`);draw()}
let P=null,VB=null;
function proj(){const ii=TD.LA.map((_,i)=>i).filter(i=>TD.ok[i]),la0=ii.reduce((s,i)=>s+TD.LA[i],0)/ii.length,lo0=ii.reduce((s,i)=>s+TD.LO[i],0)/ii.length,k=Math.cos(la0*Math.PI/180);
P=TD.LA.map((a,i)=>TD.ok[i]?[(TD.LO[i]-lo0)*k*111320,-(a-la0)*110540]:null);const xs=ii.map(i=>P[i][0]),ys=ii.map(i=>P[i][1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),pad=Math.max(x1-x0,y1-y0)*.06;VB=[x0-pad,y0-pad,x1-x0+2*pad,y1-y0+2*pad]}
function draw(){proj();const s=Math.max(VB[2],VB[3])/100,a=lap.a,b=lap.b,V=TD.V,vs=V.slice(a,b).filter(x=>!isNaN(x)),vmin=vs.length?Math.min(...vs):0,vmax=vs.length?Math.max(...vs):1;
const all=P.filter(Boolean).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
const step=Math.max(1,Math.ceil((b-a)/700));let seg='';for(let i=a;i+step<b;i+=step){const p=P[i],q=P[i+step];if(p&&q)seg+=`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${isNaN(V[i])?'var(--acc)':vcol(V[i],vmin,vmax)}" stroke-width="${(s*1.1).toFixed(2)}" stroke-linecap="round"/>`}
const p0=P.slice(a,b).find(Boolean)||[0,0];
$('#gs-map').innerHTML=`<svg viewBox="${VB.map(x=>x.toFixed(1)).join(' ')}" class="gsvg" role="img" aria-label="Trazado GPS de la vuelta"><path d="M${all}" fill="none" stroke="var(--line)" stroke-width="${(s*2.6).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"/>${seg}<circle cx="${p0[0].toFixed(1)}" cy="${p0[1].toFixed(1)}" r="${(s*.9).toFixed(2)}" fill="none" stroke="var(--ink)" stroke-width="${(s*.4).toFixed(2)}"/><circle id="gs-dot" r="${(s*1.6).toFixed(2)}" fill="var(--mv)" stroke="var(--surf)" stroke-width="${(s*.5).toFixed(2)}"/></svg>
<div class="gleg mut"><span class="lg" style="background:rgb(228,56,74)"></span>más lento<span class="lg" style="background:rgb(45,212,191)"></span>más rápido</div>`;
drawChart();setCur(a)}
let CX=null;
function drawChart(){const a=lap.a,b=lap.b,Y=TD.CH[chJ]||[],T=TD.T,t0=T[a],dur=T[b-1]-t0||1,ys=Y.slice(a,b).filter(x=>!isNaN(x));let y0=ys.length?Math.min(...ys):0,y1=ys.length?Math.max(...ys):1;const pd=(y1-y0)*.08||1;y0-=pd;y1+=pd;
const X=t=>44+(t-t0)/dur*680,YY=v=>12+(y1-v)/(y1-y0)*236;CX={X,t0,dur};
const step=Math.max(1,Math.ceil((b-a)/900));let pts='';for(let i=a;i<b;i+=step)if(!isNaN(Y[i]))pts+=X(T[i]).toFixed(1)+','+YY(Y[i]).toFixed(1)+' ';
let grid='';for(let k=0;k<=4;k++){const v=y0+(y1-y0)*k/4;grid+=`<line x1="44" x2="724" y1="${YY(v)}" y2="${YY(v)}" stroke="var(--line)"/><text x="0" y="${YY(v)+4}">${Math.abs(v)>=100?Math.round(v):v.toFixed(1)}</text>`}
const tk=dur>120?30:dur>40?10:5;for(let t=0;t<=dur;t+=tk)grid+=`<text x="${X(t0+t)-6}" y="268">${t}s</text>`;
const c=TD.chans.find(x=>x.j===chJ)||{name:'',unit:''};
$('#gs-chart').innerHTML=`<svg viewBox="0 0 740 276" class="chart gchartsvg" id="gs-svg" role="img" aria-label="${esc(c.name)} durante la vuelta">${grid}<polyline fill="none" stroke="var(--acc)" stroke-width="2" points="${pts}"/><line id="gs-cur" y1="8" y2="252" stroke="var(--mv)" stroke-width="2"/></svg>`;
const svg=$('#gs-svg'),mv=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*740,t=t0+(x-44)/680*dur;let i=a;while(i<b-1&&T[i]<t)i++;setCur(i)};
svg.addEventListener('pointerdown',mv);svg.addEventListener('pointermove',mv)}
function setCur(i){cur=i;const p=P[i],dot=$('#gs-dot');if(p&&dot){dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1])}
const x=CX.X(TD.T[i]);$('#gs-cur').setAttribute('x1',x);$('#gs-cur').setAttribute('x2',x);
const c=TD.chans.find(x=>x.j===chJ)||{name:'',unit:''},val=(TD.CH[chJ]||[])[i],dist=!isNaN(TD.DI[i])&&!isNaN(TD.DI[lap.a])?TD.DI[i]-TD.DI[lap.a]:null;
$('#gs-read').textContent=`${lap.n?'Vuelta '+lap.n+' · ':''}${(TD.T[i]-TD.T[lap.a]).toFixed(2)} s${dist!=null?' · '+Math.round(dist)+' m':''}${!isNaN(TD.V[i])&&c.name!==TD.speedCol?' · '+Math.round(TD.V[i])+' '+TD.speedUnit:''} · ${c.name}: ${isNaN(val)?'—':(Math.abs(val)>=100?Math.round(val):val.toFixed(1))}${c.unit?' '+c.unit:''}`}
$('#gs-map').addEventListener('pointerdown',e=>{const svg=e.target.closest('svg');if(!svg||!TD)return;const r=svg.getBoundingClientRect(),sc=Math.max(VB[2]/r.width,VB[3]/r.height),ox=VB[0]+(VB[2]-r.width*sc)/2,oy=VB[1]+(VB[3]-r.height*sc)/2,x=ox+(e.clientX-r.left)*sc,y=oy+(e.clientY-r.top)*sc;
let bi=lap.a,bd=1e18;for(let i=lap.a;i<lap.b;i++){const p=P[i];if(!p)continue;const dd=(p[0]-x)**2+(p[1]-y)**2;if(dd<bd){bd=dd;bi=i}}setCur(bi)});
$('#gs-lap').onchange=e=>{lap=L[+e.target.value];draw()};$('#gs-ch').onchange=e=>{chJ=+e.target.value;drawChart();setCur(Math.max(lap.a,Math.min(cur,lap.b-1)))};
$('#gs-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;msg('Leyendo '+f.name+'…');try{load(await f.text(),f.name)}catch(err){msg('No pude leer el archivo: '+err.message)}e.target.value=''};
if(CLOUD&&AUTH){(async()=>{try{const rows=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(desc);if(!rows.length)return;const sel=$('#gs-ses');
sel.innerHTML='<option value="">Elegí una sesión…</option>'+rows.map(x=>`<option value="${esc(x.id)}">${esc(x.piloto)} · ${fdate(x.fecha)}${x.tanda?' · tanda '+x.tanda:''}${x.pista?' · '+esc(x.pista):''}</option>`).join('');sel.hidden=false;
sel.onchange=async()=>{const x=rows.find(r=>r.id===sel.value);if(!x)return;msg('Bajando el CSV de '+x.piloto+'…');try{const j=await req('/storage/v1/object/sign/'+BK+'/'+x.archivo,{method:'POST',headers:J,body:JSON.stringify({expiresIn:120})});
const r=await fetch(BASE+'/storage/v1'+(j.signedURL||j.signedUrl));if(!r.ok)throw new Error('HTTP '+r.status);load(await r.text(),`${x.piloto} · ${fdate(x.fecha)}${x.tanda?' · tanda '+x.tanda:''}`)}catch(err){msg('No se pudo bajar el archivo: '+err.message)}}}catch(e){}})()}}
const pg=document.body.dataset.page;
const fn={h:v=>{v.innerHTML=mapSVG(D[0].best,'')},a:vA,r:vR,s:vS,d:vDr}[pg];
const view=()=>{stop();fn($('#view'))};
if(fn&&$('#view'))view();
if(pg==='a'&&$('#gpsv'))vGPS($('#gpsv'));
