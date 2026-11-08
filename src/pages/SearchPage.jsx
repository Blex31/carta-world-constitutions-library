import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import AdSlot from '../components/AdSlot';

export default function SearchPage({ctx}){
  const {adConfig,billing,countries,docs,openArticle,query,searchResults,setPage,setQuery}=ctx;
  const [filterCountry,setFilterCountry]=useState('all');
  const [filterType,setFilterType]=useState('all');
  const resultDocs=searchResults.map(a=>docs.find(x=>x.id===a.doc)).filter(Boolean);
  const resultCountries=[...new Set(resultDocs.map(d=>d.country).filter(Boolean))].sort((a,b)=>(countries.find(x=>x.id===a)?.name||'').localeCompare(countries.find(x=>x.id===b)?.name||''));
  const resultTypes=[...new Set(resultDocs.map(d=>d.type))].sort();
  const filtered=searchResults.filter(a=>{
    const d=docs.find(x=>x.id===a.doc);
    if(!d)return false;
    if(filterCountry!=='all'&&d.country!==filterCountry)return false;
    if(filterType!=='all'&&d.type!==filterType)return false;
    return true;
  });
  const filtersActive=filterCountry!=='all'||filterType!=='all';
  return (<>
    <PageHeader eyebrow="FIND A PASSAGE" title={<>Search the <em>library.</em></>} lead="Search across countries, constitutions, rights and plain-language explanations."/>
    <div className="searchbox big"><span>⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&setPage('search')} placeholder="Try equality, taxation or devolution…"/>{query&&<button onClick={()=>setQuery('')}>×</button>}</div>
    {!query.trim()?<div className="empty"><div>⌕</div><h3>One library. Many legal traditions.</h3><p>Search a concept, a phrase from a document, or a country name.</p><div className="suggestions">{['equality','public participation','supremacy','rights'].map(s=><button key={s} onClick={()=>setQuery(s)}>{s} ↗</button>)}</div></div>:<>
      {(resultCountries.length>1||resultTypes.length>1)&&<div className="search-filters">
        <label>Country<select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)}><option value="all">All countries</option>{resultCountries.map(cId=><option key={cId} value={cId}>{countries.find(x=>x.id===cId)?.flag||'🌐'} {countries.find(x=>x.id===cId)?.name||cId}</option>)}</select></label>
        <label>Document type<select value={filterType} onChange={e=>setFilterType(e.target.value)}><option value="all">All document types</option>{resultTypes.map(t=><option key={t} value={t}>{t.replaceAll('_',' ')}</option>)}</select></label>
        {filtersActive&&<button className="outline" onClick={()=>{setFilterCountry('all');setFilterType('all')}}>Clear filters</button>}
      </div>}
      <div className="results"><small>{filtered.length} {filtersActive?`of ${searchResults.length} `:''}result{filtered.length===1?'':'s'} for “{query}”</small>{filtered.map(a=>{const d=docs.find(x=>x.id===a.doc);const c=countries.find(x=>x.id===d.country);return <button className="result" key={a.id} onClick={()=>openArticle(a)}><small>{c?.flag||'🌐'} {c?.name||'International'}　·　{d.title}</small><h3>{a.title}</h3><p>{a.plain}</p><small>{a.num}　·　{a.source}</small><b>Open passage →</b></button>})}{!filtered.length&&<div className="empty"><h3>No passages found</h3><p>Try a shorter phrase, another legal concept, or clear the active filters.</p></div>}<AdSlot isAdFree={billing.isAdFree} config={adConfig} slot="searchSlot"/></div>
    </>}
  </>);
}
