(function(root){'use strict';
const normalized=name=>String(name||'').replace(/^\s*\d+\s*[.번)\-:]?\s*/,'').trim();
function create({getFrame,origin,onStatus,onTemp,onMemo,onDisconnect}){
 let ready=false,lastTemp=null,pendingLife=null,words=null,sentWords=null,wordTimer=0;const requests=new Map(),memoRequests=new Map();
 const validMemo=memo=>memo&&typeof memo.text==='string'&&memo.text.length<=1500&&Number.isSafeInteger(memo.revision)&&memo.revision>=0&&(memo.date===''||/^\d{4}-\d{2}-\d{2}$/.test(memo.date));
 // 이번 주 영어 단어 → 피클링 영어단어 익히기: sent once the card is connected and again whenever the list changes.
 const sendWords=()=>{if(ready&&typeof words==='string'&&words!==sentWords&&post({type:'board-words',text:words}))sentWords=words;};
 const post=data=>{const target=getFrame();if(!target)return false;target.postMessage(data,origin);return true;};
 function message(event){
  if(event.origin!==origin||event.source!==getFrame()||!event.data)return;
  const msg=event.data;
  if(msg.type==='pickling-memo'&&validMemo(msg.memo)){onMemo?.(msg.memo);return;}
  if(msg.type==='pickling-memo-result'){const done=memoRequests.get(msg.id);if(done){memoRequests.delete(msg.id);done({ok:msg.ok===true&&validMemo(msg.memo),message:String(msg.message||''),memo:msg.memo});}return;}
  if(msg.type==='pickling-warning-result'){const done=requests.get(msg.id);if(done){requests.delete(msg.id);done({ok:msg.ok===true,message:String(msg.message||'')});}return;}
  if(msg.type==='pickling-disconnected'){ready=false;sentWords=null;onDisconnect?.();return;}
  if(msg.type==='pickling-temp'&&Number.isInteger(msg.value)&&msg.value>=0&&msg.value<=100){lastTemp=msg.value;onTemp(msg.value);return;}
  if(msg.type!=='pickling-status'||!/^\d{4}-\d{2}-\d{2}$/.test(msg.date)||!Array.isArray(msg.warnings))return;
  if(!Number.isInteger(msg.books)||msg.books<0||!Number.isInteger(msg.letters)||msg.letters<0)return;
  const warnings=msg.warnings.filter(r=>Number.isInteger(r.number)&&r.number>=1&&r.number<=18&&typeof r.name==='string'&&r.name.length<=40&&Number.isInteger(r.count)&&r.count>=0);
  ready=true;onStatus({date:msg.date,books:msg.books,booksMore:!!msg.booksMore,letters:msg.letters,suggestions:Number.isSafeInteger(msg.suggestions)&&msg.suggestions>=0?msg.suggestions:0,reasons:Array.isArray(msg.reasons)?msg.reasons.filter(r=>typeof r.id==='string'&&typeof r.label==='string'):[],warnings});
  if(pendingLife){post(pendingLife);pendingLife=null;}
  sendWords();
 }
 root.addEventListener('message',message);
 return {temp(value){if(ready&&value!==lastTemp&&Number.isInteger(value)&&value>=0&&value<=100){lastTemp=value;post({type:'board-temp',value});}},
  openHome(){const data={type:'board-home'};if(!ready||!post(data))pendingLife=data;},
  saveMemo(fields){return new Promise(resolve=>{if(!ready){resolve({ok:false,message:'피클링 카드에 먼저 교사 계정으로 로그인해 주세요.'});return;}const id=root.crypto.randomUUID();const timer=root.setTimeout(()=>{memoRequests.delete(id);resolve({ok:false,message:'저장 확인이 늦어요. 같은 내용으로 다시 눌러 주세요.'});},15000);memoRequests.set(id,result=>{root.clearTimeout(timer);resolve(result);});if(!post({...fields,type:'board-memo-save',id})){root.clearTimeout(timer);memoRequests.delete(id);resolve({ok:false,message:'피클링 카드를 열어 주세요.'});}});},
  openSuggestions(){if(ready)post({type:'board-suggestions-open'});},
  openLife(number){const data={type:'board-life-open',number};if(!ready||!post(data))pendingLife=data;},
  recordWarning(fields){return new Promise(resolve=>{if(!ready){resolve({ok:false,message:'피클링 카드에 먼저 로그인해 주세요.'});return;}const timeout=root.setTimeout(()=>{requests.delete(fields.id);resolve({ok:false,message:'저장 응답이 늦어요. 같은 사유를 다시 눌러 주세요.'});},15000);requests.set(fields.id,result=>{root.clearTimeout(timeout);resolve(result);});if(!post({type:'board-warning-add',...fields})){root.clearTimeout(timeout);requests.delete(fields.id);resolve({ok:false,message:'피클링 카드를 열어 주세요.'});}});},
  undoWarning(number,id,revision){const data={type:'board-warning-undo',number,id,revision};if(!ready||!post(data))pendingLife=data;},
  words(text){words=String(text||'');root.clearTimeout(wordTimer);wordTimer=root.setTimeout(sendWords,1500);},
  refresh(){if(ready)post({type:'board-refresh'});},destroy(){for(const done of memoRequests.values())done({ok:false,message:'연결이 종료됐어요. 내용을 확인해 주세요.'});memoRequests.clear();root.clearTimeout(wordTimer);root.removeEventListener('message',message);}};
}
root.PicklingScreenBridge={create,normalized};
})(typeof window==='undefined'?globalThis:window);
