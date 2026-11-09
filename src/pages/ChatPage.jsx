import { title } from '../lib/format';
import researchPresets from '../lib/research-presets';
import legalResearchArchiveImg from '../assets/images/legal_research_archive_1794154959568.jpg';

export default function ChatPage({ctx}){
  const {active,activeAssistantId,askLegalQuestion,chatBusy,chatMessages,chatQuestion,chooseCountry,copyCitation,countries,country,countryId,mainDoc,newChat,notes,openArticle,query,readArticles,setChatQuestion,setCompare,setNoteOpen,setNoteText}=ctx;
  return (<>
<div className="research-desk">
      <div className="research-hero">
        <img className="research-hero-img" src={legalResearchArchiveImg} alt="Classical constitutional law library" />
        <div className="research-hero-scrim"/>
        <div className="research-hero-content">
          <span className="research-eyebrow">✧ CONSTITUTIONAL RESEARCH DESK</span>
          <h1>Primary-source legal <em>inquiry.</em></h1>
          <p>Textual analysis grounded in verified national constitutions, bills of rights, and foundational legal instruments.</p>
        </div>
      </div>

      <div className="research-scope-bar">
        <div className="research-scope-left">
          <span className="scope-badge">
            <span>{country.flag}</span>
            <span>{country.name} · {mainDoc?.year || 'Current'}</span>
          </span>
          <select className="scope-jurisdiction-select" value={countryId} onChange={e=>chooseCountry(e.target.value)} title="Change active jurisdiction">
            {countries.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
          </select>
          <span className="scope-caption">Corpus: {readArticles.length || 'Indexed'} verified provisions</span>
        </div>
        <div className="actions" style={{margin:0}}>
          <button className="outline" onClick={newChat}>＋ New inquiry</button>
        </div>
      </div>

      {!readArticles.length&&<div className="empty corpus-empty"><div>§</div><h3>No approved constitutional text is available for {country.name} yet.</h3><p>CARTA's research assistant is disabled for this jurisdiction until an official text has been verified, rights-cleared and indexed. It will not generate answers from sample material or unsupported general knowledge.</p></div>}

      {!chatMessages.length?<div className="research-presets-section">
        <div className="research-presets-title">
          <small className="overline">SELECT A RESEARCH INQUIRY OR POSE YOUR OWN</small>
        </div>
        <div className="research-presets-grid">
          {researchPresets.map(preset=><button key={preset.theme} className="preset-card" disabled={!readArticles.length} onClick={()=>askLegalQuestion(null, preset.query)}>
            <small>{preset.theme}</small>
            <p>{preset.query}</p>
            <span className="action-arrow">Conduct research →</span>
          </button>)}
        </div>
      </div>:null}

      <div className="chat-window">
        {chatMessages.map(m=><article className={'chat-message '+m.role+(m.error?' error':'')} key={m.id}>
          {m.role==='user'?<>
            <small>RESEARCH INQUIRY · {m.jurisdiction || country.name} · {m.time || 'Today'}</small>
            <p>{m.content}</p>
          </>:<>
            <div className={'assistant-header ' + (chatBusy && activeAssistantId === m.id ? 'is-generating' : '')}>
              <small><span className="status-spark">✧</span> CARTA RESEARCH SYNTHESIS</small>
              <span className="doc-tag">{m.docTitle || mainDoc?.title}</span>
            </div>
            <div className="assistant-body">
              {(m.pending || (!m.content && chatBusy && activeAssistantId === m.id)) ? (
                <div className="thinking-indicator" role="status" aria-live="polite">
                  <span className="thinking-dots" aria-hidden="true">
                    <span className="thinking-dot"/>
                    <span className="thinking-dot"/>
                    <span className="thinking-dot"/>
                  </span>
                  <div className="thinking-meta">
                    <span className="thinking-title">Synthesizing constitutional provisions</span>
                    <span className="thinking-subtitle">Consulting indexed statutes and citations for {m.jurisdiction || country.name}…</span>
                  </div>
                </div>
              ) : (
                <p>
                  {m.content}
                  {chatBusy && activeAssistantId === m.id && (
                    <span className="typing-cursor" aria-hidden="true" title="Generating synthesis" />
                  )}
                </p>
              )}
              {m.sources?.length>0&&<div className="chat-sources-block">
                <b>Verified Primary Sources & Citations</b>
                <div className="chat-sources-grid">
                  {m.sources.map(source=><div className="source-citation-card" key={source.label+source.title}>
                    <div className="source-citation-top">
                      <span className="source-label">{source.label}</span>
                      <span className="source-official-link">{source.jurisdiction}</span>
                    </div>
                    <h4 className="source-title">{source.title}</h4>
                    {source.snippet&&<p className="source-snippet">“{source.snippet}”</p>}
                    <div className="source-actions">
                      {source.rawArticle?<button className="textLink" onClick={()=>openArticle(source.rawArticle)}>Read in Reader ↗</button>:null}
                      <button className="textLink" onClick={()=>copyCitation(source)}>Copy citation</button>
                      {source.url?<a className="textLink" href={source.url} target="_blank" rel="noreferrer">Official source ↗</a>:null}
                    </div>
                  </div>)}
                </div>
              </div>}
            </div>
            {!m.pending && !(chatBusy && activeAssistantId === m.id) && <div className="assistant-footer-actions">
              <button className="outline" onClick={()=>{if(m.sources?.[0])copyCitation(m.sources[0])}}>📋 Copy citation</button>
              <button className="outline" onClick={()=>{setNoteText(`Inquiry: ${chatMessages.find(x=>x.role==='user')?.content||''}\n\nSynthesis: ${m.content.slice(0,300)}...`);setNoteOpen(true)}}>✎ Save to library notes</button>
              <button className="outline" onClick={()=>setCompare(true)}>⇄ Compare other constitutions</button>
            </div>}
          </>}
        </article>)}
        <div id="chat-bottom"/>
      </div>

      <form className="chat-composer-container" onSubmit={askLegalQuestion}>
        <textarea
          rows={3}
          value={chatQuestion}
          onChange={e=>setChatQuestion(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();void askLegalQuestion(e)}}}
          placeholder={readArticles.length?`Ask about constitutional rights, legislative procedures, or governance powers in ${country.name}… (Press ⌘ + Enter to submit)`:'Research will be available when this jurisdiction has an approved legal text.'}
        />
        <div className="chat-composer-bottom">
          <span className="composer-hint">
            Verified citations <span aria-hidden="true">·</span> Press <kbd>⌘ + Enter</kbd> to submit
          </span>
          <div className="composer-buttons">
            {chatQuestion.trim()&&<button type="button" className="outline" onClick={()=>setChatQuestion('')}>Clear</button>}
            <button className="primary" type="submit" disabled={chatBusy||chatQuestion.trim().length<3||!readArticles.length}>
              {chatBusy?'Researching…':'Research provision →'}
            </button>
          </div>
        </div>
      </form>
</div>
  </>);
}
