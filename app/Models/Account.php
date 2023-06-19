<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use ESolution\DBEncryption\Traits\EncryptedAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use ESolution\DBEncryption\Encrypter;
use Illuminate\Support\Collection;
use App\Traits\TableMaint;


class Account extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;

    public static function getList(string $q = '') {
        $resultc = [];
        $result = Account::where('user_id', Auth::user()->id)
        ->whereNull('deleted_at')
        ->get()
        ->toArray();

        foreach($result as $index => $row) {
            $result[$index]['label'] = $row['name'];
        }

        $resulta = collect($result);
        $resultb = $resulta->sortBy('label');

        foreach($resultb as $index => $row) {
            $resultc[] = $row;
        }
        return $resultc;
    }

    public static function getSelectList(array $filter) {
        $resultc = [];
        $result = Account::select('website', 'name', 'id as value', 'website')
            ->where('user_id', Auth::user()->id)
            ->where($filter)
            ->whereNull('deleted_at')
            ->get()
            ->toArray();

        foreach($result as $index => $row) {
            $result[$index]['label'] = $row['name'];
        }

        $resulta = collect($result);
        $resultb = $resulta->sortBy('label');

        foreach($resultb as $index => $row) {
            $resultc[] = $row;
        }
        return $resultc;
    }


    protected function customUpdate(array &$data)
    {
        $data['account'] = (isset($data['account'])?1:0);
        $data['payor'] = (isset($data['payor'])?1:0);
        $data['payee'] = (isset($data['payee'])?1:0);
    }


    protected $fillable = [
        'name',
        'balance',
        'bank_account',
        'description',
        'account_number',
        'routing_number',
        'account',
        'payor',
        'payee',
        'website',
        'username',
        'password',
    ];

    protected $encryptable = [
        'name',
        'description',
        'account_number',
        'routing_number',
        'website',
        'username',
        'password'
    ];

    protected $hidden = [
        'username',
        'password',
    ];


    protected $actions = [

    ];


    protected $form = [
        [
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Account Name",
                    'title' => "This field is what will display on the list. This is the only required field! (Encrypted)",
                    'datapoint' => 'name',
                    'grid_class' => 'col-md-6'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Current Balance",
                    'title' => "For informational purposes only:  Use to keep track of your balance.",
                    'datapoint' => 'balance',
                    'numeric' => true,

                    'grid_class' => 'col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Is Bank Account?",
                    'title' => "Is this a bank account?",
                    'datapoint' => 'bank_account',
                    'grid_class' => 'col-lg-3'
                ],
            ],


            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Is To/From Account",
                    'title' => "Click this for your bank account, credit card, etc; where you send from or recieve to.",
                    'datapoint' => 'account',
                    'grid_class' => 'col-md-4'
                ]
            ],

            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Is Pay To",
                    'title' => "Click this if this is someone you pay.",
                    'datapoint' => 'payee',
                    'grid_class' => 'col-md-4'
                ]
            ],

            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Is Collect From",
                    'title' => "Click this if this account is someone who pays you",
                    'datapoint' => 'payor',
                    'grid_class' => 'col-md-4'
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
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Account Number",
                    'title' => "The number the bank, credit card, etc, used to identify this account. (Encrypted)",
                    'datapoint' => 'account_number',
                    'grid_class' => 'col-md-6'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Routing Number",
                    'title' => "The number that identifies the bank: found on a check. (Encrypted)",
                    'datapoint' => 'routing_number',
                    'grid_class' => 'col-md-6'
                ]
            ],
            [
                'type' => 'input_url',
                'parameters' =>
                [
                    'label' => "Website URL",
                    'title' => "the website for this account, where you can log in to pay, check balances, etc.  A link will appear on the Expense dialog when this is populated. (Encrypted)",
                    'datapoint' => 'website',
                    'grid_class' => 'col-md-12'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Website User",
                    'title' => "This is here for informational purposes, and are safely encrypted. (Encrypted)",
                    'datapoint' => 'username',
                    'grid_class' => 'col-md-6'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Website Password",
                    'title' => "This is here for informational purposes, and are safely encrypted. (Encrypted)",
                    'datapoint' => 'password',
                    'grid_class' => 'col-md-6'
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
