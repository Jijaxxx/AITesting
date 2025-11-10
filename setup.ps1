# Lectio MVP - Quick Setup Script
# Run this after cloning the repository

Write-Host "🚀 Lectio MVP - Installation automatique" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Vérifier Node.js
Write-Host "📦 Vérification Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version
Write-Host "✅ npm: $npmVersion`n" -ForegroundColor Green

# Étape 1: Installer les dépendances root
Write-Host "📦 Étape 1/6: Installation dépendances root..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation root" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances root installées`n" -ForegroundColor Green

# Étape 2: Installer les dépendances server
Write-Host "📦 Étape 2/6: Installation dépendances server..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation server" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Dépendances server installées`n" -ForegroundColor Green

# Étape 3: Installer les dépendances client
Write-Host "📦 Étape 3/6: Installation dépendances client..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation client" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Dépendances client installées`n" -ForegroundColor Green

# Étape 4: Démarrer PostgreSQL (Docker)
Write-Host "🐳 Étape 4/6: Démarrage PostgreSQL (Docker)..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erreur Docker - assurez-vous que Docker Desktop est lancé" -ForegroundColor Red
    Write-Host "   Vous pouvez démarrer PostgreSQL manuellement plus tard avec: docker-compose up -d" -ForegroundColor Yellow
} else {
    Write-Host "✅ PostgreSQL démarré sur localhost:5432`n" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

# Étape 5: Générer Prisma Client
Write-Host "🔧 Étape 5/6: Génération Prisma Client..." -ForegroundColor Yellow
Set-Location server
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération Prisma" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client généré`n" -ForegroundColor Green

# Étape 6: Migrations et seed
Write-Host "🌱 Étape 6/6: Migrations et seed de la base..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors des migrations" -ForegroundColor Red
    exit 1
}

npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du seed" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Base de données initialisée (12 niveaux, 10 compétences)`n" -ForegroundColor Green

# Fin
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Installation terminée avec succès!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🚀 Pour démarrer le projet:" -ForegroundColor Yellow
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "📖 URLs:" -ForegroundColor Yellow
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Health:   http://localhost:3000/health" -ForegroundColor White
Write-Host "   Prisma:   npm run prisma:studio (depuis server/)`n" -ForegroundColor White

Write-Host "📚 Consultez SETUP.md pour plus de détails" -ForegroundColor Cyan
