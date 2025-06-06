import { INSERT_ICONS } from '../templates';
import { ICallbackCommand } from '../types';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { format } from 'prettier';
import resolve from 'resolve';
import { window } from 'vscode';

// Finds the last import statement and extracts the "from" path
function getLastImportInfo(lines: string[]): { line: number; fromPath: string | null } {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(/^\s*import(?:.+?)?from\s+['"](.+?)['"]/);
    if (match) {
      return { line: i, fromPath: match[1] };
    }
  }
  return { line: -1, fromPath: null };
}

// Builds the import statement for the new icon
function buildNewImport(iconName: string, importPath: string) {
  return `import { ${iconName} } from '${importPath}/${iconName}';`;
}

// Inserts the icon name into the export array if not already present
function insertIconInExportArray(code: string, iconName: string): string {
  const arrayRegex = /(export\s+const\s+\w+\s*(?::\s*[^=]+)?=\s*\[)([\s\S]*?)(\])/m;

  return code.replace(arrayRegex, (_, start, content, end) => {
    const trimmed: string = content.trim();
    const icons = trimmed ? trimmed.split(',').map(s => s.trim()) : [];

    if (icons.includes(iconName)) return `${start}${content}${end}`;

    const newContent = trimmed && !trimmed.endsWith(',') ? `${content}, ${iconName}` : `${content}${iconName}`;
    return `${start}${newContent}${end}`;
  });
}

// Main function that inserts the icon import and updates the export array
function insertIcons(props: ICallbackCommand & { iconName: string }) {
  const { path, iconName } = props;
  const files = readdirSync(path).map(name => join(path, name));

  for (const file of files) {
    const rawData = readFileSync(file, 'utf8');
    const lines = rawData.split('\n');

    const { line: lastImportLine, fromPath } = getLastImportInfo(lines);
    if (!fromPath) continue;

    const matchedLibrary = INSERT_ICONS.LIBRARIES_NAME.find(lib => fromPath.includes(lib));
    if (!matchedLibrary) continue;

    const importPath = `${matchedLibrary}/${iconName}`;

    try {
      // Ensure the icon module exists
      resolve.sync(importPath, { basedir: path });
    } catch {
      const fileName = basename(file);
      window.showWarningMessage(`Icon ${iconName} not found in file ${fileName}`);
      continue; // Skip file if the module doesn't exist
    }

    const newImportStatement = buildNewImport(iconName, matchedLibrary);

    // Avoid inserting duplicate imports
    if (lines.includes(newImportStatement)) continue;

    // Insert the import after the last existing import
    lines.splice(lastImportLine + 1, 0, newImportStatement);

    // Update the export array with the new icon
    const updatedCode = insertIconInExportArray(lines.join('\n'), iconName);

    // Format the final code using Prettier
    const formatted = format(updatedCode, {
      semi: true,
      tabWidth: 2,
      quoteProps: 'preserve',
    });

    writeFileSync(file, formatted, 'utf8');
  }
}

export default insertIcons;
