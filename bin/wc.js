#!/usr/bin/env node

const path = require('path');

const filepath = path.resolve(process.cwd(), process.argv[2]);

require("../wc")(filepath, {
    mode: 'rl',
    isPath: true
}).then((ret) => {
    console.log(`lines: ${ret[0]}, words: ${ret[1]}, bytes: ${ret[2]}`);
});