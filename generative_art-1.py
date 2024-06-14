import matplotlib.pyplot as plt

# Define the grid size and spacing
rows = 2
cols = 3
spacing = 40

# Generate the coordinates for the dots
dots = [(x * spacing, y * spacing) for x in range(cols) for y in range(rows)]

# Create a figure and axis
fig, ax = plt.subplots()

# Plot the dots
for dot in dots:
    ax.plot(dot[0], dot[1], 'bo')  # 'bo' means blue color, circle marker

# Draw all possible lines between the dots
for i in range(len(dots)):
    for j in range(len(dots)):
        if i != j:
            ax.plot([dots[i][0], dots[j][0]], [dots[i][1], dots[j][1]], 'k-')  # 'k-' means black color, solid line

# Set the aspect of the plot to be equal
ax.set_aspect('equal')

# Remove axes for aesthetic purposes
ax.axis('off')

# Show the plot
plt.show()
