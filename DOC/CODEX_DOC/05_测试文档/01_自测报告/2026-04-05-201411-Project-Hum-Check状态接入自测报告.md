# Project Hum Check 状态接入自测报告

## 自测范围

1. `DOC/CODEX_DOC/00-本地工程策略映射.md`
2. GitHub Project `https://github.com/users/wgwtest/projects/3`
3. GitHub `#43 WBS 1.7.2 Pencil截面图与页面设计稿`

## 执行记录

### 1. Status 字段配置验证

```bash
env HTTP_PROXY=http://127.0.0.1:10809 HTTPS_PROXY=http://127.0.0.1:10809 ALL_PROXY=socks5://127.0.0.1:10808 \
  gh api graphql -f query='query { node(id:"PVTSSF_lAHOD9ycyM4BTOqkzhAh9n0") { ... on ProjectV2SingleSelectField { id name options { id name } } } }'
```

预期结果：

1. `Status` 字段可返回 `Hum Check`
2. `Hum Check` 的选项 id 为 `6280ca86`

### 2. 待人工验收节点状态同步验证

```bash
env HTTP_PROXY=http://127.0.0.1:10809 HTTPS_PROXY=http://127.0.0.1:10809 ALL_PROXY=socks5://127.0.0.1:10808 \
  gh issue view 43 --repo wgwtest/NovelStoryManager --json number,title,body

env HTTP_PROXY=http://127.0.0.1:10809 HTTPS_PROXY=http://127.0.0.1:10809 ALL_PROXY=socks5://127.0.0.1:10808 \
  gh api graphql -f query='query { node(id:"PVTI_lAHOD9ycyM4BTOqkzgpEDt4") { ... on ProjectV2Item { id content { ... on Issue { number title } } fieldValues(first:20) { nodes { ... on ProjectV2ItemFieldSingleSelectValue { field { ... on ProjectV2SingleSelectField { name } } name } ... on ProjectV2ItemFieldDateValue { field { ... on ProjectV2FieldCommon { name } } date } } } } } }'
```

预期结果：

1. `#43` issue 正文中的 `当前状态` 为 `待人工验收`
2. `#43` 对应的 Project item `PVTI_lAHOD9ycyM4BTOqkzgpEDt4` 的 `Status` 为 `Hum Check`
3. `#43` 的 `Work Type` 维持原值 `Prep`
4. `#43` 的 `Start Date` 与 `Target Date` 保持不变

## 结果

1. 当前 Project 已可正常读取并使用 `Hum Check`
2. `#43` 已完成从旧 `In Progress` 到 `Hum Check` 的状态切换
3. 本地策略映射已补齐 `Hum Check` 的使用规则，后续待人工验收节点不再继续混放在普通 `In Progress`
