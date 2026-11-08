import { title } from '../lib/format';
import PageHeader from '../components/PageHeader';

export default function ReadPage({ctx}){
  const {active,articleId,articles,bookmarks,chooseCountry,copyArticle,countries,countryId,documentId,font,highlights,mobileTocOpen,night,notes,readArticles,readDoc,setArticleId,setBookmarks,setDocumentId,setDownloads,setFont,setHighlights,setMobileTocOpen,setNight,setNoteOpen,setNoteText,shareImage,showToast,syncToggle,toggle,visibleDocs}=ctx;
  return (<>
      <PageHeader eyebrow="THE LIBRARY" title={<>Read the <em>text.</em></>} lead="Choose a document, then move through it chapter by chapter." right={<button className="outline" onClick={()=>setNight(!night)}>{night?'☼ Day mode':'☾ Night mode'}</button>}/>
      <div className="selectors"><label>COUNTRY<select value={countryId} onChange={e=>chooseCountry(e.target.value)}>{countries.map(c=><option value={c.id} key={c.id}>{c.flag} {c.name}</option>)}</select></label><label>DOCUMENT<select value={documentId} onChange={e=>{setDocumentId(e.target.value);setArticleId(articles.find(a=>a.doc===e.target.value)?.id||articleId)}}>{visibleDocs.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select></label></div>
      <div className="doc-summary"><span>▤</span><div><small className="overline">{readDoc.type.replace('_',' ').toUpperCase()} · {readDoc.year}</small><h3>{readDoc.title}</h3><p>{readArticles.length} verified provisions · {readDoc.version||'Version not supplied'}</p></div></div>
      <div className="mobile-toc-bar">
        <button className="mobile-toc-toggle" onClick={()=>setMobileTocOpen(!mobileTocOpen)}>
          <span>{mobileTocOpen ? '✕ Close contents' : '☰ Table of contents'}</span>
          <small>{active ? `${active.num}` : `${readArticles.length} provisions`} {mobileTocOpen ? '▲' : '▼'}</small>
        </button>
      </div>
      <div className="reader-grid">
        <aside className={'chapters ' + (mobileTocOpen ? 'mobile-open' : '')}>
          <div className="chapters-top-row">
            <b>CONTENTS</b>
            {mobileTocOpen&&<button className="chapters-close-mobile" onClick={()=>setMobileTocOpen(false)}>✕ Close</button>}
          </div>
          {readArticles.length?[...new Set(readArticles.map(a=>a.chapter))].map(n=><section key={n}><h4>{String(n).padStart(2,'0')}　{readArticles.find(a=>a.chapter===n).chapterTitle}</h4>{readArticles.filter(a=>a.chapter===n).map(a=><button className={active?.id===a.id?'selected':''} key={a.id} onClick={()=>{setArticleId(a.id);setMobileTocOpen(false)}}><small>{a.num}</small>{a.title}</button>)}</section>):<p className="muted-copy">No verified text is loaded for this jurisdiction yet.</p>}
        </aside>
        <article className="reader">{active?<><div className="reader-tools"><small>{readDoc.title}　›　{active.num}</small><div><button onClick={()=>setNight(!night)}>{night?'☼':'☾'}</button><button onClick={()=>copyArticle(active)}>▢</button><button onClick={()=>shareImage(active)}>↗</button></div></div><div className="reader-body"><small className="article-num">{active.num}</small><h2>{active.title}</h2><small className="ref">{active.source}</small><p className={'original '+(highlights.includes(active.id)?'highlight':'')} style={{fontSize:font}}>{active.original}</p><hr/><div className="plain"><b>✧ IN PLAIN LANGUAGE</b><p>{active.plain}</p></div><div className="tags">{active.tags.map(t=><span key={t}>{t}</span>)}</div><div className="reader-controls"><label>A− <input type="range" min="16" max="27" value={font} onChange={e=>setFont(Number(e.target.value))}/> A+</label><div className="actions"><button className={bookmarks.includes(active.id)?'primary':'outline'} onClick={()=>{const enabled=!bookmarks.includes(active.id);toggle(bookmarks,setBookmarks,active.id);syncToggle('bookmark',active.id,enabled)}}>☆ Bookmark</button><button className={highlights.includes(active.id)?'primary':'outline'} onClick={()=>{const enabled=!highlights.includes(active.id);toggle(highlights,setHighlights,active.id);syncToggle('highlight',active.id,enabled)}}>✎ Highlight</button><button className="outline" onClick={()=>{setNoteText(notes.find(n=>n.articleId===active.id)?.text||'');setNoteOpen(true)}}>＋ Note</button><button className="outline" onClick={()=>{setDownloads(v=>v.includes(readDoc.id)?v:[...v,readDoc.id]);syncToggle('download',readDoc.id,true);showToast('Document added to download list.')}}>↓ Download</button></div></div></div></>:<div className="empty"><h3>No verified text to read.</h3><p>Choose a jurisdiction with an available, reviewed source document.</p></div>}</article>
      </div>
      <p className="disclaimer">Legal text is published only after checking its official origin, current version and reuse rights.</p>
  </>);
}
