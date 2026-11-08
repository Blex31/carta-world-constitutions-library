import React from 'react';
export default function CompareCard({country,article}){return <article className="compare-card"><b>{country.flag} {country.name}</b><h3>{article.title}</h3><small>{article.source}</small><blockquote>{article.original}</blockquote><p>{article.plain}</p></article>}

