<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hour;

class HoursController extends Controller
{


    public function index()
    {
        $list = Hour::getList();
        return $list;
    }

    public function create()
    {
        $record = new Hour();
        return $record->localGetForm('create');
    }

    public function store(Request $request)
    {
        $record = new Hour();
        $response = $record->saveRecord($request);
        return $response;
       }

    public function show($id)
    {
        $record = Hour::find($id);
        return $record->localGetForm('show');
    }

    public function edit($id)
    {
        $record = Hour::find($id);
        return $record->localGetForm('edit');
    }

    public function update(Request $request, $id)
    {
        $record = Hour::find($id);
        $response = $record->saveRecord($request);
        return $response;
    }

    public function destroy($id)
    {
        $record = Hour::find($id);
        $response = $record->destroyRecord();
        return $response;
    }
}
