@echo off
cd /d "%~dp0"

call npm.cmd install
pause
call npm.cmd install @supabase/supabase-js
pause
