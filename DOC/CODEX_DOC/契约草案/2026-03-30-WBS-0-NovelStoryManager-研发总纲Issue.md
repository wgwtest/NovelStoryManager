# WBS 0 NovelStoryManager 研发总纲

工作目标：

- 维护整个项目的顶层 WBS 树和当前主线，让 GitHub Project、issue 树和本地文档始终表达同一条研发路线。

工作内容：

- 维护 `WBS 1` 到 `WBS 6` 作为顶层直接子节点的树结构。
- 维护当前主线在 README、WBS 总纲和 GitHub Project 中的一致性。
- 发现任务树、依赖关系或时间规划漂移时，推动对应节点修正。

潜在难点：

- GitHub Project、issue 正文和本地文档容易出现三处漂移。
- 父子结构正确，不代表当前主线表达清楚，仍然需要同步状态与日期。

Depends On：

- 已确认的产品设计稿

成果物：

- `#8` 根 issue
- GitHub Project `NovelStoryManager Delivery Roadmap`
- `DOC/CODEX_DOC/01-WBS-L0-NovelStoryManager-研发总纲.md`

验收方法：

- 人工核验 `#8` 的直接子 issue 为 `#9 #10 #11 #12 #13 #14`。
- 人工核验 [01-WBS-L0-NovelStoryManager-研发总纲.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/01-WBS-L0-NovelStoryManager-研发总纲.md) 中存在顶层 WBS 和当前活动链路。
- 人工核验 GitHub Project 中当前主线可以从根节点一路下钻到当前叶子节点。

当前状态：

- 待用户确认

上级节点：

- 无
