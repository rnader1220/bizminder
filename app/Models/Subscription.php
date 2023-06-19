<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Traits\TableMaint;
use Laravel\Cashier\Billable;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNotice;

class Subscription extends Model
{
    use HasFactory;
    use Billable;
    use TableMaint;

    protected $fillable = [
        'user_id',
        'name',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'trial_ends_at',
        'ends_at',
    ];


    public function newSubscription(Request $request) {
        $success = true;
        $detail = '';
        $action = (isset($this->id)?'Updated':'Stored');
        $user = User::find(Auth::user()->id);
        $stripeUser = $user->createOrGetStripeCustomer();

        try {
            $paymethod = $this->PayMethod($stripeUser, $request->post());
            $subscription = $this->GetSubscription($stripeUser);
            if(count($subscription['items']) > 0) {
                $subscriptionObj = $this->CreateSubscription($stripeUser, $subscription);
                $success = $this->RecordSubscription($subscriptionObj);
            }
            if($success) {
                $user->subscribed_at = Carbon::now();
                $user->save();
                $entry = new Entry();
                $entry->name = 'Billminder Subscription';
                $entry->amount = 30;
                $entry->frequency = -5;
                $entry->income = 0;
                $entry->autopay = 1;
                $entry->save();

                // create new expense record

            } else {
                $success = false;
                $detail = 'Transaction Failed Reason:  ' . $subscriptionObj;
            }

         } catch(\Exception $e) {
            $success = false;
            $detail =  $e->getMessage();
        }

        return self::responseMessage('Subscription', $success, $detail);
    }

    public function cancelSubscription(Request $request) {
        $success = true;
        $detail = '';
        $action = (isset($this->id)?'Updated':'Stored');
        /*

        cancel this subscription

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
        */
        return $this->responseMessage($action, $success, $detail, $this->id);
    }

    public function updatePayment(Request $request) {
        $success = true;
        $detail = '';
        $action = (isset($this->id)?'Updated':'Stored');
        /*

        update this payment method

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
        */
        return $this->responseMessage($action, $success, $detail, $this->id);
    }


    private function PayMethod(object $stripeUser, array $payData) : string
    {
        $paymentMethod = \Stripe\PaymentMethod::create([
            'type' => 'card',
            'card' => [
                'number'    => $payData['cardnum'],
                'exp_month' => $payData['exp_month'],
                'exp_year'  => $payData['exp_year'],
                'cvc'       => $payData['cvc'],
            ],
        ], ['api_key' => getenv('STRIPE_SECRET')]);
        $paymentMethod->attach(['customer' => $stripeUser->id]);

        $stripeUser->invoice_settings = ['default_payment_method' => $paymentMethod->id];

        $stripeUser->save();

        return $paymentMethod->id;
    }


    private function GetSubscription(Object $stripeUser) : array
    {
        $package = Package::find(1);
        $subscription = [
            'customer' => $stripeUser->id,
            'items' => [
                ['quantity' => 1, 'plan' => $package->price_code]
            ]
        ];
        return $subscription;
    }


    private function CreateSubscription(Object $orderObj, array $subscription_data)
    {
        $stripeSubscription = \Stripe\Subscription::create(
            $subscription_data, ['api_key' => getenv('STRIPE_SECRET')]
        );
        return $stripeSubscription;

    }

    private function RecordSubscription(Object $stripeSubscription) : bool
    {

        $this->name = 'Billminder Base Subscription';
        $this->stripe_id = $stripeSubscription->id;
        $this->stripe_status = $stripeSubscription->status;
        $this->stripe_price = ($stripeSubscription->plan ? $stripeSubscription->plan->id : null);
        $this->quantity = $stripeSubscription->quantity;
        $this->save();

        return true;

    }


    public static function boot()
    {
        parent::boot();

        self::creating(function($model){
            // ... code here
        });

        self::created(function($model){

            $details = [
                'title' => 'BillMinder New Subscription',
                'body' => "A user ({Auth::user()->id}) has subscribed:\n{Auth::user()->name}\n{Auth::user()->email}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });

        self::updating(function($model){
            // ... code here
        });

        self::updated(function($model){
            // ... code here
        });

        self::deleting(function($model){
            // ... code here
        });

        self::deleted(function($model){
            $details = [
                'title' => 'BillMinder Cancelled Subscription',
                'body' => "A user ({Auth::user()->id}) has cancelled subscription:\n{Auth::user()->name}\n{Auth::user()->email}"
            ];
            Mail::to('billminder@dyn-it.com')->send(new AdminNotice($details));
        });
    }

}
