import React from 'react';

export default function AuthModal({ ctx }) {
  const {account,authBusy,authEmail,authMode,authName,authNotice,authPassword,authPasswordConfirm,setAuthEmail,setAuthMode,setAuthName,setAuthNotice,setAuthOpen,setAuthPassword,setAuthPasswordConfirm,submitAuth} = ctx;
  return (
  <div className="backdrop" onClick={e=>e.target===e.currentTarget&&setAuthOpen(false)}>
    <section className="modal auth-modal">
      <button className="close" onClick={()=>setAuthOpen(false)}>×</button>
      <small className="overline">YOUR CARTA ACCOUNT</small>
      <h2>{authMode==='signup'?'Create your':authMode==='forgot'?'Reset your':authMode==='update'?'Choose a new':'Welcome back to your'} <em>{authMode==='forgot'||authMode==='update'?'password.':'library.'}</em></h2>
      <p>{authMode==='forgot'
        ? 'Enter your account email and we will send a secure password-reset link.'
        : authMode==='update'
          ? 'Choose a new password to secure your CARTA account.'
          : 'Sign in to sync your reading shelf and use the citation-based legal assistant.'}</p>
      {authNotice&&<p className="auth-notice" role="status">{authNotice}</p>}
      <form onSubmit={submitAuth}>
        {authMode!=='update'&&<label>Email address<input type="email" autoComplete="email" required value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/></label>}
        {authMode==='signup'&&<label>Your name<input autoComplete="name" required value={authName} onChange={e=>setAuthName(e.target.value)}/></label>}
        {authMode!=='forgot'&&<label>{authMode==='update'?'New password':'Password'}<input type="password" autoComplete={authMode==='signup'||authMode==='update'?'new-password':'current-password'} minLength={8} required value={authPassword} onChange={e=>setAuthPassword(e.target.value)}/></label>}
        {authMode==='update'&&<label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} required value={authPasswordConfirm} onChange={e=>setAuthPasswordConfirm(e.target.value)}/></label>}
        <button className="primary full" disabled={authBusy}>{authBusy?'Please wait…':authMode==='signup'?'Create account':authMode==='forgot'?'Send reset link':authMode==='update'?'Update password':'Sign in'}</button>
      </form>
      {authMode==='signin'&&<>
        <button className="textLink" onClick={()=>{setAuthMode('forgot');setAuthNotice('');setAuthPassword('')}}>Forgot your password?</button>
        <button className="textLink" onClick={()=>{setAuthMode('signup');setAuthNotice('');setAuthPassword('')}}>New to CARTA? Create an account</button>
      </>}
      {authMode==='signup'&&<button className="textLink" onClick={()=>{setAuthMode('signin');setAuthNotice('');setAuthPassword('')}}>Already have an account? Sign in</button>}
      {authMode==='forgot'&&<button className="textLink" onClick={()=>{setAuthMode('signin');setAuthNotice('');setAuthPassword('')}}>Back to sign in</button>}
    </section>
  </div>
  );
}

