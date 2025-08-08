FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from your local machine's 'target' directory
# to the '/app' directory inside the container.
# Make sure the filename matches your actual JAR file name.
COPY target/busManagement-*.jar app.jar

# Make port 8080 available to the world outside this container
# (This is the default port Spring Boot uses)
EXPOSE 8080

# Define the command to run your application when the container starts
# This runs the JAR file using the java command.
ENTRYPOINT ["java", "-jar", "app.jar"]