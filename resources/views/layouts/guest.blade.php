<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

    <!-- Styles -->
    <link rel="stylesheet" type="text/css" href="{{ mix('/css/resources.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ mix('/css/billminder.css') }}">

    <!-- Scripts -->
    </head>
    <body>
            {{ $slot }}

    </body>
    <script>
        var prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        if (prefersDarkScheme.matches) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
</script>

<script type="text/javascript" src="{{ mix('/js/resources.js') }}"></script>
<script type="text/javascript" src="{{ mix('/js/billminder.js') }}"></script>
</html>
