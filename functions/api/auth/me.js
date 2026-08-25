import { json, currentUser, userView } from './_utils';
export async function onRequestGet({request,env}) { try { const user=await currentUser(request,env); return user ? json({user:userView(user)}) : json({error:'UNAUTHENTICATED'},401); } catch(e){console.error(e);return json({error:'SERVER_ERROR'},500);} }
