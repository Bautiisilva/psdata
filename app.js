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
/* En vivo */
function vL(v){
const S=D.map((d,i)=>({s:-i*10,l0:0,last:null,best:null,n:-1}));let tn=0,prev=0,acc=0,order=[...D.keys()];
v.innerHTML=`<div class="card">${mapSVG(null,D.map((d,i)=>dot('p'+i,d.c)).join(''))}<div class="mut">Simulación a velocidad 3×</div></div>
<div class="card"><div class="tele"><div><div class="big" id="tv">0</div><div class="mut">km/h</div></div><div><div class="big" id="tg">0.0</div><div class="mut">G lateral</div></div><div><div class="big" id="tl">1</div><div class="mut">vuelta</div></div></div><div class="mut" id="tn" style="text-align:center;margin-top:8px"></div></div>
<div class="card" id="bd"></div>`;
$('#bd').addEventListener('pointerdown',e=>{const r=e.target.closest('[data-i]');if(r)st.f=+r.dataset.i});
function frame(ts){const dt=Math.min(.05,(ts-prev)/1000)*3;prev=ts;tn+=dt;
S.forEach((p,i)=>{const ix=Math.floor((((p.s%L)+L)%L)/ds)%N;p.s+=D[i].laps[3].v[ix]/3.6*dt;p.ix=ix;mv('p'+i,ix);
const n=Math.floor(p.s/L);if(n>p.n){p.n=n;if(n>=1){p.last=tn-p.l0;if(p.best===null||p.last<p.best)p.best=p.last}p.l0=tn}});
const f=S[st.f],ix=f.ix||0,vk=D[st.f].laps[3].v[ix];
$('#tv').textContent=Math.round(vk);$('#tg').textContent=((vk/3.6)**2*cv[ix]/ds/9.81).toFixed(1);$('#tl').textContent=Math.max(1,f.n+1);
$('#tn').textContent=`${D[st.f].n} · última ${f.last?fmt(f.last):'—'} · mejor ${f.best?fmt(f.best):'—'}`;
acc+=dt;if(acc>.75||!$('#bd').firstChild){acc=0;order=S.map((p,i)=>i).sort((a,b)=>S[b].s-S[a].s);const ld=S[order[0]].s;
$('#bd').innerHTML=order.map((i,k)=>`<button class="row ${i===st.f?'on':''}" data-i="${i}"><b>${k+1}</b><i class="chip" style="background:${D[i].c}"></i>${D[i].n}<span class="g">${k?'+'+((ld-S[i].s)/19).toFixed(1)+' s':'líder'}</span></button>`).join('')}
raf=requestAnimationFrame(frame)}
raf=requestAnimationFrame(t=>{prev=t;frame(t)})}
/* Ranking */
function vR(v){const o=[...D.keys()].sort((a,b)=>D[b].pts-D[a].pts),mx=Math.max(...D.map(d=>d.sd));
v.innerHTML=`<div class="card"><table><tr><th>Piloto</th><th>Pts</th><th>Mejor vuelta</th><th>Regularidad</th></tr>${o.map((i,k)=>{const d=D[i];return`<tr><td style="padding:10px 4px"><b style="font:700 18px 'Barlow Condensed',sans-serif">${k+1}</b> <i class="chip" style="background:${d.c}"></i>${d.n}</td><td>${d.pts}</td><td style="font-family:'Barlow Condensed',sans-serif;font-size:17px">${fmt(d.best.time)}</td><td><div class="bar" title="σ ${d.sd.toFixed(3)} s"><i style="width:${100-d.sd/mx*70}%;background:${d.c}"></i></div></td></tr>`}).join('')}</table>
<p class="mut">Regularidad: más barra, menos variación entre vueltas (se excluye la vuelta de salida).</p></div>`}
/* Sesiones */
const PISTAS=['HMS Clockwise','HMS Counter-Clockwise','HMS (sin horquilla)'];
const TIPOS=['Shifter','L206','Rotax Sr','Rotax Jr','K100 Sr','K100 Jr','DD2','Micro Mini','Bambino'];
const MOTORES=['60cc 2T','IAME X30 125cc','Rotax Max 125cc','Vortex 125cc','KZ 125cc (con cambios)','Honda GX 4T','Briggs & Stratton 4T','Eléctrico'];
const SK='psdata-sesiones',CFG=window.PSDATA_DB||{},CLOUD=!!(CFG.url&&CFG.key);
const uid=()=>crypto.randomUUID?crypto.randomUUID():'10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
const loadS=()=>{let a;try{a=JSON.parse(localStorage.getItem(SK))||[]}catch(e){a=[]}return a.map(x=>x.id?x:{...x,id:uid(),p:1})};
const saveS=a=>{try{localStorage.setItem(SK,JSON.stringify(a));return true}catch(e){return false}};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fdate=d=>{const[y,m,dd]=d.split('-');return dd+'/'+m+'/'+y};
const desc=(a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora);
const api=(q,o={})=>fetch(CFG.url.replace(/\/+$/,'')+'/rest/v1/sesiones'+q,{...o,headers:{apikey:CFG.key,...(CFG.key.startsWith('sb_')?{}:{Authorization:'Bearer '+CFG.key}),'Content-Type':'application/json',...(o.headers||{})}})
.then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(t=>t?JSON.parse(t):null);
const norm=x=>({id:x.id,piloto:x.piloto,fecha:String(x.fecha).slice(0,10),hora:String(x.hora).slice(0,5),kart:String(x.kart),tipo:x.tipo,motor:x.motor,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null});
const BK='archivos',MAXF=50*1024*1024;
const slug=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'archivo';
const stor=(path,o={})=>fetch(CFG.url.replace(/\/+$/,'')+'/storage/v1/object/'+BK+'/'+path,{...o,headers:{apikey:CFG.key,...(CFG.key.startsWith('sb_')?{}:{Authorization:'Bearer '+CFG.key}),...(o.headers||{})}}).then(r=>{if(!r.ok)return r.text().then(t=>{throw new Error('HTTP '+r.status+' '+t.slice(0,120))});return r});
const furl=x=>CFG.url.replace(/\/+$/,'')+'/storage/v1/object/public/'+BK+'/'+x.archivo+'?download='+encodeURIComponent(x.archivo_nombre||'archivo');
const flink=(x,txt)=>x.archivo&&CLOUD?`<a class="file" href="${esc(furl(x))}" download="${esc(x.archivo_nombre||'')}" title="Descargar ${esc(x.archivo_nombre||'archivo')}">${txt}</a>`:'';
const fsize=n=>n<1048576?Math.max(1,Math.round(n/1024))+' KB':(n/1048576).toFixed(1)+' MB';
function vS(v){let S=loadS(),filt='',busy=false,again=false;const open=new Set();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const now=new Date(),pad=n=>String(n).padStart(2,'0'),hoy=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,hora=`${pad(now.getHours())}:${pad(now.getMinutes())}`;
const dl=(id,a)=>`<datalist id="${id}">${[...new Set(a)].map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`;
const lastOf=k=>S.length?S[S.length-1][k]:'';
v.innerHTML=`<div class="ses"><form class="card col" id="fs" autocomplete="off"><h2>Nueva sesión</h2>
<label>Piloto<input name="piloto" list="dlp" required placeholder="Elegí o escribí un nombre" value="${esc(lastOf('piloto'))}"></label>
<div class="pair"><label>Fecha<input name="fecha" type="date" required value="${hoy}"></label><label>Hora de la sesión<input name="hora" type="time" required value="${hora}"></label></div>
<label>Pista<select name="pista" required><option value="" disabled${PISTAS.includes(lastOf('pista'))?'':' selected'}>Elegí la pista</option>${PISTAS.map(t=>`<option${t===lastOf('pista')?' selected':''}>${t}</option>`).join('')}</select></label>
<label>Número de kart<input name="kart" type="number" inputmode="numeric" min="0" max="999" required placeholder="Ej: 17" value="${esc(lastOf('kart'))}"></label>
<label>Tipo de kart<select name="tipo" required><option value="" disabled${TIPOS.includes(lastOf('tipo'))?'':' selected'}>Elegí el tipo de kart</option>${TIPOS.map(t=>`<option${t===lastOf('tipo')?' selected':''}>${t}</option>`).join('')}</select></label>
<label>Tipo de motor<input name="motor" list="dlm" required placeholder="Elegí o escribí" value="${esc(lastOf('motor'))}"></label>
<label class="drop">Archivo del logger <span class="opt">(opcional)</span><input name="archivo" type="file" id="fa"><span class="fn" id="fn">Tocá para elegir el archivo exportado (MyChron, AiM…)</span></label>
<button class="cta" type="submit" id="gs">Guardar sesión</button><div class="mut" id="msg" role="status"></div></form>
<div class="card col"><div class="head"><h2>Sesiones guardadas <span class="mut" id="cnt"></span></h2>
<div class="tools"><select id="fp" aria-label="Filtrar por piloto"></select><button type="button" class="ghost" id="csv">Exportar CSV</button></div></div>
<div class="sync" id="sync" role="status"></div>
<div class="tw"><table class="db"><thead><tr><th>Piloto</th><th>Fecha</th><th>Hora</th><th>Pista</th><th>Kart</th><th>Tipo</th><th>Motor</th><th>Archivo</th><th></th></tr></thead><tbody id="tb"></tbody></table></div></div>
<aside class="card col" aria-labelledby="dh"><h2 id="dh">Drivers sessions</h2><div id="dv"></div></aside></div>
<div id="dls"></div>`;
const setSt=(k,t)=>{const e=$('#sync');e.className='sync '+k;e.textContent=t};
const local=()=>setSt('warn','Guardadas solo en este navegador. Para que queden guardadas siempre y se vean desde cualquier dispositivo, conectá la base de datos (pasos en LEEME.txt).');
const drawD=()=>{const g={};S.forEach(x=>(g[x.piloto]=g[x.piloto]||[]).push(x));
const top=(a,k)=>{const c=new Map();a.forEach(x=>c.set(x[k],(c.get(x[k])||0)+1));return[...c].sort((p,q)=>q[1]-p[1])[0][0]};
const names=Object.keys(g).sort((a,b)=>g[b].length-g[a].length||a.localeCompare(b));
$('#dv').innerHTML=names.length?names.map(n=>{const a=g[n].sort(desc),dc=D.find(d=>d.n===n);
return`<details class="drv" data-n="${esc(n)}"${open.has(n)?' open':''}><summary><i class="chip" style="background:${dc?dc.c:'var(--acc)'}"></i><span class="dn">${esc(n)}</span><span class="dc">${a.length} ${a.length===1?'tanda':'tandas'}</span></summary>
<dl class="dinfo"><div><dt>Última</dt><dd>${fdate(a[0].fecha)}</dd></div><div><dt>Kart habitual</dt><dd>#${esc(top(a,'kart'))}</dd></div><div><dt>Tipo</dt><dd>${esc(top(a,'tipo'))}</dd></div><div><dt>Motor</dt><dd>${esc(top(a,'motor'))}</dd></div></dl>
<ol class="tandas">${a.map((x,k)=>`<li><b>Tanda ${a.length-k}</b><span>${fdate(x.fecha)} · ${esc(x.hora)} · kart #${esc(x.kart)}</span>${x.pista?`<span>${esc(x.pista)}</span>`:''}<span class="mut">${esc(x.tipo)} · ${esc(x.motor)}</span>${flink(x,'📎 '+esc(x.archivo_nombre||'Archivo'))}</li>`).join('')}</ol></details>`}).join('')
:'<p class="mut">Cuando cargues sesiones, acá aparece cada piloto con todas sus tandas.</p>'};
const draw=()=>{const ps=[...new Set(S.map(x=>x.piloto))].sort();if(filt&&!ps.includes(filt))filt='';
$('#fp').innerHTML=`<option value="">Todos los pilotos</option>`+ps.map(p=>`<option${p===filt?' selected':''}>${esc(p)}</option>`).join('');
const rows=S.filter(x=>!filt||x.piloto===filt).sort(desc);
$('#cnt').textContent='· '+rows.length;
$('#tb').innerHTML=rows.length?rows.map(x=>`<tr${x.p&&CLOUD?' class="pend" title="Todavía no se subió a la nube"':''}><td>${esc(x.piloto)}</td><td>${fdate(x.fecha)}</td><td>${esc(x.hora)}</td><td>${x.pista?esc(x.pista):'<span class="mut">—</span>'}</td><td class="num">${esc(x.kart)}</td><td>${esc(x.tipo)}</td><td>${esc(x.motor)}</td><td>${flink(x,'📎 Descargar')||'<span class="mut">—</span>'}</td><td><button type="button" class="del" data-id="${esc(x.id)}" aria-label="Borrar sesión de ${esc(x.piloto)} del ${fdate(x.fecha)}">✕</button></td></tr>`).join(''):`<tr><td colspan="9" class="mut empty">${S.length?'No hay sesiones de este piloto.':'Todavía no cargaste ninguna sesión.'}</td></tr>`;
$('#dls').innerHTML=dl('dlp',[...D.map(d=>d.n),...S.map(x=>x.piloto)])+dl('dlm',[...MOTORES,...S.map(x=>x.motor)]);
drawD()};
async function sync(){if(!CLOUD)return;if(busy){again=true;return}busy=true;setSt('busy','Sincronizando con la nube…');
try{const pend=S.filter(x=>x.p);
if(pend.length)await api('?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(pend.map(({p,...x})=>({...x,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,kart:parseInt(x.kart,10)||0})))});
const rows=(await api('?select=id,piloto,fecha,hora,kart,tipo,motor,pista,archivo,archivo_nombre')).map(norm),ids=new Set(rows.map(x=>x.id)),sent=new Set(pend.map(x=>x.id));
S=[...rows,...S.filter(x=>x.p&&!ids.has(x.id)&&!sent.has(x.id))];saveS(S);
setSt('ok',`Guardado en la nube · ${S.length} ${S.length===1?'sesión':'sesiones'}`)}
catch(e){setSt('err',`Sin conexión con la base de datos (${e.message}). Las sesiones quedan en este dispositivo y se suben solas cuando vuelva la conexión.`)}
busy=false;draw();if(again){again=false;sync()}}
draw();if(CLOUD)sync();else local();
addEventListener('online',sync);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});setInterval(()=>{if(!document.hidden)sync()},60000);
$('#dv').addEventListener('toggle',e=>{const n=e.target.dataset.n;if(n!==undefined)e.target.open?open.add(n):open.delete(n)},true);
const fin=$('#fa'),fnl=$('#fn'),fdef=fnl.textContent;
fin.onchange=()=>{const fl=fin.files[0];fnl.textContent=fl?`${fl.name} · ${fsize(fl.size)}`:fdef;fnl.parentElement.classList.toggle('has',!!fl)};
$('#fs').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),x={id:uid(),p:1};['piloto','fecha','hora','pista','kart','tipo','motor'].forEach(k=>x[k]=String(f.get(k)).trim());
if(!x.piloto||!x.pista||!x.tipo||!x.motor)return;const fl=fin.files[0],btn=$('#gs');
if(fl){if(!CLOUD){$('#msg').textContent='Para adjuntar archivos hace falta la base de datos conectada.';return}
if(fl.size>MAXF){$('#msg').textContent=`El archivo pesa ${fsize(fl.size)}. El máximo es 50 MB.`;return}
const m=fl.name.match(/\.([A-Za-z0-9]{1,8})$/),ext=m?'.'+m[1].toLowerCase():'';
const path=`${slug(x.piloto)}/${x.fecha}_${x.hora.replace(':','')}_kart${slug(x.kart)}_${x.id.slice(0,8)}${ext}`;
btn.disabled=true;btn.textContent='Subiendo archivo…';$('#msg').textContent='';
try{await stor(path,{method:'POST',headers:{'Content-Type':fl.type||'application/octet-stream','x-upsert':'false'},body:fl})}
catch(err){btn.disabled=false;btn.textContent='Guardar sesión';$('#msg').textContent='No se pudo subir el archivo. Revisá la conexión y probá de nuevo. ('+err.message+')';return}
btn.disabled=false;btn.textContent='Guardar sesión';x.archivo=path;x.archivo_nombre=`${x.piloto} - ${x.fecha} ${x.hora.replace(':','.')} - kart ${x.kart}${ext}`}
S.push(x);const ok=saveS(S);open.add(x.piloto);fin.value='';fin.onchange();
$('#msg').textContent=ok?`Sesión de ${x.piloto} guardada${fl?' con su archivo':''}.`:'Se agregó a la tabla, pero este navegador no permite guardarla.';draw();sync()};
$('#fp').onchange=e=>{filt=e.target.value;draw()};
$('#tb').onclick=async e=>{const b=e.target.closest('.del');if(!b)return;const x=S.find(s=>s.id===b.dataset.id);if(!x||!confirm(`¿Borrar la sesión de ${x.piloto} del ${fdate(x.fecha)} a las ${x.hora}?`))return;
if(CLOUD){try{await api('?id=eq.'+encodeURIComponent(x.id),{method:'DELETE',headers:{Prefer:'return=minimal'}})}catch(err){$('#msg').textContent='No se pudo borrar: no hay conexión con la base de datos. Probá de nuevo en un rato.';return}}
if(CLOUD&&x.archivo)stor(x.archivo,{method:'DELETE'}).catch(()=>{});
S=S.filter(s=>s.id!==x.id);saveS(S);$('#msg').textContent='Sesión borrada.';draw()};
$('#csv').onclick=()=>{const q=t=>'"'+String(t).replace(/"/g,'""')+'"',rows=[['Piloto','Fecha','Hora','Pista','Kart','Tipo de kart','Motor','Archivo'],...S.filter(x=>!filt||x.piloto===filt).sort(desc).map(x=>[x.piloto,x.fecha,x.hora,x.pista||'',x.kart,x.tipo,x.motor,x.archivo&&CLOUD?furl(x):''])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv'}));a.download='sesiones-psdata.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}}
const pg=document.body.dataset.page;
const fn={h:v=>{v.innerHTML=mapSVG(D[0].best,'')},a:vA,l:vL,r:vR,s:vS}[pg];
const view=()=>{stop();fn($('#view'))};
if(fn&&$('#view'))view();
