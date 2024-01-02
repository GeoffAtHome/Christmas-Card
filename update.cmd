rem To publish update the base path in: index.html
call npm run build
copy web.config .\dist
copy manifest.json .\dist
RD /Q "\\EARTH-2019\e$\My Web\xmas"
MD "\\EARTH-2019\e$\My Web\xmas"
xcopy /Y /S /F .\dist "\\EARTH-2019\e$\My Web\xmas"
