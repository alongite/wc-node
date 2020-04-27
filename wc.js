const readline = require('readline');
const { Duplex } = require('stream');
const fs = require('fs');

function _wcstr(str = '', opts = {}) {
    let lines = opts.line ? str.split(/[\n|\r\n]/).length : null;
    let words = opts.word ? str.split(' ').length : null;
    let bytes = opts.byte ? str.length : null;
    return [lines, words, bytes];
}

function _wcrl(readStream, opts = {}){
    return new Promise((reslove, reject) => {
        let lines = 0;
        let words = 0;
        let bytes = 0;
        const rl = readline.createInterface({
            input: readStream || opts.stdin,
            output: opts.stdout
        });
        rl.on('line', (data) => {
            if(opts.line){
                lines++;
            }
            if(opts.word){
                words += data.split(' ').length;
            }
            if(opts.byte){
                bytes += data.length;
            }
        });
        rl.on('close', () => {
            reslove([lines, words, bytes]);
            // console.log('close')
        });
    })
}
/**
 * 
 * @param {*} str 字符串或者文件路径
 * @param {*} options 
 * @param {*} options.mode 模式，配置为rl时，使用readline
 * @param {*} options.start 开始计算的位置
 * @param {*} options.end 结束的位置
 * @param {Boolean} options.isPath 是否是路径
 * @param {Boolean} options.line 是否计算行
 * @param {Boolean} options.word 是否计算词数
 * @param {Boolean} options.byte 是否计算字数
 */

function wc(str = '', options = {}){
    let opts = Object.assign({
        line: true,
        word: true,
        byte: true
    }, options)
    if(opts.mode !== 'rl'){
        if(opts.isPath){
            str = fs.readFileSync(str, {encoding: 'utf8'});
        }
        str = str.slice(Math.max(0, opts.start || 0), Math.max(0, opts.end || 0));
        return Promise.resolve(_wcstr(str, opts));
    }else{
        let readStream;
        if(opts.isPath){
            readStream = fs.createReadStream(str, {
                encoding: 'utf8',
                start: opts.start ? Math.max(0, opts.start) : undefined,
                end: opts.end ? Math.max(0, opts.end) : undefined
            })
        }else{
            readStream = new MyDuplex();
            readStream.write(
                str.slice(Math.max(0, opts.start || 0), Math.max(0, opts.end || str.length))
            )
        }
        return _wcrl(readStream, opts);
    }
}

class MyDuplex extends Duplex {
    constructor(options){
        super(options);
        this._mycache = '';
    }

    _write(chunk, encoding, callback){
        this._mycache = chunk.toString();
        callback();
    }

    _read(size){
        if(size === undefined){
            size = this._mycache.length;
        }
        this.push(Buffer.from(this._mycache.slice(0, size)));
        this._mycache = this._mycache.slice(size);
        if(!this._mycache.length){
            process.nextTick(() => {
                this.emit('end')
            })
        }
    }
}



module.exports = wc;