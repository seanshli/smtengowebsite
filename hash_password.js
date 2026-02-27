const bcrypt = require('bcryptjs');

const password = 'your_initial_password'; // Change this!
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed Password:', hash);
    console.log('\nUse this hash in your INSERT statement for the Supabase SQL editor.');
});
