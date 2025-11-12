param(
  [Parameter(Mandatory=$true)]
  [string]$RemoteUrl,
  [string]$Branch = 'main'
)

function Exec($cmd) {
  Write-Host "-> $cmd"
  $r = & cmd /c $cmd
  if ($LASTEXITCODE -ne 0) { throw "Command failed: $cmd`n$r" }
  return $r
}

# Check git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Write-Error 'git is not installed or not in PATH'; exit 1 }

# Confirm repo root
$root = (git rev-parse --show-toplevel) 2>$null
if (-not $root) { Write-Error 'Not a git repository (run from repo root)'; exit 1 }
Write-Host "Repo root: $root"

# Check existing remotes
$existing = (git remote -v) -join "`n"
Write-Host "Existing remotes:\n$existing"

# Add remote if not present
$origin = git remote get-url origin 2>$null
if ($?) {
  Write-Host 'Remote "origin" already exists.'
  $confirm = Read-Host "Do you want to overwrite it with $RemoteUrl? (yes/no)"
  if ($confirm -ne 'yes') { Write-Host 'Aborting.'; exit 0 }
  git remote remove origin
}

git remote add origin $RemoteUrl

# Stage and commit
git add -A
if (-not (git rev-parse --verify HEAD 2>$null)) {
  git commit -m "chore: initial commit"
} else {
  if (-not (git diff --cached --quiet)) {
    git commit -m "chore: update project"
  } else {
    Write-Host 'No changes to commit.'
  }
}

# Push
git push -u origin $Branch --force

Write-Host "Pushed to $RemoteUrl. Next: import the repo in Vercel and set project root to 'client' for the frontend."