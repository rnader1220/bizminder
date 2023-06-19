<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;


class BaseModel extends Model
{
    public function __construct() {
        if(!isset($this->user_id)) {
            $this->user_id = Auth::user()->id;
        }

    }
}
