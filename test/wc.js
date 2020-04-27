const wc = require('../wc');

const path = require('path');

const fs = require('fs');
let filepath = path.resolve(__dirname, '../bin/wc.js');
let str = fs.readFileSync(filepath, {encoding: 'utf8'});

wc(str, { mode: 'rl', stdout: process.stdout}).then((ret) => {
    console.log(ret)
})

process.on('exit', (code) => {
    console.log(`退出码: ${code}`);
});