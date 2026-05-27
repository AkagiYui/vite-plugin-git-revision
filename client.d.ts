/**
 * @akagiyui/vite-plugin-git-revision/client
 *
 * 插件注入的全局常量类型声明。
 *
 * 在项目的 env.d.ts 中添加以下三斜线指令即可自动获得类型提示：
 *
 * @example
 * ```ts
 * /// <reference types="@akagiyui/vite-plugin-git-revision/client" />
 * ```
 */

/** 构建时注入的当前 HEAD 完整提交哈希（40 位），获取失败时为 "unknown" */
declare const __GIT_COMMIT__: string

/** 构建时注入的当前 HEAD 提交时间（ISO 8601），获取失败时为 "unknown" */
declare const __GIT_COMMIT_TIME__: string

/** 构建时注入的构建时间戳（ISO 8601） */
declare const __BUILD_TIME__: string
