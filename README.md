# 在线考试系统 / Online Exam System

一套面向高校场景的在线考试平台，支持管理员出题组卷、学生在线作答、自动评分及双语切换。

---

## 项目状态 / Project Status

**当前阶段：** MVP（最小可行产品）已完成并通过完整手动测试

以下流程已验证可用：
- 学生端：登录 → 控制台 → 试卷列表 → 开始考试 → 提交 → 查看成绩 → 错题复习
- 管理端：登录 → 题目管理 → 试卷管理（创建/发布/归档）
- 系统：双语切换（中/英）、角色权限控制、自动化评分

**有意延后的功能：**
- 种子数据脚本（需手动录入题库）
- 学生自主注册
- 简答题人工评分界面
- 试卷下载（PDF/打印）
- 管理端学生信息管理
- 数据分析与统计面板

---

## 核心亮点 / Highlights

| 特性 | 说明 |
|------|------|
| **双语支持** | 默认中文，实时切换英文；语言偏好通过 Cookie 持久化 |
| **自动化评分** | 单选/多选/判断/填空题自动评分，即时反馈成绩 |
| **题库管理** | 支持 5 种题型（单选、多选、判断、填空、简答） |
| **灵活组卷** | 从题库挑选题目、设置分值、发布/归档管理 |
| **错题本** | 自动记录错题，按科目筛选复习 |
| **权限隔离** | 管理员与学生路由严格分离，互不越权 |

---

## 功能说明 / Features

### 管理员端 / Admin Portal

- **题目管理** — 创建、编辑、删除题目；支持按科目/类型/难度/状态筛选
- **试卷管理** — 从题库选题组卷、设置时长与及格分、发布/归档操作
- **学生管理** — 查看学生账户列表（界面已搭建，功能待扩展）

### 学生端 / Student Portal

- **控制台** — 查看可参加考试数量、已完成记录、进行中考试
- **试卷列表** — 按科目筛选、搜索试卷；支持继续未完成考试或重新作答
- **在线作答** — 实时计时、选择题/填空题自动保存、提交前确认未答题
- **成绩查看** — 显示总分、是否及格、逐题正确/错误回顾
- **错题本** — 按科目筛选，复习历史错题记录

### 系统能力 / System Capabilities

- **会话认证** — 基于 Cookie 的会话管理，24 小时有效期
- **角色权限控制（RBAC）** — 管理员与学生路由保护，未授权访问自动跳转
- **双语界面** — 中文默认，支持实时切换（中 ↔ 英）
- **自动化评分** — 单选、多选、判断、填空题即时评分；简答题需人工评分
- **错误记录** — 答题记录自动存入错题本

---

## 技术栈 / Tech Stack

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16（App Router） |
| 语言 | TypeScript（严格模式） |
| 样式 | Tailwind CSS + shadcn/ui |
| 数据库 | PostgreSQL + Prisma ORM |
| 会话 | Cookie-based Session（自定义实现） |

---

## 业务流程 / Business Flow

```
┌─────────────────────────────────────────────────────┐
│                    管理员流程                        │
│                                                      │
│  登录 → 题目管理 → 试卷管理 → 发布试卷               │
│              ↓                                        │
│        创建题目  ──→  组卷/选题 ──→ 发布              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    学生流程                          │
│                                                      │
│  登录 → 控制台 → 试卷列表 → 开始考试 → 作答 → 提交   │
│              ↓                              ↓        │
│         查看成绩 ─────────────────→ 错题本 → 复习    │
└─────────────────────────────────────────────────────┘
```

---

## 项目结构 / Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # 首页 / Landing page
│   ├── login/                     # 登录页
│   ├── logout/                    # 登出
│   ├── dashboard/                # 学生控制台
│   ├── papers/                    # 试卷列表
│   ├── exam/
│   │   └── [paperId]/
│   │       ├── page.tsx          # 考试开始页
│   │       ├── take/             # 在线作答
│   │       └── result/            # 成绩查看
│   ├── wrong-book/               # 错题本
│   └── admin/                    # 管理后台
│       ├── questions/            # 题目管理
│       ├── papers/              # 试卷管理
│       └── students/            # 学生管理
│
├── components/
│   ├── LanguageToggle.tsx         # 语言切换组件
│   ├── Providers.tsx            # Context 入口
│   └── ui/                      # shadcn/ui 基础组件
│
├── contexts/
│   └── BilingualContext.tsx      # 双语上下文（t 函数）
│
└── lib/
    ├── auth/session.ts           # 会话管理（server-only）
    ├── rbac.ts                  # 角色权限守卫（server-only）
    ├── grading.ts                # 自动评分逻辑
    ├── prisma.ts                # Prisma 客户端
    └── validators/              # 输入校验
```

---

## 快速启动 / Getting Started

### 环境要求

- Node.js 18+
- PostgreSQL 14+

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/simonnyjonny/online-exam-system.git
cd online-exam-system

# 安装依赖
npm install

# 配置数据库连接
# 复制并编辑环境变量文件
cp .env.example .env   # 或手动创建 .env，内容参考下方
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/examdb"

# 生成 Prisma 客户端并同步数据库
npm run db:generate
npm run db:push

# 填充演示账户（如有种子脚本）
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run db:generate` | 生成 Prisma 客户端 |
| `npm run db:push` | 将 Schema 同步到数据库 |
| `npm run db:seed` | 填充演示数据 |
| `npm run db:studio` | 打开 Prisma Studio |

---

## 演示账户 / Demo Accounts

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@exam.com | admin123 |
| 学生 | student@exam.com | student123 |

---

## 路由一览 / Route Overview

| 路由 | 说明 | 访问权限 |
|------|------|----------|
| `/` | 首页 | 公开 |
| `/login` | 登录 | 公开 |
| `/dashboard` | 学生控制台 | 学生 |
| `/papers` | 试卷列表 | 学生 |
| `/exam/[paperId]` | 开始考试 | 学生 |
| `/exam/[paperId]/take` | 在线作答 | 学生 |
| `/exam/result/[attemptId]` | 成绩查看 | 学生 |
| `/wrong-book` | 错题本 | 学生 |
| `/admin` | 管理后台概览 | 管理员 |
| `/admin/questions` | 题目列表 | 管理员 |
| `/admin/questions/new` | 创建题目 | 管理员 |
| `/admin/questions/[id]` | 编辑题目 | 管理员 |
| `/admin/papers` | 试卷列表 | 管理员 |
| `/admin/papers/new` | 创建试卷 | 管理员 |
| `/admin/papers/[id]` | 编辑试卷 | 管理员 |
| `/admin/students` | 学生管理 | 管理员 |

---

## 截图 / Screenshots

> 截图待补充。建议尺寸：1280×720 或 1440×900。
> 
> 推荐截图页面：
> - 首页（中/英双语切换）
> - 学生控制台
> - 试卷列表
> - 考试作答界面
> - 成绩查看页
> - 管理端题目管理
> - 管理端试卷管理

---

## 待优化项 / Future Improvements

| 优先级 | 功能 |
|--------|------|
| 高 | 种子数据脚本（快速填充题库） |
| 高 | 学生自主注册 |
| 高 | 管理端学生 CRUD |
| 中 | 简答题人工评分界面 |
| 中 | 试卷下载（PDF 导出） |
| 中 | 管理端数据分析与统计 |
| 低 | 密码修改功能 |
| 低 | 邮件通知（成绩发布提醒） |
| 低 | 暗色模式支持 |
| 低 | 移动端适配优化 |

---

## 相关文档 / Documentation

- [产品需求](./docs/product-requirements.md)
- [系统架构](./docs/system-architecture.md)
- [数据库设计](./docs/database-design.md)
- [API 规范](./docs/api-spec.md)
- [安全清单](./docs/security-checklist.md)

---

## License

ISC
