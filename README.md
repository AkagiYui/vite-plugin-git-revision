# @akagiyui/vite-plugin-git-revision

[![npm version](https://img.shields.io/npm/v/@akagiyui/vite-plugin-git-revision)](https://npmx.dev/package/@akagiyui/vite-plugin-git-revision)
[![npm downloads](https://img.shields.io/npm/dm/@akagiyui/vite-plugin-git-revision)](https://npmx.dev/package/@akagiyui/vite-plugin-git-revision)
[![npm license](https://img.shields.io/npm/l/@akagiyui/vite-plugin-git-revision)](https://npmx.dev/package/@akagiyui/vite-plugin-git-revision)

Vite 插件：在构建时注入当前 Git 提交信息（完整哈希、提交时间）和构建时间，方便前端在运行时展示部署版本。

## 特性

- 注入当前 HEAD 的完整 40 位 Git 提交哈希
- 注入当前 HEAD 的提交时间（ISO 8601）
- 注入本次构建时间（ISO 8601）
- 支持自定义 Git 工作目录（monorepo 场景）
- 获取失败时静默回退为 `"unknown"`
- 零运行时开销：通过 Vite `define` 在编译期替换为字符串字面量

## 输出示例

构建后，以下全局常量可在前端代码中直接使用：

| 常量 | 示例值 | 说明 |
|------|--------|------|
| `__GIT_COMMIT__` | `"1b1460623458ab96cdb7f466a8ac8fcbed8957a5"` | 当前 HEAD 完整 40 位 SHA-1 |
| `__GIT_COMMIT_TIME__` | `"2026-05-27T11:16:44+08:00"` | 当前 HEAD 提交时间（ISO 8601） |
| `__BUILD_TIME__` | `"2026-05-27T11:42:10.123Z"` | 本次构建时刻（ISO 8601 UTC） |

> 获取失败时所有值为 `"unknown"`。

**渲染效果** — 在页面上通常截取短哈希并格式化时间：

```
Build 1b14606 · 2026/05/27 11:42:10
```

**纯 JavaScript 用法**（无需框架）：

```ts
// 显示用短哈希（前 7 位）
const shortHash = __GIT_COMMIT__.slice(0, 7)
// 格式化为本地时间
const buildDate = new Date(__BUILD_TIME__).toLocaleString("zh-CN")
// 提交时间同理
const commitDate = new Date(__GIT_COMMIT_TIME__).toLocaleString("zh-CN")

console.log(`Build ${shortHash} · ${buildDate}`)
```

## 安装

```bash
npm i -D @akagiyui/vite-plugin-git-revision
```

## 使用

### 配置 Vite

```ts
// vite.config.ts
import { defineConfig } from "vite"
import gitRevision from "@akagiyui/vite-plugin-git-revision"

export default defineConfig({
  plugins: [
    gitRevision(),
  ],
})
```

### 类型声明

在你的 `env.d.ts` 中添加三斜线指令即可自动获得类型提示：

```ts
/// <reference types="vite/client" />
/// <reference types="@akagiyui/vite-plugin-git-revision/client" />
```

### 在前端使用

```vue
<script setup lang="ts">
import { computed } from "vue"

const gitCommitFull = __GIT_COMMIT__
const gitCommitShort = computed(() => gitCommitFull.slice(0, 7))

const formattedBuildTime = computed(() =>
  new Date(__BUILD_TIME__).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
)
</script>

<template>
  <footer>
    Build {{ gitCommitShort }} · {{ formattedBuildTime }}
  </footer>
</template>
```

### 配置选项

```ts
gitRevision({
  /** Git 仓库的工作目录，默认 process.cwd() */
  cwd: "../",
  /** 失败回退值，默认 "unknown" */
  fallback: "unavailable",
})
```

## License

MIT
