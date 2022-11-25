import { Octokit } from "@octokit/core";
import getBodyText from "./get-body-text.js";
import getCommandLineArgs from "./get-command-line-args.js";
import readConfigFile from "./read-config-file.js";

console.log('reading config file ...');
const configvars = readConfigFile();
console.log('done.');

console.log('reading command line args ...');
const args = getCommandLineArgs();
const branch = args[0];
console.log('done.');

console.log('getting body PR text ...');
const bodytext = getBodyText(configvars);
console.log('done.');

console.log('creating pr...');
const octokit = new Octokit({ auth: configvars.get('token') }),
        owner = configvars.get('owner'),
         repo = configvars.get('repo'),
        title = `[${branch || 'PR'}]`,
        body  = `${bodytext}`,
        head  = `${branch}`,
        base  = configvars.get('base');
try {
    const response = await octokit.request(
        `POST /repos/{owner}/{repo}/pulls`, { owner, repo, title, body, head, base }
    );
    console.log('done. Go to: ' + response.data.html_url);
} catch(e) {
    console.log('failed. Response ' + e.message);
}

