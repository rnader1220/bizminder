<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
		$created_at = Carbon::now();
        $user_id = DB::table('users')->insert([
            'name' => 'administrator',
			'password' => Hash::make('administrator'),
            'email' => 'admin@dyn-it.com',
            'sys_admin' => true,
            'enabled' => true,
        //    'theme' => 'default',
            'created_at' => $created_at,
            'updated_at' => $created_at,
            'email_verified_at' => $created_at
        ]);

    }
}
