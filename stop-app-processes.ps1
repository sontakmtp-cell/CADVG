$CurrentPid = [int]$PID

$targets = Get-CimInstance Win32_Process | Where-Object {
  $_.ProcessId -ne $CurrentPid -and (
    (
      $_.Name -match '^(python|python3|pythonw|cmd)\.exe$' -and
      $_.CommandLine -like '*elevator-cad-app*backend*.venv*uvicorn*main:app*'
    ) -or
    (
      $_.Name -match '^(node|cmd)\.exe$' -and (
        $_.CommandLine -like '*elevator-cad-app*frontend*node_modules*vite*' -or
        $_.CommandLine -like '*vite --host 127.0.0.1 --port 5174*'
      )
    )
  )
}

foreach ($target in $targets) {
  Stop-Process -Id $target.ProcessId -Force -ErrorAction SilentlyContinue
}
