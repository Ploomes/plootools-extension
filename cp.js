const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, 'out');

const foldersToCopy = [
  'snippets',
  'assets'
].map((folder)=> path.resolve(__dirname, 'src', folder));

for(const folder of foldersToCopy) {
  fs.cpSync(
    folder,
    path.resolve(dist, path.basename(folder)),
    {
      recursive: true,
      force: true
    }
  );
}