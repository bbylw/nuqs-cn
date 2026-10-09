<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/wordmark.dark.svg">
    <img alt="nuqs" src="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/wordmark.light.svg" width="384">
  </picture>
</div>

<br>

<p align="center">
  <a href="https://npmx.dev/package/nuqs"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/v/nuqs.svg?color=red&mode=dark&size=xs"><img alt="npm 版本" src="https://shieldcn.dev/npm/v/nuqs.svg?color=red&mode=light&size=xs"></picture></a>
  <a href="https://npmx.dev/package/nuqs"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/npm/dw/nuqs.svg?variant=secondary&mode=dark&size=xs"><img alt="npm 下载量" src="https://shieldcn.dev/npm/dw/nuqs.svg?variant=secondary&mode=light&size=xs"></picture></a>
  <a href="https://github.com/47ng/nuqs/blob/next/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/license/47ng/nuqs.svg?variant=secondary&mode=dark&size=xs"><img alt="MIT 许可证" src="https://shieldcn.dev/github/license/47ng/nuqs.svg?variant=secondary&mode=light&size=xs"></picture></a>
  <a href="https://github.com/47ng/nuqs/actions/workflows/ci-cd.yml"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/ci/47ng/nuqs.svg?variant=secondary&workflow=ci-cd.yml&branch=next&mode=dark&size=xs"><img alt="CI/CD" src="https://shieldcn.dev/github/ci/47ng/nuqs.svg?variant=secondary&workflow=ci-cd.yml&branch=next&mode=light&size=xs"></picture></a>
  <a href="https://github.com/47ng/nuqs/graphs/contributors"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/contributors/47ng/nuqs.svg?variant=secondary&mode=dark&size=xs"><img alt="最近提交" src="https://shieldcn.dev/github/contributors/47ng/nuqs.svg?variant=secondary&mode=light&size=xs"></picture></a>
  <a href="https://github.com/sponsors/franky47"><picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/sponsors/franky47.svg?mode=dark&size=xs"><img alt="GitHub Sponsors" src="https://shieldcn.dev/github/sponsors/franky47.svg?mode=light&size=xs"></picture></a>
</p>

面向 React 各类框架的、类型安全的搜索参数状态管理器。用法类似 `useState`，但状态存储在 URL 查询字符串中。

## 特性

- 🔀 **新增：** 支持 Next.js（`app` 与 `pages` 路由）、纯 React（SPA）、Remix、React Router、TanStack Router，以及通过 [适配器](#adapters) 实现的自定义路由
- 🧘‍♀️ 简单：URL 即唯一可信来源
- 🕰 替换历史记录或[追加](#history)，以使用「后退」按钮在历史记录中导航状态更新
- ⚡️ 内置[解析器](#parsing)，支持常见状态类型（整数、浮点数、布尔值、Date 等）。可为自定义类型创建解析器，生成美观的 URL
- ♈️ 使用 [`useQueryStates`](#usequerystates) 关联多个查询字符串
- 📡 默认采用[浅层模式](#shallow)更新 URL 查询，可选择通知服务端组件
- 🗃 [服务端缓存](#accessing-searchparams-in-server-components)，在嵌套服务端组件中类型安全地访问 searchParams
- ⌛️ 支持 [`useTransition`](#transitions)，在服务端更新时获取加载状态

## 文档

完整文档请阅读 [nuqs.dev](https://nuqs.dev)。

## 安装

```shell
npm install nuqs
```

```shell
pnpm add nuqs
```

```shell
yarn add nuqs
```

```shell
bun add nuqs
```

```shell
deno add nuqs
```

```shell
vlt install nuqs
```

<a id="adapters"></a>
## 适配器

你需要用对应框架的适配器包裹 React 组件树。_（展开下方对应小节）_

<details><summary>▲ Next.js（app router）</summary>

> 支持的 Next.js 版本：`>=14.2.0`。旧版本请安装 `nuqs@^1`（无需此适配器代码）。

```tsx
// src/app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

</details>

<details><summary>▲ Next.js（pages router）</summary>

> 支持的 Next.js 版本：`>=14.2.0`。旧版本请安装 `nuqs@^1`（无需此适配器代码）。

```tsx
// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import { NuqsAdapter } from 'nuqs/adapters/next/pages'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <Component {...pageProps} />
    </NuqsAdapter>
  )
}
```

</details>

<details><summary>⚛️ 纯 React（SPA）</summary>

示例：通过 Vite 或 create-react-app 使用。

```tsx
import { NuqsAdapter } from 'nuqs/adapters/react'

createRoot(document.getElementById('root')!).render(
  <NuqsAdapter>
    <App />
  </NuqsAdapter>
)
```

</details>

<details><summary>💿 Remix</summary>

> 支持的 Remix 版本：`@remix-run/react@>=2`

```tsx
// app/root.tsx
import { NuqsAdapter } from 'nuqs/adapters/remix'

// ...

export default function App() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  )
}
```

</details>

<details><summary><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.dark.svg"><img height="14px" src="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.light.svg" /></picture> React Router v6
</summary>

> 支持的 React Router 版本：`react-router-dom@^6`

```tsx
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
])

export function ReactRouter() {
  return (
    <NuqsAdapter>
      <RouterProvider router={router} />
    </NuqsAdapter>
  )
}
```

</details>

<details><summary><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.dark.svg"><img height="14px" src="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.light.svg" /></picture> React Router v7
</summary>

> 支持的 React Router 版本：`react-router@^7`

```tsx
// app/root.tsx
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { Outlet } from 'react-router'

// ...

export default function App() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  )
}
```

</details>

<details><summary><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.dark.svg"><img height="14px" src="https://raw.githubusercontent.com/47ng/nuqs/next/packages/res/react-router.light.svg" /></picture> React Router v8
</summary>

> 支持的 React Router 版本：`react-router@^8`

```tsx
// app/root.tsx
import { NuqsAdapter } from 'nuqs/adapters/react-router/v8'
import { Outlet } from 'react-router'

// ...

export default function App() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  )
}
```

</details>

<details><summary>🏝️ TanStack Router</summary>

> 支持的 TanStack Router 版本：`@tanstack/react-router@^1`
> 注意：TanStack Router 支持尚处于实验阶段，且尚未覆盖 TanStack Start。

```tsx
// src/routes/__root.tsx
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <NuqsAdapter>
        <Outlet />
      </NuqsAdapter>
    </>
  )
})
```

</details>

## 用法

```tsx
'use client' // 仅在客户端组件中生效

import { useQueryState } from 'nuqs'

export default () => {
  const [name, setName] = useQueryState('name')
  return (
    <>
      <h1>Hello, {name || 'anonymous visitor'}!</h1>
      <input value={name || ''} onChange={e => setName(e.target.value)} />
      <button onClick={() => setName(null)}>Clear</button>
    </>
  )
}
```

![](https://raw.githubusercontent.com/47ng/nuqs/next/useQueryState.gif)

`useQueryState` 接受一个必填参数：用于查询字符串中的键名。

与 `React.useState` 类似，它返回一个数组，包含查询字符串中的值（字符串形式，若未找到则为 `null`），以及一个状态更新函数。

以下是「Hello World」示例的各种输出：

| URL          | name 值    | 说明                                                              |
| ------------ | ---------- | ----------------------------------------------------------------- |
| `/`          | `null`     | URL 中没有 `name` 键                                              |
| `/?name=`    | `''`       | 空字符串                                                          |
| `/?name=foo` | `'foo'`    |
| `/?name=2`   | `'2'`      | 默认始终返回字符串，详见下方 [解析](#parsing)                     |

<a id="parsing"></a>
## 解析

若你的状态类型不是字符串，必须在第二个参数对象中传入解析函数。

我们为常见及更进阶的对象类型提供了相应解析器：

```ts
import {
  parseAsString,
  parseAsInteger,
  parseAsFloat,
  parseAsBoolean,
  parseAsTimestamp,
  parseAsIsoDateTime,
  parseAsArrayOf,
  parseAsJson,
  parseAsStringEnum,
  parseAsStringLiteral,
  parseAsNumberLiteral
} from 'nuqs'

useQueryState('tag') // 默认按字符串处理
useQueryState('count', parseAsInteger)
useQueryState('brightness', parseAsFloat)
useQueryState('darkMode', parseAsBoolean)
useQueryState('after', parseAsTimestamp) // 状态为 Date
useQueryState('date', parseAsIsoDateTime) // 状态为 Date
useQueryState('array', parseAsArrayOf(parseAsInteger)) // 状态为 number[]
useQueryState('json', parseAsJson<Point>()) // 状态为 Point

// 枚举（仅支持基于字符串）
enum Direction {
  up = 'UP',
  down = 'DOWN',
  left = 'LEFT',
  right = 'RIGHT'
}

const [direction, setDirection] = useQueryState(
  'direction',
  parseAsStringEnum<Direction>(Object.values(Direction)) // 传入允许值列表
    .withDefault(Direction.up)
)

// 字面量（仅支持基于字符串）
const colors = ['red', 'green', 'blue'] as const

const [color, setColor] = useQueryState(
  'color',
  parseAsStringLiteral(colors) // 传入只读的允许值列表
    .withDefault('red')
)

// 字面量（仅支持基于数字）
const diceSides = [1, 2, 3, 4, 5, 6] as const

const [side, setSide] = useQueryState(
  'side',
  parseAsNumberLiteral(diceSides) // 传入只读的允许值列表
    .withDefault(4)
)
```

你也可以传入自定义的 `parse` 与 `serialize` 函数：

```tsx
import { useQueryState } from 'nuqs'

export default () => {
  const [hex, setHex] = useQueryState('hex', {
    // TypeScript 会依据 `parse` 的返回值自动推断出其为 number
    parse: (query: string) => parseInt(query, 16),
    serialize: value => value.toString(16)
  })
}
```

## 默认值

当 URL 中不存在对应的查询字符串时，默认行为是返回 `null` 作为状态。

这会让状态更新与 UI 渲染变得繁琐。以这个存储在 URL 中的简单计数器为例：

```tsx
import { useQueryState, parseAsInteger } from 'nuqs'

export default () => {
  const [count, setCount] = useQueryState('count', parseAsInteger)
  return (
    <>
      <pre>count: {count}</pre>
      <button onClick={() => setCount(0)}>Reset</button>
      {/* 处理 setCount 中的 null 值很麻烦： */}
      <button onClick={() => setCount(c => (c ?? 0) + 1)}>+</button>
      <button onClick={() => setCount(c => (c ?? 0) - 1)}>-</button>
      <button onClick={() => setCount(null)}>Clear</button>
    </>
  )
}
```

你可以为这种情况指定一个默认值：

```ts
const [count, setCount] = useQueryState('count', parseAsInteger.withDefault(0))

const increment = () => setCount(c => c + 1) // c 永远不会是 null
const decrement = () => setCount(c => c - 1) // c 永远不会是 null
const clearCount = () => setCount(null) // 从 URL 中移除该查询
```

注意：默认值仅存在于 React 内部，它**不会**被写入 URL。

将状态设为 `null` 会移除查询字符串中的对应键，并将状态置为默认值。

## 选项

<a id="history"></a>
### 历史

默认情况下，状态更新会在状态变化时，用更新后的查询替换当前的历史记录项。

你可以把它想象成一种 `git squash`：所有改变状态的操作都被合并进同一个历史值。

你也可以选择为每次状态变化（按键区分）向历史记录推送一个新条目，从而使用「后退」按钮来在历史记录中导航状态更新：

```ts
// 默认：用新状态替换当前历史
useQueryState('foo', { history: 'replace' })

// 将状态变化追加到历史记录：
useQueryState('foo', { history: 'push' })
```

`history` 选项的其它取值都会回退到默认值。

你也可以在调用状态更新函数时覆盖历史模式：

```ts
const [query, setQuery] = useQueryState('q', { history: 'push' })

// 这会覆盖钩子声明时的设置：
setQuery(null, { history: 'replace' })
```

<a id="shallow"></a>
### 浅层

> 注意：此特性仅适用于 Next.js

默认情况下，查询状态更新以「客户端优先」的方式进行：不会向服务端发起网络请求。

这等同于 Next.js pages router 中 `shallow` 选项设为 `true`，或在 app router 中开启实验性的 [`windowHistorySupport`](https://github.com/vercel/next.js/discussions/48110) 标志。

若希望查询更新通知服务端（在 pages router 中重新运行 `getServerSideProps`，在 app router 中重新渲染 Server Components），可将 `shallow` 设为 `false`：

```ts
const [state, setState] = useQueryState('foo', { shallow: false })

// 也可以在调用 setState 时传入该选项：
setState('bar', { shallow: false })
```

### 限制 URL 更新频率

由于浏览器对 History API 进行了限流，对 URL 的内部更新会被排队并节流，默认 50ms。即便发送高频查询更新（如绑定到文本输入框或滑块），这一间隔也能满足大多数浏览器。

Safari 的限流策略要严格得多，需要约 340ms 的节流间隔。如果你确实需要更长的更新间隔，可以在选项中指定：

```ts
useQueryState('foo', {
  // 每秒最多向服务端发送一次更新
  shallow: false,
  throttleMs: 1000
})

// 也可以在调用 setState 时传入该选项：
setState('bar', { throttleMs: 1000 })
```

> 注意：钩子返回的状态总是即时更新，以保持 UI 响应。
> 仅有对 URL 的改动，以及使用 `shallow: false` 时向服务端发起的请求会被节流。

如果多个钩子在同一个事件循环 tick 中设置了不同的节流值，将采用其中的最大值。此外，低于 50ms 的值会被忽略，以避免触发限流问题。[了解更多](https://francoisbest.com/posts/2023/storing-react-state-in-the-url-with-nextjs#batching--throttling)。

<a id="transitions"></a>
### 过渡

结合 `shallow: false` 使用时，你可以利用 `useTransition` 钩子，在服务端用更新后的 URL 重新渲染服务端组件期间，获取加载状态。

将 `useTransition` 提供的 `startTransition` 函数传入选项即可启用此行为：

```tsx
'use client'

import React from 'react'
import { useQueryState, parseAsString } from 'nuqs'

function ClientComponent({ data }) {
  // 1. 提供你自己的 useTransition 钩子：
  const [isLoading, startTransition] = React.useTransition()
  const [query, setQuery] = useQueryState(
    'query',
    // 2. 将 `startTransition` 作为选项传入：
    parseAsString.withOptions({
      startTransition,
      shallow: false // 选择通知服务端（仅 Next.js）
    })
  )
  // 3. 当查询通过 `setQuery` 更新、服务端正在重新渲染
  // 并流式传输 RSC 负载时，`isLoading` 会为 true。

  // 显示加载状态
  if (isLoading) return <div>Loading...</div>

  // 携带数据正常渲染
  return <div>{/*...*/}</div>
}
```

## 配置解析器、默认值与选项

你可以使用构建器（builder）模式，便捷地指定上述所有内容：

```ts
useQueryState(
  'counter',
  parseAsInteger.withDefault(0).withOptions({
    history: 'push',
    shallow: false
  })
)
```

你自定义解析器也能获得这一模式，并可与其它解析器组合：

```ts
import { createParser, parseAsHex } from 'nuqs'

// 将你的解析器/序列化器包裹进 `createParser`
// 即可获得构建器模式与服务端解析能力：
const hexColorSchema = createParser({
  parse(query) {
    if (query.length !== 6) {
      return null // 对无效输入始终返回 null
    }
    return {
      // 组合其它解析器时，它们也可能返回 null。
      r: parseAsHex.parse(query.slice(0, 2)) ?? 0x00,
      g: parseAsHex.parse(query.slice(2, 4)) ?? 0x00,
      b: parseAsHex.parse(query.slice(4)) ?? 0x00
    }
  },
  serialize({ r, g, b }) {
    return (
      parseAsHex.serialize(r) +
      parseAsHex.serialize(g) +
      parseAsHex.serialize(b)
    )
  }
})
  // 例如：直接设置通用选项
  .withOptions({ history: 'push' })

// 或在具体使用时：
useQueryState(
  'tribute',
  hexColorSchema.withDefault({
    r: 0x66,
    g: 0x33,
    b: 0x99
  })
)
```

注意：可在 [hex-colors 示例](<https://github.com/47ng/nuqs/blob/next/packages/docs/src/app/playground/(demos)/hex-colors/page.tsx>) 中查看运行效果。

## 多个查询（批处理）

你可以在单个事件循环 tick 内，按需调用任意多次状态更新函数，它们会被异步应用到 URL：

```ts
const MultipleQueriesDemo = () => {
  const [lat, setLat] = useQueryState('lat', parseAsFloat)
  const [lng, setLng] = useQueryState('lng', parseAsFloat)
  const randomCoordinates = React.useCallback(() => {
    setLat(Math.random() * 180 - 90)
    setLng(Math.random() * 360 - 180)
  }, [])
}
```

如果你想知道 URL 何时更新、以及其中包含什么，可以 `await` 状态更新函数返回的 Promise，它会给出更新后的 URLSearchParams 对象：

```ts
const randomCoordinates = React.useCallback(() => {
  setLat(42)
  return setLng(12)
}, [])

randomCoordinates().then((search: URLSearchParams) => {
  search.get('lat') // 42
  search.get('lng') // 12，已被排队并批量更新
})
```

<details>
<summary><em>实现细节（Promise 缓存）</em></summary>

返回的 Promise 会被缓存，直到下一次刷新到 URL 发生，
因此在同一个事件循环 tick 内，对任意钩子的 setState 调用
都会返回同一个 Promise 引用。

由于对 Web History API 的调用被节流，该 Promise 可能
被缓存若干个 tick。批量更新会被合并，并一次性刷新到 URL。
这意味着，如果在刷新发生前有另一个 setState 覆盖了前者，
并非每一次 setState 都会反映到 URL。

返回的 React 状态会即时反映所有已设置的值，
以保持 UI 响应。

---

</details>

<a id="usequerystates"></a>
## `useQueryStates`

对于应当始终一起变动的查询键，可以使用 `useQueryStates`，并传入一个描述各键类型的对象：

```ts
import { useQueryStates, parseAsFloat } from 'nuqs'

const [coordinates, setCoordinates] = useQueryStates(
  {
    lat: parseAsFloat.withDefault(45.18),
    lng: parseAsFloat.withDefault(5.72)
  },
  {
    history: 'push'
  }
)

const { lat, lng } = coordinates

// 一次性设置全部（或其中一部分）键：
const search = await setCoordinates({
  lat: Math.random() * 180 - 90,
  lng: Math.random() * 360 - 180
})
```

## 加载器

若想一次性解析搜索参数，可以使用**加载器函数（loader）**：

```tsx
import { createLoader } from 'nuqs' // 或 'nuqs/server'

const searchParams = {
  q: parseAsString,
  page: parseAsInteger.withDefault(1)
}

const loadSearchParams = createLoader(searchParams)

const { q, page } = loadSearchParams('?q=hello&page=2')
```

它接受多种类型的输入（字符串、URL、URLSearchParams、Request、Promise 等）。[了解更多](https://nuqs.dev/docs/server-side#loaders)

参见 [服务端解析示例](<https://github.com/47ng/nuqs/blob/next/packages/docs/src/app/playground/(demos)/pagination/page.tsx>)，
其中展示了如何在客户端与服务端代码之间复用解析器配置的真实用例。

<a id="accessing-searchparams-in-server-components"></a>
## 在服务端组件中访问 searchParams

如果你希望在深层嵌套的服务端组件（即非 Page 组件）中访问 searchParams，可以使用 `createSearchParamsCache` 以类型安全的方式实现。

> 注意：解析器**不会校验**你的数据。如果你期望得到正整数或某种特定形状的 JSON 编码对象，需要把解析结果再交给 schema 校验库（如 [Zod](https://zod.dev)）处理。

```tsx
// searchParams.ts
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString
} from 'nuqs/server'
// 注意：从 'nuqs/server' 导入，以避开 "use client" 指令

export const searchParamsCache = createSearchParamsCache({
  // 在此列出你的搜索参数键名及对应的解析器：
  q: parseAsString.withDefault(''),
  maxResults: parseAsInteger.withDefault(10)
})

// page.tsx
import { searchParamsCache } from './searchParams'

export default function Page({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  // ⚠️ 别忘了在此调用 `parse`。
  // 你可以从返回的对象中获取类型安全的值：
  const { q: query } = searchParamsCache.parse(searchParams)
  return (
    <div>
      <h1>Search Results for {query}</h1>
      <Results />
    </div>
  )
}

function Results() {
  // 在子服务端组件中访问类型安全的搜索参数：
  const maxResults = searchParamsCache.get('maxResults')
  return <span>Showing up to {maxResults} results</span>
}
```

该缓存仅对当前页面渲染有效（参见 React 的 [`cache`](https://react.dev/reference/react/cache) 函数）。

注意：缓存仅适用于**服务端组件**，但你可以与 `useQueryStates` 共享解析器声明，以在客户端组件中保持类型安全：

```tsx
// searchParams.ts
import { parseAsFloat, createSearchParamsCache } from 'nuqs/server'

export const coordinatesParsers = {
  lat: parseAsFloat.withDefault(45.18),
  lng: parseAsFloat.withDefault(5.72)
}
export const coordinatesCache = createSearchParamsCache(coordinatesParsers)

// page.tsx
import { coordinatesCache } from './searchParams'
import { Server } from './server'
import { Client } from './client'

export default async function Page({ searchParams }) {
  await coordinatesCache.parse(searchParams)
  return (
    <>
      <Server />
      <Suspense>
        <Client />
      </Suspense>
    </>
  )
}

// server.tsx
import { coordinatesCache } from './searchParams'

export function Server() {
  // 一次性获取全部键：
  const { lat, lng } = coordinatesCache.all()
  // 也可以单独访问各键：
  // const lat = coordinatesCache.get('lat')
  // const lng = coordinatesCache.get('lng')
  return (
    <span>
      Latitude: {lat} - Longitude: {lng}
    </span>
  )
}

// client.tsx
// prettier-ignore
;'use client'

import { useQueryStates } from 'nuqs'
import { coordinatesParsers } from './searchParams'

export function Client() {
  const [{ lat, lng }, setCoordinates] = useQueryStates(coordinatesParsers)
  // ...
}
```

## 序列化辅助函数

若想用状态值填充 `<Link>` 组件，可以使用 `createSerializer` 辅助函数。

向它传入一个描述搜索参数的对象，它会返回一个函数，调用时传入值，即可生成与钩子行为一致的查询字符串。

示例：

```ts
import {
  createSerializer,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringLiteral
} from 'nuqs/server'

const searchParams = {
  search: parseAsString,
  limit: parseAsInteger,
  from: parseAsIsoDateTime,
  to: parseAsIsoDateTime,
  sortBy: parseAsStringLiteral(['asc', 'desc'])
}

// 通过传入要接受的搜索参数描述来创建序列化函数
const serialize = createSerializer(searchParams)

// 随后，向它传入一些值（子集亦可），即可渲染为查询字符串
serialize({
  search: 'foo bar',
  limit: 10,
  from: new Date('2024-01-01'),
  // 此处我们省略了 `to`，它不会被添加
  sortBy: null // null 值也不会被渲染
})
// ?search=foo+bar&limit=10&from=2024-01-01T00:00:00.000Z
```

### 基础参数

返回的 `serialize` 函数可以接收一个基础参数，在其上追加/修改搜索参数：

```ts
serialize('/path?baz=qux', { foo: 'bar' }) // /path?baz=qux&foo=bar

const search = new URLSearchParams('?baz=qux')
serialize(search, { foo: 'bar' }) // ?baz=qux&foo=bar

const url = new URL('https://example.com/path?baz=qux')
serialize(url, { foo: 'bar' }) // https://example.com/path?baz=qux&foo=bar

// 传入 null 会移除已有的值
serialize('?remove=me', { foo: 'bar', remove: null }) // ?foo=bar
```

## 解析器类型推断

若要获取解析器返回的基础类型，可以使用 `inferParserType` 类型辅助函数：

```ts
import { parseAsInteger, type inferParserType } from 'nuqs' // 或 'nuqs/server'

const intNullable = parseAsInteger
const intNonNull = parseAsInteger.withDefault(0)

inferParserType<typeof intNullable> // number | null
inferParserType<typeof intNonNull> // number
```

对于描述解析器的对象（即传给 `createSearchParamsCache` 或 `useQueryStates` 的那个），`inferParserType` 会返回将解析器替换为其推断类型后的对象类型：

```ts
import { parseAsBoolean, parseAsInteger, type inferParserType } from 'nuqs' // 或 'nuqs/server'

const parsers = {
  a: parseAsInteger,
  b: parseAsBoolean.withDefault(false)
}

inferParserType<typeof parsers>
// { a: number | null, b: boolean }
```

## 测试

自 nuqs v2 起，你可以使用测试适配器，在隔离环境中对使用了 `useQueryState` 与 `useQueryStates` 的组件进行单元测试，无需 mock 你的框架或路由。

以下是结合 Testing Library 与 Vitest 的示例：

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  withNuqsTestingAdapter,
  type OnUrlUpdateFunction
} from 'nuqs/adapters/testing'
import { describe, expect, it, vi } from 'vitest'
import { CounterButton } from './counter-button'

it('should increment the count when clicked', async () => {
  const user = userEvent.setup()
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>()
  render(<CounterButton />, {
    // 通过传入初始搜索参数 / 查询字符串来搭建测试，
    // 并提供一个在 URL 更新时调用的函数
    wrapper: withNuqsTestingAdapter({ searchParams: '?count=42', onUrlUpdate })
  })
  // 初始状态断言：存在一个显示计数的可点击按钮
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('count is 42')
  // 操作
  await user.click(button)
  // 断言状态与（被 mock 的）URL 中的变化
  expect(button).toHaveTextContent('count is 43')
  expect(onUrlUpdate).toHaveBeenCalledOnce()
  const event = onUrlUpdate.mock.calls[0]![0]!
  expect(event.queryString).toBe('?count=43')
  expect(event.searchParams.get('count')).toBe('43')
  expect(event.options.history).toBe('push')
})
```

更多测试相关的讨论见 [#259](https://github.com/47ng/nuqs/issues/259)。

## 调试

首先在应用中引入一次 `nuqs/debug` 入口。这样能确保日志不会进入你的打包产物，除非你主动启用。在区分客户端与服务端打包产物的框架中，请在需要日志的每个运行环境都引入它。然后，将 localStorage 中的 `debug` 项设为 `nuqs`，并刷新页面。

```ts
// 在应用中引入一次：
import 'nuqs/debug'
```

```js
// 在开发者工具中：
localStorage.setItem('debug', 'nuqs')
```

> 注意：与 `debug` 包不同，此处不支持通配符，但可组合使用：`localStorage.setItem('debug', '*,nuqs')`

日志行以 `[nuq+ …]` 为前缀，表示钩子级别的消息；以 `[nuqs <子系统>]` 为前缀，表示内部子系统（节流与防抖队列、适配器等）的日志，以及其它内部调试日志——完整清单见 `packages/nuqs/src/lib/debug-messages.ts`。

同时还会记录用户计时标记（User timings markers），便于使用浏览器开发者工具进行进阶性能分析。

在提交 [issue](https://github.com/47ng/nuqs/issues) 时附上调试日志总是受欢迎的。🙏

### SEO

如果你的页面将查询字符串用于本地状态，应该为页面添加规范 URL（canonical URL），告知 SEO 爬虫忽略查询字符串，将页面索引为不带查询字符串的形式。

在 app router 中，可通过 metadata 对象实现：

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/url/path/without/querystring'
  }
}
```

但如果查询字符串用于定义页面展示的内容（例如 YouTube 的观看地址，如 `https://www.youtube.com/watch?v=dQw4w9WgXcQ`），你的规范 URL 应包含相关的查询字符串，并且你仍然可以使用解析器读取它、并序列化出规范 URL：

```ts
// page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import {
  createParser,
  parseAsString,
  createLoader,
  createSerializer,
  type SearchParams,
  type UrlKeys
} from 'nuqs/server'

const youTubeVideoIdRegex = /^[^"&?\/\s]{11}$/i
const youTubeSearchParams = {
  videoId: createParser({
    parse(query) {
      if (!youTubeVideoIdRegex.test(query)) {
        return null
      }
      return query
    },
    serialize(videoId) {
      return videoId
    }
  })
}
const youTubeUrlKeys: UrlKeys<typeof youTubeSearchParams> = {
  videoId: 'v'
}
const loadYouTubeSearchParams = createLoader(youTubeSearchParams, {
  urlKeys: youTubeUrlKeys
})
const serializeYouTubeSearchParams = createSerializer(youTubeSearchParams, {
  urlKeys: youTubeUrlKeys
})

// --

type Props = {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({
  searchParams
}: Props): Promise<Metadata> {
  const { videoId } = await loadYouTubeSearchParams(searchParams)
  if (!videoId) {
    notFound()
  }
  return {
    alternates: {
      canonical: serializeYouTubeSearchParams('/watch', { videoId })
      // /watch?v=dQw4w9WgXcQ
    }
  }
}
```

### 有损序列化

如果你的序列化器丢失精度、或不能准确表示底层状态值，在重新加载页面或从 URL 恢复状态（例如导航时）时会丢失该精度。

示例：

```ts
const geoCoordParser = {
  parse: parseFloat,
  serialize: v => v.toFixed(4) // 丢失精度
}

const [lat, setLat] = useQueryState('lat', geoCoordParser)
```

此处，将纬度设为 1.23456789 会生成 `lat=1.2345` 的 URL 查询字符串，而内部 `lat` 状态会被正确设为 1.23456789。

重新加载页面后，状态会被错误地设为 1.2345。

## 许可证

[MIT](https://github.com/47ng/nuqs/blob/next/LICENSE)

由 [François Best](https://francoisbest.com) 用 ❤️ 制作

工作中用到了这个包？[赞助我](https://github.com/sponsors/franky47)
以帮助提供支持与维护。

![项目分析与统计](https://repobeats.axiom.co/api/embed/3ee740e4729dce3992bfa8c74645cfebad8ba034.svg 'Repobeats analytics image')
