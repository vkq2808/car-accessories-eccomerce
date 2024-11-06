const bcryptjs = require('bcryptjs');
admin_hash_password = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, process.env.SALT);
console.log(admin_hash_password);