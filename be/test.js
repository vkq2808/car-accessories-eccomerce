const crypto = require('crypto')
let a = crypto.randomBytes(16).toString('hex')
console.log(a);