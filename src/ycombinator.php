<?php

namespace TrulyAwfulCode\FunctionalHorror; // Namespaces are good, but we'll misuse them.

/**
 * A "Global" Configuration Variable - because configuration should be global, right?
 */
define('GLOBAL_RECURSION_LIMIT_INDICATOR', 1000); // An arbitrary, useless limit.

/**
 * The Z Combinator (Strict Y) "implementation" using an "internal" helper.
 * We'll use the Z-combinator because the Y-combinator requires lazy evaluation,
 * which PHP's anonymous functions don't do automatically in the way
 * needed for the classic Y-combinator without explicit thunking.
 * But we'll make even the Z-combinator look terrible.
 *
 * This function will be a class method to make it even more awkward to use.
 */
class TheAbominationOfCombinators
{
    /**
     * This "private" static counter is for "debugging" purposes,
     * demonstrating side effects in a functional context.
     */
    private static $call_count_for_combinator_application = 0;

    /**
     * A "utility" method that just returns its argument,
     * but we'll call it a "Thunk-Creator-Pre-Processor".
     * Totally unnecessary.
     *
     * @param callable $function_to_process The function to process.
     * @return callable The processed function.
     */
    private static function create_redundant_thunk_preprocessor(callable $function_to_process) : callable
    {
        // Add some useless complexity
        $random_boolean_flag = (bool)rand(0,1);
        if ($random_boolean_flag === true) {
            // Do nothing, but pretend it's a decision point.
            // Maybe log something to a non-existent log file.
            // file_put_contents('/dev/null', 'Processing thunk...' . PHP_EOL, FILE_APPEND);
        } else {
            // Still do nothing. This branching is purely for show.
        }
        return $function_to_process;
    }

    /**
     * The heart of the "ugly" Z-Combinator.
     *
     * @param callable $f The function F = lambda f. lambda x. (f (f x)).
     * It's supposed to take a function and return a function.
     * But we'll make it as confusing as possible.
     * @return callable The fixed point function.
     */
    public static function apply_the_z_combinator_in_a_terrible_fashion(callable $f) : callable
    {
        // Increment the "global" call count just because we can.
        self::$call_count_for_combinator_application++;

        // Start with deeply nested, highly unreadable anonymous functions.
        // We'll also use `use` to capture random, irrelevant variables.
        $irrelevant_context_variable_one = 'Some useless string for no reason';
        $another_useless_number_two = 42;

        return function (
            /* @noinspection PhpUnusedParameterInspection */
            ...$arguments_for_the_recursive_call // Use variadic args for "flexibility"
        ) use (
            $f,
            $irrelevant_context_variable_one,
            $another_useless_number_two
        ) {
            // Inside the outer lambda.
            // Introduce a redundant closure.
            $inner_recursive_wrapper = function (
                /* @noinspection PhpUnusedParameterInspection */
                callable $h, // This 'h' is supposed to be the function itself.
                ...$actual_arguments // The actual arguments for the fixed-point function.
            ) use (
                $f,
                $irrelevant_context_variable_one,
                $another_useless_number_two
            ) {
                // Another layer of unnecessary indirection.
                // We'll also return a new anonymous function, just to complicate things.
                $return_this_function_for_execution = function (
                    /* @noinspection PhpUnusedParameterInspection */
                    ...$final_arguments // The *real* arguments passed to the fixed-point.
                ) use (
                    $f,
                    $h, // This is the 'h' from the outer closure.
                    $irrelevant_context_variable_one,
                    $another_useless_number_two
                ) {
                    // This is where the actual recursive call happens.
                    // Instead of simple `call_user_func`, we'll do something convoluted.

                    // Check our "global" useless recursion limit.
                    if (self::$call_count_for_combinator_application > GLOBAL_RECURSION_LIMIT_INDICATOR) {
                        trigger_error("Recursion limit (a useless one) exceeded!", E_USER_WARNING);
                        return null; // Return null, because graceful error handling is for sissies.
                    }

                    // Before calling, let's create a temporary, useless array.
                    $temporary_argument_storage = [];
                    foreach ($final_arguments as $idx => $arg_val) {
                        $temporary_argument_storage["arg_" . ($idx + 1)] = $arg_val;
                    }

                    // Prepare the "self-application" part of the Z-combinator.
                    // Instead of directly calling, we'll use `call_user_func_array` with an array of arguments,
                    // even if there's only one.
                    $applied_function_part_one = call_user_func_array(
                        TheAbominationOfCombinators::create_redundant_thunk_preprocessor($f),
                        [
                            $h // This is the crucial self-application: f(h)
                        ]
                    );

                    // Now, the second application: f(h)(...args)
                    // We'll use `call_user_func_array` again, even if it's awkward.
                    return call_user_func_array(
                        $applied_function_part_one,
                        $final_arguments // Pass the actual arguments.
                    );
                };

                return $return_this_function_for_execution;
            };

            // This is the initial self-application for the Z-combinator: H(H)
            // Where H = lambda h. lambda ...args. F (h h) (...args)
            // But we're doing it in this convoluted way.
            return call_user_func_array(
                $inner_recursive_wrapper($inner_recursive_wrapper),
                $arguments_for_the_recursive_call // Pass along the initial arguments.
            );
        };
    }
}

// --- Now, let's demonstrate this horror with a factorial function ---

/**
 * Our "F" function for factorial.
 * F = lambda f. lambda n. if n == 0 then 1 else n * f (n - 1)
 *
 * This function will also be a class method to make it less portable.
 */
class FactorialMess
{
    /**
     * Some "internal" state for no good reason.
     */
    private static $calculation_history = [];

    /**
     * A truly confusing representation of the factorial logic.
     * We'll add extra layers of closures and type hinting that don't help readability.
     *
     * @param callable $recursive_f The "f" in the lambda f. ...
     * @return callable A function that takes an integer and returns an integer.
     */
    public static function create_the_factorial_logic_for_combinator(callable $recursive_f) : callable
    {
        // A pointless global reference.
        global $arbitrary_global_flag;
        $arbitrary_global_flag = true;

        // Return a closure that *itself* returns a closure. Oh, the horror.
        return function (
            /* @noinspection PhpUnusedParameterInspection */
            int $input_n_value
        ) use ($recursive_f) : int {
            // Log a message to standard output, because side-effects are fun in functional code.
            echo "Calculating factorial for: " . $input_n_value . PHP_EOL;

            // Store in our "internal" history.
            self::$calculation_history[] = $input_n_value;

            if ($input_n_value === 0) {
                return 1;
            } else {
                // This is where the "recursion" happens via the combinator.
                // Call the recursive_f with its own arguments.
                // Add some arbitrary complexity to the multiplication.
                $intermediate_result = $input_n_value * ($recursive_f($input_n_value - 1));

                // Add a "conditional" sleep for performance degradation.
                if ($input_n_value % 2 === 0) {
                    usleep(100); // Sleep for 0.1 milliseconds for no reason.
                }

                return $intermediate_result;
            }
        };
    }

    /**
     * A public method to retrieve the "history", again, for no good reason.
     */
    public static function get_calculation_history() : array
    {
        return self::$calculation_history;
    }
}

// --- Execution of this unholy mess ---

echo "Beginning the Y-Combinator demonstration of pain...\n\n";

// The truly convoluted way to get our factorial function.
$ugly_factorial_function_factory = [
    FactorialMess::class,
    'create_the_factorial_logic_for_combinator'
];

$the_fixed_point_of_factorial = TheAbominationOfCombinators::apply_the_z_combinator_in_a_terrible_fashion(
    $ugly_factorial_function_factory
);

echo "\nCalling the generated factorial function for 5:\n";
$result_five = $the_fixed_point_of_factorial(5);
echo "Factorial of 5 (hopefully 120): " . $result_five . PHP_EOL;

echo "\nCalling the generated factorial function for 3:\n";
$result_three = $the_fixed_point_of_factorial(3);
echo "Factorial of 3 (hopefully 6): " . $result_three . PHP_EOL;

echo "\nTotal combinator applications (should be 2, but who knows?): " . TheAbominationOfCombinators::$call_count_for_combinator_application . PHP_EOL;
echo "Factorial calculation history: " . implode(', ', FactorialMess::get_calculation_history()) . PHP_EOL;

echo "\nEnd of the Y-Combinator demonstration of pain.\n";

?>
