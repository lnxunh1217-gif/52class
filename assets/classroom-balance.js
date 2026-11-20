(function(root){'use strict';
  const PRESETS=[
    {name:'roomy',clock:56,body:24,word:26,title:23,meaning:17,gap:12,pad:14},
    {name:'regular',clock:48,body:20,word:22,title:21,meaning:16,gap:10,pad:12},
    {name:'compact',clock:42,body:18,word:18,title:19,meaning:14,gap:8,pad:10},
    {name:'short',clock:38,body:16,word:16,title:17,meaning:13,gap:6,pad:8}
  ];
  function fitHero(box,content){
    if(!box||!content||box.clientHeight<1||box.clientWidth<1)return null;
    const computed=root.getComputedStyle?.(box),available=box.clientHeight-(parseFloat(computed?.paddingTop)||0)-(parseFloat(computed?.paddingBottom)||0);
    let result;
    for(const preset of PRESETS){
      for(const key of ['clock','body','word','title','meaning','gap','pad'])box.style.setProperty('--hero-'+key,preset[key]+'px');
      const fits=content.scrollHeight<=available+1&&content.scrollWidth<=box.clientWidth+1;
      result={name:preset.name,fits};box.dataset.balance=preset.name;
      if(fits)return result;
    }
    return result;
  }
  function fitClock(face,digits){
    if(!face||!digits||face.clientWidth<1||face.clientHeight<1)return null;
    const style=root.getComputedStyle?.(face)||{},num=v=>parseFloat(v)||0;
    face.style.setProperty('--clock-visual',Math.round(Math.max(32,Math.min(90,face.clientHeight*.18)))+'px');
    const others=Array.from(face.children).filter(child=>child!==digits);
    const fixed=others.reduce((sum,child)=>{const s=root.getComputedStyle?.(child)||{};return sum+child.offsetHeight+num(s.marginTop)+num(s.marginBottom);},0);
    const availableWidth=face.clientWidth-num(style.paddingLeft)-num(style.paddingRight);
    const availableHeight=face.clientHeight-num(style.paddingTop)-num(style.paddingBottom)-fixed-num(style.rowGap||style.gap)*(face.children.length-1);
    let size=Math.max(12,Math.min(180,Math.floor(availableHeight/1.5)));
    digits.style.fontSize=size+'px';
    for(let i=0;i<2;i++){
      const ratio=Math.min(1,availableWidth/Math.max(1,digits.scrollWidth),availableHeight/Math.max(1,digits.scrollHeight));
      if(ratio>=1)break;
      size=Math.max(12,Math.floor(size*Math.max(0,ratio)));digits.style.fontSize=size+'px';
    }
    const fits=digits.scrollWidth<=availableWidth+1&&digits.scrollHeight<=availableHeight+1;
    face.dataset.clockFit=fits?'fit':'overflow';return {size,fits};
  }
  root.PicklingScreenBalance={fitHero,fitClock,PRESETS};
  if(typeof module!=='undefined')module.exports=root.PicklingScreenBalance;
})(typeof window==='undefined'?globalThis:window);
