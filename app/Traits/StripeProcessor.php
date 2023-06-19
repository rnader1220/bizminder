<?php
namespace App\Traits;

use Laravel\Cashier\Billable;
use App\Models\Package;
use Carbon\Coarbon;
use DB;

trait StripeProcessor
{


    use Billable;

    private function PayMethod(object $stripeUser, array $payData) : string
    {
        //$apiKey = getenv('STRIPE_SECRET');

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

//        $stripeUser->invoice_settings = ['default_payment_method' => $paymentMethod->id];

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
        $this->stripe_plan = ($stripeSubscription->plan ? $stripeSubscription->plan->id : null);
        $this->quantity = $stripeSubscription->quantity;
        $this->save();

        return true;

    }





}
