

<h5>Dialog Controls</h5>
<ul>
    @if($mode =='show')
    <li>[ <i class='fa-solid fa-fw fa-edit'></i> ]&nbsp;&nbsp;Edit: This will let you edit the record you're viewing.</li>
    <li>[ <i class='fa-solid fa-fw fa-trash'></i> ]&nbsp;&nbsp;Delete: This will let you delete the record you're viewing.</li>
    <li>[ <i class='fa-solid fa-fw fa-xmark'></i> ]&nbsp;&nbsp;Close: Will always close the dialog box, and return to the home page.</li>
    @endif
    @if($mode =='edit')
    <li>[ <i class='fa-solid fa-fw fa-floppy-disk-pen'></i> ]&nbsp;&nbsp;Save: This will store your changes and return you to the home page.</li>
    <li>[ <i class='fa-solid fa-fw fa-backward'></i> ]&nbsp;&nbsp;Cancel: If you request an edit, this will abandon that and return you to the view dialog.</li>
    @endif
    @if($mode =='create')
    <li>[ <i class='fa-solid fa-fw fa-floppy-disk-pen'></i> ]&nbsp;&nbsp;Save: This will store your changes and return you to the home page.</li>
    <li>[ <i class='fa-solid fa-fw fa-xmark'></i> ]&nbsp;&nbsp;Close: Will always close the dialog box, and return to the home page.</li>
    @endif
    <li>[ <i class='fa-solid fa-fw fa-person-drowning'></i> ]&nbsp;&nbsp;Help: This will show/hide this help information.<br></li>
</ul>
