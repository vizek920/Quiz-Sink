/* ============================================================
   app.js — الواجهة والتحكم (v2)
   ============================================================ */

let state = loadState();        // قد تكون null قبل بدء أي مباراة
let setupCfg = defaultConfig(); // إعدادات شاشة الإعداد المؤقتة
let setupNames = {};
let adminActiveCat = 'general';
let lastHandledEventId = null;
let lastPhaseSeen = null;
let lastRoundSeen = null;
let timerRAF = null;

/* ---------------- أدوات DOM ---------------- */
const $ = (id)=> document.getElementById(id);
function show(el){ el.classList.add('active'); }
function hide(el){ el.classList.remove('active'); }
function screens(){ return document.querySelectorAll('.screen'); }
function goto(screenId){
  screens().forEach(s=> s.classList.remove('active'));
  $(screenId).classList.add('active');
  const showTop = (screenId==='introScreen');
  $('globalTop').style.display = showTop ? 'flex' : 'none';
}

/* ---------------- i18n ---------------- */
function applyLang(){
  const dir = I18N[CURRENT_LANG].dir;
  document.documentElement.lang = CURRENT_LANG;
  document.documentElement.dir = dir;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  $('langAr').classList.toggle('active', CURRENT_LANG==='ar');
  $('langEn').classList.toggle('active', CURRENT_LANG==='en');
}

/* ---------------- خلفية ---------------- */
function spawnBubbles(){
  const f=$('bubbleField');
  for(let i=0;i<18;i++){
    const b=document.createElement('div'); b.className='bubble';
    const s=4+Math.random()*12; b.style.width=s+'px'; b.style.height=s+'px';
    b.style.left=Math.random()*100+'%';
    b.style.setProperty('--drift',(Math.random()*40-20)+'px');
    b.style.animationDuration=(7+Math.random()*8)+'s';
    b.style.animationDelay=(Math.random()*10)+'s';
    f.appendChild(b);
  }
}
spawnBubbles();

/* ============================================================
   شاشة التقديم + التنقل
   ============================================================ */
$('btnStartGame').onclick = ()=>{ openSetup(); };
$('btnAdmin').onclick = ()=>{ goto('adminLoginScreen'); $('adminPassInput').value=''; $('adminError').style.display='none'; };

$('langAr').onclick = ()=>{ setLang('ar'); applyLang(); refreshCurrentScreen(); };
$('langEn').onclick = ()=>{ setLang('en'); applyLang(); refreshCurrentScreen(); };

function refreshCurrentScreen(){
  if($('adminPanelScreen').classList.contains('active')){ renderAdminBank(); populateAdminCatSelect(); }
  if($('setupScreen').classList.contains('active')){ renderSetup(); }
  if($('gameScreen').classList.contains('active')){ renderGame(); }
}

/* ============================================================
   شاشة الأدمن
   ============================================================ */
$('btnAdminEnter').onclick = tryAdminLogin;
$('adminPassInput').onkeydown = (e)=>{ if(e.key==='Enter') tryAdminLogin(); };
$('btnAdminBack').onclick = ()=> goto('introScreen');
$('btnAdminExit').onclick = ()=> goto('introScreen');

function tryAdminLogin(){
  if($('adminPassInput').value === ADMIN_PASSWORD){
    goto('adminPanelScreen');
    if(!getCategory(adminActiveCat) && CATEGORIES.length) adminActiveCat=CATEGORIES[0].id;
    populateAdminCatSelect();
    renderAdminBank();
  } else {
    $('adminError').style.display='block';
  }
}
function populateAdminCatSelect(){
  const sel=$('adminCatSelect'); sel.innerHTML='';
  CATEGORIES.forEach(c=>{
    const o=document.createElement('option'); o.value=c.id; o.textContent=catLabel(c.id); sel.appendChild(o);
  });
}
function renderAdminBankCats(){
  const wrap=$('adminBankCats'); wrap.innerHTML='';
  CATEGORIES.forEach(c=>{
    const b=document.createElement('button');
    b.className='cat-btn'+(c.id===adminActiveCat?' active':'');
    b.textContent=catLabel(c.id)+' ('+c.questions.length+')';
    b.onclick=()=>{ adminActiveCat=c.id; renderAdminBank(); };
    wrap.appendChild(b);
  });
  // زر إضافة فئة جديدة
  const addBtn=document.createElement('button');
  addBtn.className='cat-btn'; addBtn.style.borderStyle='dashed';
  addBtn.textContent='+ '+t('add_category');
  addBtn.onclick=()=>{
    const nameAr=prompt(t('category_name_prompt'));
    if(nameAr && nameAr.trim()){
      const id=addCategory(nameAr.trim(), nameAr.trim());
      adminActiveCat=id;
      populateAdminCatSelect();
      renderAdminBank();
    }
  };
  wrap.appendChild(addBtn);
}
function renderAdminBank(){
  renderAdminBankCats();
  const cat=getCategory(adminActiveCat);
  const list=$('adminBankList'); list.innerHTML='';

  // شريط أدوات الفئة الحالية (إعادة تسمية / حذف الفئة)
  const catBar=$('adminCatBar');
  if(cat){
    catBar.style.display='flex';
    $('adminCatCurrentName').textContent=catLabel(cat.id);
  } else {
    catBar.style.display='none';
  }

  if(!cat){ list.innerHTML='<div class="p-hint">'+t('no_categories')+'</div>'; return; }

  cat.questions.forEach(item=>{
    const row=document.createElement('div');
    row.className='q-item';
    const left=document.createElement('div'); left.className='q-txt';
    left.innerHTML=`<div>${escapeHtml(item.q)}</div><div class="q-ans">${escapeHtml(item.a)}</div>`;
    const del=document.createElement('button'); del.className='del'; del.textContent='✕';
    del.onclick=()=>{ removeQuestion(adminActiveCat, item.id); renderAdminBank(); populateAdminCatSelect(); };
    row.appendChild(left); row.appendChild(del);
    list.appendChild(row);
  });
  if(cat.questions.length===0){ list.innerHTML='<div class="p-hint">—</div>'; }
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

$('btnAdminAdd').onclick = ()=>{
  const cat=$('adminCatSelect').value;
  const q=$('adminQInput').value.trim();
  const a=$('adminAInput').value.trim();
  if(!q||!a){ alert(t('fill_both')); return; }
  addQuestion(cat,q,a);
  $('adminQInput').value=''; $('adminAInput').value='';
  adminActiveCat=cat;
  renderAdminBank(); populateAdminCatSelect();
};
$('btnRenameCat').onclick = ()=>{
  const cat=getCategory(adminActiveCat); if(!cat) return;
  const newName=prompt(t('category_name_prompt'), cat.name_ar);
  if(newName && newName.trim()){
    renameCategory(adminActiveCat, newName.trim(), newName.trim());
    renderAdminBank(); populateAdminCatSelect();
  }
};
$('btnDeleteCat').onclick = ()=>{
  const cat=getCategory(adminActiveCat); if(!cat) return;
  if(!confirm(t('confirm_delete_cat').replace('{name}', catLabel(cat.id)))) return;
  removeCategory(adminActiveCat);
  adminActiveCat = CATEGORIES.length ? CATEGORIES[0].id : null;
  renderAdminBank(); populateAdminCatSelect();
};
$('btnExport').onclick = ()=>{
  const data=exportBankJSON();
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='ships-bank-backup.json';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
};
$('btnImport').onclick = ()=> $('importFile').click();
$('importFile').onchange = (e)=>{
  const file=e.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const replace = confirm(t('import_mode_prompt'));
      const res=importBankJSON(r.result, replace?'replace':'merge');
      if(!getCategory(adminActiveCat) && CATEGORIES.length) adminActiveCat=CATEGORIES[0].id;
      renderAdminBank(); populateAdminCatSelect();
      alert(t('imported_ok').replace('{n}', res.questions));
    }catch(err){ alert(t('import_fail')); }
  };
  r.readAsText(file,'utf-8'); e.target.value='';
};

/* ============================================================
   شاشة الإعداد
   ============================================================ */
function openSetup(){
  setupCfg = defaultConfig();
  setupNames = {};
  goto('setupScreen');
  renderSetup();
}
$('btnSetupBack').onclick = ()=> goto('introScreen');

function renderSetup(){
  // عدد الفرق
  const tc=$('teamsCountGroup'); tc.innerHTML='';
  [2,3,4].forEach(n=>{
    const p=document.createElement('button');
    p.className='pill'+(setupCfg.teamsCount===n?' active':'');
    p.textContent=n;
    p.onclick=()=>{ setupCfg.teamsCount=n; renderSetup(); };
    tc.appendChild(p);
  });
  // أسماء الفرق
  const ni=$('teamNameInputs'); ni.innerHTML='';
  for(let i=0;i<setupCfg.teamsCount;i++){
    const meta=TEAM_COLORS[i];
    const row=document.createElement('div'); row.className='tn-row';
    const dot=document.createElement('div'); dot.className='dot'; dot.style.background=meta.color;
    const inp=document.createElement('input'); inp.className='input'; inp.type='text'; inp.maxLength=24;
    inp.placeholder = CURRENT_LANG==='en'?meta.name_en:meta.name_ar;
    inp.value = setupNames[meta.key]||'';
    inp.oninput = ()=>{ setupNames[meta.key]=inp.value; };
    row.appendChild(dot); row.appendChild(inp); ni.appendChild(row);
  }
  // حجم اللوحة
  const bs=$('boardSizeGroup'); bs.innerHTML='';
  [4,5,6].forEach(n=>{
    const p=document.createElement('button');
    p.className='pill'+(setupCfg.boardSize===n?' active':'');
    p.textContent=n+'×'+n;
    p.onclick=()=>{ setupCfg.boardSize=n; renderSetup(); };
    bs.appendChild(p);
  });
  // نظام البطولة
  const bo=$('bestOfGroup'); bo.innerHTML='';
  [[1,t('single_round')],[3,t('best_of_n')+' 3'],[5,t('best_of_n')+' 5'],[7,t('best_of_n')+' 7']].forEach(([v,label])=>{
    const p=document.createElement('button');
    p.className='pill'+(setupCfg.bestOf===v?' active':'');
    p.textContent=label;
    p.onclick=()=>{ setupCfg.bestOf=v; renderSetup(); };
    bo.appendChild(p);
  });
  // المؤقّت
  const tog=$('timerToggle');
  tog.classList.toggle('on', setupCfg.timerOn);
  $('timerToggleLabel').textContent = setupCfg.timerOn ? t('timer_on') : t('timer_off');
  const secGroup=$('timerSecGroup');
  secGroup.style.display = setupCfg.timerOn ? 'flex':'none';
  secGroup.innerHTML='';
  [10,15,20,30].forEach(n=>{
    const p=document.createElement('button');
    p.className='pill'+(setupCfg.timerSeconds===n?' active':'');
    p.textContent=n+' '+t('seconds');
    p.onclick=()=>{ setupCfg.timerSeconds=n; renderSetup(); };
    secGroup.appendChild(p);
  });
}
$('timerToggle').onclick = ()=>{ setupCfg.timerOn=!setupCfg.timerOn; renderSetup(); };

$('btnStartPlaying').onclick = ()=>{
  setupCfg.lang = CURRENT_LANG;
  state = Game.newMatch(setupCfg, setupNames);
  goto('gameScreen');
  buildGrid();
  renderGame();
  // بوابة الصوت (تفعيل مرة واحدة)
  $('soundGate').classList.add('show');
};
$('btnEnableSound').onclick = ()=>{
  unlockAudio();
  $('soundGate').classList.remove('show');
  state = Game.nextQuestion(state); // أول سؤال تلقائيًا
  renderGame();
};

/* ============================================================
   شاشة اللعب
   ============================================================ */
function boardCols(){ return state ? state.config.boardSize : 4; }
function buildGrid(){
  const g=$('grid');
  const size=state.config.boardSize;
  g.style.gridTemplateColumns=`repeat(${size},minmax(46px,74px))`;
  g.style.gridTemplateRows=`repeat(${size},minmax(46px,74px))`;
  g.innerHTML='';
  for(let i=0;i<size*size;i++){
    const c=document.createElement('div'); c.className='cell'; c.dataset.i=i;
    g.appendChild(c);
  }
}
function cell(i){ return document.querySelector('.grid .cell[data-i="'+i+'"]'); }

function teamColor(k){ return state.teams[k] ? state.teams[k].color : '#ccc'; }
function teamName(k){ return state.teams[k] ? state.teams[k].name : k; }

/* ------ لوحة التحكم ------ */
$('btnNextQ').onclick = ()=>{ state=Game.nextQuestion(state); renderGame(); };
$('btnSkipQ').onclick = ()=>{ state=Game.skipQuestion(state); renderGame(); };
$('btnCorrect').onclick = ()=>{ state=Game.judge(state,true); renderGame(); };
$('btnWrong').onclick = ()=>{ state=Game.judge(state,false); renderGame(); };
$('btnNewRound').onclick = ()=>{
  if(state.phase!=='idle' && state.phase!=='round_over' && state.phase!=='match_over'){
    if(!confirm(t('confirm_new_round'))) return;
  }
  hideResults();
  state=Game.newRound(state); renderGame();
};
$('btnExitGame').onclick = ()=>{
  if(!confirm(t('confirm_exit'))) return;
  hideResults();
  goto('introScreen');
};
$('btnFullscreen').onclick = ()=>{
  if(!document.fullscreenElement){ document.documentElement.requestFullscreen?.(); }
  else { document.exitFullscreen?.(); }
};
$('btnMute').onclick = ()=>{
  setMuted(!isMuted());
  $('btnMute').textContent = isMuted()?'🔇':'🔊';
};

/* ------ الرندر الرئيسي ------ */
function renderGame(){
  if(!state) return;
  // شريط الجولة
  const roundTxt = state.config.bestOf>1
    ? `${t('round_label')} ${state.round} · ${t('best_of_n')} ${state.config.bestOf}`
    : `${t('round_label')} ${state.round}`;
  $('roundBadge').textContent = roundTxt;

  renderScoreboard();
  renderQuestionCard();
  renderBoard();
  renderPanel();
  renderTimer();
  handleEvent();
  handleRoundOrMatchOver();

  lastPhaseSeen=state.phase;
  lastRoundSeen=state.round;
}

function renderScoreboard(){
  const sb=$('scoreboard'); sb.innerHTML='';
  state.teamOrder.forEach((k,idx)=>{
    if(idx>0){ const vs=document.createElement('div'); vs.className='vs'; vs.textContent='VS'; sb.appendChild(vs); }
    const card=document.createElement('div'); card.className='score-card';
    const name=document.createElement('div'); name.className='score-name'; name.textContent=teamName(k); name.style.color=teamColor(k);
    const num=document.createElement('div'); num.className='score-num'; num.id='scoreNum_'+k; num.textContent=Game.scoreOf(state,k); num.style.color=teamColor(k);
    const pips=document.createElement('div'); pips.className='pips';
    for(let p=0;p<state.winTarget;p++){
      const pip=document.createElement('div'); pip.className='pip';
      if(p<Game.scoreOf(state,k)){ pip.style.background=teamColor(k); pip.style.borderColor=teamColor(k); pip.style.boxShadow='0 0 10px '+teamColor(k); }
      pips.appendChild(pip);
    }
    card.appendChild(name); card.appendChild(num); card.appendChild(pips);
    if(state.config.bestOf>1){
      const rw=document.createElement('div'); rw.className='rounds-won';
      rw.innerHTML=`${t('stat_rounds_won')}: <b>${state.teams[k].roundsWon}</b>`;
      card.appendChild(rw);
    }
    sb.appendChild(card);
  });
}

function renderQuestionCard(){
  const qcard=$('qcard');
  const pills=$('buzzPills'); pills.innerHTML='';
  state.teamOrder.forEach(k=>{
    const pill=document.createElement('div');
    pill.className='buzz-pill';
    const isActive = state.activeTeam===k && (state.phase==='judging'||state.phase==='attacking');
    if(isActive){ pill.classList.add('active'); pill.style.background=teamColor(k); pill.style.borderColor='transparent'; }
    pill.textContent=teamName(k);
    pills.appendChild(pill);
  });

  let displayText;
  if(state.questionText==='__NO_QUESTIONS__'){ displayText=t('no_questions_left'); }
  else if(state.phase==='idle' || !state.questionText){ displayText=t('waiting_question'); }
  else { displayText=state.questionText; }

  if(qcard.dataset.shown !== displayText || lastPhaseSeen!==state.phase){
    qcard.classList.remove('show');
    setTimeout(()=>{
      $('qtext').textContent=displayText;
      qcard.dataset.shown=displayText;
      void qcard.offsetWidth;
      qcard.classList.add('show');
    }, 260);
  }
}

function renderBoard(){
  const size=state.config.boardSize;
  // إعادة بناء الشبكة إذا تغيّر الحجم
  if($('grid').children.length !== size*size){ buildGrid(); }
  for(let i=0;i<size*size;i++){
    const c=cell(i); if(!c) continue;
    const rv=state.revealed[String(i)];
    c.className='cell'; c.innerHTML='';
    if(rv==='hit1'||rv==='hit2'){
      c.classList.add(rv);
      const shipArr = rv==='hit1'?state.ship1:state.ship2;
      const sunk = shipArr.every(cc=> state.revealed[String(cc)] && state.revealed[String(cc)]!=='miss');
      if(sunk) c.classList.add('sunk'+(rv==='hit1'?1:2));
      const badge=document.createElement('div'); badge.className='ship-badge';
      badge.textContent = rv==='hit1'?'١':'٢';
      c.appendChild(badge);
    } else if(rv==='miss'){ c.classList.add('miss'); }
    else if(state.phase==='attacking'){
      c.classList.add('clickable');
      c.onclick=()=> attackClick(i);
    }
  }
}

function attackClick(i){
  if(state.phase!=='attacking') return;
  const wasHit = state.ship1.includes(i)||state.ship2.includes(i);
  state=Game.attackCell(state,i);
  if(wasHit){
    Sound.hit();
    const rv=state.revealed[String(i)];
    const shipArr=rv==='hit1'?state.ship1:state.ship2;
    const sunk=shipArr.every(cc=> state.revealed[String(cc)] && state.revealed[String(cc)]!=='miss');
    if(sunk) setTimeout(()=>Sound.sunk(),200);
  } else { Sound.miss(); }
  renderGame();
}

function renderPanel(){
  const canPickQuestion = (state.phase==='idle');
  $('btnNextQ').disabled = !canPickQuestion;
  $('btnSkipQ').disabled = (state.phase==='round_over'||state.phase==='match_over');

  // بطاقة البزّ
  const showBuzz = (state.phase==='question'||state.phase==='judging_other');
  $('buzzCard').style.display = showBuzz?'block':'none';
  if(showBuzz){
    const row=$('buzzRow'); row.innerHTML='';
    const remaining = state.phase==='judging_other' ? (state.__remaining||[]) : state.teamOrder;
    state.teamOrder.forEach(k=>{
      const btn=document.createElement('button');
      btn.className='buzz-btn-p';
      btn.style.borderColor=teamColor(k);
      btn.textContent=teamName(k)+' 🔔';
      btn.disabled = !remaining.includes(k);
      btn.onclick=()=>{ unlockAudio(); Sound.buzz(); state=Game.buzz(state,k); renderGame(); };
      row.appendChild(btn);
    });
  }

  // بطاقة الحكم
  $('judgeCard').style.display = state.phase==='judging'?'block':'none';
  if(state.phase==='judging'){
    $('judgeLabel').textContent = teamName(state.activeTeam)+' — '+t('judging');
  }

  // بطاقة الهجوم
  $('attackCard').style.display = state.phase==='attacking'?'block':'none';
  if(state.phase==='attacking'){
    $('attackLabel').textContent = teamName(state.activeTeam)+' — '+t('attack_hint');
  }
}

/* ------ المؤقّت ------ */
function renderTimer(){
  const bar=$('timerBar'), fill=$('timerFill');
  if(timerRAF){ cancelAnimationFrame(timerRAF); timerRAF=null; }
  if(state.phase==='question' && state.config.timerOn && state.timerEndsAt){
    bar.classList.add('show');
    const total=state.config.timerSeconds*1000;
    let lastTickSec=null;
    const tick=()=>{
      const left=state.timerEndsAt-Date.now();
      const pct=Math.max(0, Math.min(100, (left/total)*100));
      fill.style.width=pct+'%';
      const sec=Math.ceil(left/1000);
      if(sec!==lastTickSec && sec<=5 && sec>0){ Sound.tick(); lastTickSec=sec; }
      if(left<=0){
        Sound.timeup();
        state=Game.timeUp(state);
        renderGame();
        return;
      }
      if(state.phase==='question'){ timerRAF=requestAnimationFrame(tick); }
    };
    timerRAF=requestAnimationFrame(tick);
  } else {
    bar.classList.remove('show');
    fill.style.width='100%';
  }
}

/* ------ الأحداث الفورية (إصابة/غرق/خطأ/وقت) ------ */
function handleEvent(){
  if(!state.lastEvent || state.lastEvent.id===lastHandledEventId) return;
  lastHandledEventId=state.lastEvent.id;
  const ev=state.lastEvent;
  if(ev.type==='hit'||ev.type==='sunk'){
    const c=cell(ev.idx);
    if(c){ const rip=document.createElement('div'); rip.className='ripple'; rip.style.borderColor=teamColor(ev.team); c.appendChild(rip); setTimeout(()=>rip.remove(),650); }
    const numEl=$('scoreNum_'+ev.team);
    if(numEl){ numEl.classList.remove('pulse'); void numEl.offsetWidth; numEl.classList.add('pulse'); }
    // اهتزاز الشاشة عند الإصابة
    const gm=document.querySelector('.game-main');
    if(gm){ gm.classList.remove('shake'); void gm.offsetWidth; gm.classList.add('shake'); }
    showBanner(ev.type==='sunk' ? t('ship_sunk')+' 🌊' : t('hit')+' 🎯 '+teamName(ev.team));
  } else if(ev.type==='timeup'){
    showBanner(t('time_up')+' ⏰');
  }
}

function showBanner(text){
  const b=$('banner'); b.textContent=text;
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
}

/* ------ نهاية الجولة / المباراة ------ */
function handleRoundOrMatchOver(){
  if(state.phase==='round_over'){
    if($('results').dataset.shownRound !== (state.id+'_'+state.round)){
      $('results').dataset.shownRound = state.id+'_'+state.round;
      showRoundResult();
    }
  } else if(state.phase==='match_over'){
    if($('results').dataset.shownMatch !== state.id){
      $('results').dataset.shownMatch = state.id;
      showMatchResult();
    }
  }
}

function showRoundResult(){
  // في نظام "أفضل من N": الجولة انتهت لكن المباراة مستمرة → لافتة فقط ثم جولة جديدة يدويًا
  const w=state.roundWinner;
  showBanner('🏆 '+teamName(w)+' '+t('wins_round'));
  Sound.win();
  fireConfetti(60);
}

function showMatchResult(){
  const w=state.matchWinner;
  const res=$('results');
  $('rTeam').textContent = teamName(w);
  $('rTeam').style.color = teamColor(w);
  $('rSub').textContent = state.config.bestOf>1 ? t('wins_match') : (t('final_score')+': '+state.finalScoreText);

  // إحصائيات عامة
  const acc = state.stats.attempts>0 ? Math.round((state.stats.hits/state.stats.attempts)*100) : 0;
  $('rStats').innerHTML = `
    <div class="stat-box"><div class="sv">${state.stats.questionsShown}</div><div class="sl">${t('stat_questions')}</div></div>
    <div class="stat-box"><div class="sv">${state.stats.hits}</div><div class="sl">${t('stat_hits')}</div></div>
    <div class="stat-box"><div class="sv">${acc}%</div><div class="sl">${t('stat_accuracy')}</div></div>
  `;

  // إحصائيات لكل فريق
  let rows='';
  state.teamOrder.forEach(k=>{
    const pt=state.stats.perTeam[k]||{hits:0,attempts:0,roundsWon:0};
    const a= pt.attempts>0 ? Math.round((pt.hits/pt.attempts)*100):0;
    rows+=`<div class="team-stat-row"><span class="tdot" style="background:${teamColor(k)}"></span>
      <b style="color:${teamColor(k)}">${teamName(k)}</b> —
      ${t('stat_hits')}: ${pt.hits} · ${t('stat_accuracy')}: ${a}%${state.config.bestOf>1?' · '+t('stat_rounds_won')+': '+pt.roundsWon:''}</div>`;
  });
  $('rTeamStats').innerHTML = rows;

  res.classList.add('show');
  Sound.win();
  fireConfetti(120);
  fireFireworks();
}

function hideResults(){ $('results').classList.remove('show'); }

$('btnPlayAgain').onclick = ()=>{ hideResults(); goto('setupScreen'); renderSetup(); };

/* ------ كونفيتي + ألعاب نارية ------ */
function fireConfetti(count){
  const colors=['#4fd8c4','#f2b84b','#f2704f','#b78cf2','#8ad15a'];
  const host=$('results').classList.contains('show') ? $('results') : document.body;
  for(let i=0;i<count;i++){
    const c=document.createElement('div'); c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.background=colors[i%colors.length];
    c.style.animationDuration=(2+Math.random()*2)+'s';
    c.style.animationDelay=(Math.random()*0.8)+'s';
    c.style.transform='rotate('+(Math.random()*360)+'deg)';
    host.appendChild(c);
    setTimeout(()=>c.remove(),4500);
  }
}
function fireFireworks(){
  const host=$('results');
  const colors=['#4fd8c4','#f2b84b','#f2704f','#b78cf2'];
  let bursts=0;
  const burst=()=>{
    if(bursts>=5 || !host.classList.contains('show')) return;
    bursts++;
    const cx=15+Math.random()*70, cy=20+Math.random()*40;
    const color=colors[bursts%colors.length];
    for(let i=0;i<26;i++){
      const s=document.createElement('div'); s.className='spark';
      s.style.left=cx+'%'; s.style.top=cy+'%'; s.style.background=color;
      const ang=(Math.PI*2*i)/26, dist=60+Math.random()*70;
      s.style.setProperty('--dx',Math.cos(ang)*dist+'px');
      s.style.setProperty('--dy',Math.sin(ang)*dist+'px');
      s.style.animationDuration=(0.8+Math.random()*0.5)+'s';
      host.appendChild(s);
      setTimeout(()=>s.remove(),1400);
    }
    setTimeout(burst, 500+Math.random()*400);
  };
  burst();
}

/* ============================================================
   المزامنة بين التبويبات (شاشة عرض إضافية على جهاز واحد)
   ============================================================ */
subscribeState((incoming)=>{
  state=incoming;
  if($('gameScreen').classList.contains('active')){ renderGame(); }
});

/* ============================================================
   الإقلاع
   ============================================================ */
applyLang();
goto('introScreen');
