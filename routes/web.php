<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::middleware(['auth:sanctum', 'verified'])->group(function () {
});



Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
    Route::namespace('App\Http\Controllers')->group(function () {

        Route::post('/subscription/new','SubscriptionController@subscribe');
        Route::post('/subscription/payment', 'SubscriptionController@payment');
        Route::post('/subscription/cancel', 'SubscriptionController@cancel');

        Route::get('/profile/subscriber', 'ProfileController@subscriber');
        Route::get('/profile/list', 'ProfileController@index');

        Route::any('/miles/{entry}/action', 'MilesController@action');
        Route::any('/hours/{entry}/action', 'HoursController@action');
        Route::any('/entry/{entry}/action', 'EntryController@action');

        Route::get('/miles/list', 'MilesController@index');
        Route::get('/hours/list', 'HoursController@index');
        Route::get('/entry/list', 'EntryController@index');
        Route::get('/account/list', 'AccountController@index');
        Route::get('/category/list', 'CategoryController@index');


        Route::get('/reports/immediate', 'ReportController@deliver');
        Route::post('/reports/immediate', 'ReportController@generate');

        Route::resource('/reports', 'ReportController');

        Route::resource('/miles', 'MilesController');
        Route::resource('/hours', 'HoursController');
        Route::resource('/entry', 'EntryController');
        Route::resource('/account', 'AccountController');
        Route::resource('/category', 'CategoryController');
        Route::resource('/profile', 'ProfileController');
    });
});
