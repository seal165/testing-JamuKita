# Test runner script for Windows (PowerShell)
# Works with both SQLite (CI/CD) and MySQL (local)

Write-Host "🧪 Setting up test environment..." -ForegroundColor Cyan

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    # Use SQLite in-memory if no DATABASE_URL
    $env:DATABASE_URL = "file::memory:?socket_timeout=10&connection_limit=1"
    Write-Host "✅ Using SQLite in-memory database (CI/CD mode)" -ForegroundColor Green
    
    # Push schema for SQLite
    Write-Host "📦 Pushing database schema..." -ForegroundColor Yellow
    npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma
} else {
    Write-Host "✅ Using configured database: $env:DATABASE_URL" -ForegroundColor Green
    
    # Check if it's MySQL
    if ($env:DATABASE_URL -like "mysql*") {
        Write-Host "📦 Running MySQL migrations..." -ForegroundColor Yellow
        npx prisma migrate deploy
    } else {
        Write-Host "📦 Pushing database schema..." -ForegroundColor Yellow
        npx prisma db push --skip-generate --schema=./prisma/schema.test.prisma
    }
}

# Generate Prisma Client if needed
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Run tests
Write-Host "🚀 Running tests..." -ForegroundColor Cyan
npm test

# Exit with test exit code
exit $LASTEXITCODE
