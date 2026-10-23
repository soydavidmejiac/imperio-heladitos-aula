import { access } from '../../../lib/access.js';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const env=()=>({BUYER_ACCESS_CODE:process.env.BUYER_ACCESS_CODE,ACCESS_SESSION_SECRET:process.env.ACCESS_SESSION_SECRET});
export const GET=req=>access(req,env());
export const POST=req=>access(req,env());
export const DELETE=req=>access(req,env());
