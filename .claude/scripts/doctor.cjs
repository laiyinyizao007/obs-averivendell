#!/usr/bin/env node

/**
 * Obsidian Skills Integration - Health Check Tool
 *
 * Verifies the installation and configuration of the integrated
 * skills system. Checks directory structure, registry files,
 * permissions, and dependencies.
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
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
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

function subheader(message) {
  log(`\n${message}`, 'cyan');
  log('-'.repeat(60), 'gray');
}

const vaultRoot = process.cwd();
let issueCount = 0;
let warningCount = 0;

// Check if we're in an Obsidian vault
function checkVaultRoot() {
  header('📍 Vault 环境检查');

  if (!fs.existsSync(path.join(vaultRoot, '.obsidian'))) {
    error('当前目录不是 Obsidian vault！');
    error('请在 Obsidian vault 根目录运行此脚本。');
    process.exit(1);
  }
  success('Obsidian vault 检测正常');

  // Check .claude directory
  if (!fs.existsSync(path.join(vaultRoot, '.claude'))) {
    error('.claude/ 目录不存在');
    error('请先运行安装脚本: node .claude/scripts/install.js');
    issueCount++;
  } else {
    success('.claude/ 目录存在');
  }
}

// Check directory structure
function checkDirectoryStructure() {
  subheader('📁 目录结构检查');

  const requiredDirs = [
    '.claude/skills',
    '.claude/commands',
    '.claude/agents',
    '.claude/config',
    '.claude/integrations',
    '.claude/scripts',
    '06_Metadata'
  ];

  const optionalDirs = [
    '.claude/integrations/mcp-server',
    '.claude/integrations/obsidian-plugin',
    '06_Metadata/goal-tracker',
    '06_Metadata/weekly-review'
  ];

  requiredDirs.forEach(dir => {
    const fullPath = path.join(vaultRoot, dir);
    if (fs.existsSync(fullPath)) {
      success(`${dir}/`);
    } else {
      error(`缺少目录: ${dir}/`);
      issueCount++;
    }
  });

  optionalDirs.forEach(dir => {
    const fullPath = path.join(vaultRoot, dir);
    if (fs.existsSync(fullPath)) {
      info(`[可选] ${dir}/`);
    } else {
      log(`[可选] 未创建: ${dir}/`, 'gray');
    }
  });
}

// Check registry files
function checkRegistryFiles() {
  subheader('📝 注册表文件检查');

  const registries = [
    '.claude/skills/_index.json',
    '.claude/commands/_index.json',
    '.claude/agents/_index.json',
    '.claude/config/features.json'
  ];

  registries.forEach(file => {
    const fullPath = path.join(vaultRoot, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        if (content.version) {
          success(`${file} (v${content.version})`);
        } else {
          warning(`${file} 缺少 version 字段`);
          warningCount++;
        }
      } catch (e) {
        error(`${file} JSON 格式错误: ${e.message}`);
        issueCount++;
      }
    } else {
      error(`缺少注册表: ${file}`);
      issueCount++;
    }
  });
}

// Check settings.json
function checkSettings() {
  subheader('⚙️  配置文件检查');

  const settingsPath = path.join(vaultRoot, '.claude/config/settings.json');

  if (!fs.existsSync(settingsPath)) {
    error('settings.json 不存在');
    issueCount++;
    return null;
  }

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));

    // Check version
    if (settings.version) {
      success(`配置版本: ${settings.version}`);
    } else {
      warning('配置文件缺少 version 字段');
      warningCount++;
    }

    // Check layers
    if (settings.layers) {
      ['layer1', 'layer2', 'layer3'].forEach(layer => {
        if (settings.layers[layer]) {
          const enabled = settings.layers[layer].enabled;
          const status = enabled ? '✓' : '✗';
          const color = enabled ? 'green' : 'gray';
          log(`  ${layer}: ${status} ${enabled ? 'Enabled' : 'Disabled'}`, color);
        } else {
          warning(`  配置中缺少 ${layer}`);
          warningCount++;
        }
      });
    } else {
      error('配置文件缺少 layers 字段');
      issueCount++;
    }

    return settings;
  } catch (e) {
    error(`settings.json 格式错误: ${e.message}`);
    issueCount++;
    return null;
  }
}

// Check Layer 1: Plugin Dev Skill
function checkLayer1() {
  subheader('📦 Layer 1: Plugin Dev Skill');

  const skillPath = path.join(vaultRoot, '.claude/skills/plugin-dev/SKILL.md');
  if (fs.existsSync(skillPath)) {
    success('Plugin Dev Skill 已安装');

    // Check reference files
    const refDir = path.join(vaultRoot, '.claude/skills/plugin-dev/reference');
    if (fs.existsSync(refDir)) {
      const refFiles = fs.readdirSync(refDir);
      info(`  包含 ${refFiles.length} 个参考文件`);
    }
  } else {
    warning('Plugin Dev Skill 未安装');
    warningCount++;
  }
}

// Check Layer 2: PKM System
function checkLayer2(settings) {
  subheader('📦 Layer 2: PKM System');

  const layer2Enabled = settings?.layers?.layer2?.enabled;

  if (!layer2Enabled) {
    info('Layer 2 未启用（这是正常的，可以按需启用）');
    return;
  }

  // Check PKM skills
  const pkmSkills = ['goal-tracking', 'daily-workflow', 'obsidian-vault-ops'];
  const pkmSkillsPath = path.join(vaultRoot, '.claude/skills/pkm');

  if (fs.existsSync(pkmSkillsPath)) {
    success('PKM Skills 目录存在');

    pkmSkills.forEach(skill => {
      const skillFile = path.join(pkmSkillsPath, skill, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        success(`  ✓ ${skill}`);
      } else {
        warning(`  ✗ ${skill} 缺失`);
        warningCount++;
      }
    });
  } else {
    warning('PKM Skills 目录不存在');
    warningCount++;
  }

  // Check PKM commands
  const pkmCommands = ['daily.md', 'weekly.md', 'onboard.md', 'push.md'];
  const pkmCommandsPath = path.join(vaultRoot, '.claude/commands/pkm');

  if (fs.existsSync(pkmCommandsPath)) {
    const existingCommands = fs.readdirSync(pkmCommandsPath);
    info(`PKM Commands: ${existingCommands.length}/4 个文件`);
  } else {
    warning('PKM Commands 目录不存在');
    warningCount++;
  }

  // Check PKM agents
  const pkmAgents = ['goal-aligner.md', 'inbox-processor.md', 'note-organizer.md', 'weekly-reviewer.md'];
  const pkmAgentsPath = path.join(vaultRoot, '.claude/agents/pkm');

  if (fs.existsSync(pkmAgentsPath)) {
    const existingAgents = fs.readdirSync(pkmAgentsPath);
    info(`PKM Agents: ${existingAgents.length}/4 个文件`);
  } else {
    warning('PKM Agents 目录不存在');
    warningCount++;
  }
}

// Check Layer 3: CLI Plugin
function checkLayer3(settings) {
  subheader('📦 Layer 3: CLI Plugin');

  const layer3Enabled = settings?.layers?.layer3?.enabled;
  const cliPluginEnabled = settings?.layers?.layer3?.features?.cliPlugin?.enabled;

  if (!layer3Enabled || !cliPluginEnabled) {
    info('Layer 3 CLI Plugin 未启用（这是正常的，可以按需启用）');
    return;
  }

  // Check plugin installation
  const pluginPath = path.join(vaultRoot, '.obsidian/plugins/claude-code-integration');
  if (fs.existsSync(pluginPath)) {
    success('Obsidian Plugin 已安装');

    // Check required files
    const requiredFiles = ['main.js', 'manifest.json', 'styles.css'];
    requiredFiles.forEach(file => {
      const filePath = path.join(pluginPath, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        success(`  ${file} (${sizeKB} KB)`);
      } else {
        error(`  缺少文件: ${file}`);
        issueCount++;
      }
    });

    // Check manifest
    try {
      const manifestPath = path.join(pluginPath, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      info(`  插件版本: ${manifest.version}`);
      info(`  插件 ID: ${manifest.id}`);
    } catch (e) {
      warning(`  manifest.json 读取失败: ${e.message}`);
      warningCount++;
    }
  } else {
    warning('Obsidian Plugin 未安装');
    warning('  运行构建脚本安装插件');
    warningCount++;
  }
}

// Check Claude Code CLI
function checkClaudeCLI(settings) {
  subheader('🔧 Claude Code CLI 检查');

  try {
    const claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();
    success(`Claude CLI 已安装: ${claudePath}`);

    // Check version
    try {
      const version = execSync('claude --version', { encoding: 'utf-8', stderr: 'ignore' }).trim();
      info(`  版本: ${version}`);
    } catch (e) {
      warning('  无法获取版本信息');
      warningCount++;
    }

    // Compare with settings
    const configuredPath = settings?.layers?.layer3?.features?.cliPlugin?.cliPath;
    if (configuredPath) {
      if (configuredPath === claudePath) {
        success(`  配置路径匹配: ${configuredPath}`);
      } else {
        warning(`  配置路径不匹配:`);
        warning(`    配置: ${configuredPath}`);
        warning(`    实际: ${claudePath}`);
        warningCount++;
      }
    }
  } catch (e) {
    error('未找到 Claude Code CLI');
    error('  请安装: npm install -g @anthropic-ai/claude-code');
    issueCount++;
  }
}

// Check API key
function checkAPIKey() {
  subheader('🔑 API Key 检查');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    const maskedKey = apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
    success(`ANTHROPIC_API_KEY 已设置: ${maskedKey}`);
  } else {
    warning('ANTHROPIC_API_KEY 环境变量未设置');
    warning('  Claude Code CLI 需要 API key 才能工作');
    warning('  设置方法: export ANTHROPIC_API_KEY="your-key"');
    warningCount++;
  }
}

// Check file permissions
function checkPermissions() {
  subheader('🔒 权限检查');

  const criticalDirs = [
    '.claude/skills',
    '.claude/commands',
    '.claude/agents',
    '.claude/config',
    '06_Metadata'
  ];

  criticalDirs.forEach(dir => {
    const fullPath = path.join(vaultRoot, dir);
    if (fs.existsSync(fullPath)) {
      try {
        fs.accessSync(fullPath, fs.constants.R_OK | fs.constants.W_OK);
        success(`${dir}/ 读写权限正常`);
      } catch (e) {
        error(`${dir}/ 权限不足`);
        issueCount++;
      }
    }
  });
}

// Check version consistency
function checkVersionConsistency() {
  subheader('🔄 版本一致性检查');

  const files = [
    '.claude/skills/_index.json',
    '.claude/commands/_index.json',
    '.claude/agents/_index.json',
    '.claude/config/settings.json',
    '.claude/config/features.json'
  ];

  const versions = {};

  files.forEach(file => {
    const fullPath = path.join(vaultRoot, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        if (content.version) {
          versions[file] = content.version;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });

  const uniqueVersions = [...new Set(Object.values(versions))];

  if (uniqueVersions.length === 1) {
    success(`所有配置文件版本一致: ${uniqueVersions[0]}`);
  } else {
    warning('配置文件版本不一致:');
    Object.entries(versions).forEach(([file, version]) => {
      log(`  ${file}: ${version}`, 'gray');
    });
    warningCount++;
  }
}

// Display final summary
function displaySummary() {
  header('📊 健康检查摘要');

  const totalChecks = issueCount + warningCount;

  if (issueCount === 0 && warningCount === 0) {
    success('\n🎉 所有检查通过！系统运行正常。\n');
  } else {
    if (issueCount > 0) {
      error(`\n发现 ${issueCount} 个错误`);
    }
    if (warningCount > 0) {
      warning(`发现 ${warningCount} 个警告`);
    }
    log('');
  }

  // Recommendations
  if (issueCount > 0 || warningCount > 0) {
    log('建议操作:', 'yellow');
    if (issueCount > 0) {
      log('  1. 修复上述错误后重新运行健康检查');
      log('  2. 如需重新安装，运行: node .claude/scripts/install.js');
    }
    if (warningCount > 0) {
      log('  3. 查看警告信息并根据需要进行调整');
      log('  4. 警告不会影响基本功能，但建议修复以获得最佳体验');
    }
    log('');
  }

  // Exit code
  process.exit(issueCount > 0 ? 1 : 0);
}

// Main health check process
function main() {
  try {
    log('\n🏥 Obsidian Skills 集成系统 - 健康检查\n', 'green');

    // Run all checks
    checkVaultRoot();
    checkDirectoryStructure();
    checkRegistryFiles();
    const settings = checkSettings();
    checkLayer1();
    checkLayer2(settings);
    checkLayer3(settings);
    checkClaudeCLI(settings);
    checkAPIKey();
    checkPermissions();
    checkVersionConsistency();

    // Display summary
    displaySummary();

  } catch (err) {
    error(`\n健康检查失败: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run health check
main();
