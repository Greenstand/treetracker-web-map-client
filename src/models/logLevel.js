import log from 'loglevel';

/*
  Most log.warn calls in this app are debug traces. In production, print only
  errors, so that real errors are easy to see in the browser console and in
  the server logs.
  To debug a production page, run localStorage.setItem('loglevel', 'DEBUG')
  in the browser console and reload. A stored level wins over this default.
*/
log.setDefaultLevel(process.env.NODE_ENV === 'production' ? 'error' : 'warn');
