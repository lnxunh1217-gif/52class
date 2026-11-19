(function(root){'use strict';
  function searchUrl(value){const text=String(value||'').trim();return text?'https://www.youtube.com/results?search_query='+encodeURIComponent(text):null;}
  function videoId(value){try{const url=new URL(String(value||'').trim());if(url.protocol!=='https:')return null;let id=null;if(url.hostname==='youtu.be')id=url.pathname.slice(1).split('/')[0];if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(url.hostname)){id=url.searchParams.get('v');if(!id){const parts=url.pathname.split('/');if(['shorts','embed','live'].includes(parts[1]))id=parts[2];}}return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null;}catch{return null;}}
  function textSize(width,height,base=32){return Math.round(Math.max(14,Math.min(180,base*Math.max(.5,Math.min(width/560,Math.max(80,height-100)/310,4)))));}
  function migrateWidgets(rows){const hasRandom=rows.some(row=>row.id==='random');return rows.filter(row=>row.id!=='checklist'&&(!hasRandom||row.id!=='lottery')).map(row=>row.id==='lottery'?{...row,id:'random'}:row);}
  root.PicklingClassroomTools={searchUrl,videoId,textSize,migrateWidgets};
})(typeof window==='undefined'?globalThis:window);
