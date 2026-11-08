import React from 'react';
import PageHeader from '../components/PageHeader';
import AdSlot from '../components/AdSlot';

export default function SearchPage({ ctx }) {
  const {adConfig,billing,countries,docs,openArticle,query,setPage,setQuery} = ctx;
  return (
    <>
<PageHeader eyebrow="FIND A PASSAGE" title={<>Search the <em>library.</em></>} lead="Search across countries, constitutions, rights and plain-language explanations."/><div className="searchbox big"><span>⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&setPage('search')} placeholder="Try equality, taxation or devolution…"/>{query&&<button onClick={()=>setQuery('')}>×</button>}</div>{!query.trim()?<div className="empty"><div>⌕</div><h3>One library. Many legal traditions.</h3><p>Search a concept, a phrase from a document, or a country name.</p><div className="suggestions">{['equality','public participation','supremacy','rights'].map(s=><button key={s} onClick={()=>setQuery(s)}>{s} ↗</button>)}</div></div>:<div className="results"><small>{searchResults.length} results for “{query}”</small>{searchResults.map(a=>{const d=docs.find(x=>x.id===a.doc);const c=countries.find(x=>x.id===d.country);return <button className="result" key={a.id} onClick={()=>openArticle(a)}><small>{c?.flag||'🌐'} {c?.name||'International'}　·　{d.title}</small><h3>{a.title}</h3><p>{a.plain}</p><small>{a.num}　·　{a.source}</small><b>Open passage →</b></button>})}{!searchResults.length&&<div className="empty"><h3>No passages found</h3><p>Try a shorter phrase or another legal concept.</p></div>}<AdSlot isAdFree={billing.isAdFree} config={adConfig} slot="searchSlot"/></div>}
    </>
  );
}

