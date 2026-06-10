#!/bin/bash

# Test runner script that works with both SQLite (CI/CD) and MySQL (local)

echo "🧪 Setting up test environment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  # Use SQLite in-memory if no DATABASE_URL
  export DATABASE_URL="file::memory:?socket_timeout=10&connection_limit=1"
  echo "✅ Using SQLite in-memory database (CI/CD mode)"
  
  # Push schema for SQLite
  echo "📦 Pushing database schema..."
  npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma
else
  echo "✅ Using configured database: ${DATABASE_URL}"
  
  # Check if it's MySQL
  if [[ $DATABASE_URL == mysql* ]]; then
    echo "📦 Running MySQL migrations..."
    npx prisma migrate deploy
  else
    echo "📦 Pushing database schema..."
    npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma
  fi
fi

# Generate Prisma Client if needed
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run tests
echo "🚀 Running tests..."
npm test

# Exit with test exit code
exit $?
