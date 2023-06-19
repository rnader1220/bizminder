<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class AccountController extends Controller
{

    public function index()
    {
        $list = Account::getList();
        return $list;
    }

    public function create()
    {
        $record = new Account();
        return $record->getForm('create');
    }

    public function store(Request $request)
    {
        $record = new Account();
        $response = $record->saveRecord($request);
        return $response;
       }

    public function show($id)
    {
        $record = Account::find($id);
        return $record->getForm('show');
    }

    public function edit($id)
    {
        $record = Account::find($id);
        return $record->getForm('edit');
    }

    public function update(Request $request, $id)
    {
        $record = Account::find($id);
        $response = $record->saveRecord($request);
        return $response;
    }

    public function destroy($id)
    {
        $record = Account::find($id);
        $response = $record->destroyRecord();
        return $response;
    }
}
