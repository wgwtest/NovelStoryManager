# WBS 3.2 通用视图元素与坐标系统

## 通用元素

1. `Node`
   - 对应对象库中的一个对象
   - 拥有 `id`、`label`、`objectType`
2. `Edge`
   - 对应关系对象或对象引用
   - 拥有 `sourceId`、`targetId`、`kind`
3. `Track Block`
   - 对应事件对象在某条轨道上的一个投影
   - 拥有 `eventId`、`laneId`、`timeAnchor`
4. `Observation Slice`
   - 对应观察维度下的一组事件与相关对象

## 坐标体系

1. `Graph` 使用二维画布坐标：
   - `x`
   - `y`
2. `Tracks` 使用“横向时间 / 纵向轨道”的二维坐标：
   - `timeIndex`
   - `laneIndex`
3. 两者共享视口坐标：
   - `zoom`
   - `offsetX`
   - `offsetY`

## 真源边界

1. 对象事实字段继续存储在 `objects/*.json`。
2. 节点位置、视口位置、轨道顺序、章节切片等观察结果存储在 `views/*.json`。
3. 坐标不是对象事实，不回写到对象文件。
