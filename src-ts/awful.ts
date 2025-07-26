// Overuse of 'any', ignoring type safety
function processData(data: any): any {
  // Magic numbers and hard-coded values
  const MAGIC_NUMBER = 100;

  // Deeply nested logic, hard to read and maintain
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.value !== undefined && typeof data.value === 'number') {
      if (data.value > MAGIC_NUMBER) {
        // Poor variable naming
        let res = data.value * 2 + 5; // What is 'res'? Why +5?
        if (data.flag) {
          res += 10;
        }
        return res;
      } else {
        // Ignoring potential errors or edge cases
        console.log("Value is too low, doing nothing.");
        return null;
      }
    } else {
      console.log("Invalid value property.");
      return undefined;
    }
  } else if (Array.isArray(data)) {
    // Duplicated logic, not extracted into a reusable function
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] === 'number') {
        sum += data[i];
      }
    }
    return sum;
  } else {
    // Lack of clear error handling or return types
    throw new Error("Unsupported data type.");
  }
}

// Inconsistent usage and reliance on implicit type assertions
const myData = { value: 50, flag: true } as any; // Forcibly casting
const result = processData(myData);
console.log(result);

// Example of not using interfaces for complex objects
function printUserInfo(user: { name: string; age: number; address?: string }) {
  console.log(`Name: ${user.name}, Age: ${user.age}`);
}

printUserInfo({ name: "John Doe", age: 30 });
