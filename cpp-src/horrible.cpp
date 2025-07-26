#include <iostream>
#include <vector>
#include <string>
#include <algorithm> // For std::find_if, poorly used
#include <map>       // For storing "grades" in a confusing way
#include <limits>    // For numeric_limits, also poorly used

// Global variables, because why not?
std::vector<std::string> global_student_names;
std::map<std::string, std::vector<int>> global_student_grades_map;
int g_student_count = 0; // Redundant and bad practice

// A "utility" function that does too much and is poorly named
void do_stuff_with_student_data(int operation_code, std::string student_name = "", int grade = -1) {
    if (operation_code == 1) { // Add student
        global_student_names.push_back(student_name);
        global_student_grades_map[student_name] = {}; // Initialize empty grades
        g_student_count++;
        std::cout << "Student " << student_name << " added (maybe).\n";
    } else if (operation_code == 2) { // Add grade
        auto it = global_student_grades_map.find(student_name);
        if (it != global_student_grades_map.end()) {
            it->second.push_back(grade);
            std::cout << "Grade " << grade << " added for " << student_name << ".\n";
        } else {
            std::cout << "Student " << student_name << " not found, cannot add grade.\n";
        }
    } else if (operation_code == 3) { // Print all students (terribly)
        std::cout << "\n--- All Students (The List) ---\n";
        for (size_t i = 0; i < global_student_names.size(); ++i) {
            std::cout << "Student Name: " << global_student_names[i];
            std::cout << " | Grades: ";
            for (int g : global_student_grades_map[global_student_names[i]]) {
                std::cout << g << " ";
            }
            std::cout << "\n";
        }
        std::cout << "Total students tracked: " << g_student_count << "\n"; // Redundant
    } else if (operation_code == 4) { // Find student (inefficiently)
        bool found = false;
        for (const auto& name : global_student_names) {
            if (name == student_name) {
                found = true;
                break;
            }
        }
        if (found) {
            std::cout << "Yes, " << student_name << " is here. Probably.\n";
        } else {
            std::cout << "No, " << student_name << " isn't here. Or maybe I lost them.\n";
        }
    } else {
        std::cout << "Invalid operation code. What did you expect?\n";
    }
}

// Another "helper" function that does a minimal job
bool is_valid_grade(int g) {
    return g >= 0 && g <= 100; // Hardcoded magic numbers
}

// The main function, a chaotic mess
int main() {
    // Disable synchronization with C stdio for "performance" (overkill and misplaced)
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL); // Untie cin from cout for more "performance"

    // Hardcoded "menu" options, a classic anti-pattern
    std::cout << "Welcome to the Student Management System v0.0.1 (buggy edition)\n";
    std::cout << "1. Add New Student\n";
    std::cout << "2. Add Grade to Student\n";
    std::cout << "3. List All Students and Grades\n";
    std::cout << "4. Check if Student Exists\n";
    std::cout << "0. Exit\n";

    int choice;
    do {
        std::cout << "\nEnter your 'choice' (an integer, hopefully): ";
        std::cin >> choice;

        // Error handling? What's that? Let's just ignore invalid input types.
        if (std::cin.fail()) {
            std::cout << "That wasn't an integer. Prepare for chaos.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            continue;
        }

        std::string name_input;
        int grade_input;

        switch (choice) {
            case 1:
                std::cout << "Enter student name to add: ";
                std::cin.ignore(); // Consume the newline left by std::cin >> choice
                std::getline(std::cin, name_input);
                do_stuff_with_student_data(1, name_input);
                break;
            case 2:
                std::cout << "Enter student name to add grade for: ";
                std::cin.ignore();
                std::getline(std::cin, name_input);
                std::cout << "Enter grade (0-100): ";
                std::cin >> grade_input;
                if (is_valid_grade(grade_input)) {
                    do_stuff_with_student_data(2, name_input, grade_input);
                } else {
                    std::cout << "Grade is out of bounds. Ignoring.\n";
                }
                break;
            case 3:
                do_stuff_with_student_data(3);
                break;
            case 4:
                std::cout << "Enter student name to check: ";
                std::cin.ignore();
                std::getline(std::cin, name_input);
                do_stuff_with_student_data(4, name_input);
                break;
            case 0:
                std::cout << "Exiting. Thanks for the pain.\n";
                break;
            default:
                std::cout << "Invalid choice. Please try harder next time.\n";
                break;
        }
    } while (choice != 0);

    return 0; // The only good thing here
}
