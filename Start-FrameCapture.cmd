@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo FrameCapture needs Node.js installed on this computer.
 pause
 exit /b 1
)
node launch.cjs
if errorlevel 1 pause
