import { useEffect } from 'react';

export default function AdSlot({isAdFree,config,slot}){
  const slotId=config?.[slot];
  useEffect(()=>{
    if(isAdFree||!config?.enabled||!/^ca-pub-\d+$/.test(config.clientId||'')||!/^\d+$/.test(slotId||''))return;
    let script=document.querySelector('script[data-carta-ads="'+config.clientId+'"]');
    if(!script){script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.dataset.cartaAds=config.clientId;script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(config.clientId);document.head.appendChild(script)}
    const push=()=>{try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){console.warn('CARTA ad slot unavailable',e)}};
    if(script.dataset.loaded==='true')push();else{const loaded=()=>{script.dataset.loaded='true';push()};script.addEventListener('load',loaded,{once:true});return()=>script.removeEventListener('load',loaded)}
  },[isAdFree,config,slotId]);
  if(isAdFree||!config?.enabled||!/^ca-pub-\d+$/.test(config.clientId||'')||!/^\d+$/.test(slotId||''))return null;
  return <aside className="ad-frame" aria-label="Advertisement"><small>SPONSORED</small><ins className="adsbygoogle" style={{display:'block',minHeight:90}} data-ad-client={config.clientId} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true"/></aside>;
}
