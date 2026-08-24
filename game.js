/* ============================================================
   لعبة السفن والأسئلة — المنطق المشترك (الحالة + المزامنة + الأسئلة + الصوت)
   يُستخدم من host.html و display.html معًا
   ============================================================ */

const CHANNEL_NAME = 'bsq_channel_v1';
const STORAGE_KEY  = 'bsq_state_v1';
const BOARD_SIZE   = 4; // 4x4 = 16 خلية
const TEAM_NAMES_DEFAULT = { a: 'فريق التوينز', b: 'فريق المرجان' };

/* ---------------- بنك الأسئلة (عالمي المستوى — مناسب لأي جمهور) ---------------- */
const QUESTION_BANK = {
  general: {
    label: 'عام',
    questions: [
      { q: 'ما هي أكبر قارة في العالم من حيث المساحة؟', a: 'قارة آسيا' },
      { q: 'ما هو أطول نهر في العالم؟', a: 'نهر النيل' },
      { q: 'ما هي عاصمة اليابان؟', a: 'طوكيو' },
      { q: 'كم عدد قارات العالم؟', a: 'سبع قارات' },
      { q: 'ما هي أصغر دولة في العالم من حيث المساحة؟', a: 'الفاتيكان' },
      { q: 'ما هي عاصمة أستراليا؟', a: 'كانبرا' },
      { q: 'ما هو أعلى جبل في العالم؟', a: 'جبل إفرست' },
      { q: 'ما هي أكبر صحراء حارة في العالم؟', a: 'الصحراء الكبرى' },
      { q: 'في أي قارة تقع أهرامات الجيزة؟', a: 'قارة أفريقيا (مصر)' },
      { q: 'ما هي أكبر دولة في العالم من حيث المساحة؟', a: 'روسيا' },
      { q: 'ما اسم أطول سور دفاعي بناه الإنسان؟', a: 'سور الصين العظيم' },
      { q: 'كم عدد اللغات الرسمية في الأمم المتحدة؟', a: 'ست لغات' },
      { q: 'ما هي العملة الرسمية في اليابان؟', a: 'الين الياباني' },
      { q: 'ما اسم أشهر برج في باريس؟', a: 'برج إيفل' },
    ]
  },
  sports: {
    label: 'رياضة',
    questions: [
      { q: 'كم عدد لاعبي فريق كرة القدم الواحد داخل الملعب؟', a: 'أحد عشر لاعبًا' },
      { q: 'في أي مدينة أُقيمت أول دورة ألعاب أولمبية حديثة؟', a: 'أثينا' },
      { q: 'كل كم سنة تُقام دورة الألعاب الأولمبية الصيفية؟', a: 'كل أربع سنوات' },
      { q: 'ما اسم الكأس التي يتنافس عليها أبطال أوروبا لكرة القدم؟', a: 'دوري أبطال أوروبا' },
      { q: 'كم عدد اللاعبين في فريق الكرة الطائرة داخل الملعب؟', a: 'ستة لاعبين' },
      { q: 'في أي رياضة يُستخدم مصطلح "نوك أوت"؟', a: 'الملاكمة' },
      { q: 'ما هي الدولة المضيفة لكأس العالم لكرة القدم 2022؟', a: 'قطر' },
      { q: 'كم عدد الأشواط في مباراة التنس (سِت) عادة للفوز بالمباراة عند الرجال في البطولات الكبرى؟', a: 'أفضل من خمسة أشواط' },
      { q: 'ما هي الرياضة التي تُلعب في "ويمبلدون"؟', a: 'التنس' },
      { q: 'كم عدد حلقات الرموز الأولمبية؟', a: 'خمس حلقات' },
      { q: 'ما اسم أشهر سباق دراجات في العالم يُقام سنويًا في فرنسا؟', a: 'طواف فرنسا' },
    ]
  },
  religious: {
    label: 'ديني',
    questions: [
      { q: 'كم عدد أركان الإسلام؟', a: 'خمسة أركان' },
      { q: 'ما هو أول بيت وُضع للناس على الأرض؟', a: 'الكعبة المشرفة' },
      { q: 'كم عدد سور القرآن الكريم؟', a: 'مئة وأربع عشرة سورة' },
      { q: 'في أي شهر فُرض صيام رمضان؟', a: 'شهر رمضان' },
      { q: 'كم عدد الصلوات المفروضة في اليوم والليلة؟', a: 'خمس صلوات' },
      { q: 'ما هي الشعيرة التي يؤديها المسلمون في مكة المكرمة سنويًا؟', a: 'الحج' },
    ]
  },
  entertainment: {
    label: 'ترفيهي',
    questions: [
      { q: 'ما هو الحيوان المعروف بـ"ملك الغابة"؟', a: 'الأسد' },
      { q: 'كم عدد ألوان قوس قزح؟', a: 'سبعة ألوان' },
      { q: 'ما هي أسرع حيوان بري في العالم؟', a: 'الفهد الصياد (الشيتا)' },
      { q: 'كم عدد مربعات لوحة الشطرنج؟', a: 'أربعة وستون مربعًا' },
      { q: 'ما هو أكبر محيط في العالم؟', a: 'المحيط الهادئ' },
      { q: 'ما اسم أصغر عظمة في جسم الإنسان؟', a: 'عظمة الركاب في الأذن' },
      { q: 'ما هو أكبر حيوان ثديي في العالم؟', a: 'الحوت الأزرق' },
      { q: 'كم عدد الأوتار في الغيتار الكلاسيكي؟', a: 'ستة أوتار' },
      { q: 'ما اسم الاستوديو المشهور بأفلام الرسوم المتحركة مثل "توي ستوري"؟', a: 'بيكسار' },
      { q: 'ما هو أشهر بطل رسوم متحركة يعيش تحت الماء في مدينة "بيكيني بوتوم"؟', a: 'سبونج بوب' },
    ]
  },
  science: {
    label: 'علوم',
    questions: [
      { q: 'ما هو الكوكب الأقرب إلى الشمس؟', a: 'عطارد' },
      { q: 'ما هو الغاز الذي يتنفسه الإنسان للبقاء على قيد الحياة؟', a: 'الأكسجين' },
      { q: 'من مخترع المصباح الكهربائي؟', a: 'توماس إديسون' },
      { q: 'ما هو الرمز الكيميائي للماء؟', a: 'H2O' },
      { q: 'ما اسم العالم الذي وضع نظرية الجاذبية بعد سقوط تفاحة؟', a: 'إسحاق نيوتن' },
      { q: 'كم عدد عظام جسم الإنسان البالغ تقريبًا؟', a: '206 عظمة' },
      { q: 'ما هو أقرب كوكب إلى الأرض في المجموعة الشمسية؟', a: 'كوكب الزهرة' },
      { q: 'ما اسم القوة التي تجذب الأجسام نحو مركز الأرض؟', a: 'الجاذبية' },
      { q: 'كم عدد كواكب المجموعة الشمسية؟', a: 'ثمانية كواكب' },
      { q: 'ما هو العضو المسؤول عن ضخ الدم في جسم الإنسان؟', a: 'القلب' },
    ]
  }
};

/* ---------------- أسئلة المستخدم الخاصة (تُضاف إلى فئات البنك وتُحفظ محليًا) ---------------- */
const CUSTOM_KEY = 'bsq_custom_questions_v1';

function loadCustomQuestions(){
  try{
    const raw = localStorage.getItem(CUSTOM_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return {};
}
function saveCustomQuestionsMap(map){
  try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(map)); }catch(e){}
}
function mergeCustomIntoBank(){
  const custom = loadCustomQuestions();
  Object.keys(QUESTION_BANK).forEach(key=>{
    QUESTION_BANK[key].questions = QUESTION_BANK[key].questions.filter(item=>!item.__custom);
    if(custom[key] && custom[key].length){
      custom[key].forEach(item=> QUESTION_BANK[key].questions.push({ q:item.q, a:item.a, __custom:true, __id:item.id }));
    }
  });
}
function addCustomQuestion(categoryKey, q, a){
  if(!QUESTION_BANK[categoryKey]) return null;
  const custom = loadCustomQuestions();
  if(!custom[categoryKey]) custom[categoryKey] = [];
  custom[categoryKey].push({ id: uid(), q, a });
  saveCustomQuestionsMap(custom);
  mergeCustomIntoBank();
  return custom;
}
function removeCustomQuestion(categoryKey, id){
  const custom = loadCustomQuestions();
  if(custom[categoryKey]){
    custom[categoryKey] = custom[categoryKey].filter(item=> item.id !== id);
    saveCustomQuestionsMap(custom);
  }
  mergeCustomIntoBank();
  return custom;
}

/* ---------------- أدوات مساعدة ---------------- */
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function uid(){ return Date.now()+'_'+Math.random().toString(36).slice(2,8); }

/* ---------------- توليد لوحة عشوائية ---------------- */
function randomShipLayout(){
  const all = shuffle([...Array(BOARD_SIZE*BOARD_SIZE).keys()]);
  return { ship1: all.slice(0,3), ship2: all.slice(3,5) };
}

/* ---------------- حالة اللعبة الافتراضية ---------------- */
function freshGameState(prevTeamNames){
  const { ship1, ship2 } = randomShipLayout();
  return {
    id: uid(),
    ship1, ship2,
    revealed: {},           // idx(string) -> 'hit1' | 'hit2' | 'miss'
    scoreA: 0, scoreB: 0,
    phase: 'idle',           // idle | question | judging | judging_other | attacking | finished
    category: null,
    questionText: null,
    answerText: null,
    answerShown: false,
    usedQuestionKeys: [],
    firstTeam: null,          // أول فريق حاول الإجابة على هذا السؤال
    activeTeam: null,         // الفريق الذي يُحكم على إجابته الآن أو يهاجم الآن
    winner: null,
    finalScoreText: null,
    teamNames: prevTeamNames || TEAM_NAMES_DEFAULT,
    lastEvent: null           // {id, type:'hit'|'miss'|'sunk'|'win', idx, shipNum, team}
  };
}

/* ---------------- تخزين + مزامنة ---------------- */
let _channel = null;
try { _channel = new BroadcastChannel(CHANNEL_NAME); } catch(e){ _channel = null; }

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return freshGameState();
}
function saveState(state){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  if(_channel){ try{ _channel.postMessage(state); }catch(e){} }
}
function subscribeState(cb){
  if(_channel){
    _channel.onmessage = (ev)=> cb(ev.data);
  }
  window.addEventListener('storage', (ev)=>{
    if(ev.key === STORAGE_KEY && ev.newValue){
      try{ cb(JSON.parse(ev.newValue)); }catch(e){}
    }
  });
}

/* ---------------- منطق اللعبة ---------------- */
const Game = {

  newRound(state){
    const fresh = freshGameState(state ? state.teamNames : null);
    saveState(fresh);
    return fresh;
  },

  setTeamNames(state, a, b){
    const s = {...state, teamNames:{ a: a || TEAM_NAMES_DEFAULT.a, b: b || TEAM_NAMES_DEFAULT.b }};
    saveState(s);
    return s;
  },

  askQuestion(state, categoryKey){
    const bank = QUESTION_BANK[categoryKey];
    if(!bank) return state;
    const available = bank.questions
      .map((item,i)=> categoryKey+'_'+i)
      .filter(key=> !state.usedQuestionKeys.includes(key));
    const pool = available.length ? available : bank.questions.map((item,i)=> categoryKey+'_'+i);
    const chosenKey = pool[Math.floor(Math.random()*pool.length)];
    const idx = parseInt(chosenKey.split('_')[1],10);
    const item = bank.questions[idx];
    const usedQuestionKeys = available.length ? [...state.usedQuestionKeys, chosenKey] : [chosenKey];

    const s = {
      ...state,
      phase:'question',
      category: categoryKey,
      questionText: item.q,
      answerText: item.a,
      answerShown:false,
      usedQuestionKeys,
      firstTeam:null,
      activeTeam:null,
      lastEvent:null
    };
    saveState(s);
    return s;
  },

  toggleAnswer(state){
    const s = {...state, answerShown: !state.answerShown};
    saveState(s);
    return s;
  },

  buzz(state, team){
    // team = 'a' | 'b'
    if(state.phase !== 'question' && state.phase !== 'judging_other') return state;
    const s = {...state, phase:'judging', activeTeam: team, firstTeam: state.firstTeam || team};
    saveState(s);
    return s;
  },

  judge(state, correct){
    if(correct){
      const s = {...state, phase:'attacking'};
      saveState(s);
      return s;
    }
    // إجابة خاطئة
    if(state.firstTeam && state.activeTeam === state.firstTeam && !state.secondTried){
      // أعطِ الفريق الآخر فرصة على نفس السؤال
      const other = state.activeTeam === 'a' ? 'b' : 'a';
      const s = {...state, phase:'judging_other', activeTeam:null, secondTried:true, __otherTeam: other};
      saveState(s);
      return s;
    }
    // كلا الفريقين أخطآ (أو ما فيه فريق ثاني) → سؤال جديد يختاره المضيف
    const s = {...state, phase:'idle', activeTeam:null, firstTeam:null, secondTried:false, questionText:null, answerText:null};
    saveState(s);
    return s;
  },

  attackCell(state, idx){
    if(state.phase !== 'attacking') return state;
    const key = String(idx);
    if(state.revealed[key]) return state; // مكتشفة مسبقًا

    const team = state.activeTeam;
    const isShip1 = state.ship1.includes(idx);
    const isShip2 = state.ship2.includes(idx);
    const revealed = {...state.revealed};

    if(!isShip1 && !isShip2){
      // خطأ
      revealed[key] = 'miss';
      const s = {
        ...state, revealed,
        phase:'idle', activeTeam:null, firstTeam:null, secondTried:false,
        questionText:null, answerText:null,
        lastEvent:{ id:uid(), type:'miss', idx, team }
      };
      saveState(s);
      return s;
    }

    // إصابة
    const shipNum = isShip1 ? 1 : 2;
    revealed[key] = 'hit'+shipNum;
    let scoreA = state.scoreA + (team==='a'?1:0);
    let scoreB = state.scoreB + (team==='b'?1:0);

    const shipCells = isShip1 ? state.ship1 : state.ship2;
    const sunk = shipCells.every(c => revealed[String(c)] && revealed[String(c)] !== 'miss');

    // هل انتهت الجولة؟ (فريق وصل 3 إصابات = فوز فوري رياضي)
    const totalCells = state.ship1.length + state.ship2.length; // 5
    const winThreshold = Math.floor(totalCells/2) + 1; // 3
    let winner = null;
    if(scoreA >= winThreshold) winner = 'a';
    else if(scoreB >= winThreshold) winner = 'b';

    let lastEvent = { id:uid(), type: sunk ? 'sunk':'hit', idx, shipNum, team };

    if(winner){
      const s = {
        ...state, revealed, scoreA, scoreB,
        phase:'finished', winner,
        finalScoreText: `${scoreA} - ${scoreB}`,
        lastEvent: sunk ? lastEvent : lastEvent // hit or sunk event still fires; win overlay handled by display via phase
      };
      saveState(s);
      return s;
    }

    // اللعبة مستمرة: نفس الفريق يكمل الهجوم
    const s = {
      ...state, revealed, scoreA, scoreB,
      phase:'attacking', activeTeam: team,
      lastEvent
    };
    saveState(s);
    return s;
  }
};

/* ---------------- الصوت (Web Audio، بدون ملفات خارجية) ---------------- */
let _audioCtx = null;
function getAudioCtx(){
  if(!_audioCtx){
    try{ _audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ _audioCtx=null; }
  }
  return _audioCtx;
}
function unlockAudio(){
  const ctx = getAudioCtx();
  if(ctx && ctx.state === 'suspended') ctx.resume();
}
function beep(freq, duration, type='sine', vol=0.22, delay=0){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0+duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0+duration+0.05);
}
const Sound = {
  hit(){ beep(560,0.16,'triangle',0.26); },
  miss(){ beep(160,0.28,'sine',0.16); },
  sunk(){ beep(320,0.16,'sawtooth',0.22); beep(220,0.18,'sawtooth',0.2,0.14); beep(130,0.32,'sawtooth',0.18,0.28); },
  win(){ [523,659,784,1046].forEach((f,i)=> beep(f,0.35,'triangle',0.22,i*0.14)); },
  buzz(){ beep(700,0.1,'square',0.14); }
};

/* دمج أسئلة المستخدم المحفوظة سابقًا في البنك فور تحميل الملف */
mergeCustomIntoBank();
