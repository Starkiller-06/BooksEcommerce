<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IsValidIsbn implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $isbn = preg_replace('/[^0-9X]/', '', strtoupper((string) $value));

        if (strlen($isbn) !== 10 && strlen($isbn) !== 13) {
            $fail('The :attribute must be exactly 10 or 13 characters (excluding hyphens).');
            return;
        }

        $sum = 0;

        // ISBN-13 Validation
        if (strlen($isbn) === 13) {
            for ($i = 0; $i < 13; $i++) {
                if (!is_numeric($isbn[$i])) {
                    $fail('ISBN-13 must contain only numbers.');
                    return;
                }
                $num = (int)$isbn[$i];
                $sum += ($i % 2 === 0) ? $num : ($num * 3);
            }
            if ($sum % 10 !== 0) {
                $fail('The :attribute is not a valid ISBN-13.');
            }

        // ISBN-10 Validation   
        } else {
            for ($i = 0; $i < 10; $i++) {
                $char = $isbn[$i];
                
                // X (valid as a 10 last digit)
                if ($char === 'X' && $i === 9) {
                    $num = 10;
                } elseif (is_numeric($char)) {
                    $num = (int)$char;
                } else {
                    $fail('ISBN-10 must contain only numbers or X.');
                    return;
                }

                $sum += $num * (10 - $i);
            }

            // Valid if sum is divisible by 11
            if ($sum % 11 !== 0) {
                $fail('The :attribute is not a valid ISBN-10.');
            }
        }
    }
}