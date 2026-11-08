import React from 'react';
import CompareCard from '../components/CompareCard';

export default function CompareModal({ ctx }) {
  const {compare,compared,setCompare} = ctx;
  return (
  <div className="backdrop" onClick={e=>e.target===e.currentTarget&&setCompare(false)}><section className="modal compare-modal"><button className="close" onClick={()=>setCompare(false)}>×</button><small className="overline">A WIDER PERSPECTIVE</small><h2>One idea. <em>Different constitutions.</em></h2><p>These passages address related principles; they are not necessarily legally identical.</p><div className="compare-grid">{aod&&<CompareCard country={country} article={aod}/>}{compared.map(x=><CompareCard key={x.country.id} {...x}/>)}</div><small className="disclaimer">Educational comparison only — not legal advice.</small></section></div>
  );
}

