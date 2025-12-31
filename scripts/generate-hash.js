const bcrypt = require('bcryptjs');

bcrypt.hash('password123', 10).then(hash => {
  console.log('Password: password123');
  console.log('Hash:', hash);
  console.log('\nUpdate SQL:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@cheapname.tyo';`);
});
