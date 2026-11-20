(function(root){'use strict';
  const CATALOG=[
    ['timetable','시간표','오이반 시간표 ⏰','fa-table-cells',340,400],
    ['memo','알림장','피클링 알림장 📒','fa-book-open',600,480],
    ['pickling','피클링','피클링 🥒','fa-seedling',480,520],
    ['clock','시계 / 타이머','날짜 및 시간 ⏰','fa-clock',380,480],
    ['random','뽑기','뽑기 상자 🎲','fa-shuffle',540,520],
    ['rest','음악','음악 ♪','fa-music',480,480],
    ['lunch','급식','오늘의 영양급식 🍱','fa-utensils',320,400],
    ['fast-sites','사이트','자주 가는 사이트 🧭','fa-compass',380,420],
    ['grid-checklist','표형체크','한눈에 명렬체크표 📊','fa-list-check',460,500],
    ['time-attack','타임어택','타임어택 ⏳','fa-stopwatch',380,420],
    ['record','기록부','명렬 기록부 📋','fa-address-book',550,500],
    ['panseo','판서','오이반 판서판 🖌️','fa-feather-pointed',460,400],
    ['qr','QR코드','빠른 QR코드 메이커 🔗','fa-qrcode',320,310],
    ['warning-board','경고판','신호등 경고판 🚦','fa-circle-exclamation',460,480],
    ['voice-level','목소리','목소리 크기 약속 📢','fa-volume-high',360,320],
    ['scoreboard','점수판','🏆 오이반 점수판','fa-trophy',400,400]
  ].map(([id,label,title,icon,width,height])=>Object.freeze({id,label,title,icon:'fa-solid '+icon,width,height}));
  const base=id=>String(id).split('_')[0],finite=(n,fallback=0)=>Number.isFinite(Number(n))?Number(n):fallback;
  function order(rows){return rows.map((row,index)=>({row,index})).sort((a,b)=>finite(a.row.zIndex)-finite(b.row.zIndex)||a.index-b.index).map(x=>x.row);}
  function normalize(rows,frontId){let sorted=order(rows);if(frontId!=null){const target=sorted.find(w=>w.id===frontId);if(!target)return rows;sorted=sorted.filter(w=>w!==target).concat(target);}
    const rank=new Map(sorted.map((w,i)=>[w.id,i+1]));let changed=false;
    const next=rows.map(w=>{const z=rank.get(w.id),reveal=w.id===frontId&&w.isMinimized;if(w.zIndex===z&&!reveal)return w;changed=true;return {...w,zIndex:z,...(reveal?{isMinimized:false}:{})};});return changed?next:rows;
  }
  function front(rows,id){return normalize(rows,id);}
  function topId(rows){return order(rows.filter(w=>!w.isMinimized)).at(-1)?.id||null;}
  function uniqueId(type,rows,seed){const stem=type+'_'+String(seed??'new'),used=new Set(rows.map(w=>w.id));let id=stem,n=1;while(used.has(id))id=stem+'_'+n++;return id;}
  function bounds(view){const small=finite(view.width,1280)<=1000,width=Math.max(280,finite(view.width,1280)-(small?24:336));return {x:12,y:104,width,height:Math.max(240,finite(view.height,720)-104-Math.max(120,finite(view.bottom,120))),small};}
  const minHeight=row=>({pickling:300,clock:300,memo:260}[base(row.id)]||220);
  function arrange(rows,view){const visible=rows.filter(w=>!w.isMinimized);if(!visible.length)return rows;const b=bounds(view),gap=16,positions=new Map();
    if(b.small){let y=b.y;for(const row of visible){const h=Math.max(minHeight(row),Math.min(540,finite(row.height,360)));positions.set(row.id,{x:b.x,y,width:b.width,height:h});y+=h+gap;}}
    else if(visible.length===3&&b.width>=720&&(()=>{const primary=visible.find(w=>['panseo','memo'].includes(base(w.id)))||visible[0];return visible.filter(w=>w!==primary).reduce((sum,w)=>sum+minHeight(w),16)<=b.height;})()){
      const priority=row=>({panseo:4,memo:3,'grid-checklist':2,record:1}[base(row.id)]||0);
      const primary=visible.reduce((a,w)=>priority(w)>priority(a)?w:a,visible[0]),others=visible.filter(w=>w!==primary);
      const leftWidth=Math.floor((b.width-gap)*.58),rightWidth=b.width-gap-leftWidth,height=Math.max(b.height,minHeight(others[0])+minHeight(others[1])+gap,minHeight(primary));
      const extra=height-gap-minHeight(others[0])-minHeight(others[1]),firstHeight=minHeight(others[0])+Math.floor(extra/2);
      positions.set(primary.id,{x:b.x,y:b.y,width:leftWidth,height});positions.set(others[0].id,{x:b.x+leftWidth+gap,y:b.y,width:rightWidth,height:firstHeight});positions.set(others[1].id,{x:b.x+leftWidth+gap,y:b.y+firstHeight+gap,width:rightWidth,height:height-firstHeight-gap});
    }else{
      const cols=Math.max(1,Math.min(visible.length,Math.floor((b.width+gap)/296),visible.length===3?3:Math.ceil(Math.sqrt(visible.length)))),rowCount=Math.ceil(visible.length/cols),cellWidth=Math.floor((b.width-gap*(cols-1))/cols),baseHeight=Math.floor((b.height-gap*(rowCount-1))/rowCount);
      let y=b.y;for(let r=0;r<rowCount;r++){const group=visible.slice(r*cols,(r+1)*cols),height=Math.max(baseHeight,...group.map(minHeight));group.forEach((w,c)=>positions.set(w.id,{x:b.x+c*(cellWidth+gap),y,width:cellWidth,height}));y+=height+gap;}
    }
    return rows.map(w=>positions.has(w.id)?{...w,...positions.get(w.id)}:w);
  }
  function ensure(rows,type,view,seed,overrides={}){const tool=CATALOG.find(t=>t.id===type);if(!tool)return rows;const existing=rows.filter(w=>base(w.id)===type).sort((a,b)=>finite(b.zIndex)-finite(a.zIndex))[0];if(existing)return front(rows,existing.id);
    const b=bounds(view),multi=['qr','panseo'].includes(type),id=multi?uniqueId(type,rows,seed):type,width=Math.min(b.width,finite(overrides.width,tool.width)),height=Math.min(b.height,Math.max(minHeight({id}),finite(overrides.height,tool.height))),offset=rows.filter(w=>!w.isFixed).length*24%96;
    const x=Math.max(b.x,Math.min(finite(view.width,1280)/2+20,b.x+b.width-width)),y=b.y+Math.max(0,Math.min(offset,b.height-height));
    const data=type==='panseo'?{notes:'',fontSize:24,chalkMode:true}:type==='qr'?{text:'',label:''}:{};
    return front([...rows,{id,title:overrides.title||tool.title,icon:overrides.icon||tool.icon,x,y,width,height,isFixed:['timetable','lunch','pickling'].includes(type),isMinimized:false,data}],id);
  }
  function openMany(rows,types,view,seed){let next=rows;for(const type of new Set(types))next=ensure(next,type,view,seed);return arrange(next,view);}
  function toggle(rows,type,view,seed,overrides){const multi=['qr','panseo'].includes(type),existing=rows.find(w=>w.id===type);if(!multi&&existing)return rows.filter(w=>w!==existing);
    if(multi){const tool=CATALOG.find(t=>t.id===type);if(!tool)return rows;const id=uniqueId(type,rows,seed),draft=ensure(rows.filter(w=>base(w.id)!==type),type,view,seed,overrides).find(w=>base(w.id)===type);if(!draft)return rows;return front([...rows,{...draft,id}],id);}
    return ensure(rows,type,view,seed,overrides);
  }
  function extent(rows,view){return Math.max(finite(view.height,720),...rows.filter(w=>!w.isMinimized).map(w=>finite(w.y)+finite(w.height)+Math.max(120,finite(view.bottom,120))));}
  function watchIframeFocus(doc,win,onFocus){let timer=0;const check=()=>{win.clearTimeout(timer);timer=win.setTimeout(()=>{const frame=doc.activeElement;if(frame?.tagName!=='IFRAME')return;const pane=frame.closest('[data-widget-id]');if(pane)onFocus(pane.dataset.widgetId);},0);};win.addEventListener('blur',check);return()=>{win.clearTimeout(timer);win.removeEventListener('blur',check);};}
  root.PicklingClassroomWindows={CATALOG,base,order,normalize,front,topId,uniqueId,bounds,arrange,ensure,openMany,toggle,extent,watchIframeFocus};
  if(typeof module!=='undefined')module.exports=root.PicklingClassroomWindows;
})(typeof window==='undefined'?globalThis:window);
