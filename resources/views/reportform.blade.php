@extends('layouts.app')

@section('content')

<h1>Reports</h1>
<script>


</script>
<form>
    <div class='container'>
        <div class='row'>
            <div class='col-12'>
                <label for="report_type" class="form-label">Select Report Type</label><br>
                <div class='row'>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_1"
                                name='report_type' data-model='Register' data-filter='income=true'
                                value="register-income">
                            <label class="form-check-label" for="report_type1">Past Income </label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_2"
                                name="report_type" data-model='Register' data-filter='income=false'
                                value="register-expense">
                            <label class="form-check-label" for="report_type2">Past Bills</label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_1"
                                name='report_type' data-model='Entry' data-filter='income=true' value="entry-income">
                            <label class="form-check-label" for="report_type1">Current Income </label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_2"
                                name="report_type" data-model='Entry' data-filter='income=false' value="entry-expense">
                            <label class="form-check-label" for="report_type2">Current Bills</label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_3"
                                name="report_type" data-model='Hour' data-filter='status=closed' value="hours">
                            <label class="form-check-label" for="report_type3">Time Tracking</label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" onClick='set_options(this)' type="radio" id="report_4"
                                name="report_type" data-model='Mile' data-filter='status=closed' value="miles">
                            <label class="form-check-label" for="report_type4">Travel Tracking</label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class='row'>
            <div class='col-12 col-lg-6'>
                <div>
                    <label for="beg_date" class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="beg_date">
                </div>
            </div>
            <div class='col-12 col-lg-6'>
                <div>
                    <label for="end_date" class="form-label">End Date</label>
                    <input type="date" class="form-control" id="end_date">
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='col-12 col-lg-4'>
                <div id='category-div'>
                    <label for="category-id" class="form-label" multiple>Category</label>
                    <select class="form-select" aria-label="Category" id="category-id">
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                        <option value="1000">All Categories</option>
                    </select>
                </div>
            </div>
            <div class='col-12 col-lg-4 app-hidden' id='account-div'>
                <div>
                    <label for="end_date" class="form-label" multiple>Account</label>
                    <select class="form-select" aria-label="Account">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                        <option value="1000">All Accounts</option>
                    </select>
                </div>
            </div>
            <div class='col-12 col-lg-4 app-hidden' id='payee-div'>
                <div>
                    <label for="end_date" class="form-label" multiple>Pay To</label>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                        <option value="1000">All Payees</option>
                    </select>
                </div>
            </div>
            <div class='col-12 col-lg-4 app-hidden' id='payor-div'>
                <div>
                    <label for="end_date" class="form-label" multiple>Collect From</label>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                        <option value="1000">All Payors</option>
                    </select>
                </div>
            </div>
        </div>


    </div>
</form>
@endsection
