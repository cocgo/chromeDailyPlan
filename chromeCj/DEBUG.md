# 调试指南

## 查看浏览器控制台

### 在 Chrome 扩展中打开开发者工具

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到 "Daily Planner" 扩展
4. 点击 "检查视图" 或 "service worker" 链接
5. 这将打开该扩展的开发者工具窗口

### 查看控制台日志

在开发者工具中，切换到 "Console" 标签页，可以看到所有的日志输出。

### 已添加的调试信息

#### DatePicker 组件
- 每次渲染时会打印：`DatePicker rendered with: { selectedDate, currentMonth }`
- 点击日期时会打印日志

#### 视图切换
- 每次切换视图时会保存到存储
- 页面加载时会读取上次保存的视图类型和日期

### 检查常见问题

#### 1. 日期选择器显示空白

**可能原因：**
- z-index 层级问题
- CSS 样式冲突
- React 组件未正确渲染

**检查方法：**
1. 打开控制台，查看是否有错误信息
2. 检查 DatePicker 渲染日志是否输出
3. 检查 DOM 元素是否存在：
   - 按 F12 打开开发者工具
   - 切换到 Elements 标签页
   - 搜索 "DatePicker" 相关的 div 元素
   - 检查元素的 style 属性，特别是 `z-index` 和 `display` 属性

#### 2. 样式未加载

**检查方法：**
1. 在 Elements 标签页中检查是否有 `tailwind` 相关的类
2. 如果类名存在但样式未应用，检查 `assets/popup.css` 是否正确加载
3. 检查 Network 标签页，确认 CSS 文件已加载

#### 3. React 组件未渲染

**检查方法：**
1. 安装 React DevTools 扩展
2. 在 Components 标签页中查看 React 组件树
3. 检查 DatePicker 组件是否在组件树中

### 手动测试

#### 测试模态框显示

在控制台中运行以下代码：

```javascript
// 测试日期选择器状态
document.querySelector('[class*="bg-black/50"]')
```

如果返回 null，说明模态框未渲染。

#### 测试 z-index

在控制台中运行：

```javascript
// 检查最高 z-index 值
const elements = document.querySelectorAll('*');
let maxZ = 0;
elements.forEach(el => {
  const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
  if (z > maxZ) maxZ = z;
});
console.log('Max z-index:', maxZ);
```

### 临时修复方案

如果日期选择器仍然显示空白，可以尝试以下临时方案：

#### 方案 1：使用更高的 z-index

修改 `src/components/DatePicker.tsx`，将 z-index 改为更大的值：

```tsx
<div style={{ zIndex: 99999 }}>
```

#### 方案 2：使用内联样式

添加更多内联样式覆盖可能的样式冲突：

```tsx
<div
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  }}
>
```

#### 方案 3：直接在主页显示

将日期选择器改为直接在页面中显示，而不是模态框：

```tsx
// 在视图中直接显示日期选择器，而不是通过点击图标打开
```

### 联系支持

如果以上方法都无法解决问题，请提供以下信息：
1. 控制台的错误信息（截图或复制文字）
2. React DevTools 中组件树的截图
3. Elements 面板中 DatePicker 相关 DOM 的信息
