<h5>Income</h5>

<p>Enter in all the income you want to track, and when they are expected to arrive.
    Categorize them for reporting purposes,
    and link them to accounts for convenient access to them.</p>

<p>Meaningful fields are encrypted in the database for your protection.  These are indicated above.</p>

@if($mode =='show')
    <h5>Special Controls</h5>
    <ul>
        <li>[ <i class='fa-solid fa-fw fa-rotate'></i>&nbsp;&nbsp;Cycle ]: This will 'cycle' the expense, create a register record, and advance the date according to the frequency setting.</li>
    </ul>
@endif

@include( 'help.controls')
