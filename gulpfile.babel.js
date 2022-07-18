// Module
import Del from "del";
import Gulp from "gulp";
import GulpPug from "gulp-pug";
import GulpCsso from "gulp-csso";
import GulpImage from "gulp-image";
import GulpWebp from "gulp-webp";
import GulpWebserver from "gulp-webserver";
import GulpAutoprefixer from "gulp-autoprefixer";
import NodeSass from "sass";
import GulpSass from "gulp-sass";
import GulpGHPages from "gulp-gh-pages";

// Sass Compiler
const sass = GulpSass(NodeSass);

// routes
const routes = {
  clear: {
    build: "build",
    publish: ".publish",
  },
  watch: {
    build: "src/",
  },
  server: {
    build: "build/",
  },
  img: {
    watch: "src/img/**/*.{svg,img,png,webp}",
    src: "src/img/*.{svg,img,png,webp}",
    dest: "build/img/",
  },
  scss: {
    watch: "src/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css/",
  },
  pug: {
    watch: "src/**/*.pug",
    src: "src/index.pug",
    dest: "build/",
  },
};

// Task
const Deploy = () => Gulp.src("build/**/*").pipe(GulpGHPages());
const Webp = () =>
  Gulp.src(routes.img.src).pipe(GulpWebp()).pipe(Gulp.dest(routes.img.dest));
const Image = () =>
  Gulp.src(routes.img.src).pipe(GulpImage()).pipe(Gulp.dest(routes.img.dest));
const Scss = () =>
  Gulp.src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(GulpAutoprefixer())
    .pipe(GulpCsso())
    .pipe(Gulp.dest(routes.scss.dest));
const Pug = () =>
  Gulp.src(routes.pug.src).pipe(GulpPug()).pipe(Gulp.dest(routes.pug.dest));
const WebServer = () =>
  Gulp.src(routes.server.build).pipe(
    GulpWebserver({ livereload: true, open: true })
  );
const Watch = () => {
  Gulp.watch(routes.img.watch, Image);
  Gulp.watch(routes.scss.watch, Scss);
  Gulp.watch(routes.pug.watch, Pug);
};
const Clear = () => Del([routes.clear.build, routes.clear.publish]);

// Build
const Prepare = Gulp.series([Clear, Image, Webp]);
const Assets = Gulp.series([Pug, Scss]);
const PostDev = Gulp.parallel([WebServer, Watch]);

export const build = Gulp.series([Prepare, Assets]);
export const dev = Gulp.series([build, PostDev]);
export const deploy = Gulp.series([dev, Deploy, Clear]);
