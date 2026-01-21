#!/bin/bash

# Script to check for hardcoded sensitive data in source code
# This script looks for actual hardcoded values, not variable names or type definitions

set -e

echo "Checking for sensitive data in code..."

FOUND_ISSUES=0

# Function to check for hardcoded passwords
check_hardcoded_passwords() {
  echo "Checking for hardcoded passwords..."
  
  # Look for password assignments with actual string values (not empty, not variables)
  # Exclude: type definitions, interface properties, empty strings, variable references
  while IFS= read -r line; do
    # Skip if it's a comment
    if echo "$line" | grep -qE '^\s*(//|/\*|\*)'; then
      continue
    fi
    
    # Skip console.log statements (they're just informational messages)
    if echo "$line" | grep -qE 'console\.(log|info|warn|error)'; then
      continue
    fi
    
    # Skip if it's a type definition or interface
    if echo "$line" | grep -qE '(interface|type|Record<|keyof|typeof|as keyof)'; then
      continue
    fi
    
    # Skip if it's using process.env or environment variables
    if echo "$line" | grep -qE 'process\.env|JWT_SECRET|JWT_REFRESH_SECRET'; then
      continue
    fi
    
    # Skip if it's an empty string or variable reference
    if echo "$line" | grep -qE '(password\s*[:=]\s*["'"'"']?["'"'"']?\s*[,;)]|password\s*[:=]\s*\$|password\s*[:=]\s*req\.|password\s*[:=]\s*hashed|password\s*[:=]\s*await|password\s*[:=]\s*user\.|password\s*[:=]\s*email)'; then
      continue
    fi
    
    # Skip if it's mock/test data (check for mock/test in the line or nearby context)
    if echo "$line" | grep -qiE '(mock|test|example|sample|dummy|placeholder)'; then
      continue
    fi
    
    # Get file path and check function/class context
    file_path=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    # Check if it's in a mock/test function (look at 5 lines before)
    if [ -f "$file_path" ] && [ "$line_num" -gt 5 ]; then
      context_start=$((line_num - 5))
      context=$(sed -n "${context_start},${line_num}p" "$file_path" 2>/dev/null | grep -iE '(mock|test|getMock|useMock)' || true)
      if [ -n "$context" ]; then
        continue
      fi
    fi
    
    # If we get here and it matches password: "value" or password = "value" with actual content
    if echo "$line" | grep -qE 'password\s*[:=]\s*["'"'"'][^"'"'"']{3,}'; then
      echo "⚠️  Found potential hardcoded password: $line"
      FOUND_ISSUES=1
    fi
  done < <(grep -rnE 'password\s*[:=]' --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ || true)
}

# Function to check for hardcoded secrets/API keys
check_hardcoded_secrets() {
  echo "Checking for hardcoded secrets and API keys..."
  
  # Look for common secret patterns with actual values
  # Only check for specific patterns like apiKey, secretKey, accessToken, privateKey (not just "key")
  while IFS= read -r line; do
    # Skip comments
    if echo "$line" | grep -qE '^\s*(//|/\*|\*)'; then
      continue
    fi
    
    # Skip console.log statements
    if echo "$line" | grep -qE 'console\.(log|info|warn|error)'; then
      continue
    fi
    
    # Skip if using environment variables
    if echo "$line" | grep -qE 'process\.env|\.env'; then
      continue
    fi
    
    # Skip type definitions
    if echo "$line" | grep -qE '(interface|type|Record<|keyof|typeof|as keyof)'; then
      continue
    fi
    
    # Skip object key access patterns like store[key], obj[key], etc.
    if echo "$line" | grep -qE '\[["'"'"']?key["'"'"']?\]|\[key\]|for.*key in|const key =|let key =|var key ='; then
      continue
    fi
    
    # Only check for actual API key/secret patterns with hardcoded values (at least 10 characters)
    # Pattern must be: apiKey, secretKey, accessToken, privateKey (not just "key")
    if echo "$line" | grep -qE '(api[_-]?key|secret[_-]?key|access[_-]?token|private[_-]?key)\s*[:=]\s*["'"'"'][a-zA-Z0-9+/=]{10,}'; then
      echo "⚠️  Found potential hardcoded secret: $line"
      FOUND_ISSUES=1
    fi
  done < <(grep -rnE '(api[_-]?key|secret[_-]?key|access[_-]?token|private[_-]?key)\s*[:=]' --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ || true)
}

# Run checks
check_hardcoded_passwords
check_hardcoded_secrets

# Exit with error if issues found
if [ $FOUND_ISSUES -eq 1 ]; then
  echo ""
  echo "❌ Sensitive data check failed!"
  echo "Please remove any hardcoded passwords, secrets, or API keys from the code."
  echo "Use environment variables instead (process.env.VARIABLE_NAME)."
  exit 1
fi

echo "✅ No sensitive data found"
