<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entry;
use App\Models\Register;

class EntryController extends Controller
{
    public function index()
    {
        $list = Entry::getList();
        return $list;
    }

    public function create(Request $request)
    {
        $record = new Entry();
        $record->income = ($request['income']=='true'?1:0);
        return $record->localGetForm('create');
    }

    public function store(Request $request)
    {
        $record = new Entry();
        $response = $record->saveRecord($request);
        return $response;
    }

    public function show($id)
    {
        $record = Entry::find($id);
        return $record->localGetForm('show');
    }

    public function edit($id)
    {
        $record = Entry::find($id);
        return $record->localGetForm('edit');
    }

    public function update(Request $request, $id)
    {
        $record = Entry::find($id);
        $response = $record->saveRecord($request);
        return $response;
    }

    public function destroy($id)
    {
        $record = Entry::find($id);
        $response = $record->destroyRecord();
        return $response;
    }

    public function action(Request $request, $id)
    {
        switch($request->method()) {
            case 'GET':
                switch($request['action']) {
                    case 'cycle':
                        $register = new Register();
                        $register->entry_id = $id;
                        return $register->getCycle();
                        break;
                }
                break;
            case 'POST':
                switch($request['action']) {
                    case 'cycle':
                        $register = new Register();
                        $register->entry_id = $id;
                        return $register->storeCycle($request);
                        break;
                }
                break;
            case 'PATCH':
                switch($request['action']) {
                    case 'cycle':
                        break;
                }
                break;
        }


    }

}
