import { useEffect, useState } from 'react';
export function useStore(key,initial){const [v,setV]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});useEffect(()=>localStorage.setItem(key,JSON.stringify(v)),[key,v]);return [v,setV]}

