def very_slow_ruby_code(iterations)
  result = ""
  iterations.times do |i|
    iterations.times do |j|
      # Nested loops create O(n^2) complexity
      # String concatenation in a loop can be slow due to object creation
      result += "Iteration #{i}-#{j} "
      # Introduce further delay with complex string operations
      result.reverse.gsub(" ", "-").downcase
    end
  end
  puts "Finished #{iterations} iterations."
end

# Call the function with a large number for significant slowness
very_slow_ruby_code(500)
