var O=Object.defineProperty;var M=(i,t,o)=>t in i?O(i,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[t]=o;var C=(i,t,o)=>(M(i,typeof t!="symbol"?t+"":t,o),o);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const c of e)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(e){const c={};return e.integrity&&(c.integrity=e.integrity),e.referrerpolicy&&(c.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?c.credentials="include":e.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(e){if(e.ep)return;e.ep=!0;const c=o(e);fetch(e.href,c)}})();const b=({color:i,diameter:t,location:o,velocity:s})=>({id:crypto.randomUUID(),style:{width:t,height:t,color:i},location:{x:o.x,y:o.y},velocity:{x:s.x,y:s.y},collisionBox:{width:t,height:t},friction:{coefficient:.001}});function u(i,t,o){const s=t.filter(e=>i.every(c=>Object.keys(e).includes(c)));for(let e=0;e<s.length;e++){const c=s[e],l=[...s.slice(0,e),...s.slice(e+1)];o(c,l)}}class R{constructor(){C(this,"canvas");C(this,"context");var t;this.canvas=document.querySelector("#ecsCanvas"),this.context=(t=this.canvas)==null?void 0:t.getContext("2d")}update(t){if(!this.canvas||!this.context)return;const o=this.context;this.context.clearRect(0,0,this.canvas.width,this.canvas.height),u(["style","location"],t,s=>{const{width:e,height:c,color:l}=s.style,{x,y:a}=s.location;o.fillStyle=l,o.fillRect(x,a,e,c)})}}class U{update(t){u(["location","velocity"],t,o=>{const{x:s,y:e}=o.location,{x:c,y:l}=o.velocity;o.location={x:s+c,y:e+l}})}}class B{update(t){u(["collisionBox","location"],t,(o,s)=>{const{x:e,y:c}=o.location,{width:l,height:x}=o.collisionBox,a=e,d=e+l,y=c,n=c+x;for(const r of s){const{x:f,y:h}=r.location,{width:w,height:g}=r.collisionBox,k=f,E=f+w,S=h,L=h+g;let m=0,p=0;d>=k&&E>=d?m=d-k:E>=a&&k<=a&&(m=E-a),y<=L&&S<=y?p=L-y:S<=n&&L>=n&&(p=n-S),m&&p&&(o.collisionEvent={entity:r,x:m>p||m==p,y:p>m||m==p})}})}}const A=(i,t,o)=>Math.min(Math.max(i,t),o);class D{constructor(){C(this,"keys",{ArrowUp:!1,ArrowDown:!1,ArrowLeft:!1,ArrowRight:!1,w:!1,a:!1,s:!1,d:!1});window.addEventListener("keydown",t=>{const o=t.key;o in this.keys&&(this.keys[o]=!0)}),window.addEventListener("keyup",t=>{const o=t.key;o in this.keys&&(this.keys[o]=!1)})}update(t){u(["velocity","playerControl"],t,o=>{const{ArrowUp:s,ArrowDown:e,ArrowLeft:c,ArrowRight:l,w:x,a,s:d,d:y}=this.keys,n=l||y,r=c||a,f=s||x,h=e||d,{acceleration:w,maxSpeed:g}=o.playerControl;if((n||r||h||f)&&!o.collisionEvent){const{x:k,y:E}=o.velocity,S=k+(n?w:r?-w:0),L=E+(h?w:f?-w:0);o.velocity={x:A(S,-g,g),y:A(L,-g,g)}}})}}const W=(i,t)=>i>=0?Math.max(i-t,0):Math.min(i+t,0);class I{update(t){u(["friction","velocity"],t,o=>{const{coefficient:s}=o.friction,{x:e,y:c}=o.velocity;o.velocity={x:W(e,s),y:W(c,s)}})}}class P{update(t){u(["style","collisionEvent","velocity","zombieVirus"],t,o=>{var e;const s=o.collisionEvent.entity;s!=null&&s.velocity&&((e=s==null?void 0:s.style)!=null&&e.color)&&(s.zombieVirus=!0,s.style.color="green")})}}class z{update(t){u(["collisionEvent"],t,o=>{delete o.collisionEvent})}}class K{constructor(){C(this,"updates");this.updates=[]}update(t){u(["collisionEvent","velocity","location"],t,o=>{const{x:s,y:e}=o.velocity,{entity:c,y:l,x}=o.collisionEvent,{x:a,y:d}=c.velocity||{x:0,y:0},y=a==0&&d==0;let n=0,r=0,f=o.location.x,h=o.location.y;x&&l?(n=y?-s:a,r=y?-e:d):l?(n=y?-s:a,r=e):x&&(n=s,r=y?-e:d),f+=n,h+=r,this.updates.push({entity:o,newVelX:n,newVelY:r,newPosX:f,newPosY:h})}),this.updates.forEach(({entity:o,newVelX:s,newVelY:e,newPosX:c,newPosY:l})=>{o.velocity&&o.location&&(o.velocity.x=s,o.velocity.y=e,o.location.x=c,o.location.y=l)}),this.updates=[]}}const v=({color:i,dims:t,location:o})=>({id:crypto.randomUUID(),style:{width:t.x,height:t.y,color:i},collisionBox:{width:t.x,height:t.y},location:{x:o.x,y:o.y}}),N=v({color:"grey",dims:{x:600,y:20},location:{x:0,y:0}}),T=v({color:"grey",dims:{x:20,y:600},location:{x:580,y:0}}),X=v({color:"grey",dims:{x:600,y:20},location:{x:0,y:580}}),Y=v({color:"grey",dims:{x:20,y:600},location:{x:0,y:0}}),F=v({color:"grey",dims:{x:100,y:20},location:{x:200,y:180}}),j=v({color:"grey",dims:{x:20,y:100},location:{x:300,y:200}}),Z=v({color:"grey",dims:{x:20,y:100},location:{x:180,y:200}}),G=b({color:"tomato",diameter:20,location:{x:500,y:500},velocity:{x:-1,y:-1}}),H=b({color:"red",diameter:20,location:{x:350,y:250},velocity:{x:2,y:1}}),J=b({color:"orange",diameter:20,location:{x:400,y:400},velocity:{x:-1,y:-2}}),Q=b({color:"purple",diameter:20,location:{x:240,y:400},velocity:{x:-2,y:-2}}),V=b({color:"green",diameter:20,velocity:{x:-3,y:-.5},location:{x:300,y:340}}),q=b({color:"magenta",diameter:20,velocity:{x:0,y:0},location:{x:240,y:240}});V.zombieVirus=!0;q.friction={coefficient:.1};q.playerControl={acceleration:1,maxSpeed:3};const _=(i,t)=>{setInterval(()=>{for(const s of t)s.update(i)},10)};_([G,H,J,Q,V,q,N,T,X,Y,F,j,Z],[new R,new U,new B,new K,new D,new I,new P,new z]);
