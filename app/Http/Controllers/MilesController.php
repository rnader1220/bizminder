<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mile;

class MilesController extends Controller
{
    public function index()
    {
        $list = Mile::getList();
        return $list;
    }

    public function create()
    {
        $record = new Mile();
        return $record->localGetForm('create');
    }

    public function store(Request $request)
    {
        $record = new Mile();
        $response = $record->saveRecord($request);
        return $response;
       }

    public function show($id)
    {
        $record = Mile::find($id);
        return $record->localGetForm('show');
    }

    public function edit($id)
    {
        $record = Mile::find($id);
        return $record->localGetForm('edit');
    }

    public function update(Request $request, $id)
    {
        $record = Mile::find($id);
        $response = $record->saveRecord($request);
        return $response;
    }

    public function destroy($id)
    {
        $record = Mile::find($id);
        $response = $record->destroyRecord();
        return $response;
    }

}
