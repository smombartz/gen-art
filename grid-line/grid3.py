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

# Line drawing technique adapted for matplotlib
def draw_line(ax, start, end):
    x, y = start
    angle = np.arctan2(end[1] - start[1], end[0] - start[0])
    for _ in range(random.randint(10, 30)):  # Number of segments in each line
        angle += np.deg2rad(random.randint(-30, 30))  # Random angle
        length = random.randint(10, 50)  # Random segment length
        x_end = x + length * np.cos(angle)
        y_end = y + length * np.sin(angle)
        ax.plot([x, x_end], [y, y_end], color=random.choice(line_colors), linewidth=line_width, alpha=0.8)
        x, y = x_end, y_end
        if (x_end - end[0])**2 + (y_end - end[1])**2 < segment_length**2:
            break

# Function to draw dots and lines with pressure-sensitive stroke and variable stroke width
def combined_stroke_effect(ax, start_dot, end_dot):
    draw_line(ax, start_dot, end_dot)

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
        combined_stroke_effect(ax, start_dot, end_dot)

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
