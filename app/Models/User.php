<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Auth;
use App\Traits\TableMaint;
use Laravel\Cashier\Billable;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNotice;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;
    use TableMaint;
    use Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
    ];


    protected $form = [
        [
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "User Name",
                    'datapoint' => 'name',
                    'grid_class' => 'col-md-9'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Email Address",
                    'datapoint' => 'email',
                    'grid_class' => 'col-md-12'
                ]
            ],
            [
                'type' => 'static_text',
                'parameters' =>
                [
                    'text' => "To change your password, log out and click on 'Request a New Password' link",
                    'datapoint' => 'id',
                    'grid_class' => 'col-md-12'
                ]

            ],
            [
                'type' => 'help_text',
                'parameters' =>
                [
                    'datapoint' => "help-text",
                    'grid_class' => 'col-md-12',
                    'text' => ''
                ]
            ]
        ],
    ];



    public static function boot()
    {
        parent::boot();

        self::creating(function($model){
            // ... code here
        });

        self::created(function($model){
            $details = [
                'title' => 'BillMinder New User',
                'body' => "A new user({$model->id}) has been created:\n{$model->name}\n{$model->email}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });

        self::updating(function($model){
            // ... code here
        });

        self::updated(function($model){
            // ... code here
        });

        self::deleting(function($model){
            // ... code here
        });

        self::deleted(function($model){
            $details = [
                'title' => 'BillMinder Deleted User',
                'body' => "A user({$model->id}) has been deleted:\n{$model->name}\n{$model->email}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });
    }

}
