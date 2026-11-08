import { title } from '../lib/format';
import PageHeader from '../components/PageHeader';

export default function CataloguePage({ctx}){
  const {countries,coverage}=ctx;
  return (<>
<><PageHeader eyebrow="GLOBAL JURISDICTION CATALOGUE" title={<>Constitution <em>coverage.</em></>} lead="CARTA catalogues jurisdictions separately from the constitutional texts it has verified."/><div className="coverage-summary"><div><strong>{coverage.total||countries.length}</strong><span>jurisdictions catalogued</span></div><div><strong>{coverage.verified_current||0}</strong><span>verified current texts</span></div><div><strong>{coverage.metadata_only||0}</strong><span>metadata only</span></div></div><div className="coverage-list">{countries.map(c=><div className="coverage-row" key={c.id}><span>{c.flag} {c.name}</span><small>{(c.constitutionStatus||'not_loaded').replaceAll('_',' ')}</small><small>{c.jurisdictionKind||'unclassified'}</small></div>)}</div><p className="disclaimer">A blank coverage row means the text is not yet verified; it does not mean the jurisdiction has no constitution. Some jurisdictions use uncodified or multiple foundational instruments and require expert classification.</p></>
  </>);
}
