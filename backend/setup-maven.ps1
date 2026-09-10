$tools = Join-Path $PSScriptRoot "tools"
New-Item -ItemType Directory -Force -Path $tools | Out-Null
$zip = Join-Path $tools "maven.zip"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Write-Host "Downloading Maven..."
Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip" -OutFile $zip
Write-Host "Extracting Maven..."
Expand-Archive -Path $zip -DestinationPath $tools -Force
Remove-Item $zip
Write-Host "Maven ready!"
