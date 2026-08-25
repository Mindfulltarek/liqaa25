import { json, requireDB, validEmail, verifyPassword, createSession, cookie, SESSION_COOKIE, SESSION_SECONDS, userView } from './_utils';
export async function onRequestPost({request,env}) { try {
 const body=await request.json(), email=String(body.email||'').trim().toLowerCase(), password=String(body.password||'');
 if(!validEmail(email)||!password) return json({error:'INVALID_CREDENTIALS'},401);
 const user=await requireDB(env).prepare('SELECT * FROM users WHERE email=?').bind(email).first();
 if(!user || !user.password_hash || !(await verifyPassword(password,user.password_hash))) return json({error:'INVALID_CREDENTIALS'},401);
 const session=await createSession(env,user.id); return json({user:userView(user)},200,{'Set-Cookie':cookie(SESSION_COOKIE,session.id,SESSION_SECONDS)});
 } catch(e){console.error(e);return json({error:'SERVER_ERROR'},500);} }
