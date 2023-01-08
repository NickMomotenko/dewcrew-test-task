const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require("gulp-sass")(require("node-sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const env = process.env.NODE_ENV;

const { SRC_PATH, DIST_PATH, STYLE_LIBS } = require("./gulp.config");

const reload = browserSync.reload;

task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({ stream: true }));
});

task("styles", () => {
  return src([...STYLE_LIBS, "src/styles/main.scss"])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      gulpif(
        env === "prod",
        autoprefixer({
          browsers: ["last 2 versions"],
          cascade: false,
        })
      )
    )
    .pipe(gulpif(env === "prod", cleanCSS()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src(`${SRC_PATH}/img/**`).pipe(dest(`${DIST_PATH}/img`));
});

task("fonts", () => {
  return src(`${SRC_PATH}/fonts/**`).pipe(dest(`${DIST_PATH}/fonts`));
});

task("js", () => {
  return src(`${SRC_PATH}/js/*.js`)
    .pipe(dest(`${DIST_PATH}/js`))
    .pipe(reload({ stream: true }));
});

task("server", function () {
  browserSync.init({
    server: {
      baseDir: `./${DIST_PATH}`,
    },
    open: true,
  });
});

task("watch", () => {
  watch("./src/styles/**/*.scss", series("styles"));
  watch("./src/*.html", series("copy:html"));
  watch("./src/js/*.js", series("js"));
  watch("./src/img/**", series("icons"));
  watch("./src/fonts/**", series("fonts"));
});

task(
  "default",
  series(
    "clean",
    parallel("copy:html", "styles", "js", "icons", "fonts"),
    parallel("watch", "server")
  )
);

task(
  "build",
  series("clean", parallel("copy:html", "styles", "js", "icons", "fonts"))
);
