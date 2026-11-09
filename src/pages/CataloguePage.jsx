import PageHeader from '../components/PageHeader';

export default function CataloguePage({ctx}){
  const {countries,coverage}=ctx;
  const memberCount=countries.filter(country=>country.isUnMember===true).length;
  const observerCount=countries.filter(country=>['VA','PS'].includes(country.id)&&country.isUnMember===false).length;
  const areaCount=Math.max(0,countries.length-memberCount-observerCount);
  return (
    <>
      <PageHeader
        eyebrow="GLOBAL JURISDICTION CATALOGUE"
        title={<>Constitution <em>coverage.</em></>}
        lead="Explore the world's constitutional jurisdictions. A directory entry is not a claim that a current constitution has been published."
      />
      <div className="coverage-summary">
        <div><strong>{countries.length}</strong><span>directory records</span></div>
        <div><strong>{memberCount}</strong><span>UN Member States</span></div>
        <div><strong>{observerCount}</strong><span>UN observer states</span></div>
        <div><strong>{coverage.verified_current||0}</strong><span>verified current texts</span></div>
      </div>
      <p className="disclaimer">
        {areaCount} additional country/area records are listed separately. Their presence does not imply sovereign-state status. Only texts that have passed currentness and reuse review count as available constitutions.
      </p>
      <div className="coverage-list">
        {countries.map(country=>{
          const observer=['VA','PS'].includes(country.id)&&country.isUnMember===false;
          const entityLabel=country.isUnMember===true?'UN Member State':observer?'UN observer state':'Country / area record';
          const region=[country.region,country.continent].filter(Boolean).join(' · ');
          return (
            <div className="coverage-row" key={country.id}>
              <span>{country.flag} {country.name}</span>
              <small>{entityLabel}</small>
              <small>{region||'Region review pending'}</small>
              <small>{(country.constitutionStatus||'not_loaded').replaceAll('_',' ')}</small>
            </div>
          );
        })}
      </div>
      <p className="disclaimer">
        Some systems rely on multiple foundational instruments or an uncodified constitution. CARTA will label those accurately instead of inventing a single document.
      </p>
    </>
  );
}
