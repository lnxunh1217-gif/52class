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
  root.PicklingScreenBalance={fitHero,PRESETS};
  if(typeof module!=='undefined')module.exports=root.PicklingScreenBalance;
})(typeof window==='undefined'?globalThis:window);
