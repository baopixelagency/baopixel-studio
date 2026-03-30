'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
type Tab = 'dashboard'|'pipeline'|'agenda'|'preprod'|'tresorerie'|'editorial'|'idees'|'veille'|'guide'|'reporting'|'decks'|'motivation'|'equip'
interface Client { id:string; nom:string; secteur:string; pack:string; montant:number; statut:string; contact:string; paiement:string; notes:string; pipeline_stage:string }
interface Task { id:string; titre:string; type:string; priorite:string; statut:string; date:string; client:string; notes:string; heure?:string }
interface Gain { id:string; label:string; type:string; montant:number; mois:string; date:string; notes:string }
interface Depense { id:string; label:string; type:string; montant:number; mois:string; date:string; notes:string }
interface Content { id:string; titre:string; pilier:string; format:string; plateforme:string; statut:string; semaine:string; date?:string; notes?:string }
interface Idea { id:string; titre:string; description:string; pilier:string; plateforme:string; date:string; statut:string }
interface Equipment { id:string; nom:string; cat:string; statut:string; valeur:number; usage:string }
interface PreProd { id:string; titre:string; client:string; date:string; lieu:string; statut:string; checklist:string[]; notes:string; equipe:string[] }
interface Devis { id:string; ref:string; client:string; date:string; validite:string; lignes:{desc:string;qte:number;pu:number}[]; statut:string; notes:string }
interface Motivation { quotes:string[]; streak:number; lastDay:string; objectifs:string[]; affirmations:string[] }
interface ReportEntry { id:string; client:string; mois:string; followers:number; reach:number; engagement:number; posts:number; notes:string }

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
const uid = () => `${Date.now()}-${Math.floor(Math.random()*9999)}`
const fmtF = (n:number) => Number(n||0).toLocaleString('fr-FR')+' FCFA'
const fmtK = (n:number) => n>=1000000?`${(n/1000000).toFixed(1)}M`:n>=1000?`${(n/1000).toFixed(0)}k`:`${n}`
const todayStr = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const curMo = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
const FR_M = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const FR_D = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const daysTo = (d:string) => d?Math.round((new Date(d).getTime()-new Date(todayStr()).getTime())/86400000):999
const dlabel = (d:string) => { if(!d)return''; const diff=daysTo(d); if(diff===0)return"Aujourd'hui"; if(diff===1)return'Demain'; if(diff===-1)return'Hier'; const dt=new Date(d); return dt.getDate()+' '+FR_M[dt.getMonth()].substring(0,3) }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stGet(k:string,fb:any):any{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):fb}catch{return fb}}
function stSet(k:string,v:unknown){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const ST={get:stGet,set:stSet}

// AI Helper
const askAI = async (prompt:string, system?:string):Promise<string> => {
  try {
    const r = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,system})})
    const d = await r.json()
    return d.text||'Réponse indisponible.'
  } catch { return 'Erreur de connexion IA.' }
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════
const DEF_CLIENTS:Client[] = [
  {id:'c1',nom:'Detmine Immo',secteur:'Immobilier',pack:'Pack Woyofal',montant:150000,statut:'Actif',contact:'+221 77 000 00 00',paiement:'Début mois',notes:'Weekend shooting mensuel — 3 vidéos + 2 biens/mois',pipeline_stage:'Actif'},
  {id:'c2',nom:'So Suite Hôtel',secteur:'Hospitalité',pack:'Pack Woyofal H',montant:200000,statut:'Prospect chaud',contact:'+221 77 000 00 01',paiement:'—',notes:'Relance WhatsApp urgente — RDV à fixer',pipeline_stage:'RDV Fixé'},
  {id:'c3',nom:'NaySeet Cosmetics',secteur:'Bien-être',pack:'Pack Sama',montant:120000,statut:'Prospect',contact:'',paiement:'—',notes:'TikTok influencer — devis identité visuelle envoyé',pipeline_stage:'Devis Envoyé'},
]
const DEF_TASKS:Task[] = [
  {id:'t1',titre:'Corriger devis NaySeet',type:'Tâche',priorite:'Urgent',statut:'Todo',date:todayStr(),client:'NaySeet',notes:'TTC 519 200 FCFA'},
  {id:'t2',titre:'Relance WhatsApp So Suite Hôtel',type:'Tâche',priorite:'Urgent',statut:'Todo',date:todayStr(),client:'So Suite',notes:''},
  {id:'t3',titre:'Shooting terrain Detmine Immo',type:'Tournage',priorite:'Normal',statut:'Todo',date:'2026-04-05',client:'Detmine Immo',notes:'Drone + sol + photos — 2 biens'},
  {id:'t4',titre:'Rapport mensuel Detmine',type:'Livraison',priorite:'Normal',statut:'Todo',date:'2026-04-28',client:'Detmine Immo',notes:''},
  {id:'t5',titre:'RDV présentation So Suite',type:'RDV',priorite:'Normal',statut:'Todo',date:'2026-04-08',client:'So Suite',notes:'Préparer proposition 200k',heure:'10:00'},
]
const DEF_GAINS:Gain[] = [
  {id:'g1',label:'Detmine Immo — Avr 2026',type:'Récurrent client',montant:150000,mois:'2026-04',date:'2026-04-01',notes:'✅ Reçu'},
]
const DEF_DEPENSES:Depense[] = [
  {id:'d1',label:'Déplacements terrain',type:'Charge fixe',montant:30000,mois:'2026-04',date:'2026-04-01',notes:''},
  {id:'d2',label:'Abonnements outils',type:'Charge fixe',montant:15000,mois:'2026-04',date:'2026-04-01',notes:'Meta, Drive, etc.'},
]
const DEF_CONTENT:Content[] = [
  {id:'co1',titre:'Reel BTS — Shooting Detmine',pilier:'Montrer',format:'Reel 30s',plateforme:'Instagram',statut:'À créer',semaine:'S1'},
  {id:'co2',titre:'3 erreurs photo des agences immo',pilier:'Éduquer',format:'Carrousel',plateforme:'Instagram',statut:'À créer',semaine:'S1'},
  {id:'co3',titre:'Face cam — Qui je suis',pilier:'Personal Brand',format:'Reel 60s',plateforme:'Instagram',statut:'À planifier',semaine:'S2'},
  {id:'co4',titre:'Résultat avant/après Detmine',pilier:'Prouver',format:'Voix off',plateforme:'IG+FB',statut:'À planifier',semaine:'S3'},
]
const DEF_IDEAS:Idea[] = [
  {id:'i1',titre:'Vidéo "Journée type d\'une agence à Mbour"',description:'Montrer le quotidien terrain — drone, montage, client',pilier:'Montrer',plateforme:'TikTok',date:todayStr(),statut:'À développer'},
  {id:'i2',titre:'Série "La Petite-Côte en images"',description:'Valoriser le territoire et attirer clients hôtels/restaurants',pilier:'Prouver',plateforme:'Instagram',date:todayStr(),statut:'À développer'},
]
const DEF_EQUIP:Equipment[] = [
  {id:'e1',nom:'iPhone 14 Pro',cat:'Caméra',statut:'Disponible',valeur:400000,usage:'Tournage 4K, ProRAW'},
  {id:'e2',nom:'DJI Mini 3',cat:'Drone',statut:'Disponible',valeur:350000,usage:'Vues aériennes'},
  {id:'e3',nom:'DJI Osmo Mobile 7',cat:'Stabilisateur',statut:'Disponible',valeur:80000,usage:'Walking tour stabilisé'},
  {id:'e4',nom:'PC Bureau',cat:'Post-production',statut:'Disponible',valeur:500000,usage:'Montage, étalonnage'},
  {id:'e5',nom:'MacBook (occasion)',cat:'Mobilité',statut:'À acquérir',valeur:350000,usage:'Montage terrain'},
  {id:'e6',nom:'Sony A7IV',cat:'Caméra Pro',statut:'Planifié',valeur:1200000,usage:'Qualité cinéma'},
]
const DEF_PREPROD:PreProd[] = [
  {id:'pp1',titre:'Shooting Detmine — Résidence Saly',client:'Detmine Immo',date:'2026-04-05',lieu:'Saly Portudal',statut:'Préparation',notes:'2 biens — appartement T3 + villa',equipe:['Norta (caméra)','Drone'],checklist:['Batteries chargées','Cartes SD formatées','Drone calibré','Checklist lieu','Contrat signé']},
]
const DEF_DEVIS:Devis[] = [
  {id:'dv1',ref:'DEV-2026-BTP-001',client:'Detmine Immo',date:'2026-04-01',validite:'2026-05-01',lignes:[{desc:'Shooting photo bien immobilier',qte:1,pu:75000},{desc:'Vidéo présentation 60s',qte:1,pu:120000},{desc:'Drone (vues aériennes)',qte:1,pu:50000}],statut:'Envoyé',notes:'Pack mensuel — 2 biens'},
]
const DEF_REPORTS:ReportEntry[] = [
  {id:'r1',client:'Detmine Immo',mois:'2026-03',followers:1240,reach:8500,engagement:4.2,posts:12,notes:'Bon mois, +120 followers'},
]
const DEF_MOTIVATION:Motivation = {
  quotes:['L\'excellence n\'est pas un acte, c\'est une habitude. — Aristote','Le succès, c\'est d\'aller d\'échec en échec sans perdre son enthousiasme. — Churchill','Votre temps est limité, ne le gâchez pas. — Steve Jobs'],
  streak:0,lastDay:'',
  objectifs:['Signer So Suite Hôtel avant fin avril','Atteindre 700k FCFA CA mensuel','Publier 3 contenus/semaine minimum','Acquérir MacBook occasion'],
  affirmations:['BaoPixel est l\'agence de référence de la Petite-Côte','Je livre une qualité cinéma à chaque tournage','Ma créativité a de la valeur']
}

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const PIPELINE_STAGES = ['Prospect Froid','Prospect Chaud','RDV Fixé','Devis Envoyé','Négociation','Signé','Actif']
const STAGE_COLORS:Record<string,string> = {
  'Prospect Froid':'#3A3530','Prospect Chaud':'#F97316','RDV Fixé':'#60A5FA',
  'Devis Envoyé':'#A78BFA','Négociation':'#F59E0B','Signé':'#10B981','Actif':'#10B981'
}
const PILIER_COLORS:Record<string,string> = {
  'Montrer':'#C084FC','Éduquer':'#60A5FA','Prouver':'#10B981','Personal Brand':'#F97316','Vendre':'#EF4444','Inspirer':'#F59E0B'
}
const SECTEUR_COLORS:Record<string,string> = {
  'Immobilier':'#A78BFA','Hospitalité':'#60A5FA','Bien-être':'#10B981','Restauration':'#F97316','BTP':'#F59E0B','Mode':'#F472B6'
}
const MODULES = [
  {id:'dashboard',label:'Dashboard',icon:'⬡'},{id:'pipeline',label:'Pipeline CRM',icon:'◈'},
  {id:'agenda',label:'Agenda & RDV',icon:'◷'},{id:'preprod',label:'Pré-Production',icon:'▶'},
  {id:'tresorerie',label:'Trésorerie',icon:'◆'},{id:'editorial',label:'Calendrier Éditorial',icon:'▦'},
  {id:'idees',label:'Idées Contenu',icon:'◉'},{id:'veille',label:'Veille IA',icon:'✦'},
  {id:'guide',label:'Guide Algo',icon:'♦'},{id:'reporting',label:'Reporting',icon:'▲'},
  {id:'decks',label:'Decks & Docs',icon:'▣'},{id:'motivation',label:'Motivation',icon:'⚡'},
  {id:'equip',label:'Équipement',icon:'◈'},
]

// UI Component Styles are now in globals.css with CSS classes

function Badge({label,color,bg}:{label:string;color?:string;bg?:string}){
  return <span className="badge" style={color || bg ? {background:bg||'var(--brand-primary)',color:color||'white'} : {}}>{label}</span>
}

function Btn({children,onClick,variant='purple',sm}:{children:React.ReactNode;onClick?:()=>void;variant?:'purple'|'orange'|'ghost'|'danger';sm?:boolean}){
  const variantClass = variant==='purple'?'btn-primary':variant==='orange'?'btn-primary':variant==='danger'?'btn-danger':'btn-secondary'
  return <button className={`${variantClass}${sm?' btn-sm':''}`} onClick={onClick}>{children}</button>
}

function Input({label,value,onChange,type='text',placeholder,rows}:{label?:string;value:string;onChange:(v:string)=>void;type?:string;placeholder?:string;rows?:number}){
  return <div className="mb-md">
    {label&&<label className="section-label">{label}</label>}
    {rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className="input" style={{resize:'vertical'}}/>
    :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="input"/>}
  </div>
}

function Select({label,value,onChange,opts}:{label?:string;value:string;onChange:(v:string)=>void;opts:string[]}){
  return <div className="mb-md">
    {label&&<label className="section-label">{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} className="input" style={{background:'var(--surface-bg)'}}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
}

function Modal({title,onClose,children,wide}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
  return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:40,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="card" style={{width:'100%',maxWidth:wide?720:500,maxHeight:'90vh',overflow:'auto'}}>
      <div className="flex-between mb-lg">
        <span className="heading-lg">{title}</span>
        <button onClick={onClose} className="btn-ghost" style={{fontSize:22,padding:8}}>✕</button>
      </div>
      <div>{children}</div>
    </div>
  </div>
}

function StatBox({label,val,sub,color}:{label:string;val:string|number;sub?:string;color?:string}){
  return <div className="card">
    <div className="section-label">{label}</div>
    <div className="heading-xl" style={{color:color||'var(--text-primary)',marginBottom:4}}>{val}</div>
    {sub&&<div className="text-muted text-sm">{sub}</div>}
  </div>
}

function Spinner(){
  return <span className="spin" style={{display:'inline-block',width:16,height:16,border:'2px solid var(--surface-border)',borderTopColor:'var(--brand-primary)',borderRadius:'50%'}}/>
}

function ProgressBar({val,color,height=6}:{val:number;color?:string;height?:number}){
  return <div style={{background:'var(--surface-bg)',borderRadius:'var(--radius-md)',height,overflow:'hidden'}}>
    <div style={{height:'100%',width:`${Math.min(100,val)}%`,background:color||'linear-gradient(90deg,var(--brand-primary),var(--brand-secondary))',borderRadius:'var(--radius-md)',transition:'width var(--trans-slow)'}}/>
  </div>
}

function EmptyState({msg,icon}:{msg:string;icon?:string}){
  return <div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted)',fontSize:13}}>
    {icon&&<div style={{fontSize:36,marginBottom:12}}>{icon}</div>}
    {msg}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({clients,tasks,gains,depenses,goal,goTab}:{clients:Client[];tasks:Task[];gains:Gain[];depenses:Depense[];goal:number;goTab:(t:Tab)=>void}){
  const now=new Date(),tStr=todayStr()
  const ca=gains.filter(g=>g.mois===curMo()).reduce((s,g)=>s+g.montant,0)
  const dep=depenses.filter(d=>d.mois===curMo()&&d.type!=='Investissement').reduce((s,d)=>s+d.montant,0)
  const net=ca-dep,pct=Math.min(100,Math.round(ca/goal*100))
  const activeC=clients.filter(c=>c.statut==='Actif').length
  const hotC=clients.filter(c=>c.statut==='Prospect chaud').length
  const urgT=tasks.filter(t=>t.priorite==='Urgent'&&t.statut!=='Fait')
  const todayT=tasks.filter(t=>t.date===tStr&&t.statut!=='Fait')
  const lateT=tasks.filter(t=>t.date&&t.date<tStr&&t.statut!=='Fait')
  const upcomT=tasks.filter(t=>t.date>tStr&&t.statut!=='Fait').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6)
  const greet=now.getHours()<12?'Bonjour':'Bon après-midi'
  const motQuotes=['La Petite-Côte mérite la meilleure agence — c\'est BaoPixel.','Chaque tournage est une opportunité de prouver votre excellence.','La régularité bat le talent. Soyez régulier.']
  const todayQuote=motQuotes[now.getDay()%motQuotes.length]
  const TICON:Record<string,string>={Tournage:'🎬',RDV:'📅',Livraison:'📦',Tâche:'✦'}

  return <div className="fade-up">
    <div className="card" style={{background:'linear-gradient(135deg,var(--purple-s2),var(--purple-s))',border:'1px solid rgba(124,58,237,.3)',marginBottom:16,padding:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:800}}>{greet} 👋</div>
          <div style={{color:'var(--muted)',marginTop:4}}>{FR_D[now.getDay()]} {now.getDate()} {FR_M[now.getMonth()]} {now.getFullYear()} · BaoPixel Petite-Côte</div>
        </div>
        <div className="surface" style={{padding:'12px 18px',maxWidth:360}}>
          <div style={{fontSize:11,color:'var(--purple-l)',fontWeight:700,marginBottom:4}}>💡 CITATION DU JOUR</div>
          <div style={{fontSize:13,color:'var(--text)',fontStyle:'italic'}}>"{todayQuote}"</div>
        </div>
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
      <StatBox label="Clients actifs" val={activeC} sub="Objectif : 4 clients" color="var(--purple-l)"/>
      <StatBox label={`CA ${FR_M[now.getMonth()].substring(0,4)}.`} val={fmtK(ca)+' FCFA'} sub={`Net : ${fmtK(net)} FCFA`} color="var(--green)"/>
      <div className="card" style={{padding:'16px 18px'}}>
        <div className="section-label" style={{marginBottom:8}}>Objectif mensuel</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:'var(--purple-l)',marginBottom:8}}>{pct}%</div>
        <ProgressBar val={pct}/>
        <div className="text-muted" style={{marginTop:6}}>{fmtK(goal)} FCFA visés</div>
      </div>
      <StatBox label="Prospects chauds" val={hotC} sub={`${hotC>0?'Action requise':'Pipeline à remplir'}`} color="var(--orange)"/>
    </div>

    {urgT.length>0&&<div className="card" style={{border:'1px solid rgba(239,68,68,.3)',marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
        <span className="pulse" style={{width:8,height:8,background:'var(--red)',borderRadius:'50%',display:'inline-block'}}/>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:13,color:'var(--red)'}}>ACTIONS URGENTES</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {urgT.map(t=><div key={t.id} style={{background:'var(--red-s)',border:'1px solid rgba(239,68,68,.2)',borderRadius:10,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontWeight:600}}>{t.titre}</div><div className="text-muted">{t.client}{t.date?` · ${dlabel(t.date)}`:''}</div></div>
          <Badge label="URGENT" color="var(--red)" bg="var(--red-s)"/>
        </div>)}
      </div>
    </div>}

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14}}>📌 Aujourd'hui</span>
          <span className="text-muted">{todayT.length} tâche(s)</span>
        </div>
        {lateT.length>0&&<div className="text-muted" style={{color:'var(--red)',marginBottom:8,fontSize:12}}>⚠️ {lateT.length} tâche(s) en retard</div>}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {todayT.length===0?<EmptyState msg="✅ Aucune tâche aujourd'hui"/>
          :todayT.map(t=><div key={t.id} style={{background:'var(--purple-s)',border:'1px solid rgba(124,58,237,.2)',borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span>{TICON[t.type]||'✦'}</span>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{t.titre}</div><div className="text-muted">{t.client}</div></div>
          </div>)}
        </div>
        <button className="btn-primary btn-sm" style={{marginTop:12}} onClick={()=>goTab('agenda')}>Gérer →</button>
      </div>

      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14}}>📆 Prochains RDV</span>
          <span className="text-muted">{upcomT.length} à venir</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {upcomT.length===0?<EmptyState msg="Calendrier vide"/>
          :upcomT.map(t=>{
            const d=daysTo(t.date),urg=d<=2
            return <div key={t.id} className="surface" style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:800,background:urg?'var(--orange)':'var(--purple-s)',color:urg?'#fff':'var(--purple-l)',padding:'3px 8px',borderRadius:20,whiteSpace:'nowrap'}}>{dlabel(t.date)}</span>
              <span>{TICON[t.type]||'✦'}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.titre}</div><div className="text-muted">{t.client}</div></div>
            </div>
          })}
        </div>
        <button className="btn-primary btn-sm" style={{marginTop:12}} onClick={()=>goTab('agenda')}>Voir calendrier →</button>
      </div>
    </div>

    {/* Quick triggers */}
    <div className="card">
      <div className="section-label" style={{marginBottom:12}}>⚡ ACTIONS RAPIDES</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
        <Btn onClick={()=>goTab('pipeline')} variant="purple" sm>◈ Nouveau prospect</Btn>
        <Btn onClick={()=>goTab('preprod')} variant="ghost" sm>🎬 Créer dossier tournage</Btn>
        <Btn onClick={()=>goTab('tresorerie')} variant="ghost" sm>◆ Générer devis</Btn>
        <Btn onClick={()=>goTab('editorial')} variant="ghost" sm>▦ Planifier contenu</Btn>
        <Btn onClick={()=>goTab('idees')} variant="ghost" sm>💡 Capturer idée</Btn>
        <Btn onClick={()=>goTab('veille')} variant="orange" sm>✦ Veille IA</Btn>
      </div>
    </div>

    {/* Semaine type */}
    <div className="card" style={{marginTop:14}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,marginBottom:14}}>📅 Semaine type BaoPixel</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
        {[
          {d:'LUN',m:'🎬 Production',a:'✍️ Contenu'},
          {d:'MAR',m:'🎬 Production',a:'📞 Prospection'},
          {d:'MER',m:'✂️ Montage',a:'📦 Livraisons'},
          {d:'JEU',m:'✂️ Retouche',a:'🧾 Admin/Devis'},
          {d:'VEN',m:'🧠 Stratégie',a:'📊 Bilan'},
        ].map(({d,m,a})=><div key={d}>
          <div style={{textAlign:'center',background:'var(--purple)',borderRadius:8,padding:'5px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:11,marginBottom:6}}>{d}</div>
          <div style={{background:'var(--purple-s)',borderRadius:8,padding:'7px 9px',fontSize:11,marginBottom:5,color:'var(--purple-l)',minHeight:40}}><div style={{opacity:.6,fontSize:9,marginBottom:2}}>Matin</div>{m}</div>
          <div style={{background:'var(--surface)',borderRadius:8,padding:'7px 9px',fontSize:11,color:'var(--muted)',minHeight:40}}><div style={{opacity:.6,fontSize:9,marginBottom:2}}>Après-midi</div>{a}</div>
        </div>)}
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: PIPELINE CRM
// ═══════════════════════════════════════════════════════════════
function Pipeline({clients,setClients}:{clients:Client[];setClients:(c:Client[])=>void}){
  const [modal,setModal]=useState<null|'add'|'edit'|'whatsapp'>(null)
  const [sel,setSel]=useState<Client|null>(null)
  const [dragId,setDragId]=useState<string|null>(null)
  const [form,setForm]=useState<Partial<Client>>({pipeline_stage:'Prospect Froid',secteur:'Immobilier',pack:'Pack Woyofal',statut:'Prospect',montant:0})

  const saveClient=()=>{
    if(!form.nom)return
    if(sel){setClients(clients.map(c=>c.id===sel.id?{...c,...form} as Client:c))}
    else{setClients([...clients,{...form,id:uid()} as Client])}
    setModal(null);setForm({pipeline_stage:'Prospect Froid',secteur:'Immobilier',pack:'Pack Woyofal',statut:'Prospect',montant:0})
  }

  const SCRIPTS:Record<string,string>={
    'Prospect Froid':`Bonjour {{nom}} 👋\n\nJe suis Norta de BaoPixel Digital Agency, basée à Mbour. Nous aidons les entreprises de la Petite-Côte à dominer leur présence visuelle (photo, vidéo, drone, réseaux).\n\nVous seriez intéressé par un appel de 15min cette semaine ?`,
    'Prospect Chaud':`Bonjour {{nom}} 👋\n\nSuite à notre échange — je voulais revenir vers vous. Nos packs démarrent à 150 000 FCFA/mois avec livraison chaque semaine.\n\nQuand êtes-vous disponible pour un RDV ?`,
    'RDV Fixé':`Bonjour {{nom}},\n\nJe confirme notre rendez-vous. Je préparerai une proposition personnalisée pour {{secteur}}.\n\nÀ très bientôt ✨`,
    'Devis Envoyé':`Bonjour {{nom}},\n\nJ'espère que vous avez bien reçu le devis BaoPixel. Des questions ? Je suis disponible pour en discuter.\n\nCordialement, Norta — BaoPixel`,
  }

  const getScript=(c:Client)=>{
    const tpl=SCRIPTS[c.pipeline_stage]||SCRIPTS['Prospect Froid']
    return tpl.replace(/{{nom}}/g,c.nom).replace(/{{secteur}}/g,c.secteur)
  }

  const onDrop=(stage:string)=>{
    if(!dragId)return
    setClients(clients.map(c=>c.id===dragId?{...c,pipeline_stage:stage}:c))
    setDragId(null)
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">Pipeline CRM</span>
      <Btn onClick={()=>{setModal('add');setSel(null);setForm({pipeline_stage:'Prospect Froid',secteur:'Immobilier',pack:'Pack Woyofal',statut:'Prospect',montant:0})}}>+ Nouveau prospect</Btn>
    </div>

    {/* Stats */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
      {[
        {l:'Total prospects',v:clients.length,c:'var(--purple-l)'},
        {l:'Actifs',v:clients.filter(c=>c.pipeline_stage==='Actif').length,c:'var(--green)'},
        {l:'Chauds',v:clients.filter(c=>['RDV Fixé','Devis Envoyé','Négociation'].includes(c.pipeline_stage)).length,c:'var(--orange)'},
        {l:'CA Potentiel',v:fmtK(clients.filter(c=>c.pipeline_stage==='Actif').reduce((s,c)=>s+c.montant,0))+' FCFA',c:'var(--yellow)'},
      ].map(({l,v,c})=><StatBox key={l} label={l} val={v} color={c}/>)}
    </div>

    {/* Kanban */}
    <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:8}}>
      {PIPELINE_STAGES.map(stage=>{
        const cols=clients.filter(c=>c.pipeline_stage===stage)
        const stageColor=STAGE_COLORS[stage]||'#7A7068'
        return <div key={stage} className="kanban-col" style={{minWidth:200,width:200,flexShrink:0}}
          onDragOver={e=>{e.preventDefault();(e.currentTarget as HTMLDivElement).style.borderColor=stageColor}}
          onDragLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--border)'}}
          onDrop={e=>{onDrop(stage);(e.currentTarget as HTMLDivElement).style.borderColor='var(--border)'}}>
          <div className="card" style={{border:`1px solid var(--border)`,padding:0,overflow:'hidden'}}>
            <div style={{padding:'10px 12px',background:`${stageColor}22`,borderBottom:'1px solid var(--border)'}}>
              <div style={{fontWeight:800,fontSize:12,color:stageColor,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{stage}</div>
              <div className="text-muted">{cols.length} contact(s)</div>
            </div>
            <div style={{padding:'10px',display:'flex',flexDirection:'column',gap:8,minHeight:120}}>
              {cols.map(c=>{
                const handleDragStart=()=>setDragId(c.id)
                const handleDragEnd=()=>setDragId(null)
                return <div key={c.id} className="kanban-card surface" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} style={{padding:'10px 12px',cursor:'grab',position:'relative'}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{c.nom}</div>
                  <div className="text-muted" style={{marginBottom:6}}>{c.secteur} · {fmtK(c.montant)} FCFA</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    <span style={{fontSize:10,background:`${SECTEUR_COLORS[c.secteur]||'#7A7068'}22`,color:SECTEUR_COLORS[c.secteur]||'#7A7068',padding:'2px 8px',borderRadius:20,fontWeight:600}}>{c.secteur}</span>
                  </div>
                  <div style={{display:'flex',gap:4,marginTop:8}}>
                    <button className="btn-secondary btn-sm" style={{fontSize:10,padding:'3px 8px'}} onClick={()=>{setSel(c);setForm(c);setModal('edit')}}>✎</button>
                    {c.contact&&<button className="btn-primary btn-sm" style={{fontSize:10,padding:'3px 8px'}} onClick={()=>{setSel(c);setModal('whatsapp')}}>📱</button>}
                  </div>
                </div>
              })}
              {cols.length===0&&<div className="text-muted" style={{textAlign:'center',padding:'20px 0',fontSize:12}}>Glissez une carte ici</div>}
            </div>
          </div>
        </div>
      })}
    </div>

    {/* Add/Edit Modal */}
    {(modal==='add'||modal==='edit')&&<Modal title={modal==='add'?'Nouveau prospect':'Modifier prospect'} onClose={()=>setModal(null)}>
      <Input label="Nom / Entreprise" value={form.nom||''} onChange={v=>setForm({...form,nom:v})} placeholder="Ex: So Suite Hôtel"/>
      <Select label="Secteur" value={form.secteur||'Immobilier'} onChange={v=>setForm({...form,secteur:v})} opts={['Immobilier','Restauration','Bien-être','Hospitalité','BTP','Mode','Autre']}/>
      <Select label="Étape pipeline" value={form.pipeline_stage||'Prospect Froid'} onChange={v=>setForm({...form,pipeline_stage:v})} opts={PIPELINE_STAGES}/>
      <Select label="Pack" value={form.pack||'Pack Woyofal'} onChange={v=>setForm({...form,pack:v})} opts={['Pack Woyofal','Pack Sama','Pack Autorité','Sur mesure']}/>
      <Input label="Montant mensuel (FCFA)" type="number" value={String(form.montant||0)} onChange={v=>setForm({...form,montant:Number(v)})}/>
      <Input label="Contact WhatsApp" value={form.contact||''} onChange={v=>setForm({...form,contact:v})} placeholder="+221 77 ..."/>
      <Input label="Notes" value={form.notes||''} onChange={v=>setForm({...form,notes:v})} rows={3}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:4}}>
        <Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn>
        <Btn onClick={saveClient}>Enregistrer</Btn>
      </div>
    </Modal>}

    {/* WhatsApp Script Modal */}
    {modal==='whatsapp'&&sel&&<Modal title={`Script WhatsApp — ${sel.nom}`} onClose={()=>setModal(null)}>
      <div className="surface" style={{padding:14,fontSize:13,lineHeight:1.7,whiteSpace:'pre-wrap',marginBottom:12}}>{getScript(sel)}</div>
      <div style={{display:'flex',gap:8}}>
        <a href={`https://wa.me/${sel.contact.replace(/\D/g,'')}?text=${encodeURIComponent(getScript(sel))}`} target="_blank" rel="noreferrer">
          <Btn variant="orange">📱 Ouvrir WhatsApp</Btn>
        </a>
        <Btn variant="ghost" onClick={()=>{navigator.clipboard.writeText(getScript(sel))}}>📋 Copier</Btn>
      </div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: AGENDA
// ═══════════════════════════════════════════════════════════════
function Agenda({tasks,setTasks,clients}:{tasks:Task[];setTasks:(t:Task[])=>void;clients:Client[]}){
  const [calY,setCalY]=useState(new Date().getFullYear())
  const [calM,setCalM]=useState(new Date().getMonth())
  const [selDay,setSelDay]=useState(todayStr())
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<Task>>({type:'Tâche',priorite:'Normal',statut:'Todo',date:todayStr()})
  const TICON:Record<string,string>={Tournage:'🎬',RDV:'📅',Livraison:'📦',Tâche:'✦'}
  const TCOLOR:Record<string,string>={Tournage:'#C084FC',RDV:'#60A5FA',Livraison:'#F97316',Tâche:'#7A7068'}

  const getDays=()=>{
    const first=new Date(calY,calM,1),last=new Date(calY,calM+1,0)
    const days=[];let cur=new Date(first)
    const startDow=(first.getDay()+6)%7
    for(let i=0;i<startDow;i++){const d=new Date(first);d.setDate(d.getDate()-startDow+i);days.push({date:d.toISOString().slice(0,10),cur:false})}
    while(cur<=last){days.push({date:cur.toISOString().slice(0,10),cur:true});cur.setDate(cur.getDate()+1)}
    while(days.length%7!==0){const d=new Date(cur);days.push({date:d.toISOString().slice(0,10),cur:false});cur.setDate(cur.getDate()+1)}
    return days
  }

  const dayTasks=(date:string)=>tasks.filter(t=>t.date===date)
  const selTasks=dayTasks(selDay)
  const save=()=>{
    if(!form.titre)return
    setTasks([...tasks,{...form,id:uid()} as Task])
    setModal(false);setForm({type:'Tâche',priorite:'Normal',statut:'Todo',date:selDay})
  }
  const toggle=(id:string)=>setTasks(tasks.map(t=>t.id===id?{...t,statut:t.statut==='Fait'?'Todo':'Fait'}:t))
  const del=(id:string)=>setTasks(tasks.filter(t=>t.id!==id))

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">Agenda & RDV</span>
      <Btn onClick={()=>setModal(true)}>+ Ajouter</Btn>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:14}}>
      {/* Calendar */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <button onClick={()=>{if(calM===0){setCalM(11);setCalY(calY-1)}else setCalM(calM-1)}} style={{...s.btnGhost,...s.btnSm}}>‹</button>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800}}>{FR_M[calM]} {calY}</span>
          <button onClick={()=>{if(calM===11){setCalM(0);setCalY(calY+1)}else setCalM(calM+1)}} style={{...s.btnGhost,...s.btnSm}}>›</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',marginBottom:6}}>
          {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d=><div key={d} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--muted)',padding:'4px 0'}}>{d}</div>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
          {getDays().map(({date,cur})=>{
            const dt=dayTasks(date),isToday=date===todayStr(),isSel=date===selDay
            return <div key={date} onClick={()=>setSelDay(date)}
              style={{minHeight:52,padding:4,borderRadius:8,cursor:'pointer',
                background:isSel?'var(--purple)':isToday?'var(--purple-s)':'transparent',
                border:`1px solid ${isSel?'var(--purple)':isToday?'rgba(124,58,237,.4)':'transparent'}`,
                opacity:cur?1:.3}}>
              <div style={{fontSize:12,fontWeight:isSel||isToday?800:400,color:isSel?'#fff':isToday?'var(--purple-l)':'var(--text)',marginBottom:3}}>{new Date(date+'T12:00').getDate()}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                {dt.slice(0,3).map(t=><div key={t.id} style={{width:5,height:5,borderRadius:'50%',background:TCOLOR[t.type]||'#7A7068'}}/>)}
              </div>
            </div>
          })}
        </div>
      </div>

      {/* Day panel */}
      <div>
        <div className="card" style={{marginBottom:12}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15,marginBottom:12}}>{dlabel(selDay)==="Aujourd'hui"?`📌 Aujourd'hui`:`📅 ${dlabel(selDay)}`}</div>
          {selTasks.length===0?<EmptyState msg="Rien ce jour"/>:selTasks.map(t=><div key={t.id} className="surface" style={{padding:'10px 12px',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
            <span>{TICON[t.type]||'✦'}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13,textDecoration:t.statut==='Fait'?'line-through':'none',opacity:t.statut==='Fait'?.5:1}}>{t.titre}</div>
              <div className="text-muted">{t.client}{t.heure?` · ${t.heure}`:''}</div>
            </div>
            <button onClick={()=>toggle(t.id)} style={{background:t.statut==='Fait'?'var(--green)':'transparent',border:`2px solid ${t.statut==='Fait'?'var(--green)':'var(--dim)'}`,borderRadius:'50%',width:22,height:22,cursor:'pointer',color:'#fff',fontSize:11}}>✓</button>
            <button onClick={()=>del(t.id)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:14}}>✕</button>
          </div>)}
          <Btn sm onClick={()=>{setForm({...form,date:selDay});setModal(true)}}>+ Ajouter ce jour</Btn>
        </div>

        {/* Upcoming urgent */}
        <div className="card">
          <div className="section-label" style={{marginBottom:8}}>À VENIR (urgent)</div>
          {tasks.filter(t=>t.priorite==='Urgent'&&t.statut!=='Fait'&&t.date>todayStr()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4).map(t=><div key={t.id} className="surface" style={{padding:'8px 12px',marginBottom:8,borderLeft:'3px solid var(--orange)'}}>
            <div style={{fontWeight:600,fontSize:13}}>{t.titre}</div>
            <div className="text-muted">{dlabel(t.date)} · {t.client}</div>
          </div>)}
        </div>
      </div>
    </div>

    {modal&&<Modal title="Nouvelle tâche / RDV" onClose={()=>setModal(false)}>
      <Input label="Titre" value={form.titre||''} onChange={v=>setForm({...form,titre:v})}/>
      <Select label="Type" value={form.type||'Tâche'} onChange={v=>setForm({...form,type:v})} opts={['Tâche','RDV','Tournage','Livraison']}/>
      <Select label="Priorité" value={form.priorite||'Normal'} onChange={v=>setForm({...form,priorite:v})} opts={['Normal','Urgent']}/>
      <Input label="Date" type="date" value={form.date||todayStr()} onChange={v=>setForm({...form,date:v})}/>
      <Input label="Heure (optionnel)" type="time" value={form.heure||''} onChange={v=>setForm({...form,heure:v})}/>
      <Input label="Client" value={form.client||''} onChange={v=>setForm({...form,client:v})} placeholder="Nom du client"/>
      <Input label="Notes" value={form.notes||''} onChange={v=>setForm({...form,notes:v})} rows={2}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn>
        <Btn onClick={save}>Ajouter</Btn>
      </div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: PRÉ-PRODUCTION
// ═══════════════════════════════════════════════════════════════
function PreProduction({prods,setProds,clients}:{prods:PreProd[];setProds:(p:PreProd[])=>void;clients:Client[]}){
  const [sel,setSel]=useState<PreProd|null>(null)
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<PreProd>>({statut:'Préparation',checklist:[],equipe:[]})
  const DEFAULT_CHECKLIST=['Batteries chargées (iPhone + DJI Mini 3)','Cartes SD formatées (vierges)','Drone calibré + test vol','Stabilisateur Osmo chargé','Contrat signé + devis validé','Heure de RDV confirmée avec client','Lieu repéré (Light + accès)','Tenue professionnelle','Briefing client (angles souhaités)','Backup disque dur portable']

  const save=()=>{
    if(!form.titre)return
    const pp:PreProd={...form as PreProd,id:uid(),checklist:form.checklist?.length?form.checklist:[...DEFAULT_CHECKLIST]}
    setProds(sel?prods.map(p=>p.id===sel.id?{...p,...pp}:p):[...prods,pp])
    setModal(false);setSel(null)
  }
  const toggleCheck=(id:string,item:string)=>{
    setProds(prods.map(p=>{
      if(p.id!==id)return p
      const has=p.checklist.includes(item+'✅')
      return {...p,checklist:p.checklist.map(c=>c===item?item+'✅':c===item+'✅'?item:c)}
    }))
  }

  const pct=(p:PreProd)=>p.checklist.length?Math.round(p.checklist.filter(c=>c.includes('✅')).length/p.checklist.length*100):0
  const STATUS_COLOR:Record<string,string>={'Préparation':'var(--yellow)','Prêt':'var(--green)','En cours':'var(--purple-l)','Terminé':'var(--muted)'}

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">Pré-Production</span>
      <Btn onClick={()=>{setForm({statut:'Préparation',checklist:[],equipe:[]});setSel(null);setModal(true)}}>🎬 Nouveau dossier</Btn>
    </div>

    {sel?<div>
      {/* Dossier detail */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <button onClick={()=>setSel(null)} style={{...s.btnGhost,...s.btnSm}}>← Retour</button>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20}}>{sel.titre}</span>
        <span style={{fontSize:11,fontWeight:700,color:STATUS_COLOR[sel.statut]||'var(--muted)',background:`${STATUS_COLOR[sel.statut]||'var(--muted)'}22`,padding:'3px 10px',borderRadius:20}}>{sel.statut}</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div className="card">
          <div className="section-label" style={{marginBottom:12}}>INFOS TOURNAGE</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            {[{l:'Client',v:sel.client},{l:'Date',v:sel.date},{l:'Lieu',v:sel.lieu},{l:'Équipe',v:sel.equipe.join(', ')||'—'}].map(({l,v})=><div key={l} className="surface">
              <div className="text-muted">{l}</div><div style={{fontWeight:600,fontSize:13,marginTop:4}}>{v||'—'}</div>
            </div>)}
          </div>
          <div className="section-label" style={{marginBottom:8}}>NOTES</div>
          <div className="surface" style={{fontSize:13,lineHeight:1.6}}>{sel.notes||'Aucune note.'}</div>
        </div>

        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div className="section-label">CHECKLIST</div>
            <span style={{fontSize:13,fontWeight:700,color:'var(--green)'}}>{pct(sel)}%</span>
          </div>
          <ProgressBar val={pct(sel)} color="var(--green)" height={4}/>
          <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:6}}>
            {sel.checklist.map((item,i)=>{
              const done=item.includes('✅')
              const clean=item.replace('✅','')
              return <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:done?'var(--green-s)':'var(--surface)',borderRadius:8,cursor:'pointer'}} onClick={()=>{
                setProds(prods.map(p=>p.id===sel.id?{...p,checklist:p.checklist.map((c,ci)=>ci===i?(done?clean:clean+'✅'):c)}:p))
                setSel(p=>p?{...p,checklist:p.checklist.map((c,ci)=>ci===i?(done?clean:clean+'✅'):c)}:p)
              }}>
                <span style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${done?'var(--green)':'var(--dim)'}`,background:done?'var(--green)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',flexShrink:0}}>{done&&'✓'}</span>
                <span style={{fontSize:13,textDecoration:done?'line-through':'none',opacity:done?.5:1}}>{clean}</span>
              </div>
            })}
          </div>
        </div>
      </div>

      {/* Triggers */}
      <div className="card" style={{marginTop:14}}>
        <div className="section-label" style={{marginBottom:10}}>⚡ ACTIONS RAPIDES</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <Btn variant="orange" sm onClick={()=>{const msg=`🎬 *Briefing Tournage — ${sel.titre}*\n📍 Lieu : ${sel.lieu}\n📅 Date : ${sel.date}\n👥 Équipe : ${sel.equipe.join(', ')}\n\n📋 Checklist : ${pct(sel)}% validée\n\nÀ demain ! 💪`;navigator.clipboard.writeText(msg)}}>📋 Copier brief WhatsApp</Btn>
          <Btn variant="ghost" sm onClick={()=>{setForm(sel);setModal(true)}}>✎ Modifier</Btn>
        </div>
      </div>
    </div>

    :<div>
      {prods.length===0?<EmptyState msg="Aucun dossier de pré-production. Créez-en un !" icon="🎬"/>
      :<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
        {prods.map(p=><div key={p.id} className="card" style={{cursor:'pointer'}} onClick={()=>setSel(p)}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15}}>{p.titre}</div>
            <span style={{fontSize:11,fontWeight:700,color:STATUS_COLOR[p.statut]||'var(--muted)',background:`${STATUS_COLOR[p.statut]||'var(--muted)'}22`,padding:'3px 10px',borderRadius:20,flexShrink:0}}>{p.statut}</span>
          </div>
          <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
            {[{l:'📍',v:p.lieu},{l:'📅',v:p.date},{l:'👤',v:p.client}].map(({l,v})=>v&&<span key={l} className="text-muted" style={{fontSize:12}}>{l} {v}</span>)}
          </div>
          <ProgressBar val={pct(p)} color="var(--green)"/>
          <div className="text-muted" style={{marginTop:6,fontSize:12}}>{pct(p)}% checklist validée</div>
        </div>)}
      </div>}
    </div>}

    {modal&&<Modal title={sel?'Modifier dossier':'Nouveau dossier de tournage'} onClose={()=>setModal(false)}>
      <Input label="Titre du tournage" value={form.titre||''} onChange={v=>setForm({...form,titre:v})} placeholder="Ex: Shooting Detmine — Résidence Saly"/>
      <Input label="Client" value={form.client||''} onChange={v=>setForm({...form,client:v})}/>
      <Input label="Date" type="date" value={form.date||''} onChange={v=>setForm({...form,date:v})}/>
      <Input label="Lieu" value={form.lieu||''} onChange={v=>setForm({...form,lieu:v})} placeholder="Ex: Saly Portudal"/>
      <Input label="Équipe (séparés par virgule)" value={form.equipe?.join(', ')||''} onChange={v=>setForm({...form,equipe:v.split(',').map(e=>e.trim()).filter(Boolean)})}/>
      <Select label="Statut" value={form.statut||'Préparation'} onChange={v=>setForm({...form,statut:v})} opts={['Préparation','Prêt','En cours','Terminé']}/>
      <Input label="Notes" value={form.notes||''} onChange={v=>setForm({...form,notes:v})} rows={3}/>
      <div className="text-muted" style={{marginBottom:12,fontSize:12}}>Une checklist standard de 10 points sera ajoutée automatiquement.</div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
        <Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn>
        <Btn onClick={save}>Créer dossier</Btn>
      </div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: TRÉSORERIE & DEVIS
// ═══════════════════════════════════════════════════════════════
function Tresorerie({gains,setGains,depenses,setDepenses,devis,setDevis,clients}:{gains:Gain[];setGains:(g:Gain[])=>void;depenses:Depense[];setDepenses:(d:Depense[])=>void;devis:Devis[];setDevis:(d:Devis[])=>void;clients:Client[]}){
  const [tab,setTab]=useState<'resultats'|'gains'|'depenses'|'devis'>('resultats')
  const [mo,setMo]=useState(curMo())
  const [modal,setModal]=useState<null|'gain'|'dep'|'devis'|'viewDevis'>(null)
  const [formG,setFormG]=useState<Partial<Gain>>({type:'Récurrent client',mois:mo,date:todayStr()})
  const [formD,setFormD]=useState<Partial<Depense>>({type:'Charge fixe',mois:mo,date:todayStr()})
  const [selDevis,setSelDevis]=useState<Devis|null>(null)
  const [formDv,setFormDv]=useState<Partial<Devis>>({lignes:[{desc:'',qte:1,pu:0}],statut:'Brouillon'})

  const moGains=gains.filter(g=>g.mois===mo)
  const moDep=depenses.filter(d=>d.mois===mo)
  const ca=moGains.reduce((s,g)=>s+g.montant,0)
  const dep=moDep.filter(d=>d.type!=='Investissement').reduce((s,d)=>s+d.montant,0)
  const inv=moDep.filter(d=>d.type==='Investissement').reduce((s,d)=>s+d.montant,0)
  const net=ca-dep

  const MONTHS=['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12']
  const MLBL:Record<string,string>={'2026-01':'Jan','2026-02':'Fév','2026-03':'Mar','2026-04':'Avr','2026-05':'Mai','2026-06':'Juin','2026-07':'Juil','2026-08':'Aoû','2026-09':'Sep','2026-10':'Oct','2026-11':'Nov','2026-12':'Déc'}

  const devisTotal=(dv:Devis)=>dv.lignes.reduce((s,l)=>s+l.qte*l.pu,0)
  const addLigne=()=>setFormDv({...formDv,lignes:[...(formDv.lignes||[]),{desc:'',qte:1,pu:0}]})
  const updLigne=(i:number,f:string,v:string|number)=>setFormDv({...formDv,lignes:(formDv.lignes||[]).map((l,li)=>li===i?{...l,[f]:v}:l)})

  const saveGain=()=>{if(!formG.label)return;setGains([...gains,{...formG,id:uid()} as Gain]);setModal(null)}
  const saveDep=()=>{if(!formD.label)return;setDepenses([...depenses,{...formD,id:uid()} as Depense]);setModal(null)}
  const saveDevis=()=>{
    if(!formDv.client)return
    const ref=`DEV-2026-${Date.now().toString().slice(-4)}`
    const dv:Devis={...formDv as Devis,id:uid(),ref:formDv.ref||ref,date:todayStr(),validite:'30 jours'}
    setDevis([...devis,dv]);setModal(null)
  }

  const printDevis=(dv:Devis)=>{
    const total=devisTotal(dv)
    const html=`<!DOCTYPE html><html><head><title>Devis ${dv.ref}</title>
    <style>body{font-family:Arial,sans-serif;margin:40px;color:#111;}h1{color:#7C3AED;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#7C3AED;color:#fff;padding:10px;text-align:left;}td{padding:10px;border-bottom:1px solid #eee;}.total{font-weight:bold;font-size:18px;color:#7C3AED;}.logo{font-size:24px;font-weight:900;}.sub{color:#666;font-size:13px;}</style>
    </head><body>
    <div class="logo">BaoPixel<span style="color:#F97316"> Digital Agency</span></div>
    <div class="sub">Mbour, Petite-Côte · contact@baopixel.com · www.baopixel.com</div>
    <hr style="margin:20px 0;border-color:#eee"/>
    <h1>DEVIS — ${dv.ref}</h1>
    <p><strong>Client :</strong> ${dv.client}<br><strong>Date :</strong> ${dv.date}<br><strong>Validité :</strong> ${dv.validite}</p>
    <table><tr><th>Description</th><th>Qté</th><th>P.U. HT</th><th>Total HT</th></tr>
    ${dv.lignes.map(l=>`<tr><td>${l.desc}</td><td>${l.qte}</td><td>${l.pu.toLocaleString('fr-FR')} FCFA</td><td>${(l.qte*l.pu).toLocaleString('fr-FR')} FCFA</td></tr>`).join('')}
    </table>
    <p class="total">TOTAL TTC : ${total.toLocaleString('fr-FR')} FCFA</p>
    <p>${dv.notes||''}</p>
    <div style="margin-top:60px;display:flex;justify-content:space-between">
    <div><p>Signature BaoPixel</p><div style="margin-top:40px;border-top:1px solid #999;width:200px"/></div>
    <div><p>Signature Client</p><div style="margin-top:40px;border-top:1px solid #999;width:200px"/></div></div>
    </body></html>`
    const w=window.open('','_blank')
    if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),500)}
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">Trésorerie</span>
      <div style={{display:'flex',gap:8}}>
        <Btn variant="ghost" sm onClick={()=>setModal('gain')}>+ Gain</Btn>
        <Btn variant="ghost" sm onClick={()=>setModal('dep')}>− Dépense</Btn>
        <Btn onClick={()=>setModal('devis')}>◆ Nouveau devis</Btn>
      </div>
    </div>

    {/* Month selector */}
    <div style={{display:'flex',gap:4,marginBottom:16,overflowX:'auto',paddingBottom:4}}>
      {MONTHS.map(m=><button key={m} onClick={()=>setMo(m)} className="btn-secondary btn-sm" style={{background:m===mo?'var(--purple)':'var(--surface)',color:m===mo?'#fff':'var(--muted)',border:`1px solid ${m===mo?'var(--purple)':'var(--border)'}`,flexShrink:0}}>{MLBL[m]}</button>)}
    </div>

    {/* KPIs */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
      <StatBox label="Chiffre d'affaires" val={fmtK(ca)+' FCFA'} sub={MLBL[mo]} color="var(--green)"/>
      <StatBox label="Charges" val={fmtK(dep)+' FCFA'} sub="Fixes + variables" color="var(--red)"/>
      <StatBox label="Résultat net" val={fmtK(net)+' FCFA'} sub={net>=0?'✅ Positif':'⚠️ Négatif'} color={net>=0?'var(--green)':'var(--red)'}/>
      <StatBox label="Investissements" val={fmtK(inv)+' FCFA'} sub={MLBL[mo]} color="var(--yellow)"/>
    </div>

    {/* Tabs */}
    <div style={{display:'flex',gap:4,marginBottom:16}}>
      {(['resultats','gains','depenses','devis'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className="btn-secondary btn-sm" style={{background:tab===t?'var(--purple)':'var(--surface)',color:tab===t?'#fff':'var(--muted)',border:`1px solid ${tab===t?'var(--purple)':'var(--border)'}`}}>{t==='resultats'?'📊 Résultats':t==='gains'?'📈 Gains':t==='depenses'?'📉 Dépenses':'📋 Devis'}</button>)}
    </div>

    {tab==='resultats'&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      <div className="card">
        <div className="section-label">GAINS DU MOIS</div>
        {moGains.length===0?<EmptyState msg="Aucun gain ce mois"/>:moGains.map(g=><div key={g.id} className="surface" style={{padding:'10px 12px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontWeight:600,fontSize:13}}>{g.label}</div><div className="text-muted">{g.type}</div></div>
          <div style={{color:'var(--green)',fontWeight:700}}>{fmtK(g.montant)} FCFA</div>
        </div>)}
      </div>
      <div className="card">
        <div className="section-label">CHARGES DU MOIS</div>
        {moDep.length===0?<EmptyState msg="Aucune dépense ce mois"/>:moDep.map(d=><div key={d.id} className="surface" style={{padding:'10px 12px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontWeight:600,fontSize:13}}>{d.label}</div><div className="text-muted">{d.type}</div></div>
          <div style={{color:d.type==='Investissement'?'var(--yellow)':'var(--red)',fontWeight:700}}>{fmtK(d.montant)} FCFA</div>
        </div>)}
      </div>
    </div>}

    {tab==='gains'&&<div className="card">
      <div className="section-label">TOUS LES GAINS</div>
      {gains.length===0?<EmptyState msg="Aucun gain" icon="💰"/>:gains.sort((a,b)=>b.mois.localeCompare(a.mois)).map(g=><div key={g.id} className="surface" style={{marginBottom:8,padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><div style={{fontWeight:600,fontSize:13}}>{g.label}</div><div className="text-muted">{MLBL[g.mois]||g.mois} · {g.type}</div></div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{color:'var(--green)',fontWeight:700}}>{fmtK(g.montant)} FCFA</span>
          <button onClick={()=>setGains(gains.filter(x=>x.id!==g.id))} style={{...s.btnDanger,...s.btnSm}}>✕</button>
        </div>
      </div>)}
    </div>}

    {tab==='depenses'&&<div className="card">
      <div className="section-label">TOUTES LES DÉPENSES</div>
      {depenses.length===0?<EmptyState msg="Aucune dépense" icon="📉"/>:depenses.sort((a,b)=>b.mois.localeCompare(a.mois)).map(d=><div key={d.id} className="surface" style={{marginBottom:8,padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><div style={{fontWeight:600,fontSize:13}}>{d.label}</div><div className="text-muted">{MLBL[d.mois]||d.mois} · {d.type}</div></div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{color:d.type==='Investissement'?'var(--yellow)':'var(--red)',fontWeight:700}}>{fmtK(d.montant)} FCFA</span>
          <button onClick={()=>setDepenses(depenses.filter(x=>x.id!==d.id))} style={{...s.btnDanger,...s.btnSm}}>✕</button>
        </div>
      </div>)}
    </div>}

    {tab==='devis'&&<div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {devis.length===0?<EmptyState msg="Aucun devis. Créez-en un !" icon="◆"/>
        :devis.map(dv=><div key={dv.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15}}>{dv.ref}</div>
            <div className="text-muted">{dv.client} · {dv.date}</div>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontWeight:700,color:'var(--purple-l)',fontSize:16}}>{fmtK(devisTotal(dv))} FCFA</span>
            <span style={{fontSize:11,fontWeight:700,background:dv.statut==='Signé'?'var(--green-s)':dv.statut==='Envoyé'?'var(--purple-s)':'var(--surface)',color:dv.statut==='Signé'?'var(--green)':dv.statut==='Envoyé'?'var(--purple-l)':'var(--muted)',padding:'3px 10px',borderRadius:20}}>{dv.statut}</span>
            <button style={{...s.btnPurple,...s.btnSm}} onClick={()=>printDevis(dv)}>🖨️ PDF</button>
            <button style={{...s.btnDanger,...s.btnSm}} onClick={()=>setDevis(devis.filter(x=>x.id!==dv.id))}>✕</button>
          </div>
        </div>)}
      </div>
    </div>}

    {/* Modals */}
    {modal==='gain'&&<Modal title="Nouveau gain" onClose={()=>setModal(null)}>
      <Input label="Libellé" value={formG.label||''} onChange={v=>setFormG({...formG,label:v})}/>
      <Select label="Type" value={formG.type||'Récurrent client'} onChange={v=>setFormG({...formG,type:v})} opts={['Récurrent client','Tournage ponctuel','Devis encaissé','Autre gain']}/>
      <Input label="Montant (FCFA)" type="number" value={String(formG.montant||0)} onChange={v=>setFormG({...formG,montant:Number(v)})}/>
      <Select label="Mois" value={formG.mois||mo} onChange={v=>setFormG({...formG,mois:v})} opts={MONTHS}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={saveGain}>Ajouter</Btn></div>
    </Modal>}

    {modal==='dep'&&<Modal title="Nouvelle dépense" onClose={()=>setModal(null)}>
      <Input label="Libellé" value={formD.label||''} onChange={v=>setFormD({...formD,label:v})}/>
      <Select label="Type" value={formD.type||'Charge fixe'} onChange={v=>setFormD({...formD,type:v})} opts={['Charge fixe','Charge variable','Investissement','Autre dépense']}/>
      <Input label="Montant (FCFA)" type="number" value={String(formD.montant||0)} onChange={v=>setFormD({...formD,montant:Number(v)})}/>
      <Select label="Mois" value={formD.mois||mo} onChange={v=>setFormD({...formD,mois:v})} opts={MONTHS}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={saveDep}>Ajouter</Btn></div>
    </Modal>}

    {modal==='devis'&&<Modal title="Générer un devis BaoPixel" onClose={()=>setModal(null)} wide>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Input label="Client" value={formDv.client||''} onChange={v=>setFormDv({...formDv,client:v})}/>
        <Input label="Référence devis" value={formDv.ref||''} onChange={v=>setFormDv({...formDv,ref:v})} placeholder="DEV-2026-XXX"/>
      </div>
      <Input label="Notes / Objet" value={formDv.notes||''} onChange={v=>setFormDv({...formDv,notes:v})} rows={2}/>
      <div className="section-label" style={{marginBottom:10}}>LIGNES DE PRESTATION</div>
      {(formDv.lignes||[]).map((l,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'1fr 80px 120px 30px',gap:8,marginBottom:8,alignItems:'flex-end'}}>
        <Input value={l.desc} onChange={v=>updLigne(i,'desc',v)} placeholder="Description prestation"/>
        <Input type="number" value={String(l.qte)} onChange={v=>updLigne(i,'qte',Number(v))}/>
        <Input type="number" value={String(l.pu)} onChange={v=>updLigne(i,'pu',Number(v))}/>
        <button onClick={()=>setFormDv({...formDv,lignes:(formDv.lignes||[]).filter((_,li)=>li!==i)})} className="btn-danger btn-sm" style={{height:38}}>✕</button>
      </div>)}
      <Btn variant="ghost" sm onClick={addLigne}>+ Ajouter ligne</Btn>
      <div style={{textAlign:'right',marginTop:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,color:'var(--purple-l)'}}>
        TOTAL : {fmtK((formDv.lignes||[]).reduce((s,l)=>s+l.qte*l.pu,0))} FCFA
      </div>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}><Btn variant="ghost" onClick={()=>setModal(null)}>Annuler</Btn><Btn onClick={saveDevis}>Créer devis</Btn></div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: CALENDRIER ÉDITORIAL
// ═══════════════════════════════════════════════════════════════
function Editorial({content,setContent}:{content:Content[];setContent:(c:Content[])=>void}){
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<Content>>({pilier:'Montrer',format:'Reel 30s',plateforme:'Instagram',statut:'À créer',semaine:'S1'})
  const PILIERS=['Montrer','Éduquer','Prouver','Personal Brand','Vendre','Inspirer']
  const FORMATS=['Reel 30s','Reel 60s','Carrousel','Photo','Story','Voix off','TikTok 15s','TikTok 60s','YouTube Short']
  const PLATEFORMES=['Instagram','TikTok','Facebook','IG+FB','LinkedIn','YouTube']
  const STATUTS=['À créer','En cours','Prêt','Publié','Archivé']
  const SEMAINES=['S1','S2','S3','S4','S5']

  const save=()=>{if(!form.titre)return;setContent([...content,{...form,id:uid()} as Content]);setModal(false);setForm({pilier:'Montrer',format:'Reel 30s',plateforme:'Instagram',statut:'À créer',semaine:'S1'})}
  const del=(id:string)=>setContent(content.filter(c=>c.id!==id))
  const upd=(id:string,f:keyof Content,v:string)=>setContent(content.map(c=>c.id===id?{...c,[f]:v}:c))

  const byPilier=PILIERS.reduce((acc,p)=>({...acc,[p]:content.filter(c=>c.pilier===p)}),[])
  const bySemaine=SEMAINES.reduce((acc,s)=>({...acc,[s]:content.filter(c=>c.semaine===s)}),[])

  const STATUS_STYLE:Record<string,{bg:string;c:string}>={
    'À créer':{bg:'var(--purple-s)',c:'var(--purple-l)'},'En cours':{bg:'var(--yellow-s)',c:'var(--yellow)'},
    'Prêt':{bg:'var(--green-s)',c:'var(--green)'},'Publié':{bg:'var(--surface)',c:'var(--muted)'},'Archivé':{bg:'var(--surface)',c:'var(--dim)'}
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">Calendrier Éditorial</span>
      <div style={{display:'flex',gap:8}}>
        <div className="text-muted">{content.filter(c=>c.statut==='Publié').length}/{content.length} publiés</div>
        <Btn onClick={()=>setModal(true)}>+ Nouveau contenu</Btn>
      </div>
    </div>

    {/* Stats pilliers */}
    <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
      {PILIERS.map(p=>{
        const n=content.filter(c=>c.pilier===p).length
        if(!n)return null
        return <div key={p} className="surface" style={{padding:'8px 14px',display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:PILIER_COLORS[p],display:'inline-block'}}/>
          <span style={{fontSize:12,fontWeight:600}}>{p}</span>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:13,color:PILIER_COLORS[p]}}>{n}</span>
        </div>
      })}
    </div>

    {/* Semaine view */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:14}}>
      {SEMAINES.map(sem=>{
        const items=content.filter(c=>c.semaine===sem)
        return <div key={sem} className="card">
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:13,color:'var(--purple-l)',marginBottom:10}}>Semaine {sem.replace('S','')}</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {items.length===0?<div className="text-muted" style={{fontSize:11,padding:'10px 0'}}>Vide</div>
            :items.map(c=><div key={c.id} style={{borderRadius:8,padding:'8px 10px',background:`${PILIER_COLORS[c.pilier]||'#7A7068'}15`,borderLeft:`3px solid ${PILIER_COLORS[c.pilier]||'#7A7068'}`}}>
              <div style={{fontWeight:600,fontSize:12,marginBottom:2,lineHeight:1.3}}>{c.titre}</div>
              <div className="text-muted" style={{fontSize:10,marginBottom:4}}>{c.format} · {c.plateforme}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:4}}>
                <select value={c.statut} onChange={e=>upd(c.id,'statut',e.target.value)} style={{fontSize:10,background:(STATUS_STYLE[c.statut]||{bg:'var(--surface)'}).bg,color:(STATUS_STYLE[c.statut]||{c:'var(--muted)'}).c,border:'none',borderRadius:6,padding:'2px 6px',fontFamily:'inherit',fontWeight:600,cursor:'pointer'}}>
                  {STATUTS.map(st=><option key={st}>{st}</option>)}
                </select>
                <button onClick={()=>del(c.id)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:12}}>✕</button>
              </div>
            </div>)}
          </div>
        </div>
      })}
    </div>

    {/* Full list */}
    <div className="card">
      <div className="section-label" style={{marginBottom:12}}>TOUS LES CONTENUS</div>
      {content.length===0?<EmptyState msg="Aucun contenu planifié"/>
      :<div style={{display:'flex',flexDirection:'column',gap:8}}>
        {content.map(c=><div key={c.id} className="surface" style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:4,height:36,borderRadius:2,background:PILIER_COLORS[c.pilier]||'#7A7068',flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:13}}>{c.titre}</div>
            <div className="text-muted">{c.format} · {c.plateforme} · {c.semaine}</div>
          </div>
          <span style={{fontSize:10,fontWeight:700,background:(STATUS_STYLE[c.statut]||{bg:'var(--surface)'}).bg,color:(STATUS_STYLE[c.statut]||{c:'var(--muted)'}).c,padding:'3px 10px',borderRadius:20}}>{c.statut}</span>
          <button onClick={()=>del(c.id)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:14}}>✕</button>
        </div>)}
      </div>}
    </div>

    {modal&&<Modal title="Nouveau contenu" onClose={()=>setModal(false)}>
      <Input label="Titre / Concept" value={form.titre||''} onChange={v=>setForm({...form,titre:v})} placeholder="Ex: 3 erreurs photo des agences immo"/>
      <Select label="Pilier" value={form.pilier||'Montrer'} onChange={v=>setForm({...form,pilier:v})} opts={PILIERS}/>
      <Select label="Format" value={form.format||'Reel 30s'} onChange={v=>setForm({...form,format:v})} opts={FORMATS}/>
      <Select label="Plateforme" value={form.plateforme||'Instagram'} onChange={v=>setForm({...form,plateforme:v})} opts={PLATEFORMES}/>
      <Select label="Semaine" value={form.semaine||'S1'} onChange={v=>setForm({...form,semaine:v})} opts={SEMAINES}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn><Btn onClick={save}>Ajouter</Btn></div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: IDÉES CONTENU
// ═══════════════════════════════════════════════════════════════
function IdeasContent({ideas,setIdeas}:{ideas:Idea[];setIdeas:(i:Idea[])=>void}){
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<Idea>>({pilier:'Montrer',plateforme:'Instagram',statut:'À développer'})
  const [filter,setFilter]=useState('Tous')
  const PILIERS=['Montrer','Éduquer','Prouver','Personal Brand','Vendre','Inspirer']
  const save=()=>{if(!form.titre)return;setIdeas([...ideas,{...form,id:uid(),date:todayStr()} as Idea]);setModal(false);setForm({pilier:'Montrer',plateforme:'Instagram',statut:'À développer'})}
  const filtered=filter==='Tous'?ideas:ideas.filter(i=>i.pilier===filter)

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">💡 Idées Contenu</span>
      <Btn onClick={()=>setModal(true)}>+ Capturer idée</Btn>
    </div>
    <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
      {['Tous',...PILIERS].map(p=><button key={p} onClick={()=>setFilter(p)} className="btn-secondary btn-sm" style={{background:filter===p?'var(--purple)':'var(--surface)',color:filter===p?'#fff':'var(--muted)',border:`1px solid ${filter===p?'var(--purple)':'var(--border)'}`}}>{p}</button>)}
    </div>
    {filtered.length===0?<EmptyState msg="Aucune idée pour ce filtre. Capturez !" icon="💡"/>
    :<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
      {filtered.map(i=><div key={i.id} style={{background:`${PILIER_COLORS[i.pilier]||'#7A7068'}12`,border:`1px solid ${PILIER_COLORS[i.pilier]||'#7A7068'}33`,borderRadius:12,padding:'14px 16px',position:'relative'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <span style={{fontSize:11,fontWeight:700,color:PILIER_COLORS[i.pilier],background:`${PILIER_COLORS[i.pilier]}22`,padding:'2px 8px',borderRadius:20}}>{i.pilier}</span>
          <button onClick={()=>setIdeas(ideas.filter(x=>x.id!==i.id))} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:13}}>✕</button>
        </div>
        <div style={{fontWeight:700,fontSize:14,marginBottom:8,lineHeight:1.4}}>{i.titre}</div>
        <div className="text-muted" style={{fontSize:12,marginBottom:10,lineHeight:1.5}}>{i.description}</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="text-muted">{i.plateforme}</span>
          <span style={{fontSize:10,fontWeight:600,color:'var(--purple-l)'}}>{dlabel(i.date)}</span>
        </div>
      </div>)}
    </div>}

    {modal&&<Modal title="Capturer une idée" onClose={()=>setModal(false)}>
      <Input label="Titre de l'idée" value={form.titre||''} onChange={v=>setForm({...form,titre:v})} placeholder="Ex: Vidéo journée type à Mbour"/>
      <Input label="Description" value={form.description||''} onChange={v=>setForm({...form,description:v})} rows={3} placeholder="Contexte, angle, message..."/>
      <Select label="Pilier" value={form.pilier||'Montrer'} onChange={v=>setForm({...form,pilier:v})} opts={PILIERS}/>
      <Select label="Plateforme" value={form.plateforme||'Instagram'} onChange={v=>setForm({...form,plateforme:v})} opts={['Instagram','TikTok','Facebook','LinkedIn','YouTube']}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn><Btn onClick={save}>Capturer</Btn></div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: VEILLE IA
// ═══════════════════════════════════════════════════════════════
function VeilleIA(){
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState('')
  const [filter,setFilter]=useState('Instagram')
  const NETWORKS=['Instagram','TikTok','Facebook','LinkedIn','Réseaux en général']
  const fetch_=async()=>{
    setLoading(true);setResult('')
    const p=`Tu es un expert en social media marketing en 2025-2026. Donne-moi les 5 dernières actualités et mises à jour importantes concernant ${filter} pour les créateurs de contenu et agences digitales en Afrique de l'Ouest. Format : pour chaque actualité : 📌 **Titre** → Explication pratique de 2-3 lignes → Impact pour BaoPixel (agence audiovisuelle Petite-Côte Sénégal). Sois concret et actionnable.`
    const r=await askAI(p,'Tu es expert en social media et marketing digital pour les marchés africains. Réponds en français avec des emojis et une mise en forme claire.')
    setResult(r);setLoading(false)
  }
  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">✦ Veille IA Réseaux</span>
      <div className="text-muted" style={{fontSize:12}}>Powered by Claude AI</div>
    </div>
    <div className="card" style={{marginBottom:16,background:'linear-gradient(135deg,var(--purple-s2),rgba(124,58,237,.1))'}}>
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {NETWORKS.map(n=><button key={n} onClick={()=>setFilter(n)} className="btn-secondary btn-sm" style={{background:filter===n?'var(--purple)':'transparent',color:filter===n?'#fff':'var(--purple-l)',border:`1px solid ${filter===n?'var(--purple)':'rgba(124,58,237,.3)'}`}}>{n}</button>)}
      </div>
      <Btn onClick={fetch_} variant="purple">{loading?<><Spinner/> Analyse en cours...</>:<>✦ Lancer la veille {filter}</>}</Btn>
    </div>
    {result&&<div className="card" style={{lineHeight:1.8,fontSize:14,whiteSpace:'pre-wrap',animation:'fadeUp .3s ease'}}>
      <div className="section-label" style={{marginBottom:12}}>RÉSULTATS DE VEILLE — {filter.toUpperCase()}</div>
      {result}
    </div>}
    {!result&&!loading&&<div className="surface" style={{padding:30,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:12}}>🤖</div>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Veille IA instantanée</div>
      <div className="text-muted">Sélectionne un réseau et lance l'analyse pour obtenir les dernières actualités, mises à jour d'algorithmes et tendances pour les créateurs de contenu.</div>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: GUIDE ALGO
// ═══════════════════════════════════════════════════════════════
function GuideAlgo(){
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState('')
  const [topic,setTopic]=useState('algorithme Instagram 2026')
  const TOPICS=['algorithme Instagram 2026','algorithme TikTok 2026','meilleure heure de publication Sénégal','formats qui performent le mieux en Afrique de l\'Ouest','stratégie reels vs carrousels','comment augmenter l\'engagement','hashtags efficaces Sénégal','transition organique → payant Facebook Ads']
  const fetch_=async(t:string)=>{
    setLoading(true);setTopic(t);setResult('')
    const p=`Explique-moi en détail : "${t}". Contexte : je suis Norta, fondateur de BaoPixel, agence audiovisuelle à Mbour (Petite-Côte, Sénégal). Mes clients sont hôtels, restaurants, agences immo, spas. Format de ta réponse : 🎯 **Principe clé** → ✅ Ce que je dois faire → ❌ Ce que je dois éviter → 💡 Astuce BaoPixel → 📊 Métriques à surveiller. Sois concret, pratique, adapté au contexte africain.`
    const r=await askAI(p,'Tu es un expert senior en croissance organique sur les réseaux sociaux pour les marchés africains. Tu as 10 ans d\'expérience avec des agences en Afrique de l\'Ouest.')
    setResult(r);setLoading(false)
  }
  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">📖 Guide Algorithmes</span>
      <div className="text-muted" style={{fontSize:12}}>Conseils IA personnalisés BaoPixel</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:14}}>
      <div className="card">
        <div className="section-label" style={{marginBottom:12}}>SUJETS POPULAIRES</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {TOPICS.map(t=><button key={t} onClick={()=>fetch_(t)} className="surface" style={{padding:'10px 12px',textAlign:'left',cursor:'pointer',border:`1px solid ${topic===t?'var(--purple)':'var(--border)'}`,borderRadius:8,fontSize:12,fontWeight:500,color:topic===t?'var(--purple-l)':'var(--text)',background:topic===t?'var(--purple-s)':'var(--surface)'}}>{t}</button>)}
        </div>
        <div style={{marginTop:12}}>
          <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Question personnalisée..." style={{...s.input,fontSize:12,marginBottom:8}}/>
          <Btn onClick={()=>fetch_(topic)} sm>{loading?<Spinner/>:'→ Demander'}</Btn>
        </div>
      </div>
      <div>
        {loading&&<div className="card" style={{textAlign:'center',padding:60}}><Spinner/><div className="text-muted" style={{marginTop:12}}>Analyse en cours...</div></div>}
        {result&&!loading&&<div className="card" style={{lineHeight:1.9,fontSize:14,whiteSpace:'pre-wrap',animation:'fadeUp .3s ease'}}>{result}</div>}
        {!result&&!loading&&<div className="surface" style={{padding:60,textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:12}}>📖</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Guide Algorithmes IA</div>
          <div className="text-muted">Clique sur un sujet ou pose ta propre question pour obtenir des conseils personnalisés pour BaoPixel.</div>
        </div>}
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: REPORTING
// ═══════════════════════════════════════════════════════════════
function Reporting({reports,setReports,clients}:{reports:ReportEntry[];setReports:(r:ReportEntry[])=>void;clients:Client[]}){
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<ReportEntry>>({mois:curMo(),followers:0,reach:0,engagement:0,posts:0})
  const [aiReport,setAiReport]=useState('');const [aiLoad,setAiLoad]=useState(false)

  const save=()=>{if(!form.client)return;setReports([...reports,{...form,id:uid()} as ReportEntry]);setModal(false)}

  const genReport=async(r:ReportEntry)=>{
    setAiLoad(true)
    const p=`Génère un rapport mensuel de performance réseaux sociaux pour mon client "${r.client}" en ${r.mois}. Stats : ${r.followers} abonnés, reach ${r.reach}, engagement ${r.engagement}%, ${r.posts} publications. Notes : ${r.notes||'RAS'}. Format professionnel avec : 📊 Résumé exécutif → 🎯 Points forts → ⚠️ Points d'amélioration → 💡 Recommandations pour le mois prochain → 📅 Plan d'action (3 actions concrètes). Agence : BaoPixel Digital Agency.`
    const txt=await askAI(p)
    setAiReport(txt);setAiLoad(false)
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">📈 Reporting Clients</span>
      <Btn onClick={()=>setModal(true)}>+ Saisir statistiques</Btn>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      <div>
        {reports.length===0?<EmptyState msg="Aucun rapport. Saisissez vos premières stats !" icon="📊"/>
        :reports.sort((a,b)=>b.mois.localeCompare(a.mois)).map(r=><div key={r.id} className="card" style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15}}>{r.client}</div><div className="text-muted">{r.mois}</div></div>
            <Btn sm onClick={()=>genReport(r)}>🤖 Générer rapport IA</Btn>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {[{l:'Abonnés',v:r.followers.toLocaleString(),c:'var(--purple-l)'},{l:'Reach',v:r.reach.toLocaleString(),c:'var(--blue)'},{l:'Engagement',v:`${r.engagement}%`,c:'var(--green)'},{l:'Posts',v:r.posts,c:'var(--yellow)'}].map(({l,v,c})=><div key={l} className="surface" style={{padding:'10px 12px'}}>
              <div className="text-muted">{l}</div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:17,color:c}}>{v}</div>
            </div>)}
          </div>
          {r.notes&&<div className="text-muted" style={{marginTop:10,fontSize:12}}>{r.notes}</div>}
        </div>)}
      </div>
      <div>
        {aiLoad&&<div className="card" style={{textAlign:'center',padding:60}}><Spinner/><div className="text-muted" style={{marginTop:12}}>Génération du rapport...</div></div>}
        {aiReport&&!aiLoad&&<div className="card" style={{lineHeight:1.8,fontSize:13,whiteSpace:'pre-wrap'}}>{aiReport}</div>}
        {!aiReport&&!aiLoad&&<div className="surface" style={{padding:40,textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:12}}>📊</div>
          <div className="text-muted">Saisissez les stats d'un client puis cliquez "Générer rapport IA" pour créer automatiquement un rapport professionnel.</div>
        </div>}
      </div>
    </div>
    {modal&&<Modal title="Saisir statistiques client" onClose={()=>setModal(false)}>
      <Select label="Client" value={form.client||''} onChange={v=>setForm({...form,client:v})} opts={['Sélectionner...',...clients.map(c=>c.nom),'Autre']}/>
      <Input label="Mois" type="month" value={form.mois||curMo()} onChange={v=>setForm({...form,mois:v})}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Input label="Abonnés" type="number" value={String(form.followers||0)} onChange={v=>setForm({...form,followers:Number(v)})}/>
        <Input label="Reach" type="number" value={String(form.reach||0)} onChange={v=>setForm({...form,reach:Number(v)})}/>
        <Input label="Taux engagement (%)" type="number" value={String(form.engagement||0)} onChange={v=>setForm({...form,engagement:Number(v)})}/>
        <Input label="Nombre de posts" type="number" value={String(form.posts||0)} onChange={v=>setForm({...form,posts:Number(v)})}/>
      </div>
      <Input label="Notes" value={form.notes||''} onChange={v=>setForm({...form,notes:v})} rows={2}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn><Btn onClick={save}>Enregistrer</Btn></div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: DECKS & DOCS
// ═══════════════════════════════════════════════════════════════
function DecksAndDocs({clients}:{clients:Client[]}){
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState('')
  const [type,setType]=useState('proposition commerciale')
  const [selClient,setSelClient]=useState(clients[0]?.nom||'')
  const TYPES=['proposition commerciale','présentation agence BaoPixel','brief créatif client','rapport mensuel','stratégie contenu 3 mois','onboarding client','script de vente']

  const gen=async()=>{
    setLoading(true);setResult('')
    const client=clients.find(c=>c.nom===selClient)
    const ctx=client?`Client : ${client.nom}, Secteur : ${client.secteur}, Pack : ${client.pack}, Budget : ${client.montant} FCFA/mois.`:'Client non spécifié.'
    const p=`Génère un ${type} professionnel pour BaoPixel Digital Agency (Mbour, Petite-Côte, Sénégal). ${ctx} L'agence propose : photo, vidéo, drone, identité visuelle, social media, stratégie digitale. Packs : Woyofal (150k), Sama (250k), Autorité (400k). Fondateur : Norta. Mise en forme structurée, professionnelle, avec des sections claires. En français.`
    const r=await askAI(p,'Tu es un expert en communication d\'agence digitale africaine. Génère des documents professionnels, structurés et convaincants en français.')
    setResult(r);setLoading(false)
  }

  const copy=()=>navigator.clipboard.writeText(result)
  const print_=()=>{
    const w=window.open('','_blank')
    if(w){w.document.write(`<!DOCTYPE html><html><head><title>BaoPixel — ${type}</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.8;color:#111;}h1,h2{color:#7C3AED;}strong{color:#111;}</style></head><body><h1>BaoPixel Digital Agency</h1><h2>${type.toUpperCase()}</h2><hr/><div style="white-space:pre-wrap">${result}</div></body></html>`);w.document.close();setTimeout(()=>w.print(),500)}
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg"><span className="heading-lg">📁 Decks & Docs</span><div className="text-muted" style={{fontSize:12}}>Générateur de documents IA</div></div>
    <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:14}}>
      <div className="card">
        <div className="section-label" style={{marginBottom:12}}>TYPE DE DOCUMENT</div>
        {TYPES.map(t=><button key={t} onClick={()=>setType(t)} className="surface" style={{padding:'10px 12px',textAlign:'left',cursor:'pointer',border:`1px solid ${type===t?'var(--purple)':'var(--border)'}`,borderRadius:8,fontSize:12,fontWeight:500,color:type===t?'var(--purple-l)':'var(--text)',background:type===t?'var(--purple-s)':'var(--surface)',display:'block',width:'100%',marginBottom:6}}>{t}</button>)}
        <div className="section-label" style={{marginTop:16,marginBottom:8}}>CLIENT</div>
        <Select value={selClient} onChange={setSelClient} opts={['BaoPixel (interne)',...clients.map(c=>c.nom)]}/>
        <Btn onClick={gen}>{loading?<><Spinner/> Génération...</>:'🤖 Générer le document'}</Btn>
      </div>
      <div>
        {loading&&<div className="card" style={{textAlign:'center',padding:60}}><Spinner/><div className="text-muted" style={{marginTop:12}}>Génération en cours...</div></div>}
        {result&&!loading&&<div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16}}>{type.toUpperCase()}</div>
            <div style={{display:'flex',gap:8}}>
              <Btn sm variant="ghost" onClick={copy}>📋 Copier</Btn>
              <Btn sm onClick={print_}>🖨️ Imprimer</Btn>
            </div>
          </div>
          <div style={{lineHeight:1.9,fontSize:14,whiteSpace:'pre-wrap'}}>{result}</div>
        </div>}
        {!result&&!loading&&<div className="surface" style={{padding:60,textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:12}}>📁</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Générateur de documents</div>
          <div className="text-muted">Sélectionne un type de document et un client pour générer automatiquement une proposition, un brief ou une présentation professionnelle.</div>
        </div>}
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: MOTIVATION
// ═══════════════════════════════════════════════════════════════
function MotivationModule({mot,setMot}:{mot:Motivation;setMot:(m:Motivation)=>void}){
  const [loading,setLoading]=useState(false)
  const [aiBoost,setAiBoost]=useState('')
  const now=new Date()
  const quoteIdx=now.getDay()%mot.quotes.length

  const checkStreak=()=>{
    const t=todayStr()
    if(mot.lastDay===t)return
    const yesterday=new Date(now);yesterday.setDate(yesterday.getDate()-1)
    const yStr=yesterday.toISOString().slice(0,10)
    const newStreak=mot.lastDay===yStr?mot.streak+1:1
    setMot({...mot,streak:newStreak,lastDay:t})
  }
  useEffect(()=>{checkStreak();},[])

  const getBoost=async()=>{
    setLoading(true);setAiBoost('')
    const p=`Je suis Norta, fondateur de BaoPixel, agence digitale à Mbour au Sénégal. J'en ai besoin d'une phrase de motivation ultra-puissante et personnalisée pour aujourd'hui, en tant que fondateur solo d'une agence audiovisuelle qui construit quelque chose de grand sur la Petite-Côte. Sois inspirant, direct, africain dans l'âme. Maximum 3 phrases.`
    const r=await askAI(p,'Tu es un coach de vie et mentor business pour entrepreneurs africains. Tu es direct, inspirant et ancré dans la réalité terrain.')
    setAiBoost(r);setLoading(false)
  }

  return <div className="fade-up">
    <div className="flex-between mb-lg"><span className="heading-lg">⚡ Motivation</span></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
      {/* Quote du jour */}
      <div className="card" style={{background:'linear-gradient(135deg,var(--purple-s2),var(--purple-s))',border:'1px solid rgba(124,58,237,.3)'}}>
        <div className="section-label" style={{color:'var(--purple-l)',marginBottom:16}}>💬 CITATION DU JOUR</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:700,lineHeight:1.5,fontStyle:'italic',color:'var(--text)',marginBottom:20}}>"{mot.quotes[quoteIdx]}"</div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--purple),var(--orange))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🔥</div>
          <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,color:'var(--orange)'}}>Série : {mot.streak} jour{mot.streak>1?'s':''}</div><div className="text-muted">Connexion quotidienne</div></div>
        </div>
      </div>
      {/* AI Boost */}
      <div className="card">
        <div className="section-label" style={{marginBottom:12}}>🤖 BOOST IA PERSONNALISÉ</div>
        {aiBoost?<div style={{fontSize:15,lineHeight:1.7,fontStyle:'italic',color:'var(--text)',marginBottom:16}}>{aiBoost}</div>:<div className="text-muted" style={{marginBottom:16}}>Besoin d'un coup de boost ? Demande à l'IA une phrase personnalisée pour aujourd'hui.</div>}
        <Btn onClick={getBoost}>{loading?<><Spinner/> Chargement...</>:'⚡ Booster ma journée'}</Btn>
      </div>
    </div>

    {/* Objectifs */}
    <div className="card" style={{marginBottom:14}}>
      <div className="section-label" style={{marginBottom:12}}>🎯 OBJECTIFS EN COURS</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {mot.objectifs.map((obj,i)=><div key={i} className="surface" style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:12,borderLeft:'3px solid var(--purple)'}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,color:'var(--purple)',fontSize:16}}>0{i+1}</span>
          <span style={{flex:1,fontWeight:600,fontSize:14}}>{obj}</span>
          <button onClick={()=>setMot({...mot,objectifs:mot.objectifs.filter((_,oi)=>oi!==i)})} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer'}}>✕</button>
        </div>)}
        <button onClick={()=>{const v=prompt('Nouvel objectif :');if(v)setMot({...mot,objectifs:[...mot.objectifs,v]})}} className="btn-secondary btn-sm" style={{alignSelf:'flex-start'}}>+ Ajouter objectif</button>
      </div>
    </div>

    {/* Affirmations */}
    <div className="card">
      <div className="section-label" style={{marginBottom:12}}>🌟 AFFIRMATIONS BAOPIXEL</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {mot.affirmations.map((a,i)=><div key={i} style={{background:`linear-gradient(135deg,${['var(--purple-s)','var(--orange-s)','var(--green-s)'][i%3]},transparent)`,border:`1px solid ${['rgba(124,58,237,.3)','rgba(249,115,22,.3)','rgba(16,185,129,.3)'][i%3]}`,borderRadius:10,padding:'14px 16px',position:'relative'}}>
          <div style={{fontSize:24,marginBottom:8}}>{'⚡💪🎯'[i%3]}</div>
          <div style={{fontWeight:600,fontSize:13,lineHeight:1.4}}>{a}</div>
          <button onClick={()=>setMot({...mot,affirmations:mot.affirmations.filter((_,ai)=>ai!==i)})} style={{position:'absolute',top:8,right:8,background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:12}}>✕</button>
        </div>)}
        <button onClick={()=>{const v=prompt('Nouvelle affirmation :');if(v)setMot({...mot,affirmations:[...mot.affirmations,v]})}} className="surface" style={{border:'2px dashed var(--border)',borderRadius:10,padding:'14px 16px',cursor:'pointer',color:'var(--muted)',fontSize:13}}>+ Ajouter affirmation</button>
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════════
// MODULE: ÉQUIPEMENT
// ═══════════════════════════════════════════════════════════════
function Equipement({equip,setEquip}:{equip:Equipment[];setEquip:(e:Equipment[])=>void}){
  const [modal,setModal]=useState(false)
  const [form,setForm]=useState<Partial<Equipment>>({cat:'Caméra',statut:'Disponible',valeur:0})
  const save=()=>{if(!form.nom)return;setEquip([...equip,{...form,id:uid()} as Equipment]);setModal(false)}
  const total=equip.reduce((s,e)=>s+e.valeur,0)
  const STAT_C:Record<string,string>={'Disponible':'var(--green)','À acquérir':'var(--orange)','Planifié':'var(--yellow)','En réparation':'var(--red)','Loué':'var(--blue)'}

  return <div className="fade-up">
    <div className="flex-between mb-lg">
      <span className="heading-lg">◉ Équipement</span>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <span className="text-muted" style={{fontSize:13}}>Valeur totale : <strong style={{color:'var(--purple-l)'}}>{fmtK(total)} FCFA</strong></span>
        <Btn onClick={()=>setModal(true)}>+ Ajouter</Btn>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
      {equip.map(e=><div key={e.id} className="card" style={{display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:44,height:44,borderRadius:10,background:'var(--purple-s)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
          {e.cat==='Caméra'?'📷':e.cat==='Drone'?'🚁':e.cat==='Stabilisateur'?'🎥':e.cat==='Post-production'?'💻':e.cat==='Mobilité'?'🖥️':'🔧'}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,marginBottom:2}}>{e.nom}</div>
          <div className="text-muted" style={{marginBottom:8,fontSize:12}}>{e.cat} · {e.usage}</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:11,fontWeight:700,color:STAT_C[e.statut]||'var(--muted)',background:`${STAT_C[e.statut]||'var(--muted)'}22`,padding:'3px 10px',borderRadius:20}}>{e.statut}</span>
            <span style={{color:'var(--yellow)',fontWeight:700,fontSize:13}}>{fmtK(e.valeur)} FCFA</span>
          </div>
        </div>
        <button onClick={()=>setEquip(equip.filter(x=>x.id!==e.id))} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:14}}>✕</button>
      </div>)}
    </div>
    {modal&&<Modal title="Ajouter équipement" onClose={()=>setModal(false)}>
      <Input label="Nom de l'équipement" value={form.nom||''} onChange={v=>setForm({...form,nom:v})}/>
      <Select label="Catégorie" value={form.cat||'Caméra'} onChange={v=>setForm({...form,cat:v})} opts={['Caméra','Drone','Stabilisateur','Objectif','Éclairage','Audio','Post-production','Mobilité','Accessoire']}/>
      <Select label="Statut" value={form.statut||'Disponible'} onChange={v=>setForm({...form,statut:v})} opts={['Disponible','À acquérir','Planifié','En réparation','Loué']}/>
      <Input label="Valeur (FCFA)" type="number" value={String(form.valeur||0)} onChange={v=>setForm({...form,valeur:Number(v)})}/>
      <Input label="Usage / Description" value={form.usage||''} onChange={v=>setForm({...form,usage:v})}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Annuler</Btn><Btn onClick={save}>Ajouter</Btn></div>
    </Modal>}
  </div>
}

// ═══════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════
export default function BaoPixelStudio(){
  // ── State ──────────────────────────────────────────────────
  const [tab,setTab]=useState<Tab>('dashboard')
  const [locked,setLocked]=useState(true)
  const [pin,setPin]=useState('')
  const [pinFirst,setPinFirst]=useState('')
  const [pinBuf,setPinBuf]=useState('')
  const [pinMsg,setPinMsg]=useState('')
  const [pinShake,setPinShake]=useState(false)
  const [sideOpen,setSideOpen]=useState(false)

  const [clients,setClientsRaw]=useState<Client[]>(()=>ST.get('bp_clients_v2',DEF_CLIENTS))
  const [tasks,setTasksRaw]=useState<Task[]>(()=>ST.get('bp_tasks_v2',DEF_TASKS))
  const [gains,setGainsRaw]=useState<Gain[]>(()=>ST.get('bp_gains_v2',DEF_GAINS))
  const [depenses,setDepensesRaw]=useState<Depense[]>(()=>ST.get('bp_dep_v2',DEF_DEPENSES))
  const [content,setContentRaw]=useState<Content[]>(()=>ST.get('bp_content_v2',DEF_CONTENT))
  const [ideas,setIdeasRaw]=useState<Idea[]>(()=>ST.get('bp_ideas_v2',DEF_IDEAS))
  const [equip,setEquipRaw]=useState<Equipment[]>(()=>ST.get('bp_equip_v2',DEF_EQUIP))
  const [prods,setProdsRaw]=useState<PreProd[]>(()=>ST.get('bp_prods_v2',DEF_PREPROD))
  const [devis,setDevisRaw]=useState<Devis[]>(()=>ST.get('bp_devis_v2',DEF_DEVIS))
  const [reports,setReportsRaw]=useState<ReportEntry[]>(()=>ST.get('bp_reports_v2',DEF_REPORTS))
  const [motivation,setMotivationRaw]=useState<Motivation>(()=>ST.get('bp_motivation_v2',DEF_MOTIVATION))
  const [goal,setGoalRaw]=useState<number>(()=>ST.get('bp_goal_v2',700000))

  // Auto-save wrappers
  const setClients=(v:Client[])=>{setClientsRaw(v);ST.set('bp_clients_v2',v)}
  const setTasks=(v:Task[])=>{setTasksRaw(v);ST.set('bp_tasks_v2',v)}
  const setGains=(v:Gain[])=>{setGainsRaw(v);ST.set('bp_gains_v2',v)}
  const setDepenses=(v:Depense[])=>{setDepensesRaw(v);ST.set('bp_dep_v2',v)}
  const setContent=(v:Content[])=>{setContentRaw(v);ST.set('bp_content_v2',v)}
  const setIdeas=(v:Idea[])=>{setIdeasRaw(v);ST.set('bp_ideas_v2',v)}
  const setEquip=(v:Equipment[])=>{setEquipRaw(v);ST.set('bp_equip_v2',v)}
  const setProds=(v:PreProd[])=>{setProdsRaw(v);ST.set('bp_prods_v2',v)}
  const setDevis=(v:Devis[])=>{setDevisRaw(v);ST.set('bp_devis_v2',v)}
  const setReports=(v:ReportEntry[])=>{setReportsRaw(v);ST.set('bp_reports_v2',v)}
  const setMotivation=(v:Motivation)=>{setMotivationRaw(v);ST.set('bp_motivation_v2',v)}
  const setGoal=(v:number)=>{setGoalRaw(v);ST.set('bp_goal_v2',v)}

  // ── PIN Auth ───────────────────────────────────────────────
  const storedPin=ST.get('bp_pin_v2',null) as string|null

  const pk=(v:string)=>{
    if(pinBuf.length>=4)return
    const nb=pinBuf+v
    setPinBuf(nb)
    if(nb.length===4)setTimeout(()=>submitPin(nb),150)
  }
  const pdel=()=>setPinBuf(b=>b.slice(0,-1))

  const submitPin=(buf:string)=>{
    const stored=ST.get('bp_pin_v2',null) as string|null
    if(!stored){
      if(!pinFirst){setPinFirst(buf);setPinBuf('');setPinMsg('Confirmez votre PIN');return}
      if(buf===pinFirst){ST.set('bp_pin_v2',buf);setPinMsg('✅ PIN créé !');setTimeout(()=>setLocked(false),400)}
      else{setPinFirst('');setPinBuf('');setPinMsg('PINs différents — recommencez');setPinShake(true);setTimeout(()=>setPinShake(false),600)}
      return
    }
    if(buf===stored){setLocked(false)}
    else{setPinBuf('');setPinMsg('Code incorrect');setPinShake(true);setTimeout(()=>{setPinShake(false);setPinMsg('')},600)}
  }

  useEffect(()=>{const k=(e:KeyboardEvent)=>{if(locked){if('0123456789'.includes(e.key))pk(e.key);if(e.key==='Backspace')pdel()}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[locked,pinBuf,pinFirst])

  // ── CA Meter ────────────────────────────────────────────────
  const ca=gains.filter(g=>g.mois===curMo()).reduce((s,g)=>s+g.montant,0)
  const pct=Math.min(100,Math.round(ca/goal*100))

  // ── Keyboard shortcut ───────────────────────────────────────
  useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.ctrlKey&&e.key==='l'){setLocked(true);setPinBuf('');setPinFirst('');setPinMsg('')}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[])

  if(locked) return <div style={{position:'fixed',inset:0,background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:20,padding:'40px 36px',width:320,textAlign:'center',boxShadow:'0 40px 80px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:30,fontWeight:900,marginBottom:4}}>Bao<span style={{color:'var(--purple)'}}>Pixel</span><span style={{color:'var(--orange)',fontSize:16,marginLeft:4}}>Studio</span></div>
      <div style={{color:'var(--muted)',fontSize:12,marginBottom:28}}>Mbour · Petite-Côte · Sénégal</div>
      {!ST.get('bp_pin_v2',null)&&<div style={{fontSize:12,color:'var(--purple-l)',background:'var(--purple-s)',padding:'8px 14px',borderRadius:8,marginBottom:20}}>Première connexion — créez votre PIN</div>}
      {/* Dots */}
      <div className={pinShake?'shake':''} style={{display:'flex',gap:12,justifyContent:'center',marginBottom:28}}>
        {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',background:i<pinBuf.length?'var(--purple)':'transparent',border:`2px solid ${i<pinBuf.length?'var(--purple)':'var(--dim)'}`,transition:'all .15s'}}/>)}
      </div>
      {/* Keypad */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=><button key={i} onClick={()=>k==='⌫'?pdel():k?pk(k):null} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:'16px',fontSize:18,fontWeight:700,cursor:k?'pointer':'default',fontFamily:"'Plus Jakarta Sans',sans-serif",color:k?'var(--text)':'transparent',transition:'all .15s'}}
          onMouseEnter={e=>{if(k)(e.currentTarget as HTMLButtonElement).style.background='var(--dim)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='var(--surface)'}}>
          {k}
        </button>)}
      </div>
      {pinMsg&&<div style={{fontSize:13,color:pinMsg.includes('✅')?'var(--green)':'var(--red)',marginTop:14}}>{pinMsg}</div>}
    </div>
  </div>

  const renderModule=()=>{
    switch(tab){
      case 'dashboard': return <Dashboard clients={clients} tasks={tasks} gains={gains} depenses={depenses} goal={goal} goTab={(t)=>{setTab(t as Tab)}}/>
      case 'pipeline': return <Pipeline clients={clients} setClients={setClients}/>
      case 'agenda': return <Agenda tasks={tasks} setTasks={setTasks} clients={clients}/>
      case 'preprod': return <PreProduction prods={prods} setProds={setProds} clients={clients}/>
      case 'tresorerie': return <Tresorerie gains={gains} setGains={setGains} depenses={depenses} setDepenses={setDepenses} devis={devis} setDevis={setDevis} clients={clients}/>
      case 'editorial': return <Editorial content={content} setContent={setContent}/>
      case 'idees': return <IdeasContent ideas={ideas} setIdeas={setIdeas}/>
      case 'veille': return <VeilleIA/>
      case 'guide': return <GuideAlgo/>
      case 'reporting': return <Reporting reports={reports} setReports={setReports} clients={clients}/>
      case 'decks': return <DecksAndDocs clients={clients}/>
      case 'motivation': return <MotivationModule mot={motivation} setMot={setMotivation}/>
      case 'equip': return <Equipement equip={equip} setEquip={setEquip}/>
      default: return null
    }
  }

  const ICONS:Record<string,string>={dashboard:'⬡',pipeline:'◈',agenda:'◷',preprod:'▶',tresorerie:'◆',editorial:'▦',idees:'◉',veille:'✦',guide:'♦',reporting:'▲',decks:'▣',motivation:'⚡',equip:'◈'}

  return <div style={{display:'flex',minHeight:'100vh'}}>
    {/* Sidebar */}
    <aside style={{width:220,background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',overflow:'hidden',flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:'20px 18px 14px',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:900,letterSpacing:'-.02em'}}>
          Bao<span style={{color:'var(--purple)'}}>Pixel</span><span style={{color:'var(--orange)',fontSize:11,marginLeft:4}}>Studio</span>
        </div>
        <div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>Mbour · Petite-Côte</div>
      </div>
      {/* Nav */}
      <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:2,overflowY:'auto'}}>
        {MODULES.map(m=><button key={m.id} onClick={()=>setTab(m.id as Tab)}
          style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:9,border:'none',cursor:'pointer',textAlign:'left',width:'100%',fontFamily:"'Instrument Sans',sans-serif",fontWeight:600,fontSize:13,transition:'all .15s',background:tab===m.id?'var(--purple)':'transparent',color:tab===m.id?'#fff':'var(--muted)'}}>
          <span style={{fontSize:11,flexShrink:0}}>{m.icon}</span>{m.label}
        </button>)}
      </nav>
      {/* Bottom */}
      <div style={{padding:'12px 14px 18px',borderTop:'1px solid var(--border)'}}>
        <div style={{fontSize:10,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>CA Mensuel</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,marginBottom:6}}>{fmtK(ca)} FCFA</div>
        <ProgressBar val={pct}/>
        <div style={{fontSize:10,color:'var(--muted)',marginTop:4}}>{pct}% · Objectif {fmtK(goal)} FCFA</div>
        <button onClick={()=>{const v=prompt('Objectif mensuel (FCFA) :');if(v&&!isNaN(Number(v)))setGoal(Number(v))}} className="btn-secondary btn-sm" style={{marginTop:6,width:'100%',fontSize:11}}>✎ Modifier objectif</button>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button onClick={()=>{setLocked(true);setPinBuf('');setPinFirst('');setPinMsg('')}} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'6px 8px',borderRadius:8,background:'none',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:12,fontFamily:'inherit'}}>🔒</button>
          <ThemeToggle/>
        </div>
      </div>
    </aside>

    {/* Main */}
    <main style={{flex:1,overflowY:'auto',padding:'28px 32px',maxWidth:1100}}>
      {renderModule()}
    </main>
  </div>
}
