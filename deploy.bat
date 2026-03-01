@echo off
setlocal

set "NODE_HOME=C:\Program Files\nodejs"
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ADB=C:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe"
set "APK=C:\Dev\surf-project\android\app\build\outputs\apk\debug\app-debug.apk"
set "PATH=%NODE_HOME%;%JAVA_HOME%\bin;C:\Program Files (x86)\Android\android-sdk\platform-tools;%PATH%"

echo.
echo [1/4] Building web assets...
cd /d C:\Dev\surf-project
call npm run build
if errorlevel 1 ( echo ERROR: Web build failed & exit /b 1 )

echo.
echo [2/4] Syncing to Android...
call npx cap sync android
if errorlevel 1 ( echo ERROR: Capacitor sync failed & exit /b 1 )

echo.
echo [3/4] Building APK...
cd /d C:\Dev\surf-project\android
call gradlew assembleDebug
if errorlevel 1 ( echo ERROR: Gradle build failed & exit /b 1 )

echo.
echo [4/4] Installing on device...
"%ADB%" install -r "%APK%"
if errorlevel 1 ( echo ERROR: ADB install failed. Is your phone connected? & exit /b 1 )

echo.
echo Done! App installed successfully.
