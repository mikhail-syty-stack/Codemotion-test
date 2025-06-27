<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BalanceService
{
    public function getBalance($user)
    {
        return [
            'balance' => $user->balance->amount,
            'email' => $user->email,
        ];
    }

    public function addFunds($user, $amount)
    {
        DB::beginTransaction();
        try {
            $balance = $user->balance;
            $balance->amount = $balance->amount->plus($amount);
            $balance->save();
            DB::commit();
            return [
                'message' => 'Funds added successfully',
                'balance' => $balance->amount
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function withdrawFunds($user, $amount)
    {
        DB::beginTransaction();
        try {
            $balance = $user->balance;
            if ($balance->amount->isLessThan($amount)) {
                DB::rollBack();
                throw new \InvalidArgumentException('Insufficient balance');
            }
            $balance->amount = $balance->amount->minus($amount);
            $balance->save();
            DB::commit();
            return [
                'message' => 'Funds withdrawn successfully',
                'balance' => $balance->amount
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
} 