# BOOTSTRAP + GULP STARTER TEMPLATE

### NOTE

The `docs` folder is for demo purposes only.

Changes should be commited to src/ files only!

### How to use

The template is built with Sass and Gulp build system with these features:

-	Handlebars HTML templates with Panini– Panini is a super simple flat file generator for use with Gulp. It compiles a series of HTML pages using a common layout. These pages can also include HTML partials, external Handlebars helpers, or external data as JSON.
-	Sass compilation, prefixing with Autoprefixer, and JavaScript concatenation
-	Built-in BrowserSync server - Will automatically reload your page when files are changed. It also live-injects CSS changes when you save a Sass file. This task runs continuously. Defaults to localhost. 
-	For production builds - CSS compression, JavaScript compression, Image compression and more..


### Requirements

To use this template, your computer needs:

-	Node.js is used to run the build processes. https://nodejs.org/en/download/ 
-   Test: run ` node -v ` in the terminal
-	Npm (Node comes with npm installed so you should have a version of npm.) Used to manage development dependencies.
-   Test: run ` npm -v`  in the terminal
-	Gulp – task runner
	`npm install -g gulp`
-	Test: run `gulp -v ` in the terminal

### Installing:

- Clone this repo: `git clone https://github.com/johndavemanuel/bootstrap-gulp-starter-template.git`
- Navigate into the repo directory: `cd bootstrap-gulp-starter-template`
- Install all node packages: `npm install`
- Run `gulp`
- Your site is now viewable at this URL: http://localhost:3000
- To create compressed, production-ready assets run `gulp build`. This will delete everything in the dist folder and recreate all of your complied files. Never make updates directly into the dist folder as these files get overridden each time. Note: The dist folder is not kept in source control.


### Folder Structure:

- `dist/`: Compiled files. Note: Do not modify anything in this directory. Your changes will be overridden every time you run the build command. 
- `node_modules` Front-end dependencies.
- `src/` Folder contains all of your core, working files—static assets, pages, templates, etc. These assets are compiled to a distribution folder. This is a completely static HTML site. 
- `src/assets/` Sass files, JS files, images, and fonts go here.
- `src/data/` External data.
- `src/layouts/` HTML layouts (templates).
- `src/pages/` Site pages.
- `src/partials/` Handlebars partials.
- `reports` txt file for accessibility issues
- `gulpfile.js` Task definitions.
- `package.json` Handles the front-end dependencies.
- `.htmllintrc` Handles the HTML lint rules.
- `.sass-lint.yml` Handles the SASS lint rules.


### Gulp Plugins:
- [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
- [gulp-compile-handlebars](https://www.npmjs.com/package/gulp-compile-handlebars)
- [gulp-concat](https://www.npmjs.com/package/gulp-concat)
- [gulp-cssmin](https://www.npmjs.com/package/gulp-cssmin)
- [gulp-html-replace](https://www.npmjs.com/package/gulp-html-replace)
- [gulp-htmllint](https://www.npmjs.com/package/gulp-htmllint)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
- [gulp-pretty-html](https://www.npmjs.com/package/gulp-pretty-html)
- [gulp-remove-code](https://www.npmjs.com/package/gulp-remove-code)
- [gulp-remove-logging](https://www.npmjs.com/package/gulp-remove-logging)
- [gulp-rename](https://www.npmjs.com/package/gulp-rename)
- [gulp-sass](https://www.npmjs.com/package/gulp-sass)
- [node-bourbon](https://www.npmjs.com/package/node-bourbon)
- [gulp-sass-lint](https://www.npmjs.com/package/gulp-sass-lint)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [gulp-newer](https://www.npmjs.com/package/gulp-newer)
- [gulp-accessibility](https://www.npmjs.com/package/gulp-accessibility)
- [gulp-jshint](https://www.npmjs.com/package/gulp-jshint)
- [gulp-gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages)
- [gulp-babel](https://www.npmjs.com/package/gulp-babel)
- [panini](https://www.npmjs.com/package/panini)
- [run-sequence](https://www.npmjs.com/package/run-sequence)
- [ansi-colors](https://www.npmjs.com/package/ansi-colors)
- [fancy-log](https://www.npmjs.com/package/fancy)


### Additional Resources:
- [Sass: Syntactically Awesome Style Sheets](http://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Handlebars](http://handlebarsjs.com/)
- [Panini](https://github.com/zurb/panini) 
- [Gulp](https://gulpjs.org/getting-started)
