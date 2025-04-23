require('dotenv').config({ path: '.env.local' });

console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('All env variables:', process.env); 