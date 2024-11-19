# Christmas-Card

Christmas card display

# To add a year

1. Create new year folder
2. Create xmas-year.csv
3. Create and add originals (images)
4. Edit `tool/src/index.ts` for correct year
5. Comment out line 137 `await processSizes(cardData, year, sizesFile, destDirFront, destDirBack);`
6. `npm run start:dev`
7. Run `script.cmd` that was created
8. Uncomment out line 137 `await processSizes(cardData, year, sizesFile, destDirFront, destDirBack);`
9. Copy `year.json` and images folder to web server
10. Update `years.ts` to include new year
11. Run update to copy changes to server.

# TODO

Simplify above to.

1. Add new year folder with CSV and Images
2. Run update command
