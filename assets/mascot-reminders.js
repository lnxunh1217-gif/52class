(function(root){'use strict';
function context(now){const parts=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now),v=Object.fromEntries(parts.map(p=>[p.type,p.value]));const date=v.year+'-'+v.month+'-'+v.day;return {date,weekday:new Date(date+'T12:00:00Z').getUTCDay(),minute:Number(v.hour)*60+Number(v.minute)};}
function active(now=new Date()){
 const {date,weekday,minute}=context(now),items=[];if(weekday===0||weekday===6)return {date,items};
 if(minute>=510&&minute<540){items.push({id:'morning',text:'오늘의 준비를 체크하세요!'});if(weekday===5)items.push({id:'english',text:'오늘은 영어 단어 시험이 있어요!'});}
 if(minute>=720&&minute<780)items.push({id:'lunch',text:'오늘의 직업, 모둠 역할, 청소를 체크하세요!'});
 if(weekday===5&&minute>=720)items.push({id:'tidy',text:'오늘은 정리정돈 검사하는 날이에요!'});
 if(weekday===2&&minute>=780)items.push({id:'mata',text:'내일(수요일) 아침 활동은 마타수학이에요!'});
 if(minute>=840)items.push({id:'home',text:'오늘의 실천 약속과 태블릿 충전을 체크하세요!'});
 return {date,items};
}
root.PicklingMascotReminders={active,context};
})(typeof window==='undefined'?globalThis:window);
