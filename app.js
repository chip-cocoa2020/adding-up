'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県名, value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const population = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        population_2010: 0,//2010年時の人口
        population_2015: 0,//2015年時の人口
        ratio_2015To2010: null //2015年時の人口の2010年時の人口に対する比
      };
    }
    if (year === 2010) {
      value.population_2010 = population;
    }
    if (year === 2015) {
      value.population_2015 = population;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.ratio_2015To2010 = value.population_2015 / value.population_2010;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].ratio_2015To2010 - pair1[1].ratio_2015To2010;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key} : 2010年 ${value.population_2010}人 => 2015年 ${value.population_2015}人    変化率 : ${value.ratio_2015To2010}倍`
    });
    console.log(rankingStrings);
});
