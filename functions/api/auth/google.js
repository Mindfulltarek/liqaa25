import { json, createOAuthState } from './_utils';
export async function onRequestGet({env}) {
 if(!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) return json({error:'GOOGLE_OAUTH_NOT_CONFIGURED'},500);
 const state=await createOAuthState(env.GOOGLE_CLIENT_SECRET); const u=new URL('https://accounts.google.com/o/oauth2/v2/auth');
 u.searchParams.set('client_id',env.GOOGLE_CLIENT_ID); u.searchParams.set('redirect_uri',env.GOOGLE_REDIRECT_URI); u.searchParams.set('response_type','code'); u.searchParams.set('scope','openid email profile'); u.searchParams.set('state',state); u.searchParams.set('prompt','select_account');
 return Response.redirect(u.toString(),302);
}
