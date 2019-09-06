const t=Object.prototype.toString,n=n=>t.call(n),e=t=>"[object Object]"===n(t),o=Object.prototype.hasOwnProperty,s=(t,n)=>o.call(t,n),c=t=>"function"==typeof t,a=t=>Object.keys(t).length<1,r="[object Object]",i="[object Array]";function l(t,e,o=""){const c=Object.keys(t),a=Object.keys(e),l=c.length,u=a.length;if(!l&&!u)return{};if(!l||!u)return t;const p={};for(let a=0;a<l;a++){const l=c[a],u=t[l],y=o+l;if(!s(e,l)){p[y]=u;continue}const g=e[l];if(u!==g){const t=n(u);t!==n(g)?p[y]=u:t===r?h(u,g,p,y):t===i?f(u,g,p,y):p[y]=u}}return p}function h(t,e,o,c){const a=Object.keys(t),l=Object.keys(e),u=a.length,p=l.length;if(u||p)if(!u||!p||u<p)o[c]=t;else{for(let n=0;n<p;n++){const e=l[n];if(!s(t,e))return void(o[c]=t)}for(let l=0;l<u;l++){const u=a[l],p=t[u],y=`${c}.${u}`;if(!s(e,u)){o[y]=p;continue}const g=e[u];if(p!==g){const t=n(p);t!==n(g)?o[y]=p:t===r?h(p,g,o,y):t===i?f(p,g,o,y):o[y]=p}}}}function f(t,e,o,s){const c=t.length,a=e.length;if(c||a)if(!c||!a||c<a)o[s]=t;else for(let l=0;l<c;l++){const c=t[l],u=`${s}[${l}]`;if(l>=a){o[u]=c;continue}const p=e[l];if(c!==p){const t=n(c);t!==n(p)?o[u]=c:t===r?h(c,p,o,u):t===i?f(c,p,o,u):o[u]=c}}}let u=null;function p(){return u}function y(t){u=t}function g(t){const n={storeName:"$store",hasMapState:!1,ownStateKeys:null,hasMapDispatch:!1,ownActionCreators:null};if(!u)return n;const{storeName:o,mapState:a,mapDispatch:r}=t;if(o&&(n.storeName=o),Array.isArray(a)&&a.length>0){const t=u.getState(),e=[];for(let n=0,o=a.length;n<o;n++)s(t,a[n])&&e.push(a[n]);e.length>0&&(n.hasMapState=!0,n.ownStateKeys=e)}if(e(r)){let t=!1;const e={},{dispatch:o}=u,s=Object.keys(r);for(let n=0,a=s.length;n<a;n++){const a=s[n],i=r[a];c(i)&&(t=!0,e[a]=(...t)=>o(i(...t)))}t&&(n.hasMapDispatch=!0,n.ownActionCreators=e)}return n}function d(t,n){const e=u.getState(),o={};for(let n=0,s=t.length;n<s;n++){const s=t[n];o[s]=e[s]}this.setData({[n]:o})}function b(t,n){let e=u.getState();return u.subscribe(()=>{let o=!1;const s={},c=u.getState();for(let n=0,a=t.length;n<a;n++){const a=t[n];c[a]!==e[a]&&(o=!0,s[a]=c[a])}if(o){const t=l(s,this.data[n],`${n}.`);a(t)||this.setData(t)}e=c})}function w(t,n){if(!e(t))throw new TypeError("setData第一个参数必须是一个对象");if(a(t)&&c(n))return void n();const o=l(t,this.data);a(o)?c(n)&&n():this.setData(o,n)}let j={};function O(){return j}function m(t){if(!e(t))throw new TypeError("配置参数必须是一个对象");const n=Object.keys(t);for(let e=0,o=n.length;e<o;e++)if(!c(t[n[e]]))throw new TypeError("目前只支持混入方法");j=t}function S(t={}){if(!e(t))throw new TypeError("配置参数必须是一个对象");const{storeName:n,hasMapState:o,ownStateKeys:s,hasMapDispatch:r,ownActionCreators:i}=g(t);return function(t){const{onLoad:e,onUnload:l}=t,h=!!p();let f=null;const u=O(),y=!a(u);return t.onLoad=function(t){h&&o&&(d.call(this,s,n),f=b.call(this,s,n)),e&&e.call(this,t)},t.onUnload=function(){l&&l.call(this),c(f)&&(f(),f=null)},y&&(t=Object.assign(u,t)),h&&r&&Object.assign(t,i),t.$setData=function(...t){w.apply(this,t)},Page(t)}}function D(t={}){if(!e(t))throw new TypeError("配置参数必须是一个对象");const{storeName:n,hasMapState:o,ownStateKeys:s,hasMapDispatch:r,ownActionCreators:i}=g(t);return function(t){const{attached:e,detached:l}=t,h=!!p();let f=null;const u=O(),y=!a(u);return t.attached=function(){h&&o&&(d.call(this,s,n),f=b.call(this,s,n)),e&&e.call(this)},t.detached=function(){l&&l.call(this),c(f)&&(f(),f=null)},t.methods||(t.methods={}),y&&(t.methods=Object.assign(u,t.methods)),h&&r&&Object.assign(t.methods,i),t.methods.$setData=function(...t){w.apply(this,t)},Component(t)}}export{D as $component,S as $page,p as getStore,m as setMixin,y as setStore};
