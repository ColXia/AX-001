#!/bin/bash
# Git追踪安全检查脚本

echo "=== Git追踪安全检查 ==="
echo

# 检查敏感文件
echo "检查敏感文件..."
SENSITIVE=$(git add -A --dry-run 2>&1 | grep -E "\.(pem|key|crt|env|docx|doc|sqlite|log)$")
if [ -n "$SENSITIVE" ]; then
    echo "❌ 发现敏感文件："
    echo "$SENSITIVE"
    exit 1
else
    echo "✅ 未发现敏感文件"
fi
echo

# 检查排除目录
echo "检查排除目录..."
EXCLUDED_DIRS="node_modules dist data runs tmp archive homework submission"
for dir in $EXCLUDED_DIRS; do
    if git add -A --dry-run 2>&1 | grep -q "^$dir/"; then
        echo "❌ $dir/ 目录被包含"
        exit 1
    else
        echo "✅ $dir/ 目录已排除"
    fi
done
echo

# 检查配置文件
echo "检查配置文件..."
if git add -A --dry-run 2>&1 | grep -q "runtime.config.local.json"; then
    echo "❌ 本地配置文件被包含"
    exit 1
else
    echo "✅ 本地配置文件已排除"
fi
echo

# 统计追踪文件
echo "统计追踪文件..."
COUNT=$(git add -A --dry-run 2>&1 | wc -l)
echo "将追踪 $COUNT 个文件"
echo

# 显示主要目录
echo "主要追踪目录："
git add -A --dry-run 2>&1 | sed 's/^add //' | cut -d/ -f1 | sort | uniq -c | sort -rn | head -10
echo

echo "=== 检查完成 ==="
