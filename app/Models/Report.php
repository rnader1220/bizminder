<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
//use ESolution\DBEncryption\Traits\EncryptedAttribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\TableMaint;
use App\Exports\Report as Export;


class Report extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    //use EncryptedAttribute;

    public static function getList(string $q = '') {
        $resultc = [];
        $result = Report::where('user_id', Auth::user()->id)
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

    public function localGetForm($mode) {

        $this->form[0][3]['parameters']['list'] = Category::getSelectList();
        $this->form[0][4]['parameters']['list'] = Account::getSelectList(['account' => 1]);
        $this->form[0][5]['parameters']['list'] = Account::getSelectList(['payor' => 1]);
        $this->form[0][6]['parameters']['list'] = Account::getSelectList(['payee' => 1]);

        return $this->getForm($mode);
    }

    public function localSaveRecord(Request $request) {
        $success = true;
        $detail = '';
        $action = 'Request Recieved';

        try {
            $this->user_id = Auth::user()->id;
            $this->parameters = json_encode($request->all());
            $this->save();
        } catch (\Exception $e) {
            $success = false;
            $detail = $e->getMessage();
        }

        return $this->responseMessage($action, $success, $detail);


    }


    public function localGenerate() {
        // immediate record by user_id

    }


    protected $form = [
        [

            [
                'type' => 'input_radio',
                'parameters' =>
                [
                    'label' => "Select Report Type",
                    'title' => "pick which report you want to generate. (Required) (Encrypted)",
                    'datapoint' => 'type',
                    'list' => [
                        ['label' => 'Past Income', 'value' => 'register-income'],
                        ['label' => 'Past Expense', 'value' => 'register-expense'],
                        ['label' => 'Current Income', 'value' => 'entry-income'],
                        ['label' => 'Current Expense', 'value' => 'entry-expense'],
                        ['label' => 'Time Tracking', 'value' => 'time-tracking'],
                        ['label' => 'Miles Tracking', 'value' => 'miles-tracking'],
                    ],
                    'grid_class' => 'col-12'
                ]
            ],

            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "Start Date",
                    'title' => "Start Date of Reporting Range",
                    'datapoint' => 'beg_date',
                    'grid_class' => 'col-12 col-lg-6'
                ],
            ],
            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "End Date",
                    'title' => "End Date (inclusive) if Reporting Range",
                    'datapoint' => 'end_date',
                    'grid_class' => 'col-12 col-lg-6'
                ],
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Category",
                    'title' => "Report On These Categories (leave blank for all)",
                    'datapoint' => 'category_id',
                    'allow_null' => "All Categories",
                    'multiple' => true,
                    'grid_class' => 'col-12 col-lg-4',
                    'list' => [],
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "From Account",
                    'label_income' => "To Account",
                    'title' => "Report On These Accounts (leave blank for all)",
                    'allow_null' => "All Accounts",
                    'multiple' => true,
                    'datapoint' => 'account_id',
                    'grid_class' => 'col-12 col-lg-4',
                    'list' => [],
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Pay To",
                    'title' => "Report On These Accounts (leave blank for all)",
                    'allow_null' => "All Payee Accounts",
                    'multiple' => true,
                    'datapoint' => 'payee_id',
                    'grid_class' => 'col-12 col-lg-4',
                    'list' => [],
                ]
            ],
            [
                'type' => 'select',
                'parameters' =>
                [
                    'label' => "Collect From",
                    'title' => "Report On These Accounts (leave blank for all)",
                    'allow_null' => "All Payor Accounts",
                    'multiple' => true,
                    'datapoint' => 'payor_id',
                    'grid_class' => 'col-12 col-lg-4',
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


}
