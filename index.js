import { getContext } from '../../../extensions.js';

const EXT='my-preset-life', PROMPT_KEY='my_preset_life', VERSION='0.2.2';
const DEFAULTS={enabled:true,speechEnabled:true,proseEnabled:true,naturalness:'living',register:'character',profanity:'character',distinctVoices:true,imperfectSpeech:true,proseStyle:'living',pov:'third_close',length:'medium',detail:'balanced',dialogue:'balanced',innerWorld:'balanced',showDontTell:true,sensory:true,antiEcho:true,overrides:{},openSection:'prose'};

const M={
 core:{label:'Общее ядро',help:'Защищает канон персонажа и пространство пользователя.',prompt:`CORE DIRECTION:\nPreserve established character canon, relationships, current circumstances and continuity. Never write dialogue, decisions, thoughts or actions for {{user}}. Style may shape presentation, never rewrite established identity.`},
 natural_character:{label:'Естественность · по персонажу',help:'Манера речи следует карточке персонажа.',prompt:`NATURALNESS — CHARACTER LED:\nLet the character card and established history determine how polished, awkward, terse, verbose, formal or casual each speaker sounds. Do not add verbal quirks merely to demonstrate realism.`},
 natural_living:{label:'Естественность · живая',help:'Паузы, сбивки и самокоррекции там, где они естественны.',prompt:`NATURALNESS — LIVING:\nMake spoken language feel inhabited rather than scripted. When appropriate, allow brief hesitations, interruptions, unfinished thoughts, self-corrections, contractions, pauses and changes of wording. Keep them selective and character-specific.`},
 natural_raw:{label:'Естественность · очень живая',help:'Более импульсивная и неровная речь.',prompt:`NATURALNESS — RAW:\nUnder emotion, fatigue, distraction or urgency, allow noticeable imperfections: cut-offs, restarts, interruptions, sideways answers, trailing off and inelegant blurts. Keep the result readable and specific to the speaker.`},
 register_character:{label:'Регистр · по персонажу',help:'Словарь и синтаксис определяет персонаж.',prompt:`REGISTER — CHARACTER LED:\nChoose vocabulary, syntax, forms of address and conversational habits from each speaker's established identity and social context. Different characters must not collapse into one shared voice.`},
 register_everyday:{label:'Регистр · бытовой',help:'Современная разговорная речь.',prompt:`REGISTER — EVERYDAY:\nFavor contemporary conversational language, practical wording, casual phrasing, small digressions and context-dependent shorthand. People need not formulate every thought elegantly or explain what everyone present already knows.`},
 register_street:{label:'Регистр · уличный',help:'Грубее, короче, больше сленга.',prompt:`REGISTER — STREET:\nWhen compatible with the speaker, permit blunt phrasing, slang, clipped syntax, teasing, verbal jabs and rough colloquial vocabulary. Keep slang socially and character appropriate.`},
 register_intellectual:{label:'Регистр · интеллигентный',help:'Точнее словарь, но всё ещё живая речь.',prompt:`REGISTER — EDUCATED:\nFavor precise vocabulary, coherent reasoning and nuanced phrasing where it fits the speaker. Keep dialogue spoken rather than essay-like; intelligence should appear through word choice and thought, not lectures.`},
 register_official:{label:'Регистр · официальный',help:'Формальная или профессиональная среда.',prompt:`REGISTER — FORMAL:\nUse context-appropriate formal address, restrained wording and institutional or professional phrasing. Characters may become less formal in private or under pressure when characterization supports it.`},
 register_archaic:{label:'Регистр · архаичный',help:'Старомодная речь без пародии.',prompt:`REGISTER — ARCHAIC:\nUse period-appropriate forms of address, vocabulary and sentence turns while keeping dialogue understandable. Avoid unsupported modern internet slang and avoid making every line ceremonious merely to signal an older era.`},
 register_custom:{label:'Регистр · свой',help:'Полностью твой речевой модуль.',prompt:`CUSTOM REGISTER:\nDefine the vocabulary, rhythm, slang, forms of address and speech habits desired for this roleplay. Preserve individual character voices while applying this linguistic environment.`},
 profanity_none:{label:'Мат · нет',help:'Не добавлять мат от себя.',prompt:`PROFANITY — OFF:\nDo not introduce profanity or obscene intensifiers. Preserve emotional force through wording, rhythm and action instead.`},
 profanity_character:{label:'Мат · по персонажу',help:'Мат определяется характером и ситуацией.',prompt:`PROFANITY — CHARACTER LED:\nUse profanity only when it naturally belongs to the speaker's established vocabulary, social background and emotional state. Do not sanitize a character who canonically swears, and do not make a restrained character swear merely to seem edgy.`},
 profanity_moderate:{label:'Мат · умеренный',help:'Естественно, но не в каждой реплике.',prompt:`PROFANITY — MODERATE:\nProfanity is allowed as an emotional tool when appropriate. Use it selectively for emphasis, frustration, humor or intimacy; repeated swearing should reflect the specific speaker rather than become filler.`},
 profanity_free:{label:'Мат · свободный',help:'Грубая речь свободно, если подходит персонажу.',prompt:`PROFANITY — FREE:\nAllow natural, unsanitized profanity and coarse colloquial language wherever speaker and situation support it. Vary intensity by character and emotion; keep profanity idiomatic rather than mechanical.`},
 profanity_hard:{label:'Мат · жёсткий',help:'Широко разрешена жёсткая лексика.',prompt:`PROFANITY — HARD:\nCharacters whose personality supports it may use frequent, harsh and expressive profanity, insults and coarse idioms without euphemistic softening. Preserve linguistic variety and character specificity.`},
 distinctVoices:{label:'Индивидуальность голосов',help:'Персонажи не говорят одним голосом.',prompt:`DISTINCT VOICES:\nKeep speakers audibly distinct. Give recurring characters consistent vocabulary, sentence length, humor, directness, politeness and conversational habits derived from characterization. NPCs must not sound like copies of {{char}} or one generic narrator.`},
 imperfectSpeech:{label:'Несовершенная речь',help:'Уклонения, перебивания, недосказанность.',prompt:`IMPERFECT HUMAN SPEECH:\nDialogue need not be maximally informative. Characters may evade, misunderstand, lie, interrupt, answer only part of a question, change subject, speak around what hurts, or leave implications unstated when motive and context support it.`},
 prose_living:{label:'Стиль · живая проза',help:'Естественная, конкретная, не вылизанная проза.',prompt:`PROSE STYLE — LIVING:\nWrite grounded, vivid prose with concrete physical detail and natural rhythm. Prefer specific verbs and observable behavior over generic emotional labels. Let quiet, awkward and mundane beats remain meaningful without manufacturing drama.`},
 prose_cinematic:{label:'Стиль · кино-реализм',help:'Сцена ощущается видимой: действие, жесты, пространство, монтаж.',prompt:`PROSE STYLE — CINEMATIC REALISM:\nStage the scene through visible action, spatial relationships, gesture, sound and selective sensory detail. Favor sharp scene beats and meaningful visual transitions over explanatory narration. Keep emotions legible through performance rather than camera-like excess.`},
 prose_literary:{label:'Стиль · литературный',help:'Богаче ритм и образность, без фиолетовой прозы.',prompt:`PROSE STYLE — LITERARY:\nUse precise, textured language, varied sentence rhythm, resonant imagery and psychologically observant detail. Keep metaphors selective and fresh. Beauty must serve character, atmosphere or meaning; avoid ornamental purple prose.`},
 prose_slice:{label:'Стиль · бытовой / Slice of Life',help:'Ритуалы, мелочи, неловкость и уют имеют вес.',prompt:`PROSE STYLE — DOMESTIC SLICE OF LIFE:\nGive narrative weight to ordinary life: routines, food, clothes, rooms, chores, messages, bills, weather, small frictions, comfort objects and shared silences. Intimacy may grow through mundane acts. Do not inject drama merely to keep the scene busy.`},
 prose_noir:{label:'Стиль · тёмный / Noir',help:'Сдержанная тёмная атмосфера и напряжённая наблюдательность.',prompt:`PROSE STYLE — DARK NOIR:\nFavor restrained tension, tactile atmosphere, morally complicated observations, dry edges and selective darkness. Keep the prose concrete and character-centered; do not turn every object into a gloomy metaphor.`},
 prose_crime:{label:'Стиль · криминальное кино',help:'Острые диалоги, чёрный юмор и контраст быта с напряжением.',prompt:`PROSE STYLE — CRIME CINEMA:\nFavor quick, characterful exchanges, mundane conversation colliding with tension, dry or black humor, sudden shifts in conversational power and concrete physical business during dialogue. Keep it original rather than imitating any specific filmmaker.`},
 prose_custom:{label:'Стиль · свой',help:'Твоя собственная авторская манера.',prompt:`CUSTOM PROSE STYLE:\nDefine the narrative voice, rhythm, imagery, scene texture and stylistic priorities you want. Preserve character canon, clarity and continuity while applying this custom prose direction.`},
 pov_first:{label:'POV · первое лицо',help:'Повествование от первого лица текущего персонажа.',prompt:`POV — FIRST PERSON:\nNarrate in first person from the active viewpoint character. Limit perception to what that viewpoint can reasonably know, notice, remember or infer.`},
 pov_third_close:{label:'POV · близкое третье',help:'Третье лицо, близко к восприятию персонажа.',prompt:`POV — CLOSE THIRD:\nUse close third person anchored to the active viewpoint character. Filter description and interpretation through their attention, knowledge, biases and sensory experience without unnecessary head-hopping.`},
 pov_third:{label:'POV · третье лицо',help:'Свободнее, но без хаотичных прыжков по головам.',prompt:`POV — THIRD PERSON:\nUse third-person narration with clear viewpoint discipline. Shift viewpoint only when a scene transition or strong narrative reason makes the change unmistakable.`},
 length_short:{label:'Длина · коротко',help:'Компактные ответы без обрубания сцены.',prompt:`RESPONSE SHAPE — SHORT:\nKeep the continuation compact and focused on the next meaningful beat. Do not summarize away interaction merely to stay short; stop at a natural opening for response.`},
 length_medium:{label:'Длина · средне',help:'Нормальная сценическая длина.',prompt:`RESPONSE SHAPE — MEDIUM:\nDevelop the current beat with enough dialogue, action and texture to feel complete without racing through multiple scene phases. End at a natural interactive pause.`},
 length_long:{label:'Длина · подробно',help:'Больше пространства сцене, без воды.',prompt:`RESPONSE SHAPE — LONG:\nAllow the current scene room to breathe with fuller dialogue, action, sensory texture and emotional progression. Add substance rather than repetition; do not prematurely resolve or timeskip an active interaction.`},
 detail_minimal:{label:'Детали · мало',help:'Только значимые детали.',prompt:`DETAIL — LEAN:\nUse only details that clarify action, mood, character or spatial continuity. Avoid cataloguing appearance and surroundings.`},
 detail_balanced:{label:'Детали · баланс',help:'Выборочные конкретные детали.',prompt:`DETAIL — BALANCED:\nUse selective concrete details that make bodies, objects and space feel present. Prefer a few specific observations over exhaustive description.`},
 detail_rich:{label:'Детали · много',help:'Плотнее сенсорика и окружение.',prompt:`DETAIL — RICH:\nRender scenes with richer physical and sensory specificity while keeping details relevant to viewpoint, action and mood. Do not pause the scene for inventories or repeated appearance descriptions.`},
 dialogue_low:{label:'Диалоги · меньше',help:'Больше действия и повествования.',prompt:`DIALOGUE BALANCE — LOW:\nUse dialogue selectively. Let action, observation, silence and physical behavior carry more of the scene without suppressing speech that is naturally needed.`},
 dialogue_balanced:{label:'Диалоги · баланс',help:'Диалог и действие поддерживают друг друга.',prompt:`DIALOGUE BALANCE — BALANCED:\nBalance spoken exchange with physical action, reaction and environment. Avoid both talking-head scenes and narration that smothers interaction.`},
 dialogue_high:{label:'Диалоги · больше',help:'Сцена сильнее держится на разговоре.',prompt:`DIALOGUE BALANCE — HIGH:\nLet conversation carry much of the scene. Break long ideas across exchanges, reactions and interruptions rather than speeches; keep physical behavior present between lines.`},
 inner_low:{label:'Внутренний мир · мало',help:'Не объяснять каждую эмоцию.',prompt:`INNER WORLD — LIGHT:\nKeep internal explanation sparse. Let behavior, dialogue, attention and bodily response communicate most emotion and motive.`},
 inner_balanced:{label:'Внутренний мир · баланс',help:'Мысли только когда углубляют момент.',prompt:`INNER WORLD — BALANCED:\nUse internal thought selectively to sharpen conflict, perception or emotional contradiction. Do not explain what action and dialogue already make clear.`},
 inner_deep:{label:'Внутренний мир · глубоко',help:'Больше психологической близости.',prompt:`INNER WORLD — DEEP:\nAllow deeper access to the viewpoint character's layered thoughts, conflicting impulses, associations and bodily emotion. Keep introspection anchored to the live scene rather than turning it into an essay.`},
 showDontTell:{label:'Показывать, а не объявлять',help:'Эмоции через поведение и телесные реакции.',prompt:`SHOW THROUGH BEHAVIOR:\nPrefer actions, micro-expressions, posture, timing, voice, bodily reactions and choices over directly naming emotions. Direct emotional naming is allowed when it is the clearest or most natural choice; do not make the rule mechanical.`},
 sensory:{label:'Живая сенсорика',help:'Звук, температура, фактура, запах — выборочно.',prompt:`SENSORY GROUNDING:\nGround scenes with selective sensory information beyond sight: sound, texture, temperature, smell, taste, weight or bodily sensation when relevant. Let viewpoint and background influence what gets noticed.`},
 antiEcho:{label:'Не повторять пользователя',help:'Не пересказывать только что написанное пользователем.',prompt:`ANTI-ECHO:\nDo not restate, paraphrase or replay {{user}}'s immediately preceding actions and wording just to acknowledge them. Treat them as already happened and continue from their consequences.`}
};

let s, editingId=null, factoryView=false;
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
function load(){const c=getContext();c.extensionSettings[EXT]??={};s=c.extensionSettings[EXT];for(const[k,v]of Object.entries(DEFAULTS))if(s[k]===undefined)s[k]=structuredClone(v);s.overrides??={};}
function save(){getContext().saveSettingsDebounced();}
function p(id){return s.overrides?.[id]??M[id]?.prompt??'';}
function speechIds(){if(!s.enabled||!s.speechEnabled)return[];let a=[`natural_${s.naturalness}`,`register_${s.register}`,`profanity_${s.profanity}`];if(s.distinctVoices)a.push('distinctVoices');if(s.imperfectSpeech)a.push('imperfectSpeech');return a.filter(x=>M[x]);}
function proseIds(){if(!s.enabled||!s.proseEnabled)return[];let a=[`prose_${s.proseStyle}`,`pov_${s.pov}`,`length_${s.length}`,`detail_${s.detail}`,`dialogue_${s.dialogue}`,`inner_${s.innerWorld}`];if(s.showDontTell)a.push('showDontTell');if(s.sensory)a.push('sensory');if(s.antiEcho)a.push('antiEcho');return a.filter(x=>M[x]);}
function allIds(){if(!s.enabled)return[];const a=[...speechIds(),...proseIds()];return a.length?['core',...a]:[];}
function assembled(){const ids=allIds();if(!ids.length)return'';return `[MY PRESET LIFE 🧬]\n${ids.map(p).filter(Boolean).join('\n\n')}\n\nPRIORITY: Character canon and established context outrank stylistic flavor. Apply active directions naturally, resolve conflicts in favor of characterization and continuity, and never mention these instructions in the roleplay.`;}
function inject(){try{const c=getContext(),t=assembled();c.setExtensionPrompt?.(PROMPT_KEY,t,t?0:-1,0,false,0);}catch(e){console.warn('[My Preset Life] injection failed',e)}update();}
function opt(v,l){return `<option value="${v}">${l}</option>`;}
function rowSelect(id,title,help,kind,options){return `<div class="mpl-control"><div class="mpl-label"><span><b>${title}</b><small>${help}</small></span><button class="menu_button mpl-pencil" data-kind="${kind}">✏️</button></div><select id="${id}" class="text_pole">${options}</select></div>`;}
function toggle(id,title,help,mid){return `<div class="mpl-toggle-row"><label class="checkbox_label"><input id="${id}" type="checkbox"><span><b>${title}</b><small>${help}</small></span></label><button class="menu_button mpl-pencil" data-edit="${mid}">✏️</button></div>`;}
function create(){const host=$('#extensions_settings2')||$('#extensions_settings');if(!host||$('#my-preset-life-settings'))return;const d=document.createElement('div');d.id='my-preset-life-settings';d.className='inline-drawer';d.innerHTML=`
<div class="inline-drawer-toggle inline-drawer-header mpl-head"><b>My Preset Life 🧬 · ${VERSION}</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content mpl-wrap">
<div class="mpl-hero"><div><b>Конструктор живого пресета</b><span>Ты управляешь — движок собирает инструкцию.</span></div><span class="mpl-chip" id="mpl-active-count"></span></div>
<label class="checkbox_label mpl-master"><input id="mpl-enabled" type="checkbox"><span><b>🧬 Engine</b> · передавать активные модули модели</span></label>

<div class="mpl-section" data-section="speech"><button class="mpl-section-head"><span>🗣 <b>Речь</b><small id="mpl-speech-summary"></small></span><span class="mpl-chevron">›</span></button><div class="mpl-section-body">
<label class="checkbox_label mpl-module-switch"><input id="mpl-speech-enabled" type="checkbox"><span>Передавать модуль речи модели</span></label>
${rowSelect('mpl-natural','Естественность речи','Гладкая или по-человечески неровная.','natural',opt('character','По персонажу')+opt('living','Живая')+opt('raw','Очень живая'))}
${rowSelect('mpl-register','Речевой регистр','Языковая среда; характер персонажа главнее.','register',opt('character','По персонажу')+opt('everyday','Бытовой')+opt('street','Уличный')+opt('intellectual','Интеллигентный')+opt('official','Официальный')+opt('archaic','Архаичный')+opt('custom','✏️ Свой'))}
${rowSelect('mpl-profanity','Мат','Интенсивность и способ употребления.','profanity',opt('none','Нет')+opt('character','По персонажу')+opt('moderate','Умеренный')+opt('free','Свободный')+opt('hard','Жёсткий'))}
${toggle('mpl-distinct','Индивидуальность голосов','NPC и чар не говорят одним голосом.','distinctVoices')}
${toggle('mpl-imperfect','Несовершенная речь','Перебивания, уклонения, недосказанность.','imperfectSpeech')}
</div></div>

<div class="mpl-section" data-section="prose"><button class="mpl-section-head"><span>✒️ <b>Проза</b><small id="mpl-prose-summary"></small></span><span class="mpl-chevron">›</span></button><div class="mpl-section-body">
<label class="checkbox_label mpl-module-switch"><input id="mpl-prose-enabled" type="checkbox"><span>Передавать модуль прозы модели</span></label>
${rowSelect('mpl-prose-style','Манера повествования','Не имя автора, а конкретная механика текста.','proseStyle',opt('living','Живая проза')+opt('cinematic','Кино-реализм')+opt('literary','Литературный')+opt('slice','Бытовой / Slice of Life')+opt('noir','Тёмный / Noir')+opt('crime','Криминальное кино')+opt('custom','✏️ Свой стиль'))}
${rowSelect('mpl-pov','Точка зрения','Откуда читатель проживает сцену.','pov',opt('first','Первое лицо')+opt('third_close','Близкое третье')+opt('third','Третье лицо'))}
${rowSelect('mpl-length','Длина ответа','Сколько пространства получает один ход.','length',opt('short','Коротко')+opt('medium','Средне')+opt('long','Подробно'))}
${rowSelect('mpl-detail','Детализация','Насколько плотно описывать физический мир.','detail',opt('minimal','Мало')+opt('balanced','Баланс')+opt('rich','Много'))}
${rowSelect('mpl-dialogue','Доля диалогов','Что сильнее несёт сцену: разговор или повествование.','dialogue',opt('low','Меньше')+opt('balanced','Баланс')+opt('high','Больше'))}
${rowSelect('mpl-inner','Внутренний мир','Насколько глубоко заходить в мысли viewpoint-персонажа.','innerWorld',opt('low','Мало')+opt('balanced','Баланс')+opt('deep','Глубоко'))}
${toggle('mpl-show','Показывать, а не объявлять','Эмоции через жесты, тело, голос и выбор.','showDontTell')}
${toggle('mpl-sensory','Живая сенсорика','Не только зрение: звук, фактура, температура, запах.','sensory')}
${toggle('mpl-antiecho','Не повторять пользователя','Не пересказывать только что совершённые действия.','antiEcho')}
</div></div>

<div class="mpl-section mpl-disabled-section"><button class="mpl-section-head" type="button"><span>🫀 <b>Жизнь</b><small>следующий модуль</small></span><span>🔒</span></button></div>
<div class="mpl-section mpl-disabled-section"><button class="mpl-section-head" type="button"><span>🌍 <b>Мир</b><small>следующий модуль</small></span><span>🔒</span></button></div>
<div class="mpl-section mpl-disabled-section"><button class="mpl-section-head" type="button"><span>❤️ <b>Отношения</b><small>следующий модуль</small></span><span>🔒</span></button></div>
<div class="mpl-section mpl-disabled-section"><button class="mpl-section-head" type="button"><span>🎬 <b>Режиссура</b><small>следующий модуль</small></span><span>🔒</span></button></div>

<div id="mpl-editor" class="mpl-editor" hidden><div class="mpl-editor-head"><div><b id="mpl-editor-title">Редактор</b><small id="mpl-editor-help"></small></div><button id="mpl-editor-close" class="menu_button">✕</button></div><div class="mpl-tabs"><button id="mpl-tab-user" class="menu_button mpl-selected">Моя версия</button><button id="mpl-tab-factory" class="menu_button">Заводской оригинал</button></div><textarea id="mpl-editor-text" class="text_pole" rows="9"></textarea><div id="mpl-factory-note" class="mpl-note" hidden>🔒 Оригинал хранится внутри расширения и не изменяется.</div><div class="mpl-editor-actions"><button id="mpl-save-edit" class="menu_button">💾 Сохранить мою</button><button id="mpl-copy-factory" class="menu_button">📋 Взять оригинал</button><button id="mpl-reset-edit" class="menu_button">↶ Сбросить</button></div></div>
<details class="mpl-preview-box"><summary>👁 Что сейчас отправляется модели</summary><pre id="mpl-preview"></pre></details><div class="mpl-foot">v0.2.2 · 🗣 Речь + ✒️ Проза · заводские prompts всегда можно вернуть</div>
</div>`;host.appendChild(d);bind();sync();}
function moduleId(kind){const map={natural:`natural_${s.naturalness}`,register:`register_${s.register}`,profanity:`profanity_${s.profanity}`,proseStyle:`prose_${s.proseStyle}`,pov:`pov_${s.pov}`,length:`length_${s.length}`,detail:`detail_${s.detail}`,dialogue:`dialogue_${s.dialogue}`,innerWorld:`inner_${s.innerWorld}`};return map[kind]||kind;}
function openEditor(id){if(!M[id])return;editingId=id;$('#mpl-editor').hidden=false;$('#mpl-editor-title').textContent=M[id].label;$('#mpl-editor-help').textContent=M[id].help;showMode(false);$('#mpl-editor').scrollIntoView({behavior:'smooth',block:'nearest'});}
function showMode(factory){factoryView=factory;const ta=$('#mpl-editor-text');$('#mpl-tab-user').classList.toggle('mpl-selected',!factory);$('#mpl-tab-factory').classList.toggle('mpl-selected',factory);$('#mpl-factory-note').hidden=!factory;$('#mpl-save-edit').disabled=factory;ta.readOnly=factory;ta.value=factory?M[editingId].prompt:p(editingId);}
function bind(){
  const bindCheck=(id,key)=>{ const el=$(id); if(el) el.addEventListener('change',e=>{s[key]=e.target.checked;save();inject();}); };
  const bindSelect=(id,key)=>{ const el=$(id); if(el) el.addEventListener('change',e=>{s[key]=e.target.value;save();inject();}); };
  [['#mpl-enabled','enabled'],['#mpl-speech-enabled','speechEnabled'],['#mpl-prose-enabled','proseEnabled'],['#mpl-distinct','distinctVoices'],['#mpl-imperfect','imperfectSpeech'],['#mpl-show','showDontTell'],['#mpl-sensory','sensory'],['#mpl-antiecho','antiEcho']].forEach(([id,key])=>bindCheck(id,key));
  [['#mpl-natural','naturalness'],['#mpl-register','register'],['#mpl-profanity','profanity'],['#mpl-prose-style','proseStyle'],['#mpl-pov','pov'],['#mpl-length','length'],['#mpl-detail','detail'],['#mpl-dialogue','dialogue'],['#mpl-inner','innerWorld']].forEach(([id,key])=>bindSelect(id,key));
  $$('.mpl-section:not(.mpl-disabled-section) .mpl-section-head').forEach((button)=>{
    button.addEventListener('click',()=>{
      const sec=button.closest('.mpl-section'); const name=sec.dataset.section; const was=sec.classList.contains('open');
      $$('.mpl-section').forEach(x=>x.classList.remove('open'));
      if(!was){sec.classList.add('open');s.openSection=name;} else s.openSection='';
      save();
    });
  });
  $$('.mpl-pencil[data-kind]').forEach((button)=>{button.addEventListener('click',()=>openEditor(moduleId(button.dataset.kind)));});
  $$('.mpl-pencil[data-edit]').forEach((button)=>{button.addEventListener('click',()=>openEditor(button.dataset.edit));});
  $('#mpl-editor-close')?.addEventListener('click',()=>{$('#mpl-editor').hidden=true;});
  $('#mpl-tab-user')?.addEventListener('click',()=>showMode(false));
  $('#mpl-tab-factory')?.addEventListener('click',()=>showMode(true));
  $('#mpl-save-edit')?.addEventListener('click',()=>{if(!editingId)return;s.overrides[editingId]=$('#mpl-editor-text').value;save();inject();toastr.success('My Preset Life: твоя версия сохранена');});
  $('#mpl-copy-factory')?.addEventListener('click',()=>{showMode(false);$('#mpl-editor-text').value=M[editingId].prompt;});
  $('#mpl-reset-edit')?.addEventListener('click',()=>{delete s.overrides[editingId];save();showMode(false);inject();toastr.info('Вернула заводской prompt');});
}
function sync(){const checks={enabled:'mpl-enabled',speechEnabled:'mpl-speech-enabled',proseEnabled:'mpl-prose-enabled',distinctVoices:'mpl-distinct',imperfectSpeech:'mpl-imperfect',showDontTell:'mpl-show',sensory:'mpl-sensory',antiEcho:'mpl-antiecho'};for(const[k,id]of Object.entries(checks))$('#'+id).checked=!!s[k];const sels={naturalness:'mpl-natural',register:'mpl-register',profanity:'mpl-profanity',proseStyle:'mpl-prose-style',pov:'mpl-pov',length:'mpl-length',detail:'mpl-detail',dialogue:'mpl-dialogue',innerWorld:'mpl-inner'};for(const[k,id]of Object.entries(sels))$('#'+id).value=s[k];if(s.openSection)$(`.mpl-section[data-section="${s.openSection}"]`)?.classList.add('open');update();}
function update(){const out=$('#mpl-preview');if(!out)return;out.textContent=assembled()||'Ничего не отправляется модели: Engine или все модули выключены.';const n=allIds().length?allIds().length-1:0;$('#mpl-active-count').textContent=`Активно: ${n}`;$('#mpl-speech-summary').textContent=s.speechEnabled?`${speechIds().length} активно`:'выкл.';$('#mpl-prose-summary').textContent=s.proseEnabled?`${M[`prose_${s.proseStyle}`]?.label.replace('Стиль · ','')||''} · ${proseIds().length} активно`:'выкл.';}
function init(){
  try {
    load();
    create();
    inject();
    let tries=0;
    const t=setInterval(()=>{
      try { create(); } catch(e) { console.error('[My Preset Life] panel retry failed',e); }
      if($('#my-preset-life-settings')||++tries>40) clearInterval(t);
    },500);
    console.log(`[My Preset Life] v${VERSION} loaded`);
  } catch(e) {
    console.error('[My Preset Life] startup failed',e);
    // Last-resort panel retry: if settings host appears later, try again without hiding the failure.
    let tries=0;
    const t=setInterval(()=>{
      try { if(!s) load(); create(); if($('#my-preset-life-settings')) clearInterval(t); }
      catch(err){ console.error('[My Preset Life] recovery retry failed',err); }
      if(++tries>40) clearInterval(t);
    },500);
  }
}
jQuery(init);
