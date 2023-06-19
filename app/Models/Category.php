<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use ESolution\DBEncryption\Traits\EncryptedAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Traits\TableMaint;


class Category extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;

    protected $fillable = [
        'label',
        'description',
    ];

    protected $encryptable = [
        'label',
        'description',
    ];


    public function getList(string $q = '') {
        $resultc = [];
        $result = Category::where('user_id', Auth::user()->id)
        ->whereNull('deleted_at')
        ->get()
        ->toArray();

        $resulta = collect($result);
        $resultb = $resulta->sortBy('label');

        foreach($resultb as $index => $row) {
            $resultc[] = $row;
        }
        return $resultc;
    }

    public static function getSelectList(string $q = '') {
        $resultc = [];
        $result = Category::select('label', DB::raw('id as value'))
            ->where('user_id', Auth::user()->id)
            ->whereNull('deleted_at')
            ->get()
            ->toArray();

            $resulta = collect($result);
            $resultb = $resulta->sortBy('label');

            foreach($resultb as $index => $row) {
                $resultc[] = $row;
            }
            return $resultc;
    }

    protected $form = [
        [
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Category Label",
                    'title' => "This field is what will display on the list. This is the only required field! (Encrypted)",
                    'datapoint' => 'label',
                    'grid_class' => 'col-md-9'
                ]
            ],
            [
                'type' => 'textarea',
                'parameters' =>
                [
                    'label' => "Description",
                    'title' => "Write whatever you like here: description, notes, and so forth, for this account. (Encrypted)",
                    'datapoint' => 'description',
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
            ],
        ],
    ];


}
