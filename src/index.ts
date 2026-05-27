/**
 * vite-plugin-git-revision
 *
 * 在构建时通过 Vite define 注入当前 Git 提交信息和构建时间，
 * 方便前端在运行时展示版本信息。
 *
 * 注入的全局常量：
 * - `__BUILD_TIME__`  —— 本次构建的时间（ISO 8601）
 * - `__GIT_COMMIT__`    —— 当前 HEAD 完整提交哈希（40 位）
 * - `__GIT_COMMIT_TIME__` —— 当前 HEAD 的提交时间（ISO 8601）
 *
 * 使用前需在项目 env.d.ts 中添加三斜线指令：
 * /// <reference types="@akagiyui/vite-plugin-git-revision/client" />
 */

import { execSync } from "node:child_process"

// ---------------------------------------------------------------------------
// 类型定义（内联 Vite Plugin 类型，避免 link 安装时版本冲突）
// ---------------------------------------------------------------------------

/** Vite Plugin 最小接口，避免跨版本 Plugin 类型不兼容 */
interface VitePlugin {
  name: string
  config?: () => { define?: Record<string, string> } | void
}

/** 插件配置选项 */
export interface GitRevisionOptions {
  /**
   * Git 仓库的工作目录，默认使用 `process.cwd()`。
   * 适用于 monorepo 中根目录不在当前项目的情况。
   * @default process.cwd()
   */
  cwd?: string

  /**
   * 获取 Git 信息失败时的回退值。
   * @default "unknown"
   */
  fallback?: string
}

// ---------------------------------------------------------------------------
// 插件实现
// ---------------------------------------------------------------------------

/**
 * 创建 vite-plugin-git-revision 插件实例。
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import gitRevision from "@akagiyui/vite-plugin-git-revision"
 *
 * export default defineConfig({
 *   plugins: [gitRevision()],
 * })
 * ```
 *
 * @example
 * ```ts
 * // env.d.ts
 * declare const __BUILD_TIME__: string
 * declare const __GIT_COMMIT__: string
 * declare const __GIT_COMMIT_TIME__: string
 * ```
 */
export default function gitRevisionPlugin(
  options: GitRevisionOptions = {},
): VitePlugin {
  const { cwd = process.cwd(), fallback = "unknown" } = options

  return {
    name: "vite-plugin-git-revision",
    config() {
      // 构建时间（ISO 8601）
      const buildTime = new Date().toISOString()

      // 获取当前 HEAD 的完整提交哈希（40 位）
      let gitCommit = fallback
      // 获取当前 HEAD 的提交时间（ISO 8601）
      let gitCommitTime = fallback

      try {
        gitCommit = execSync("git rev-parse HEAD", {
          encoding: "utf-8",
          cwd,
        }).trim()
        gitCommitTime = execSync("git log -1 --format=%cI HEAD", {
          encoding: "utf-8",
          cwd,
        }).trim()
      } catch {
        // 非 git 仓库或无 git 命令时静默回退
      }

      return {
        define: {
          __BUILD_TIME__: JSON.stringify(buildTime),
          __GIT_COMMIT__: JSON.stringify(gitCommit),
          __GIT_COMMIT_TIME__: JSON.stringify(gitCommitTime),
        },
      }
    },
  }
}
