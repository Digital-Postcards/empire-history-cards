'use strict'

const path = require("path");
const {
  writeFileSync,
  readFileSync,
  readdirSync,
  createReadStream,
} = require("fs");
const { spawnSync } = require("child_process");
const readLine = require('readline');

const writeToJSON = (fileName, array) => {
    writeFileSync(fileName + ".json", JSON.stringify(array, null, 2), "utf-8");
}

const readFromJSON = (fileName) => {
    return JSON.parse(readFileSync(fileName + ".json"));
}

const createLineReader = (filePath) => {
    return readLine.createInterface(
        {input: createReadStream(filePath), output: process.stdout, terminal: false});
}

const createPostmarkedFileData = async () => {
    let postmarkedFiles = [];
    const files = readdirSync(process.env.LOCAL_MD_DIRECTORY);
    for (let file of files) {
        var lines = createLineReader(path.resolve(__dirname, "../", process.env.LOCAL_MD_DIRECTORY, file));

        for await (const line of lines) {
            let isPostmarked = false;
            if (line.trim().toLowerCase().startsWith("postmarked")) {
                isPostmarked = line.split(":")[1]
                    .slice(0, 4) // since the line can begin with => 'Postmarked: Yes' or 'Postmarked:Yes'
                    .trim().toLowerCase() === "yes";
            }
            if (isPostmarked) {
                let postmarkedFileData = {
                    fileName: file,
                    path: path.resolve(__dirname, "../", process.env.LOCAL_MD_DIRECTORY, file),
                    postmark: line.trim()
                }
                postmarkedFiles.push(postmarkedFileData);
            }
        }
    }
    writeToJSON("postmarkedFiles", postmarkedFiles);
}

const createMessageData = async () => {
    let messageJSON = [];
    const data = readFromJSON("postmarkedFiles");
    for (let file of data) {
        let fileContent = readFileSync(file.path);
        var lines = createLineReader(file.path);
        
        for await (const line of lines) {
            if (line.trim().toLowerCase().startsWith("message")) {
                const newMessage = {
                    name: file.fileName,
                    path: file.path,
                    message: fileContent.subarray(fileContent.indexOf(line)).toString(),
                    postmark: file.postmark
                };
                messageJSON.push(newMessage);
            }
        }
    }
    writeToJSON("messages", messageJSON);
}

const extractLocation = () => {
    const messages = readFromJSON("messages");
    let locationJSON = [];
    for (let message of messages) {
        console.log("\nExtracting possible locations from " + message.name + "...");
        const data = spawnSync("python", ["../python/location_extractor.py", message.message ]);
        let output = data.stdout.toString();
        if (output !== "") {
            output = output.replace("\n", "");
            output = output.replaceAll("'", "\"");
            output = JSON.parse(output)
        }
        const locationData = {
            fileName: message.name,
            path: message.path,
            postMark: message.postmark,
            possibleLocations: output.trim()
        }
        locationJSON.push(locationData);
    }
    writeToJSON("extractedLocations", locationJSON);
}

const parseTranscript = async () => {
    await createPostmarkedFileData();
    console.log("\nFiltered postmarked files...");
    await createMessageData();
    console.log("Created message data file from postmarked files...");
    extractLocation();
    console.log("\nDone.");
}

module.exports = parseTranscript;