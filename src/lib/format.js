export function title(a){return `${a.num} · ${a.title}`}

export function wrap(ctx,text,x,y,width,lh,max){let line='',n=0;for(const word of text.split(/\s+/)){const test=line?line+' '+word:word;if(ctx.measureText(test).width>width&&line){ctx.fillText(line,x,y);y+=lh;line=word;n++;if(n>=max)return y}else line=test}if(line&&n<max)ctx.fillText(line,x,y);return y+lh}

