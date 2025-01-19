import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import readline from 'readline';

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r1.question('Please enter the directory path: ', async (directoryPath) => {
    try {
        let directoryFiles = await fsp.readdir(directoryPath);

        for (const fileName of directoryFiles) {
            let fileParts = fileName.split(".");
            if (fileParts.length > 1) {
                let fileExtension = fileParts[fileParts.length - 1];
                let extensionFolderPath = path.join(directoryPath, fileExtension);

                if (!fs.existsSync(extensionFolderPath)) {
                    fs.mkdirSync(extensionFolderPath);
                }

                await fsp.rename(
                    path.join(directoryPath, fileName),
                    path.join(extensionFolderPath, fileName)
                );

                fs.appendFileSync(
                    'summary.txt',
                    `The file ${fileName} is added to the folder ${fileExtension}\n`
                );
            }
        }

        console.log('Files have been organized successfully.');
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        r1.close();
    }
});
