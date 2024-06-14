import os
import itertools
import random
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Create the directory to save images
os.makedirs('images', exist_ok=True)

# Define the grid and dot parameters
dot_distance = 40
dot_size = 1
dot_color = '#000'
line_colors = [
    '#FF5733', '#33B5FF', '#FFC300', '#0033CC', '#DAF7A6', 
    '#6B2E06', '#FF33FF', '#00FF00', '#900C3F', '#C6FF33', 
    '#581845', '#85FF33'
]
line_width = 4
rows = 2
cols = 3
dots = [(i * dot_distance, j * dot_distance) for j in range(rows) for i in range(cols)]
background_color = '#000000'
segment_length = 2
undulation_scale = 0
line_undulation_scale = 5   # New variable for slight undulation along the line
num_images = 5  # Variable for the number of images to output

# Function to check if all lines touch at least one other line
def lines_touch(lines):
    adjacency_list = {i: set() for i in range(len(dots))}
    for line in lines:
        adjacency_list[line[0]].add(line[1])
        adjacency_list[line[1]].add(line[0])
    visited = set()

    def dfs(node):
        if node in visited:
            return
        visited.add(node)
        for neighbor in adjacency_list[node]:
            dfs(neighbor)

    dfs(lines[0][0])
    return len(visited) == len(set(itertools.chain.from_iterable(lines)))

# Function to draw dots and lines with pressure-sensitive stroke and variable stroke width
def combined_stroke_effect(x, y, color, width_variability=0.5, opacity_variability=0.5, segment_length=2, undulation_scale=0.5, line_undulation_scale=0.3):
    total_length = np.sqrt((x[1] - x[0]) ** 2 + (y[1] - y[0]) ** 2)
    num_segments = int(total_length / segment_length)
    segment_points_x = np.linspace(x[0], x[1], num_segments + 1)
    segment_points_y = np.linspace(y[0], y[1], num_segments + 1)
    
    # Generate undulation parameters for the entire path
    amplitude = np.random.uniform(0, line_undulation_scale)
    wavelength = np.random.uniform(5, 15)
    
    for i in range(num_segments):
        x_start = segment_points_x[i]
        y_start = segment_points_y[i]
        x_end = segment_points_x[i + 1]
        y_end = segment_points_y[i + 1]
        
        # Adding slight random undulation to segment end points
        undulation = np.random.normal(scale=undulation_scale, size=2)
        x_end += undulation[0]
        y_end += undulation[1]
        
        # Applying undulation along the line
        if i != 0 and i != num_segments - 1:  # Avoid undulating the endpoints
            x_end += amplitude * np.sin(i / wavelength * 2 * np.pi)
            y_end += amplitude * np.cos(i / wavelength * 2 * np.pi)
        
        width = np.random.uniform(1 - width_variability, 1 + width_variability) * line_width
        opacity = np.clip(np.random.uniform(1 - opacity_variability, 1 + opacity_variability), 0, 1)
        
        plt.plot([x_start, x_end], [y_start, y_end], linewidth=width, color=color, alpha=opacity, solid_capstyle='round')

# Function to draw grid with dots and lines
def draw_grid(lines, img_index):
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    ax.set_axis_off()
    fig.patch.set_facecolor(background_color)
    ax.set_facecolor(background_color)

    # Draw dots
    for dot in dots:
        circle = patches.Circle(dot, radius=dot_size, color=dot_color)
        ax.add_patch(circle)

    # Draw lines
    for line in lines:
        start_dot = dots[line[0]]
        end_dot = dots[line[1]]
        color = random.choice(line_colors)
        x = [start_dot[0], end_dot[0]]
        y = [start_dot[1], end_dot[1]]
        combined_stroke_effect(x, y, color, segment_length=segment_length, undulation_scale=undulation_scale, line_undulation_scale=line_undulation_scale)

    padding = 10
    plt.xlim(-padding, (cols - 1) * dot_distance + padding)
    plt.ylim(-padding, (rows - 1) * dot_distance + padding)
    plt.gca().invert_yaxis()
    plt.savefig(f'images/grid_{img_index}.svg', format='svg', bbox_inches='tight', pad_inches=0)
    plt.close()

# Generate all possible lines
lines = list(itertools.combinations(range(len(dots)), 2))

# Generate all combinations of lines with 4 to 6 lines and save the specified number of valid images
img_index = 0
for r in range(4, 7):
    for line_combination in itertools.combinations(lines, r):
        if img_index >= num_images:
            break
        if lines_touch(line_combination):
            draw_grid(line_combination, img_index)
            img_index += 1

print("Images saved successfully.")
