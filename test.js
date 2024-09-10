const bcrypt = require('bcryptjs');
let a = bcrypt.genSaltSync(5);
console.log(a);