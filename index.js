const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

const configPath = path.join(__dirname, 'config.json');

const initConfig = {
  userPwd: "123456",
  adminPwd: "981021",
  bindDevice: {},
  meiMap: {}
};

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(initConfig, null, 2));
    return initConfig;
  }
  let raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw);
}

function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

app.get('/api/config', (req, res) => {
  let cfg = loadConfig();
  res.json(cfg);
});

app.post('/api/save', (req, res) => {
  let data = req.body;
  saveConfig(data);
  res.json({ok:true});
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`服务运行成功`);
});