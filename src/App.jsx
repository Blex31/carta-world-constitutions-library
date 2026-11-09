import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch, apiUrl, getAccessToken, getSessionUser, requestPasswordReset, SUPABASE_PUBLISHABLE_KEY, signInWithEmail, signOut, signUpWithEmail, supabase, updatePassword } from './auth';
import seedJurisdictions from '../data/jurisdictions.seed.json';
import legalResearchArchiveImg from './assets/images/legal_research_archive_1794154959568.jpg';
import { dayKey, hash } from './lib/daily';
import { useStore } from './lib/use-store';
import { title, wrap } from './lib/format';
import researchPresets from './lib/research-presets';
import PageHeader from './components/PageHeader';
import CompareCard from './components/CompareCard';
import AdSlot from './components/AdSlot';
import HomePage from './pages/HomePage';
import ReadPage from './pages/ReadPage';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import CataloguePage from './pages/CataloguePage';
import SourcesPage from './pages/SourcesPage';
import LibraryPage from './pages/LibraryPage';
import AuthModal from './modals/AuthModal';
import PaywallModal from './modals/PaywallModal';
import WelcomeModal from './modals/WelcomeModal';
import CompareModal from './modals/CompareModal';
import IntroLoadingScreen from './components/IntroLoadingScreen';
import NoteModal from './modals/NoteModal';

export default function App(){
  const [countries,setCountries]=useState([]);
  const [docs,setDocs]=useState([]);
  const [articles,setArticles]=useState([]);
  const [dailyFeed,setDailyFeed]=useState([]);
  const [lastFeedUpdated,setLastFeedUpdated]=useState(null);
  const [clockTick,setClockTick]=useState(()=>Date.now());
  const [coverage,setCoverage]=useState({total:0,verified_current:0,text_loaded:0,metadata_only:0});
  const [account,setAccount]=useState(null);
  const [authOpen,setAuthOpen]=useState(false);
  const [authMode,setAuthMode]=useState('signin');
  const [authEmail,setAuthEmail]=useState('');
  const [authPassword,setAuthPassword]=useState('');
  const [authPasswordConfirm,setAuthPasswordConfirm]=useState('');
  const [authNotice,setAuthNotice]=useState('');
  const [authName,setAuthName]=useState('');
  const [authBusy,setAuthBusy]=useState(false);
  const [chatQuestion,setChatQuestion]=useState('');
  const [chatMessages,setChatMessages]=useState([]);
  const [chatSources,setChatSources]=useState([]);
  const [chatConversationId,setChatConversationId]=useState(null);
  const [chatBusy,setChatBusy]=useState(false);
  const [activeAssistantId,setActiveAssistantId]=useState(null);
  const [serverSearchResults,setServerSearchResults]=useState([]);
  const [page,setPage]=useState('home');
  const [countryId,setCountryId]=useStore('carta-country','KE');
  const [bookmarks,setBookmarks]=useStore('carta-bookmarks',[]);
  const [highlights,setHighlights]=useStore('carta-highlights',[]);
  const [notes,setNotes]=useStore('carta-notes',[]);
  const [downloads,setDownloads]=useStore('carta-downloads',[]);
  const [offline,setOffline]=useState(true);
  const [documentId,setDocumentId]=useState('');
  const [articleId,setArticleId]=useState('');
  const [query,setQuery]=useState('');
  const [night,setNight]=useState(false);
  const [font,setFont]=useState(19);
  const [libraryTab,setLibraryTab]=useState('Bookmarks');
  const [compare,setCompare]=useState(false);
  const [noteOpen,setNoteOpen]=useState(false);
  const [noteText,setNoteText]=useState('');
  const [mobileTocOpen,setMobileTocOpen]=useState(false);
  const [welcome,setWelcome]=useState(()=>!localStorage.getItem('carta-welcomed'));
  const [showIntro,setShowIntro]=useState(true);
  const [toast,setToast]=useState('');
  const [paywallOpen,setPaywallOpen]=useState(false);
  const [paywallPlan,setPaywallPlan]=useState('yearly');
  const [billing,setBilling]=useState({isAdFree:false,status:'free',currentPeriodEnd:null,cancelAtPeriodEnd:false});
  const [billingBusy,setBillingBusy]=useState(false);
  const [adConfig,setAdConfig]=useState({enabled:false,clientId:'',homeSlot:'',searchSlot:''});
  const [libraryDataReady,setLibraryDataReady]=useState(false);
  const [libraryError,setLibraryError]=useState('');
  const [adminSourceData,setAdminSourceData]=useState(null);
  const [adminSourcesBusy,setAdminSourcesBusy]=useState(false);
  const [newSourceOpen,setNewSourceOpen]=useState(false);
  const today=dayKey(new Date(clockTick));
  const country=countries.find(x=>x.id===countryId)||countries.find(x=>x.id==='KE')||countries[0]||{id:countryId,name:'Choose a country',flag:'🌐',constitutionStatus:'not_loaded'};
  const mainDoc=docs.find(x=>x.country===countryId&&x.type==='constitution'&&x.main)||null;
  const dailyArticles=mainDoc?articles.filter(x=>x.doc===mainDoc.id):[];
  const aod=dailyArticles[hash(countryId+'|'+today)%Math.max(dailyArticles.length,1)]||dailyArticles[0]||null;
  const eligibleFeed=dailyFeed.filter(item=>!item.jurisdictionIso||item.jurisdictionIso===countryId);
  const billItems=eligibleFeed.filter(item=>item.kind==='BILL');
  const currentItems=eligibleFeed.filter(item=>item.kind!=='BILL');
  const dailyCategory=hash(countryId+'|'+today+'|daily-category')%3;
  const dailyPick=(()=>{
    const choose=(items,suffix)=>items.length?items[hash(countryId+'|'+today+'|'+suffix)%items.length]:null;
    const fact=aod?{kind:'FACT',title:aod.title,body:aod.plain||aod.original,source:`${country.name} · ${mainDoc?.title||'Verified constitution'}`,sourceUrl:mainDoc?.officialUrl||null,article:aod}:null;
    const target=dailyCategory===0?fact:dailyCategory===1?choose(billItems,'bill'):choose(currentItems,'current');
    if(target)return target;
    return choose([...(fact?[fact]:[]),...billItems,...currentItems],'fallback');
  })();
  const daily=dailyPick;
  const active=articles.find(x=>x.id===articleId)||aod||null;
  const readDoc=docs.find(x=>x.id===documentId)||mainDoc||{id:null,title:'No verified legal text is available yet',type:'constitution',year:null};
  const readArticles=articles.filter(x=>x.doc===readDoc.id);
  const visibleDocs=docs.filter(x=>x.country===countryId||x.country===null);
  const localSearchResults=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return[];return articles.filter(a=>{const d=docs.find(x=>x.id===a.doc);const c=countries.find(x=>x.id===d?.country);return `${a.title} ${a.num} ${a.original} ${a.plain} ${a.tags.join(' ')} ${d?.title} ${c?.name}`.toLowerCase().includes(q)})},[query,articles,docs,countries]);
  const searchResults=serverSearchResults.length?serverSearchResults:localSearchResults;
  const compared=countries.filter(x=>x.id!==countryId).map(c=>{const d=docs.find(x=>x.country===c.id&&x.type==='constitution'&&x.main);const list=articles.filter(x=>x.doc===d?.id);return{country:c,article:list.find(x=>x.tags.some(t=>(aod?.tags||[]).includes(t)))||list[0]}}).filter(x=>x.article);

  useEffect(()=>{
    if(page==='chat'&&chatMessages.length>0){
      const el=document.getElementById('chat-bottom');
      el?.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  },[chatMessages,chatBusy,page]);

  // The application reads from the Supabase API. No sample constitutional text is displayed as live law.
  useEffect(()=>{
    let cancelled=false;
    apiFetch('library').then(async r=>{if(!r.ok)throw new Error('CARTA API unavailable');return r.json()}).then(data=>{
      if(cancelled)return;
      const nextCountries=(data.countries||[]).map(c=>({id:c.iso||c.id,name:c.name,flag:c.flag||'🌐',constitutionStatus:c.constitutionStatus||'not_loaded',jurisdictionKind:c.jurisdictionKind||'unclassified',isUnMember:c.isUnMember===true,continent:c.continent||'',region:c.region||''}));
      const nextDocs=(data.documents||[]).map(d=>({id:d.id,country:d.countryId||d.country_id||null,title:d.title,type:d.type,year:d.year,main:d.main,short:d.shortDescription||d.short_title||'',officialUrl:d.official_url,version:d.version_label,documentStatus:d.document_status,licenseStatus:d.license_status,commercialUseAllowed:d.commercial_use_allowed}));
      const chapterMap=new Map((data.chapters||[]).map(ch=>[ch.id,ch]));
      const nextArticles=(data.articles||[]).map(a=>{const ch=chapterMap.get(a.chapterId);return{id:a.id,doc:a.documentId,chapter:ch?.number||1,chapterTitle:ch?.title||'Document provisions',num:a.articleNumber,title:a.title,original:a.originalText||a.original||'',plain:a.simplifiedText||a.plain_language_summary||'',tags:a.tags||[],source:a.sourceReference||a.source||'',officialUrl:a.officialUrl||''}});
      const nextDaily=(data.dailyItems||[]).map(item=>({id:item.id,kind:item.type==='BILL'?'BILL':'CURRENT AFFAIR',title:item.title,body:item.body||'Open the official publisher for the update.',ref:item.ref,jurisdictionIso:item.jurisdictionIso||null,source:item.tag,sourceUrl:item.sourceUrl,publishedAt:item.publishedAt}));
      setCountries(nextCountries);setDocs(nextDocs);setArticles(nextArticles);setDailyFeed(nextDaily);setCoverage(data.coverage||{total:nextCountries.length,verified_current:0,text_loaded:0,metadata_only:nextCountries.length});setLibraryError('');
      const storedCountry=localStorage.getItem('carta-country')||countryId;
      const chosen=nextCountries.find(c=>c.id===storedCountry)||nextCountries.find(c=>c.id==='KE')||nextCountries[0];
      if(chosen){setCountryId(chosen.id);const main=nextDocs.find(d=>d.country===chosen.id&&d.type==='constitution'&&d.main);const firstAvailable=nextDocs.find(d=>d.country===chosen.id)||nextDocs.find(d=>d.country===null);const initialDoc=main||firstAvailable;if(initialDoc){setDocumentId(initialDoc.id);const first=nextArticles.find(a=>a.doc===initialDoc.id);if(first)setArticleId(first.id)}}
      setLibraryDataReady(true);
    }).catch(error=>{
      if(!cancelled){
        const seedList = Array.isArray(seedJurisdictions) ? seedJurisdictions : [];
        const nextCountries = seedList.map(c => ({
          id: c.iso_code,
          name: c.name,
          flag: c.flag_emoji || '🌐',
          constitutionStatus: 'metadata_only',
          jurisdictionKind: c.jurisdiction_kind || 'unclassified',
          isUnMember: c.is_un_member === true,
          continent: c.continent || '',
          region: c.region || '',
        }));
        setCountries(nextCountries);
        setDocs([]);
        setArticles([]);
        setDailyFeed([]);
        setCoverage({
          total: nextCountries.length,
          verified_current: 0,
          text_loaded: 0,
          metadata_only: nextCountries.length,
        });
        setLibraryError('CARTA could not reach its live library. The country directory is available, but no constitutional texts are loaded from local sample data.');
        const storedCountry = localStorage.getItem('carta-country') || countryId;
        const chosen = nextCountries.find(c => c.id === storedCountry) || nextCountries.find(c => c.id === 'KE') || nextCountries[0];
        if (chosen) setCountryId(chosen.id);
        setDocumentId('');
        setArticleId('');
        setLibraryDataReady(true);
      }
    });
    getSessionUser().then(user=>{if(!cancelled)setAccount(user)}).catch(()=>{});
    fetch('/ad-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(!cancelled&&data)setAdConfig({enabled:data.enabled===true,clientId:data.clientId||'',homeSlot:data.homeSlot||'',searchSlot:data.searchSlot||''})}).catch(()=>{});
    return()=>{cancelled=true};
  },[]);
  useEffect(()=>{
    if(!supabase)return;
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      setAccount(session?.user||null);
      if(event==='PASSWORD_RECOVERY'){
        setAuthMode('update');
        setAuthPassword('');
        setAuthPasswordConfirm('');
        setAuthNotice('Choose a new password for your CARTA account.');
        setAuthOpen(true);
      }
    });
    return()=>subscription.unsubscribe();
  },[]);
  // Keep the 06:00-local daily rotation accurate even when the app stays open.
  useEffect(()=>{const timer=window.setInterval(()=>setClockTick(Date.now()),60_000);return()=>window.clearInterval(timer)},[]);

  async function refreshFeed(showMessage=false){
    try{
      const response=await apiFetch(`feed?limit=80&country=${encodeURIComponent(countryId)}`);
      if(!response.ok)throw new Error('Official updates could not be refreshed');
      const data=await response.json();
      const items=(data.items||[]).map(item=>({
        id:item.id,
        kind:item.item_type==='bill'?'BILL':item.item_type==='judgment'?'COURT UPDATE':item.item_type==='legislation'?'LEGISLATION':'CURRENT AFFAIR',
        title:item.title,
        body:item.summary||'Headline only. Open the official publisher for the document and full details.',
        jurisdictionIso:item.jurisdiction_iso||null,
        source:item.source_name||item.publisher_url||'Official publisher',
        sourceUrl:item.canonical_url,
        publishedAt:item.published_at,
      }));
      setDailyFeed(items);
      setLastFeedUpdated(new Date());
      if(showMessage)showToast('Official legal updates refreshed.');
    }catch(error){if(showMessage)showToast(error.message||'Official updates could not be refreshed.');}
  }
  useEffect(()=>{
    if(!libraryDataReady)return;
    void refreshFeed(false);
    const timer=window.setInterval(()=>void refreshFeed(false),5*60_000);
    return()=>window.clearInterval(timer);
  },[libraryDataReady,countryId]);

  useEffect(()=>{
    if(!account||!libraryDataReady)return;
    let cancelled=false;
    apiFetch('library/me').then(async r=>{if(!r.ok)throw new Error('Account library unavailable');return r.json()}).then(data=>{
      if(cancelled)return;
      const owner=localStorage.getItem('carta-owner-user');
      const canMigrate=!owner||owner===String(account.id);
      const serverBookmarks=(data.bookmarks||[]).map(x=>x.sectionId||x.documentId),serverHighlights=(data.highlights||[]).map(x=>x.sectionId||x.id),serverNotes=(data.notes||[]).map(x=>({id:x.id,articleId:x.sectionId||x.id,documentId:x.documentId,text:x.text,date:x.date})),serverDownloads=(data.downloads||[]).map(x=>x.documentId);
      const localBookmarks=canMigrate?JSON.parse(localStorage.getItem('carta-bookmarks')||'[]'):[];
      const localHighlights=canMigrate?JSON.parse(localStorage.getItem('carta-highlights')||'[]'):[];
      const localNotes=canMigrate?JSON.parse(localStorage.getItem('carta-notes')||'[]'):[];
      const localDownloads=canMigrate?JSON.parse(localStorage.getItem('carta-downloads')||'[]'):[];
      const merge=(a,b)=>Array.from(new Set([...a,...b]));
      const resolveArticleId=id=>articles.some(a=>a.id===id)?id:null;
      const resolveDocumentId=id=>docs.some(d=>d.id===id)?id:null;
      const migratedBookmarks=localBookmarks.map(resolveArticleId).filter(Boolean).filter(id=>articles.some(a=>a.id===id));
      const migratedHighlights=localHighlights.map(resolveArticleId).filter(Boolean).filter(id=>articles.some(a=>a.id===id));
      const migratedNotes=localNotes.map(n=>({...n,articleId:resolveArticleId(n.articleId)})).filter(n=>n.articleId&&articles.some(a=>a.id===n.articleId));
      const migratedDownloads=localDownloads.map(resolveDocumentId).filter(Boolean);
      setBookmarks(merge(serverBookmarks,migratedBookmarks));
      setHighlights(merge(serverHighlights,migratedHighlights));
      const noteMap=new Map(serverNotes.map(n=>[n.articleId,n]));
      migratedNotes.forEach(n=>noteMap.set(n.articleId,n));
      setNotes([...noteMap.values()]);
      setDownloads(merge(serverDownloads,migratedDownloads));
      localStorage.setItem('carta-owner-user',String(account.id));
      setOffline(data.profile?.offline_default_enabled!==false);
      const preferred=countries.find(c=>c.id===data.profile?.preferred_jurisdiction_iso);
      if(preferred){setCountryId(preferred.id);const d=docs.find(x=>x.country===preferred.id&&x.main);if(d){setDocumentId(d.id);const first=articles.find(a=>a.doc===d.id);if(first)setArticleId(first.id)}}
      const pending=[];
      migratedBookmarks.filter(sectionId=>!serverBookmarks.includes(sectionId)).forEach(sectionId=>{const article=articles.find(a=>a.id===sectionId);if(article)pending.push(apiSave({action:'bookmark',operation:'save',documentId:article.doc,sectionId}))});
      migratedHighlights.filter(sectionId=>!serverHighlights.includes(sectionId)).forEach(sectionId=>{const article=articles.find(a=>a.id===sectionId);if(article)pending.push(apiSave({action:'highlight',operation:'save',documentId:article.doc,sectionId,selectedText:article.original}))});
      migratedNotes.filter(n=>!serverNotes.some(s=>s.articleId===n.articleId)).forEach(n=>{const article=articles.find(a=>a.id===n.articleId);if(article)pending.push(apiSave({action:'note',operation:'save',documentId:article.doc,sectionId:article.id,text:n.text}))});
      migratedDownloads.filter(documentId=>!serverDownloads.includes(documentId)).forEach(documentId=>pending.push(apiSave({action:'download',operation:'save',documentId})));
      void Promise.allSettled(pending);
    }).catch(()=>{});
    apiFetch('billing/status',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(!cancelled&&data)setBilling(data)}).catch(()=>{});
    return()=>{cancelled=true};
  },[account,libraryDataReady]);
  useEffect(()=>{
    const verify=async(sessionId)=>{try{const r=await apiFetch('billing/verify?checkoutSessionId='+encodeURIComponent(sessionId),{cache:'no-store'});const data=await r.json();if(!r.ok)throw new Error(data.error||'Verification pending');setBilling(v=>({...v,isAdFree:!!data.isAdFree,status:data.status||v.status}));showToast(data.isAdFree?'CARTA Plus is active. Your account is ad-free.':'Checkout received. Membership is being activated.')}catch{showToast('Checkout verification is still pending. Refresh your membership status shortly.')}};
    const message=e=>{if(e.origin!==window.location.origin||e.data?.type!=='PAYMENTS_RETURN')return;if(e.data.checkoutSessionId)void verify(e.data.checkoutSessionId)};
    window.addEventListener('message',message);
    const params=new URLSearchParams(window.location.search);const sessionId=params.get('checkoutSessionId');
    if(sessionId){void verify(sessionId);params.delete('checkoutSessionId');const url=new URL(window.location.href);url.searchParams.delete('checkoutSessionId');window.history.replaceState(window.history.state,'',url.toString())}
    return()=>window.removeEventListener('message',message);
  },[]);
  useEffect(()=>{
    if(query.trim().length<2){setServerSearchResults([]);return}
    let cancelled=false;const timer=setTimeout(()=>{apiFetch('search?q='+encodeURIComponent(query)+'&country='+encodeURIComponent(countryId)).then(r=>r.ok?r.json():{results:[]}).then(data=>{if(cancelled)return;setServerSearchResults((data.results||[]).map(x=>({id:x.chunk_id,doc:x.document_id,num:x.heading||'Provision',title:x.document_title,original:x.content,plain:'Verified legal text from the official source.',tags:[],source:x.official_url||x.document_title,url:x.official_url})))}).catch(()=>{if(!cancelled)setServerSearchResults([])})},250);
    return()=>{cancelled=true;clearTimeout(timer)};
  },[query,countryId]);
  function chooseCountry(id){setCountryId(id);const d=docs.find(x=>x.country===id&&x.type==='constitution'&&x.main)||docs.find(x=>x.country===id)||docs.find(x=>x.country===null);if(d){setDocumentId(d.id);const first=articles.find(x=>x.doc===d.id);if(first)setArticleId(first.id)}const selected=countries.find(x=>x.id===id);if(account&&selected)void apiSave({action:'preferences',countryIso:selected.id,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone}).catch(()=>{})}
  function openArticle(a){setArticleId(a.id);setDocumentId(a.doc);setPage('read');setCompare(false)}
  function toggle(arr,setter,id){setter(arr.includes(id)?arr.filter(x=>x!==id):[...arr,id])}
  async function apiSave(payload){const r=await apiFetch('library/me',{method:'POST',body:JSON.stringify(payload)});if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||'CARTA library sync failed');return r.json()}
  function syncToggle(action,id,enabled){if(!account)return;const article=articles.find(a=>a.id===id);const documentId=action==='download'?id:article?.doc;const payload=action==='download'?{action,operation:enabled?'save':'remove',documentId}:{action,operation:enabled?'save':'remove',documentId,sectionId:id,...(action==='highlight'&&article?{selectedText:article.original}:{})};if(!documentId)return;void apiSave(payload).catch(()=>showToast('Saved on this device. Sync will retry after signing in.'))}
  async function addSource(event){event.preventDefault();const formElement=event.currentTarget;const form=new FormData(formElement);const payload={slug:String(form.get('slug')||''),name:String(form.get('name')||''),publisher:String(form.get('publisher')||''),jurisdictionIso:String(form.get('jurisdictionIso')||''),sourceType:String(form.get('sourceType')||'other'),sourceUrl:String(form.get('sourceUrl')||''),feedUrl:String(form.get('feedUrl')||''),apiUrl:String(form.get('apiUrl')||''),documentationUrl:String(form.get('documentationUrl')||''),authorityRank:Number(form.get('authorityRank')||50),pollIntervalMinutes:form.get('pollIntervalMinutes')?Number(form.get('pollIntervalMinutes')):null,isOfficial:form.get('isOfficial')==='on',allowedHosts:String(form.get('allowedHosts')||'').split(',').map(x=>x.trim()).filter(Boolean),contentScope:String(form.get('contentScope')||'')};try{const r=await apiFetch('admin/sources',{method:'POST',body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||'Source could not be registered');formElement.reset();setNewSourceOpen(false);await refreshAdminSources();showToast('Source registered. It remains inactive and commercial reuse is disabled until reviewed.')}catch(error){showToast(error.message||'Source could not be registered.')}}
  async function refreshAdminSources(){if(!account)return;setAdminSourcesBusy(true);try{const r=await apiFetch('admin/sources');if(!r.ok)throw new Error('Administrator source access is not available.');setAdminSourceData(await r.json())}catch(error){showToast(error.message||'Could not load the source registry.')}finally{setAdminSourcesBusy(false)}}
  async function setSourceActive(source){try{const r=await apiFetch('admin/sources/'+source.id,{method:'PATCH',body:JSON.stringify({isActive:!source.is_active})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Source update failed');await refreshAdminSources();showToast(source.is_active?'Source feed paused.':'Metadata feed enabled. Full text remains blocked until rights approval.')}catch(error){showToast(error.message||'Source update failed.')}}
  async function saveSourceRights(source,event){event.preventDefault();const form=new FormData(event.currentTarget);const payload={licenseStatus:String(form.get('licenseStatus')||'review_required'),commercialUseAllowed:form.get('commercialUseAllowed')==='on',rightsEvidenceUrl:String(form.get('rightsEvidenceUrl')||''),rightsNotes:String(form.get('rightsNotes')||'')};try{const r=await apiFetch('admin/sources/'+source.id,{method:'PATCH',body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||'Rights review could not be saved.');await refreshAdminSources();showToast('Source rights review record saved.')}catch(error){showToast(error.message||'Rights review could not be saved.')}}
  async function runSourceIngestion(){setAdminSourcesBusy(true);try{const r=await apiFetch('admin/ingest',{method:'POST'});const data=await r.json();if(!r.ok)throw new Error(data.error||'Feed ingestion failed');showToast(`Feed checked: ${data.inserted||0} new items from ${data.sources||0} sources.`);await refreshAdminSources();const library=await apiFetch('library');if(library.ok){const payload=await library.json();setDailyFeed((payload.dailyItems||[]).map(item=>({id:item.id,kind:item.type==='BILL'?'BILL':'CURRENT AFFAIR',title:item.title,body:item.body||'Open the official publisher for the update.',ref:item.ref,jurisdictionIso:item.jurisdictionIso||null,source:item.tag,sourceUrl:item.sourceUrl,publishedAt:item.publishedAt})))}}catch(error){showToast(error.message||'Feed ingestion failed.')}finally{setAdminSourcesBusy(false)}}
  async function refreshBilling(){if(!account)return;setBillingBusy(true);try{const r=await apiFetch('billing/status',{cache:'no-store'});if(!r.ok)throw new Error('Subscription status unavailable');setBilling(await r.json())}catch{showToast('Could not refresh subscription status.')}finally{setBillingBusy(false)}}
  async function checkout(){if(!account){showToast('Sign in before upgrading to CARTA Plus.');return}const popup=window.open('about:blank','carta_checkout');setBillingBusy(true);try{const r=await apiFetch('billing/checkout',{method:'POST',body:JSON.stringify({plan:paywallPlan})});const data=await r.json();if(!r.ok||!data.url)throw new Error(data.error||'Checkout unavailable');if(popup)popup.location.href=data.url;else window.location.href=data.url}catch(e){popup?.close();showToast(e.message||'Checkout could not be started.')}finally{setBillingBusy(false)}}
  async function billingPortal(){const popup=window.open('about:blank','carta_billing');try{const r=await apiFetch('billing/portal',{method:'POST'});const data=await r.json();if(!r.ok||!data.url)throw new Error(data.error||'Billing portal unavailable');if(popup)popup.location.href=data.url;else window.location.href=data.url}catch(e){popup?.close();showToast(e.message||'Subscription management unavailable.')}}
  async function submitAuth(event){
    event.preventDefault();
    setAuthBusy(true);
    try{
      if(authMode==='forgot'){
        await requestPasswordReset(authEmail,window.location.origin);
        setAuthMode('signin');
        setAuthPassword('');
        setAuthNotice('If an account uses this email address, a password-reset link will arrive shortly.');
        showToast('Check your inbox for a password-reset link.');
        return;
      }
      if(authMode==='update'){
        if(authPassword!==authPasswordConfirm)throw new Error('Your new passwords do not match.');
        const user=await updatePassword(authPassword);
        setAccount(user||await getSessionUser());
        setAuthOpen(false);
        setAuthMode('signin');
        setAuthPassword('');
        setAuthPasswordConfirm('');
        setAuthNotice('');
        showToast('Your CARTA password has been updated.');
        return;
      }
      const mode=authMode;
      const user=mode==='signup'
        ? await signUpWithEmail(authEmail,authPassword,authName)
        : await signInWithEmail(authEmail,authPassword);
      const signedInUser=user||await getSessionUser();
      setAccount(signedInUser);
      setAuthOpen(false);
      setAuthPassword('');
      setAuthPasswordConfirm('');
      setAuthNotice('');
      if(mode==='signup'&&!signedInUser)showToast('Account created. Check your email to confirm your address before signing in.');
      else showToast(mode==='signup'?'Your CARTA account has been created.':'Welcome back to CARTA.');
    }catch(error){
      showToast(error.message||'Authentication failed.');
    }finally{
      setAuthBusy(false);
    }
  }
  async function leaveAccount(){
    try{
      await signOut();
      setAccount(null);
      setBookmarks([]);
      setHighlights([]);
      setNotes([]);
      setDownloads([]);
      localStorage.removeItem('carta-bookmarks');
      localStorage.removeItem('carta-highlights');
      localStorage.removeItem('carta-notes');
      localStorage.removeItem('carta-downloads');
      localStorage.removeItem('carta-owner-user');
      setBilling({isAdFree:false,status:'free',currentPeriodEnd:null,cancelAtPeriodEnd:false});
      showToast('You have signed out. Your private reading shelf has been cleared from this device.');
    }catch(error){
      showToast(error.message||'Sign out failed.');
    }
  }
  function showToast(s){setToast(s);setTimeout(()=>setToast(''),3200)}
  function copyCitation(source) {
    const text = `${source.title} (${source.label}), ${source.jurisdiction}; CARTA World Constitutions Library.`;
    navigator.clipboard.writeText(text).then(() => showToast('Legal citation copied to clipboard.')).catch(() => showToast('Citation copied.'));
  }

  async function askLegalQuestion(event, overrideQuestion){
    event?.preventDefault();
    const question=(overrideQuestion||chatQuestion).trim();
    if(question.length<3||chatBusy)return;
    setChatQuestion('');
    setChatBusy(true);
    setChatSources([]);
    const userMsg={id:crypto.randomUUID(),role:'user',content:question,jurisdiction:country.name,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})};
    const assistantId=crypto.randomUUID();
    setActiveAssistantId(assistantId);
    const setFailure=message=>{
      setChatMessages(v=>v.map(m=>m.id===assistantId?{...m,content:message,pending:false,error:true,sources:[]}:m));
      setChatSources([]);
      setChatBusy(false);
      setActiveAssistantId(null);
    };
    setChatMessages(v=>[...v,userMsg,{id:assistantId,role:'assistant',content:'',pending:true,sources:[],docTitle:mainDoc?.title||'Verified legal corpus',jurisdiction:country.name}]);

    if(!account||!SUPABASE_PUBLISHABLE_KEY){
      setFailure('Sign in to use CARTA legal research. CARTA answers only from verified, rights-cleared legal provisions and will not substitute sample text or general model knowledge.');
      return;
    }

    try{
      const token=await getAccessToken();
      if(!token)throw new Error('Your session has expired. Sign in again and retry.');
      const response=await fetch(apiUrl('legal-chat'),{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':`Bearer ${token}`},
        body:JSON.stringify({question,jurisdictionIso:countryId,conversationId:chatConversationId||undefined}),
        credentials:'omit'
      });
      if(!response.ok){
        let detail='';
        try{const payload=await response.json();detail=payload.error||payload.message||''}catch{}
        throw new Error(detail||'The verified legal research service is unavailable or no approved source text is available for this question.');
      }
      if(!response.body)throw new Error('The legal research service returned no response stream.');
      const reader=response.body.getReader();
      const decoder=new TextDecoder();
      let buffer='';
      let receivedText=false;
      const processBlock=block=>{
        const eventLine=block.split(/\r?\n/).find(line=>line.startsWith('event:'))||'';
        const dataLine=block.split(/\r?\n/).find(line=>line.startsWith('data:'))||'';
        if(!dataLine)return;
        let payload;
        try{payload=JSON.parse(dataLine.slice(5).trim())}catch{return}
        const eventName=eventLine.slice(6).trim();
        if(eventName==='meta'){
          setChatConversationId(payload.conversationId||null);
          setChatSources(payload.sources||[]);
          setChatMessages(v=>v.map(m=>m.id===assistantId?{...m,sources:payload.sources||[]}:m));
        }else if(eventName==='delta'&&typeof payload.text==='string'&&payload.text){
          receivedText=true;
          setChatMessages(v=>v.map(m=>m.id===assistantId?{...m,content:m.content+payload.text,pending:false}:m));
        }else if(eventName==='error'){
          throw new Error(payload.error||'The verified research service could not answer this question.');
        }
      };
      while(true){
        const {value,done}=await reader.read();
        if(done)break;
        buffer+=decoder.decode(value,{stream:true});
        const blocks=buffer.split(/\r?\n\r?\n/);
        buffer=blocks.pop()||'';
        for(const block of blocks)processBlock(block);
      }
      buffer+=decoder.decode();
      if(buffer.trim())processBlock(buffer);
      if(!receivedText)throw new Error('No verified legal passage was available. CARTA has not generated an answer.');
      setChatBusy(false);
      setActiveAssistantId(null);
    }catch(error){
      setFailure(error.message||'Legal research is temporarily unavailable. Try again after the verified source service is restored.');
    }
  }
  function newChat(){
    setActiveAssistantId(null);
    setChatBusy(false);
    setChatConversationId(null);
    setChatMessages([]);
    setChatSources([]);
    setChatQuestion('');
  }
  async function copyArticle(a){try{await navigator.clipboard.writeText(`${title(a)}\n\nOriginal text\n${a.original}\n\nIn plain language\n${a.plain}\n\n${a.source}\n\nCARTA — Every Constitution. Every Country. In Plain Language.`);showToast('Article copied.')}catch{showToast('Clipboard is unavailable in this browser.')}}
  async function shareImage(a){const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1200;const c=canvas.getContext('2d');c.fillStyle='#FFFBF2';c.fillRect(0,0,1200,1200);c.fillStyle='#1A7F37';c.fillRect(82,90,9,1020);c.fillStyle='#1A7F37';c.font='700 27px Inter';c.fillText('CARTA / WORLD CONSTITUTIONS LIBRARY',130,120);c.fillStyle='#1A1A1A';c.font='bold 48px Merriweather';c.fillText(title(a).slice(0,38),130,220);c.fillStyle='#6B6A61';c.font='700 22px Inter';c.fillText('ORIGINAL TEXT',130,315);c.fillStyle='#222';c.font='30px Merriweather';wrap(c,a.original,130,370,920,46,5);c.fillStyle='#1A7F37';c.font='700 22px Inter';c.fillText('IN PLAIN LANGUAGE',130,740);c.fillStyle='#303329';c.font='26px Inter';wrap(c,a.plain,130,800,920,40,5);c.fillStyle='#68685F';c.font='18px Inter';c.fillText(a.source.slice(0,90),130,1090);c.fillText('Educational explanation · Not legal advice',130,1128);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob){showToast('Image export failed.');return}const file=new File([blob],'carta-article.png',{type:'image/png'});if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:title(a)})}catch{showToast('Share cancelled.')}}else{const u=URL.createObjectURL(blob);const l=document.createElement('a');l.href=u;l.download='carta-article.png';l.click();URL.revokeObjectURL(u);showToast('Image saved. You can attach it to WhatsApp.')}}
function saveNote(){if(!noteText.trim())return;const text=noteText.trim();setNotes([{articleId:active.id,text,date:new Date().toLocaleDateString()},...notes.filter(n=>n.articleId!==active.id)]);if(account)void apiSave({action:'note',operation:'save',documentId:active.doc,sectionId:active.id,text}).catch(()=>showToast('Note saved locally; sync can be retried.'));setNoteText('');setNoteOpen(false);showToast('Note saved to your library.')}
const nav=[['home','⌂','Home'],['read','▤','Read'],['search','⌕','Search'],['chat','✧','Ask CARTA'],['catalogue','◎','Coverage'],['library','▣','Library'],['sources','↗','Sources']];
const navButtons=nav.map(([id,glyph,label])=><button key={id} className={page===id?'active':''} onClick={()=>{setPage(id);setMobileTocOpen(false);}}><span>{glyph}</span><small>{label}</small></button>);
  const ctx={account,active,activeAssistantId,adConfig,addSource,adminSourceData,adminSourcesBusy,aod,apiSave,articleId,articles,askLegalQuestion,authBusy,authEmail,authMode,authName,authNotice,authOpen,authPassword,authPasswordConfirm,billing,billingBusy,billingPortal,billItems,bookmarks,chatBusy,chatConversationId,chatMessages,chatQuestion,chatSources,checkout,chooseCountry,clockTick,compare,compared,copyArticle,copyCitation,countries,country,countryId,coverage,currentItems,daily,dailyArticles,dailyCategory,dailyFeed,dailyPick,docs,documentId,downloads,eligibleFeed,font,highlights,lastFeedUpdated,leaveAccount,libraryDataReady,libraryError,libraryTab,localSearchResults,mainDoc,mobileTocOpen,newChat,newSourceOpen,night,noteOpen,notes,noteText,offline,openArticle,page,paywallOpen,paywallPlan,query,readArticles,readDoc,refreshAdminSources,refreshBilling,refreshFeed,runSourceIngestion,saveNote,saveSourceRights,searchResults,serverSearchResults,setAccount,setActiveAssistantId,setAdConfig,setAdminSourceData,setAdminSourcesBusy,setArticleId,setArticles,setAuthBusy,setAuthEmail,setAuthMode,setAuthName,setAuthNotice,setAuthOpen,setAuthPassword,setAuthPasswordConfirm,setBilling,setBillingBusy,setBookmarks,setChatBusy,setChatConversationId,setChatMessages,setChatQuestion,setChatSources,setClockTick,setCompare,setCountries,setCountryId,setCoverage,setDailyFeed,setDocs,setDocumentId,setDownloads,setFont,setHighlights,setLastFeedUpdated,setLibraryDataReady,setLibraryError,setLibraryTab,setMobileTocOpen,setNewSourceOpen,setNight,setNoteOpen,setNotes,setNoteText,setOffline,setPage,setPaywallOpen,setPaywallPlan,setQuery,setServerSearchResults,setSourceActive,setToast,setWelcome,setShowIntro,showIntro,shareImage,showToast,submitAuth,syncToggle,toast,today,toggle,visibleDocs,welcome};

return <div className={'app '+(night?'night':'')}>
  <header className="topbar">
    <button className="brand" onClick={()=>setPage('home')}>
      <span className="mark">C<i/></span>
      <span><b>CARTA</b><small>WORLD CONSTITUTIONS LIBRARY</small></span>
    </button>
    <div className="headerRight">
      <span className="tagline" onClick={()=>setShowIntro(true)} style={{cursor:"pointer"}} title="View CARTA introduction">Every Constitution. Every Country. In Plain Language.</span>
      <button className="country-pill" onClick={()=>setWelcome(true)} title="Switch jurisdiction">
        <span className="country-flag">{country.flag}</span>
        <span className="country-name">{country.name}</span>
        <small className="country-arrow">▾</small>
      </button>
      <button className="iconBtn" onClick={()=>setNight(!night)} title={night?'Switch to day mode':'Switch to night mode'}>
        {night?'☼':'☾'}
      </button>
      <button className="upgrade-link" onClick={()=>{setPaywallOpen(true);void refreshBilling()}}>{billing.isAdFree?'CARTA Plus':'Plus'}</button>
      {account?<><button className="account-label" onClick={leaveAccount} title="Sign out">{account.name||account.displayName||account.email?.split('@')[0]||'Account'} · Sign out</button></>:<button className="signin-link" onClick={()=>setAuthOpen(true)}>Sign in</button>}
      <button className="iconBtn" onClick={()=>setPage('search')} title="Search the library">⌕</button>
    </div>
  </header>
  <div className="layout"><aside className="sidebar"><small className="overline">YOUR READING ROOM</small>{navButtons}<div className="sideBlock"><small className="overline">READING COUNTRY</small><b>{country.flag} {country.name}</b><p>Your daily article comes from this country's main constitution.</p><button className="outline" onClick={()=>setWelcome(true)}>Change country</button></div><div className="sideQuote">§<p>Understand the law.<br/><b>One article at a time.</b></p><small>Reference text + plain language</small><button className="textLink" style={{fontSize:"11.5px",marginTop:"6px",display:"inline-block"}} onClick={()=>setShowIntro(true)}>CARTA introduction ↗</button></div></aside>
  <main className="main">
    {libraryError&&<div className="empty" role="status"><h3>Live library unavailable</h3><p>{libraryError}</p></div>}
    {page==='home'&&<HomePage ctx={ctx}/>}
    {page==='read'&&<ReadPage ctx={ctx}/>}
    {page==='search'&&<SearchPage ctx={ctx}/>}
    {page==='chat'&&<ChatPage ctx={ctx}/>}
    {page==='catalogue'&&<CataloguePage ctx={ctx}/>}
    {page==='sources'&&<SourcesPage ctx={ctx}/>}
    {page==='library'&&<LibraryPage ctx={ctx}/>} 
  </main></div>
  <nav className="mobile-nav">{navButtons}</nav>
  {toast&&<div className="toast">✓ {toast}<button onClick={()=>setToast('')}>×</button></div>}
  <AuthModal ctx={ctx}/>
  <PaywallModal ctx={ctx}/>
  <WelcomeModal ctx={ctx}/>
  <CompareModal ctx={ctx}/>
  <NoteModal ctx={ctx}/>
  {showIntro&&<IntroLoadingScreen onComplete={()=>setShowIntro(false)}/>}
</div>}
