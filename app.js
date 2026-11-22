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
const MOTORES=['Práctica','Carrera'];
const NEUMATICOS=['Slicks','Wets'],CONDICION=['Seco','Mojado','Húmedo'];
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
const TESP={8:'FP1',9:'FP2',10:'Qualy',11:'Final 1',12:'Final 2'};
const tLbl=t=>TESP[+t]||('Tanda '+t),tLow=t=>TESP[+t]||('tanda '+t),tShort=t=>TESP[+t]||String(t);
const desc=(a,b)=>(b.fecha+b.hora).localeCompare(a.fecha+a.hora)||((+b.tanda||0)-(+a.tanda||0));
const norm=x=>({id:x.id,piloto:x.piloto,fecha:String(x.fecha).slice(0,10),hora:String(x.hora).slice(0,5),kart:String(x.kart),tipo:x.tipo,motor:x.motor,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?Number(x.mejor_vuelta):null,tanda:x.tanda!=null?Number(x.tanda):null,creado:x.creado||null,neumaticos:x.neumaticos||null,condicion:x.condicion||null,vuelta_teorica:x.vuelta_teorica!=null?Number(x.vuelta_teorica):null,microsectores:x.microsectores||null,vueltas:Array.isArray(x.vueltas)?x.vueltas.map(Number):null});
const COLS='?select=id,piloto,fecha,hora,kart,tipo,motor,pista,archivo,archivo_nombre,mejor_vuelta,vueltas,tanda,creado,vuelta_teorica,microsectores,neumaticos,condicion';
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
const hBase=x=>String(x||'').toLowerCase().replace(/\s*\([^)]*\)\s*$/,'').trim(),hUnit=x=>{const m=String(x||'').match(/\(([^)]*)\)\s*$/);return m?m[1].trim().toLowerCase():''};
/* Vueltas desde una columna "lap" (CSV convertidos desde .xrk/.xrz): cruces de línea y vueltas completas */
function lapCol(txt){const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/),d=csvDelim(txt),num=t=>{t=String(t==null?'':t).trim();if(d===';')t=t.replace(',','.');return t===''?NaN:+t};
let hi=-1,H=null,HR=null;for(let i=0;i<Math.min(lines.length,60);i++){const raw=csvCells(lines[i],d),c=raw.map(hBase);if(c.some(x=>/^(lap|vuelta)$/.test(x))&&c.some(x=>/^(time|tiempo)(_s|_ms)?$/.test(x))){hi=i;H=c;HR=raw;break}}
if(hi<0)return null;
const f=re=>H.findIndex(x=>re.test(x)),iL=f(/^(lap|vuelta)$/),iLT=f(/^(lap[_ ]?(time|elapsed)|tiempo[_ ]?vuelta)(_s)?$/),iTot=f(/^lap[_ ]?total[_ ]?time(_s)?$/);let iTs=f(/^(time|tiempo)(_s)?$/),iTms=f(/^(time|tiempo)_ms$/);if(iTs>=0&&hUnit(HR[iTs])==='ms'){iTms=iTs;iTs=-1}const iD=f(/^(distance|distancia)(_m)?$/);
const laps=new Map();
for(let i=hi+1;i<lines.length;i++){if(!lines[i])continue;const c=csvCells(lines[i],d),t=iTs>=0?num(c[iTs]):num(c[iTms])/1000,l=num(c[iL]);if(isNaN(t)||isNaN(l))continue;
const lt=iLT>=0?num(c[iLT]):NaN,dd=iD>=0?num(c[iD]):NaN,tot=iTot>=0?num(c[iTot]):NaN;let L=laps.get(l);if(!L){L={n:l,start:isNaN(lt)?t:t-lt,d0:dd,d1:dd,tEnd:t,tot:NaN};laps.set(l,L)}L.tEnd=t;if(!isNaN(dd))L.d1=dd;if(!isNaN(tot)&&tot>0)L.tot=tot}
const arr=[...laps.values()].sort((a,b)=>a.n-b.n);if(arr.length<2)return{markers:[],nums:[]};
const iv=arr.map((L,k)=>({n:L.n,a:L.start,b:k+1<arr.length?arr[k+1].start:L.tEnd,dist:L.d1-L.d0,tot:L.tot,open:k+1===arr.length}));
const med=a=>{const s=a.filter(x=>!isNaN(x)).sort((p,q)=>p-q);return s.length?s[Math.floor(s.length/2)]:NaN};
const mid=iv.slice(1,-1),mD=med(mid.map(x=>x.dist)),mT=med(mid.map(x=>x.b-x.a));
const ok=x=>!isNaN(mD)&&!isNaN(x.dist)?Math.abs(x.dist-mD)/mD<0.03&&(isNaN(mT)||Math.abs((x.b-x.a)-mT)/mT<0.3):!isNaN(mT)&&!x.open&&Math.abs((x.b-x.a)-mT)/mT<0.05;
const keep=iv.filter((x,k)=>k>0&&k<iv.length-1||ok(x));if(!keep.length)return{markers:[],nums:[]};
// marcas = inicio de cada vuelta completa + fin de la última (las vueltas completas son consecutivas)
return{markers:[...keep.map(x=>x.a),keep[keep.length-1].b],nums:keep.map(x=>x.n),times:keep.map(x=>!isNaN(x.tot)?x.tot:x.b-x.a)}}
function lapsFromCSV(txt){const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/).slice(0,400);if(!lines.length)return null;
const h=lines.find(l=>l.trim())||'',d=(h.split(';').length>h.split(',').length)?';':',';
const cells=l=>csvCells(l,d);
const row=keys=>{for(const l of lines){const c=cells(l);if(keys.includes((c[0]||'').toLowerCase()))return c.slice(1).filter(x=>x!=='')}return null};
const toks=a=>a.join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).filter(Boolean).map(t=>d===';'?t.replace(',','.'):t);
const tsec=t=>{const m=t.match(/^(\d+):(\d{1,2}(?:\.\d+)?)$/);return m?(+m[1])*60+(+m[2]):/^\d+(\.\d+)?$/.test(t)?+t:NaN};
let laps=[];const bm=row(['beacon markers']);
if(bm){const m=toks(bm).map(tsec).filter(x=>!isNaN(x));for(let i=1;i<m.length;i++)laps.push(m[i]-m[i-1])}
if(!laps.length){const st=row(['segment times','lap times']);if(st){const t=toks(st).map(tsec).filter(x=>!isNaN(x));laps=t.length>=3?t.slice(1,-1):t}}
let nums=null;if(!laps.length){const lc=lapCol(txt);if(lc&&lc.markers.length>1){laps=lc.times||lc.markers.slice(1).map((x,i)=>x-lc.markers[i]);nums=lc.nums}}
const keepI=laps.map((x,i)=>i).filter(i=>laps[i]>5&&laps[i]<600);laps=keepI.map(i=>Math.round(laps[i]*1000)/1000);if(nums)nums=keepI.map(i=>nums[i]);
const fr=row(['date','fecha']),hr=row(['time','hora']),fecha=fr?csvFecha(fr.join(d===','?', ':' ')):null,hora=hr?csvHora(hr[0]):null;
if(!laps.length&&!fecha&&!hora)return null;
let bi=0;laps.forEach((x,i)=>{if(x<laps[bi])bi=i});return{laps,best:laps.length?laps[bi]:null,bestIdx:bi,bestN:nums?nums[bi]:bi+1,nums,fecha,hora}}
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
let S=loadS(),P=lsGet(PK,[]),filt='',busy=false,again=false,editId=null;const open=new Set();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const now=new Date(),pad=n=>String(n).padStart(2,'0'),hoy=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,hora=`${pad(now.getHours())}:${pad(now.getMinutes())}`;
const dl=(id,a)=>`<datalist id="${id}">${[...new Set(a)].map(x=>`<option value="${esc(x)}">`).join('')}</datalist>`;
const lastOf=k=>S.length?S[S.length-1][k]:'';
const sel=(name,list,ph)=>`<select name="${name}" required><option value="" disabled${list.includes(lastOf(name))?'':' selected'}>${ph}</option>${list.map(t=>`<option${t===lastOf(name)?' selected':''}>${esc(t)}</option>`).join('')}</select>`;
v.innerHTML=ubar()+`<div class="ses"><form class="card col" id="fs" autocomplete="off"><h2 id="fsh">Nueva sesión</h2><div class="editbar" id="eb" hidden></div>
<label>Piloto<span id="pwrap"></span></label>
<div class="pair"><label>Fecha<input name="fecha" type="date" required value="${hoy}"></label><label>Hora de la sesión<input name="hora" type="time" required value="${hora}"></label></div>
<label>Pista${sel('pista',PISTAS,'Elegí la pista')}</label>
<div class="pair"><label>Número de kart<input name="kart" type="number" inputmode="numeric" min="0" max="999" required placeholder="Ej: 17" value="${esc(lastOf('kart'))}"></label><label>Número de tanda<select name="tanda" required><option value="" disabled selected>Elegí</option>${[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`<option value="${n}">${tLbl(n)}</option>`).join('')}</select></label></div>
<label>Tipo de kart${sel('tipo',TIPOS,'Elegí el tipo de kart')}</label>
<label>Tipo de motor${sel('motor',MOTORES,'Elegí el motor')}</label>
<div class="pair"><label>Neumáticos${sel('neumaticos',NEUMATICOS,'Elegí')}</label><label>Condición de pista${sel('condicion',CONDICION,'Elegí')}</label></div>
<label>Mejor vuelta <span class="opt">(se completa sola con el CSV)</span><input name="mv" inputmode="decimal" autocomplete="off" placeholder="Ej: 49.123 o 1:05.300"></label><div class="mut csvi" id="csvi"></div>
<label class="drop">Archivo del logger <span class="opt">(opcional)</span><input name="archivo" type="file" id="fa"><span class="fn" id="fn">Tocá para elegir el archivo exportado (MyChron, AiM…)</span></label>
<button class="cta" type="submit" id="gs">Guardar sesión</button><button type="button" class="ghost gc" id="gc" hidden>Cancelar</button><div class="mut" id="msg" role="status"></div></form>
<div class="stack"><div class="card col"><div class="head"><h2>Sesiones guardadas <span class="mut" id="cnt"></span></h2>
<div class="tools"><select id="fg" aria-label="Ordenar o agrupar"><option value="carga">Orden de carga</option><option value="fecha">Por fecha y hora</option><option value="piloto">Por piloto</option></select><select id="fp" aria-label="Filtrar por piloto"></select><button type="button" class="ghost" id="csv">Exportar CSV</button></div></div>
<div class="sync" id="sync" role="status"></div>
<div class="tw"><table class="db"><thead><tr><th>Piloto</th><th>Fecha</th><th>Hora</th><th class="c">Tanda</th><th>Pista</th><th>Kart</th><th>Tipo</th><th>Mejor vuelta</th><th>Teórica</th><th>Archivo</th><th></th></tr></thead><tbody id="tb"></tbody></table></div></div></div>
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
const PNK='psdata-pilotos-nombres';
const pilNames=()=>{const set=new Set([...P.filter(p=>p.rol==='piloto').map(p=>p.nombre),...S.map(x=>x.piloto),...lsGet(PNK,[])].filter(Boolean));return[...set].sort((a,b)=>a.localeCompare(b))};
const setPil=n=>{const sel=$('#psel'),inp=$('#fs').piloto;if(!sel)return;sel.dataset.user='1';if(n&&[...sel.options].some(o=>o.value===n)){sel.value=n;inp.value=n;inp.hidden=true}else if(n==='__nuevo'||n){sel.value='__nuevo';inp.hidden=false;inp.value=n==='__nuevo'?'':n}else{sel.value='';inp.value='';inp.hidden=true}okNew='';updHint();if(typeof sugT==='function')sugT()};
const drawP=()=>{const w=$('#pwrap');const ns=pilNames();
if(!w.querySelector('#psel')){w.innerHTML=`<select id="psel" aria-label="Piloto"></select><input name="piloto" id="pnew" hidden autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Nombre del piloto nuevo"><div class="phint" id="ph" role="status"></div>`;
const sel=$('#psel'),inp=$('#pnew');
sel.onchange=()=>{sel.dataset.user='1';if(sel.value==='__nuevo'){inp.hidden=false;inp.value='';inp.focus()}else{inp.hidden=true;inp.value=sel.value}okNew='';updHint();if(typeof sugT==='function')sugT()};
inp.oninput=()=>{okNew='';updHint()};
w.onclick=e=>{const t=e.target.closest('button');if(!t)return;e.preventDefault();if(t.dataset.use){setPil(t.dataset.use)}else if(t.dataset.new){okNew=inp.value.trim();updHint()}};
var first=true}
const sel=$('#psel'),cur=sel.dataset.user?(sel.value==='__nuevo'?'__nuevo':sel.value):lastOf('piloto'),nuevo=$('#pnew').value;
sel.innerHTML=`<option value="" disabled>Elegí el piloto</option>${ns.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('')}<option value="__nuevo">➕ Nuevo piloto…</option>`;
if(cur==='__nuevo'){sel.value='__nuevo';$('#pnew').value=nuevo}else if(cur&&ns.includes(cur)){sel.value=cur;$('#pnew').value=cur;$('#pnew').hidden=true}else if(!ns.length){sel.value='__nuevo';$('#pnew').hidden=false}else{sel.value='';$('#pnew').value=''}
updHint()};
const drawD=()=>{const g={};S.forEach(x=>(g[x.piloto]=g[x.piloto]||[]).push(x));
const names=Object.keys(g).sort((a,b)=>g[b].length-g[a].length||a.localeCompare(b)),acc=new Set(P.map(p=>p.nombre));
$('#dv').innerHTML=names.length?names.map(n=>{const a=g[n].sort(desc);
return`<details class="drv" data-n="${esc(n)}"${open.has(n)?' open':''}><summary><i class="chip" style="background:var(--acc)"></i><span class="dn">${esc(n)}</span>${CLOUD&&!acc.has(n)?'<span class="nocc" title="Este nombre no tiene cuenta en Drivers">sin cuenta</span>':''}<span class="dc">${a.length} ${a.length===1?'tanda':'tandas'}</span></summary>
<dl class="dinfo"><div><dt>Última</dt><dd>${fdate(a[0].fecha)}</dd></div><div><dt>Kart habitual</dt><dd>#${esc(topOf(a,'kart'))}</dd></div><div><dt>Tipo</dt><dd>${esc(topOf(a,'tipo'))}</dd></div><div><dt>Motor</dt><dd>${esc(topOf(a,'motor'))}</dd></div></dl>
<ol class="tandas">${a.map((x,k)=>`<li><b>${x.tanda?tLbl(x.tanda):'Sesión'}</b><span>${fdate(x.fecha)} · ${esc(x.hora)} · kart #${esc(x.kart)}</span>${x.pista?`<span>${esc(x.pista)}</span>`:''}<span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.neumaticos?' · '+esc(x.neumaticos):''}${x.condicion?' · '+esc(x.condicion):''}${x.mejor_vuelta!=null?' · mejor vuelta <b class="tl">'+fmtLap(x.mejor_vuelta)+'</b>':''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 '+esc(x.archivo_nombre||'Archivo'))}</li>`).join('')}</ol></details>`}).join('')
:'<p class="mut">Cuando cargues sesiones, acá aparece cada piloto con todas sus tandas.</p>'};
const draw=()=>{const ps=[...new Set(S.map(x=>x.piloto))].sort();if(filt&&!ps.includes(filt))filt='';
$('#fp').innerHTML=`<option value="">Todos los pilotos</option>`+ps.map(p=>`<option${p===filt?' selected':''}>${esc(p)}</option>`).join('');
const grp=$('#fg').value,rows=S.filter(x=>!filt||x.piloto===filt).sort(grp==='fecha'?(a,b)=>(b.fecha.localeCompare(a.fecha))||((b.hora||'').localeCompare(a.hora||''))||((+b.tanda||0)-(+a.tanda||0)):grp==='piloto'?(a,b)=>a.piloto.localeCompare(b.piloto)||desc(a,b):porCarga);
const gKey=x=>grp==='fecha'?x.fecha:grp==='piloto'?x.piloto:null,gCnt={};rows.forEach(x=>{const k=gKey(x);if(k!=null)gCnt[k]=(gCnt[k]||0)+1});let gPrev=null;
const gHead=x=>{const k=gKey(x);if(k==null||k===gPrev)return'';gPrev=k;const n=gCnt[k];return`<tr class="grp"><td colspan="11">${grp==='fecha'?flong(k):esc(k)} <span class="mut">· ${n} ${n===1?'sesión':'sesiones'}</span></td></tr>`};
$('#cnt').textContent='· '+rows.length;
$('#tb').innerHTML=rows.length?rows.map(x=>gHead(x)+`<tr${x.id===editId?' class="editing"':x.p&&CLOUD?' class="pend" title="Todavía no se subió a la nube"':''}><td>${esc(x.piloto)}</td><td>${fdate(x.fecha)}</td><td>${esc(x.hora)}</td><td class="c">${x.tanda?tShort(x.tanda):'<span class="mut">—</span>'}</td><td>${x.pista?esc(x.pista):'<span class="mut">—</span>'}</td><td class="num">${esc(x.kart)}</td><td>${esc(x.tipo)}</td><td class="t">${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'<span class="mut">—</span>'}</td><td class="teo">${x.vuelta_teorica!=null?fmtLap(x.vuelta_teorica):'<span class="mut">—</span>'}</td><td>${flink(x,'📎 Descargar')||'<span class="mut">—</span>'}</td><td class="acts"><button type="button" class="edt" data-id="${esc(x.id)}" title="Editar" aria-label="Editar la sesión de ${esc(x.piloto)} del ${fdate(x.fecha)}">✎</button><button type="button" class="del" data-id="${esc(x.id)}" aria-label="Borrar sesión de ${esc(x.piloto)} del ${fdate(x.fecha)}">✕</button></td></tr>`).join(''):`<tr><td colspan="11" class="mut empty">${S.length?'No hay sesiones de este piloto.':'Todavía no cargaste ninguna sesión.'}</td></tr>`;
$('#dls').innerHTML=dl('dlp',[...P.filter(p=>p.rol==='piloto').map(p=>p.nombre),...S.map(x=>x.piloto)]);
drawD()};
async function sync(){if(!CLOUD)return;if(busy){again=true;return}busy=true;setSt('busy','Sincronizando con la nube…');
try{const pend=S.filter(x=>x.p);
if(pend.length)await api('?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(pend.map(({p,...x})=>({...x,pista:x.pista||null,archivo:x.archivo||null,archivo_nombre:x.archivo_nombre||null,mejor_vuelta:x.mejor_vuelta!=null?x.mejor_vuelta:null,tanda:x.tanda!=null?+x.tanda:null,neumaticos:x.neumaticos||null,condicion:x.condicion||null,vuelta_teorica:x.vuelta_teorica!=null?x.vuelta_teorica:null,microsectores:x.microsectores||null,vueltas:Array.isArray(x.vueltas)?x.vueltas:null,kart:parseInt(x.kart,10)||0})))});
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
const sugT=()=>{if(tTouched)return;const pi=fsF.piloto.value.trim(),fe=fsF.fecha.value;if(!pi||!fe)return;const used=S.filter(x=>x.piloto===pi&&x.fecha===fe).map(x=>+x.tanda||0).filter(t=>t<=7);const n=Math.min(7,Math.max(used.length,...used,0)+1);fsF.tanda.value=String(n)};
fsF.tanda.onchange=()=>{tTouched=true};fsF.fecha.addEventListener('change',sugT);fsF.piloto.addEventListener('change',sugT);fsF.piloto.addEventListener('blur',sugT);sugT();
$('#fs').mv.onblur=e=>{const v=parseLap(e.target.value);if(v!=null&&!isNaN(v))e.target.value=fmtLap(v)};
$('#fs').mv.oninput=()=>{LAPS=null;const ci=$('#csvi');if(ci.classList.contains('ok')){ci.textContent='';ci.className='mut csvi'}};
fin.onchange=async()=>{const fl=fin.files[0];fnl.textContent=fl?`${fl.name} · ${fsize(fl.size)}`:fdef;fnl.parentElement.classList.toggle('has',!!fl);LAPS=null;const ci=$('#csvi');ci.textContent='';ci.className='mut csvi';if(!fl)return;
if(fl.size>MAXF)return;let r=null;try{r=lapsFromCSV(await fl.text())}catch(e){}
if(r){const fs=$('#fs'),partes=[];if(r.fecha){fs.fecha.value=r.fecha;partes.push('fecha '+fdate(r.fecha))}if(r.hora){fs.hora.value=r.hora;partes.push('hora '+r.hora)}
if(r.laps.length){LAPS=r.laps;fs.mv.value=fmtLap(r.best);partes.unshift(`${r.laps.length} ${r.laps.length===1?'vuelta':'vueltas'}, la mejor fue la vuelta ${r.bestN} con ${fmtLap(r.best)}`)}
if(r.fecha&&typeof sugT==='function')sugT();ci.className='mut csvi '+(r.laps.length?'ok':'warn');ci.textContent='Leído del archivo: '+partes.join(' · ')+'.'+(r.laps.length?'':' No encontré tiempos de vuelta: escribí la mejor vuelta a mano.')}
else{ci.className='mut csvi warn';ci.textContent=/\.csv$/i.test(fl.name)?'No encontré tiempos de vuelta en este CSV. Escribí la mejor vuelta a mano.':'Este archivo no es un CSV: no puedo leer los tiempos. Exportalo como CSV desde Race Studio 3 o escribí la mejor vuelta a mano.'}};
$('#fs').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),x={id:uid(),p:1,creado:new Date().toISOString()};['piloto','fecha','hora','tanda','pista','kart','tipo','motor','neumaticos','condicion'].forEach(k=>x[k]=String(f.get(k)||'').trim());
if(!x.piloto){$('#msg').textContent=$('#psel')&&$('#psel').value==='__nuevo'?'Escribí el nombre del piloto nuevo.':'Elegí el piloto.';($('#psel')&&$('#psel').value==='__nuevo'?$('#pnew'):$('#psel')).focus();return}
if(!x.tanda||!x.pista||!x.tipo||!x.motor||!x.neumaticos||!x.condicion)return;x.tanda=+x.tanda;if(CLOUD&&!known().acc.includes(x.piloto)&&sugg(x.piloto)&&okNew!==x.piloto){updHint();$('#msg').textContent='Revisá el nombre del piloto antes de guardar.';e.target.piloto.focus();return}const mv=parseLap(f.get('mv'));if(Number.isNaN(mv)){$('#msg').textContent='La mejor vuelta no se entiende. Escribila en segundos (49.123) o en minutos y segundos (1:05.300).';e.target.mv.focus();return}x.mejor_vuelta=mv;if(editId){await guardarEdicion(x);return}x.vueltas=LAPS;const fl=fin.files[0],btn=$('#gs');
if(fl){if(!CLOUD){$('#msg').textContent='Para adjuntar archivos hace falta la base de datos conectada.';return}
if(fl.size>MAXF){$('#msg').textContent=`El archivo pesa ${fsize(fl.size)}. El máximo es 50 MB.`;return}
const m=fl.name.match(/\.([A-Za-z0-9]{1,8})$/),ext=m?'.'+m[1].toLowerCase():'';
const path=`${slug(x.piloto)}/${x.fecha}_${x.hora.replace(':','')}_kart${slug(x.kart)}_${x.id.slice(0,8)}${ext}`;
btn.disabled=true;btn.textContent='Subiendo archivo…';$('#msg').textContent='';
try{await stor(path,{method:'POST',headers:{'Content-Type':fl.type||'application/octet-stream','x-upsert':'false'},body:fl})}
catch(err){btn.disabled=false;btn.textContent='Guardar sesión';$('#msg').textContent='No se pudo subir el archivo. Revisá la conexión y probá de nuevo. ('+err.message+')';return}
btn.disabled=false;btn.textContent='Guardar sesión';x.archivo=path;try{if(/\.csv$/i.test(fl.name)){const th=teorica(await fl.text());if(th){x.vuelta_teorica=th.teorica;x.microsectores=th}}}catch(err){}x.archivo_nombre=`${x.piloto} - ${x.fecha} - ${tLow(x.tanda)} - kart ${x.kart}${ext}`}
S.push(x);const ok=saveS(S);open.add(x.piloto);lsSet(PNK,[...new Set([...lsGet(PNK,[]),x.piloto])]);drawP();setPil(x.piloto);fin.value='';fin.onchange();e.target.mv.value='';tTouched=false;sugT();
$('#msg').textContent=ok?`Sesión de ${x.piloto} guardada${fl?' con su archivo':''}.`:'Se agregó a la tabla, pero este navegador no permite guardarla.';draw();sync()};
function entrarEdicion(x){editId=x.id;const F=$('#fs');$('#fsh').textContent='Editar sesión';const eb=$('#eb');eb.hidden=false;eb.textContent=`${x.piloto} · ${fdate(x.fecha)} · ${x.tanda?tLbl(x.tanda):'sin tanda'}`;
setPil(x.piloto);F.fecha.value=x.fecha;F.hora.value=String(x.hora||'').slice(0,5);tTouched=true;F.tanda.value=x.tanda?String(x.tanda):'';F.pista.value=x.pista||'';F.kart.value=x.kart;F.tipo.value=x.tipo||'';F.motor.value=x.motor||'';F.neumaticos.value=x.neumaticos||'';F.condicion.value=x.condicion||'';F.mv.value=x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'';
$('.drop').hidden=true;$('#csvi').textContent='';$('#csvi').className='mut csvi';$('#gs').textContent='Guardar cambios';$('#gc').hidden=false;$('#msg').textContent=x.archivo?'El archivo de esta sesión se mantiene: no hace falta volver a subirlo.':'';draw();F.scrollIntoView({behavior:'smooth',block:'start'})}
function salirEdicion(){editId=null;const F=$('#fs');$('#fsh').textContent='Nueva sesión';$('#eb').hidden=true;$('.drop').hidden=false;$('#gs').textContent='Guardar sesión';$('#gs').disabled=false;$('#gc').hidden=true;F.mv.value='';tTouched=false;const now=new Date(),pd=n=>String(n).padStart(2,'0');F.fecha.value=`${now.getFullYear()}-${pd(now.getMonth()+1)}-${pd(now.getDate())}`;F.hora.value=`${pd(now.getHours())}:${pd(now.getMinutes())}`;sugT();draw()}
async function guardarEdicion(n){const o=S.find(s=>s.id===editId);if(!o){salirEdicion();return}
const ch={piloto:n.piloto,fecha:n.fecha,hora:n.hora,tanda:n.tanda,pista:n.pista,kart:n.kart,tipo:n.tipo,motor:n.motor,neumaticos:n.neumaticos,condicion:n.condicion,mejor_vuelta:n.mejor_vuelta};
if(o.archivo){const m=String(o.archivo_nombre||o.archivo).match(/\.([A-Za-z0-9]{1,8})$/),ext=m?'.'+m[1].toLowerCase():'';ch.archivo_nombre=`${n.piloto} - ${n.fecha} - ${tLow(n.tanda)} - kart ${n.kart}${ext}`}
const btn=$('#gs');btn.disabled=true;btn.textContent='Guardando…';
if(CLOUD&&!o.p){try{await api('?id=eq.'+encodeURIComponent(o.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({...ch,kart:parseInt(ch.kart,10)||0})})}catch(err){btn.disabled=false;btn.textContent='Guardar cambios';$('#msg').textContent='No se pudo guardar: '+err.message;return}}
Object.assign(o,ch);saveS(S);lsSet(PNK,[...new Set([...lsGet(PNK,[]),n.piloto])]);open.add(n.piloto);salirEdicion();$('#msg').textContent=`Cambios guardados en la sesión de ${n.piloto}.`;if(o.p)sync()}
$('#gc').onclick=()=>{salirEdicion();$('#msg').textContent=''};
$('#fp').onchange=e=>{filt=e.target.value;draw()};
$('#fg').value=['carga','fecha','piloto'].includes(lsGet('psdata-agrupar','carga'))?lsGet('psdata-agrupar','carga'):'carga';$('#fg').onchange=e=>{lsSet('psdata-agrupar',e.target.value);draw()};draw();
$('#tb').onclick=async e=>{const ed=e.target.closest('.edt');if(ed){const x=S.find(s=>s.id===ed.dataset.id);if(x)entrarEdicion(x);return}const b=e.target.closest('.del');if(!b)return;const x=S.find(s=>s.id===b.dataset.id);if(!x||!confirm(`¿Borrar la sesión de ${x.piloto} del ${fdate(x.fecha)} a las ${x.hora}?`))return;
if(CLOUD){try{await api('?id=eq.'+encodeURIComponent(x.id),{method:'DELETE',headers:{Prefer:'return=minimal'}})}catch(err){$('#msg').textContent='No se pudo borrar: no hay conexión con la base de datos. Probá de nuevo en un rato.';return}}
if(CLOUD&&x.archivo){$('#msg').textContent='Borrando archivo…';await stor(x.archivo,{method:'DELETE'}).catch(()=>{})}
S=S.filter(s=>s.id!==x.id);saveS(S);$('#msg').textContent='Sesión borrada.';draw()};
$('#csv').onclick=()=>{const q=t=>'"'+String(t).replace(/"/g,'""')+'"',rows=[['Piloto','Fecha','Hora','Tanda','Pista','Kart','Tipo de kart','Motor','Neumáticos','Condición de pista','Mejor vuelta','Archivo'],...S.filter(x=>!filt||x.piloto===filt).sort(desc).map(x=>[x.piloto,x.fecha,x.hora,x.tanda||'',x.pista||'',x.kart,x.tipo,x.motor,x.neumaticos||'',x.condicion||'',x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'',x.archivo_nombre||''])];
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
<ol class="tandas">${t.map((x,i)=>`<li><b>${tLbl(x.tanda||i+1)} · ${esc(x.hora)}</b><span>${x.pista?esc(x.pista)+' · ':''}kart #${esc(x.kart)}</span><span class="mut">${esc(x.tipo)} · ${esc(x.motor)}${x.neumaticos?' · '+esc(x.neumaticos):''}${x.condicion?' · '+esc(x.condicion):''}${x.mejor_vuelta!=null?' · mejor vuelta <b class="tl">'+fmtLap(x.mejor_vuelta)+'</b>':''}${x.vueltas&&x.vueltas.length?' · '+x.vueltas.length+' vueltas':''}</span>${flink(x,'📎 Descargar archivo')}</li>`).join('')}</ol></section>`}).join('')}`}
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
/* Herramientas de telemetría compartidas */
function telLaps(TD){const T=TD.T,m=TD.markers,out=[];if(m.length>=2){for(let k=0;k+1<m.length;k++){const a=T.findIndex(t=>t>=m[k]);let b=T.findIndex(t=>t>=m[k+1]);if(b<0)b=T.length;if(a>=0&&b-a>5)out.push({n:TD.lapNums&&TD.lapNums[k]!=null?TD.lapNums[k]:k+1,a,b,t:TD.lapTimes&&TD.lapTimes[k]?TD.lapTimes[k]:m[k+1]-m[k]})}}
if(!out.length)out.push({n:0,a:0,b:T.length,t:T[T.length-1]-T[0]});return out}
const telBest=L=>L.reduce((p,q)=>q.n&&(!p.n||q.t<p.t)?q:p,L[0]);
function telOrigin(TD){const ii=TD.LA.map((_,i)=>i).filter(i=>TD.ok[i]);return[ii.reduce((s,i)=>s+TD.LA[i],0)/ii.length,ii.reduce((s,i)=>s+TD.LO[i],0)/ii.length]}
const telXY=(la,lo,O)=>{const k=Math.cos(O[0]*Math.PI/180);return[(lo-O[1])*k*111320,-(la-O[0])*110540]};
function lapTrace(TD,lap,N=600){const a=lap.a,b=lap.b,T=TD.T;let D=[];
if(!isNaN(TD.DI[a])&&!isNaN(TD.DI[b-1])&&TD.DI[b-1]>TD.DI[a])for(let i=a;i<b;i++)D.push(TD.DI[i]-TD.DI[a]);
else{const O=telOrigin(TD);let acc=0,prev=null;for(let i=a;i<b;i++){const p=TD.ok[i]?telXY(TD.LA[i],TD.LO[i],O):prev;if(prev&&p)acc+=Math.hypot(p[0]-prev[0],p[1]-prev[1]);D.push(acc);prev=p}}
const len=D[D.length-1]||1,o={t:[],v:[],la:[],lo:[],len,time:lap.t};let j=0;
for(let s=0;s<=N;s++){const d=s/N*len;while(j<D.length-2&&D[j+1]<d)j++;const d0=D[j],d1=D[j+1]??d0,f=d1>d0?Math.min(1,Math.max(0,(d-d0)/(d1-d0))):0,i=a+j,i2=Math.min(b-1,i+1),L=(x,y)=>x+(y-x)*f;
o.t.push(L(T[i],T[i2])-T[a]);let v=L(TD.V[i],TD.V[i2]);if(isNaN(v))v=(D[j+1]-D[j])/((T[i2]-T[i])||1)*3.6;o.v.push(v);o.la.push(L(TD.LA[i],TD.LA[i2]));o.lo.push(L(TD.LO[i],TD.LO[i2]))}
const k=lap.t/(o.t[N]||1);o.t=o.t.map(x=>x*k);return o}
/* Comparación de dos pilotos (o dos tandas) con sus CSV reales */
async function vCmp(v){
const AC='#4DA3FF',BC='#FF8A3D',NS=10,cache={};let S=[],sel={},timer=null;
v.innerHTML='<div class="card"><p class="mut">Cargando sesiones…</p></div>';
const loadList=async()=>{S=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(desc)};
try{await loadList()}catch(e){v.innerHTML='<div class="card"><p class="mut">No se pudieron cargar las sesiones. Probá recargar la página.</p></div>';return}
if(!S.length){v.innerHTML='<div class="card"><p>Cuando cargues sesiones con su CSV de la MyChron (en Sesiones), acá vas a poder comparar dos pilotos, o dos tandas del mismo piloto, sector por sector.</p></div>';return}
sel.A=S[0].id;sel.B=(S.find(x=>x.piloto!==S[0].piloto&&x.pista===S[0].pista)||S.find(x=>x.piloto!==S[0].piloto)||S.find(x=>x.id!==S[0].id)||S[0]).id;
const lbl=x=>`${fdate(x.fecha)} · ${x.tanda?tLbl(x.tanda):'sin tanda'} · ${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'—'} · ${x.pista||'sin pista'}`;
v.innerHTML=`<div class="two cmpsel">${['A','B'].map(k=>`<div class="card side"><div class="sidet"><i class="chip" style="background:${k==='A'?AC:BC}"></i>Piloto ${k}</div><label>Piloto<select id="cp-${k}"></select></label><label>Sesión <span class="opt">(fecha · tanda · vuelta · pista)</span><select id="cs-${k}"></select></label></div>`).join('')}</div>
<div class="card chartc"><div class="mut" id="cm-msg"></div><div id="cm-chart"></div><div class="read" id="cm-read"></div></div>
<div class="card mapc"><div class="mut">Mapa por sectores: cada sector va del color del piloto que fue más rápido ahí</div><div id="cm-map"></div></div>
<div class="card"><div id="cm-sec"></div></div>`;
const pil=()=>[...new Set(S.map(x=>x.piloto))].sort((a,b)=>a.localeCompare(b));
function fill(k){if(!S.some(x=>x.id===sel[k]))sel[k]=S[0].id;const cur=S.find(x=>x.id===sel[k]);
$('#cp-'+k).innerHTML=pil().map(p=>`<option${p===cur.piloto?' selected':''}>${esc(p)}</option>`).join('');
$('#cs-'+k).innerHTML=S.filter(x=>x.piloto===cur.piloto).map(x=>`<option value="${esc(x.id)}"${x.id===cur.id?' selected':''}>${esc(lbl(x))}</option>`).join('')}
['A','B'].forEach(k=>{$('#cp-'+k).onchange=e=>{sel[k]=S.find(x=>x.piloto===e.target.value).id;fill(k);run()};$('#cs-'+k).onchange=e=>{sel[k]=e.target.value;run()}});
const tel=id=>telFetch(S.find(s=>s.id===id));
let A,B,TA,TB,O,run_id=0;
async function run(){const my=++run_id,xa=S.find(x=>x.id===sel.A),xb=S.find(x=>x.id===sel.B);$('#cm-msg').textContent='Bajando los CSV…';
try{const[ta,tb]=await Promise.all([tel(sel.A),tel(sel.B)]);if(my!==run_id)return;const la=telBest(telLaps(ta)),lb=telBest(telLaps(tb));
A=lapTrace(ta,la);B=lapTrace(tb,lb);O=telOrigin(ta);TA={x:xa,lap:la};TB={x:xb,lap:lb};const same=xa.piloto===xb.piloto,tag=x=>same?`${x.piloto} ${x.tanda?(TESP[+x.tanda]||'T'+x.tanda):'T?'}${xa.id===xb.id?(x===xa?' (A)':' (B)'):''}`:x.piloto;TA.x={...xa,piloto:tag(xa)};TB.x={...xb,piloto:tag(xb)};
const nm=(t,k)=>`${esc(t.x.piloto)}${t.lap.n?` (vuelta ${t.lap.n}`:' ('}${t.lap.n?', ':''}${fmtLap(t.lap.t)})`;
$('#cm-msg').innerHTML=`Mejor vuelta de cada sesión: <b style="color:${AC}">${nm(TA)}</b> contra <b style="color:${BC}">${nm(TB)}</b>.${xa.pista&&xb.pista&&xa.pista!==xb.pista?' <span class="warnt">Ojo: son pistas distintas.</span>':''}`;
draw()}catch(e){if(my!==run_id)return;$('#cm-msg').textContent='No se pudo comparar: '+e.message;['#cm-chart','#cm-map','#cm-sec','#cm-read'].forEach(s=>$(s).innerHTML='')}}
function draw(){const N=A.t.length-1,dl=A.t.map((t,i)=>B.t[i]-t),m=Math.max(.1,Math.max(...dl.map(Math.abs))*1.2),vs=[...A.v,...B.v].filter(x=>!isNaN(x)),v0=Math.floor(Math.min(...vs)/10)*10,v1=Math.ceil(Math.max(...vs)/10)*10||10;
const X=i=>44+i/N*680,Y=s=>10+(v1-s)/((v1-v0)||1)*170,Z=d=>250-d/m*36;
const line=(o,c)=>`<polyline fill="none" stroke="${c}" stroke-width="2.2" points="${o.v.map((s,i)=>X(i).toFixed(1)+','+Y(s).toFixed(1)).join(' ')}"/>`;
let g='';for(let k=0;k<=4;k++){const s=v0+(v1-v0)*k/4;g+=`<line x1="44" x2="724" y1="${Y(s)}" y2="${Y(s)}" stroke="var(--line)"/><text x="0" y="${Y(s)+4}">${Math.round(s)}</text>`}
for(let k=1;k<NS;k++)g+=`<line x1="${X(k/NS*N)}" x2="${X(k/NS*N)}" y1="10" y2="180" stroke="var(--line)" stroke-dasharray="3 4"/>`;
for(let k=0;k<NS;k++)g+=`<text x="${X((k+.5)/NS*N)-4}" y="196" class="sn">${k+1}</text>`;
$('#cm-chart').innerHTML=`<svg id="cm-svg" class="chart" viewBox="0 0 740 300" role="img" aria-label="Velocidad de los dos pilotos y diferencia de tiempo">${g}${line(A,AC)}${line(B,BC)}
<text x="44" y="210">Diferencia de tiempo: arriba, ${esc(TA.x.piloto)} va adelante</text><line x1="44" x2="724" y1="250" y2="250" stroke="var(--line)"/>
<polyline fill="none" stroke="var(--ink)" stroke-width="2" points="${dl.map((d,i)=>X(i).toFixed(1)+','+Z(d).toFixed(1)).join(' ')}"/><line id="cm-cur" y1="6" y2="292" stroke="var(--mv)" stroke-width="2"/></svg>`;
// mapa por sectores
const PA=A.la.map((la,i)=>telXY(la,A.lo[i],O)),PB=B.la.map((la,i)=>telXY(la,B.lo[i],O)),xs=PA.map(p=>p[0]),ys=PA.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),pad=Math.max(x1-x0,y1-y0)*.08,s=Math.max(x1-x0,y1-y0)/100;
const sec=[];for(let k=0;k<NS;k++){const i0=Math.round(k/NS*N),i1=Math.round((k+1)/NS*N);sec.push({k,i0,i1,a:A.t[i1]-A.t[i0],b:B.t[i1]-B.t[i0]})}
let path='';sec.forEach(q=>{const c=q.a<=q.b?AC:BC;path+=`<polyline fill="none" stroke="${c}" stroke-width="${(s*1.3).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" points="${PA.slice(q.i0,q.i1+1).map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}"/>`;
const pm=PA[Math.round((q.i0+q.i1)/2)];path+=`<text x="${pm[0].toFixed(1)}" y="${pm[1].toFixed(1)}" font-size="${(s*3.4).toFixed(1)}" class="secn" dy="${(s*-2.2).toFixed(1)}">${q.k+1}</text>`});
const p0=PA[0];
$('#cm-map').innerHTML=`<svg viewBox="${(x0-pad).toFixed(1)} ${(y0-pad).toFixed(1)} ${(x1-x0+2*pad).toFixed(1)} ${(y1-y0+2*pad).toFixed(1)}" class="gsvg cmmap" role="img" aria-label="Mapa por sectores"><path d="M${PA.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}" fill="none" stroke="var(--line)" stroke-width="${(s*2.8).toFixed(2)}" stroke-linejoin="round"/>${path}
<circle cx="${p0[0].toFixed(1)}" cy="${p0[1].toFixed(1)}" r="${(s*.9).toFixed(2)}" fill="none" stroke="var(--ink)" stroke-width="${(s*.4).toFixed(2)}"/><circle id="cm-db" r="${(s*1.5).toFixed(2)}" fill="${BC}" stroke="var(--surf)" stroke-width="${(s*.45).toFixed(2)}"/><circle id="cm-da" r="${(s*1.5).toFixed(2)}" fill="${AC}" stroke="var(--surf)" stroke-width="${(s*.45).toFixed(2)}"/></svg>
<div class="gleg mut"><span class="lg" style="background:${AC}"></span>${esc(TA.x.piloto)} más rápido<span class="lg" style="background:${BC}"></span>${esc(TB.x.piloto)} más rápido</div>`;
const tot=[A.time,B.time];
$('#cm-sec').innerHTML=`<table class="db sect"><thead><tr><th>Sector</th><th style="color:${AC}">${esc(TA.x.piloto)}</th><th style="color:${BC}">${esc(TB.x.piloto)}</th><th>Dif.</th></tr></thead><tbody>${sec.map(q=>{const w=q.a<=q.b;return`<tr><td>${q.k+1}</td><td class="${w?'win':''}" style="${w?'color:'+AC:''}">${q.a.toFixed(3)}</td><td class="${w?'':'win'}" style="${w?'':'color:'+BC}">${q.b.toFixed(3)}</td><td class="mut">${(q.b-q.a>=0?'+':'−')+Math.abs(q.b-q.a).toFixed(3)}</td></tr>`}).join('')}
<tr class="tot"><td>Vuelta</td><td>${fmtLap(tot[0])}</td><td>${fmtLap(tot[1])}</td><td class="mut">${(tot[1]-tot[0]>=0?'+':'−')+Math.abs(tot[1]-tot[0]).toFixed(3)}</td></tr></tbody></table><p class="mut sm">Dif.: positivo = ${esc(TA.x.piloto)} más rápido en ese sector.</p>`;
const sc=i=>{const x=X(i);$('#cm-cur').setAttribute('x1',x);$('#cm-cur').setAttribute('x2',x);[['#cm-da',PA[i]],['#cm-db',PB[i]]].forEach(([id,p])=>{const e=$(id);if(e&&p){e.setAttribute('cx',p[0]);e.setAttribute('cy',p[1])}});
const d=dl[i];$('#cm-read').textContent=`${Math.round(i/N*A.len)} m · ${TA.x.piloto} ${Math.round(A.v[i])} km/h · ${TB.x.piloto} ${Math.round(B.v[i])} km/h · ${d>=0?TB.x.piloto:TA.x.piloto} ${d>=0?'+':'+'}${Math.abs(d).toFixed(3)} s`};
const svg=$('#cm-svg'),mv=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*740;sc(Math.max(0,Math.min(N,Math.round((x-44)/680*N))))};svg.addEventListener('pointerdown',mv);svg.addEventListener('pointermove',mv);
const map=$('#cm-map svg');map.addEventListener('pointerdown',e=>{const r=map.getBoundingClientRect(),vb=map.viewBox.baseVal,k=Math.max(vb.width/r.width,vb.height/r.height),ox=vb.x+(vb.width-r.width*k)/2,oy=vb.y+(vb.height-r.height*k)/2,x=ox+(e.clientX-r.left)*k,y=oy+(e.clientY-r.top)*k;let bi=0,bd=1e18;PA.forEach((p,i)=>{const dd=(p[0]-x)**2+(p[1]-y)**2;if(dd<bd){bd=dd;bi=i}});sc(bi)});
sc(Math.round(N*.1))}
fill('A');fill('B');run();
const refresh=async()=>{if(document.hidden)return;const ids=S.map(x=>x.id).join();try{await loadList()}catch(e){return}if(S.map(x=>x.id).join()===ids)return;if(document.activeElement&&/^c[ps]-/.test(document.activeElement.id||''))return;fill('A');fill('B')};
setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh)}
/* Telemetría guardada: descarga y caché compartidas */
const TELC={};
async function telFetch(x){if(TELC[x.id])return TELC[x.id];const j=await req('/storage/v1/object/sign/'+BK+'/'+x.archivo,{method:'POST',headers:J,body:JSON.stringify({expiresIn:120})});
const r=await fetch(BASE+'/storage/v1'+(j.signedURL||j.signedUrl));if(!r.ok)throw new Error('HTTP '+r.status);const td=parseTelemetry(await r.text());if(td.error)throw new Error(td.error);return TELC[x.id]=td}
/* Coach: análisis de ingeniero a partir de la telemetría */
const smoothA=(a,w)=>a.map((_,i)=>{let s=0,n=0;for(let j=i-w;j<=i+w;j++)if(a[j]!=null&&!isNaN(a[j])){s+=a[j];n++}return n?s/n:a[i]});
function findCorners(tr){const N=tr.v.length-1,ds=tr.len/N,v=smoothA(tr.v,3),W=Math.max(2,Math.round(30/ds)),P=Math.round(120/ds),G=Math.round(40/ds),out=[];
for(let i=1;i<N;i++){let m=true;for(let j=Math.max(0,i-W);j<=Math.min(N,i+W);j++)if(v[j]<v[i]){m=false;break}if(!m)continue;
const b=Math.max(...v.slice(Math.max(0,i-P),i+1)),a=Math.max(...v.slice(i,Math.min(N,i+P)+1));if(b-v[i]>=5&&a-v[i]>=4){if(out.length&&i-out[out.length-1]<G){if(v[i]<v[out[out.length-1]])out[out.length-1]=i}else out.push(i)}}return out}
function cornerM(tr,ia){const N=tr.v.length-1,ds=tr.len/N,v=smoothA(tr.v,2),w=Math.round(25/ds);let im=ia;for(let j=Math.max(0,ia-w);j<=Math.min(N,ia+w);j++)if(v[j]<v[im])im=j;
const P=Math.round(150/ds),lo=Math.max(0,im-P);let ib=im;while(ib>lo&&v[ib-1]<=v[im]+1)ib--;while(ib>lo&&v[ib-1]>v[ib]+0.05)ib--;const ie=Math.min(N,im+Math.round(40/ds));return{im,ib,ie,vmin:v[im],vin:v[ib],vex:v[ie],freno:(im-ib)*ds}}
function analizar(TD,ref){const L=telLaps(TD).filter(l=>l.n);if(!L.length)return{error:'No encontré vueltas completas en el CSV (faltan las marcas de vuelta).'};
const best=telBest(L),tr=L.map(l=>({lap:l,tr:lapTrace(TD,l)})),B=tr.find(x=>x.lap===best).tr,N=B.v.length-1,ds=B.len/N;
const lim=best.t*1.07,val=tr.filter(x=>x.lap.t<=lim),out_=tr.filter(x=>x.lap.t>lim);
const NS=10,sec=[];for(let k=0;k<NS;k++){const i0=Math.round(k/NS*N),i1=Math.round((k+1)/NS*N),ts=val.map(x=>({n:x.lap.n,t:x.tr.t[i1]-x.tr.t[i0]}));const m=ts.reduce((p,q)=>q.t<p.t?q:p,ts[0]);sec.push({k,best:m.t,de:m.n,mine:B.t[i1]-B.t[i0]})}
const ideal=sec.reduce((s,q)=>s+q.best,0);
const tv=val.map(x=>x.lap.t),mean=tv.reduce((a,b)=>a+b,0)/tv.length,sd=Math.sqrt(tv.reduce((a,b)=>a+(b-mean)**2,0)/tv.length);
const C=findCorners(B).map((ia,ci)=>{const mb=cornerM(B,ia),i1=Math.max(0,mb.ib-Math.round(20/ds)),i2=Math.min(N,mb.im+Math.round(60/ds)),tB=B.t[i2]-B.t[i1];
const otros=val.filter(x=>x.lap!==best).map(x=>{const m=cornerM(x.tr,ia);return{...m,loss:(x.tr.t[i2]-x.tr.t[i1])-tB,n:x.lap.n}});
let vsRef=null;if(ref){const m=cornerM(ref.tr,Math.round(ia/N*(ref.tr.v.length-1))),Nr=ref.tr.v.length-1,j1=Math.round(i1/N*Nr),j2=Math.round(i2/N*Nr);vsRef={...m,loss:tB-(ref.tr.t[j2]-ref.tr.t[j1])}}
const avg=k=>otros.length?otros.reduce((s,o)=>s+o[k],0)/otros.length:null;
return{n:ci+1,ia:mb.im,mb,i1,i2,dist:Math.round(mb.im*ds),otros,avgLoss:avg('loss')||0,dFreno:otros.length?avg('freno')-mb.freno:0,dMin:otros.length?avg('vmin')-mb.vmin:0,dEx:otros.length?avg('vex')-mb.vex:0,vsRef}});
const O=telOrigin(TD),Pp=B.la.map((la,i)=>telXY(la,B.lo[i],O)),lossC=c=>Math.max(c.avgLoss,c.vsRef?c.vsRef.loss:0),mxL=Math.max(.1,...C.map(lossC)),cc=c=>{const l=lossC(c);return l<.04?'#2DD4BF':l<mxL*.5?'#F2C14E':'#E4384A'};
return{best,laps:tr.map(x=>x.lap),val:val.length,fuera:out_.map(x=>x.lap),B,sec,ideal,mean,sd,C,ref,P:Pp,ds,cc,O,trs:val}}
/* Dibujitos para los consejos del Coach */
const PICS={
linea:`<svg viewBox="0 0 140 128" role="img" aria-label="Camino por la curva: de afuera hacia adentro y otra vez afuera"><path d="M40 112 V62 Q40 36 66 36 H140" fill="none" stroke="#2a3534" stroke-width="42"/><path d="M58 64 l3 -4" stroke="#E4384A" stroke-width="5"/><path d="M61 60 l4 -3" stroke="#fff" stroke-width="5"/><path d="M65 57 l4 -2" stroke="#E4384A" stroke-width="5"/><path d="M25 112 C25 84 34 66 58 58 C80 50 104 22 136 19" fill="none" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/><path d="M128 13 l9 6 -9 7" fill="none" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/><circle cx="25" cy="98" r="7.5" fill="var(--bg)" stroke="var(--acc)" stroke-width="2"/><text x="25" y="101.8" class="pl c">1</text><circle cx="56" cy="59" r="7.5" fill="var(--bg)" stroke="var(--acc)" stroke-width="2"/><text x="56" y="62.8" class="pl c">2</text><circle cx="112" cy="25" r="7.5" fill="var(--bg)" stroke="var(--acc)" stroke-width="2"/><text x="112" y="28.8" class="pl c">3</text><text x="70" y="125" class="pl c" style="font-size:9.5px">1 afuera → 2 adentro → 3 afuera</text></svg>`,
frenarTarde:`<svg viewBox="0 0 140 90" role="img" aria-label="Frená más cerca de la curva"><rect x="0" y="30" width="112" height="30" fill="#2a3534"/><path d="M112 30 h28 v60 h-28 z" fill="#2a3534"/><line x1="40" y1="26" x2="40" y2="64" stroke="#E4384A" stroke-width="3"/><text x="40" y="20" class="pl c" fill="#E4384A">✗</text><line x1="88" y1="26" x2="88" y2="64" stroke="var(--acc)" stroke-width="3"/><text x="88" y="20" class="pl c" fill="var(--acc)">✓ frená acá</text><circle cx="14" cy="45" r="5" fill="var(--mv)"/><path d="M24 45 h12" stroke="var(--mv)" stroke-width="2"/><path d="M118 62 v18" stroke="var(--ink)" stroke-width="2"/><path d="M113 74 l5 7 5 -7" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>`,
frenarAntes:`<svg viewBox="0 0 140 90" role="img" aria-label="Frená un poco antes"><rect x="0" y="30" width="112" height="30" fill="#2a3534"/><path d="M112 30 h28 v60 h-28 z" fill="#2a3534"/><line x1="60" y1="26" x2="60" y2="64" stroke="var(--acc)" stroke-width="3"/><text x="60" y="20" class="pl c" fill="var(--acc)">✓ frená acá</text><line x1="104" y1="26" x2="104" y2="64" stroke="#E4384A" stroke-width="3"/><text x="104" y="20" class="pl c" fill="#E4384A">✗</text><circle cx="14" cy="45" r="5" fill="var(--mv)"/><path d="M24 45 h12" stroke="var(--mv)" stroke-width="2"/><path d="M118 62 v18" stroke="var(--ink)" stroke-width="2"/><path d="M113 74 l5 7 5 -7" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>`,
acelerar:`<svg viewBox="0 0 140 90" role="img" aria-label="A fondo al salir de la curva"><path d="M20 90 V50 Q20 30 40 30 H140" fill="none" stroke="#2a3534" stroke-width="30"/><circle cx="34" cy="44" r="5" fill="var(--mv)"/><path d="M50 30 H124" stroke="var(--acc)" stroke-width="4" stroke-linecap="round"/><path d="M116 22 l10 8 -10 8" fill="none" stroke="var(--acc)" stroke-width="4" stroke-linecap="round"/><text x="84" y="68" class="pl c big" fill="var(--acc)">¡a fondo!</text></svg>`,
cono:`<svg viewBox="0 0 140 90" role="img" aria-label="Elegí una marca para frenar siempre en el mismo lugar"><rect x="0" y="34" width="140" height="30" fill="#2a3534"/><path d="M84 32 l7 -20 7 20 z" fill="#FF8A3D"/><rect x="82" y="29" width="18" height="4" fill="#FF8A3D"/><rect x="86" y="20" width="10" height="3" fill="#fff"/><line x1="91" y1="36" x2="91" y2="64" stroke="var(--acc)" stroke-width="3"/><circle cx="20" cy="49" r="5" fill="var(--mv)"/><path d="M30 49 h44" stroke="var(--mv)" stroke-width="2" stroke-dasharray="4 4"/><text x="91" y="80" class="pl c" fill="var(--acc)">frená siempre acá</text></svg>`};
const r0=x=>Math.round(Math.abs(x)),r1=x=>Math.abs(x).toFixed(1);
const segs=g=>{const v=Math.abs(g);return (v<1?v.toFixed(2):v.toFixed(1)).replace('.',',')+' segundos'};
const karts=m=>{const k=Math.max(1,Math.round(Math.abs(m)/2));return`${r0(m)} metros, ¡como ${k} ${k===1?'kart':'karts'}!`};
/* Qué pasa en la curva y qué hacer, en palabras muy simples y con dibujo */
function consejo(dF,dM,dE,n){
if(dF>6)return{pic:'frenarTarde',t:`Curva ${n}: frenás muy temprano (${karts(dF)}). 👉 Animate a frenar más tarde: esperá un poquito más y frená más cerca de la curva.`};
if(dF<-6)return{pic:'frenarAntes',t:`Curva ${n}: frenás muy tarde y te pasás de la curva. 👉 Frená un poquito antes. Así el kart dobla mejor y salís más rápido.`};
if(dM>2&&dE<-1.5)return{pic:'linea',t:`Curva ${n}: entrás muy rápido y después salís lento. 👉 Entrá más abierto: empezá la curva bien desde afuera, pasá cerca del cordón de adentro en el medio y salí otra vez hacia afuera. ¡De afuera, adentro, afuera!`};
if(dM<-2)return{pic:'linea',t:`Curva ${n}: en el medio de la curva vas muy despacio. 👉 Soltá el freno antes de doblar y usá todo el ancho de la pista: de afuera hacia adentro.`};
if(dE<-2)return{pic:'acelerar',t:`Curva ${n}: al salir tardás en acelerar. 👉 Apenas ves la salida y el volante se endereza, ¡pisá a fondo!`};
return{pic:'linea',t:`Curva ${n}: podés ir un poquito más rápido. 👉 Entrá más abierto, de afuera hacia adentro, y frená en el mismo lugar que en tu mejor vuelta.`}}
function observaciones(R,x,refx){const o=[],rec=[],nom=(x.piloto||'').split(' ')[0];
const gIdeal=Math.max(0,R.best.t-R.ideal);
const bien=[`¡Muy bien, ${nom}! 🙌 Tu mejor vuelta fue la número ${R.best.n}: ${fmtLap(R.best.t)}.`];
if(R.val>1&&R.sd<=0.25)bien.push('Tus vueltas son casi iguales. ¡Eso es ser muy parejo, como los grandes! 👏');
const buenas=R.C.filter(c=>c.otros.length&&c.avgLoss<0.04).map(c=>c.n);
if(buenas.length)bien.push(`${buenas.length===1?'La curva':'Las curvas'} ${buenas.join(', ')} ${buenas.length===1?'te sale':'te salen'} siempre bien. ¡Genial! ✅`);
if(gIdeal>0.05)bien.push(`Si juntás las mejores partes de tus vueltas, harías ${fmtLap(R.ideal)}. ¡Ya lo hiciste por partes, así que podés! ⭐`);
o.push({h:'⭐ Lo que hiciste bien',t:bien});
R.C.filter(c=>c.otros.length&&c.avgLoss>0.04).forEach(c=>{const k=consejo(c.dFreno,c.dMin,c.dEx,c.n);rec.push({g:c.avgLoss,pic:k.pic,c,frenoMal:c.mb.freno+c.dFreno,frenoBien:c.mb.freno,t:`${k.t} Si lo hacés, ganás ${segs(c.avgLoss)}. 🏁`})});
if(R.ref)R.C.forEach(c=>{const v=c.vsRef;if(v&&v.loss>0.04){const k=consejo(c.mb.freno-v.freno,c.mb.vmin-v.vmin,c.mb.vex-v.vex,c.n);rec.push({g:v.loss,pic:k.pic,c,frenoMal:c.mb.freno,frenoBien:v.freno,t:`${k.t} (Así lo hace ${refx.piloto}, que ahí es ${segs(v.loss)} más rápido.)`})}});
if(R.val>1&&R.sd>0.3)rec.push({g:R.mean-R.best.t,pic:'cono',t:`Tus vueltas cambian mucho entre una y otra. 👉 Buscá una marca para frenar en cada curva (un cono, una mancha, el cordón) y frená siempre ahí. ¡Así todas tus vueltas salen como la mejor!`});
rec.sort((a,b)=>b.g-a.g);
o.push({h:'🎯 Para mejorar',ol:rec.slice(0,3),vacio:'¡Excelente! No hay errores grandes: tus vueltas son muy parecidas. Para ir todavía más rápido, mirá cómo lo hace un piloto más rápido. 🚀'});
if(rec.length>3)o.push({h:'📝 Después, cuando lo anterior te salga',ul:rec.slice(3,5)});
if(R.val>1)o.push({h:'🔁 ¿Fuiste parejo?',t:[R.sd<=0.25?'¡Sí, muy parejo! Tus vueltas casi no cambian. 👏':R.sd<=0.5?`¡Bastante parejo! Tus vueltas cambian unos ${segs(R.sd)}. La meta es que cambien menos de 0,25 segundos.`:`Todavía no, pero no pasa nada: tus vueltas cambian unos ${segs(R.sd)}. Primero tratá de hacer siempre la misma vuelta; la velocidad viene sola después.`,
...(R.fuera.length?[`Las vueltas ${R.fuera.map(l=>l.n).join(', ')} fueron mucho más lentas (tráfico o un error), así que no las conté. ¡Errores tenemos todos!`]:[])]});
o.push({h:'💪 ¡Vos podés!',t:[`Practicá de a una cosa por vez: primero la número 1. Cuando te salga, pasá a la siguiente. ¡Cada vuelta aprendés algo nuevo, ${nom}! 🏎️`]});
o.push({h:'🛠️ Para el entrenador (datos técnicos)',ul:[`Mejor vuelta ${fmtLap(R.best.t)} · vuelta ideal ${fmtLap(R.ideal)} · promedio ${fmtLap(R.mean)} · desvío ${R.sd.toFixed(3)} s.`,
...R.C.map(c=>`Curva ${c.n} (${c.dist} m): frenada a ${r0(c.mb.freno)} m del vértice, entrada ${r0(c.mb.vin)}, mínima ${r0(c.mb.vmin)}, salida ${r0(c.mb.vex)} km/h${c.otros.length?` · resto de las vueltas ${c.avgLoss>=0?'+':'−'}${Math.abs(c.avgLoss).toFixed(3)} s`:''}${c.vsRef?` · vs ${refx.piloto} ${c.vsRef.loss>=0?'+':'−'}${Math.abs(c.vsRef.loss).toFixed(3)} s`:''}.`),
'Curvas detectadas en la mejor vuelta (donde la velocidad baja y vuelve a subir). Vueltas más de 7% lentas no cuentan para los promedios.']});
return o}
const itT=i=>typeof i==='string'?i:i.t;
const obsTxt=(o,x)=>[`OBSERVACIONES · ${x.piloto} · ${fdate(x.fecha)}${x.tanda?' · '+tLow(x.tanda):''}${x.pista?' · '+x.pista:''}`,'',...o.flatMap(s=>[s.h.toUpperCase(),...(s.t||[]),...(s.ol?(s.ol.length?s.ol.map((t,i)=>`${i+1}. ${itT(t)}`):[s.vacio]):[]),...(s.ul?(s.ul.length?s.ul.map(t=>'- '+itT(t)):[s.vacio]):[]),''])].join('\r\n');
/* Dibujo de una curva real (GPS), ajustado a la curva y con la pista en su ancho real */
function cornerView(R,c,o={}){const P=R.P,N=P.length-1,ds=R.ds,cl=i=>Math.max(0,Math.min(N,i)),at=i=>P[cl(i)],RW=8;
const hd=i=>{const a=at(i-3),b=at(i+3);return Math.atan2(b[1]-a[1],b[0]-a[0])},curv=i=>{let d=hd(i+3)-hd(i-3);while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)};let im=c.mb.im;{const w=Math.round(35/ds);let best=-1;for(let i=cl(c.mb.im-w);i<=cl(c.mb.im+Math.round(10/ds));i++){const v=curv(i);if(v>best){best=v;im=i}}}
const k=o.kind||'linea',brk=k==='frenarTarde'||k==='frenarAntes'||k==='full',antes=Math.max(45,brk?Math.max(o.frenoMal||0,o.frenoBien||c.mb.freno||0)+18+Math.max(0,(c.mb.im-im)*ds):45),despues=k==='acelerar'?Math.max(45,(c.mb.ie-im)*ds+30):45;
const s0=cl(im-Math.round(antes/ds)),s1=cl(im+Math.round(despues/ds)),pts=P.slice(s0,s1+1).filter(Boolean);
let extra=[];if(o.slow&&o.slow.P)extra=o.slow.P.slice(cl(s0),cl(s1)+1).filter(Boolean);
const f=n=>n.toFixed(1);
const tan=i=>{const a=at(i-2),b=at(i+2),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return[dx/L,dy/L]};
const tb=tan(im-Math.round(20/ds)),ta=tan(im+Math.round(20/ds)),turn=(tb[0]*ta[1]-tb[1]*ta[0])>=0?1:-1;
const nin=i=>{const t=tan(i);return turn>0?[-t[1],t[0]]:[t[1],-t[0]]},off=(i,kk)=>{const p=at(i),n=nin(i);return[p[0]+n[0]*RW*kk,p[1]+n[1]*RW*kk]};
const lbl=[];if(k==='linea'){const e=cl(im-Math.round(40/ds));lbl.push(off(e,-1.6),off(im,1.6))}else if(k==='frenarTarde'||k==='frenarAntes'){lbl.push(off(cl(c.mb.im-Math.round((o.frenoMal||0)/ds)),-1.55),off(cl(c.mb.im-Math.round((o.frenoBien||0)/ds)),1.55))}else if(k==='acelerar'){lbl.push(off(cl(c.mb.ie+Math.round(15/ds)),-1.7))}else if(k==='full'){lbl.push(off(im,1.9))}
const bp=off(im,-1.7),base=[...pts,...extra,bp],sx=base.map(p=>p[0]),sy=base.map(p=>p[1]),span0=Math.max(Math.max(...sx)-Math.min(...sx),Math.max(...sy)-Math.min(...sy),30),fs=span0/(o.big?16:11);
const xs=[...sx],ys=[...sy];lbl.forEach(p=>{xs.push(p[0]-fs*2.4,p[0]+fs*2.4);ys.push(p[1]-fs*0.8,p[1]+fs*0.8)});xs.push(bp[0]-fs,bp[0]+fs);ys.push(bp[1]-fs,bp[1]+fs);
const pad=RW*0.9;let x0=Math.min(...xs)-pad,x1=Math.max(...xs)+pad,y0=Math.min(...ys)-pad,y1=Math.max(...ys)+pad;let w=x1-x0,h=y1-y0;const ar=o.big?1.45:1.25;if(w/h<ar/1.5){const d=h*ar/1.5-w;x0-=d/2;w+=d}else if(w/h>ar*1.5){const d=w/(ar*1.5)-h;y0-=d/2;h+=d}
const txt=(p,s,col='var(--ink)')=>`<text x="${f(p[0])}" y="${f(p[1])}" text-anchor="middle" dominant-baseline="middle" style="font:700 ${f(fs)}px Barlow,sans-serif;paint-order:stroke;stroke:var(--bg);stroke-width:${f(fs*0.18)}px" fill="${col}">${s}</text>`;
const pl=(arr,col,wd,dash='')=>`<polyline points="${arr.map(p=>f(p[0])+','+f(p[1])).join(' ')}" fill="none" stroke="${col}" stroke-width="${f(wd)}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const bar=(i,col,label,side)=>{const p=at(i),t=tan(i),n=[-t[1],t[0]],hh=RW*0.75,l=off(i,side*1.55);return`<line x1="${f(p[0]-n[0]*hh)}" y1="${f(p[1]-n[1]*hh)}" x2="${f(p[0]+n[0]*hh)}" y2="${f(p[1]+n[1]*hh)}" stroke="${col}" stroke-width="${f(RW*0.22)}" stroke-linecap="round"/>${label?txt(l,label,col):''}`};
let ov='';
if(k==='frenarTarde'||k==='frenarAntes'){ov+=bar(cl(c.mb.im-Math.round((o.frenoMal||0)/ds)),'#E4384A','ahora',-1)+bar(cl(c.mb.im-Math.round((o.frenoBien||0)/ds)),'var(--acc)','acá',1)}
else if(k==='acelerar'){const a=cl(c.mb.ie),b=cl(c.mb.ie+Math.round(30/ds));ov+=pl(P.slice(a,b+1),'var(--acc)',RW*0.3);const e=at(b),t=tan(b),n=[-t[1],t[0]],hd=RW*0.6;ov+=`<path d="M${f(e[0]-t[0]*hd+n[0]*hd)} ${f(e[1]-t[1]*hd+n[1]*hd)} L${f(e[0]+t[0]*hd*0.6)} ${f(e[1]+t[1]*hd*0.6)} L${f(e[0]-t[0]*hd-n[0]*hd)} ${f(e[1]-t[1]*hd-n[1]*hd)}" fill="none" stroke="var(--acc)" stroke-width="${f(RW*0.25)}" stroke-linecap="round" stroke-linejoin="round"/>`+txt(off(cl(c.mb.ie+Math.round(15/ds)),-1.7),'¡a fondo!','var(--acc)')}
else if(k==='linea'){const e=cl(im-Math.round(40/ds)),x=cl(im+Math.round(40/ds)),ln=[];for(let i=e;i<=x;i++){const u=i<=im?(i-e)/((im-e)||1):(x-i)/((x-im)||1);ln.push(off(i,-0.34+0.68*(0.5-0.5*Math.cos(Math.PI*u))))}
ov+=pl(ln,'var(--acc)',RW*0.18,`${f(RW*0.5)} ${f(RW*0.3)}`);[[e,-0.34,'1'],[im,0.34,'2'],[x,-0.34,'3']].forEach(([i,kk,n])=>{const p=off(i,kk);ov+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(RW*0.42)}" fill="var(--bg)" stroke="var(--acc)" stroke-width="${f(RW*0.1)}"/>`+txt(p,n)});
ov+=txt(off(e,-1.6),'afuera','var(--acc)')+txt(off(im,1.6),'adentro','var(--acc)')}
else if(k==='full'){if(o.slow){ov+=pl(o.slow.P.slice(cl(s0),cl(s1)+1).filter(Boolean),'#FF8A3D',RW*0.16,`${f(RW*0.45)} ${f(RW*0.25)}`);if(o.slow.ib!=null)ov+=bar(cl(o.slow.ib),'#FF8A3D','',0)}
ov+=pl(pts,'var(--acc)',RW*0.16);ov+=bar(cl(c.mb.ib),'var(--acc)','',0);const ap=at(im);ov+=`<circle cx="${f(ap[0])}" cy="${f(ap[1])}" r="${f(RW*0.28)}" fill="var(--mv)"/>`+txt(off(im,1.9),Math.round(c.mb.vmin)+' km/h','var(--mv)')}
const end=at(s1),te=tan(s1),ne=[-te[1],te[0]],ah=RW*0.55,col=R.cc(c);
return`<svg viewBox="${f(x0)} ${f(y0)} ${f(w)} ${f(h)}" class="cview" role="img" aria-label="Curva ${c.n}"><polyline points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" fill="none" stroke="#2a3534" stroke-width="${RW}" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M${f(end[0]-te[0]*ah+ne[0]*ah)} ${f(end[1]-te[1]*ah+ne[1]*ah)} L${f(end[0]+te[0]*ah*0.6)} ${f(end[1]+te[1]*ah*0.6)} L${f(end[0]-te[0]*ah-ne[0]*ah)} ${f(end[1]-te[1]*ah-ne[1]*ah)}" fill="none" stroke="var(--mut)" stroke-width="${f(RW*0.14)}" stroke-linecap="round" stroke-linejoin="round"/>${ov}
<circle cx="${f(bp[0])}" cy="${f(bp[1])}" r="${f(fs*0.95)}" fill="${col}" stroke="var(--bg)" stroke-width="${f(fs*0.15)}"/><text x="${f(bp[0])}" y="${f(bp[1])}" text-anchor="middle" dominant-baseline="central" style="font:700 ${f(fs*1.1)}px Barlow,sans-serif" fill="#06100f">${c.n}</text></svg>`}
function cornerSVG(R,it){return cornerView(R,it.c,{kind:it.pic,frenoMal:it.frenoMal,frenoBien:it.frenoBien})}
/* Datos de la vuelta más lenta en una curva, para el dibujo grande */
function slowIn(R,c){if(!c.otros.length)return null;const w=c.otros.reduce((p,q)=>q.loss>p.loss?q:p,c.otros[0]),t=(R.trs||[]).find(x=>x.lap.n===w.n);if(!t)return null;return{n:w.n,loss:w.loss,P:t.tr.la.map((la,i)=>telXY(la,t.tr.lo[i],R.O)),ib:w.ib,m:w}}
const itH=(i,R)=>{if(typeof i==='string')return esc(i);let pic='';try{pic=i.c&&R&&R.P?cornerSVG(R,i):(i.pic&&PICS[i.pic]||'')}catch(e){pic=i.pic&&PICS[i.pic]||''}return`<div class="tipc">${pic?`<div class="pic">${pic}</div>`:''}<div class="tipt">${esc(i.t)}</div></div>`};
async function vCoach(v){
if(!CLOUD){v.innerHTML='<div class="card"><p>Para el Coach hace falta conectar la base de datos.</p></div>';return}
if(!AUTH)return gate(v,'Ingresá para ver el Coach','Usá tu usuario y contraseña de psData.',()=>vCoach(v));
await whoami();if(!AUTH)return vCoach(v);
v.innerHTML=ubar()+'<div class="card"><p class="mut">Cargando datos…</p></div>';bindUbar();
let S=[];try{S=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(desc)}catch(e){v.innerHTML=ubar()+'<div class="card"><p class="mut">No se pudieron cargar las sesiones. Probá recargar.</p></div>';bindUbar();return}
if(!S.length){v.innerHTML=ubar()+'<div class="card"><p>Todavía no hay sesiones con CSV. Cuando cargues una en Sesiones con el archivo de la MyChron, acá aparece con sus observaciones.</p></div>';bindUbar();return}
let cur=lsGet('psdata-coach','');if(!S.some(x=>x.id===cur))cur=S[0].id;let refId='',open=new Set([S.find(x=>x.id===cur).piloto]),obsCache='';
v.innerHTML=ubar()+`<div class="coach"><aside class="card col cdata"><h2>Datos</h2><p class="mut sm">Sesiones guardadas con su CSV, por piloto y día.</p><div id="co-tree"></div></aside>
<section class="cmid"><div class="card col"><div class="head"><h2 id="co-tit">Sesión</h2></div><div class="mut" id="co-sub"></div><label class="refl">Comparar con <span class="opt">(opcional)</span><select id="co-ref"></select></label><div id="co-sum"></div></div>
<div class="card col"><h2>Mapa de curvas</h2><p class="mut sm">Cada curva va del color de cuánto tiempo se pierde ahí.</p><div id="co-map"></div></div>
<div class="card col" id="co-cv"><div class="head"><h2>Ver curva de cerca</h2><select id="co-cs" aria-label="Elegí la curva"></select></div><div id="co-cvb"></div></div>
<div class="card col"><h2>Vueltas</h2><div id="co-laps"></div></div></section>
<aside class="card col cobs"><div class="head"><h2>📄 Observaciones</h2><button type="button" class="ghost" id="co-dl">Descargar</button></div><div id="co-obs" class="obs"></div></aside></div>`;bindUbar();
const tree=()=>{const g={};S.forEach(x=>((g[x.piloto]=g[x.piloto]||{})[x.fecha]=g[x.piloto][x.fecha]||[]).push(x));
$('#co-tree').innerHTML=Object.keys(g).sort((a,b)=>a.localeCompare(b)).map(p=>`<details class="cpil" data-p="${esc(p)}"${open.has(p)?' open':''}><summary>${esc(p)} <span class="mut">· ${Object.values(g[p]).flat().length}</span></summary>${Object.keys(g[p]).sort().reverse().map(f=>`<div class="cdia">${fdate(f)}</div>${g[p][f].sort((a,b)=>(a.tanda||0)-(b.tanda||0)).map(x=>`<button type="button" class="ctan${x.id===cur?' on':''}" data-id="${esc(x.id)}"><span>${x.tanda?tLbl(x.tanda):x.hora}</span><span class="t">${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):''}</span><span class="mut">${esc(x.pista||'')}</span></button>`).join('')}`).join('')}</details>`).join('')};
$('#co-tree').addEventListener('toggle',e=>{const p=e.target.dataset&&e.target.dataset.p;if(p!==undefined)e.target.open?open.add(p):open.delete(p)},true);
$('#co-tree').onclick=e=>{const b=e.target.closest('.ctan');if(!b)return;cur=b.dataset.id;lsSet('psdata-coach',cur);refId='';tree();run();if(innerWidth<1100)$('#co-tit').scrollIntoView({behavior:'smooth'})};
$('#co-ref').onchange=e=>{refId=e.target.value;run()};
$('#co-dl').onclick=()=>{if(!obsCache)return;const x=S.find(s=>s.id===cur),a=document.createElement('a');const txt=window.LANG==='en'&&window.TR?obsCache.split('\r\n').map(l=>window.TR(l)).join('\r\n'):obsCache;a.href=URL.createObjectURL(new Blob(['\ufeff'+txt],{type:'text/plain'}));a.download=`${window.LANG==='en'?'Notes':'Observaciones'} - ${x.piloto} - ${x.fecha}${x.tanda?' - '+tLow(x.tanda):''}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
let rid=0;
async function run(){const my=++rid,x=S.find(s=>s.id===cur);$('#co-tit').textContent=x.piloto;$('#co-sub').textContent=lbl(x);
const cands=S.filter(s=>s.id!==x.id&&(!x.pista||s.pista===x.pista));const sug=cands.filter(s=>s.piloto!==x.piloto&&s.tipo===x.tipo&&s.mejor_vuelta!=null&&(x.mejor_vuelta==null||s.mejor_vuelta<x.mejor_vuelta)).sort((a,b)=>a.mejor_vuelta-b.mejor_vuelta)[0];
$('#co-ref').innerHTML='<option value="">Solo sus propias vueltas</option>'+cands.map(s=>`<option value="${esc(s.id)}"${s.id===refId?' selected':''}>${esc(s.piloto)} · ${esc(lbl(s))}${s===sug?' (sugerido)':''}</option>`).join('');
['#co-sum','#co-map','#co-laps'].forEach(s=>$(s).innerHTML='');$('#co-obs').innerHTML='<p class="mut">Analizando la telemetría…</p>';obsCache='';
try{const td=await telFetch(x);let ref=null,refx=null;if(refId){refx=S.find(s=>s.id===refId);const rt=await telFetch(refx);const rl=telBest(telLaps(rt));ref={tr:lapTrace(rt,rl),lap:rl}}
if(my!==rid)return;const R=analizar(td,ref);if(R.error){$('#co-obs').innerHTML=`<p class="mut">${esc(R.error)}</p>`;return}
const st=(k,val,c='')=>`<div class="st ${c}"><div class="big">${val}</div><div class="mut">${k}</div></div>`;
$('#co-sum').innerHTML=`<div class="stats">${st('mejor vuelta',fmtLap(R.best.t),'mv')}${st('vuelta ideal',fmtLap(R.ideal),'teo')}${st('para ganar',Math.max(0,R.best.t-R.ideal).toFixed(3)+' s')}${st('constancia',R.val>1?'±'+R.sd.toFixed(2)+' s':'—')}</div>${ref?`<p class="mut sm">Comparando contra la mejor vuelta de ${esc(refx.piloto)}: ${fmtLap(ref.lap.t)} (${(R.best.t-ref.lap.t>=0?'+':'−')+Math.abs(R.best.t-ref.lap.t).toFixed(3)} s).</p>`:''}`;
$('#co-laps').innerHTML=`<table class="db sect"><thead><tr><th>Vuelta</th><th>Tiempo</th><th>Dif.</th><th></th></tr></thead><tbody>${R.laps.map(l=>`<tr><td>${l.n}</td><td class="${l===R.best?'t':''}">${fmtLap(l.t)}</td><td class="mut">${l===R.best?'—':'+'+(l.t-R.best.t).toFixed(3)}</td><td class="mut">${l===R.best?'mejor':R.fuera.includes(l)?'fuera de ritmo':''}</td></tr>`).join('')}</tbody></table>`;
// mapa
const O=telOrigin(td),P=R.B.la.map((la,i)=>telXY(la,R.B.lo[i],O)),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),pad=Math.max(x1-x0,y1-y0)*.1,s=Math.max(x1-x0,y1-y0)/100;
const cc=x=>x;
const marks=R.C.map(c=>{const p=P[c.ia],seg=P.slice(c.i1,c.i2+1).map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ');return`<polyline points="${seg}" fill="none" stroke="${R.cc(c)}" stroke-width="${(s*1.3).toFixed(2)}" stroke-linecap="round"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(s*2.6).toFixed(1)}" fill="${R.cc(c)}" data-c="${c.n}" class="cpick"/><text x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" dy="${(s*1.2).toFixed(1)}" font-size="${(s*3.4).toFixed(1)}" class="cnum">${c.n}</text>`}).join('');
$('#co-map').innerHTML=`<svg class="gsvg cmmap" viewBox="${(x0-pad).toFixed(1)} ${(y0-pad).toFixed(1)} ${(x1-x0+2*pad).toFixed(1)} ${(y1-y0+2*pad).toFixed(1)}" role="img" aria-label="Mapa de curvas"><path d="M${P.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}" fill="none" stroke="var(--line)" stroke-width="${(s*2.6).toFixed(2)}" stroke-linejoin="round"/>${marks}</svg><div class="gleg mut"><span class="lg" style="background:#2DD4BF"></span>sin pérdida<span class="lg" style="background:#F2C14E"></span>pierde algo<span class="lg" style="background:#E4384A"></span>pierde más</div>`;
const o=observaciones(R,x,refx);obsCache=obsTxt(o,x);
const cs=$('#co-cs'),worst=R.C.slice().sort((p,q)=>Math.max(q.avgLoss,q.vsRef?q.vsRef.loss:0)-Math.max(p.avgLoss,p.vsRef?p.vsRef.loss:0))[0];
cs.innerHTML=R.C.map(c=>`<option value="${c.n}">Curva ${c.n} (${c.dist} m)</option>`).join('');
const showCurve=n=>{const c=R.C.find(z=>z.n===+n);if(!c){$('#co-cvb').innerHTML='<p class="mut">No se detectaron curvas en esta tanda.</p>';return}cs.value=String(c.n);
const sl=slowIn(R,c),lossC=Math.max(c.avgLoss,c.vsRef?c.vsRef.loss:0),k=c.otros.length?consejo(c.dFreno,c.dMin,c.dEx,c.n):null;
const fila=(t,col,m,extra)=>`<div class="cvrow"><span class="lg" style="background:${col}"></span><div><b>${t}</b><br>frena a ${r0(m.freno)} m · entra a ${r0(m.vin)} km/h · la más lenta ${r0(m.vmin)} km/h · sale a ${r0(m.vex)} km/h${extra||''}</div></div>`;
$('#co-cvb').innerHTML=`<div class="cvgrid"><div class="cvpic">${cornerView(R,c,{kind:'full',big:true,slow:sl})}</div><div class="cvtxt">
<h3><span class="cvb" style="background:${R.cc(c)}">${c.n}</span> Curva ${c.n} <span class="mut">· a ${c.dist} m de la largada</span></h3>
${lossC>0.04&&k?`<p class="cvtip">${esc(k.t)} Si lo hacés, ganás ${esc(segs(c.avgLoss))}. 🏁</p>`:`<p class="cvtip">¡Esta curva te sale muy bien! ✅ Seguí haciéndola igual.</p>`}
${fila(`Tu mejor vuelta (vuelta ${R.best.n})`,'var(--acc)',c.mb)}
${sl?fila(`Vuelta más lenta acá (vuelta ${sl.n})`,'#FF8A3D',sl.m,` · pierde ${sl.loss.toFixed(3)} s`):''}
${c.vsRef&&refx?`<p class="mut sm">Contra ${esc(refx.piloto)}: ${c.vsRef.loss>=0?'pierde':'gana'} ${Math.abs(c.vsRef.loss).toFixed(3)} s en esta curva (frena a ${r0(c.vsRef.freno)} m, la más lenta ${r0(c.vsRef.vmin)} km/h).</p>`:''}
<p class="mut sm">La rayita marca dónde empieza a frenar cada vuelta; el punto violeta, la velocidad más baja de la mejor vuelta.</p></div></div>`};
cs.onchange=e=>showCurve(e.target.value);
$('#co-map').onclick=e=>{const t=e.target.closest('[data-c]');if(t){showCurve(t.dataset.c);if(innerWidth<1100)$('#co-cv').scrollIntoView({behavior:'smooth',block:'start'})}};
showCurve(worst?worst.n:(R.C[0]||{}).n);
$('#co-obs').innerHTML=o.map(sct=>`<h3>${esc(sct.h)}</h3>${(sct.t||[]).map(t=>`<p>${esc(t)}</p>`).join('')}${sct.ol?(sct.ol.length?`<ol class="tips">${sct.ol.map(t=>`<li>${itH(t,R)}</li>`).join('')}</ol>`:`<p class="mut">${esc(sct.vacio)}</p>`):''}${sct.ul?(sct.ul.length?`<ul${sct.ul.some(t=>typeof t!=='string')?' class="tips"':''}>${sct.ul.map(t=>`<li>${itH(t,R)}</li>`).join('')}</ul>`:`<p class="mut">${esc(sct.vacio)}</p>`):''}`).join('')}
catch(e){if(my===rid)$('#co-obs').innerHTML=`<p class="mut">No se pudo analizar: ${esc(e.message)}</p>`}}
const lbl=x=>`${fdate(x.fecha)} · ${x.tanda?tLbl(x.tanda):'sin tanda'} · ${x.mejor_vuelta!=null?fmtLap(x.mejor_vuelta):'—'} · ${x.pista||'sin pista'}`;
tree();run();
const refresh=async()=>{if(document.hidden)return;try{const n=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(desc);if(n.map(x=>x.id).join()!==S.map(x=>x.id).join()){S=n;tree()}}catch(e){}};
setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh)}
/* Vuelta teórica: mejores microsectores de una tanda */
function csvMarkers(txt){const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/).slice(0,500),d=csvDelim(txt),num=t=>{t=String(t).trim();if(d===';')t=t.replace(',','.');return t===''?NaN:+t},out={beacon:[],split:[]};
for(const l of lines){const c=csvCells(l,d),k=(c[0]||'').toLowerCase();const k2=/^beacon markers$/.test(k)?'beacon':/^(split|sector) markers$/.test(k)?'split':null;if(!k2)continue;
c.slice(1).join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).forEach(t=>{const x=num(t);if(!isNaN(x))out[k2].push(x)})}
out.beacon.sort((a,b)=>a-b);out.split.sort((a,b)=>a-b);return out}
function teorica(txt){const mk=csvMarkers(txt);let B=mk.beacon,BN=null;let BT=null;if(!B.length){const lc=lapCol(txt);if(lc&&lc.markers.length>1){B=lc.markers;BN=lc.nums;BT=lc.times}}
const fin=(f,laps,secs)=>{const best=laps.reduce((p,q)=>q.t<p.t?q:p,laps[0]);const s=secs[0].map((_,k)=>{let bt=Infinity,bl=0;secs.forEach((row,i)=>{if(row[k]<bt){bt=row[k];bl=laps[i].n}});return[Math.round(bt*1000)/1000,bl,Math.round(secs[laps.indexOf(best)][k]*1000)/1000]});
return{f,s,teorica:laps.length<2?Math.round(best.t*1000)/1000:Math.min(Math.round(best.t*1000)/1000,Math.round(s.reduce((a,x)=>a+x[0],0)*1000)/1000),mejor:Math.round(best.t*1000)/1000,mejorN:best.n,vueltas:laps.length}};
const lapsB=[];for(let k=0;k+1<B.length;k++){const t=BT&&BT[k]?BT[k]:B[k+1]-B[k];if(t>5&&t<600)lapsB.push({n:BN?BN[k]:k+1,a:B[k],b:B[k+1],t})}
// 1) splits configurados en la MyChron
if(mk.split.length&&lapsB.length){const rows=lapsB.map(l=>{const sp=mk.split.filter(x=>x>l.a+0.05&&x<l.b-0.05),pts=[l.a,...sp,l.b];return pts.slice(1).map((x,i)=>x-pts[i])});
const cnt={};rows.forEach(r=>cnt[r.length]=(cnt[r.length]||0)+1);const nS=+Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
const ok=lapsB.map((l,i)=>({l,r:rows[i]})).filter(x=>x.r.length===nS);if(nS>1&&ok.length)return fin('mychron',ok.map(x=>x.l),ok.map(x=>x.r))}
// 2) 10 tramos iguales con distancia / GPS
const TD=parseTelemetry(txt);
if(!TD.error){const L=telLaps(TD).filter(l=>l.n);if(L.length){const NS=10,secs=L.map(l=>{const tr=lapTrace(TD,l,400),N=tr.t.length-1;return Array.from({length:NS},(_,k)=>tr.t[Math.round((k+1)/NS*N)]-tr.t[Math.round(k/NS*N)])});return fin('tramos',L,secs)}}
// 3) solo vueltas
if(lapsB.length)return fin('vueltas',lapsB,lapsB.map(l=>[l.t]));
return null}
/* Vuelta teórica (Análisis): detalle por microsector de cada tanda con CSV */
async function vTeo(el){
el.innerHTML=`<section class="card col teoc"><div class="head"><h2>Vuelta teórica</h2><select id="teo-s" aria-label="Tanda" hidden></select></div><p class="mut sm">Juntando los mejores microsectores de todas las vueltas de una tanda: la vuelta más rápida que el piloto ya hizo por partes.</p><div id="teo-v"></div></section>`;
const v=$('#teo-v'),sel=$('#teo-s');
if(!CLOUD||!AUTH){v.innerHTML='<p class="mut">Ingresá con tu usuario (en Drivers) para ver la vuelta teórica de tus sesiones.</p>';return}
let S=[],teoId='',run=0;const admin=AUTH.perfil&&AUTH.perfil.rol==='admin';
const load=async()=>{S=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(porCarga)};
const fill=()=>{if(!S.length){sel.hidden=true;v.innerHTML='<p class="mut">Cuando guardes una sesión con el CSV de la MyChron, acá aparece su vuelta teórica.</p>';return false}
sel.hidden=false;if(!S.some(x=>x.id===teoId))teoId=S[0].id;
sel.innerHTML=S.map(x=>`<option value="${esc(x.id)}"${x.id===teoId?' selected':''}>${esc(x.piloto)} · ${fdate(x.fecha)}${x.tanda?' · '+tLbl(x.tanda):''}</option>`).join('');return true};
async function show(){const my=++run,x=S.find(s=>s.id===teoId);if(!x)return;let th=x.microsectores&&x.microsectores.s?x.microsectores:null;
if(!th){v.innerHTML='<p class="mut">Calculando con el CSV…</p>';try{const j=await req('/storage/v1/object/sign/'+BK+'/'+x.archivo,{method:'POST',headers:J,body:JSON.stringify({expiresIn:120})});const r=await fetch(BASE+'/storage/v1'+(j.signedURL||j.signedUrl));if(!r.ok)throw new Error('HTTP '+r.status);th=teorica(await r.text())}catch(e){if(my===run)v.innerHTML=`<p class="mut">No se pudo calcular: ${esc(e.message)}</p>`;return}
if(my!==run)return;if(!th){v.innerHTML='<p class="mut">Este CSV no trae vueltas completas para calcular la vuelta teórica.</p>';return}
x.vuelta_teorica=th.teorica;x.microsectores=th;if(admin)api('?id=eq.'+encodeURIComponent(x.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({vuelta_teorica:th.teorica,microsectores:th})}).catch(()=>{})}
if(my!==run)return;const gan=th.mejor-th.teorica<0.0025?0:th.mejor-th.teorica,st=(k,val,c='')=>`<div class="st ${c}"><div class="big">${val}</div><div class="mut">${k}</div></div>`;
const fuente={mychron:'Microsectores configurados en la MyChron.',tramos:'El CSV no trae los splits de la MyChron: la vuelta se dividió en 10 tramos iguales.',vueltas:'El CSV no trae microsectores ni GPS: la vuelta teórica es la mejor vuelta.'}[th.f]||'';
v.innerHTML=`<div class="stats">${st('vuelta teórica',fmtLap(th.teorica),'teo')}${st('mejor vuelta (V'+th.mejorN+')',fmtLap(th.mejor),'mv')}${st('para ganar',gan.toFixed(3)+' s')}${st('vueltas',th.vueltas)}</div>
${th.s.length>1?`<table class="db sect"><thead><tr><th>Microsector</th><th>Mejor tiempo</th><th>En la vuelta</th><th>En su mejor vuelta</th></tr></thead><tbody>${th.s.map((q,i)=>`<tr><td>${i+1}</td><td class="teo">${q[0].toFixed(3)}</td><td>${q[1]}</td><td class="mut">${q[2].toFixed(3)}${q[2]-q[0]>0.0005?` <span class="gn">+${(q[2]-q[0]).toFixed(3)}</span>`:''}</td></tr>`).join('')}<tr class="tot"><td>Total</td><td class="teo">${fmtLap(th.teorica)}</td><td></td><td class="mut">${fmtLap(th.mejor)}</td></tr></tbody></table>`:''}<p class="mut sm">${fuente}</p>`}
sel.onchange=e=>{teoId=e.target.value;show()};
v.innerHTML='<p class="mut">Cargando sesiones…</p>';
try{await load()}catch(e){v.innerHTML='<p class="mut">No se pudieron cargar las sesiones. Probá recargar la página.</p>';return}
if(fill())show();
const refresh=async()=>{if(document.hidden)return;const ids=S.map(x=>x.id).join();try{await load()}catch(e){return}if(S.map(x=>x.id).join()===ids)return;const had=teoId;if(fill()&&had!==teoId)show()};
setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh)}
/* GPS de la tanda: CSV real de la MyChron (Race Studio) */
const CHN={gps_speed_kmh:'Velocidad GPS (km/h)',gps_altitude_m:'Altitud (m)',gps_satellites:'Satélites GPS',distance_m:'Distancia (m)',gps_latitude_deg:'Latitud',gps_longitude_deg:'Longitud'};
const chLabel=(n,u)=>{if(CHN[n])return CHN[n];const m=n.match(/^(.*?)_(kmh|m|deg|s|ms|c|rpm|bar|v|g)$/i),U={kmh:'km/h',deg:'°',c:'°C'};return m?`${m[1].replace(/_/g,' ')} (${U[m[2].toLowerCase()]||m[2]})`:n.replace(/_/g,' ')+(u?` (${u})`:'')};
function parseTelemetry(txt){
const lines=String(txt).replace(/^﻿/,'').split(/\r?\n/),d=csvDelim(txt);
const num=t=>{t=String(t==null?'':t).trim();if(d===';')t=t.replace(',','.');return t===''?NaN:+t};
let hi=-1;for(let i=0;i<Math.min(lines.length,500);i++){const c=csvCells(lines[i],d).map(x=>x.toLowerCase());if(c.some(x=>/latitud/.test(x))&&c.some(x=>/longitud/.test(x))){hi=i;break}}
if(hi<0)return{error:'Este CSV no trae datos de GPS (latitud y longitud). En Race Studio 3, exportá el CSV incluyendo los canales GPS.'};
const H=csvCells(lines[hi],d),find=re=>H.findIndex(x=>re.test(x));
let unidades=[],start=hi+1;const u=csvCells(lines[hi+1]||'',d);if(u.length&&isNaN(num(u[0]))){unidades=u;start=hi+2}
const fB=re=>H.findIndex(x=>re.test(hBase(x)));let iT=fB(/^(time|tiempo)(_s)?$/);let iTms=iT<0?fB(/^(time|tiempo)_ms$/):(hUnit(H[iT])==='ms'?iT:-1);if(iT<0)iT=iTms;const tK=iTms>=0&&iT===iTms?0.001:1,iLa=find(/latitud/i),iLo=find(/longitud/i);let iS=find(/^gps[ _]speed/i);if(iS<0)iS=find(/speed|velocidad/i);
const iD=fB(/^(distance|distancia)(_m)?$/);
if(iT<0)return{error:'No encontré la columna de tiempo (Time) en el CSV.'};
const R=[];for(let i=start;i<lines.length;i++){if(!lines[i].trim())continue;const c=csvCells(lines[i],d);const t=num(c[iT]);if(isNaN(t))continue;R.push(c)}const lapJ=fB(/^(lap|vuelta)$/);
if(R.length<10)return{error:'El CSV casi no tiene datos.'};
const chans=[];H.forEach((n,j)=>{if(j===iT||j===iLa||j===iLo||!n||/^(time|tiempo)(_s|_ms)?$|^(lap|vuelta)$|^lap[_ ]?(time|elapsed|total)/i.test(hBase(n)))return;let ok=0;for(let k=0;k<R.length;k+=Math.max(1,Math.floor(R.length/50)))if(!isNaN(num(R[k][j])))ok++;if(ok>5)chans.push({j,name:n,unit:unidades[j]||''})});
const T=[],LA=[],LO=[],V=[],DI=[],CH={};chans.forEach(c=>CH[c.j]=[]);
R.forEach(c=>{T.push(num(c[iT])*tK);LA.push(num(c[iLa]));LO.push(num(c[iLo]));V.push(iS>=0?num(c[iS]):NaN);DI.push(iD>=0?num(c[iD]):NaN);chans.forEach(ch=>CH[ch.j].push(num(c[ch.j])))});
const ok=LA.map((a,i)=>Math.abs(a)>0.0001&&Math.abs(LO[i])>0.0001&&!isNaN(a)&&!isNaN(LO[i]));
if(ok.filter(Boolean).length<10)return{error:'El GPS del CSV no tiene posiciones válidas (¿la MyChron tenía señal de GPS?).'};
// velocidad desde GPS si no hay canal
const m=[];const head=lines.slice(0,hi);for(const l of head){const c=csvCells(l,d);if(/^beacon markers$/i.test(c[0]||'')){c.slice(1).join(' ').split(d===';'?/[\s;]+/:/[\s,]+/).forEach(t=>{const x=num(t);if(!isNaN(x))m.push(x)})}}
let lapNums=null,lapTimes=null;if(!m.length&&lapJ>=0){const lc=lapCol(txt);if(lc){lc.markers.forEach(x=>m.push(x));lapNums=lc.nums;lapTimes=lc.times}}
return{T,LA,LO,V,DI,CH,chans,ok,lapNums,lapTimes,markers:m.sort((a,b)=>a-b),speedCol:iS>=0?H[iS]:null,speedUnit:iS>=0?(unidades[iS]||'km/h'):'km/h'}}
function vGPS(el){
el.innerHTML=`<section class="card col gpsc"><div class="head"><h2>GPS de la tanda</h2><div class="tools gtools"><select id="gs-ses" aria-label="Sesión guardada" hidden></select><label class="ghost filebtn">Abrir CSV<input type="file" accept=".csv,text/csv" id="gs-file" hidden><input type="file" accept=".csv,text/csv" id="gs-file2" hidden></label></div></div>
<div class="gsel" hidden id="gs-sel"><label>Vuelta<select id="gs-lap"></select></label><label>Comparar con<select id="gs-lap2"></select></label><label>Dato<select id="gs-ch"></select></label></div>
<div class="gwrap" id="gs-wrap" hidden><div class="gmap" id="gs-map"></div><div class="gchart"><div id="gs-chart"></div><div class="read" id="gs-read"></div></div></div>
<p class="mut" id="gs-msg"></p></section>`;
const msg=t=>{$('#gs-msg').textContent=t||''};let TD=null,lap=null,lap2=null,chJ=null,cur=0,TD2=null,L2=[],name2='',P2=null,SAVED=[],ORI=null;
msg(CLOUD&&AUTH?'Elegí una sesión guardada con su CSV, o abrí un CSV de la compu.':'Abrí un CSV exportado de la MyChron. Si ingresás con tu usuario (en Drivers), también podés elegir tus sesiones guardadas.');
const vcol=(v,a,b)=>{const t=Math.max(0,Math.min(1,(v-a)/((b-a)||1)));return`rgb(${Math.round(228+(45-228)*t)},${Math.round(56+(212-56)*t)},${Math.round(74+(191-74)*t)})`};
const laps=()=>telLaps(TD);
let L=[];
function load(txt,nombre){const r=parseTelemetry(txt);if(r.error){$('#gs-wrap').hidden=true;$('#gs-sel').hidden=true;msg(r.error);return}
TD=r;L=laps();const best=telBest(L);lap=best;if(lap2&&lap2.td!==TD2)lap2=null;
$('#gs-lap').innerHTML=L.map((x,i)=>`<option value="${i}"${x===best?' selected':''}>${x.n?`Vuelta ${x.n} · ${fmtLap(x.t)}${x===best&&L.length>1?' (mejor)':''}`:'Toda la sesión'}</option>`).join('');
const sp=TD.chans.find(c=>c.name===TD.speedCol);chJ=sp?sp.j:(TD.chans[0]||{}).j;
$('#gs-ch').innerHTML=TD.chans.map(c=>`<option value="${c.j}"${c.j===chJ?' selected':''}>${esc(chLabel(c.name,c.unit))}</option>`).join('');
fillLap2();$('#gs-wrap').hidden=false;$('#gs-sel').hidden=false;msg((nombre?nombre+' · ':'')+`${L.filter(x=>x.n).length||1} ${L.filter(x=>x.n).length===1?'vuelta':'vueltas'} · ${TD.T.length} puntos de GPS. Mové el cursor sobre el gráfico (o tocá la pista) para ver dónde estaba el kart.`);draw()}
let P=null,VB=null;
function proj(){const ii=TD.LA.map((_,i)=>i).filter(i=>TD.ok[i]),la0=ii.reduce((s,i)=>s+TD.LA[i],0)/ii.length,lo0=ii.reduce((s,i)=>s+TD.LO[i],0)/ii.length,k=Math.cos(la0*Math.PI/180);ORI=[la0,lo0,k];if(TD2)P2=TD2.LA.map((x,i)=>TD2.ok[i]?[(TD2.LO[i]-lo0)*k*111320,-(x-la0)*110540]:null);
P=TD.LA.map((a,i)=>TD.ok[i]?[(TD.LO[i]-lo0)*k*111320,-(a-la0)*110540]:null);const xs=ii.map(i=>P[i][0]),ys=ii.map(i=>P[i][1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),pad=Math.max(x1-x0,y1-y0)*.06;VB=[x0-pad,y0-pad,x1-x0+2*pad,y1-y0+2*pad]}
function draw(){proj();const s=Math.max(VB[2],VB[3])/100,a=lap.a,b=lap.b,V=TD.V,vs=V.slice(a,b).filter(x=>!isNaN(x)),vmin=vs.length?Math.min(...vs):0,vmax=vs.length?Math.max(...vs):1;
const all=P.filter(Boolean).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
const step=Math.max(1,Math.ceil((b-a)/700));let seg='';for(let i=a;i+step<b;i+=step){const p=P[i],q=P[i+step];if(p&&q)seg+=`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${isNaN(V[i])?'var(--acc)':vcol(V[i],vmin,vmax)}" stroke-width="${(s*1.1).toFixed(2)}" stroke-linecap="round"/>`}
const p0=P.slice(a,b).find(Boolean)||[0,0];
$('#gs-map').innerHTML=`<svg viewBox="${VB.map(x=>x.toFixed(1)).join(' ')}" class="gsvg" role="img" aria-label="Trazado GPS de la vuelta"><path d="M${all}" fill="none" stroke="var(--line)" stroke-width="${(s*2.6).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"/>${seg}<circle cx="${p0[0].toFixed(1)}" cy="${p0[1].toFixed(1)}" r="${(s*.9).toFixed(2)}" fill="none" stroke="var(--ink)" stroke-width="${(s*.4).toFixed(2)}"/>${lap2?`<circle id="gs-dot2" r="${(s*1.6).toFixed(2)}" fill="#FF8A3D" stroke="var(--surf)" stroke-width="${(s*.5).toFixed(2)}"/>`:''}<circle id="gs-dot" r="${(s*1.6).toFixed(2)}" fill="var(--mv)" stroke="var(--surf)" stroke-width="${(s*.5).toFixed(2)}"/></svg>
<div class="gleg mut"><span class="lg" style="background:rgb(228,56,74)"></span>más lento<span class="lg" style="background:rgb(45,212,191)"></span>más rápido${lap2?`<span class="lg" style="background:var(--mv)"></span>vuelta ${lap.n}<span class="lg" style="background:#FF8A3D"></span>${esc(lap2.lbl)}`:''}</div>`;
if(lap2){drawCmp();setCmp(0)}else{drawChart();setCur(a)}}
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
const mk2=(td,lp,Pf,lbl)=>({td,lp,Pf,lbl});
function fillLap2(){const sel=$('#gs-lap2'),own=L.filter(x=>x.n&&x!==lap),cur2=lap2?(lap2.td===TD?'a:'+L.indexOf(lap2.lp):'b:'+L2.indexOf(lap2.lp)):'';
let h='<option value="">Ninguna</option>';
if(own.length)h+=`<optgroup label="Esta tanda">${own.map(x=>`<option value="a:${L.indexOf(x)}">Vuelta ${x.n} · ${fmtLap(x.t)}</option>`).join('')}</optgroup>`;
if(TD2&&L2.length){const b2=telBest(L2);h+=`<optgroup label="${esc(name2)}">${L2.map((x,i)=>`<option value="b:${i}">${esc(name2)} · Vuelta ${x.n} · ${fmtLap(x.t)}${x===b2&&L2.length>1?' (mejor)':''}</option>`).join('')}</optgroup>`}
if(SAVED.length)h+=`<optgroup label="Sesiones guardadas">${SAVED.map(x=>`<option value="s:${esc(x.id)}">${esc(x.piloto)} · ${fdate(x.fecha)}${x.tanda?' · '+tLow(x.tanda):''}</option>`).join('')}</optgroup>`;
h+='<option value="__file">📂 Abrir otro CSV…</option>';sel.innerHTML=h;sel.value=cur2;sel.disabled=false}
function load2(txt,nombre){const r=parseTelemetry(txt);if(r.error){msg(r.error);fillLap2();return}const l2=telLaps(r).filter(x=>x.n);if(!l2.length){msg('Ese CSV no tiene vueltas completas para comparar.');fillLap2();return}
TD2=r;L2=l2;name2=nombre;const b2=telBest(L2);lap2=mk2(TD2,b2,()=>P2,`${nombre} · Vuelta ${b2.n}`);fillLap2();draw()}
let CA=null,CB=null,CS=0;
const prep=(lp,td,Pp)=>{const a=lp.a,b=lp.b,T=td.T,c=TD.chans.find(x=>x.j===chJ)||{},jj=td===TD?chJ:((td.chans.find(x=>x.name===c.name)||td.chans.find(x=>x.name===td.speedCol)||{}).j),Y=td.CH[jj]||[],D=[];const hasD=!isNaN(td.DI[a])&&!isNaN(td.DI[b-1])&&td.DI[b-1]>td.DI[a];
if(hasD)for(let i=a;i<b;i++)D.push(td.DI[i]-td.DI[a]);else{let acc=0,prev=null;for(let i=a;i<b;i++){const p=Pp[i]||prev;if(prev&&p)acc+=Math.hypot(p[0]-prev[0],p[1]-prev[1]);D.push(acc);if(p)prev=p}}
const len=D[D.length-1]||1,N=600,o={idx:[],t:[],y:[],len};let j=0;for(let k=0;k<=N;k++){const d=k/N*len;while(j<D.length-2&&D[j+1]<d)j++;const i=a+j;o.idx.push(i);o.t.push(T[i]-T[a]);o.y.push(Y[i])}
const kk=lp.t/(o.t[N]||1);o.t=o.t.map(x=>x*kk);return o};
function drawCmp(){CA=prep(lap,TD,P);CB=prep(lap2.lp,lap2.td,lap2.Pf()||[]);const N=CA.y.length-1,ys=[...CA.y,...CB.y].filter(x=>!isNaN(x));let y0=ys.length?Math.min(...ys):0,y1=ys.length?Math.max(...ys):1;const pd=(y1-y0)*.08||1;y0-=pd;y1+=pd;
const X=k=>44+k/N*680,YY=v=>12+(y1-v)/(y1-y0)*170,dl=CA.t.map((t,k)=>CB.t[k]-t),m=Math.max(.1,Math.max(...dl.map(Math.abs))*1.2),Z=d=>236-d/m*24;CX={X,N};
const line=(o,c)=>{let p='';o.y.forEach((v,k)=>{if(!isNaN(v))p+=X(k).toFixed(1)+','+YY(v).toFixed(1)+' '});return`<polyline fill="none" stroke="${c}" stroke-width="2" points="${p}"/>`};
let g='';for(let k=0;k<=4;k++){const v=y0+(y1-y0)*k/4;g+=`<line x1="44" x2="724" y1="${YY(v)}" y2="${YY(v)}" stroke="var(--line)"/><text x="0" y="${YY(v)+4}">${Math.abs(v)>=100?Math.round(v):v.toFixed(1)}</text>`}
const stepM=CA.len>2500?500:CA.len>1200?200:100;for(let d=0;d<=CA.len;d+=stepM)g+=`<text x="${(X(d/CA.len*N)-8).toFixed(1)}" y="272">${d}m</text>`;
const c=TD.chans.find(x=>x.j===chJ)||{name:'',unit:''};
$('#gs-chart').innerHTML=`<svg viewBox="0 0 740 276" class="chart gchartsvg" id="gs-svg" role="img" aria-label="${esc(chLabel(c.name,c.unit))}: vuelta ${lap.n} y ${esc(lap2.lbl)}">${g}${line(CB,'#FF8A3D')}${line(CA,'var(--acc)')}
<text x="44" y="204">Diferencia de tiempo: arriba, Vuelta ${lap.n} va adelante</text><line x1="44" x2="724" y1="236" y2="236" stroke="var(--line)"/><polyline fill="none" stroke="var(--ink)" stroke-width="1.6" points="${dl.map((d,k)=>X(k).toFixed(1)+','+Z(d).toFixed(1)).join(' ')}"/><line id="gs-cur" y1="8" y2="262" stroke="var(--mv)" stroke-width="2"/></svg>`;
if(lap2.td!==TD&&Math.abs(CB.len-CA.len)/CA.len>0.06)msg('Ojo: las dos vueltas tienen distinto largo. ¿Son de la misma pista?');
const svg=$('#gs-svg'),mv=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*740;setCmp(Math.max(0,Math.min(N,Math.round((x-44)/680*N))))};svg.addEventListener('pointerdown',mv);svg.addEventListener('pointermove',mv)}
function setCmp(k){CS=k;const N=CX.N,ia=CA.idx[k],ib=CB.idx[k],P2x=lap2.Pf()||[];[['#gs-dot',P[ia]],['#gs-dot2',P2x[ib]]].forEach(([id,p])=>{const e=$(id);if(e&&p){e.setAttribute('cx',p[0]);e.setAttribute('cy',p[1])}});
const x=CX.X(k);$('#gs-cur').setAttribute('x1',x);$('#gs-cur').setAttribute('x2',x);const c=TD.chans.find(z=>z.j===chJ)||{name:'',unit:''},f=v=>isNaN(v)?'—':(Math.abs(v)>=100?Math.round(v):v.toFixed(1)),d=CB.t[k]-CA.t[k],uu=c.unit||hUnit(c.name),u=uu?' '+uu:'';
$('#gs-read').textContent=`${Math.round(k/N*CA.len)} m · Vuelta ${lap.n}: ${f(CA.y[k])}${u} · ${lap2.lbl}: ${f(CB.y[k])}${u} · ${Math.abs(d)<0.0005?'iguales':`${d>=0?lap2.lbl:'Vuelta '+lap.n} +${Math.abs(d).toFixed(3)} s`}`}
function setCur(i){cur=i;const p=P[i],dot=$('#gs-dot');if(p&&dot){dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1])}
const x=CX.X(TD.T[i]);$('#gs-cur').setAttribute('x1',x);$('#gs-cur').setAttribute('x2',x);
const c=TD.chans.find(x=>x.j===chJ)||{name:'',unit:''},val=(TD.CH[chJ]||[])[i],dist=!isNaN(TD.DI[i])&&!isNaN(TD.DI[lap.a])?TD.DI[i]-TD.DI[lap.a]:null;
$('#gs-read').textContent=`${lap.n?'Vuelta '+lap.n+' · ':''}${(TD.T[i]-TD.T[lap.a]).toFixed(2)} s${dist!=null?' · '+Math.round(dist)+' m':''}${!isNaN(TD.V[i])&&c.name!==TD.speedCol?' · '+Math.round(TD.V[i])+' '+TD.speedUnit:''} · ${chLabel(c.name,c.unit).replace(/ \(.*\)$/,'')}: ${isNaN(val)?'—':(Math.abs(val)>=100?Math.round(val):val.toFixed(1))}${c.unit?' '+c.unit:''}`}
$('#gs-map').addEventListener('pointerdown',e=>{const svg=e.target.closest('svg');if(!svg||!TD)return;const r=svg.getBoundingClientRect(),sc=Math.max(VB[2]/r.width,VB[3]/r.height),ox=VB[0]+(VB[2]-r.width*sc)/2,oy=VB[1]+(VB[3]-r.height*sc)/2,x=ox+(e.clientX-r.left)*sc,y=oy+(e.clientY-r.top)*sc;
let bi=lap.a,bd=1e18;for(let i=lap.a;i<lap.b;i++){const p=P[i];if(!p)continue;const dd=(p[0]-x)**2+(p[1]-y)**2;if(dd<bd){bd=dd;bi=i}}if(lap2&&CA){let bs=0,bk=1e18;CA.idx.forEach((ix,k)=>{const dd=Math.abs(ix-bi);if(dd<bk){bk=dd;bs=k}});setCmp(bs)}else setCur(bi)});
$('#gs-lap').onchange=e=>{lap=L[+e.target.value];if(lap2&&lap2.td===TD&&lap2.lp===lap)lap2=null;fillLap2();draw()};
$('#gs-lap2').onchange=async e=>{const v=e.target.value;
if(v==='__file'){fillLap2();$('#gs-file2').click();return}
if(v===''){lap2=null;draw();return}
if(v.startsWith('a:')){const x=L[+v.slice(2)];lap2=mk2(TD,x,()=>P,`Vuelta ${x.n}`);draw();return}
if(v.startsWith('b:')){const x=L2[+v.slice(2)];lap2=mk2(TD2,x,()=>P2,`${name2} · Vuelta ${x.n}`);draw();return}
if(v.startsWith('s:')){const x=SAVED.find(r=>r.id===v.slice(2));if(!x)return;msg('Bajando el CSV de '+x.piloto+'…');try{const j=await req('/storage/v1/object/sign/'+BK+'/'+x.archivo,{method:'POST',headers:J,body:JSON.stringify({expiresIn:120})});const r=await fetch(BASE+'/storage/v1'+(j.signedURL||j.signedUrl));if(!r.ok)throw new Error('HTTP '+r.status);load2(await r.text(),`${x.piloto} ${fdate(x.fecha)}${x.tanda?' · '+tLbl(x.tanda):''}`)}catch(err){msg('No se pudo bajar el archivo: '+err.message);fillLap2()}}};
$('#gs-file2').onchange=async e=>{const f=e.target.files[0];if(!f)return;msg('Leyendo '+f.name+'…');try{load2(await f.text(),f.name.replace(/\.csv$/i,''))}catch(err){msg('No pude leer el archivo: '+err.message)}e.target.value=''};$('#gs-ch').onchange=e=>{chJ=+e.target.value;if(lap2){drawCmp();setCmp(CS)}else{drawChart();setCur(Math.max(lap.a,Math.min(cur,lap.b-1)))}};
$('#gs-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;msg('Leyendo '+f.name+'…');try{load(await f.text(),f.name)}catch(err){msg('No pude leer el archivo: '+err.message)}e.target.value=''};
if(CLOUD&&AUTH){(async()=>{try{const rows=(await api(COLS)).map(norm).filter(x=>x.archivo&&/\.csv$/i.test(x.archivo)).sort(desc);SAVED=rows;if(TD)fillLap2();if(!rows.length)return;const sel=$('#gs-ses');
sel.innerHTML='<option value="">Elegí una sesión…</option>'+rows.map(x=>`<option value="${esc(x.id)}">${esc(x.piloto)} · ${fdate(x.fecha)}${x.tanda?' · '+tLow(x.tanda):''}${x.pista?' · '+esc(x.pista):''}</option>`).join('');sel.hidden=false;
sel.onchange=async()=>{const x=rows.find(r=>r.id===sel.value);if(!x)return;msg('Bajando el CSV de '+x.piloto+'…');try{const j=await req('/storage/v1/object/sign/'+BK+'/'+x.archivo,{method:'POST',headers:J,body:JSON.stringify({expiresIn:120})});
const r=await fetch(BASE+'/storage/v1'+(j.signedURL||j.signedUrl));if(!r.ok)throw new Error('HTTP '+r.status);load(await r.text(),`${x.piloto} · ${fdate(x.fecha)}${x.tanda?' · '+tLow(x.tanda):''}`)}catch(err){msg('No se pudo bajar el archivo: '+err.message)}}}catch(e){}})()}}
const pg=document.body.dataset.page;
const fn={h:v=>{v.innerHTML=mapSVG(D[0].best,'')},a:v=>CLOUD&&AUTH?vCmp(v):vA(v),r:vR,s:vS,d:vDr,c:vCoach}[pg];
const view=()=>{stop();fn($('#view'))};
if(fn&&$('#view'))view();
if(pg==='a'&&$('#gpsv'))vGPS($('#gpsv'));
if(pg==='a'&&$('#teov'))vTeo($('#teov'));
if(pg==='a'&&!(CLOUD&&AUTH)){const h=document.querySelector('.demo');if(h)h.insertAdjacentHTML('beforeend',' <span class="mut">(datos de ejemplo · ingresá en Drivers para comparar tus sesiones)</span>')}
