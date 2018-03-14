'use strict';
// Node.jsのモジュール呼び出し
// ファイルシステム
const fs = require('fs');
// 一行ずつ読み込み
const readline = require('readline');
// csvファイルを一行ずつ読み込む
const rs = fs.ReadStream('./popu-pref.csv');
// 一行ずつ読み込んだcsvファイルをinputとするインターフェース
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// key:都道府県／value:集計データのオブジェクト
const map = new Map();
// 
rl.on('line', (lineString) => {
    // 配列に分割
    const columns = lineString.split(',');
    // 1列目は年
    const year = parseInt(columns[0]);
    // 3列目は都道府県
    const prefecture = columns[2];
    // 8列目は人口
    const popu = parseInt(columns[7]);
    // 2010年か2015年ならば
    if (year === 2010 || year === 2015) {
        // 都道府県ごとの値を得る
        let value = map.get(prefecture);
        // 得られなければ初期化
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            // 2010年の人口に足す
            value.popu10 += popu;
        } else if (year === 2015) {
            // 2015年の人口を足す
            value.popu15 += popu;
        }
        // 都道府県ごとの値を更新
        map.set(prefecture, value);
    }
});
// 開始
rl.resume();
// closeは終了時
rl.on('close', () => {
    // 連想配列展開　pair=[キー,値群]
    for (let pair of map) {
        //値群
        const values = pair[1];
        // 増減率=2015年の人口/2010年の人口
        values.change = values.popu15 / values.popu10;
    }
    // 並び替え 比較する行の値の変化率
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // 整形
    const rankingStrings = rankingArray.map((pair) => {
        const key = pair[0]; 
        const values = pair[1]; 
        return key + ': ' + values.popu10 + '=>' + values.popu15 + ' 変化率:' + values.change;
    });

    console.log(rankingStrings);
}); 