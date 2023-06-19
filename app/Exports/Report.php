<?php

namespace App\Exports;

use App\Models\Mile;
use App\Models\Hour;
use App\Models\Entry;
use App\Models\Register;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Monolog\Logger;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class Report implements WithColumnFormatting, WithMapping, WithHeadings, WithProperties, WithCustomStartCell, ShouldAutoSize, FromQuery
{
    use Exportable;
    var $user_id;
    var $report_type;
    var $beg_date;
    var $end_date;
    var $category_list;
    var $category_id;
    var $account_id;
    var $payor_id;
    var $payee_id;


    public function properties(): array
    {
        $properties =[
            'creator'        => Auth::user()->name,
            'lastModifiedBy' => Auth::user()->name,
            'title'          => 'Invoices Export',
            'description'    => 'Billminder Report Export',
            'manager'        => 'www.dyn-it.com/billminder',
            'company'        => 'Billminder',
        ];

        switch($this->report_type) {
            case 'register-income':
                $properties['title'] = 'Past Income';
                break;
            case 'register-expense':
            default:
                $properties['title'] = 'Past Expenses';
                break;
            case 'entry-income':
                $properties['title'] = 'Current Income';
                break;
            case 'entry-expense':
                $properties['title'] = 'Current Expenses';
                break;
            case 'time-tracking':
                $properties['title'] = 'Time Tracking Report';
                break;
            case 'miles-tracking':
                $properties['title'] = 'Miles Tracking Report';
                break;
            }
        return $properties;
    }

    public function startCell(): string
    {
        return 'B2';
    }

    public function __construct(Array $request)
    {
        $this->user_id = Auth::user()->id;
        if($request['beg_date'] == '') {
            unset ($this->beg_date);
        } else {
            $beg_date = new Carbon($request['beg_date']);
            $this->beg_date = $beg_date->startOfDay();
        }
        if($request['end_date'] == '') {
            unset ($this->end_date);
        } else {
            $end_date = new Carbon($request['end_date']);
            $this->end_date = $end_date->startOfDay();
        }
        $this->report_type = $request['type'];
        $this->category_id = $request['category_id'];
        $this->account_id = $request['account_id'];
        $this->payor_id = $request['payor_id'];
        $this->payee_id = $request['payee_id'];
    }

    public function headings(): array
    {
        switch($this->report_type) {
            case 'register-income':
                $title = ['Past Income'];
                $map = [
                    'Date',
                    'Amount',
                    'Name',
                    'Description',
                    'Category',
                    'Account',
                    'Payor',
                ];
                break;
            case 'register-expense':
            default:
                $title = ['Past Expenses'];
                $map = [
                    'Date',
                    'Amount',
                    'Name',
                    'Description',
                    'Category',
                    'Account',
                    'Payee',
                ];
                break;
            case 'entry-income':
                $title = ['Current Income'];
                $map = [
                    'Date',
                    'Est. Date',
                    'Amount',
                    'Est. Amount',
                    'Name',
                    'Description',
                    'Is Autopay',
                    'Category',
                    'Account',
                    'Payor',
                ];
                break;
            case 'entry-expense':
                $title = ['Current Expenses'];
                $map = [
                    'Date',
                    'Est. Date',
                    'Amount',
                    'Est. Amount',
                    'Name',
                    'Description',
                    'Is Autopay',
                    'Category',
                    'Account',
                    'Payee',
                ];
                break;
            case 'time-tracking':
                $title = ['Time Tracking Report'];
                $map = [
                    'Date',
                    'Start',
                    'End',
                    'Name',
                    'Description',
                    'Distance',
                    'Category',
                ];
                break;
            case 'miles-tracking':
                $title = ['Miles Tracking Report'];
                $map = [
                    'Date',
                    'Start',
                    'End',
                    'Name',
                    'Description',
                    'Duration',
                    'Category',
                ];
                break;
            }

        return compact('title', 'map');
    }


    public function map($record): array
    {

        switch($this->report_type) {
            case 'register-income':
            case 'register-expense':
            default:
                $map = [
                    Date::dateTimeToExcel(new Carbon($record->paid_date)),
                    $record->amount,
                    $record->name,
                    $record->description,
                    (isset($record->category->label)? $record->category->label:'Unassigned'),
                    (isset($record->account->name)? $record->account->name:'Unassigned'),
                    (isset($record->party->name)? $record->party->name:'Unassigned'),
                ];
                break;
            case 'entry-income':
            case 'entry-expense':
                $map = [
                    (isset($record->next_due_date)?Date::dateTimeToExcel(new Carbon($record->next_due_date)):''),
                    ($record->estimated_date==1?'[X]':''),
                    $record->amount,
                    ($record->estimated_amount==1?'[X]':''),
                    $record->name,
                    $record->description,
                    ($record->autopay==1?'[X]':''),
                    (isset($record->category->label)? $record->category->label:'Unassigned'),
                    (isset($record->account->name)? $record->account->name:'Unassigned'),
                    (isset($record->party->name)? $record->party->name:'Unassigned'),
                ];
                break;
            case 'time-tracking':
                $map = [
                    Date::dateTimeToExcel(new Carbon($record->act_date)),
                    $record->beg_time,
                    $record->end_time,
                    $record->name,
                    $record->description,
                    $record->distance,
                    (isset($record->category->label)? $record->category->label:'Unassigned'),
                ];
                break;
            case 'miles-tracking':
                $map = [
                    Date::dateTimeToExcel(new Carbon($record->travel_time)),
                    $record->beg_odometer,
                    $record->end_odometer,
                    $record->name,
                    $record->description,
                    $record->duration,
                    (isset($record->category->label)? $record->category->label:'Unassigned'),
                ];
                break;
            }

        return $map;
    }

    public function columnFormats(): array
    {
        $format = [];
        switch($this->report_type) {
            case 'register-income':
            case 'register-expense':
                default:
                $format = [
                    'B' => ' m/d/yy',
                    'C' => NumberFormat::FORMAT_CURRENCY_USD, // amount
                ];
                break;

                case 'entry-income':
                case 'entry-expense':
                $format = [
                    'B' => ' m/d/yy',
                    'D' => NumberFormat::FORMAT_CURRENCY_USD, // amount
                ];
                break;

                case 'miles-tracking':
                    $format = [
                        'B' => ' m/d/yy',
                        'C' => NumberFormat::FORMAT_DATE_TIME1, //time
                        'D' => NumberFormat::FORMAT_DATE_TIME1, //time
                        'G' => NumberFormat::FORMAT_NUMBER,
                    ];
                    break;

            case 'miles-tracking':
                $format = [
                    'B' => ' m/d/yy',
                    'C' => NumberFormat::FORMAT_NUMBER_0,
                    'D' => NumberFormat::FORMAT_NUMBER_0,
                    'G' => NumberFormat::FORMAT_NUMBER_0,
                ];
                break;
        }
        return $format;
    }

    public function query()
    {
        switch($this->report_type) {
            case 'register-income':
                $query = Register::query()
                ->where('user_id', Auth::user()->id)
                ->where('income', true)
                ->whereNull('deleted_at');
                if(isset($this->beg_date)) {
                    $query->where('paid_date', '>=', $this->beg_date);
                }
                if(isset($this->end_date)) {
                    $query->where('paid_date', '<=', $this->end_date);
                }
                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                if($this->account_id[0] > -99) {
                    $query->whereIn('account_id', $this->account_id);
                }
                if($this->payor_id[0] > -99) {
                    $query->whereIn('party_id', $this->payor_id);
                }
                $query->orderBy('paid_date');
                break;
            case 'register-expense':
            default:
                $query = Register::query()
                ->where('user_id', Auth::user()->id)
                ->where('income', false)
                ->whereNull('deleted_at');
                if(isset($this->beg_date)) {
                    $query->where('paid_date', '>=', $this->beg_date);
                }
                if(isset($this->end_date)) {
                    $query->where('paid_date', '<=', $this->end_date);
                }
                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                if($this->account_id[0] > -99) {
                    $query->whereIn('account_id', $this->account_id);
                }
                if($this->payee_id[0] > -99) {
                    $query->whereIn('party_id', $this->payee_id);
                }
                $query->orderBy('paid_date');
                break;
            case 'entry-income':
                $query = Entry::query()
                ->where('user_id', Auth::user()->id)
                ->where('income', true)
                ->whereNull('deleted_at');
                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                if($this->account_id[0] > -99) {
                    $query->whereIn('account_id', $this->account_id);
                }
                if($this->payor_id[0] > -99) {
                    $query->whereIn('party_id', $this->payor_id);
                }
                $query->orderBy('next_due_date');
                break;
            case 'entry-expense':
                $query = Entry::query()
                ->where('user_id', Auth::user()->id)
                ->where('income', false)
                ->whereNull('deleted_at');
                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                if($this->account_id[0] > -99) {
                    $query->whereIn('account_id', $this->account_id);
                }
                if($this->payee_id[0] > -99) {
                    $query->whereIn('party_id', $this->payee_id);
                }
                $query->orderBy('next_due_date');
                break;
            case 'time-tracking':
                $query = Hour::query()
                ->where('user_id', Auth::user()->id)
                ->whereNull('deleted_at');
                if(isset($this->beg_date)) {
                    $query->where('beg_time', '>=', $this->beg_date);
                }
                if(isset($this->end_date)) {
                    $query->where('beg_time', '<=', $this->end_date);
                }
                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                $query->orderBy('beg_time');
                break;
            case 'miles-tracking':
                $query = Mile::query()
                ->where('user_id', Auth::user()->id)
                ->whereNull('deleted_at');
                if(isset($this->beg_date)) {
                    $query->where('travel_time', '>=', $this->beg_date);
                }
                if(isset($this->end_date)) {
                    $query->where('travel_time', '<=', $this->end_date);
                }

                if($this->category_id[0] > -99) {
                    $query->whereIn('category_id', $this->category_id);
                }
                $query->orderBy('travel_time');
                break;
            }
        return $query;
    }
}
