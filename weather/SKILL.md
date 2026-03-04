---
name: weather
description: >
  Get current weather and forecasts (no API key required).
  Use when: 需要查询天气、温度、湿度、风速等气象信息。
  数据源：wttr.in (主要) / Open-Meteo (备用 JSON)
homepage: https://wttr.in/:help
metadata: {"clawdbot":{"emoji":"🌤️","requires":{"bins":["curl"]}}}
---

# Weather

两个免费天气服务，无需 API Key。

## wttr.in (主要)

```bash
# 简洁格式
curl -s "wttr.in/London?format=3"
# 输出：London: ⛅️ +8°C

# 详细格式
curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"
# 输出：London: ⛅️ +8°C 71% ↙5km/h

# 完整预报
curl -s "wttr.in/London?T"
```

### 格式代码
`%c` 天气 · `%t` 温度 · `%h` 湿度 · `%w` 风速 · `%l` 地点 · `%m` 月相

### 提示
- 空格编码：`wttr.in/New+York`
- 机场代码：`wttr.in/JFK`
- 单位：`?m` (公制) `?u` (英制)
- 仅今天：`?1` · 仅当前：`?0`
- PNG 图片：`curl -s "wttr.in/Berlin.png" -o /tmp/weather.png`

## Open-Meteo (备用，JSON)

```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
```

返回 JSON 格式，适合程序化使用。文档：https://open-meteo.com/en/docs
