// 将 src/data.ts 转换为 assets/scenes/main.json
const data = require('./data');
const yaml = require('js-yaml');
const fs = require('fs');
const content = yaml.dump(data.data, {
    noCompatMode: true
});
fs.writeFileSync('./assets/scenes/main.yaml', content, 'utf-8');