#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Global variable with a misleading name
int _g_val = 10; 

// Function with unclear purpose and side effects
void process_data(int* arr, int size, int magic_num) {
    if (size > 0) {
        // Unchecked buffer access and potential overflow
        for (int i = 0; i <= size; i++) { 
            arr[i] = magic_num + _g_val; 
        }
    }
    // No return value for a function that modifies data
}

int main() {
    // Uninitialized pointer, leading to undefined behavior
    int* data_ptr; 
    int arr_size = 5;

    // Manual memory allocation without checking for failure
    data_ptr = (int*)malloc(arr_size * sizeof(int));

    // Calling a function with potential issues
    process_data(data_ptr, arr_size, 7); 

    // Loop with a magic number and inconsistent formatting
    for (int j = 0; j < 6; ++j) {
        printf("Element %d: %d\n", j, data_ptr[j]); 
    }

    // Forgetting to free allocated memory, leading to memory leaks
    // free(data_ptr); 

    return 0; 
}
