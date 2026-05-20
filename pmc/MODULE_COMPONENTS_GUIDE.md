# 游戏模块按钮样式系统 - 使用指南

> **版本**: v2.3  
> **日期**: 2026-05-20

---

## 概述

为了提升游戏内页面的视觉效果，我们创建了一套完整的模块按钮样式系统。这套系统包含了丰富的UI组件，可以帮助开发者快速构建美观的游戏界面。

---

## 组件列表

### 1. 模块按钮 (module-btn) ⭐

**基础结构**:
```javascript
ModuleComponents.moduleButton({
    icon: '🏙️',           // 图标
    title: '城市名称',      // 标题
    subtitle: '副标题描述',  // 副标题
    badge: '999',         // 徽章
    progress: 75,         // 进度条百分比
    progressText: '75%',  // 进度条文本
    variant: 'primary',    // 变体样式
    onclick: 'handleClick()' // 点击事件
})
```

**变体样式**:
- `primary` - 金色强调（默认）
- `success` - 绿色成功
- `danger` - 红色危险
- `info` - 蓝色信息

**视觉效果**:
- ✅ 左侧金色竖线（悬停显示）
- ✅ 右侧箭头（悬停淡入）
- ✅ 平滑过渡动画
- ✅ 左侧移动效果
- ✅ 图标容器

---

### 2. 模块按钮网格 (module-grid)

**使用方式**:
```javascript
ModuleComponents.moduleButtonGrid([
    {
        icon: '🏙️',
        title: '城市A',
        subtitle: '描述',
        badge: '100万'
    },
    {
        icon: '🏙️',
        title: '城市B',
        subtitle: '描述',
        badge: '200万'
    }
])
```

**效果**: 自动添加间距，垂直排列

---

### 3. 模块卡片 (module-card)

**使用方式**:
```javascript
ModuleComponents.moduleCard({
    header: '<div class="card-title">标题</div>',
    content: '内容区域',
    footer: '<button>操作</button>',
    clickable: true,
    onclick: 'handleClick()'
})
```

**效果**: 
- 圆角边框
- 悬停效果
- 可点击状态

---

### 4. 筛选按钮组 (filter-group)

**使用方式**:
```javascript
ModuleComponents.filterButtonGroup({
    filters: [
        { label: '全部', active: true },
        { label: '土地', count: 5 },
        { label: '项目', count: 3 }
    ]
})
```

**效果**:
- 横向滚动
- 胶囊形状
- 选中高亮
- 可选数量显示

---

### 5. 状态徽章 (status-badge)

**使用方式**:
```javascript
ModuleComponents.statusBadge({
    text: '进行中',
    variant: 'success', // success | danger | info
    icon: '⚡'
})
```

**效果**:
- 胶囊形状
- 背景色变化
- 可选图标

---

### 6. 排名徽章 (rank-badge)

**使用方式**:
```javascript
ModuleComponents.rankBadge(1, true)  // 排名，是否是前三
```

**效果**:
- 圆形徽章
- 前三名金色渐变

---

### 7. 统计行 (stats-row)

**使用方式**:
```javascript
ModuleComponents.statsRow({
    label: '项目数量',
    value: '12个',
    valueVariant: 'accent' // accent | success | danger
})
```

**效果**:
- 水平排列
- 值颜色可选

---

### 8. 详情网格项 (detail-item)

**使用方式**:
```javascript
ModuleComponents.detailItem({
    label: '总投资',
    value: '5000万',
    variant: 'accent'
})
```

**效果**:
- 2列网格布局
- 标签-值结构

---

### 9. 操作列表 (action-list)

**使用方式**:
```javascript
ModuleComponents.actionList([
    {
        icon: '📊',
        text: '查看详情',
        sub: '查看项目完整信息',
        onclick: 'showDetail()'
    },
    {
        icon: '✏️',
        text: '编辑项目',
        sub: '修改项目信息'
    }
])
```

**效果**:
- 分隔线
- 悬停高亮
- 图标+文本

---

## CSS 类参考

### 模块按钮样式

| 类名 | 说明 |
|------|------|
| `.module-btn` | 模块按钮基础样式 |
| `.module-btn--primary` | 金色变体 |
| `.module-btn--success` | 绿色变体 |
| `.module-btn--danger` | 红色变体 |
| `.module-btn--info` | 蓝色变体 |
| `.module-btn__icon` | 图标容器 |
| `.module-btn__badge` | 徽章 |
| `.module-btn__progress` | 进度条容器 |
| `.module-btn__arrow` | 箭头 |

### 筛选按钮样式

| 类名 | 说明 |
|------|------|
| `.filter-group` | 筛选按钮组容器 |
| `.filter-btn` | 筛选按钮 |
| `.filter-btn.active` | 选中状态 |
| `.filter-btn__count` | 数量徽章 |

### 徽章样式

| 类名 | 说明 |
|------|------|
| `.status-badge` | 状态徽章 |
| `.status-badge--success` | 成功状态 |
| `.status-badge--danger` | 危险状态 |
| `.status-badge--info` | 信息状态 |
| `.rank-badge` | 排名徽章 |
| `.rank-badge--top` | 前三名 |

### 卡片样式

| 类名 | 说明 |
|------|------|
| `.module-card` | 模块卡片 |
| `.module-card--clickable` | 可点击卡片 |
| `.card-title` | 卡片标题 |
| `.card-subtitle` | 卡片副标题 |
| `.card-header` | 卡片头部 |

---

## 使用示例

### 示例1: 城市研究列表

```javascript
const cities = InitialData.getCities();
cities.forEach(function(city) {
    html += ModuleComponents.moduleButton({
        icon: '🏙️',
        title: city.name,
        subtitle: city.description,
        progress: city.developmentLevel,
        progressText: '发展潜力 ' + city.potential + '%',
        badge: Utils.formatMoney(city.avgPrice),
        onclick: "showCityDetail('" + city.id + "')"
    });
});
```

### 示例2: 竞争对手卡片

```javascript
competitors.forEach(function(comp, i) {
    html += ModuleComponents.moduleButton({
        icon: '🏢',
        title: comp.name,
        subtitle: '行业排名 #' + (i + 1),
        badge: comp.stars + '星',
        variant: i < 3 ? 'success' : 'info',
        progress: comp.marketShare,
        progressText: '市场份额 ' + comp.marketShare + '%'
    });
});
```

### 示例3: 操作菜单

```javascript
html += ModuleComponents.actionList([
    {
        icon: '📊',
        text: '项目总览',
        sub: '查看项目关键指标'
    },
    {
        icon: '📐',
        text: '设计管理',
        sub: '管理设计方案'
    },
    {
        icon: '👷',
        text: '施工管理',
        sub: '监控施工进度'
    }
]);
```

---

## 最佳实践

### ✅ 推荐做法

1. **统一图标大小**: 所有模块按钮的图标保持一致大小（48px）
2. **合理使用变体**: 根据内容重要性选择合适的颜色变体
3. **添加进度条**: 对于有进度概念的内容（如发展潜力），添加进度条
4. **使用徽章**: 对于关键数据，使用徽章突出显示
5. **保持一致性**: 同一页面使用相同类型的组件

### ❌ 避免做法

1. **避免过多变体**: 不要在一个页面混用太多颜色变体
2. **避免过长文本**: 标题和副标题保持简洁
3. **避免复杂结构**: 每个模块按钮聚焦一个功能
4. **避免忽略可点击提示**: 确保用户知道元素可点击

---

## 触控优化

所有组件都经过触控设备优化：

- ✅ 悬停效果在触控设备上自动禁用
- ✅ 使用 `:active` 替代 `:hover` 提供触控反馈
- ✅ 适当的内边距确保触控区域足够大（≥44px）
- ✅ 平滑的动画确保60fps性能

---

## 性能考虑

- ✅ 使用 `transform` 和 `opacity` 实现动画（GPU加速）
- ✅ 避免复杂的CSS选择器
- ✅ 合理的动画时长（150ms-350ms）
- ✅ 使用CSS变量便于主题切换

---

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Chrome Android 80+

---

## 更新日志

### v2.3 (2026-05-20)
- ✨ 全新游戏模块按钮样式系统
- 🎨 添加30+个模块按钮CSS类
- 📦 新增ModuleComponents组件库
- 💫 支持图标、徽章、进度条、箭头
- 🎭 多种变体（primary/success/danger/info）
- 📱 筛选按钮和标签组件
- 🏷️ 状态徽章和排名徽章
- ⚡ 触控设备优化
- 🎯 美化投资页面城市研究模块
- 🏢 美化竞争对手模块
- 💱 美化资产交易模块

---

## 下一步计划

- [ ] 添加更多组件变体
- [ ] 优化动画性能
- [ ] 添加组件文档
- [ ] 创建组件预览页面

---

**维护者**: AI Assistant  
**最后更新**: 2026-05-20
