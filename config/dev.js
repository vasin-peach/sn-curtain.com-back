// Development config
module.exports = {
  MONGO_URI:
    'cluster01-ldunu.gcp.mongodb.net/sncurtain?retryWrites=true',
  MONGO_USER: 'admin',
  MONGO_PASS: '1457714577',
  MONGO_DB: 'admin',
  SESSION_SECRET: 'dev',
  FACEBOOK_SECRET: '402b92160fb175ae6d0a258e1d78cdef',
  FACEBOOK_CLIENT: '637476463318135',
  FACEBOOK_CALLBACK:
    'https://sn-curtain.herokuapp.com/auth/facebook/callback',
  GOOGLE_SECRET: 'tNnb_MnzOTu7PRYz6woxf-xN',
  GOOGLE_CLIENT:
    '227591138588-jqa0taaj6pue1m1t566ecm0pevl0fnb3.apps.googleusercontent.com',
  GOOGLE_CALLBACK:
    'https://sn-curtain.herokuapp.com/auth/google/callback',
  FRONTEND_URI: 'http://localhost:8080',
  COOKIE_SECRET: 'SECRET',
  ENCRYPTION_SECRET_32:
    '50cjQFEluIcdaemQfa+hirBtDd3Np5cH9YrBTNMbJJU=',
  ENCRYPTION_SECRET_64:
    '/TzZsOEREBaly3soVBZsgclJDFmwmgf+67ck4ZvWJkMw5NL0JiwEI/y26YIxCVUcjP1+6pmiGfv+VM9pUja98Q==',
  OMISE_CLIENT: 'pkey_test_5diatzutqj695r6wsvp',
  OMISE_SECRET: 'skey_test_5diatzuu1tsmcften6a',
  PORT: process.env.PORT || 3000,
}
