const {src, dest, task, series, watch, parallel} = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassGlobal = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

const env = process.env.NODE_ENV;

sass.compiler = require('node-sass');

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss'
];

task('clean', () => {
    return src("build/**/*", {read: false}).pipe(rm());
});

task('browser-sync', () => {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
});


task('styles', () => {
    return src(styles)
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.scss"))
    .pipe(sassGlobal())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
    }))
    .pipe(gulpif(env === "prod", cleanCSS()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest("build/styles"))
});



watch('./src/styles/**/*.scss', series("styles"));

task('default',
series('browser-sync', "clean", parallel("styles")))