#!/usr/bin/env node

/**
 * Obsidian Skills Integration - Installation Wizard
 *
 * Automates the installation and configuration of the integrated
 * skills system (Layer 1-3).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function header(message) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(message, 'blue');
  log('='.repeat(60), 'blue');
}

// Get vault root directory
const vaultRoot = process.cwd();

// Check if we're in an Obsidian vault
function checkVaultEnvironment() {
  header('🔍 环境检查');

  if (!fs.existsSync(path.join(vaultRoot, '.obsidian'))) {
    error('当前目录不是 Obsidian vault！');
    error('请在 Obsidian vault 根目录运行此脚本。');
    process.exit(1);
  }
  success('检测到 Obsidian vault');

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 14) {
    error(`Node.js 版本过低: ${nodeVersion}`);
    error('需要 Node.js 14 或更高版本');
    process.exit(1);
  }
  success(`Node.js 版本: ${nodeVersion}`);
}

// Check Claude Code CLI installation
function checkClaudeCLI() {
  header('🔍 检查 Claude Code CLI');

  try {
    const claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();
    success(`Claude CLI 已安装: ${claudePath}`);

    try {
      const version = execSync('claude --version', { encoding: 'utf-8' }).trim();
      info(`版本: ${version}`);
    } catch (e) {
      warning('无法获取 Claude CLI 版本信息');
    }

    return claudePath;
  } catch (e) {
    error('未找到 Claude Code CLI');
    info('请先安装 Claude Code CLI:');
    info('  npm install -g @anthropic-ai/claude-code');
    info('  或访问: https://www.anthropic.com/claude-code');
    process.exit(1);
  }
}

// Create directory structure
function createDirectories() {
  header('📁 创建目录结构');

  const directories = [
    '.claude/skills',
    '.claude/commands',
    '.claude/agents',
    '.claude/config',
    '.claude/integrations/mcp-server',
    '.claude/integrations/obsidian-plugin',
    '.claude/scripts',
    '06_Metadata/goal-tracker',
    '06_Metadata/weekly-review'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(vaultRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      success(`创建目录: ${dir}`);
    } else {
      info(`目录已存在: ${dir}`);
    }
  });
}

// Initialize registry files
function initializeRegistries() {
  header('📝 初始化注册表');

  const registries = {
    '.claude/skills/_index.json': {
      version: '1.0.0',
      registry: {}
    },
    '.claude/commands/_index.json': {
      version: '1.0.0',
      registry: {}
    },
    '.claude/agents/_index.json': {
      version: '1.0.0',
      registry: {}
    },
    '.claude/config/features.json': {
      version: '1.0.0',
      skillRegistry: {},
      commandRegistry: {},
      agentRegistry: {}
    }
  };

  Object.entries(registries).forEach(([file, content]) => {
    const fullPath = path.join(vaultRoot, file);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
      success(`创建注册表: ${file}`);
    } else {
      info(`注册表已存在: ${file}`);
    }
  });
}

// Create settings.json
function createSettings(claudePath) {
  header('⚙️  创建配置文件');

  const settingsPath = path.join(vaultRoot, '.claude/config/settings.json');

  if (fs.existsSync(settingsPath)) {
    warning('settings.json 已存在，跳过创建');
    return;
  }

  const settings = {
    version: '2.0.0',
    layers: {
      layer1: {
        enabled: true,
        description: 'Foundation - Plugin Dev Skill'
      },
      layer2: {
        enabled: false,
        features: {
          pkm: {
            enabled: false,
            permissions: {
              fileRead: ['*'],
              fileWrite: ['00_Inbox', '06_Metadata'],
              commandExecution: true
            }
          },
          secondBrain: {
            enabled: false
          }
        }
      },
      layer3: {
        enabled: false,
        features: {
          mcpServer: {
            enabled: false,
            port: 22360
          },
          cliPlugin: {
            enabled: false,
            cliPath: claudePath || ''
          }
        }
      }
    },
    featureToggles: {
      goalTracking: {
        enabled: false,
        strategy: 'pkm'
      },
      weeklyReview: {
        enabled: false,
        pipeline: ['pkm/collection']
      }
    }
  };

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  success('创建 settings.json');
}

// Backup existing CLAUDE.md
function backupCLAUDEmd() {
  header('💾 备份配置文件');

  const claudeMdPath = path.join(vaultRoot, 'CLAUDE.md');
  if (fs.existsSync(claudeMdPath)) {
    const timestamp = Math.floor(Date.now() / 1000);
    const backupPath = path.join(vaultRoot, `CLAUDE.md.backup_${timestamp}`);
    fs.copyFileSync(claudeMdPath, backupPath);
    success(`已备份 CLAUDE.md → ${path.basename(backupPath)}`);
  } else {
    info('未找到 CLAUDE.md，无需备份');
  }
}

// Display installation summary
function displaySummary() {
  header('📊 安装摘要');

  log('\n已创建的目录结构:', 'cyan');
  log('  .claude/');
  log('    ├── skills/         # Skills 统一管理');
  log('    ├── commands/       # Commands 统一管理');
  log('    ├── agents/         # Agents 统一管理');
  log('    ├── config/         # 配置中心');
  log('    ├── integrations/   # Layer 3 集成');
  log('    └── scripts/        # 安装脚本');
  log('  06_Metadata/');
  log('    ├── goal-tracker/   # 目标追踪');
  log('    └── weekly-review/  # 周回顾');

  log('\n已创建的文件:', 'cyan');
  log('  .claude/skills/_index.json');
  log('  .claude/commands/_index.json');
  log('  .claude/agents/_index.json');
  log('  .claude/config/settings.json');
  log('  .claude/config/features.json');

  log('\n下一步:', 'yellow');
  log('  1. 运行健康检查: node .claude/scripts/doctor.js');
  log('  2. 查看配置文件: .claude/config/settings.json');
  log('  3. 根据需要启用 Layer 2 和 Layer 3 功能');
  log('  4. 参考文档: .claude/integrations/*/README.md');
}

// Main installation process
async function main() {
  try {
    log('\n🚀 Obsidian Skills 集成系统 - 安装向导\n', 'green');

    // Step 1: Environment check
    checkVaultEnvironment();

    // Step 2: Check Claude CLI
    const claudePath = checkClaudeCLI();

    // Step 3: Create directories
    createDirectories();

    // Step 4: Initialize registries
    initializeRegistries();

    // Step 5: Create settings
    createSettings(claudePath);

    // Step 6: Backup CLAUDE.md
    backupCLAUDEmd();

    // Step 7: Display summary
    displaySummary();

    log('\n✨ 安装完成！\n', 'green');

  } catch (err) {
    error(`\n安装失败: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run installation
main();
