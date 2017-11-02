spushd %~dp0\Server\
start "" server-win.exe
popd
start file://%CD%\main.html
