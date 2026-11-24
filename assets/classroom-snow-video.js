// 겨울 테마(winter-snow) 배경: Higgsfield로 만든 "눈 내리는 교실 창문" 5초 영상을 화면 맨 뒤에 반복 재생해요.
// 캐릭터는 없는 장소 영상이에요. 원본: pickling-retro/art-originals/higgsfield/classroom-snow.mp4
// 화면 설정의 '눈 움직임'(.pk-snow-layer[data-motion])을 그대로 따라요: 켜져 있으면 재생, 꺼져 있으면 첫 장면 사진만 보여요.
// (기기의 '움직임 줄이기'는 이 설정이 이미 반영해요. 선생님이 직접 켜면 그 설정이 우선이에요.)
(function(root){
  const doc=root.document;if(!doc)return;
  const BASE='assets/motion/classroom-snow';
  let wanted=false;
  const tryPlay=v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{});};
  function make(){
    const v=doc.createElement('video');v.className='pk-snow-video';v.poster=BASE+'.jpg';
    [['.webm','video/webm'],['.mp4','video/mp4']].forEach(([ext,type])=>{const s=doc.createElement('source');s.src=BASE+ext;s.type=type;v.appendChild(s);});
    v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.preload='auto';
    v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.tabIndex=-1;
    // The clip may not be ready on the first try: play again as soon as it can.
    v.addEventListener('canplay',()=>{if(wanted&&v.paused)tryPlay(v);});
    return v;
  }
  function sync(){
    doc.querySelectorAll('[data-theme]').forEach(box=>{
      let v=box.querySelector(':scope > .pk-snow-video');
      if(box.dataset.theme!=='winter-snow'){v?.remove();return;}
      if(!v){v=make();box.insertBefore(v,box.firstChild);}
      const moving=!!box.querySelector('.pk-snow-layer[data-motion="true"]');wanted=moving;
      if(moving&&v.paused)tryPlay(v);
      if(!moving&&!v.paused)v.pause();
    });
  }
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;sync();},60);};
  // If the browser held autoplay back, the first tap or key on the screen starts it.
  const nudge=()=>{doc.querySelectorAll('.pk-snow-video').forEach(v=>{if(wanted&&v.paused)tryPlay(v);});};
  const start=()=>{new MutationObserver(schedule).observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-theme','data-motion']});
    doc.addEventListener('pointerdown',nudge,true);doc.addEventListener('keydown',nudge,true);sync();};
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start);else start();
})(typeof window==='undefined'?globalThis:window);
