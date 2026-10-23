import test from 'node:test';
import assert from 'node:assert/strict';
import {GET as aula} from '../app/api/classroom.js/route.js';
import {GET,POST,DELETE} from '../app/api/access/route.js';
process.env.BUYER_ACCESS_CODE='TEST-ONLY';
process.env.ACCESS_SESSION_SECRET='local-test-signing-secret-not-for-production';
function request(method='GET',body,cookie='',origin='https://aula.example',ip='203.0.113.9') {return new Request('https://aula.example/api/access',{method,headers:{origin,'x-imperio-request':'1','Content-Type':'application/json',cookie,'x-vercel-forwarded-for':ip},...(body!==undefined?{body:JSON.stringify(body)}:{})})}
test('Videos protegidos y ciclo de acceso completo',async()=>{
 let res=await aula(request());assert.equal(res.status,401);assert.equal(await res.text(),'');
 assert.equal((await GET(request())).status,401);
 assert.equal((await POST(request('POST',{code:'incorrecto'}))).status,401);
 assert.equal((await POST(request('POST',null))).status,401);
 assert.equal((await POST(request('POST',{code:'TEST-ONLY'},'','https://otro.example'))).status,403);
 res=await POST(request('POST',{code:'TEST-ONLY',remember:true}));assert.equal(res.status,200);
 const cookie=res.headers.get('set-cookie');assert.match(cookie,/HttpOnly; Secure; SameSite=Strict; Max-Age=2592000/);
 assert.equal((await GET(request('GET',undefined,cookie))).status,200);
 const lessons=await aula(request('GET',undefined,cookie));assert.equal(lessons.status,200);assert.match(await lessons.text(),/EFr4ZEBtqlg/);assert.match(lessons.headers.get('cache-control'),/no-store/);
 assert.equal((await aula(request('GET',undefined,cookie.replace(/imperio_access=./,'imperio_access=0')))).status,401);
 const logout=await DELETE(request('DELETE'));assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 process.env.BUYER_ACCESS_CODE='ROTATED';assert.equal((await GET(request('GET',undefined,cookie))).status,401);process.env.BUYER_ACCESS_CODE='TEST-ONLY';
 res=await POST(request('POST',{code:'TEST-ONLY',remember:false}));assert.doesNotMatch(res.headers.get('set-cookie'),/Max-Age/);
 for(let i=0;i<8;i++)await POST(request('POST',{code:'wrong'},'',undefined,'203.0.113.10'));
 assert.equal((await POST(request('POST',{code:'wrong'},'',undefined,'203.0.113.10'))).status,429);
});
test('La portada no publica claves ni videos',async()=>{
 const {GET:home}=await import('../app/route.js');const html=await home().text();assert.match(html,/accessForm/);assert.match(html,/inert/);assert.doesNotMatch(html,/TEST-ONLY|EFr4ZEBtqlg/);
});
