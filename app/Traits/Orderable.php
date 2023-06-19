<?php
namespace App\Traits;

use DB;

trait Orderable
{
    /*
    model requirements
        order_column must be defined:  column used to define display order
        order_cohort (array) must be defined:  columns used to define grouping across which order is defined.

    usage requirements
        current object must be instantiated.
        current object display order cohort values must be set.

    (for move_siblings:)
        current object target display order must be set.
        (store current object AFTER move_siblings).
    */

    public function move_siblings()
    {
        $order_column = $this->order_column;
        // for readability   $this->($this->$order_column) is hard to read.
		$new_display_order = $this->$order_column;
        if(isset($this->id)) { // update
            $old_display_order = self::where($this->primaryKey, $this->id)->value($order_column);
        } else { // create
            $old_display_order = $this->max_order; // assume end of any list
		}

		if ($new_display_order > $old_display_order) {// moving down the list
            $sql =self::where($order_column, '<=', $new_display_order)
                ->where($order_column, '>', $old_display_order);

            foreach($this->order_cohort as $element) {
                $sql -> where($element, $this->$element);
            }
                $sql->decrement($order_column);

        } else if ($new_display_order < $old_display_order){  // moving up the list
            $sql = self::where($order_column, '>=', $new_display_order)
                ->where($order_column, '<', $old_display_order);
                foreach($this->order_cohort as $element) {
                    $sql -> where($element, $this->$element);
                }
                $sql->increment($order_column);
        }
    }

    public function getMaxOrderAttribute()
    {
        $sql = self::select('id');
        foreach($this->order_cohort as $element) {
            $sql -> where($element, $this->$element);
        }
        $order_max = $sql->count();
        if(!isset($this->id)) $order_max++;
        return $order_max;
    }

    public function reorder_cohort(string $sort_column, string $sort_order = 'asc')
    {
        $response = [
            'success' => true,
            'detail' => 'successful'
        ];
        $sql = self::select('id');
        foreach($this->order_cohort as $element) {
            $sql = $sql -> where($element, $this->$element);
        }
        $resultset = $sql
            ->orderBy($sort_column, $sort_order)
    		->get();

        $new_order = 0;
                $order_column = $this->order_column;

        try {
            foreach($resultset as $result) {
                $object = self::find($result->id);
                $object->$order_column = (++$new_order);
                $object->save();
            }
        } catch(\Exception $e){
            $response['success'] = false;
            $response['detail'] =  $e->getMessage();
        }
        return $response;
    }

    public function getSortOrderList() {
        $max = $this->max_order;
        $list = [];
        for ($t = 0; $t< $max; $t++) {
            $list[] = ['value' => $t+1, 'label' => $t+1];
        }
        return $list;
    }


    protected static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->move_siblings();
        });

        self::updating(function($model){
            $model->move_siblings();
        });
    }
}
