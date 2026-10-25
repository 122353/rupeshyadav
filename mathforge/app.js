(function boot(){
"use strict";
const D=window.MATH_DATA, lessons=D.lessons, stages=D.stages, refs=D.resources;
const $=s=>document.querySelector(s), escapeHTML=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const key="eigenpath-progress-v1";
let saved={};
try{saved=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch(_){}
const S={
 completed:new Set(Array.isArray(saved.completed)?saved.completed:[]),
 practiced:new Set(Array.isArray(saved.practiced)?saved.practiced:[]),
 notes:saved.notes||{},
 last:saved.last||"scalars-coordinates",
 filter:"all", expanded:{},lessonTab:"learn",revealed:{},
 quiz:{track:"ipu",index:0,selected:null,checked:false,score:0,seen:0},
 lab:"vectors",mat:[1.4,.5,-.2,1.1],v:[2,1],gd:{w:3,eta:.15,steps:9},bp:{x1:1,x2:2,w1:.5,w2:-.25,b:0,y:1,eta:.8}
};
let toastTimer=0;
function persist(){try{localStorage.setItem(key,JSON.stringify({completed:[...S.completed],practiced:[...S.practiced],notes:S.notes,last:S.last}))}catch(_){}}
function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2500)}
function formatTag(track){return '<span class="tag '+(track==="ipu"?"ipu":track==="dl"?"dl":track==="research"?"research":"both")+'">'+({ipu:"IPU EXAM",dl:"DEEP LEARNING",research:"RESEARCH",both:"BOTH TRACKS"}[track]||track)+'</span>'}
function countCompleted(arr){return arr.filter(l=>S.completed.has(l.id)).length}
function percentage(arr){return arr.length?Math.round(countCompleted(arr)/arr.length*100):0}
function nextLesson(){return lessons.find(l=>!S.completed.has(l.id))||lessons[lessons.length-1]}
function titleOf(l){return escapeHTML(l.title)}
function urlLesson(id){return "#lesson/"+encodeURIComponent(id)}
function buttonAction(action,label,cls,extra){return '<button type="button" class="'+(cls||"primary-btn")+'" data-action="'+action+'" '+(extra||"")+'>'+label+'</button>'}
function sectionHead(title,desc,link,action){return '<div class="section-head"><div><h2>'+title+'</h2><p>'+desc+'</p></div>'+(link?buttonAction(action,link,"text-link"):"")+'</div>'}
function heroArt(){return '<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".22" stroke="#a5b3ef" stroke-width=".75">'+Array.from({length:10},(_,i)=>'<path d="M '+(i*45-60)+' 10 V 288"/><path d="M 0 '+(i*43-32)+' H 360"/>').join("")+'</g><circle cx="177" cy="142" r="115" stroke="#8898ff" stroke-opacity=".27"/><circle cx="177" cy="142" r="83" stroke="#8898ff" stroke-opacity=".37"/><path d="M95 235L162 87L289 161L221 268Z" fill="#6675e8" fill-opacity=".15" stroke="#96a6ff" stroke-width="2"/><path d="M95 235L220 266L162 87Z" fill="#55d7bb" fill-opacity=".13"/><path d="M162 87L291 160" stroke="#d5ddff" stroke-dasharray="4 5"/><path d="M57 239L162 87" stroke="#6de1d1" stroke-width="3"/><path d="M154 101L162 87L146 92" stroke="#6de1d1" stroke-width="3"/><circle cx="162" cy="87" r="7" fill="#8d9aff"/><circle cx="291" cy="160" r="6" fill="#74e3cd"/><circle cx="95" cy="235" r="6" fill="#aab3fb"/><text x="183" y="82" fill="#e2e6ff" font-size="13" font-family="Georgia">v₁</text><text x="296" y="158" fill="#8de2d4" font-size="13" font-family="Georgia">Av</text><text x="107" y="217" fill="#e2e6ff" font-size="13" font-family="Georgia">λ</text></svg>'}
function statCard(title,value,foot,symbol,color){return '<div class="stat-card"><div class="stat-top"><span class="stat-symbol '+color+'">'+symbol+'</span>'+title+'</div><strong class="stat-value">'+value+'</strong><div class="stat-foot">'+foot+'</div></div>'}
function stageCard(s){
 const all=lessons.filter(l=>l.phase===s.id),done=countCompleted(all);
 return '<a href="#roadmap" data-go-stage="'+s.id+'" class="stage-card"><div class="stage-top" style="background:'+s.color+'"><span class="stage-icon">'+s.icon+'</span><span class="stage-index">STAGE 0'+(s.id+1)+'</span></div><div class="stage-body"><h3>'+escapeHTML(s.title)+'</h3><p>'+escapeHTML(s.desc)+'</p><div class="stage-bottom"><span>'+done+' / '+all.length+' lessons completed</span><b>Explore ↗</b></div></div></a>'
}
function dashboard(){
 const n=nextLesson();
 return '<div class="page-kicker">THE PERSONAL MATHEMATICS WORKSPACE</div>'+
 '<section class="hero"><div class="hero-left"><span class="hero-tag">ONE ROADMAP. TWO PURPOSES.</span><h1>Understand the math.<br><em>Build the intelligence.</em></h1><p>From geometric intuition to IPU Unit III & IV to backpropagation and modern AI research — in one connected learning journey.</p><div class="hero-actions">'+buttonAction("continue","Continue learning <span aria-hidden=true>↗</span>","primary-btn")+'<a href="#roadmap" class="ghost-btn">View the full roadmap →</a></div></div><div class="hero-art">'+heroArt()+'</div></section>'+
 '<div class="stats-grid">'+statCard("Course completed",percentage(lessons)+"%","Across "+lessons.length+" lessons","◉","blue")+
 statCard("IPU Unit III",percentage(lessons.filter(l=>l.phase===1))+"%","Matrices • rank • eigen","▣","amber")+
 statCard("IPU Unit IV",percentage(lessons.filter(l=>l.phase===3))+"%","Fields • integrals • theorems","∇","mint")+
 statCard("DL + Research",percentage(lessons.filter(l=>l.phase>=4))+"%","Backprop → research","λ","purple")+'</div>'+
 sectionHead("Your connected learning roadmap","Six stages · concept → intuition → proof → practice → application","See all lessons →","show-roadmap")+
 '<div class="stages-grid">'+stages.map(stageCard).join("")+'</div>'+
 sectionHead("Keep the momentum","Pick up where you last stopped and revisit the big picture","Open planner →","show-planner")+
 '<div class="continue-grid"><div class="continue-panel"><div><div class="eyebrow">UP NEXT · LESSON '+n.order.toString().padStart(2,"0")+'</div><h3>'+titleOf(n)+'</h3><p>'+escapeHTML(n.intuition)+'</p>'+buttonAction("continue","Start this lesson →","primary-btn")+'</div><div class="continue-symbol">'+stages[n.phase].icon+'</div></div><div class="quote-panel"><span class="eyebrow">THE EIGENPATH METHOD</span><p><strong>See it → derive it → solve it → code it.</strong> Every lesson offers a visual intuition, original university-style exercise and a modern deep-learning application. Your progress stays in this browser.</p></div></div>';
}
function matchesFilter(l,filter){return filter==="all"||filter==="ipu"&&(l.phase===1||l.phase===3||l.track==="ipu"||l.track==="both")||filter==="unit3"&&l.phase===1||filter==="unit4"&&l.phase===3||filter==="dl"&&(l.phase===0||l.phase===2||l.phase===4||l.track==="dl"||l.track==="both")||filter==="research"&&l.phase===5||filter==="beginner"&&l.level==="Beginner";}
function roadmap(){
 const filters=[["all","Complete roadmap"],["unit3","IPU Unit III"],["unit4","IPU Unit IV"],["dl","Deep learning"],["research","Research"],["beginner","Beginner"]];
 const filtered=lessons.filter(l=>matchesFilter(l,S.filter));
 return '<div class="page-kicker">STRUCTURED LEARNING</div><h1 class="page-title">The unified roadmap<span style="color:#6b73ed">.</span></h1><p class="page-sub">Learn each topic once, deeply. IPU and DL are different assessment lenses on the same mathematics. Filter to focus without splitting your understanding.</p>'+
 '<div class="page-tools"><div class="tabs">'+filters.map(([k,t])=>'<button class="tab '+(S.filter===k?"active":"")+'" data-action="road-filter" data-id="'+k+'">'+t+'</button>').join("")+'</div><span class="count-pill">'+filtered.length+' lessons</span></div>'+
 stages.map(s=>{const list=filtered.filter(l=>l.phase===s.id);if(!list.length)return "";const expanded=S.expanded[s.id]!==false;return '<section class="roadmap-stage"><button class="roadmap-stage-head" data-action="toggle-stage" data-id="'+s.id+'" aria-expanded="'+expanded+'"><span class="stage-count" style="background:'+s.color+'">0'+(s.id+1)+'</span><div><h3>'+escapeHTML(s.title)+'</h3><p>'+escapeHTML(s.subtitle)+'</p></div><span class="right">'+countCompleted(list)+' / '+list.length+' done</span><span class="chevron">'+(expanded?"⌃":"⌄")+'</span></button>'+(expanded?'<div class="lesson-list">'+list.map(l=>'<a href="'+urlLesson(l.id)+'" class="lesson-row"><span class="check-circle '+(S.completed.has(l.id)?"done":"")+'">'+(S.completed.has(l.id)?"✓":"")+'</span><span class="lesson-row-main"><strong>'+titleOf(l)+'</strong><small>'+escapeHTML(l.intuition)+'</small></span><span class="lesson-row-right">'+formatTag(l.track)+'<span class="lesson-time">'+l.minutes+' min</span><span style="color:#a4adbc">›</span></span></a>').join("")+'</div>':"")+'</section>'}).join("");
}
function resourcesHTML(keys){
 return keys.map(id=>{const r=refs[id];if(!r)return "";return '<div class="resource-card"><div class="resource-icon">'+(r.type.toLowerCase().includes("video")?"▶":"▤")+'</div><div style="min-width:0;flex:1"><strong>'+escapeHTML(r.title)+'</strong><p>'+escapeHTML(r.author)+' · '+escapeHTML(r.type)+' · '+escapeHTML(r.level)+'</p>'+(r.url?'<a href="'+escapeHTML(r.url)+'" target="_blank" rel="noopener noreferrer">Open official resource ↗</a>':'<span class="small-label">Textbook · locate chapter by topic</span>')+'</div></div>'}).join("");
}
function lesson(l){
 S.last=l.id;persist();
 const completed=S.completed.has(l.id);
 const prev=lessons[l.order-2],next=lessons[l.order];
 let inner="";
 if(S.lessonTab==="learn"){
 inner='<div class="content-block"><h3>01 / THE INTUITION</h3><p>'+escapeHTML(l.intuition)+'</p></div>'+
 '<div class="content-block"><h3>02 / THE CORE RELATION</h3><div class="formula-box">'+escapeHTML(l.formula)+'</div></div>'+
 '<div class="content-block"><h3>03 / WORK THROUGH AN EXAMPLE</h3><div class="worked-example"><strong>'+escapeHTML(l.example)+'</strong><p>'+escapeHTML(l.solution)+'</p></div></div>'+
 '<div class="content-block"><h3>04 / CONNECT THE DOTS</h3><p>'+(
 l.phase===0?"In IPU, you will manipulate these objects symbolically. In deep learning, they become data, parameters, activations and gradients; the exact same mathematical rules apply.":
 l.phase===1?"For your IPU Unit III exam, practice clean row operations and derivations on paper. For deep learning, interpret what rank, bases and spectra reveal about representations and model stability.":
 l.phase===2?"Try calculating a small numerical example by hand, then reproduce it with NumPy or PyTorch. SVD, projections and conditioning appear throughout regression, embeddings and compression.":
 l.phase===3?"University questions emphasize calculation and theorem conditions. In scientific machine learning these same differential operators express flows, conservation and physical constraints.":
 l.phase===4?"Sketch the full forward computation, label tensor shapes, then derive local derivatives. Finally implement the operation on a tiny PyTorch tensor and compare the gradients.":
 "Read the linked primary source after reproducing a small case from scratch. Focus on assumptions, spectra, numerical stability and one original experiment you can actually run."
 )+'</p></div><div class="content-block"><h3>05 / COMMON MISTAKE</h3><div class="pitfall"><b>Watch out:</b> '+escapeHTML(l.pitfall)+'</div></div>'+
 '<div class="content-block"><h3>WHAT TO DO NEXT</h3><p>Test your understanding with two independent problems: an exam-style computation and a deep-learning interpretation. Then explore the relevant interactive lab or reading.</p><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:15px">'+buttonAction("lesson-practice","Try the two practice tracks →","primary-btn")+'<a href="#labs" class="outline-btn">Open visual labs ◇</a></div></div>';
 }else if(S.lessonTab==="practice"){
 inner='<p class="page-sub" style="margin:0 0 20px">Original questions inspired by standard university mathematics and deep-learning applications. These are not verbatim copyrighted textbook exercises or official previous-year papers.</p>'+
 practiceCard(l,"ipu","IPU · Exam-oriented",l.ipuQ,l.ipuA,"Show the derivation, not just the answer.")+
 practiceCard(l,"dl","Deep learning · Applied",l.dlQ,l.dlA,"Think in terms of shapes, computation and model behavior.")+
 (l.stretch?'<div class="research-prompt"><h4>RESEARCH-LEVEL CHALLENGE</h4><p>'+escapeHTML(l.stretch)+'</p></div>':"")+
 '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap">'+(prev?'<a href="'+urlLesson(prev.id)+'" class="outline-btn">← Previous lesson</a>':'<span></span>')+(next?'<a href="'+urlLesson(next.id)+'" class="primary-btn">Next: '+titleOf(next)+' →</a>':buttonAction("show-roadmap","Back to roadmap","primary-btn"))+'</div>';
 }else{
 const list=l.references||[];
 inner='<p style="font-size:12px;line-height:1.8;color:#818c9e">Each source is curated for this topic. For books without a direct online edition, use the listed topic as the chapter keyword. Exact problem numbers vary by edition.</p>'+
 '<div class="reference-group"><h3>IPU / Mathematical foundations</h3><p>Practice definitions, derivations and short numerical problems in standard university texts.</p>'+resourcesHTML([...new Set([...list.filter(id=>refs[id]&&(refs[id].track==="ipu"||refs[id].track==="both")),"kreyszig","strangbook"])])+'</div>'+
 '<div class="reference-group"><h3>Deep learning / Advanced</h3><p>Cross-check your understanding with numerical algorithms, autograd and primary literature.</p>'+resourcesHTML([...new Set([...list.filter(id=>refs[id]&&(refs[id].track==="dl"||refs[id].track==="both")),"mml","dlbook"])])+'</div>'+
 '<div class="lab-note">Suggested reading focus: <b>'+titleOf(l)+'</b>. Start with a visual explanation, solve the paper exercise, then implement one tiny numerical example. External resources retain their own copyright terms.</div>';
 }
 return '<a href="#roadmap" class="back-link">← BACK TO THE LEARNING MAP</a>'+
 '<div class="lesson-top"><div>'+formatTag(l.track)+' <span class="tag basic">'+escapeHTML(l.level.toUpperCase())+'</span></div><h1>'+titleOf(l)+'</h1><p>'+escapeHTML(l.intuition)+'</p><div class="lesson-meta"><span>◷ '+l.minutes+' min lesson</span><span>▦ Stage '+(l.phase+1)+' of 6</span><span>↗ Lesson '+l.order+' of '+lessons.length+'</span></div></div>'+
 '<div class="lesson-layout"><div class="lesson-main-card"><div class="lesson-tabbar">'+[["learn","Learn & understand"],["practice","Dual practice"],["references","References"]].map(([id,t])=>'<button data-action="lesson-tab" data-id="'+id+'" class="'+(S.lessonTab===id?"active":"")+'">'+t+'</button>').join("")+'</div><div class="lesson-content">'+inner+'</div></div>'+
 '<aside class="learn-toc"><h4>Learning dashboard</h4><p>Understand first, then solve, then apply. Check the lesson off only when you can explain it yourself.</p><div class="side-lesson-meta"><span>Stage</span><strong>'+escapeHTML(stages[l.phase].title)+'</strong></div><div class="side-lesson-meta"><span>Level</span><strong>'+escapeHTML(l.level)+'</strong></div><div class="side-lesson-meta"><span>Practice completed</span><strong>'+["ipu","dl"].filter(t=>S.practiced.has(l.id+"-"+t)).length+' / 2</strong></div><div class="separator"></div><h4>My notes</h4><textarea id="lesson-notes" placeholder="Your explanation, proof idea, mistakes, formulas…">'+escapeHTML(S.notes[l.id]||"")+'</textarea><button class="outline-btn" style="width:100%;margin-top:8px" data-action="save-notes">Save notes ↧</button><button class="'+(completed?"outline-btn":"primary-btn")+'" data-action="mark-complete" data-id="'+l.id+'">'+(completed?"✓ Marked complete · Undo":"✓ Mark lesson complete")+'</button></aside></div>';
}
function practiceCard(l,lane,label,q,a,tip){
 const key=l.id+"-"+lane,shown=!!S.revealed[key],done=S.practiced.has(key);
 return '<div class="question-card"><div class="question-head">'+formatTag(lane)+'<span class="small-label">'+(done?"✓ PRACTICED":"SELF-CHECK")+'</span></div><h3>'+escapeHTML(label)+": "+escapeHTML(q)+'</h3><p>'+escapeHTML(tip)+'</p><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:15px">'+buttonAction("reveal-answer",shown?"Hide solution":"Reveal worked answer","outline-btn",'data-id="'+key+'"')+buttonAction("mark-practiced",done?"✓ Practiced":"Mark attempted","text-link",'data-id="'+key+'"')+'</div>'+(shown?'<div class="answer"><strong>Solution / reasoning</strong><br>'+escapeHTML(a)+'</div>':"")+'</div>';
}
function questionBank(){
 const cats=[["ipu","IPU exam"],["dl","Deep learning"],["research","Research"]];
 const q=S.quiz,available=D.quiz.filter(p=>p.track===q.track),done=q.index>=available.length,item=available[q.index],pct=Math.round(q.index/available.length*100);
 return '<div class="page-kicker">ACTIVE RECALL</div><h1 class="page-title">The question bank<span style="color:#6c75f3">.</span></h1><p class="page-sub">Independent checkpoint questions, with answer reasoning and the lesson to revise. Switch banks any time. For worked numerical problems, use a lesson’s Dual practice tab.</p>'+
 '<div class="page-tools"><div class="tabs">'+cats.map(([key,label])=>'<button class="tab '+(q.track===key?"active":"")+'" data-action="quiz-track" data-id="'+key+'">'+label+'</button>').join("")+'</div><span class="count-pill">'+available.length+' questions</span></div>'+
 '<div class="question-bank"><div class="white-panel">'+
 (done?'<div class="page-kicker">PRACTICE COMPLETE</div><h2 style="font:800 26px Manrope">You scored '+q.score+' / '+available.length+'</h2><p class="page-sub">Review any missed concepts using their linked lessons. Recall grows by returning to a question, not memorizing the option.</p>'+buttonAction("quiz-restart","Practice this bank again ↻","primary-btn"):
 '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><span class="small-label">QUESTION '+(q.index+1)+' OF '+available.length+'</span><span class="tag '+(q.track==="ipu"?"ipu":"dl")+'">'+(q.track==="ipu"?"IPU EXAM":q.track==="dl"?"DEEP LEARNING":"RESEARCH")+'</span></div>'+
 '<div class="quiz-progress" style="margin:16px 0 27px">'+available.map((x,i)=>'<span class="'+(i<q.index?"done":i===q.index?"active":"")+'"></span>').join("")+'</div><h2 style="font:800 19px/1.55 Manrope;margin:0 0 24px">'+escapeHTML(item.question)+'</h2>'+
 item.options.map((o,i)=>'<button data-action="quiz-select" data-id="'+i+'" '+(q.checked?"disabled":"")+' class="quiz-option '+(q.selected===i?"selected ":"")+(q.checked&&i===item.correct?"correct":q.checked&&q.selected===i&&i!==item.correct?"wrong":"")+'"><span class="choice-key">'+String.fromCharCode(65+i)+'</span>'+escapeHTML(o)+'</button>').join("")+
 (q.checked?'<div class="quiz-feedback"><strong>'+(q.selected===item.correct?"Correct!":"Review this concept")+'</strong><br>'+escapeHTML(item.explanation)+'<br><a href="'+urlLesson(item.lesson)+'" style="text-decoration:underline;font-weight:800">Review lesson ↗</a></div>':"")+
 '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:22px"><span class="muted" style="font-size:11px">'+(pct)+'% completed · '+q.score+' correct</span>'+buttonAction(q.checked?"quiz-next":"quiz-check",q.checked?"Next question →":"Check answer →","primary-btn",q.checked?"":q.selected===null?"disabled":"")+'</div>')+
 '</div><aside><div class="white-panel"><div class="eyebrow">HOW TO USE THIS</div><h3 style="font:800 16px Manrope">Build retrieval, not recognition.</h3><p class="page-sub" style="margin:0">Attempt before looking at the explanation. Then solve the linked full problem with pencil and paper or PyTorch.</p><div class="separator"></div><div class="side-lesson-meta" style="display:flex;justify-content:space-between"><span>Questions</span><strong>'+available.length+'</strong></div><div class="side-lesson-meta" style="display:flex;justify-content:space-between"><span>Correct so far</span><strong>'+q.score+'</strong></div><div style="margin-top:20px">'+buttonAction("quiz-restart","↻ Restart bank","outline-btn")+'</div></div></aside></div>';
}
function library(){
 const categories=[
  {id:"ipu",title:"01 / IPU & university mathematics",description:"Your exam computation lane. Use Kreyszig, Shanti Narayan and MIT problem sets for practice.",list:["visual","strang","mitproblems","multivar","openstax","pauls","kreyszig","shanti","strangbook"]},
  {id:"dl",title:"02 / Deep learning mathematics",description:"Move from geometric ideas to matrix calculus, tensor code, differentiation and optimization.",list:["mml","d2l","dlbook","cs231n","mitcalc","matrixcook","axler"]},
  {id:"research",title:"03 / Research source papers",description:"Read the original contributions once the earlier stages feel natural.",list:["transformers","lora","ntk"]}
 ];
 return '<div class="page-kicker">CURATED, LEVELLED READING</div><h1 class="page-title">Reference library<span style="color:#6c75f3">.</span></h1><p class="page-sub">Standard mathematics books, free open courses and primary papers. Every lesson also has its own reading tab. Textbook questions inside EigenPath are newly authored; links to source exercise collections are included.</p>'+
 '<div class="stats-grid" style="margin:0 0 25px">'+statCard("Visual intuition","01","Start here before formulas","◉","blue")+statCard("IPU references","09","University texts + exercises","▣","amber")+statCard("DL references","07","Math + hands-on code","λ","purple")+statCard("Research papers","03","Primary technical sources","∂","mint")+'</div>'+
 categories.map(g=>'<div class="reference-group"><h3>'+g.title+'</h3><p>'+g.description+'</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">'+g.list.map(id=>'<div>'+resourcesHTML([id])+'</div>').join("")+'</div></div>').join("")+
 '<div class="lab-note"><b>Recommended reading order:</b> 3Blue1Brown → MIT 18.06SC / Kreyszig → MML → MIT Matrix Calculus → selected papers. For IPU Unit IV, also work through MIT 18.02SC and OpenStax Calculus Volume 3.</div>';
}
function planner(){
 const weeks=[
  {n:1,name:"See the geometry",desc:"Everyday vector operations, dot products, matrix products, determinants.",filter:l=>l.phase===0},
  {n:2,name:"Solve systems the right way",desc:"Elimination, echelon forms, rank, consistency, linear independence.",filter:l=>l.phase===1&&l.order<=13},
  {n:3,name:"Spaces, spectra & exam fluency",desc:"Bases, dimensions, inverse, eigenvalues, diagonalization, quadratic forms.",filter:l=>l.phase===1&&l.order>13},
  {n:4,name:"Numerical geometry for ML",desc:"Projections, least squares, spectral theorem, PCA, SVD, conditioning.",filter:l=>l.phase===2},
  {n:5,name:"Vector calculus foundations",desc:"Partial derivatives, curves, tangent, gradients, divergence and curl.",filter:l=>l.phase===3&&l.order<=34},
  {n:6,name:"Integral theorems & proof practice",desc:"Line/surface integrals and Green, Stokes and Gauss theorems.",filter:l=>l.phase===3&&l.order>34},
  {n:7,name:"Differentiating neural networks",desc:"Tensor shapes, Jacobians, computation graphs, backprop, softmax.",filter:l=>l.phase===4&&l.order<=48},
  {n:8,name:"Modern deep learning & research",desc:"Optimization, attention, LoRA, normalization and research experiments.",filter:l=>l.phase===4&&l.order>48||l.phase===5}
 ];
 return '<div class="page-kicker">SUSTAINABLE DAILY PRACTICE</div><h1 class="page-title">Your 8-week study plan<span style="color:#6c75f3">.</span></h1><p class="page-sub">An achievable first pass at roughly three hours per study day. IPU topics receive paper-first questions; deep learning topics get numerical and implementation work. Research mastery will extend beyond eight weeks.</p>'+
 '<div class="white-panel" style="margin-bottom:25px"><h3 style="font:800 18px Manrope;margin:0 0 17px">A good three-hour session</h3><div class="stats-grid" style="margin:0">'+statCard("Geometric intuition","30 min","See, sketch, predict","◇","blue")+statCard("Derive core theory","60 min","No memorized magic","∂","purple")+statCard("IPU + DL problems","45 min","Two independent lenses","✎","amber")+statCard("Code + reflection","45 min","NumPy / PyTorch + notes","↗","mint")+'</div></div>'+
 '<div class="planner-grid">'+weeks.map(w=>{const selected=lessons.filter(w.filter),done=countCompleted(selected);return '<div class="week-card"><span class="week-label">WEEK '+String(w.n).padStart(2,"0")+'</span><h3>'+w.name+'</h3><p>'+w.desc+'</p><div class="week-steps">'+done+' / '+selected.length+' mapped lessons completed</div><div class="thin-progress"><div style="width:'+percentage(selected)+'%"></div></div><div class="topic-cloud">'+selected.slice(0,6).map(l=>'<a href="'+urlLesson(l.id)+'">'+titleOf(l)+'</a>').join("")+'</div></div>'}).join("")+'</div><div class="lab-note" style="margin-top:24px">The sequence is a study suggestion, not a promise of research mastery in eight weeks. Revision, proof-writing, past university papers, coding projects and reading primary papers should continue afterward.</div>';
}
function labPage(){
 const labs=[["vectors","Vector transformation"],["descent","Gradient descent"],["backprop","Backprop neuron"]];
 return '<div class="page-kicker">SEE THE EQUATIONS MOVE</div><h1 class="page-title">Interactive math labs<span style="color:#6c75f3">.</span></h1><p class="page-sub">Manipulate the parameters. The visualizations recalculate on your device, connecting numbers to geometry and derivatives.</p><div class="lab-picker">'+labs.map(([id,t])=>'<button class="'+(S.lab===id?"active":"")+'" data-action="lab-tab" data-id="'+id+'">'+t+'</button>').join("")+'</div>'+
 (S.lab==="vectors"?vectorLab():S.lab==="descent"?descentLab():backpropLab());
}
function vectorLab(){
 const [a,b,c,d]=S.mat,[vx,vy]=S.v,tx=a*vx+b*vy,ty=c*vx+d*vy,det=a*d-b*c;
 const ox=250,oy=185,k=40;const p=(x,y)=>(ox+x*k).toFixed(1)+","+(oy-y*k).toFixed(1);
 const arrow=(x,y,color,dash)=>'<line x1="'+ox+'" y1="'+oy+'" x2="'+(ox+x*k)+'" y2="'+(oy-y*k)+'" stroke="'+color+'" stroke-width="3" '+(dash?'stroke-dasharray="6 6"':"")+'/><circle cx="'+(ox+x*k)+'" cy="'+(oy-y*k)+'" r="5" fill="'+color+'"/>';
 let grid="";
 for(let i=-6;i<=6;i++){grid+='<line x1="'+(ox+i*k)+'" y1="0" x2="'+(ox+i*k)+'" y2="370" stroke="#ffffff18"/><line x1="0" y1="'+(oy+i*k)+'" x2="500" y2="'+(oy+i*k)+'" stroke="#ffffff18"/>'}
 const poly=[p(0,0),p(a,c),p(a+b,c+d),p(b,d)].join(" ");
 const inputs=(arr,prefix)=>arr.map((n,i)=>'<input aria-label="'+prefix+(i+1)+'" type="number" step=".1" min="-5" max="5" value="'+n+'" data-lab-field="'+prefix+i+'">').join("");
 return '<div class="lab-grid"><div class="lab-canvas"><svg viewBox="0 0 500 370" role="img" aria-label="Cartesian grid showing matrix transformation of a unit square and vector">'+grid+
 '<line x1="0" y1="'+oy+'" x2="500" y2="'+oy+'" stroke="#8795af" stroke-width="1.5"/><line x1="'+ox+'" y1="0" x2="'+ox+'" y2="370" stroke="#8795af" stroke-width="1.5"/>'+
 '<polygon points="'+[p(0,0),p(1,0),p(1,1),p(0,1)].join(" ")+'" fill="#9eb0ff22" stroke="#a1aafd88" stroke-dasharray="5 5"/><polygon points="'+poly+'" fill="#67deca24" stroke="#70e2cf" stroke-width="2"/>'+
 arrow(1,0,"#9bafff",true)+arrow(0,1,"#9bafff",true)+arrow(a,c,"#77e2d0",false)+arrow(b,d,"#77e2d0",false)+arrow(vx,vy,"#a6aeff",true)+arrow(tx,ty,"#f4b572",false)+
 '<text x="17" y="24" fill="#b3c2db" font-size="12">DASHED = original · SOLID = transformed</text><text x="18" y="344" fill="#8df3d9" font-size="13">A transforms the unit square</text><text x="18" y="361" fill="#ffca8d" font-size="12">orange vector = Av</text></svg></div><div class="lab-control"><div class="page-kicker">LAB 01</div><h3>See a matrix as a function</h3><p>Edit the matrix and input vector. Watch how two basis vectors define the transformation of the whole plane.</p><label>Matrix A (row-major)</label><div class="matrix-inputs">'+inputs(S.mat,"m")+'</div><label>Input vector v</label><div class="matrix-inputs">'+inputs(S.v,"v")+'</div><div class="lab-metrics"><div class="lab-metric"><small>Determinant</small><strong>'+det.toFixed(2)+'</strong></div><div class="lab-metric"><small>Output Av</small><strong style="font-size:15px">('+tx.toFixed(1)+', '+ty.toFixed(1)+')</strong></div></div><div class="lab-note">'+(Math.abs(det)<.00001?"The determinant is zero: the plane collapses to a lower-dimensional set.":"|det(A)|="+Math.abs(det).toFixed(2)+" is the area scale. "+(det<0?"Orientation flips.":"Orientation is preserved."))+'</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">'+buttonAction("lab-preset","Try 90° rotation","outline-btn")+'<a href="'+urlLesson("matrix-transformations")+'" class="text-link">Learn the theory ↗</a></div></div></div>';
}
function descentLab(){
 const {w,eta,steps}=S.gd;let val=w,trajectory=[val];for(let i=0;i<steps;i++){val=val-eta*(2*val);trajectory.push(val)}
 const clamp=x=>Math.max(-5,Math.min(5,x)), X=x=>250+x*42, Y=y=>340-y*5.2;
 let points=[];for(let i=0;i<=100;i++){const v=-5+i/10;points.push(X(v)+","+Y(v*v))}
 const scatter=trajectory.map((v,i)=>'<circle cx="'+X(clamp(v))+'" cy="'+Y(clamp(v*clamp(v)))+'" r="'+(i===0?7:4)+'" fill="'+(i===0?"#ffc482":"#75dfc9")+'" stroke="#131e35" stroke-width="2"/><text x="'+(X(clamp(v))+6)+'" y="'+(Y(v*v)-7)+'" font-size="10" fill="#e4edff">'+i+'</text>').join("");
 return '<div class="lab-grid"><div class="lab-canvas"><svg viewBox="0 0 500 370" role="img" aria-label="Parabola loss function with gradient descent steps"><line x1="35" y1="340" x2="475" y2="340" stroke="#7184a1"/><line x1="250" y1="17" x2="250" y2="347" stroke="#7184a1"/><polyline points="'+points.join(" ")+'" fill="none" stroke="#8294ff" stroke-width="3"/>'+scatter+'<text x="23" y="30" fill="#d5e3ff" font-size="13">L(w)=w²</text><text x="360" y="30" fill="#99a8c2" font-size="11">η controls step size</text><text x="414" y="358" fill="#99a8c2" font-size="12">w →</text></svg></div><div class="lab-control"><div class="page-kicker">LAB 02</div><h3>Descend the loss surface</h3><p>For the simple loss L(w)=w², the gradient is 2w. Each update is w ← w − η·2w. Observe convergence or divergence.</p><label>Starting weight: <strong>'+w.toFixed(1)+'</strong></label><input type="range" min="-4" max="4" step=".2" value="'+w+'" data-lab-field="gd-w"><label>Learning rate η: <strong>'+eta.toFixed(2)+'</strong></label><input type="range" min=".01" max="1.35" step=".01" value="'+eta+'" data-lab-field="gd-eta"><label>Number of updates: <strong>'+steps+'</strong></label><input type="range" min="1" max="16" step="1" value="'+steps+'" data-lab-field="gd-steps"><div class="lab-metrics"><div class="lab-metric"><small>Initial loss</small><strong>'+(w*w).toFixed(2)+'</strong></div><div class="lab-metric"><small>Final loss</small><strong>'+((val*val)<100000?(val*val).toFixed(3):"very large")+'</strong></div></div><div class="lab-note">For L(w)=w², gradient descent converges to 0 when 0&lt;η&lt;1 (from nonzero initial weight). Try η above 1 and watch the steps oscillate and grow.</div><a href="'+urlLesson("gradient-descent")+'" class="outline-btn" style="margin-top:16px">Study optimization ↗</a></div></div>';
}
function bpCalc(){
 const p=S.bp,z=p.x1*p.w1+p.x2*p.w2+p.b,a=1/(1+Math.exp(-z)),L=.5*(a-p.y)**2,dz=(a-p.y)*a*(1-a);
 return {z,a,L,dz,dw1:dz*p.x1,dw2:dz*p.x2,db:dz};
}
function backpropLab(){
 const p=S.bp,n=bpCalc(),r=v=>Number(v).toFixed(4);
 return '<div class="lab-grid"><div class="lab-canvas"><svg viewBox="0 0 500 370" role="img" aria-label="Two input sigmoid neuron with forward and reverse gradients"><g stroke="#99a9ff" stroke-width="3"><path d="M90 115L256 184"/><path d="M90 257L256 184"/></g><path d="M289 184L420 184" stroke="#71d9c6" stroke-width="3"/><circle cx="75" cy="115" r="39" fill="#27345a" stroke="#9dadf5" stroke-width="2"/><circle cx="75" cy="257" r="39" fill="#27345a" stroke="#9dadf5" stroke-width="2"/><circle cx="259" cy="184" r="43" fill="#3c427d" stroke="#adb7ff" stroke-width="2"/><circle cx="435" cy="184" r="38" fill="#276465" stroke="#7ce1cf" stroke-width="2"/><g fill="#fff" font-size="15" text-anchor="middle" font-family="Arial"><text x="75" y="120">x₁='+p.x1+'</text><text x="75" y="262">x₂='+p.x2+'</text><text x="259" y="189">σ(z)</text><text x="435" y="189">'+r(n.a)+'</text></g><g fill="#c5cfff" font-size="13"><text x="137" y="135">w₁='+p.w1.toFixed(2)+'</text><text x="139" y="244">w₂='+p.w2.toFixed(2)+'</text><text x="211" y="125">z='+r(n.z)+'</text></g><text x="25" y="31" fill="#b7c5e2" font-size="14">FORWARD → prediction & loss</text><text x="25" y="354" fill="#7ce1cf" font-size="14">← BACKWARD: dL/dwᵢ = dL/dz · xᵢ</text></svg></div><div class="lab-control"><div class="page-kicker">LAB 03</div><h3>A complete backprop step</h3><p>Single sigmoid neuron, squared-error loss. Change weights, inspect the exact chain-rule gradients, and apply one gradient-descent update.</p><div class="mini-field-grid">'+["x1","x2","w1","w2","b","y"].map(n=>'<label>'+n+'<input data-lab-field="bp-'+n+'" type="number" step=".25" value="'+p[n]+'"></label>').join("")+'</div><label>Learning rate η <strong>'+p.eta.toFixed(2)+'</strong></label><input type="range" data-lab-field="bp-eta" min=".05" max="2" step=".05" value="'+p.eta+'"><div class="lab-metrics"><div class="lab-metric"><small>Activation a</small><strong>'+r(n.a)+'</strong></div><div class="lab-metric"><small>Loss ½(a−y)²</small><strong>'+r(n.L)+'</strong></div><div class="lab-metric"><small>∂L/∂w₁</small><strong>'+r(n.dw1)+'</strong></div><div class="lab-metric"><small>∂L/∂w₂</small><strong>'+r(n.dw2)+'</strong></div></div><div class="lab-note">dL/dz = (a−y)a(1−a) = '+r(n.dz)+'. dL/db = '+r(n.db)+'. These are exact gradients for the displayed objective.</div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:16px">'+buttonAction("bp-step","Apply one SGD step →","primary-btn")+'<a href="'+urlLesson("backprop-from-scratch")+'" class="text-link">Full derivation ↗</a></div></div></div>';
}
function updateSidebar(){
 $("#sidebar-percent").textContent=percentage(lessons)+"%";
 $("#sidebar-progress-fill").style.width=percentage(lessons)+"%";
 $("#sidebar-progress-caption").textContent=S.completed.size+" of "+lessons.length+" lessons completed";
}
function router(){
 const route=decodeURIComponent((location.hash||"#dashboard").slice(1)),[page,arg]=route.split("/");
 const view=$("#view");let html="",name="Your learning workspace";
 if(page==="roadmap"){html=roadmap();name="Roadmap / Unified syllabus"}
 else if(page==="lesson"){const l=lessons.find(x=>x.id===arg);if(l){html=lesson(l);name="Lesson / "+l.title}else{html=roadmap();name="Roadmap / Not found"}}
 else if(page==="practice"){html=questionBank();name="Practice / Question bank"}
 else if(page==="labs"){html=labPage();name="Explore / Interactive labs"}
 else if(page==="resources"){html=library();name="Library / Trusted references"}
 else if(page==="planner"){html=planner();name="Planner / Eight weeks"}
 else{html=dashboard();name="Your learning workspace"}
 view.innerHTML=html;$("#breadcrumb").textContent=name;
 document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===(page==="lesson"?"roadmap":page||"dashboard")));
 updateSidebar();$("#sidebar").classList.remove("open");
 window.scrollTo({top:0,behavior:"instant"});
}
function navigate(page){if(location.hash==="#"+page){router()}else location.hash="#"+page}
function changeQuizTrack(track){S.quiz={track,index:0,selected:null,checked:false,score:0,seen:0};router()}
function inputHandler(e){
 const el=e.target;
 if(el.id==="global-search"){const q=el.value.trim().toLowerCase(),results=$("#search-results");if(!q){results.classList.add("hidden");results.innerHTML="";return}const found=lessons.filter(l=>(l.title+" "+l.intuition+" "+stages[l.phase].title).toLowerCase().includes(q)).slice(0,9);
 results.innerHTML=(found.length?found.map(l=>'<a href="'+urlLesson(l.id)+'" class="search-result"><span>'+titleOf(l)+'</span><small>Stage '+(l.phase+1)+'</small></a>').join(""):'<div class="empty-state">No matching lessons</div>');results.classList.remove("hidden")}
 if(el.id==="lesson-notes"){const id=location.hash.split("/")[1];S.notes[id]=el.value;persist()}
 if(el.dataset.labField){
 const k=el.dataset.labField,number=Number(el.value);
 if(!Number.isFinite(number))return;
 if(k.startsWith("m"))S.mat[Number(k[1])]=number;
 else if(k==="v0"||k==="v1")S.v[Number(k[1])]=number;
 else if(k.startsWith("gd-"))S.gd[k.slice(3)]=number;
 else if(k.startsWith("bp-"))S.bp[k.slice(3)]=number;
 if(el.type==="range")router();
 }
}
document.addEventListener("input",inputHandler);
document.addEventListener("change",e=>{if(e.target.dataset.labField&&e.target.type==="number")router()});
document.addEventListener("click",e=>{
 const a=e.target.closest("[data-action]");
 if(e.target.closest("#menu-btn")){$("#sidebar").classList.toggle("open");return}
 if(e.target.closest("#quick-focus")){navigate("lesson/"+nextLesson().id);return}
 if(e.target.closest("#export-btn")){
 const backup={product:"EigenPath",version:1,exportedAt:new Date().toISOString(),completed:[...S.completed],practiced:[...S.practiced],notes:S.notes};
 const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="eigenpath-study-progress.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Progress exported");return;
 }
 const stageLink=e.target.closest("[data-go-stage]");
 if(stageLink){const id=+stageLink.dataset.goStage;S.filter="all";S.expanded={};for(const s of stages)S.expanded[s.id]=(s.id===id); if(location.hash==="#roadmap")router();return}
 if(!a){if(e.target.closest(".search-result")){$("#global-search").value="";$("#search-results").classList.add("hidden")}return}
 const action=a.dataset.action,id=a.dataset.id;
 switch(action){
 case "show-roadmap":navigate("roadmap");break;
 case "show-planner":navigate("planner");break;
 case "continue":S.lessonTab="learn";navigate("lesson/"+nextLesson().id);break;
 case "road-filter":S.filter=id;router();break;
 case "toggle-stage":S.expanded[id]=S.expanded[id]===false;router();break;
 case "lesson-tab":S.lessonTab=id;router();break;
 case "lesson-practice":S.lessonTab="practice";router();break;
 case "mark-complete":if(S.completed.has(id)){S.completed.delete(id);toast("Marked as not complete")}else{S.completed.add(id);toast("Lesson completed ✓")}persist();router();break;
 case "reveal-answer":S.revealed[id]=!S.revealed[id];router();break;
 case "mark-practiced":if(S.practiced.has(id))S.practiced.delete(id);else S.practiced.add(id);persist();router();break;
 case "save-notes":persist();toast("Notes saved on this device");break;
 case "quiz-track":changeQuizTrack(id);break;
 case "quiz-select":if(!S.quiz.checked){S.quiz.selected=+id;router()}break;
 case "quiz-check":{const q=S.quiz,items=D.quiz.filter(p=>p.track===q.track);if(q.selected===null)return;if(!q.checked){q.checked=true;q.seen++;if(q.selected===items[q.index].correct)q.score++;router()}break}
 case "quiz-next":S.quiz.index++;S.quiz.checked=false;S.quiz.selected=null;router();break;
 case "quiz-restart":changeQuizTrack(S.quiz.track);break;
 case "lab-tab":S.lab=id;router();break;
 case "lab-preset":S.mat=[0,-1,1,0];S.v=[2,1];router();break;
 case "bp-step":{const n=bpCalc(),p=S.bp;p.w1-=p.eta*n.dw1;p.w2-=p.eta*n.dw2;p.b-=p.eta*n.db;router();toast("Applied one gradient-descent update");break}
 }
});
document.querySelectorAll("[data-track]").forEach(b=>b.addEventListener("click",()=>{S.filter=b.dataset.track==="ipu"?"unit3":b.dataset.track;navigate("roadmap")}));
$("#global-search").addEventListener("keydown",e=>{
 if(e.key==="Escape"){$("#global-search").value="";$("#search-results").classList.add("hidden");e.currentTarget.blur()}
 if(e.key==="Enter"){const first=$("#search-results .search-result");if(first){location.hash=first.getAttribute("href");$("#global-search").value="";$("#search-results").classList.add("hidden")}}
});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#global-search").focus()}});
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap")&&!e.target.closest(".search-results"))$("#search-results").classList.add("hidden")});
window.addEventListener("hashchange",()=>{S.lessonTab="learn";router()});
router();
})();