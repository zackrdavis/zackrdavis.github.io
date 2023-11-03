var V=Object.defineProperty;var O=(c,o,t)=>o in c?V(c,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[o]=t;var p=(c,o,t)=>(O(c,typeof o!="symbol"?o+"":o,t),t);(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(e){if(e.ep)return;e.ep=!0;const s=t(e);fetch(e.href,s)}})();function f(c,o,t){const i=o.filter(e=>c.every(s=>Object.keys(e).includes(s)));for(let e=0;e<i.length;e++){const s=i[e],n=[...i.slice(0,e),...i.slice(e+1)];t(s,n)}}const m=()=>Math.floor(Date.now()+Math.random()*100),v=({color:c,diameter:o,location:t,velocity:i})=>({id:m(),style:{width:o,height:o,color:c},location:{x:t.x,y:t.y},velocity:{x:i.x,y:i.y},collisionBox:{width:o,height:o},friction:{coefficient:.001}});class R{constructor(){p(this,"canvas");p(this,"context");var o;this.canvas=document.querySelector("#ecsCanvas"),this.context=(o=this.canvas)==null?void 0:o.getContext("2d")}update(o){if(!this.canvas||!this.context)return;const t=this.context;this.context.clearRect(0,0,this.canvas.width,this.canvas.height),f(["style","location"],o,i=>{const{width:e,height:s,color:n}=i.style,{x:r,y:l}=i.location;t.fillStyle=n,t.fillRect(r,l,e,s)})}}class W{update(o){f(["location","velocity"],o,t=>{const{x:i,y:e}=t.location,{x:s,y:n}=t.velocity;t.location={x:i+s,y:e+n}})}}class D{update(o){f(["collisionBox","location"],o,(t,i)=>{const{x:e,y:s}=t.location,{width:n,height:r}=t.collisionBox,l=e,y=e+n,a=s,h=s+r;for(const d of i){const{x:E,y:S}=d.location,{width:A,height:B}=d.collisionBox,w=E,g=E+A,b=S,k=S+B;let u=0,x=0;y>=w&&g>=y?u=y-w:g>=l&&w<=l&&(u=g-l),a<=k&&b<=a?x=k-a:b<=h&&k>=h&&(x=h-b),u&&x&&(t.collisionEvent={entity:d,x:u>x||u==x,y:x>u||u==x})}})}}const C=(c,o,t)=>Math.min(Math.max(c,o),t);class N{constructor(){p(this,"keys",{ArrowUp:!1,ArrowDown:!1,ArrowLeft:!1,ArrowRight:!1});window.addEventListener("keydown",o=>{const t=o.key;t in this.keys&&(this.keys[t]=!0)}),window.addEventListener("keyup",o=>{const t=o.key;t in this.keys&&(this.keys[t]=!1)})}update(o){f(["velocity","playerControl"],o,t=>{const{ArrowUp:i,ArrowDown:e,ArrowLeft:s,ArrowRight:n}=this.keys,{acceleration:r,maxSpeed:l}=t.playerControl;if(n||s||e||i){const{x:y,y:a}=t.velocity,h=y+(n?r:s?-r:0),d=a+(e?r:i?-r:0);t.velocity={x:C(h,-l,l),y:C(d,-l,l)}}})}}const L=(c,o)=>c>=0?Math.max(c-o,0):Math.min(c+o,0);class z{update(o){f(["friction","velocity"],o,t=>{const{coefficient:i}=t.friction,{x:e,y:s}=t.velocity;t.velocity={x:L(e,i),y:L(s,i)}})}}class I{update(o){f(["style","collisionEvent","velocity","zombieVirus"],o,t=>{var a;const i=t.collisionEvent.entity,{x:e,y:s}=t.velocity,{x:n,y:r}=i.velocity||{x:0,y:0},l=Math.sqrt(e**2+s**2),y=Math.sqrt(n**2+r**2);l>y&&((a=i==null?void 0:i.style)!=null&&a.color)&&(i.zombieVirus=!0,i.style.color="green")})}}class K{update(o){f(["collisionEvent"],o,t=>{delete t.collisionEvent})}}class P{constructor(){p(this,"updates");this.updates=[]}update(o){f(["collisionEvent","velocity"],o,t=>{const{x:i,y:e}=t.velocity,{entity:s,y:n,x:r}=t.collisionEvent,{x:l,y}=s.velocity||{x:0,y:0},a=l==0&&y==0;let h=0,d=0;r&&n?(h=a?-i:l,d=a?-e:y):n?(h=a?-i:l,d=e):r&&(h=i,d=a?-e:y),this.updates.push({entity:t,newVelX:h,newVelY:d})}),this.updates.forEach(({entity:t,newVelX:i,newVelY:e})=>{t.velocity&&(t.velocity.x=i,t.velocity.y=e)}),this.updates=[]}}const F={id:m(),style:{width:460,height:20,color:"grey"},collisionBox:{width:460,height:20},location:{x:5,y:10}},T={id:m(),style:{width:20,height:580,color:"grey"},collisionBox:{width:20,height:580},location:{x:480,y:10}},U={id:m(),style:{width:420,height:20,color:"grey"},collisionBox:{width:420,height:20},location:{x:40,y:570}},X={id:m(),style:{width:20,height:590,color:"grey"},collisionBox:{width:20,height:590},location:{x:10,y:20}},Y=v({color:"magenta",diameter:20,location:{x:250,y:250},velocity:{x:-1,y:-1}}),j=v({color:"red",diameter:20,location:{x:290,y:250},velocity:{x:2,y:1}}),Z=v({color:"orange",diameter:20,location:{x:300,y:400},velocity:{x:-1,y:-2}}),G=v({color:"purple",diameter:20,location:{x:240,y:400},velocity:{x:-2,y:-2}}),M=v({color:"green",diameter:20,velocity:{x:-3,y:-.5},location:{x:300,y:300}});M.zombieVirus=!0;const q=v({color:"tomato",diameter:20,velocity:{x:0,y:0},location:{x:200,y:200}});q.friction={coefficient:.1};q.playerControl={acceleration:1,maxSpeed:3};const H=(c,o)=>{setInterval(()=>{for(const i of o)i.update(c)},10)};H([Y,j,Z,G,M,q,F,T,U,X],[new R,new W,new D,new P,new N,new z,new I,new K]);