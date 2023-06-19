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

class Hour extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;

    protected $formLabel = 'Time Tracker';

    protected $helpText = 'hour';

    protected $encryptable = [
        'name',
        'description',
    ];

    protected $fillable = [
        'name',
        'description',
        'act_date',
        'beg_time',
        'end_time',
        'duration',
        'billable',
        'category_id',
    ];

    public static function getList(string $q = '') {
        $result = Hour::select(
            'hours.id',
            'hours.beg_time',
            'hours.end_time',
            'hours.duration',
            'hours.name',
            DB::raw(
                "case when duration = null then 'open' " .
                "else 'closed' end as status"
            ),

            DB::raw('categories.label as category'),
        )
        ->leftjoin('categories', function($join) {
            $join->on('categories.id', '=', 'hours.category_id')
            ->whereNull('categories.deleted_at');
        })
        ->where('hours.user_id', Auth::user()->id)
        ->orderBy('hours.beg_time', 'desc')
        ->whereNull('hours.deleted_at')
        ->get()
        ->toArray();

        foreach($result as $index => $row) {
            $result[$index]['category'] = Encrypter::decrypt($row['category']);

            $result[$index]['activity_date'] = Carbon::createFromDate($row['beg_time'])->format('M d');
            $result[$index]['beg_value'] = Carbon::createFromDate($row['beg_time'])->format('h:i A');
            if(isset($row['duration'])) {
                $result[$index]['interval'] = $row['duration'] . ' min';
            } else {
                $result[$index]['interval'] = $row['duration'];
            }

        }
        return $result;
    }

    public function localGetForm($mode) {
        $this->form[0][6]['parameters']['list'] = Category::getSelectList();

        if(is_null($this->act_date)) {
            $this->act_date = Carbon::now();
        }
        if(is_null($this->beg_time)) {
            $this->beg_time = Carbon::now();
        }

        return $this->getForm($mode);



    }

    public function category() {
        return $this
            ->belongsTo(Category::class, 'category_id');
    }

    protected function customUpdate(array &$data)
    {
        $data['billable'] = (isset($data['billable'])?1:0);

        $data['beg_time'] = $data['act_date'] . ' ' . $data['beg_time'];

        if(isset($data['end_time'])) {
            $data['end_time'] = $data['act_date'] . ' ' . $data['end_time'];
            $beg_dt = Carbon::createFromDate($data['beg_time']);
            $end_dt = Carbon::createFromDate($data['end_time']);
            $data['duration'] = $beg_dt->diffInMinutes($end_dt);
        } else {
            $data['duration'] = null;
        }

        if($data['category_id'] == '_new') {
            $new_category = new Category();
            $new_category->label = $data['new_category_id'];
            $new_category->save();
            $data['category_id'] = $new_category->id;
        }
        return true;
    }

    /*
    on update, recalculate distance
    */

    protected $form = [
        [
            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "Activity Date",
                    'title' => "When did this activity begin?",
                    'datapoint' => 'act_date',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
                ],
            ],
            [
                'type' => 'input_time',
                'parameters' =>
                [
                    'label' => "Start Time",
                    'title' => "When did this activity begin?",
                    'datapoint' => 'beg_time',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
                ],
            ],
            [
                'type' => 'input_time',
                'parameters' =>
                [
                    'label' => "End Time",
                    'title' => "When did this activity end?",
                    'datapoint' => 'end_time',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
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
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Billable?",
                    'title' => "Is this time billable or reimbursable?",
                    'datapoint' => 'billable',
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
                    'title' => "This field is what will display on the list. Select from your category list, to organize your time for reporting purposes.  See the Categories tab for more details.",
                    'datapoint' => 'category_id',
                    'allow_null' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3',
                    'allow_new' => true,
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
