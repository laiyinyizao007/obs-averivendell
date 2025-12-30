---
epoch: 1767062525178
modelKey: "gemini-2.5-flash|google"
topic: "Obsidian Graph View Filter"


tags:
  - copilot-conversation
---

**user**: OBSIDIAN要怎么在graphview增加filter
[Timestamp: 2025/12/30 10:42:05]

**ai**: 
<errorChunk>Model request failed: API key is not provided for the model: google/gemini-2.5-flash|openrouterai.</errorChunk>
[Timestamp: 2025/12/30 10:42:05]

**user**: OBSIDIAN要怎么在graphview增加filter

[Timestamp: 2025/12/30 10:42:56]

**ai**: 
<errorChunk>Model request failed: API key is not provided for the model: google/gemini-2.5-flash-lite|openrouterai.</errorChunk>
[Timestamp: 2025/12/30 10:42:56]

**user**: OBSIDIAN要怎么在graphview增加filter

[Timestamp: 2025/12/30 10:43:28]

**ai**: 要在 Obsidian 的 Graph View 中增加筛选器（filter），你可以按照以下步骤操作：

1.  **打开 Graph View**:
    *   点击左侧边栏的 Graph View 图标（通常是一个由点和线组成的图形）。
    *   或者使用命令面板（`Ctrl/Cmd + P`），输入 "Graph View" 并选择 "Open Graph View"。

2.  **找到筛选器图标**:
    *   在 Graph View 的左上角，你会看到一个漏斗形状的图标，这就是筛选器（Filter）按钮。点击它。

3.  **使用筛选器选项**:
    *   点击漏斗图标后，会弹出一个侧边栏，其中包含多个筛选选项：

    *   **路径 (Path)**:
        *   你可以输入一个文件夹路径来只显示该文件夹及其子文件夹中的笔记。例如，输入 `daily notes/` 会只显示 "daily notes" 文件夹下的笔记。

    *   **标签 (Tags)**:
        *   输入一个或多个标签（例如 `#todo` 或 `#project`）来只显示包含这些标签的笔记。你可以使用 `OR` 或 `AND` 逻辑来组合标签。

    *   **文本 (Text)**:
        *   输入关键词来筛选笔记内容中包含这些关键词的笔记。

    *   **文件 (Files)**:
        *   输入特定的笔记文件名来只显示这些笔记。

    *   **附件 (Attachments)**:
        *   勾选此选项可以显示包含附件（如图片、PDF 等）的笔记。

    *   **孤立文件 (Orphans)**:
        *   勾选此选项可以显示那些没有被任何其他笔记链接，也没有链接到任何其他笔记的“孤立”笔记。

    *   **仅显示现有文件 (Existing files only)**:
        *   勾选此选项可以隐藏那些在你的笔记中被链接但实际不存在的文件（即红色的链接）。

    *   **深度 (Depth)**:
        *   这个选项可以让你控制显示与当前选定笔记（如果你在 Graph View 中点击了某个笔记）相关联的链接深度。

    *   **分组 (Groups)**:
        *   这个部分允许你根据特定的查询（例如标签、路径等）对笔记进行分组，并为它们分配不同的颜色，以便在 Graph View 中更容易区分。

    *   **显示 (Display)**:
        *   这个部分可以调整 Graph View 的视觉效果，例如是否显示箭头、附件、标签、文件名称等。

通过这些筛选器，你可以根据自己的需求定制 Graph View 的显示内容，使其更具针对性和可读性。
[Timestamp: 2025/12/30 10:43:34]

**user**: 我想不显示某些tag可以吗
[Timestamp: 2025/12/30 10:45:01]

**ai**: 
<errorChunk>Something went wrong. Please check if you have set your API key.
Path: Settings > copilot plugin > Basic Tab > Set Keys.
Or check model config
Error Details: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse: [403 ] Your API key was reported as leaked. Please use another API key.</errorChunk>
[Timestamp: 2025/12/30 10:45:01]

**user**: 我想不显示某些tag可以吗
[Timestamp: 2025/12/30 10:46:08]

**ai**: 
<errorChunk>Something went wrong. Please check if you have set your API key.
Path: Settings > copilot plugin > Basic Tab > Set Keys.
Or check model config
Error Details: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse: [403 ] Your API key was reported as leaked. Please use another API key.</errorChunk>
[Timestamp: 2025/12/30 10:46:08]

**user**: hi
[Timestamp: 2025/12/30 11:17:36]

**ai**: Hello! How can I help you today?
[Timestamp: 2025/12/30 11:17:37]

**user**: OBSIDIAN要怎么在graphview增加filter，不显示某些文件

[Timestamp: 2025/12/30 11:18:08]

**ai**: 要在 Obsidian 的 Graph View 中增加筛选器来**不显示某些文件**，你可以使用“文件 (Files)”筛选器并结合排除（negation）语法。

以下是具体步骤：

1.  **打开 Graph View**:
    *   点击左侧边栏的 Graph View 图标。
    *   或者使用命令面板（`Ctrl/Cmd + P`），输入 "Graph View" 并选择 "Open Graph View"。

2.  **打开筛选器面板**:
    *   在 Graph View 的左上角，点击漏斗形状的图标（Filter 按钮）。

3.  **使用“文件 (Files)”筛选器进行排除**:
    *   在弹出的筛选器侧边栏中，找到 **“文件 (Files)”** 输入框。
    *   要排除某个文件，你需要在文件名前面加上一个减号 `-`。

    *   **示例**:
        *   如果你想排除名为 `Daily Note 2023-10-27.md` 的文件，你可以在“文件 (Files)”输入框中输入：
            `- "Daily Note 2023-10-27"`
            （注意：如果文件名包含空格，最好用双引号 `""` 包裹起来。）

        *   如果你想排除多个文件，可以在它们之间用空格分隔，每个文件名前都加上 `-`：
            `- "Daily Note 2023-10-27" - "Meeting Notes.md"`

        *   你也可以使用通配符 `*` 来排除符合特定模式的文件。例如，要排除所有以 "Daily Note" 开头的文件：
            `- "Daily Note*"`

        *   要排除某个文件夹下的所有文件，你可以使用路径和通配符。例如，排除 `Templates` 文件夹下的所有文件：
            `- "Templates/*"`

通过这种方式，你可以在 Graph View 中精确地控制哪些文件不被显示，从而更好地聚焦于你想要查看的笔记关系。
[Timestamp: 2025/12/30 11:18:13]