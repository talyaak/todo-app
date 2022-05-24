const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Converts scss to css
gulp.task('scss', () => {
  return gulp.src('./src/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src'));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync.init({
    browser: 'google-chrome',
    port: 8200,
    server: { baseDir: "./src" }
  });
});

// Browser Sync live reload
gulp.task('browser-sync-watch', () => {
  gulp.watch('./src/styles.css').on('change', browserSync.reload);
  gulp.watch('./src/app.js').on('change', browserSync.reload);
  gulp.watch('./src/index.html').on('change', browserSync.reload);
});

// Watch scss files
gulp.task('watch-scss', () => {
  return gulp.watch('./src/styles.scss', gulp.series('scss'));
});

// Run all together
gulp.task('default', gulp.series(
  'scss',
  gulp.parallel('browser-sync', 'browser-sync-watch', 'watch-scss'),
  cb => cb()
));
