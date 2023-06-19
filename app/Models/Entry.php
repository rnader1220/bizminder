<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use ESolution\DBEncryption\Traits\EncryptedAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use ESolution\DBEncryption\Encrypter;
use App\Traits\TableMaint;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNotice;

class Entry extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;

    protected $encryptable = [
        'name',
        'description',
    ];

    protected $fillable = [
        'name',
        'amount',
        'estimated_amount',
        'income',
        'autopay',
        'cycle',
        'next_due_date',
        'estimated_date',
        'fixed',
        'payments_remaining',
        'balance_remaining',
        'description',
        'category_id',
        'account_id',
        'party_id',
    ];

    public static function getList(string $q = '') {
        $result = Entry::select(
            'entries.id',
            'entries.next_due_date',
            'entries.estimated_date',
            'entries.amount',
            'entries.estimated_amount',
            'entries.name',
            'entries.autopay',
            DB::raw('categories.label as category'),
            DB::raw(
                "case when income = 1 then 'income' when next_due_date < CURDATE() then 'late' " .
                "when next_due_date < (select min(next_due_date) from entries where user_id = 2 and income=1 and deleted_at is null) then 'due' " .
                "else 'expense' end as status"
            )
        )
        ->leftjoin('categories', function($join) {
            $join->on('categories.id', '=', 'entries.category_id')
            ->whereNull('categories.deleted_at');
        })
        ->where('entries.user_id', Auth::user()->id)
        ->orderBy('entries.next_due_date')
        ->whereNull('entries.deleted_at')
        ->get()
        ->toArray();

        foreach($result as $index => $row) {
            $result[$index]['category'] = Encrypter::decrypt($row['category']);
        }

        return $result;
    }

    public function localGetForm($mode) {
        $this->formLabel = ($this->income?'Income':'Expense');

        $this->form[0][12]['parameters']['list'] = Category::getSelectList();
        $this->form[0][13]['parameters']['list'] = Account::getSelectList(['account' => 1]);
        if($this->income) {
            $this->form[0][14]['parameters']['list'] = Account::getSelectList(['payor' => 1]);
        } else {
            $this->form[0][14]['parameters']['list'] = Account::getSelectList(['payee' => 1]);
        }

        if($this->income) {
            $this->form[0][13]['parameters']['label'] = $this->form[0][13]['parameters']['label_income'];
            $this->form[0][14]['parameters']['label'] = $this->form[0][14]['parameters']['label_income'];
        }
        return $this->getForm($mode);
    }


    public function postCycle() {
        $success = true;
        $detail = '';

        $newdate = Carbon::create($this->next_due_date);
        switch($this->cycle) {
            case -1:
                $this->next_due_date = $newdate->addWeek();
                break;
            case -2:
                $this->next_due_date = $newdate->addWeeks(2);
                break;
            case -3:
                $this->next_due_date = $newdate->addMonth();
                break;
            case -4:
                $this->next_due_date = $newdate->addMonths(3);
                break;
            case -5:
                $this->next_due_date = $newdate->addYear();
                break;
            default:
                $this->next_due_date = null;
                break;
        }
        $this->estimated_date = 1;
        if(!$this->fixed_amount) {
            $this->estimated_amount = 1;
        }


        try {
            $this->save();
        } catch (\Exception $e) {
            $success = false;
            $detail = $e->getMessage();
        }

        return $this->responseMessage('Cycled', $success, $detail, $this->id);
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



    protected function customUpdate(array &$data)
    {
        $data['autopay'] = (isset($data['autopay'])?1:0);
        $data['estimated_amount'] = (isset($data['estimated_amount'])?1:0);
        $data['fixed_amount'] = (isset($data['fixed_amount'])?1:0);
        $data['estimated_date'] = (isset($data['estimated_date'])?1:0);
        if(is_bool($data['income'])) {
            $data['income'] = ($data['income']?1:0);
        }
        if(is_null($data['amount'])) {
            $data['amount'] = 0;
        }

        if($data['category_id'] == '_new') {
            $new_category = new Category();
            $new_category->label = $data['new_category_id'];
            $new_category->save();
            $data['category_id'] = $new_category->id;
        }

        if($data['account_id'] == '_new') {
            $new_account = new Account();
            $new_account->name = $data['new_account_id'];
            $new_account->account = 1;
            $new_account->payee = 0;
            $new_account->payor = 0;
            $new_account->save();
            $data['account_id'] = $new_account->id;
        }

        if($data['party_id'] == '_new') {
            $new_party = new Account();
            $new_party->name = $data['new_party_id'];
            $new_party->account = 0;
            $new_party->payee = ($data['income']==1?0:1);
            $new_party->payor = ($data['income']==1?1:0);
            $new_party->save();

            $data['party_id'] = $new_party->id;
        }

        return true;
    }

    protected $actions = [
        [
            'label' => 'Cycle',
            'title' => 'Cycle This Entry',
            'button_class' => 'btn-primary m-1',
            'icon' => 'fas fa-rotate',
            'id' => 'utility-cycle',
            'action' => 'cycle',
        ],
    ];

    protected $form = [
        [
            [
                'type' => 'input_hidden',
                'parameters' =>
                [
                    'label' => "income",
                    'datapoint' => 'income',
                ],
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Name",
                    'title' => "This field is what will display on the list. (Required) (Encrypted)",
                    'datapoint' => 'name',
                    'grid_class' => 'col-sm-12 col-md-8 col-lg-6'
                ]
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Current Amount",
                    'title' => "How much is the bill, currently?",
                    'title_income' => "How much is this income, currently?",
                    'datapoint' => 'amount',
                    'numeric' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Estimated Amt?",
                    'title' => "Is the current amount an estimate, or is it confirmed?",
                    'datapoint' => 'estimated_amount',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "AutoPay",
                    'title' => "Does this happen automatically?",
                    'datapoint' => 'autopay',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Frequency",
                    'title' => "What is the billing cycle for this (monthly, annual, etc)?",
                    'datapoint' => 'cycle',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'allow_null' => true,
                    'list' => [
                        ['value' => -1, 'label' => 'weekly'],
                        ['value' => -2, 'label' => 'biweekly'],
                        ['value' => -3, 'label' => 'monthly'],
                        ['value' => -4, 'label' => 'quarterly'],
                        ['value' => -5, 'label' => 'annual'],
                        ['value' => -99, 'label' => 'manual'],
                    ]
                ]
            ],
            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "Next Due Date",
                    'title' => "When is this due, currently?",
                    'datapoint' => 'next_due_date',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Estimated Date?",
                    'title' => " Is the date an estimate, or is it confirmed?",
                    'datapoint' => 'estimated_date',
                    'grid_class' => 'col-sm-6 col-md-6 col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Fixed Amount?",
                    'title' => "Is this a fixed amount? Cycling will not reset the estimate flag.",
                    'datapoint' => 'fixed',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],

            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Payments Left",
                    'title' => "Does this have a fixed number of payments?  If set, this value will go down on cycling.",
                    'datapoint' => 'payments_remaining',
                    'numeric' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Balance Left",
                    'title' => "For informational purposes only:  Use to keep track of your balance.",
                    'datapoint' => 'balance_remaining',
                    'numeric' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],
            [
                'type' => 'textarea',
                'parameters' =>
                [
                    'label' => "Description",
                    'title' => "Write whatever you like here: description, notes, and so forth, for this. (Encrypted)",
                    'datapoint' => 'description',
                    'grid_class' => 'col-12'
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Category",
                    'title' => "This field is what will display on the list. Select from your category list, to organize your bills and income for reporting purposes.  See the Categories tab for more details.",
                    'datapoint' => 'category_id',
                    'allow_null' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'allow_new' => true,
                    'list' => [],
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "From Account",
                    'label_income' => "To Account",
                    'title' => "This can point to your internal account (bank, etc).  If set, and the account has a link, it will appear here.  See the Accounts tab for more details.",
                    'allow_null' => true,
                    'datapoint' => 'account_id',
                    'allow_new' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'list' => [],
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Pay To",
                    'label_income' => "Collect From",
                    'title' => "This can point to an external account (cc company, employer, etc).  If set, and the account has a link, it will appear here.  See the Accounts tab for more details.",
                    'allow_null' => true,
                    'datapoint' => 'party_id',
                    'allow_new' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'list' => [],
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
                'title' => 'BillMinder New Entry',
                'body' => "A user({$model->user_id}) has created an entry:\n{$model->id}"
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
                'title' => 'BillMinder Deleted Entry',
                'body' => "A user({$model->user_id}) has deleted an entry:\n{$model->id}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });
    }



}
