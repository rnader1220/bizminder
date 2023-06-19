@extends('layouts.auth')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class='card'>
                <div class='card-header'>
                    <div class='card-title'>
                        <h4>BillMinder</h4>
                    </div>
                    <br><br><i>by Dynamic Iterations</i>
                </div>
                <div class='card-body'>
                    <p>Billminder is a handy little app developed by the nerds at Dynamic
                        Iterations, to help manage income and expenses for home and work,
                        and reduce stress by visually showing how things are not as bad as they
                        seem... Unless they are, which would also be good to know!</p>

                    <p>Newly added features include Hours and Miles Tracking, and a handy reporting tool that
                        produces spreadsheet downloads.
                    </p>

                </div>
                <div class='card-footer'>
                    @auth
                        <a href="{{ url('/dashboard') }}">Dashboard</a><br>
                    @else
                        <a href="{{ url('/login') }}">Log in</a>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        <a href="{{ route('register') }}">Register</a>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
