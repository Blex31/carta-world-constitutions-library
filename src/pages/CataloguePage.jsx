import React, { useState } from 'react';
import { title } from '../lib/format';
import PageHeader from '../components/PageHeader';

export default function CataloguePage({ctx}){
  const {countries,coverage,chooseCountry,setPage}=ctx;
  const [filter, setFilter] = useState('all');

  const filtered = countries.filter(c => {
    if (filter === 'verified') return c.constitutionStatus === 'verified_current';
    if (filter === 'metadata') return c.constitutionStatus !== 'verified_current';
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="GLOBAL JURISDICTION CATALOGUE"
        title={<>Constitution <em>coverage.</em></>}
        lead="CARTA maintains genuine primary constitutional texts for verified nations, with full gazette citations, verified provisions, and plain-language summaries."
      />

      <div className="coverage-summary">
        <div style={{cursor:'pointer'}} onClick={()=>setFilter('all')}>
          <strong>{coverage.total||countries.length}</strong>
          <span>jurisdictions catalogued</span>
        </div>
        <div style={{cursor:'pointer', borderLeft:'3px solid var(--accent, #0b6b47)'}} onClick={()=>setFilter('verified')}>
          <strong style={{color:'var(--accent, #0b6b47)'}}>{coverage.verified_current||0}</strong>
          <span>verified current texts</span>
        </div>
        <div style={{cursor:'pointer'}} onClick={()=>setFilter('metadata')}>
          <strong>{coverage.metadata_only||0}</strong>
          <span>metadata only</span>
        </div>
      </div>

      <div style={{display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center'}}>
        <span style={{fontSize:'12px', fontWeight:600, color:'var(--muted, #666)', textTransform:'uppercase', letterSpacing:'0.05em'}}>Filter:</span>
        <button
          className={filter==='all' ? 'primary' : 'outline'}
          style={{padding:'6px 12px', fontSize:'13px'}}
          onClick={()=>setFilter('all')}
        >
          All ({countries.length})
        </button>
        <button
          className={filter==='verified' ? 'primary' : 'outline'}
          style={{padding:'6px 12px', fontSize:'13px'}}
          onClick={()=>setFilter('verified')}
        >
          ✓ Verified Current Texts ({coverage.verified_current||0})
        </button>
        <button
          className={filter==='metadata' ? 'primary' : 'outline'}
          style={{padding:'6px 12px', fontSize:'13px'}}
          onClick={()=>setFilter('metadata')}
        >
          Metadata Only ({coverage.metadata_only||0})
        </button>
      </div>

      <div className="coverage-list">
        {filtered.map(c => {
          const isVerified = c.constitutionStatus === 'verified_current';
          return (
            <div
              className="coverage-row"
              key={c.id}
              style={{
                cursor: isVerified ? 'pointer' : 'default',
                transition: 'background 0.15s ease',
              }}
              onClick={() => {
                if (isVerified) {
                  chooseCountry(c.id);
                  setPage('read');
                }
              }}
              title={isVerified ? `Click to open the Constitution of ${c.name} in Reader` : `${c.name} metadata only`}
            >
              <span style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <span style={{fontSize:'18px'}}>{c.flag}</span>
                <strong>{c.name}</strong>
              </span>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <small style={{
                  background: isVerified ? 'rgba(11,107,71,0.12)' : 'rgba(0,0,0,0.05)',
                  color: isVerified ? 'var(--accent, #0b6b47)' : 'inherit',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: isVerified ? 600 : 400,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {isVerified ? '✓ Verified Current' : (c.constitutionStatus||'metadata_only').replaceAll('_',' ')}
                </small>
                {isVerified && (
                  <span style={{fontSize:'12px', color:'var(--accent, #0b6b47)', fontWeight:600}}>
                    Read text →
                  </span>
                )}
                <small style={{color:'var(--muted, #888)'}}>{c.jurisdictionKind||'sovereign state'}</small>
              </div>
            </div>
          );
        })}
      </div>

      <p className="disclaimer">
        CARTA strictly verifies primary legal sources from official Gazettes, Parliaments, and Law Reform Commissions before loading full constitutional text.
      </p>
    </>
  );
}
