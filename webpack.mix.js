const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.scripts([
    'resources/app/dashboard.js',
    'resources/app/subscription.js',
    'resources/app/reports.js',
    'resources/app/utility.js',
    'resources/app/library.js',
    'resources/app/modal_form.js',
], 'public/js/billminder.js').version();

mix.styles([
    'resources/css/billminder.css',
], 'public/css/billminder.css').version();

mix.scripts([
    'resources/bootstrap/bootstrap.min.js',
    'resources/fontawesome/all.min.js',
    'resources/jquery/jquery.min.js',
    'resources/jquery/jquery-ui.js',
    'resources/jquery/jquery.validate.min.js',
    'resources/jquery/jquery.additional-methods.min.js',
], 'public/js/resources.js').version();

mix.styles([
    'resources/bootstrap/bootstrap.min.css',
    'resources/jquery/jquery-ui.css',
], 'public/css/resources.css').version();
