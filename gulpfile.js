const { watch, src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const browserSync = require("browser-sync");
const cache = require("gulp-cached"); // CRUD 이력이 없으면 빌드 하지 않음
const sourceMaps = require("gulp-sourcemaps");
const gulpSass = require('gulp-sass')(require('sass'));
const include = require("gulp-file-include");

// watch file list
const watcher = {}
let PATH = null;

function getPath(value){
  return new Promise((resolve) => {
    resolve({
      input: 'docs/src/',
      output: 'docs/dist/',
    })
  })
}

function server() {
  browserSync.init({
    directory: true,
    open: true,
    server: {
      baseDir: "./",
    },
    port: 85,
  });
}

console.log('__dirname',__dirname)
console.log('split', __dirname.split("paris")[0]);
console.log('place', __dirname.split("paris")[0].replace(/\\/g, "/"));
let dir = __dirname.split("paris")[0].replace(/\\/g, "/");
function html(){
  return new Promise((resolve, reject) => {
    try {
      watcher["html"] = [
        PATH.input + "*.html/",
        PATH.input + "**/*.html"
      ];
      watcher["html"].push("!" + PATH.input + "include/*.html/");
      watcher["html"].push("!" + PATH.input + "**/include/*.html");

      src(watcher.html)
        .on("error", function(err){
          console.log(err.toString());
        })
        .pipe(include({
          context: {
            
            SRC: `${dir}paris/docs/src/`
          },
          prefix: "@@",
          basepath: "@file",
          
        }))
        .pipe(cache("html"))
        .pipe(dest(PATH.output))
        .pipe(browserSync.reload({ stream: true }));
      resolve();
    } catch(e){
      reject(e);
    }
  })
}

function js(){
  return new Promise((resolve, reject) => {
    try {
      watcher["js"] = [PATH.input + "js/*"];
      src(watcher["js"])
        .pipe(sourceMaps.init())
        .pipe(uglify())
        .on("error", function(err){
          console.log(err)
        })
        .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.output + "js"));
      resolve();
    } catch(e) {
      reject(e);
    }
  })
}

function scss(){
  return new Promise((resolve, reject) => {
    try {
      watcher["scss"] = [PATH.input + "scss/*.scss", PATH.input + "scss/**/*.scss"];
      src(watcher["scss"])
        .pipe(sourceMaps.init())
        .pipe(
          gulpSass({
            sourceComments: true,
            outputStyle: "compressed",
          })
        )
        .on("error", function(err){
          console.log(err)
        })
        .pipe(sourceMaps.write("./"))
        .pipe(dest(PATH.output + "css/"));
      resolve();
    } catch(e) {
      reject(e);
    }
  })
}

async function paris(){
  PATH = await getPath();
  await js();
  await scss();
  await html();
  watch(watcher["js"], js);
  watch(watcher["scss"], scss);
  watch(watcher["html"], html);
  server();
}

exports.paris = paris;
