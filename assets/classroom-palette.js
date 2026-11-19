(function(root){'use strict';
 // Fixed palettes cross the classroom iframe boundary; no arbitrary CSS is accepted in messages.
 const THEMES={
  'cucumber-land':{ink:'#313e26',soft:'#63744d',title:'#415233',paper:'#fbfdfa',line:'#d9e6c5',tint:'#f3f7ed',accent:'#5e7934',focus:'#f5e8ef',focusInk:'#804763',focusLine:'#d8b6c9'},
  'pastel-cloud':{ink:'#413416',soft:'#735c26',title:'#645122',paper:'#fffefa',line:'#eee3b4',tint:'#fefced',accent:'#886d2e',focus:'#ede9fa',focusInk:'#615082',focusLine:'#cdc2e6'},
  'sky-balloon':{ink:'#29435f',soft:'#5d748d',title:'#395b7c',paper:'#fcfcfe',line:'#dce3f0',tint:'#f4f6fa',accent:'#657490',focus:'#fff0e3',focusInk:'#91583a',focusLine:'#e7c19f'},
  'wood-cozy':{ink:'#594b40',soft:'#7e7063',title:'#6b5947',paper:'#fffdfa',line:'#e5dccf',tint:'#f8f4ee',accent:'#8d7860',focus:'#e8f0f5',focusInk:'#4e6c84',focusLine:'#b7cddc'},
  'greenboard':{ink:'#315c51',soft:'#527b6e',title:'#38695e',paper:'#fbfefe',line:'#cfe7de',tint:'#f2fafa',accent:'#43867a',focus:'#fff0e9',focusInk:'#94573e',focusLine:'#e4b9a5'},
  'pink-blossom':{ink:'#684c5b',soft:'#896c7b',title:'#815a70',paper:'#fffafb',line:'#ebd4df',tint:'#faf0f5',accent:'#a16a86',focus:'#e4f3ed',focusInk:'#3b7565',focusLine:'#adcfbf'},
  'winter-snow':{ink:'#3f566c',soft:'#5b738b',title:'#4a6a88',paper:'#fbfdff',line:'#ccdce9',tint:'#edf4fa',accent:'#6d92b0',focus:'#fff0e7',focusInk:'#935335',focusLine:'#ddb89d'}
 };
 function valid(id){return Object.hasOwn(THEMES,id);}
 function variables(id){const p=THEMES[valid(id)?id:'cucumber-land'];return {'--pk-focus':p.focus,'--pk-focus-ink':p.focusInk,'--pk-focus-line':p.focusLine};}
 function applyBoard(element,id){if(!valid(id)||!element)return false;const p=THEMES[id];element.dataset.theme=id;const map={ink:p.ink,soft:p.soft,title:p.title,green:p.accent,line:p.line,card:p.paper,tint:p.tint};for(const [key,value]of Object.entries(map))element.style.setProperty('--'+key,value);for(const [key,value]of Object.entries(variables(id)))element.style.setProperty(key,value);return true;}
 const WINTER={'chiikawa':'assets/winter/chiikawa.png','hachiware':'assets/winter/hachiware.png','usagi':'assets/winter/usagi.png','momonga':'assets/winter/momonga.png','kurimanju':'assets/winter/kurimanju.png','shisa':'assets/winter/shisa.png'};
 function friend(id,theme){return theme==='winter-snow'&&WINTER[id]?WINTER[id]:'assets/characters/chiikawa/'+id+'.png';}
 root.PicklingClassroomPalette={THEMES,valid,variables,applyBoard,friend};
 if(typeof module!=='undefined')module.exports=root.PicklingClassroomPalette;
})(typeof window==='undefined'?globalThis:window);
