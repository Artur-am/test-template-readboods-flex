"use strict";

let gulp = require( "gulp" ),
    watch = require( "gulp-watch" ),
    rigger = require( "gulp-rigger" ),
    preprocess = require( "gulp-preprocess" ),
    imagemin = require( "gulp-imagemin" ),
    pngquant = require( "imagemin-pngquant" ),
    imageminJpegRecompress = require( "imagemin-jpeg-recompress" ),
    cache = require( "gulp-cache" ),
    concat = require( "gulp-concat" ),
    sourcemaps = require( "gulp-sourcemaps" ),
    cssmin = require( "gulp-minify-css" ),
    minify = require( "gulp-minify" ),
    htmlminify = require( "gulp-minify-html" ),
    stylus = require( "gulp-stylus" ),
    rename = require( "gulp-rename" ),
    prefixer = require( "gulp-autoprefixer" ),
    browserSync = require( "browser-sync" ),
    replace = require('gulp-replace'),
    reload = browserSync.reload,
    rimraf = require( "rimraf" );

let projectPath = "app/";
let buildPath = "build";
let lib = projectPath + "assets/";
let buildLib = buildPath + "/assets/";

let lib_css = [
    lib + "lib/*.css",
    lib + "lib/**/*.css"
];
let lib_js = [
    lib + "lib/*.js",
    lib + "lib/**/*.js"
];

let projectPaths = {
    "app" : {
        "html" : [
            projectPath + "*.html"
        ],
        "css" : [
            lib + "css/main.styl"
        ],
        "js" : [
            lib + "js/main.js"
        ],
        "img" : [
            lib + "img/*.+(jpeg|png|jpg)",
            lib + "img/**/*.+(jpeg|png|jpg)"
        ],
        'lib_css' : lib_css,
        'lib_js' : lib_js
    },
    "watch" : {
        "html" : [
            projectPath + "*.html",
            projectPath + "web-elements/*.html",
            projectPath + "web-elements/**/*.html"
        ],
        "css" : [
            lib + "css/*.styl",
            lib + "css/**/*.styl"
        ],
        "js" : [
            lib + "/js/*.js",
            lib + "/js/**/*.js"
        ],
        "img" : [
            lib + "/img/*.+(jpeg|png|jpg)",
            lib + "/img/**/*.+(jpeg|png|jpg)"
        ],
        'lib_css' : lib_css,
        'lib_js' : lib_js
    },
    "dist" : {
        html: buildPath,
        css: buildLib + "/css/",
        js: buildLib + "/js/",
        lib: buildLib + "/lib/",
        img: buildLib + "/img/"
    },
    "clean" : buildPath
};

let config = {
    server: {
        baseDir:  buildPath,
        index: "index.html"
    },
    port: 9000,
    open: true,
    notify: false
};

function getPreprocessContext(value){
    return {
        NODE_ENV: value,
        DEBUG: true
    };
}

function Html() {
    return gulp.src( projectPaths.app.html )
            .pipe( rigger() )
            .pipe( preprocess( {
                    context: getPreprocessContext("watch")
                })
            )
            .pipe( gulp.dest( projectPaths.dist.html ) )
            .pipe( reload( { stream: true } ) );
}

function HtmlBuild() {
    return gulp.src( projectPaths.app.html )
            .pipe( rigger() )
            .pipe( preprocess( {
                    context: getPreprocessContext("build")
                })
            )
            .pipe( gulp.dest(projectPaths.dist.html) )
            .pipe( reload( { stream: true } ) );
}

function JsBuild() {
    return gulp.src( projectPaths.app.js )
            .pipe( concat( "main.js" ) )
            .pipe( rigger() )
            .pipe( sourcemaps.init() )
            .pipe( minify() )
            .pipe( sourcemaps.write() )
            .pipe( reload( { stream: true } ) )
            .pipe( gulp.dest( projectPaths.dist.js ) );
}

function StylusBuild() {
    return gulp.src( projectPaths.app.css ) //Выберем наш main.scss
            .pipe( sourcemaps.init() ) //То же самое что и с js
            .pipe( stylus() ) //Скомпилируем
            .pipe( concat("style.css") )
            .pipe( prefixer( [
                    'last 15 versions',
                    '> 1%',
                    'ie 8',
                    'ie 7'
                ],
                { cascade: true }
                )
            ) //Добавим вендорные префиксы
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest( projectPaths.dist.css ) ) //И в build
            .pipe( reload( { stream: true } ) );
}

function LibCSSBuild(){

    return gulp.src( projectPaths.app.lib_css ) //Выберем наш main.scss
            .pipe( sourcemaps.init() ) //То же самое что и с js
            .pipe( stylus() ) //Скомпилируем
            .pipe( prefixer( [
                    'last 15 versions',
                    '> 1%',
                    'ie 8',
                    'ie 7'
                ],
                { cascade: true }
                )
            ) //Добавим вендорные префиксы
            .pipe( sourcemaps.write() )
            .pipe( cssmin() ) // Сжимаем
            .pipe( gulp.dest( projectPaths.dist.lib ) ) //И в build
            .pipe( reload( { stream: true } ) );
}

function LibJSBuild(){
    return gulp.src( projectPaths.app.lib_js )
            .pipe( rigger() )
            .pipe( sourcemaps.init() )
            .pipe( minify() )
            .pipe( sourcemaps.write() )
            .pipe( reload( { stream: true } ) )
            .pipe( gulp.dest( projectPaths.dist.lib ) );
}

function CssBuild() {
	return gulp.src( projectPaths.dist.css + "style.css"  ) // Выбираем файл для минификации
		.pipe( cssmin() ) // Сжимаем
		.pipe( rename( { suffix: ".min" } ) ) // Добавляем суффикс .min
		.pipe( gulp.dest( projectPaths.dist.css ) ); // Выгружаем в папку app/css
}

function ImageBuild() { // Images optimization and copy in /dist
    return gulp.src( projectPaths.app.img )
    .pipe(
        cache(
            imagemin( [
                imagemin.gifsicle( { interlaced: true } ),
                imagemin.jpegtran( { progressive: true } ),
                imageminJpegRecompress({
                    loops: 5,
                    min: 65,
                    max: 70,
                    quality:'medium'
                }),
                imagemin.svgo(),
                imagemin.optipng( { optimizationLevel: 3 } )
    ],{
      verbose: true
    })))
    .pipe(gulp.dest(projectPaths.dist.img));
}

function Clean(cb) {
    rimraf( projectPaths.clean, cb );
}

function Webserver() {
    browserSync.init(config);
}

function WatchFiles() {
    watch( projectPaths.watch.html, Html );
    watch( projectPaths.watch.css, css );
    watch( projectPaths.watch.js, JsBuild );
    watch( projectPaths.watch.img, ImageBuild );
}

let css = gulp.series( StylusBuild, CssBuild );
let libBuild = gulp.series( LibCSSBuild, LibJSBuild );

gulp.task( "html", Html );
gulp.task( "html:build", HtmlBuild );
gulp.task( "js:build", JsBuild );
gulp.task( "styles:build", StylusBuild );
gulp.task( "css:build", css );
gulp.task( "lib:build", libBuild );
gulp.task( "image:build", ImageBuild );

gulp.task( "build", gulp.series( HtmlBuild, JsBuild, css, ImageBuild, libBuild) );
gulp.task( "watch", gulp.parallel( WatchFiles, Webserver ) );
gulp.task( "webserver", Webserver );

gulp.task( "clean", Clean );