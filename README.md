# [Template Pintereso Bootstrap HTML](https://wowthemesnet.github.io/template-pintereso-bootstrap-html/) 

#### [Live Demo](https://wowthemesnet.github.io/template-pintereso-bootstrap-html/)

Pintereso is a [Bootstrap](https://getbootstrap.com/) 4.x template designed and developed by [WowThemesNet](https://www.wowthemes.net/) and distributed by [Bootstrap Starter](https://bootstrapstarter.com/). 

![pintereso theme](docs/assets/img/screenshot.jpg)

## Beginners - How to use this template

1. [Download](https://github.com/wowthemesnet/template-pintereso-bootstrap-html/archive/master.zip)
2. Extract and copy "docs" folder, this is the only one you'll need.

That's it! Now you can get started:
- open index.html in your browser to visit the homepage
- assets/css/theme.css - add/edit your custom CSS
- assets/js/theme.js - add/edit your custom JS
- assets/img - your images

## Developers - How to use this template

The template is built with Sass and Gulp build system with these features:

-	Handlebars HTML templates with Panini– Panini is a super simple flat file generator for use with Gulp. It compiles a series of HTML pages using a common layout. These pages can also include HTML partials, external Handlebars helpers, or external data as JSON.
-	Sass compilation, prefixing with Autoprefixer, and JavaScript concatenation
-	Built-in BrowserSync server - Will automatically reload your page when files are changed. It also live-injects CSS changes when you save a Sass file. This task runs continuously. Defaults to localhost. 
-	For production builds - CSS compression, JavaScript compression, Image compression


### Requirements

To use this template, your computer needs:

-	Ruby https://rubyinstaller.org/ 
-	Node.js (0.12 or greater) Node.js is used to run the build processes. https://nodejs.org/en/download/ 
	Test: run ` node -v ` in the terminal
-	Npm (Node comes with npm installed so you should have a version of npm.) Used to manage development dependencies.
	Test: run ` npm -v`  in the terminal
-	Sass http://sass-lang.com/install 
	Test: run ` sass -v`  in the terminal
-	Gulp – task runner
	`npm install -g gulp`
	Test: run `gulp -v ` in the terminal

** If you have all of the above installed, open a new terminal window or clear your current window and continue to template installation steps below. 


### Installing:

- Clone this repo: `git clone https://github.com/wowthemesnet/template-pintereso-bootstrap-html.git`
- Navigate into the repo directory: `cd template-pintereso-bootstrap-html`
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
- `gulpfile.js` Task definitions.
- `package.json` Handles the front-end dependencies.


### SRC Folder Structure:

- `src/assets/scss/_bootstrap.scss` Bootstrap variables imports.
- `src/assets/scss/_custom.scss` Override Bootstrap variables.
- `src/assets/scss/app.scss` This is where you will import your custom component files. Note: Do not write any scss here – every bit of CSS needs a home, more than likely this will be in components. Anything commented out gets ignored and does not get complied.
- `src/assets/scss/theme.scss` This is where your custom style goes.


### Additional Resources:
- [Sass: Syntactically Awesome Style Sheets](http://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Handlebars](http://handlebarsjs.com/)
- [Panini](https://github.com/zurb/panini) 
- [Gulp](https://gulpjs.org/getting-started)