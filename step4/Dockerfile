# Use the official Deno image
FROM denoland/deno:2.4.2

# Set the working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json deno.lock* ./

# Cache dependencies
RUN deno cache --lock=deno.lock deno.json

# Copy application source code
COPY . .

# Cache the application modules
RUN deno cache --lock=deno.lock probot-runner.ts

# Create a non-root user for security
RUN groupadd -r denouser && useradd -r -g denouser denouser
RUN chown -R denouser:denouser /app
USER denouser

# Expose the port that Probot uses
EXPOSE 3000

# Set environment variables for Probot
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD deno eval "try { await fetch('http://localhost:3000/probot'); console.log('OK'); } catch(e) { console.error(e); Deno.exit(1); }"

# Run the application
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--allow-run", "probot-runner.ts"] 