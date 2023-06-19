<?php
namespace App\Traits;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;

trait TableMaint
{

    protected function getLabel(): string
    {
        if(isset($this->formLabel)) {
            return $this->formLabel;
        }
        return substr(get_class($this), strrpos(get_class($this), '\\')+1);

    }

    protected function getHelpText($mode): string
    {
        if(isset($this->helpText)) {
            return view('help.' . $this->helpText, ['mode' => $mode])->render();
        }
        return view('help.'. strtolower($this->getLabel()), ['mode' => $mode])->render();

    }

    public function getForm($mode) {
        $view = [
            'controls' => $this->dialogControls($mode, $this->getLabel()),
            'title' => $this->dialogTitle($mode, $this->getLabel()),
            'mode' => $mode,
            'form_div_class' => "col-md-12",
            'form' => $this->hydrateForm($mode)
        ];
        if($mode == 'show') {
            $view['actions'] = $this->getActions();

        }
        return $view;
    }

    public function saveRecord(Request $request) {
        $success = true;
        $detail = '';
        $action = (isset($this->id)?'Updated':'Stored');
        $data = $request->all();
        unset($data['_token']);
        $this->CustomUpdate($data);

        $this->fill($data);

        //dd($this);

        try {
            $this->save();
        } catch (\Exception $e) {
            $success = false;
            $detail = $e->getMessage();
        }

        return $this->responseMessage($action, $success, $detail, $this->id);
    }

    protected function customUpdate(array &$data)
    {
    }

    public function destroyRecord() : array
    {
        $detail = null;
        $success = true;
        if($success) {
            try{
                $this->delete();
                $success = true;
            } catch(\Exception $e) {
                $success = false;
                $detail = $e->getMessage();
            }
        }

		return  $this->responseMessage('Deleted', $success, $detail);
    }




    protected $controls = [
        'view' => [
            'head' => [
                ['title' => 'Edit This %name%', 'class' => 'btn-warning', 'id' => 'control-edit', 'icon' =>'fa-solid fa-edit'],
                ['title' => 'Delete This %name%', 'class' => 'btn-danger', 'id' => 'control-delete', 'icon' =>'fa-solid fa-trash'],
            ],
            'foot' => [
                ['title' => 'Help', 'class' => 'btn-secondary', 'id' => 'control-help', 'icon' =>'fa-solid fa-person-drowning'],
                ['title' => 'Close', 'class' => 'btn-secondary', 'id' => 'control-cancel', 'icon' =>'fa-solid fa-xmark'],
            ]
        ],
        'edit' => [
            'head' => [],
            'foot' => [
                ['title' => 'Help', 'class' => 'btn-secondary', 'id' => 'control-help', 'icon' =>'fa-solid fa-person-drowning'],
                ['title' => 'Save %name% Changes', 'class' => 'btn-success', 'id' => 'control-save', 'icon' =>'fa-solid fa-floppy-disk-pen'],
                ['title' => 'Cancel Edit %name%', 'class' => 'btn-secondary', 'id' => 'control-cancel', 'icon' =>'fa-solid fa-backward'],
            ]
        ],
        'create' => [
            'head' => [],
            'foot' => [
                ['title' => 'Help', 'class' => 'btn-secondary', 'id' => 'control-help', 'icon' =>'fa-solid fa-person-drowning'],
                ['title' => 'Save New %name%', 'class' => 'btn-success', 'id' => 'control-save', 'icon' =>'fa-solid fa-floppy-disk-pen'],
                ['title' => 'Cancel New %name%', 'class' => 'btn-secondary', 'id' => 'control-cancel', 'icon' =>'fa-solid fa-xmark'],
            ]
        ]
    ];


    public function getActions(): array
    {
        if(isset($this->actions)){
            return $this->actions;
        }
        return [];
    }

    public function dialogTitle(string $mode, string $label): string
    {
        switch($mode) {
            case 'edit':
                $title = 'Edit ' . $label;
                break;
            case 'create':
                $title = 'New ' . $label;
                break;
            default:
                $title = $label;
                break;
        }
        return $title;
    }

    public function dialogControls(string $mode, string $label): array
    {
        if($mode == 'show') $mode = 'view';
        $controls = $this->controls[$mode];
        $controls = $this->applyLabels($controls, '%name%', $label);
        return $controls;
    }


    private function applyLabels(array $array, string $tag, string $replacement) : array
    {
        $collection = collect($array);
        $collection->transform(function ($item, $key) use ($tag, $replacement)
            {
                //print_r (compact('tag', 'replacement', 'item'));
                if(is_array($item)) {
                    return $this->applyLabels($item, $tag, $replacement);
                } else {
                    return str_replace($tag, $replacement, $item);
                }


            }
        );
        return $collection->all();
    }


    public function hydrateForm($mode, ?string $formname = null): array
    {
        // use defined default form is not passed in.
        if (is_null($formname)) {
            $form = $this->form;
        } else {
            $form = $this->$formname;
        }

        foreach($form as $rowIndex => $row) {
            foreach($row as $elementIndex => $element) {
                if(isset($element['parameters']['datapoint'])) {

                $datapoint = $element['parameters']['datapoint'];
                if(isset($this->$datapoint)) {
                    if($element['type'] == 'input_date') {
                        $form[$rowIndex][$elementIndex]['parameters']['value'] =
                            Carbon::parse($this->$datapoint)->format('Y-m-d');

                    } else if($element['type'] == 'input_time') {
                        $form[$rowIndex][$elementIndex]['parameters']['value'] =
                            Carbon::parse($this->$datapoint)->format('H:i');

                    } else {
                        $form[$rowIndex][$elementIndex]['parameters']['value'] =
                            $this->$datapoint;
                    }
                } else if($datapoint == 'help-text') {
                    $form[$rowIndex][$elementIndex]['parameters']['text'] = $this->getHelpText($mode);
                }
                }

            }
        }
        return $form;
    }

    protected function responseMessage(string $action, bool $success, ?string $detail = null, ?int $id = null, ?array $other = null) : array
        {
            $display = [
                'label' => $this->getLabel(),
                'action' => $action,
                'class' => 'alert-' . ($success? 'success':'danger'),
                'splash' => ($success? 'Success!':'Failure!'),
                'negator' => ($success? ' ':' not ')
            ];

            $return =  compact('display', 'success', 'detail');
            if(isset($id)) {
                $return['id'] = $id;
            }
            if(isset($other)) {
                $return = array_merge($return, $other);
            }
            return $return;
        }


}
