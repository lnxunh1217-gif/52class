(function(root){'use strict';
  function clean(text){return String(text||'').replace(/^\s*오늘의\s*식단\s*\(\s*\d{1,2}\s*\/\s*\d{1,2}\s*\)[ \t]*(?:\r?\n|$)/,'').trim();}
  function lines(text){return clean(text).split(/\r?\n/).map(line=>line.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean);}
  // Measure actual wrapping after fonts load. Try columns before making classroom text smaller.
  function fit(element,baseFont=20){
    if(!element||element.clientHeight<1||element.clientWidth<1)return null;
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
  root.PicklingLunchLayout={clean,lines,fit};
  if(typeof module!=='undefined')module.exports=root.PicklingLunchLayout;
})(typeof window==='undefined'?globalThis:window);
