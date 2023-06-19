<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use ESolution\DBEncryption\Traits\EncryptedAttribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Traits\TableMaint;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNotice;

class Register extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;

    protected $fillable = [
        'name',
        'amount',
        'income',
        'paid_date',
        'description',
        'category_id',
        'account_id',
        'party_id',
    ];

    protected $encryptable = [
        'name',
        'description',
    ];

    public static function getList(string $q = '') {
        $result = Register::select('register.id', 'register.paid_date', 'register.amount', 'register.name',
            DB::raw('categories.label as category'),
        )
        ->leftjoin('categories', function($join) {
            $join->on('categories.id', '=', 'entries.category_id')
            ->whereNull('categories.deleted_at');
        })
        ->where('register.user_id', Auth::user()->id)
        ->orderBy('register.paid_date', 'desc')
        ->whereNull('register.deleted_at')
        ->get()
        ->toArray();
        return $result;
    }


    public function category() {
        return $this
            ->belongsTo(Category::class, 'category_id');
    }


    public function account() {
        return $this
            ->belongsTo(Account::class, 'account_id');
    }


    public function party() {
        return $this
            ->belongsTo(Account::class, 'party_id');
    }





    public function getCycle() {
        $entry = Entry::find($this->entry_id)->toArray();
        $this->fill($entry);
        $this->id = null;
        $this->paid_date = $entry['next_due_date'];
        $this->label = ($this->income?'Income Register':'Expense Register');
        if($this->income) {
            $this->form[0][7]['parameters']['label'] = $this->form[0][7]['parameters']['label_income'];
            $this->form[0][8]['parameters']['label'] = $this->form[0][8]['parameters']['label_income'];
        }

        $this->form[0][6]['parameters']['list'] = Category::getSelectList();
        $this->form[0][7]['parameters']['list'] = Account::getSelectList(['account' => 1]);
        if($this->income) {
            $this->form[0][8]['parameters']['list'] = Account::getSelectList(['payor' => 1]);
        } else {
            $this->form[0][8]['parameters']['list'] = Account::getSelectList(['payee' => 1]);
        }


        $form = $this->getForm('create');
        $form['action'] = 'create';
        return $form;
    }

    public function storeCycle(Request $request) {
        $this->saveRecord($request);
        $entry = Entry::find($this->entry_id);
        return $entry->postCycle();
    }

    protected $form = [
        [
            [
                'type' => 'input_hidden',
                'parameters' =>
                [
                    'datapoint' => 'income',
                ],
            ],
            [
                'type' => 'input_hidden',
                'parameters' =>
                [
                    'datapoint' => 'entry_id',
                ],
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Name",
                    'datapoint' => 'name',
                    'grid_class' => 'col-sm-12 col-md-8 col-lg-6',
                    'title' => 'This field is what will display on the list. (Required) (Encrypted)',
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Paid Amount",
                    'datapoint' => 'amount',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'title' => 'How much is this, this time?',
                ],
            ],
            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "Paid Date",
                    'datapoint' => 'paid_date',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3',
                    'title' => 'When did this happen, this time?',
                ],
            ],
            [
                'type' => 'textarea',
                'parameters' =>
                [
                    'label' => "Description",
                    'datapoint' => 'description',
                    'grid_class' => 'col-12',
                    'title' => 'Write whatever you like here: description, notes, and so forth, for this transaction. (Encrypted)',

                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Category",
                    'datapoint' => 'category_id',
                    'allow_null' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'list' => [],
                    'title' => "This field is what will display on the list. Select from your category list, to organize your bills and income for reporting purposes.  See the Categories tab for more details.",
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "From Account",
                    'label_income' => "To Account",
                    'allow_null' => true,
                    'datapoint' => 'account_id',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'list' => [],
                    'title' => "This can point to your internal account (bank, etc).  If set, and the account has a link, it will appear here.  See the Accounts tab for more details.",

                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Pay To",
                    'label_income' => "Collect From",
                    'allow_null' => true,
                    'datapoint' => 'party_id',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'list' => [],
                    'title' => "This can point to an external account (cc company, employer, etc).  If set, and the account has a link, it will appear here.  See the Accounts tab for more details.",

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



    public static function boot()
    {
        parent::boot();

        self::creating(function($model){
            // ... code here
        });

        self::created(function($model){
            $details = [
                'title' => 'BillMinder New Register',
                'body' => "A user({$model->user_id}) has created an register:\n{$model->id}"
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
                'title' => 'BillMinder Deleted Register',
                'body' => "A user({$model->user_id}) has deleted an register:\n{$model->id}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });
    }
}
