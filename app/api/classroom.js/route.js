import classroom from '../../../content/classroom.js';
import {authorized} from '../../../lib/access.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req){const ok=await authorized(req,process.env);return new Response(ok?classroom:'',{status:ok?200:401,headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
