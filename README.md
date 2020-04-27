# wc-node
wc for nodejs. Support command call and function call.

# installation
```
npm i wc-node
```

# usage
use as lib.
```
const wc = require('../wc');

const path = require('path');

const fs = require('fs');
let filepath = path.resolve(__dirname, '../bin/wc.js');

wc(filepath, {isPath: true, mode: 'rl', stdout: process.stdout}).then((ret) => {
    console.log(ret)
})
```

use as command.
```
wc-node wc.js
```
