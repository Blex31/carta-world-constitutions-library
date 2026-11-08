import React from 'react';
export default function PageHeader({eyebrow,title,lead,right}){return <section className="page-header"><div><small className="overline">{eyebrow}</small><h1>{title}</h1><p>{lead}</p></div>{right}</section>}

