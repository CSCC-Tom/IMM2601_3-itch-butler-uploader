// This uses child_process to run Butler
// https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
var path = require("path");
var execFile = require("child_process").execFile;

// NodeJS application that
// butler push mygame user/mygame:win32 --userversion 1.1.0(-final)
// See README for version number construction details

// EXAMPLE projectstart = new Date(2022, 8, 28, 13, 0, 0, 0).valueOf();
// This would be 2022 September 28, 1:00:00.000 PM

// DAYLIGHT SAVINGS TIME adjustment. Noon = 1:00 after the time change.
const projectstart = new Date(2026, 9, 28, 0, 0, 0, 0).valueOf();
/** How many weeks for prototyping? Appends '-proto' on the version number until that point. */
const planningweeks = 1;
/** How many weeks for production? Appends '-alpha' on the version number until that point. */
const productionweeks = 4;
/** How many weeks for polish? Appends '-beta' on the version number until that point, '-final' afterward. */
const polishweeks = 1;

const username = "cscc-mini-projects";

// ATTENTION BUILD MANAGER: YOU MAY NEED TO MODIFY THESE LINES FOR YOUR GAME
// ESPECIALLY IF YOU CHANGE THE GAME URL ON itch.io
const gamename = "game-url-stub-goes-here";
// END OF ATTENTION BLOCK

function CurrentVersionString() {
  const now = Date.now();
  var msLeft = now - projectstart;
  const msPerMinute = 1000 * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const fullWeeks = Math.floor(msLeft / msPerWeek).toString(10);
  msLeft -= fullWeeks * msPerWeek;
  const fullDays = Math.floor(msLeft / msPerDay).toString(10);
  msLeft -= fullDays * msPerDay;
  const fullHours = Math.floor(msLeft / msPerHour)
    .toString(10)
    .padStart(2, "0");
  msLeft -= fullHours * msPerHour;
  const fullMinutes = Math.floor(msLeft / msPerMinute)
    .toString(10)
    .padStart(2, "0");
  const base_string = `1.${fullWeeks}.${fullDays}${fullHours}${fullMinutes}`;
  if (fullWeeks < planningweeks) {
    return base_string + "-proto";
  } else if (fullWeeks < planningweeks + productionweeks) {
    return base_string + "-alpha";
  } else if (fullWeeks < planningweeks + productionweeks + polishweeks) {
    return base_string + "-beta";
  }
  return base_string + "-final";
}

function UploadTeamGame(
  uploading_platform,
  target_platform,
  version_string,
  cb,
) {
  const butler_command_file = `./butler/versions/15.32.0/${uploading_platform}/butler.exe`;
  var exePath = path.resolve(__dirname, butler_command_file);
  const butler_command_args = [
    "push",
    target_platform,
    `${username}/${gamename}:${target_platform}`,
    `--userversion`,
    version_string,
  ];
  //const butler_command = `/butler/versions/15.32.0/win/butler.exe push ${platform} ${username}/${gamename}:${platform} --userversion ${version_string}`;
  console.log(`RUNNING ${exePath} ${JSON.stringify(butler_command_args)}`);
  execFile(exePath, butler_command_args, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      console.log(`ran from ${exePath}`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(
      `stderr (included for information only; run was successful): ${stderr}`,
    );
    console.log(`FINISHED ${JSON.stringify(butler_command_args)}\n\n`);
    cb(uploading_platform, version_string);
  });
}
function AllDone(uploading_platform, version_string) {
  console.log(
    `\nWoo! All done uploading ${gamename} version ${version_string} from your ${uploading_platform} machine!`,
  );
}
function ButlerUploadLinux(uploading_platform, version_string) {
  UploadTeamGame(uploading_platform, "linux", version_string, AllDone);
}
function ButlerUploadMac(uploading_platform, version_string) {
  UploadTeamGame(uploading_platform, "mac", version_string, ButlerUploadLinux);
}
function ButlerUploadWin(uploading_platform, version_string) {
  UploadTeamGame(uploading_platform, "win", version_string, ButlerUploadMac);
}
/* REMOVED IN 1.4.0 -- win32 function ButlerUploadWin32(version_string) {
  UploadTeamGame("win32", version_string, ButlerUploadWin);
} */
/* Example for web HTML game 
function ButlerUploadHTMLGame(version_string) {
  UploadTeamGame("web", version_string, AllDone);
}
*/
function RunButlerUploader() {
  const now_date = new Date(Date.now());
  const proj_date = new Date(projectstart);
  const version_string = CurrentVersionString();

  if (process.argv.length < 3) {
    console.error("uploading_platform must be passed in to RunButlerUploader.");
    return;
  }
  if (
    process.argv[2] !== "win" &&
    process.argv[2] !== "linux" &&
    process.argv[2] !== "mac"
  ) {
    console.error(
      "uploading_platform must be win, linux or mac. Saw " + process.argv[2],
    );
    return;
  }

  console.log("\nCalculating version number...");
  console.log(`now = ${now_date.toDateString()} @ ${now_date.toTimeString()}`);
  console.log(
    `project start = ${proj_date.toDateString()} @ ${proj_date.toTimeString()}`,
  );
  console.log("So, version number is " + version_string);

  ButlerUploadWin(process.argv[2], version_string);

  /* REMOVED IN 1.4.0 -- win32 const args = process.argv;
  // Restore this if passing additional arguments from the bat / sh side.
  if (args.length > 2) {
    console.log(
      "No Windows-32 build being supplied. Poor forsaken gamers...\n\n"
    );
    ButlerUploadWin(version_string);
  } else {
    console.log(
      "You are awesome for providing a 32-bit Windows binary for deprived gamers!\n\n"
    );
    ButlerUploadWin32(version_string);
  } */

  /* Example for web HTML game
  ButlerUploadHTMLGame(version_string);
    */
}
RunButlerUploader();
