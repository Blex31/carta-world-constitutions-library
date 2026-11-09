
export default function WelcomeModal({ctx}){
  const {chooseCountry,countries,country,countryId,setWelcome,welcome}=ctx;
  return (<>
  {welcome&&<div className="backdrop"><section className="modal welcome-modal"><button className="close" onClick={()=>{setWelcome(false);localStorage.setItem('carta-welcomed','1')}}>×</button><div className="mark large">C<i/></div><small className="overline">WELCOME TO CARTA</small><h2>Start with <em>your country.</em></h2><p>Choose a jurisdiction to explore its legal catalogue. Documents appear when official texts have been verified and cleared for publication.</p><label>SELECT YOUR COUNTRY<select value={countryId} onChange={e=>chooseCountry(e.target.value)}><optgroup label="Verified Constitutional Charters">{countries.filter(c=>c.constitutionStatus==='verified_current').map(c=><option key={c.id} value={c.id}>{c.flag} {c.name} (Verified)</option>)}</optgroup><optgroup label="Catalogued Jurisdictions (Metadata)">{countries.filter(c=>c.constitutionStatus!=='verified_current').map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}</optgroup></select></label><button className="primary full" onClick={()=>{setWelcome(false);localStorage.setItem('carta-welcomed','1')}}>Enter the library →</button><small>You can still explore international law and other countries.</small></section></div>}
  </>);
}
