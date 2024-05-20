(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerpolicy&&(n.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?n.credentials="include":i.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();const S=(o,t)=>t.filter(e=>o.every(l=>e[l]!==void 0)),v=o=>({id:o.id||crypto.randomUUID(),appearance:{width:o.width||20,height:o.height||20,color:o.role==="zombie"?"mediumSeaGreen":o.role==="civilian"?"pink":"magenta"},position:{x:o.x,y:o.y},velocity:{x:o.vx||0,y:o.vy||0},collisionBox:{width:o.width||20,height:o.height||20,collisions:[]},rigidBody:{stuck:!1},playerControl:o.role==="player"?!0:void 0,friction:o.role==="player"?.8:.05,infectable:o.role==="civilian"?!0:void 0,infectious:o.role==="zombie"?!0:void 0}),u=o=>{const t=o.orientation==="x"?o.length:o.thickness,e=o.orientation==="y"?o.length:o.thickness;return{id:o.id||crypto.randomUUID(),appearance:{width:t,height:e,color:"gray"},position:{x:o.x,y:o.y},collisionBox:{width:t,height:e,collisions:[]},rigidBody:{stuck:!0},velocity:{x:0,y:0}}};let k,x;const V=o=>{if(!k||!x)k=document.querySelector("canvas"),x=k==null?void 0:k.getContext("2d");else{x.clearRect(0,0,k.width,k.height);const t=S(["appearance","position"],o);for(const e of t){const{width:l,height:i,color:n,text:s}=e.appearance,{x:r,y:a}=e.position;x.fillStyle=n,x.fillRect(r,a,l,i),s&&(x.font=`${i}px Arial`,x.textAlign="center",x.textBaseline="middle",x.fillStyle="#000000",x.fillText(s,r+l/2,a+i/2*1.1))}}},A=7,K=3,M={ArrowUp:!1,ArrowDown:!1,ArrowLeft:!1,ArrowRight:!1,KeyW:!1,KeyS:!1,KeyA:!1,KeyD:!1};let O=!1;const I=(o,t,e)=>Math.min(Math.max(o,t),e),R=o=>{O||(window.addEventListener("keydown",y=>{!y.metaKey&&y.code in M&&(M[y.code]=!0)}),window.addEventListener("keyup",y=>{!y.metaKey&&y.code in M&&(M[y.code]=!1)}),O=!0);const{ArrowUp:t,ArrowLeft:e,ArrowDown:l,ArrowRight:i,KeyW:n,KeyA:s,KeyS:r,KeyD:a}=M,g=t||n,c=e||s,h=l||r,d=i||a,f=c&&d,w=g&&h;if(d||c||h||g){const y=f?0:d?K:c?-K:0,B=w?0:h?K:g?-K:0,b=S(["velocity","playerControl"],o);for(const p of b){const{x:m,y:L}=p.velocity,D=I(m+y,-A,A),U=I(L+B,-A,A);p.velocity={x:D,y:U}}}},Y=(o,t)=>o>=0?Math.max(o-t,0):Math.min(o+t,0),T=o=>{const t=S(["velocity","position","friction"],o);for(const e of t)e.position.x+=e.velocity.x,e.position.y+=e.velocity.y,e.velocity.x=Y(e.velocity.x,e.friction),e.velocity.y=Y(e.velocity.y,e.friction)},X=o=>{const t=S(["collisionBox","position"],o);t.forEach(e=>{const l=t.filter(c=>c!==e);e.collisionBox.collisions.length=0;const i=e.position.x,n=e.position.x+e.collisionBox.width,s=e.position.x+e.collisionBox.width/2,r=e.position.y,a=e.position.y+e.collisionBox.height,g=e.position.y+e.collisionBox.height/2;for(const c of l){const h=c.position.x,d=c.position.x+c.collisionBox.width,f=c.position.x+c.collisionBox.width/2,w=c.position.y,y=c.position.y+c.collisionBox.height,B=c.position.y+c.collisionBox.height/2;if(n>h&&i<d&&a>w&&r<y){let p=0,m=0;s<=f?p=n-h:s>=f&&(p=i-d),g<=B?m=a-w:g>=B&&(m=r-y),e.collisionBox.collisions.push({otherEntId:c.id,xOverlap:p,yOverlap:m})}}})},C=[],P=o=>{var e,l;const t=S(["position","rigidBody","collisionBox","velocity"],o);for(const i of t)if((l=(e=i.collisionBox)==null?void 0:e.collisions)!=null&&l.length){let{x:n,y:s}=i.velocity,{x:r,y:a}=i.position;for(const g of i.collisionBox.collisions){const{otherEntId:c,xOverlap:h,yOverlap:d}=g,f=t.find(L=>L.id===c);if(!(f!=null&&f.rigidBody))continue;const w=Math.abs(d)>Math.abs(h),y=Math.abs(h)>Math.abs(d),B=Math.abs(h)===Math.abs(d),b=f==null?void 0:f.rigidBody.stuck,{x:p,y:m}=(f==null?void 0:f.velocity)||{x:0,y:0};B?(n=b?-n:p,s=b?-s:m):w?(n=b?-n:p,s=s):y&&(s=b?-s:m,n=n),i.rigidBody.stuck||(B?(r-=h,a-=d):w?(r-=h,a=a):y&&(r=r,a-=d))}C.push({entity:i,newVelX:n,newVelY:s,newPosX:r,newPosY:a})}C.forEach(({entity:i,newVelX:n,newVelY:s,newPosX:r,newPosY:a})=>{i.velocity&&i.position&&(i.velocity.x=n,i.velocity.y=s,i.position.x=r,i.position.y=a)}),C.length=0},q=o=>{const t=S(["infectable","appearance","collisionBox","id"],o);for(const e of t)for(const l of e.collisionBox.collisions){const i=o.find(n=>n.id===l.otherEntId);i!=null&&i.infectious&&(e.infectious=!0,e.infectable=!1,e.appearance.color="mediumSeaGreen")}},G=o=>{const t=S(["velocity","infectious"],o);for(const e of t)e.velocity.x===0&&e.velocity.y===0&&(e.velocity.x=Math.ceil(Math.random()*10)-5,e.velocity.y=Math.ceil(Math.random()*10)-5)};let W=!1,z=!1;const N=o=>{var l;let t=0,e=0;for(const i of o)if(i.infectable&&t++,i.infectable&&((l=i.collisionBox)!=null&&l.collisions.length))for(const n of i.collisionBox.collisions){const s=o.find(r=>r.id===n.otherEntId);s!=null&&s.goal&&e++}t===0&&!W&&!z&&(z=!0,o.push(F)),e>=1&&!W&&!z&&(W=!0,o.push(E))},E={id:"message",appearance:{color:"pink",width:580,height:120,text:"You Win!"},position:{x:10,y:240}},F={id:"message",appearance:{color:"green",width:580,height:120,text:"You Lose!"},position:{x:10,y:240}},$=v({role:"player",x:100,y:110}),j=v({role:"civilian",x:15,y:95}),H=v({role:"civilian",x:50,y:110}),J=v({role:"civilian",x:20,y:120}),Q=v({role:"zombie",x:400,y:140,vx:-0,vy:1.5}),Z=v({role:"zombie",x:200,y:200,vx:.8,vy:-1}),_=v({role:"zombie",x:350,y:300,vx:.8,vy:-1}),oo=v({role:"zombie",x:200,y:300,vx:-2,vy:0}),eo=u({orientation:"x",length:580,thickness:10,x:10,y:0}),io=u({orientation:"x",length:580,thickness:20,x:10,y:590}),to=u({orientation:"y",length:600,thickness:10,x:0,y:0}),no=u({orientation:"y",length:600,thickness:20,x:590,y:0}),so=u({orientation:"x",length:110,thickness:10,x:10,y:80}),lo=u({orientation:"x",length:110,thickness:10,x:10,y:150}),co=u({orientation:"x",length:300,thickness:10,x:100,y:500}),ro=u({orientation:"y",length:300,thickness:10,x:240,y:130}),ao=u({orientation:"x",length:200,thickness:10,x:390,y:300}),yo={id:"goal",goal:!0,appearance:{width:80,height:80,color:"orange"},position:{x:210,y:510},collisionBox:{width:80,height:40,collisions:[]}},fo=[yo,j,H,J,Q,Z,_,oo,$,eo,io,to,no,so,lo,ro,co,ao],ho=[R,V,P,T,X,q,G,N],xo=()=>{for(const o of ho)o(fo)};setInterval(xo,33);
