<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Report;
use App\Exports\Report as Export;
use Maatwebsite\Excel\Excel;

class ReportController extends Controller
{
    /* scheduling reports is later.  right now, its just immedate reports. */

    public function index()
    {
        $list = Report::getList();
        return $list;
    }

    public function create()
    {
        $record = new Report();
        return $record->localGetForm('create');
    }

    public function store(Request $request)
    {
        $record = new Report();
        $response = $record->localSaveRecord($request);
        return $response;
    }

    public function generate(Request $request) {
        $record = Report::firstOrNew(['user_id' => Auth::user()->id]);
        $response = $record->localSaveRecord($request);
        return $response;
    }

    public function deliver()
    {
        $parameters = Report::where('user_id', Auth::user()->id)->value('parameters');

        $report_object = new Export(json_decode($parameters, true));
        $report_xlsx =$report_object->raw(Excel::XLSX);
        //$raw = Excel::raw($report, );
        $size = strlen($report_xlsx);
        header("Accept-Ranges: bytes");
        header("Content-Type: application/octetstream");
        header("Content-Disposition: attachment; filename=billminder-{$report_object->report_type}.xlsx");
        header("Content-Length: {$size}");
        header("Expires: ".gmdate("D, d M Y H:i:s", mktime(date("H")+2, date("i"), date("s"), date("m"), date("d"), date("Y")))." GMT");
        header("Last-Modified: ".gmdate("D, d M Y H:i:s"). " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        echo ($report_xlsx);
    }

    public function show($id)
    {
        $record = Report::find($id);
        return $record->localGetForm('show');
    }

    public function edit($id)
    {
        $record = Report::find($id);
        return $record->localGetForm('edit');
    }

    public function update(Request $request, $id)
    {
        $record = Report::find($id);
        $response = $record->saveRecord($request);
        return $response;
    }

    public function destroy($id)
    {
        $record = Report::find($id);
        $response = $record->destroyRecord();
        return $response;
    }

}
