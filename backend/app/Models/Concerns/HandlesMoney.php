<?php

namespace App\Models\Concerns;

use Brick\Math\BigDecimal;
use Brick\Math\RoundingMode;

trait HandlesMoney
{
    protected function getMoneyAttribute(string $field): BigDecimal
    {
        $value = $this->attributes[$field] ?? 0;

        if (is_null($value)) {
            return BigDecimal::of(0)
                ->dividedBy(100, 2, RoundingMode::HALF_UP);
        }

        return BigDecimal::of($value)
            ->dividedBy(100, 2, RoundingMode::HALF_UP);
    }

    protected function setMoneyAttribute(string $field, $value): void
    {
        if (is_null($value)) {
            $this->attributes[$field] = BigDecimal::of(0)
                ->multipliedBy(100)
                ->toInt();
            return;
        }

        $this->attributes[$field] = BigDecimal::of($value)
            ->multipliedBy(100)
            ->toInt();
    }
}
