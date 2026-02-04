#!/bin/bash
echo "🔧 Testing KNOUX Player X Automation"
echo "====================================="

# Test 1: Check dependencies
echo "1. Checking dependencies..."
npm list @octokit/rest simple-git 2>/dev/null || echo "  ⚠️ Some deps missing"

# Test 2: TypeScript compilation
echo "2. TypeScript compilation..."
npx tsc --noEmit 2>&1 | head -20

# Test 3: Check auto-pr agent structure
echo "3. Auto-PR agent structure..."
if [ -f "knoux-autopr-agent.ts" ]; then
    echo "  ✅ Agent file exists"
    LINES=$(wc -l < knoux-autopr-agent.ts)
    echo "  📄 Lines: $LINES"
else
    echo "  ❌ Agent file missing"
fi
if [ -f "knoux-auto-pr-launch.ts" ]; then
    echo "  ✅ Launch file exists"
    LINES=$(wc -l < knoux-auto-pr-launch.ts)
    echo "  📄 Lines: $LINES"
else
    echo "  ❌ Launch file missing"
fi

# Test 4: GitHub workflows check
echo "4. GitHub workflows..."
ls -la .github/workflows/ 2>/dev/null || echo "  ⚠️ No workflows directory"

echo "✅ Test completed"
