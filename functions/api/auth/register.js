import { json, requireDB, validEmail, validPassword, hashPassword, randomId, createSession, cookie, SESSION_COOKIE, SESSION_SECONDS, userView } from './_utils';
export async function onRequestPost({request,env}) {
 try {
  const body=await request.json(); const email=String(body.email||'').trim().toLowerCase(), password=body.password, name=String(body.name||'').trim().slice(0,100);
  if(!validEmail(email)) return json({error:'INVALID_EMAIL'},400);
  if(!validPassword(password)) return json({error:'INVALID_PASSWORD'},400);
  const db=requireDB(env); if(await db.prepare('SELECT id FROM users WHERE email=?').bind(email).first()) return json({error:'EMAIL_EXISTS'},409);
  const id=crypto.randomUUID(), passwordHash=await hashPassword(password);
  await db.prepare('INSERT INTO users (id,email,password_hash,name,email_verified) VALUES (?,?,?,?,0)').bind(id,email,passwordHash,name).run();
  const session=await createSession(env,id); const user=await db.prepare('SELECT * FROM users WHERE id=?').bind(id).first();
  return json({user:userView(user), verification_required:true},201,{'Set-Cookie':cookie(SESSION_COOKIE,session.id,SESSION_SECONDS)});
 } catch(e) { console.error(e); return json({error:'SERVER_ERROR'},500); }
}
