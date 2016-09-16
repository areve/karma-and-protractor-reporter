@echo off
set COMMAND=%1
if "%COMMAND%"=="" set COMMAND=commit
start "" "C:\Program Files\TortoiseGit\bin\TortoiseGitProc.exe" /command:%COMMAND% /path:.