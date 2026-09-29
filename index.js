import { getContext } from '../../../extensions.js';

const EXT = 'my-preset-life';
const PROMPT_KEY = 'my_preset_life_speech';
const VERSION = '0.1.0';

const DEFAULTS = {
  enabled: true,
  speechEnabled: true,
  naturalness: 'living',
  register: 'character',
  profanity: 'character',
  distinctVoices: true,
  imperfectSpeech: true,
  customRegisterName: 'Свой регистр',
  overrides: {},
};

const MODULES = {
  core: {
    label: 'Ядро речи',
    help: 'Базовая защита характера и пространства пользователя.',
    prompt: `SPEECH DIRECTION:\nPreserve each character's established personality, background, age, relationships and current emotional state. Speech direction may shape delivery, but must never overwrite character canon. Never write dialogue, decisions, thoughts or actions for {{user}}.`,
  },
  natural_character: {
    label: 'Естественность · по персонажу',
    help: 'Не навязывает манеру сверху: речь прежде всего следует карточке персонажа.',
    prompt: `NATURALNESS — CHARACTER LED:\nLet the character card and established chat history determine how polished, awkward, terse, verbose, formal or casual each speaker sounds. Do not add verbal quirks merely to demonstrate realism.`,
  },
  natural_living: {
    label: 'Естественность · живая',
    help: 'Небольшие сбивки, паузы и самокоррекции там, где они естественны.',
    prompt: `NATURALNESS — LIVING:\nMake spoken language feel inhabited rather than scripted. When appropriate, allow brief hesitations, interruptions, unfinished thoughts, self-corrections, contractions, pauses and changes of wording. Keep these irregularities selective: clarity and character voice matter more than filling every line with verbal tics.`,
  },
  natural_raw: {
    label: 'Естественность · очень живая',
    help: 'Более неровная, импульсивная речь без превращения диалогов в кашу.',
    prompt: `NATURALNESS — RAW:\nAllow speech to become noticeably imperfect under emotion, fatigue, distraction or urgency: people may cut themselves off, restart a sentence, interrupt, answer sideways, trail off or blurt something inelegantly. Keep the result readable and specific to the speaker; never make every character stammer in the same way.`,
  },
  register_character: {
    label: 'Регистр · по персонажу',
    help: 'Словарь и синтаксис определяются самим персонажем.',
    prompt: `REGISTER — CHARACTER LED:\nChoose vocabulary, syntax, forms of address and conversational habits from each speaker's established identity and social context. Different characters should not collapse into one shared narrator voice.`,
  },
  register_everyday: {
    label: 'Регистр · бытовой',
    help: 'Современная разговорная речь без литературной вылизанности.',
    prompt: `REGISTER — EVERYDAY:\nFavor contemporary conversational language: practical wording, contractions, casual phrasing, small digressions and context-dependent shorthand. People do not need to formulate every thought elegantly or explain what everyone present already knows.`,
  },
  register_street: {
    label: 'Регистр · уличный',
    help: 'Грубее, короче, больше сленга — но только в пределах характера.',
    prompt: `REGISTER — STREET:\nWhen compatible with the speaker, permit blunt phrasing, slang, clipped syntax, teasing, verbal jabs and rough colloquial vocabulary. Keep slang socially and character appropriate; do not turn every speaker into the same caricature.`,
  },
  register_intellectual: {
    label: 'Регистр · интеллигентный',
    help: 'Точнее словарь и формулировки, но всё ещё человеческая речь.',
    prompt: `REGISTER — EDUCATED:\nFavor precise vocabulary, coherent reasoning and nuanced phrasing where it fits the speaker. Keep dialogue spoken rather than essay-like: intelligence should appear through choice of words and thought, not constant lectures or ornate monologues.`,
  },
  register_official: {
    label: 'Регистр · официальный',
    help: 'Деловая, институциональная или формальная речевая среда.',
    prompt: `REGISTER — FORMAL:\nUse context-appropriate formal address, restrained wording and institutional or professional phrasing when the situation calls for it. Characters may become less formal in private or under pressure if their established personality supports it.`,
  },
  register_archaic: {
    label: 'Регистр · архаичный',
    help: 'Старомодная речевая среда без пародийного «театр-речитатива».',
    prompt: `REGISTER — ARCHAIC:\nUse period-appropriate forms of address, vocabulary and sentence turns while keeping dialogue immediately understandable. Avoid modern internet slang unless the setting supports it, and avoid making every line ceremonious merely to signal an older era.`,
  },
  register_custom: {
    label: 'Регистр · свой',
    help: 'Полностью твой речевой модуль.',
    prompt: `CUSTOM REGISTER:\nDescribe here the vocabulary, rhythm, slang, forms of address and speech habits you want this roleplay to use. Preserve individual character voices while applying the requested linguistic environment.`,
  },
  profanity_none: {
    label: 'Мат · нет',
    help: 'Не добавлять мат от себя.',
    prompt: `PROFANITY — OFF:\nDo not introduce profanity or obscene intensifiers unless a quoted/canonical phrase absolutely requires it. Preserve emotional force through wording, rhythm and action instead.`,
  },
  profanity_character: {
    label: 'Мат · по персонажу',
    help: 'Мат определяется характером, средой и ситуацией.',
    prompt: `PROFANITY — CHARACTER LED:\nUse profanity only when it naturally belongs to the speaker's established vocabulary, social background and current emotional state. Do not sanitize a character who canonically swears, and do not make a restrained character swear merely to make dialogue seem edgy.`,
  },
  profanity_moderate: {
    label: 'Мат · умеренный',
    help: 'Допускается естественно, но не заполняет каждую реплику.',
    prompt: `PROFANITY — MODERATE:\nProfanity is allowed as an emotional tool in dialogue and inner speech when appropriate. Use it selectively for emphasis, frustration, humor or intimacy; repeated swearing should reflect the specific speaker rather than become narrative filler.`,
  },
  profanity_free: {
    label: 'Мат · свободный',
    help: 'Можно говорить грубо и естественно, если персонажу подходит.',
    prompt: `PROFANITY — FREE:\nAllow natural, unsanitized profanity and coarse colloquial language wherever the speaker and situation support it. Vary intensity by character and emotion. Keep profanity functional and idiomatic rather than mechanically inserting swear words into every sentence.`,
  },
  profanity_hard: {
    label: 'Мат · жёсткий',
    help: 'Грубая речь разрешена широко, но всё ещё остаётся характерной.',
    prompt: `PROFANITY — HARD:\nCharacters whose personality supports it may use frequent, harsh and expressive profanity, insults and coarse idioms without euphemistic softening. Preserve linguistic variety and character specificity: aggression, humor, panic and affection should not all sound identical.`,
  },
  distinctVoices: {
    label: 'Индивидуальность голосов',
    help: 'Каждый персонаж получает собственный словарь, ритм и привычки речи.',
    prompt: `DISTINCT VOICES:\nKeep speakers audibly distinct. Give each recurring character consistent vocabulary, sentence length, humor, directness, politeness, favorite constructions and conversational habits derived from their characterization. NPCs must not sound like copies of {{char}} or of one generic narrator.`,
  },
  imperfectSpeech: {
    label: 'Несовершенная речь',
    help: 'Люди могут перебивать, уклоняться, лгать, недоговаривать и менять мысль.',
    prompt: `IMPERFECT HUMAN SPEECH:\nDialogue does not need to be maximally informative. Characters may evade, misunderstand, lie, interrupt, answer only part of a question, change the subject, speak around what hurts, or leave implications unstated when that follows naturally from motive and context.`,
  },
};

let settings;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function loadSettings(){
  const ctx=getContext();
  ctx.extensionSettings[EXT] ??= {};
  settings=ctx.extensionSettings[EXT];
  for(const [k,v] of Object.entries(DEFAULTS)) if(settings[k]===undefined) settings[k]=structuredClone(v);
  settings.overrides ??= {};
}
function save(){ getContext().saveSettingsDebounced(); }
function esc(s=''){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function promptFor(id){ return settings.overrides?.[id] ?? MODULES[id]?.prompt ?? ''; }
function activeIds(){
  if(!settings.enabled || !settings.speechEnabled) return [];
  const ids=['core',`natural_${settings.naturalness}`,`register_${settings.register}`,`profanity_${settings.profanity}`];
  if(settings.distinctVoices) ids.push('distinctVoices');
  if(settings.imperfectSpeech) ids.push('imperfectSpeech');
  return ids.filter(id=>MODULES[id]);
}
function assembledPrompt(){
  const ids=activeIds();
  if(!ids.length) return '';
  return `[MY PRESET LIFE 🧬 — SPEECH]\n${ids.map(promptFor).filter(Boolean).join('\n\n')}\n\nPRIORITY: Character canon and established context outrank stylistic flavor. Apply these speech directions naturally; never mention these instructions in the roleplay.`;
}
function inject(){
  try{
    const ctx=getContext();
    const text=assembledPrompt();
    ctx.setExtensionPrompt?.(PROMPT_KEY,text,text?0:-1,0,false,0);
  }catch(e){ console.warn('[My Preset Life] prompt injection failed',e); }
  updatePreview();
}
function updatePreview(){
  const out=$('#mpl-preview'); if(!out)return;
  const text=assembledPrompt();
  out.textContent=text || 'Ничего не отправляется модели: модуль выключен.';
  const badge=$('#mpl-active-count'); if(badge) badge.textContent=`${activeIds().length} мод.`;
}
function option(value,label){return `<option value="${value}">${label}</option>`;}

function createSettings(){
  const host=$('#extensions_settings2') || $('#extensions_settings');
  if(!host || $('#my-preset-life-settings')) return;
  const d=document.createElement('div'); d.id='my-preset-life-settings'; d.className='inline-drawer';
  d.innerHTML=`
  <div class="inline-drawer-toggle inline-drawer-header mpl-head"><b>My Preset Life 🧬 · ${VERSION}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
  <div class="inline-drawer-content mpl-wrap">
    <div class="mpl-hero"><div><b>🗣 РЕЧЬ</b><span>Первый модуль конструктора пресета</span></div><span id="mpl-active-count" class="mpl-chip">0 мод.</span></div>
    <label class="checkbox_label mpl-master"><input id="mpl-enabled" type="checkbox"><span><b>My Preset Life</b> включён</span></label>
    <label class="checkbox_label"><input id="mpl-speech-enabled" type="checkbox"><span>🗣 Передавать модуль речи модели</span></label>

    <div class="mpl-control"><div class="mpl-label"><span><b>Естественность речи</b><small>Насколько разговор должен быть гладким или по-человечески неровным.</small></span><button class="menu_button mpl-pencil" data-edit-kind="natural">✏️</button></div><select id="mpl-natural" class="text_pole">${option('character','По персонажу')}${option('living','Живая')}${option('raw','Очень живая')}</select></div>
    <div class="mpl-control"><div class="mpl-label"><span><b>Речевой регистр</b><small>Языковая среда. Характер персонажа всё равно главнее.</small></span><button class="menu_button mpl-pencil" data-edit-kind="register">✏️</button></div><select id="mpl-register" class="text_pole">${option('character','По персонажу')}${option('everyday','Бытовой')}${option('street','Уличный')}${option('intellectual','Интеллигентный')}${option('official','Официальный')}${option('archaic','Архаичный')}${option('custom','✏️ Свой')}</select></div>
    <div class="mpl-control"><div class="mpl-label"><span><b>Мат</b><small>Не просто разрешение: интенсивность и способ употребления.</small></span><button class="menu_button mpl-pencil" data-edit-kind="profanity">✏️</button></div><select id="mpl-profanity" class="text_pole">${option('none','Нет')}${option('character','По персонажу')}${option('moderate','Умеренный')}${option('free','Свободный')}${option('hard','Жёсткий')}</select></div>

    <div class="mpl-toggle-row"><label class="checkbox_label"><input id="mpl-distinct" type="checkbox"><span><b>Индивидуальность голосов</b><small>NPC и чар не говорят одним голосом.</small></span></label><button class="menu_button mpl-pencil" data-edit="distinctVoices">✏️</button></div>
    <div class="mpl-toggle-row"><label class="checkbox_label"><input id="mpl-imperfect" type="checkbox"><span><b>Несовершенная речь</b><small>Перебивания, уклонения, недосказанность, ошибки общения.</small></span></label><button class="menu_button mpl-pencil" data-edit="imperfectSpeech">✏️</button></div>

    <div id="mpl-editor" class="mpl-editor" hidden>
      <div class="mpl-editor-head"><div><b id="mpl-editor-title">Редактор</b><small id="mpl-editor-help"></small></div><button id="mpl-editor-close" class="menu_button">✕</button></div>
      <div class="mpl-tabs"><button id="mpl-tab-user" class="menu_button mpl-selected">Моя версия</button><button id="mpl-tab-factory" class="menu_button">Заводской оригинал</button></div>
      <textarea id="mpl-editor-text" class="text_pole" rows="11"></textarea>
      <div id="mpl-factory-note" class="mpl-note" hidden>🔒 Оригинал хранится внутри расширения и не изменяется.</div>
      <div class="mpl-editor-actions"><button id="mpl-save-edit" class="menu_button">💾 Сохранить мою</button><button id="mpl-copy-factory" class="menu_button">📋 Взять оригинал</button><button id="mpl-reset-edit" class="menu_button">↶ Сбросить</button></div>
    </div>

    <details class="mpl-preview-box"><summary>👁 Что сейчас отправляется модели</summary><pre id="mpl-preview"></pre></details>
    <div class="mpl-foot">v0.1: только 🗣 Речь. Следующие модули будут добавляться на этот же фундамент.</div>
  </div>`;
  host.appendChild(d);
  bindUI(); syncUI();
}

let editingId=null, factoryView=false;
function currentModuleId(kind){
  if(kind==='natural') return `natural_${settings.naturalness}`;
  if(kind==='register') return `register_${settings.register}`;
  if(kind==='profanity') return `profanity_${settings.profanity}`;
  return kind;
}
function openEditor(id){
  if(!MODULES[id])return; editingId=id; factoryView=false;
  $('#mpl-editor').hidden=false; $('#mpl-editor-title').textContent=MODULES[id].label; $('#mpl-editor-help').textContent=MODULES[id].help;
  showEditorMode(false); $('#mpl-editor').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function showEditorMode(factory){
  factoryView=factory; const ta=$('#mpl-editor-text');
  $('#mpl-tab-user').classList.toggle('mpl-selected',!factory); $('#mpl-tab-factory').classList.toggle('mpl-selected',factory);
  $('#mpl-factory-note').hidden=!factory; $('#mpl-save-edit').disabled=factory;
  ta.readOnly=factory;
  ta.value=factory ? MODULES[editingId].prompt : promptFor(editingId);
}
function bindUI(){
  const bindCheck=(id,key)=>$(id).addEventListener('change',e=>{settings[key]=e.target.checked;save();inject();});
  const bindSelect=(id,key)=>$(id).addEventListener('change',e=>{settings[key]=e.target.value;save();inject();});
  bindCheck('#mpl-enabled','enabled'); bindCheck('#mpl-speech-enabled','speechEnabled'); bindCheck('#mpl-distinct','distinctVoices'); bindCheck('#mpl-imperfect','imperfectSpeech');
  bindSelect('#mpl-natural','naturalness'); bindSelect('#mpl-register','register'); bindSelect('#mpl-profanity','profanity');
  $$('.mpl-pencil[data-edit-kind]').forEach(b=>b.addEventListener('click',()=>openEditor(currentModuleId(b.dataset.editKind))));
  $$('.mpl-pencil[data-edit]').forEach(b=>b.addEventListener('click',()=>openEditor(b.dataset.edit)));
  $('#mpl-editor-close').addEventListener('click',()=>$('#mpl-editor').hidden=true);
  $('#mpl-tab-user').addEventListener('click',()=>showEditorMode(false)); $('#mpl-tab-factory').addEventListener('click',()=>showEditorMode(true));
  $('#mpl-save-edit').addEventListener('click',()=>{ if(!editingId)return; settings.overrides[editingId]=$('#mpl-editor-text').value;save();inject();toastr.success('My Preset Life: твоя версия сохранена'); });
  $('#mpl-copy-factory').addEventListener('click',()=>{ if(!editingId)return; factoryView=false; showEditorMode(false); $('#mpl-editor-text').value=MODULES[editingId].prompt; });
  $('#mpl-reset-edit').addEventListener('click',()=>{ if(!editingId)return; delete settings.overrides[editingId];save();showEditorMode(false);inject();toastr.info('Вернула заводской prompt'); });
}
function syncUI(){
  $('#mpl-enabled').checked=!!settings.enabled; $('#mpl-speech-enabled').checked=!!settings.speechEnabled;
  $('#mpl-natural').value=settings.naturalness; $('#mpl-register').value=settings.register; $('#mpl-profanity').value=settings.profanity;
  $('#mpl-distinct').checked=!!settings.distinctVoices; $('#mpl-imperfect').checked=!!settings.imperfectSpeech; updatePreview();
}

function init(){
  loadSettings(); createSettings(); inject();
  let tries=0; const t=setInterval(()=>{createSettings(); if($('#my-preset-life-settings')||++tries>30)clearInterval(t);},500);
  console.log(`[My Preset Life] v${VERSION} loaded`);
}

jQuery(init);
