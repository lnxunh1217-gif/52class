(function(root){'use strict';
  function clean(text){return String(text||'').replace(/^\s*오늘의\s*식단\s*\(\s*\d{1,2}\s*\/\s*\d{1,2}\s*\)[ \t]*(?:\r?\n|$)/,'').trim();}
  function lines(text){return clean(text).split(/\r?\n/).map(line=>line.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean);}
  function tray(items){
    const remaining=items.map((text,index)=>({text,index})),wells=[{id:'a',kind:'side',icon:'🥬',items:[]},{id:'b',kind:'side',icon:'🥕',items:[]},{id:'c',kind:'side',icon:'🍓',items:[]},{id:'d',kind:'rice',icon:'🍚',items:[]},{id:'e',kind:'soup',icon:'🥣',items:[]}];
    const take=(well,predicate,fallback)=>{let index=remaining.findIndex(row=>predicate(row.text));if(index<0&&fallback)index=0;if(index>=0){const row=remaining.splice(index,1)[0];well.items.push(row.text);}};
    take(wells[3],text=>/(밥|죽|리조또|비빔면|볶음면|국수|파스타)/.test(text),false);
    take(wells[4],text=>/(국|탕|찌개|전골|수프|스프)/.test(text),false);
    for(const well of wells.slice(0,3))take(well,()=>true,false);
    for(const row of remaining){const score=well=>(well.items.reduce((n,text)=>n+text.length+4,0))/(well.kind==='side'?1:1.8);let target=wells[0];for(const well of wells)if(score(well)<score(target))target=well;target.items.push(row.text);}
    return wells;
  }
  function fitTray(element,baseFont){
    const maximum=Math.max(14,Math.min(24,Math.round(baseFont)));let result;
    for(let size=maximum;size>=11;size--)for(const icons of (size>=14?[true,false]:[false])){
      element.style.fontSize=size+'px';element.style.setProperty('--tray-icons',icons?'flex':'none');element.style.setProperty('--tray-icon-size',(size>=18?20:16)+'px');
      const wells=Array.from(element.querySelectorAll('[data-lunch-well]'));
      const fits=element.scrollHeight<=element.clientHeight+1&&element.scrollWidth<=element.clientWidth+1&&wells.every(well=>well.scrollHeight<=well.clientHeight+1&&well.scrollWidth<=well.clientWidth+1);
      result={fontSize:size,columns:5,icons,fits};if(fits){element.dataset.trayFit='fit';return result;}
    }
    element.dataset.trayFit='overflow';return result;
  }
  // Measure actual wrapping after fonts load. Try columns before making classroom text smaller.
  function fit(element,baseFont=20){
    if(!element||element.clientHeight<1||element.clientWidth<1)return null;
    if(element.classList?.contains('pk-lunch-tray'))return fitTray(element,baseFont);
    const maximum=Math.max(16,Math.min(28,Math.round(baseFont))),columns=element.clientWidth>=200&&element.children.length>3?[1,2]:[1];
    let result;
    for(let size=maximum;size>=11;size--){
      for(const count of columns){
        element.style.fontSize=size+'px';element.style.gridTemplateColumns=`repeat(${count},minmax(0,1fr))`;
        element.style.rowGap=(size>=16?7:4)+'px';element.style.lineHeight=size>=16?'1.45':'1.3';
        result={fontSize:size,columns:count,fits:element.scrollHeight<=element.clientHeight+1&&element.scrollWidth<=element.clientWidth+1};
        if(result.fits){element.dataset.columns=String(count);return result;}
      }
    }
    element.dataset.columns=String(result.columns);return result;
  }
  root.PicklingLunchLayout={clean,lines,fit,tray};
  if(typeof module!=='undefined')module.exports=root.PicklingLunchLayout;
})(typeof window==='undefined'?globalThis:window);
