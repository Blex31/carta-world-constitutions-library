import { useState } from 'react';
import CompareCard from '../components/CompareCard';

export default function CompareModal({ctx}){
  const {aod,articles,compare,compared,countries,country,countryId,docs,setCompare}=ctx;
  const [selection,setSelection]=useState(null);
  const [theme,setTheme]=useState('');
  const chosen=selection||[];
  const compareCountries=countries.filter(c=>c.id!==countryId&&docs.some(d=>d.country===c.id&&d.type==='constitution'&&d.main));
  const themeOptions=[...new Set(compareCountries.flatMap(c=>{const d=docs.find(x=>x.country===c.id&&x.type==='constitution'&&x.main);return articles.filter(x=>x.doc===d?.id).flatMap(x=>x.tags||[])}))].sort();
  const selectedCards=chosen.length?compareCountries.filter(c=>chosen.includes(c.id)).map(c=>{const d=docs.find(x=>x.country===c.id&&x.type==='constitution'&&x.main);const list=articles.filter(x=>x.doc===d?.id);const pick=theme?list.find(x=>(x.tags||[]).includes(theme)):list.find(x=>(x.tags||[]).some(t=>(aod?.tags||[]).includes(t)))||list[0];return pick?{country:c,article:pick}:null}).filter(Boolean):null;
  const cards=selectedCards||compared;
  return (<>
  {compare&&<div className="backdrop" onClick={e=>e.target===e.currentTarget&&setCompare(false)}><section className="modal compare-modal"><button className="close" onClick={()=>setCompare(false)}>×</button><small className="overline">A WIDER PERSPECTIVE</small><h2>One idea. <em>Different constitutions.</em></h2><p>These passages address related principles; they are not necessarily legally identical.</p>{compareCountries.length>0&&<div className="compare-picker"><small className="overline">COMPARE SPECIFIC COUNTRIES</small><div className="compare-chips">{compareCountries.map(c=><button key={c.id} className={chosen.includes(c.id)?'chip selected':'chip'} onClick={()=>setSelection(chosen.includes(c.id)?chosen.filter(id=>id!==c.id):[...chosen,c.id])}>{c.flag} {c.name}</button>)}</div>{themeOptions.length>0&&<label className="compare-theme">Passage theme<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="">Related to the current passage</option>{themeOptions.map(t=><option key={t} value={t}>{t.replaceAll('_',' ')}</option>)}</select></label>}{chosen.length>0&&<button className="outline" onClick={()=>{setSelection(null);setTheme('')}}>Reset to automatic comparison</button>}</div>}<div className="compare-grid">{aod&&<CompareCard country={country} article={aod}/>}{cards.map(x=><CompareCard key={x.country.id} {...x}/>)}</div>{selectedCards&&!selectedCards.length&&<div className="empty"><h3>No comparable passages yet</h3><p>The selected jurisdictions do not yet have a verified passage for the chosen theme.</p></div>}<small className="disclaimer">Educational comparison only — not legal advice.</small></section></div>}
  </>);
}
