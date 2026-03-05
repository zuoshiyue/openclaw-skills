#!/usr/bin/env node

/**
 * Code Reviewer - 代码审查工具
 * 
 * 基于 Clean Code、SOLID 原则、阿里巴巴 Java 规范等最佳实践
 * 
 * 使用方法:
 *   node review.mjs <文件路径> [选项]
 * 
 * 选项:
 *   --lang <语言>     指定语言 (java/js/ts/py)
 *   --verbose         详细输出
 *   --report          生成完整报告
 *   --ci             CI/CD 模式（返回非零退出码）
 *   --recursive      递归检查目录
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载规则
const cleanCodeRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../rules/clean-code.json'), 'utf-8')
);
const alibabaRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../rules/alibaba-java.json'), 'utf-8')
);
const pythonRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../rules/python.json'), 'utf-8')
);
const goRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../rules/go.json'), 'utf-8')
);

// 代码异味检测规则
const codeSmells = {
  longMethod: { threshold: 50, severity: 'warning' },
  longClass: { threshold: 500, severity: 'warning' },
  largeFile: { threshold: 1000, severity: 'warning' },
  deepNesting: { threshold: 4, severity: 'error' },
  tooManyParams: { threshold: 3, severity: 'warning' },
  magicNumber: { severity: 'warning' },
  duplicateCode: { threshold: 5, severity: 'error' }
};

/**
 * 解析命令行参数
 */
function parseArgs(args) {
  const options = {
    file: null,
    lang: 'auto',
    verbose: false,
    report: false,
    ci: false,
    recursive: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      switch (arg) {
        case '--verbose':
          options.verbose = true;
          break;
        case '--report':
          options.report = true;
          break;
        case '--ci':
          options.ci = true;
          break;
        case '--recursive':
          options.recursive = true;
          break;
        case '--lang':
          options.lang = args[++i];
          break;
      }
    } else if (!options.file) {
      options.file = arg;
    }
  }

  return options;
}

/**
 * 检测文件语言
 */
function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const langMap = {
    '.java': 'java',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.py': 'python',
    '.go': 'go',
    '.rs': 'rust',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp'
  };
  return langMap[ext] || 'unknown';
}

/**
 * 读取文件内容
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`❌ 无法读取文件：${filePath}`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * 基础代码分析
 */
function analyzeCode(content, filePath) {
  const lines = content.split('\n');
  const issues = [];

  // 1. 文件行数检查
  if (lines.length > codeSmells.largeFile.threshold) {
    issues.push({
      ruleId: 'SMELL-001',
      severity: codeSmells.largeFile.severity,
      line: 1,
      message: `文件过大 (${lines.length} 行)，建议拆分为多个文件`,
      suggestion: '考虑按功能模块拆分文件'
    });
  }

  // 2. 函数长度检查
  const functionPattern = /(?:function|def|fn|func)\s+\w+\s*\([^)]*\)\s*(?:\{|:)/g;
  let match;
  while ((match = functionPattern.exec(content)) !== null) {
    const startLine = content.substring(0, match.index).split('\n').length;
    // 简单估算函数结束（实际应该用 AST）
    const funcContent = content.substring(match.index);
    const braceCount = (funcContent.match(/{/g) || []).length;
    const estimatedLines = funcContent.split('\n').slice(0, 100).length;
    
    if (estimatedLines > codeSmells.longMethod.threshold) {
      issues.push({
        ruleId: 'SMELL-002',
        severity: codeSmells.longMethod.severity,
        line: startLine,
        message: `函数过长 (约${estimatedLines}行)，建议拆分`,
        suggestion: '遵循单一职责原则，拆分为多个小函数'
      });
    }
  }

  // 3. 魔法数字检查
  const magicNumberPattern = /\b\d{2,}\b/g;
  lines.forEach((line, index) => {
    // 跳过注释和字符串
    if (line.trim().startsWith('//') || line.trim().startsWith('#')) return;
    if (line.includes('"') || line.includes("'")) return;
    
    const numbers = line.match(magicNumberPattern);
    if (numbers) {
      numbers.forEach(num => {
        // 排除常见的合法数字（如 0, 1, 2, 10, 100 等）
        if (!['10', '100', '1000', '24', '60', '365'].includes(num)) {
          issues.push({
            ruleId: 'CC-VAR-003',
            severity: 'error',
            line: index + 1,
            message: `发现魔法数字：${num}`,
            suggestion: `将 ${num} 定义为具名常量，如 const XXX = ${num};`
          });
        }
      });
    }
  });

  // 4. 嵌套深度检查
  let maxNesting = 0;
  let currentNesting = 0;
  let reportedLines = new Set();
  
  lines.forEach((line, index) => {
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    currentNesting += openBraces - closeBraces;
    maxNesting = Math.max(maxNesting, currentNesting);
    
    // 只报告达到阈值的起始行
    if (currentNesting > codeSmells.deepNesting.threshold && !reportedLines.has(currentNesting)) {
      reportedLines.add(currentNesting);
      issues.push({
        ruleId: 'SMELL-004',
        severity: codeSmells.deepNesting.severity,
        line: index + 1,
        message: `嵌套过深 (深度：${currentNesting})`,
        suggestion: '使用提前返回、提取函数等方式减少嵌套'
      });
    }
  });

  // 5. TODO/FIXME 检查
  const todoPattern = /(TODO|FIXME|XXX|HACK)/gi;
  lines.forEach((line, index) => {
    const todos = line.match(todoPattern);
    if (todos) {
      issues.push({
        ruleId: 'COMMENT-001',
        severity: 'info',
        line: index + 1,
        message: `发现待办标记：${todos[0]}`,
        suggestion: '跟踪并解决这些技术债务'
      });
    }
  });

  // 6. 注释率检查
  const commentLines = lines.filter(line => 
    line.trim().startsWith('//') || 
    line.trim().startsWith('#') ||
    line.trim().startsWith('/*') ||
    line.trim().startsWith('*')
  ).length;
  const commentRate = (commentLines / lines.length * 100).toFixed(1);
  
  if (commentRate < 10 && lines.length > 50) {
    issues.push({
      ruleId: 'COMMENT-002',
      severity: 'warning',
      line: 1,
      message: `注释率过低 (${commentRate}%)`,
      suggestion: '添加必要的注释说明复杂逻辑'
    });
  }

  return {
    lines: lines.length,
    issues,
    metrics: {
      commentRate: parseFloat(commentRate),
      maxNesting,
      hasMagicNumbers: issues.some(i => i.ruleId === 'CC-VAR-003')
    }
  };
}

/**
 * Java 特定检查
 */
function checkJava(content, filePath) {
  const lines = content.split('\n');
  const issues = [];

  // 1. 类名检查（应该大驼峰）
  const classPattern = /(?:public\s+)?class\s+(\w+)/g;
  let match;
  while ((match = classPattern.exec(content)) !== null) {
    const className = match[1];
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
      issues.push({
        ruleId: 'ALI-P3C-003',
        severity: 'error',
        line: content.substring(0, match.index).split('\n').length,
        message: `类名 '${className}' 不符合大驼峰命名规范`,
        suggestion: '使用 UpperCamelCase 风格，如 UserService'
      });
    }
  }

  // 2. 方法名检查（应该小驼峰）
  const methodPattern = /(?:public|private|protected)\s+\w+\s+(\w+)\s*\(/g;
  while ((match = methodPattern.exec(content)) !== null) {
    const methodName = match[1];
    if (!/^[a-z][a-zA-Z0-9]*$/.test(methodName) && 
        !methodName.startsWith('get') && 
        !methodName.startsWith('set') &&
        !methodName.startsWith('is')) {
      // 跳过 getter/setter 和构造函数
      if (methodName !== className) {
        issues.push({
          ruleId: 'ALI-P3C-004',
          severity: 'error',
          line: content.substring(0, match.index).split('\n').length,
          message: `方法名 '${methodName}' 不符合小驼峰命名规范`,
          suggestion: '使用 lowerCamelCase 风格，如 getUserInfo'
        });
      }
    }
  }

  // 3. 常量检查（应该全大写）
  const constPattern = /(?:public\s+)?(?:static\s+)?(?:final\s+)?\w+\s+(\w+)\s*=\s*[^;]+;/g;
  while ((match = constPattern.exec(content)) !== null) {
    const constName = match[1];
    if (constName === constName.toUpperCase() && constName.includes('_')) {
      // 符合规范的常量
    } else if (/^[A-Z][A-Z0-9_]*$/.test(constName)) {
      // 全大写，符合
    } else if (content.substring(0, match.index).match(/final\s+/)) {
      // 是 final 但不是全大写
      issues.push({
        ruleId: 'ALI-P3C-005',
        severity: 'error',
        line: content.substring(0, match.index).split('\n').length,
        message: `常量名 '${constName}' 应该全大写`,
        suggestion: '使用 UPPER_CASE 风格，如 MAX_COUNT'
      });
    }
  }

  // 4. @Override 注解检查
  const overridePattern = /@Override\s+public\s+\w+\s+\w+\s*\(/g;
  const hasOverride = content.includes('@Override');
  
  // 5. equals 和 hashCode 检查
  const hasEquals = content.includes('equals(');
  const hasHashcode = content.includes('hashCode()');
  if (hasEquals && !hasHashcode) {
    issues.push({
      ruleId: 'ALI-P3C-017',
      severity: 'error',
      line: 1,
      message: '覆写了 equals 方法但没有覆写 hashCode',
      suggestion: '同时覆写 equals 和 hashCode 方法'
    });
  }

  // 6. SimpleDateFormat 线程安全检查
  if (content.includes('SimpleDateFormat') && content.includes('static')) {
    issues.push({
      ruleId: 'ALI-P3C-021',
      severity: 'error',
      line: 1,
      message: 'SimpleDateFormat 是线程不安全的，不应定义为 static',
      suggestion: '每次使用时 new 实例，或使用 DateTimeFormatter'
    });
  }

  // 7. 大括号检查
  const controlPattern = /(if|else|for|while)\s*\([^)]+\)\s*\n\s*[^\s{]/g;
  while ((match = controlPattern.exec(content)) !== null) {
    issues.push({
      ruleId: 'ALI-P3C-024',
      severity: 'error',
      line: content.substring(0, match.index).split('\n').length,
      message: '控制语句缺少大括号',
      suggestion: '即使只有一行代码也应该使用大括号'
    });
  }

  return issues;
}

/**
 * JavaScript/TypeScript 特定检查
 */
function checkJavaScript(content, filePath) {
  const lines = content.split('\n');
  const issues = [];

  // 1. var 使用检查（应该用 let/const）
  lines.forEach((line, index) => {
    if (/\bvar\s+\w+/.test(line)) {
      issues.push({
        ruleId: 'CC-JS-001',
        severity: 'warning',
        line: index + 1,
        message: '使用 var 声明变量',
        suggestion: '使用 const 或 let 替代 var'
      });
    }
  });

  // 2. == 检查（应该用 ===）
  lines.forEach((line, index) => {
    if (/\b[^=!]==[^=]/.test(line) && !line.includes('===')) {
      issues.push({
        ruleId: 'CC-JS-002',
        severity: 'warning',
        line: index + 1,
        message: '使用 == 进行相等性比较',
        suggestion: '使用 === 进行严格相等比较'
      });
    }
  });

  // 3. console.log 检查（生产环境应该移除）
  lines.forEach((line, index) => {
    if (/console\.(log|debug|info)/.test(line)) {
      issues.push({
        ruleId: 'CC-JS-003',
        severity: 'info',
        line: index + 1,
        message: '发现 console.log 语句',
        suggestion: '生产环境应该移除或使用日志库'
      });
    }
  });

  // 4. 箭头函数检查
  const arrowFuncPattern = /\([^)]*\)\s*=>\s*{/g;
  let match;
  while ((match = arrowFuncPattern.exec(content)) !== null) {
    const params = match[0].match(/\(([^)]*)\)/)[1];
    if (params && params.split(',').length > 3) {
      issues.push({
        ruleId: 'CC-FUNC-001',
        severity: 'warning',
        line: content.substring(0, match.index).split('\n').length,
        message: '箭头函数参数过多',
        suggestion: '考虑使用对象参数或拆分函数'
      });
    }
  }

  return issues;
}

/**
 * Python 特定检查
 */
function checkPython(content, filePath) {
  const lines = content.split('\n');
  const issues = [];

  // 1. 检查裸露的 except
  if (content.match(/\bexcept\s*:/)) {
    issues.push({
      ruleId: 'PY-CLEAN-005',
      severity: 'error',
      line: 1,
      message: '使用裸露的 except，会捕获所有异常',
      suggestion: '捕获具体异常类型，如 except ValueError:'
    });
  }

  // 2. 检查 eval/exec 使用
  if (content.match(/\b(eval|exec)\s*\(/)) {
    issues.push({
      ruleId: 'PY-SECURITY-001',
      severity: 'error',
      line: 1,
      message: '使用 eval/exec，存在安全风险',
      suggestion: '使用 ast.literal_eval 或替代方案'
    });
  }

  // 3. 检查可变默认参数
  const mutableDefaultPattern = /def\s+\w+\s*\([^)]*=\s*(\[\]|\{\})\s*:/g;
  if (content.match(mutableDefaultPattern)) {
    issues.push({
      ruleId: 'PY-CLEAN-008',
      severity: 'error',
      line: 1,
      message: '使用可变默认参数',
      suggestion: '使用 None 作为默认值，如 def func(param=None):'
    });
  }

  // 4. 检查类型提示
  const funcDefPattern = /def\s+\w+\s*\([^)]*\)\s*:/g;
  let match;
  let funcCount = 0;
  let typedCount = 0;
  while ((match = funcDefPattern.exec(content)) !== null) {
    funcCount++;
    const funcLine = content.substring(match.index).split('\n')[0];
    if (funcLine.includes('->') || funcLine.match(/\w+\s*:\s*\w+/)) {
      typedCount++;
    }
  }
  if (funcCount > 0 && typedCount / funcCount < 0.5) {
    issues.push({
      ruleId: 'PY-CLEAN-004',
      severity: 'warning',
      line: 1,
      message: `类型提示覆盖率低 (${(typedCount/funcCount*100).toFixed(0)}%)`,
      suggestion: '为函数添加类型提示'
    });
  }

  // 5. 检查 with 语句使用（文件操作）
  if (content.match(/\bopen\s*\(/) && !content.match(/\bwith\s+open\s*\(/)) {
    issues.push({
      ruleId: 'PY-CLEAN-006',
      severity: 'warning',
      line: 1,
      message: '文件操作未使用上下文管理器',
      suggestion: '使用 with open(...) as f:'
    });
  }

  // 6. 检查 docstring
  const publicFuncPattern = /def\s+[a-z]\w*\s*\(/g;
  let publicFuncs = 0;
  let withDocstring = 0;
  while ((match = publicFuncPattern.exec(content)) !== null) {
    if (!match[0].startsWith('_')) {
      publicFuncs++;
      const afterDef = content.substring(match.index);
      if (afterDef.match(/"""/) || afterDef.match(/'''/)) {
        withDocstring++;
      }
    }
  }

  return issues;
}

/**
 * Go 特定检查
 */
function checkGo(content, filePath) {
  const lines = content.split('\n');
  const issues = [];

  // 1. 检查错误忽略
  if (content.match(/_\s*,\s*err\s*:=/)) {
    issues.push({
      ruleId: 'GO-ERROR-001',
      severity: 'error',
      line: 1,
      message: '忽略错误返回值',
      suggestion: '处理错误或明确记录为什么忽略'
    });
  }

  // 2. 检查 panic 使用
  if (content.match(/\bpanic\s*\(/)) {
    issues.push({
      ruleId: 'GO-ERROR-005',
      severity: 'warning',
      line: 1,
      message: '使用 panic',
      suggestion: '使用 error 返回值而非 panic（除非不可恢复）'
    });
  }

  // 3. 检查 defer 在循环中
  const loopPattern = /(for|range)\s*[^{]*\{[^}]*defer/gs;
  if (content.match(loopPattern)) {
    issues.push({
      ruleId: 'GO-DEFER-002',
      severity: 'error',
      line: 1,
      message: '在循环中使用 defer',
      suggestion: '在循环内使用函数包装 defer'
    });
  }

  // 4. 检查 goroutine 泄漏风险
  if (content.match(/\bgo\s+\w+\s*\(/) && !content.match(/\bcontext\.Context\b/)) {
    issues.push({
      ruleId: 'GO-CONCURRENCY-002',
      severity: 'warning',
      line: 1,
      message: 'goroutine 未使用 context 控制',
      suggestion: '使用 context 控制 goroutine 生命周期'
    });
  }

  // 5. 检查 map 并发安全
  if (content.match(/\bmap\[.*\].*=/) && content.match(/\bgo\s/)) {
    issues.push({
      ruleId: 'GO-MAP-001',
      severity: 'warning',
      line: 1,
      message: 'map 在并发环境中使用',
      suggestion: '使用 sync.Map 或加锁保护'
    });
  }

  // 6. 检查导出标识符注释
  const exportedPattern = /^(func|type|const|var)\s+([A-Z]\w*)/gm;
  let match;
  while ((match = exportedPattern.exec(content)) !== null) {
    const beforeMatch = content.substring(0, match.index);
    const lastLines = beforeMatch.split('\n').slice(-3).join('\n');
    if (!lastLines.match(/\/\/\s*\w+/)) {
      issues.push({
        ruleId: 'GO-DOC-001',
        severity: 'warning',
        line: beforeMatch.split('\n').length,
        message: `导出的 ${match[1]} ${match[2]} 缺少注释`,
        suggestion: '添加文档注释'
      });
    }
  }

  return issues;
}

/**
 * 计算总体评分
 */
function calculateScore(issues, metrics) {
  let score = 100;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'error':
        score -= 10;
        break;
      case 'warning':
        score -= 5;
        break;
      case 'info':
        score -= 1;
        break;
    }
  });

  // 注释率奖励
  if (metrics.commentRate >= 15 && metrics.commentRate <= 30) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * 生成审查报告
 */
function generateReport(filePath, content, issues, metrics, options) {
  const lang = detectLanguage(filePath);
  const score = calculateScore(issues, metrics);
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  const stars = '⭐'.repeat(Math.ceil(score / 20));

  console.log('\n' + '='.repeat(60));
  console.log('📋 代码审查报告');
  console.log('='.repeat(60));
  console.log(`\n📁 文件：${path.basename(filePath)}`);
  console.log(`🌐 语言：${lang.toUpperCase()}`);
  console.log(`📏 行数：${metrics.lines}`);
  console.log(`📊 评分：${score}/100 ${stars}`);
  console.log(`\n📈 统计:`);
  console.log(`   ❌ 错误：${errorCount}`);
  console.log(`   ⚠️  警告：${warningCount}`);
  console.log(`   ℹ️  提示：${infoCount}`);

  if (options.verbose) {
    console.log(`\n📊 详细指标:`);
    console.log(`   注释率：${metrics.commentRate}%`);
    console.log(`   最大嵌套：${metrics.maxNesting}`);
    console.log(`   魔法数字：${metrics.hasMagicNumbers ? '存在' : '无'}`);
  }

  // 按严重程度分组问题
  const grouped = {
    error: issues.filter(i => i.severity === 'error'),
    warning: issues.filter(i => i.severity === 'warning'),
    info: issues.filter(i => i.severity === 'info')
  };

  if (grouped.error.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ 严重问题');
    console.log('='.repeat(60));
    grouped.error.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.ruleId}] 第 ${issue.line} 行`);
      console.log(`   ${issue.message}`);
      console.log(`   💡 建议：${issue.suggestion}`);
    });
  }

  if (grouped.warning.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  需要改进');
    console.log('='.repeat(60));
    grouped.warning.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.ruleId}] 第 ${issue.line} 行`);
      console.log(`   ${issue.message}`);
      console.log(`   💡 建议：${issue.suggestion}`);
    });
  }

  if (grouped.info.length > 0 && options.verbose) {
    console.log('\n' + '='.repeat(60));
    console.log('ℹ️  提示信息');
    console.log('='.repeat(60));
    grouped.info.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. [${issue.ruleId}] 第 ${issue.line} 行`);
      console.log(`   ${issue.message}`);
    });
  }

  // 总体建议
  console.log('\n' + '='.repeat(60));
  console.log('📝 总体建议');
  console.log('='.repeat(60));
  
  if (score >= 90) {
    console.log('\n✅ 代码质量优秀！继续保持！');
  } else if (score >= 70) {
    console.log('\n👍 代码质量良好，建议修复上述问题。');
  } else if (score >= 50) {
    console.log('\n⚠️  代码质量一般，建议进行重构。');
  } else {
    console.log('\n🚨 代码质量较差，建议全面审查和重构。');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  return { score, issues, metrics };
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
📋 Code Reviewer - 代码审查工具

使用方法:
  node review.mjs <文件路径> [选项]

选项:
  --lang <语言>     指定语言 (java/js/ts/py)
  --verbose         详细输出
  --report          生成完整报告
  --ci             CI/CD 模式（返回非零退出码）
  --recursive      递归检查目录
  --help, -h       显示帮助

示例:
  node review.mjs ./src/UserService.java
  node review.mjs ./src --recursive --report
  node review.mjs ./app.js --lang javascript --verbose
`);
    process.exit(0);
  }

  const options = parseArgs(args);
  const filePath = options.file;

  if (!filePath) {
    console.error('❌ 请指定文件路径');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在：${filePath}`);
    process.exit(1);
  }

  console.log(`\n🔍 正在审查：${filePath}`);

  // 递归检查目录
  if (options.recursive && fs.statSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath)
      .filter(f => /\.(java|js|ts|py|go|rs|cpp|c)$/.test(f))
      .map(f => path.join(filePath, f));
    
    console.log(`📂 发现 ${files.length} 个源文件`);
    
    let totalIssues = 0;
    let totalScore = 0;
    
    for (const file of files) {
      const result = await reviewFile(file, options);
      totalIssues += result.issues.length;
      totalScore += result.score;
    }
    
    console.log(`\n📊 汇总:`);
    console.log(`   文件数：${files.length}`);
    console.log(`   总问题数：${totalIssues}`);
    console.log(`   平均评分：${(totalScore / files.length).toFixed(1)}/100`);
    
    if (options.ci && totalIssues > 0) {
      process.exit(1);
    }
    return;
  }

  const result = await reviewFile(filePath, options);

  if (options.ci && result.issues.filter(i => i.severity === 'error').length > 0) {
    process.exit(1);
  }
}

/**
 * 审查单个文件
 */
async function reviewFile(filePath, options) {
  const content = readFile(filePath);
  const lang = options.lang === 'auto' ? detectLanguage(filePath) : options.lang;

  // 基础分析
  const analysis = analyzeCode(content, filePath);
  let issues = analysis.issues;

  // 语言特定检查
  if (lang === 'java') {
    issues = [...issues, ...checkJava(content, filePath)];
  } else if (lang === 'javascript' || lang === 'typescript') {
    issues = [...issues, ...checkJavaScript(content, filePath)];
  } else if (lang === 'python') {
    issues = [...issues, ...checkPython(content, filePath)];
  } else if (lang === 'go') {
    issues = [...issues, ...checkGo(content, filePath)];
  }

  // 生成报告
  const result = generateReport(filePath, content, issues, analysis.metrics, options);

  return result;
}

// 运行
main().catch(error => {
  console.error('❌ 审查过程出错:', error);
  process.exit(1);
});
