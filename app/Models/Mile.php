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


class Mile extends BaseModel
{
    use HasFactory;
    use TableMaint;
    use SoftDeletes;
    use EncryptedAttribute;


    protected $helpText = 'mile';
    protected $formLabel = 'Travel Tracker';

    protected $encryptable = [
        'name',
        'description',
    ];

    protected $fillable = [
        'name',
        'description',
        'travel_date',
        'travel_time',
        'beg_odometer',
        'end_odometer',
        'billable',
        'reportable',
        'distance',
        'category_id',
    ];

    public static function getList(string $q = '') {
        $result = Mile::select(
            'miles.id',
            'miles.travel_time',
            'miles.beg_odometer',
            'miles.distance',
            'miles.name',
            DB::raw(
                "case when distance = null then 'open' " .
                "else 'closed' end as status"
            ),
            DB::raw('categories.label as category'),
        )
        ->leftjoin('categories', function($join) {
            $join->on('categories.id', '=', 'miles.category_id')
            ->whereNull('categories.deleted_at');
        })
        ->where('miles.user_id', Auth::user()->id)
        ->orderBy('miles.travel_time', 'desc')
        ->whereNull('miles.deleted_at')
        ->get()
        ->toArray();

        foreach($result as $index => $row) {
            $result[$index]['category'] = Encrypter::decrypt($row['category']);
            $result[$index]['beg_value'] = number_format($row['beg_odometer'], 2);
            $result[$index]['activity_date'] = Carbon::createFromDate($row['travel_time'])->format('M d');
            if(isset($row['distance'])) {
                $result[$index]['interval'] = $row['distance'] . ' miles';
            } else {
                $result[$index]['interval'] = $row['distance'];
            }

        }
        return $result;
    }

    public function localGetForm($mode) {
        $this->form[0][8]['parameters']['list'] = Category::getSelectList();

        if(is_null($this->beg_odometer)) {
            $this->beg_odometer =
            Mile::where('miles.user_id', Auth::user()->id)
            ->whereNull('miles.deleted_at')
            ->orderBy('miles.travel_time', 'desc')
            ->value('end_odometer');
        }

        if(is_null($this->travel_date)) {
            $this->travel_date = Carbon::now();
        }
        if(is_null($this->travel_time)) {
            $this->travel_time = Carbon::now();
        }

        return $this->getForm($mode);
    }

    protected function customUpdate(array &$data)
    {
        $data['billable'] = (isset($data['billable'])?1:0);
        $data['reportable'] = (isset($data['reportable'])?1:0);

        $data['travel_time'] = $data['travel_date'] . ':' . $data['travel_time'];

        if(isset($data['end_odometer'])) {
            $data['distance'] = $data['end_odometer'] - $data['beg_odometer'];
        } else {
            $data['distance'] = null;
        }

        if($data['category_id'] == '_new') {
            $new_category = new Category();
            $new_category->label = $data['new_category_id'];
            $new_category->save();
            $data['category_id'] = $new_category->id;
        }
        return true;
    }

    public function category() {
        return $this
            ->belongsTo(Category::class, 'category_id');
    }

    protected $form = [
        [

            [
                'type' => 'input_date',
                'parameters' =>
                [
                    'label' => "Travel Date",
                    'title' => "When Did this Trip Begin?",
                    'datapoint' => 'travel_date',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
                ],
            ],

            [
                'type' => 'input_time',
                'parameters' =>
                [
                    'label' => "Travel Time",
                    'title' => "When Did this Trip Begin?",
                    'datapoint' => 'travel_time',
                    'grid_class' => 'col-md-6 col-md-6 col-lg-3'
                ],
            ],
            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Beginning Odometer",
                    'title' => "Odometer reading at beginning of trip",
                    'datapoint' => 'beg_odometer',
                    'numeric' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],

            [
                'type' => 'input_text',
                'parameters' =>
                [
                    'label' => "Ending Odometer",
                    'title' => "Odometer reading at completion of trip",
                    'datapoint' => 'end_odometer',
                    'numeric' => true,
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
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
                    'title' => "Is this mileage billable or reimbursable?",
                    'datapoint' => 'billable',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ],
            ],
            [
                'type' => 'input_checkbox',
                'parameters' =>
                [
                    'label' => "Reportable",
                    'title' => "Is this mileage reportable for tax purposes?",
                    'datapoint' => 'reportable',
                    'grid_class' => 'col-sm-6 col-md-4 col-lg-3'
                ]
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
                    'title' => "This field is what will display on the list. Select from your category list, to organize your mileage for reporting purposes.  See the Categories tab for more details.",
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
