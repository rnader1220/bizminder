@extends('layouts.app')

@section('content')
<div class="page-wrapper">
    <main class="page-content">
        <div id="message" class="message-container"></div>

        <div class='container-fluid'>
            <div class='row'>
                <div class='col col-12 col-lg-8'>
                    <div class='container-fluid mb-2' id='entry-controls'>
                        <div class='row'>
                            <div class="col-6">
                                <div class='btn-app-primary centered' role='button'
                                    onclick="dashboard.add('entry', false);"><i
                                        class='fa-regular fa-plus'></i>&nbsp;&nbsp;New Expense</div>
                            </div>
                            <div class="col-6">
                                <div class='btn-app-primary centered' role='button'
                                    onclick="dashboard.add('entry', true);"><i
                                        class='fa-regular fa-plus'></i>&nbsp;&nbsp;New Income</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col order-first order-lg-last col-12 col-lg-4'>
                    <div class='container-fluid mb-2'>
                        <div class='row'>
                            <div class="col-6 offset-xl-2 col-xl-4">
                                <div class='btn-app-primary centered' role='button'
                                    onclick="dashboard.show('profile', 0);"><i
                                        class='fa-regular fa-id-card'></i>&nbsp;&nbsp;Profile</div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class='btn-app-primary centered' role='button' onclick="utility.logout();"><i
                                        class='fa-regular fa-person-to-door'></i>&nbsp;&nbsp;Log Out</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='row'>
                <div class='col-lg-8 col-12'>
                    <div class="container-fluid mb-2 app-hidden" id='entry-div'></div>
                    <div class="container-fluid mb-2 app-hidden" id='hours-div'></div>
                    <div class="container-fluid mb-2 app-hidden" id='miles-div'></div>
                    <div class="container-fluid mb-2 app-hidden" id='welcome-div'>
                        @include('help.welcome')
                    </div>
                </div>

                 <div class='col-lg-4 col-12'>
                    <div class='container-fluid mb-2'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-group w-100'>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:80%; padding-right:0; margin-right:0'
                                        onclick="dashboard.list('hours');" data-open='false'><i
                                            class='fa-regular fa-business-time'></i>&nbsp;&nbsp;Time</div>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:20%; padding-left:0; margin-left:0'
                                        onclick="dashboard.add('hours');"><i class='fa-regular fa-plus-large'></i></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='container-fluid mb-2'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-group w-100'>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:80%; padding-right:0; margin-right:0'
                                        onclick="dashboard.list('miles');" data-open='false'><i
                                            class='fa-regular fa-car-building'></i>&nbsp;&nbsp;Travel</div>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:20%; padding-left:0; margin-left:0'
                                        onclick="dashboard.add('miles');"><i class='fa-regular fa-plus-large'></i></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='container-fluid mb-2'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-group w-100'>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:80%; padding-right:0; margin-right:0'
                                        onclick="dashboard.list('account');" data-open='false'><i
                                            class='fa-regular fa-building-columns'></i>&nbsp;&nbsp;Accounts</div>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:20%; padding-left:0; margin-left:0'
                                        onclick="dashboard.add('account');"><i class='fa-regular fa-plus-large'></i>
                                    </div>
                                </div>
                            </div>
                            <div class="container-fluid mb-2 app-hidden" id='account-div'></div>
                        </div>
                    </div>

                   <div class='container-fluid mb-2'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-group w-100'>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:80%; padding-right:0; margin-right:0'
                                        onclick="dashboard.list('category');" data-open='false'><i
                                            class='fa-regular fa-objects-column'></i>&nbsp;&nbsp;Categories</div>
                                    <div class='btn-app-primary centered clickable'
                                        style='width:20%; padding-left:0; margin-left:0'
                                        onclick="dashboard.add('category');"><i class='fa-regular fa-plus-large'></i>
                                    </div>
                                </div>
                            </div>
                            <div class="container-fluid mb-2 app-hidden" id='category-div'></div>
                        </div>
                    </div>

                    <div class='container-fluid mb-2 reports-div'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-app-primary centered' onclick="reports.show();"><i
                                        class='fa-regular fa-download'></i>&nbsp;&nbsp;Reports</div>
                            </div>
                        </div>
                    </div>

                    <div class='container-fluid mb-2 subscribe-div app-hidden'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-app-primary centered' onclick="subscription.showOffer();"><i
                                        class='fa-regular fa-face-smiling-hands'></i>&nbsp;&nbsp;Subscribe</div>
                            </div>
                        </div>
                    </div>
                    <div class='container-fluid mb-2 help-div'>
                        <div class='row'>
                            <div class="col-12 offset-xl-2 col-xl-8">
                                <div class='btn-app-primary centered' onclick="dashboard.helpDashboard();"><i
                                        class='fa-regular fa-person-drowning'></i>&nbsp;&nbsp;Help</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <div id="download" class="download-container"></div>


    <div class='modal' id='genericModal' tabindex='-1'>
        <div class='container-fluid'>
            <div class='row'>
                <div class='col-12 offset-lg-1 col-lg-10 offset-xl-2 col-xl-8'>
                    <div class='modal-dialog mw-100'>
                        <div class='modal-content'>
                            <div class='modal-header'></div>
                            <div class='modal-body'></div>
                            <div class='modal-footer'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="overlay">
    </div>
</div>
@endsection
