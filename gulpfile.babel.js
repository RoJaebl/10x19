// Modules
import gulp from "gulp";
import { deleteAsync } from "del";
import gulpPug from "gulp-pug";
import gulpCsso from "gulp-csso";
import gulpAutoprefixer from "gulp-autoprefixer";
import gulpImage from "gulp-image";
import gulpWebp from "gulp-webp";
import gulpWebserver from "gulp-webserver";
import gulpGhPages from "gulp-gh-pages";
import gulpSass from "gulp-sass";
import sassCompiler from "sass";

// Sass compiler
const scssCompiler = gulpSass(sassCompiler);

// Stream routes
const routes = {
  deploy: "build/**/*",
  server: "build",
  del: ["build", ".publish"],
  img: {
    wathch: "src/img/**/*.{jpg,png,btm,svg,webp}",
    src: "src/img/*.{jpg,png,bmp,svg,webp}",
    dest: "build/img",
  },
  scss: {
    wathch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  pug: {
    wathch: "src/**/*.pug",
    src: "src/index.pug",
    dest: "build",
  },
};


// Task
const ghPage = () => gulp.src(routes.deploy).pipe(gulpGhPages());
const watcher = () => {
  gulp.watch(routes.img.wathch, webp);
  gulp.watch(routes.img.wathch, image);
  gulp.watch(routes.scss.wathch, scss);
  gulp.watch(routes.pug.wathch, pug);
};
const server = () =>
  gulp.src(routes.server).pipe(gulpWebserver({ livereload: true, open: true }));
const streamDel = () => deleteAsync(routes.del);
const webp = () =>
  gulp.src(routes.img.src).pipe(gulpWebp()).pipe(gulp.dest(routes.img.dest));
const image = () =>
  gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));
const scss = () =>
  gulp.src(routes.scss.src)
    .pipe(scssCompiler().on("error", scssCompiler.logError))
    .pipe(gulpAutoprefixer())
    .pipe(gulpCsso())
    .pipe(gulp.dest(routes.scss.dest));
const pug = () =>
  gulp.src(routes.pug.src).pipe(gulpPug
  ()).pipe(gulp.dest(routes.pug.dest));

// Export gulp
const prepare = gulp.series([streamDel, image, webp]);
const assets = gulp.series([pug, scss]);
const postDev = gulp.parallel([watcher, server]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghPage, streamDel]);
