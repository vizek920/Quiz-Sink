/* ============================================================
   لعبة السفن والأسئلة — النواة (v2)
   المرحلة الأولى: يعمل بالكامل داخل المتصفح (بدون سيرفر)
   ============================================================ */

/* ====================== الإعدادات القابلة للتعديل ====================== */
const ADMIN_PASSWORD = "vizek2026";   // ← غيّر كلمة مرور الأدمن من هنا

const STORAGE_KEY   = 'bsq2_state';
const CUSTOM_KEY    = 'bsq2_custom_questions';
const CHANNEL_NAME  = 'bsq2_channel';
const LANG_KEY      = 'bsq2_lang';

/* لوحة الألوان الثابتة لكل فريق (تدعم حتى 4 فرق) */
const TEAM_COLORS = [
  { key:'a', color:'#4fd8c4', name_ar:'الفريق الأول',  name_en:'Team 1' },
  { key:'b', color:'#f2704f', name_ar:'الفريق الثاني', name_en:'Team 2' },
  { key:'c', color:'#b78cf2', name_ar:'الفريق الثالث', name_en:'Team 3' },
  { key:'d', color:'#8ad15a', name_ar:'الفريق الرابع', name_en:'Team 4' },
];

/* ====================== الترجمة (عربي / إنجليزي) ====================== */
const I18N = {
  ar: {
    dir:'rtl',
    game_title:'لعبة السفن والأسئلة',
    tagline:'لوحة واحدة… سباق واحد… فريق واحد يفوز',
    start_game:'بدء لعبة جديدة',
    admin_panel:'لوحة الأدمن',
    back:'رجوع',
    admin_login:'دخول الأدمن',
    password:'كلمة المرور',
    enter:'دخول',
    wrong_password:'كلمة المرور غير صحيحة',
    question_bank:'بنك الأسئلة',
    add_question:'أضف سؤالك الخاص',
    category:'الفئة',
    question_text:'نص السؤال',
    correct_answer:'الإجابة الصحيحة',
    add_to_bank:'إضافة إلى البنك',
    no_custom:'لم تُضف أي أسئلة خاصة بعد',
    export_backup:'تصدير نسخة احتياطية',
    import_backup:'استيراد نسخة',
    backup_hint:'نزّل ملف الأسئلة واحتفظ به — يضمن رجوع أسئلتك في أي جهاز.',
    setup_title:'إعداد المباراة',
    teams_count:'عدد الفرق',
    team_names:'أسماء الفرق',
    board_size:'حجم اللوحة',
    timer:'مؤقّت الإجابة',
    timer_on:'مفعّل',
    timer_off:'متوقف',
    seconds:'ثانية',
    best_of:'نظام البطولة',
    single_round:'جولة واحدة',
    best_of_n:'أفضل من',
    language:'اللغة',
    start:'ابدأ اللعب',
    waiting_question:'بانتظار بدء الدور…',
    round_question:'سؤال الجولة',
    next_question:'السؤال التالي',
    skip:'تخطّي',
    show_answer:'إظهار الإجابة',
    hide_answer:'إخفاء الإجابة',
    who_buzzed:'من بزّ أولًا؟',
    correct:'صحيحة',
    wrong:'خاطئة',
    judging:'يحاول الإجابة الآن',
    attack_hint:'اضغط أي مربع على اللوحة',
    new_round:'جولة جديدة',
    fullscreen:'ملء الشاشة',
    exit_game:'خروج',
    shared_board:'اللوحة المشتركة — أول فريق يجمع النقاط المطلوبة يفوز',
    ship1_legend:'سفينة ١',
    ship2_legend:'سفينة ٢',
    hit:'إصابة!',
    ship_sunk:'غرقت السفينة!',
    time_up:'انتهى الوقت!',
    wins_round:'يفوز بالجولة!',
    wins_match:'بطل المباراة!',
    final_score:'النتيجة النهائية',
    round_label:'الجولة',
    stats_title:'إحصائيات المباراة',
    stat_questions:'الأسئلة المعروضة',
    stat_hits:'الإصابات',
    stat_accuracy:'دقة الهجوم',
    stat_rounds_won:'الجولات المكسوبة',
    play_again:'مباراة جديدة',
    mute:'كتم الصوت',
    unmute:'تشغيل الصوت',
    enable_sound:'اضغط لبدء اللعبة',
    no_questions_left:'انتهت كل الأسئلة! أضف المزيد من لوحة الأدمن',
    confirm_new_round:'إنهاء الجولة الحالية وبدء جولة جديدة؟',
    confirm_exit:'الخروج سيُنهي المباراة الحالية — متابعة؟',
    imported_ok:'تم استيراد {n} سؤال جديد',
    imported_dup:'كل الأسئلة موجودة مسبقًا',
    import_fail:'تعذّر قراءة الملف',
    fill_both:'اكتب نص السؤال والإجابة',
    to_win:'نقاط الفوز',
    points:'نقطة',
  },
  en: {
    dir:'ltr',
    game_title:'Ships & Questions',
    tagline:'One board… one race… one team wins',
    start_game:'Start New Game',
    admin_panel:'Admin Panel',
    back:'Back',
    admin_login:'Admin Login',
    password:'Password',
    enter:'Enter',
    wrong_password:'Incorrect password',
    question_bank:'Question Bank',
    add_question:'Add Your Own Question',
    category:'Category',
    question_text:'Question text',
    correct_answer:'Correct answer',
    add_to_bank:'Add to Bank',
    no_custom:'No custom questions added yet',
    export_backup:'Export Backup',
    import_backup:'Import Backup',
    backup_hint:'Download your questions file and keep it — restores your questions on any device.',
    setup_title:'Match Setup',
    teams_count:'Number of Teams',
    team_names:'Team Names',
    board_size:'Board Size',
    timer:'Answer Timer',
    timer_on:'On',
    timer_off:'Off',
    seconds:'sec',
    best_of:'Tournament',
    single_round:'Single Round',
    best_of_n:'Best of',
    language:'Language',
    start:'Start Playing',
    waiting_question:'Waiting for the round…',
    round_question:'Round Question',
    next_question:'Next Question',
    skip:'Skip',
    show_answer:'Show Answer',
    hide_answer:'Hide Answer',
    who_buzzed:'Who buzzed first?',
    correct:'Correct',
    wrong:'Wrong',
    judging:'is answering now',
    attack_hint:'Tap any cell on the board',
    new_round:'New Round',
    fullscreen:'Fullscreen',
    exit_game:'Exit',
    shared_board:'Shared board — first team to reach the target score wins',
    ship1_legend:'Ship 1',
    ship2_legend:'Ship 2',
    hit:'Hit!',
    ship_sunk:'Ship sunk!',
    time_up:'Time up!',
    wins_round:'wins the round!',
    wins_match:'Match Champion!',
    final_score:'Final Score',
    round_label:'Round',
    stats_title:'Match Statistics',
    stat_questions:'Questions Shown',
    stat_hits:'Hits',
    stat_accuracy:'Attack Accuracy',
    stat_rounds_won:'Rounds Won',
    play_again:'New Match',
    mute:'Mute',
    unmute:'Unmute',
    enable_sound:'Click to start',
    no_questions_left:'All questions used! Add more from the Admin Panel',
    confirm_new_round:'End current round and start a new one?',
    confirm_exit:'Exiting will end the current match — continue?',
    imported_ok:'Imported {n} new questions',
    imported_dup:'All questions already exist',
    import_fail:'Could not read the file',
    fill_both:'Enter both question and answer',
    to_win:'Points to win',
    points:'pts',
  }
};

let CURRENT_LANG = (function(){
  try{ return localStorage.getItem(LANG_KEY) || 'ar'; }catch(e){ return 'ar'; }
})();
function t(key){ return (I18N[CURRENT_LANG] && I18N[CURRENT_LANG][key]) || key; }
function setLang(lang){
  CURRENT_LANG = lang;
  try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
}

/* ====================== بنك الأسئلة ====================== */
const QUESTION_BANK = {
  general: { label_ar:'عام', label_en:'General', questions:[
    { q:'ما هي أكبر قارة في العالم من حيث المساحة؟', a:'قارة آسيا' },
    { q:'ما هو أطول نهر في العالم؟', a:'نهر النيل' },
    { q:'ما هي عاصمة اليابان؟', a:'طوكيو' },
    { q:'كم عدد قارات العالم؟', a:'سبع قارات' },
    { q:'ما هي أصغر دولة في العالم من حيث المساحة؟', a:'الفاتيكان' },
    { q:'ما هي عاصمة أستراليا؟', a:'كانبرا' },
    { q:'ما هو أعلى جبل في العالم؟', a:'جبل إفرست' },
    { q:'ما هي أكبر صحراء حارة في العالم؟', a:'الصحراء الكبرى' },
    { q:'في أي قارة تقع أهرامات الجيزة؟', a:'قارة أفريقيا (مصر)' },
    { q:'ما هي أكبر دولة في العالم من حيث المساحة؟', a:'روسيا' },
    { q:'ما اسم أطول سور بناه الإنسان؟', a:'سور الصين العظيم' },
    { q:'ما اسم أشهر برج في باريس؟', a:'برج إيفل' },
  ]},
  sports: { label_ar:'رياضة', label_en:'Sports', questions:[
    { q:'كم عدد لاعبي فريق كرة القدم داخل الملعب؟', a:'أحد عشر لاعبًا' },
    { q:'في أي مدينة أُقيمت أول دورة أولمبية حديثة؟', a:'أثينا' },
    { q:'كل كم سنة تُقام الأولمبياد الصيفية؟', a:'كل أربع سنوات' },
    { q:'ما اسم كأس أبطال أوروبا لكرة القدم؟', a:'دوري أبطال أوروبا' },
    { q:'كم عدد لاعبي الكرة الطائرة داخل الملعب؟', a:'ستة لاعبين' },
    { q:'ما الدولة المضيفة لكأس العالم 2022؟', a:'قطر' },
    { q:'في أي رياضة تُقام بطولة ويمبلدون؟', a:'التنس' },
    { q:'كم عدد حلقات الشعار الأولمبي؟', a:'خمس حلقات' },
    { q:'ما اسم أشهر سباق دراجات في فرنسا؟', a:'طواف فرنسا' },
  ]},
  science: { label_ar:'علوم', label_en:'Science', questions:[
    { q:'ما هو الكوكب الأقرب إلى الشمس؟', a:'عطارد' },
    { q:'ما الغاز الذي يتنفسه الإنسان للحياة؟', a:'الأكسجين' },
    { q:'من مخترع المصباح الكهربائي؟', a:'توماس إديسون' },
    { q:'ما الرمز الكيميائي للماء؟', a:'H2O' },
    { q:'من صاحب نظرية الجاذبية؟', a:'إسحاق نيوتن' },
    { q:'كم عدد كواكب المجموعة الشمسية؟', a:'ثمانية كواكب' },
    { q:'ما العضو المسؤول عن ضخ الدم؟', a:'القلب' },
    { q:'كم عدد عظام جسم الإنسان البالغ تقريبًا؟', a:'206 عظمة' },
  ]},
  religious: { label_ar:'ديني', label_en:'Religious', questions:[
    { q:'كم عدد أركان الإسلام؟', a:'خمسة أركان' },
    { q:'ما أول بيت وُضع للناس؟', a:'الكعبة المشرفة' },
    { q:'كم عدد سور القرآن الكريم؟', a:'مئة وأربع عشرة سورة' },
    { q:'كم عدد الصلوات المفروضة يوميًا؟', a:'خمس صلوات' },
    { q:'ما الشعيرة التي تُؤدى في مكة سنويًا؟', a:'الحج' },
  ]},
  entertainment: { label_ar:'ترفيهي', label_en:'Fun', questions:[
    { q:'ما الحيوان الملقّب بملك الغابة؟', a:'الأسد' },
    { q:'كم عدد ألوان قوس قزح؟', a:'سبعة ألوان' },
    { q:'ما أسرع حيوان بري في العالم؟', a:'الفهد (الشيتا)' },
    { q:'ما أكبر محيط في العالم؟', a:'المحيط الهادئ' },
    { q:'ما أكبر حيوان ثديي في العالم؟', a:'الحوت الأزرق' },
    { q:'كم عدد أوتار الغيتار الكلاسيكي؟', a:'ستة أوتار' },
  ]},
};
function catLabel(key){
  const c = QUESTION_BANK[key];
  if(!c) return key;
  return CURRENT_LANG==='en' ? c.label_en : c.label_ar;
}

/* ====================== أدوات ====================== */
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

/* ====================== أسئلة المستخدم الخاصة ====================== */
function loadCustomQuestions(){
  try{ const raw=localStorage.getItem(CUSTOM_KEY); if(raw) return JSON.parse(raw); }catch(e){}
  return {};
}
function saveCustomQuestionsMap(map){
  try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(map)); }catch(e){}
}
function mergeCustomIntoBank(){
  const custom = loadCustomQuestions();
  Object.keys(QUESTION_BANK).forEach(key=>{
    QUESTION_BANK[key].questions = QUESTION_BANK[key].questions.filter(x=>!x.__custom);
    (custom[key]||[]).forEach(item=> QUESTION_BANK[key].questions.push({q:item.q,a:item.a,__custom:true,__id:item.id}));
  });
}
function addCustomQuestion(cat,q,a){
  if(!QUESTION_BANK[cat]) return;
  const custom = loadCustomQuestions();
  if(!custom[cat]) custom[cat]=[];
  custom[cat].push({id:uid(),q,a});
  saveCustomQuestionsMap(custom);
  mergeCustomIntoBank();
}
function removeCustomQuestion(cat,id){
  const custom = loadCustomQuestions();
  if(custom[cat]) custom[cat]=custom[cat].filter(x=>x.id!==id);
  saveCustomQuestionsMap(custom);
  mergeCustomIntoBank();
}
function exportCustomQuestionsJSON(){ return JSON.stringify(loadCustomQuestions(),null,2); }
function importCustomQuestionsJSON(text){
  let parsed;
  try{ parsed=JSON.parse(text); }catch(e){ throw new Error('bad'); }
  const existing = loadCustomQuestions();
  let added=0;
  Object.keys(parsed).forEach(cat=>{
    if(!QUESTION_BANK[cat]) return;
    if(!existing[cat]) existing[cat]=[];
    (parsed[cat]||[]).forEach(item=>{
      if(!item||!item.q||!item.a) return;
      if(!existing[cat].some(e=>e.q===item.q&&e.a===item.a)){
        existing[cat].push({id:item.id||uid(),q:item.q,a:item.a});
        added++;
      }
    });
  });
  saveCustomQuestionsMap(existing);
  mergeCustomIntoBank();
  return added;
}
function allQuestionsFlat(){
  const out=[];
  Object.keys(QUESTION_BANK).forEach(cat=>{
    QUESTION_BANK[cat].questions.forEach((item,i)=> out.push({cat, idx:i, q:item.q, a:item.a, key:cat+'#'+item.q}));
  });
  return out;
}

/* ====================== توليد اللوحة ====================== */
/* ship1 = 3 خلايا متفرقة، ship2 = 2 خلايا متفرقة */
function randomShipLayout(boardSize){
  const total = boardSize*boardSize;
  const all = shuffle([...Array(total).keys()]);
  return { ship1: all.slice(0,3), ship2: all.slice(3,5) };
}

/* ====================== حالة اللعبة ====================== */
function defaultConfig(){
  return {
    teamsCount: 2,
    boardSize: 4,
    timerOn: false,
    timerSeconds: 15,
    bestOf: 1,        // 1 = جولة واحدة، أو 3/5/7
    lang: CURRENT_LANG,
  };
}
function freshMatch(config, teamNames){
  const cfg = config || defaultConfig();
  const names = teamNames || {};
  const teams = {};
  for(let i=0;i<cfg.teamsCount;i++){
    const tc = TEAM_COLORS[i];
    teams[tc.key] = {
      key: tc.key,
      name: names[tc.key] || (CURRENT_LANG==='en'?tc.name_en:tc.name_ar),
      color: tc.color,
      roundsWon: 0,
    };
  }
  const winTarget = 3; // ثابت: 3 من 5 خلايا يحسم الجولة
  return {
    id: uid(),
    config: cfg,
    teams,
    teamOrder: Object.keys(teams),
    winTarget,
    round: 1,
    // per-round board state
    ...freshRoundState(cfg.boardSize),
    // match-wide stats
    stats: { questionsShown:0, attempts:0, hits:0, perTeam:{} },
    matchWinner: null,     // فائز البطولة (best of)
    lang: CURRENT_LANG,
    lastEvent: null,
  };
}
function freshRoundState(boardSize){
  const layout = randomShipLayout(boardSize);
  return {
    ship1: layout.ship1,
    ship2: layout.ship2,
    revealed: {},
    scores: {},           // teamKey -> hits this round
    phase: 'idle',        // idle | question | judging | judging_other | attacking | round_over | match_over
    questionText: null,
    answerText: null,
    answerShown: false,
    usedQuestionKeys: [],
    firstTeam: null,
    activeTeam: null,
    triedTeams: [],
    roundWinner: null,
    finalScoreText: null,
    timerEndsAt: null,
  };
}

/* ====================== المزامنة ====================== */
let _channel=null;
try{ _channel=new BroadcastChannel(CHANNEL_NAME); }catch(e){ _channel=null; }
function loadState(){
  try{ const raw=localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw); }catch(e){}
  return null;
}
function saveState(state){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  if(_channel){ try{ _channel.postMessage(state); }catch(e){} }
}
function subscribeState(cb){
  if(_channel) _channel.onmessage=(ev)=>cb(ev.data);
  window.addEventListener('storage',(ev)=>{
    if(ev.key===STORAGE_KEY && ev.newValue){ try{ cb(JSON.parse(ev.newValue)); }catch(e){} }
  });
}

/* ====================== منطق اللعبة ====================== */
const Game = {
  scoreOf(state, teamKey){ return state.scores[teamKey] || 0; },

  newMatch(config, teamNames){
    const m = freshMatch(config, teamNames);
    m.teamOrder.forEach(k=> m.stats.perTeam[k]={hits:0, attempts:0, roundsWon:0});
    saveState(m);
    return m;
  },

  newRound(state){
    const s = {...state, ...freshRoundState(state.config.boardSize), round: state.round+1, lastEvent:null};
    saveState(s);
    return s;
  },

  _pickQuestion(state){
    const flat = allQuestionsFlat();
    const available = flat.filter(x=> !state.usedQuestionKeys.includes(x.key));
    if(available.length===0) return null;
    return available[Math.floor(Math.random()*available.length)];
  },

  nextQuestion(state){
    const picked = this._pickQuestion(state);
    if(!picked){
      const s={...state, phase:'idle', questionText:'__NO_QUESTIONS__', answerText:null};
      saveState(s); return s;
    }
    const s = {
      ...state,
      phase:'question',
      questionText: picked.q,
      answerText: picked.a,
      answerShown:false,
      usedQuestionKeys:[...state.usedQuestionKeys, picked.key],
      firstTeam:null, activeTeam:null, triedTeams:[],
      timerEndsAt: state.config.timerOn ? (Date.now()+state.config.timerSeconds*1000) : null,
      lastEvent:null,
    };
    s.stats = {...state.stats, questionsShown: state.stats.questionsShown+1};
    saveState(s);
    return s;
  },

  skipQuestion(state){
    // نفس nextQuestion لكن لا نحتسبها ضمن الإحصائية مرتين — نعتبر التخطي سؤالًا جديدًا
    return this.nextQuestion(state);
  },

  toggleAnswer(state){
    const s={...state, answerShown:!state.answerShown};
    saveState(s); return s;
  },

  buzz(state, team){
    if(state.phase!=='question' && state.phase!=='judging_other') return state;
    const s={...state, phase:'judging', activeTeam:team, firstTeam: state.firstTeam||team, timerEndsAt:null};
    saveState(s); return s;
  },

  judge(state, correct){
    if(correct){
      const s={...state, phase:'attacking', timerEndsAt:null};
      saveState(s); return s;
    }
    const tried=[...state.triedTeams, state.activeTeam];
    const remaining = state.teamOrder.filter(k=> !tried.includes(k));
    if(remaining.length>0){
      // أعطِ فريقًا آخر فرصة على نفس السؤال
      const s={...state, phase:'judging_other', activeTeam:null, triedTeams:tried, __remaining:remaining};
      saveState(s); return s;
    }
    // الجميع أخطأ → سؤال جديد تلقائيًا
    return this.nextQuestion(state);
  },

  timeUp(state){
    if(state.phase!=='question') return state;
    const s={...state, phase:'idle', timerEndsAt:null, lastEvent:{id:uid(), type:'timeup'}};
    saveState(s); return s;
  },

  attackCell(state, idx){
    if(state.phase!=='attacking') return state;
    const key=String(idx);
    if(state.revealed[key]) return state;
    const team=state.activeTeam;
    const isS1=state.ship1.includes(idx), isS2=state.ship2.includes(idx);
    const revealed={...state.revealed};
    const stats={...state.stats, attempts: state.stats.attempts+1,
      perTeam:{...state.stats.perTeam, [team]:{...state.stats.perTeam[team], attempts:(state.stats.perTeam[team]?.attempts||0)+1}}};

    if(!isS1 && !isS2){
      revealed[key]='miss';
      const s={...state, revealed, stats, phase:'idle', activeTeam:null, firstTeam:null, triedTeams:[],
        questionText:null, answerText:null, lastEvent:{id:uid(),type:'miss',idx,team}};
      saveState(s); return s;
    }

    const shipNum=isS1?1:2;
    revealed[key]='hit'+shipNum;
    const scores={...state.scores, [team]:(state.scores[team]||0)+1};
    stats.hits=stats.hits+1;
    stats.perTeam[team]={...stats.perTeam[team], hits:(stats.perTeam[team]?.hits||0)+1};

    const shipCells=isS1?state.ship1:state.ship2;
    const sunk=shipCells.every(c=> revealed[String(c)] && revealed[String(c)]!=='miss');

    // فوز الجولة؟
    let roundWinner=null;
    state.teamOrder.forEach(k=>{ if((scores[k]||0)>=state.winTarget) roundWinner=k; });

    let lastEvent={id:uid(), type: sunk?'sunk':'hit', idx, shipNum, team};

    if(roundWinner){
      const teams={...state.teams};
      teams[roundWinner]={...teams[roundWinner], roundsWon: teams[roundWinner].roundsWon+1};
      stats.perTeam[roundWinner]={...stats.perTeam[roundWinner], roundsWon:(stats.perTeam[roundWinner]?.roundsWon||0)+1};

      // فوز البطولة؟ (best of N → يحتاج ceil(N/2) جولات)
      const needed = Math.floor(state.config.bestOf/2)+1;
      let matchWinner=null;
      if(teams[roundWinner].roundsWon>=needed) matchWinner=roundWinner;

      const scoreText = state.teamOrder.map(k=> (scores[k]||0)).join(' - ');
      const s={...state, revealed, scores, stats, teams,
        phase: matchWinner?'match_over':'round_over',
        roundWinner, matchWinner: matchWinner||null,
        finalScoreText: scoreText, lastEvent};
      saveState(s); return s;
    }

    // يكمل نفس الفريق
    const s={...state, revealed, scores, stats, phase:'attacking', activeTeam:team, lastEvent};
    saveState(s); return s;
  },
};

/* ====================== الصوت ====================== */
let _audioCtx=null, _muted=false;
function getAudioCtx(){ if(!_audioCtx){ try{_audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){_audioCtx=null;} } return _audioCtx; }
function unlockAudio(){ const c=getAudioCtx(); if(c&&c.state==='suspended') c.resume(); }
function setMuted(m){ _muted=m; }
function isMuted(){ return _muted; }
function beep(freq,dur,type='sine',vol=0.22,delay=0){
  if(_muted) return;
  const ctx=getAudioCtx(); if(!ctx) return;
  const t0=ctx.currentTime+delay;
  const osc=ctx.createOscillator(), g=ctx.createGain();
  osc.type=type; osc.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+0.02);
  g.gain.exponentialRampToValueAtTime(0.001,t0+dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0); osc.stop(t0+dur+0.05);
}
const Sound={
  hit(){ beep(560,0.16,'triangle',0.26); },
  miss(){ beep(160,0.28,'sine',0.16); },
  sunk(){ beep(320,0.16,'sawtooth',0.22); beep(220,0.18,'sawtooth',0.2,0.14); beep(130,0.32,'sawtooth',0.18,0.28); },
  win(){ [523,659,784,1046,1318].forEach((f,i)=>beep(f,0.4,'triangle',0.22,i*0.13)); },
  buzz(){ beep(700,0.1,'square',0.14); },
  tick(){ beep(880,0.05,'square',0.08); },
  timeup(){ beep(200,0.5,'sawtooth',0.2); },
};

mergeCustomIntoBank();
