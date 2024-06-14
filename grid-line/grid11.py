# v113

import os
import itertools
import random
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from scipy.interpolate import CubicSpline

# Create the directory to save images
os.makedirs('images_grid11', exist_ok=True)

# Define the grid and dot parameters
background_color = '#FFFFFF'
num_images = 5
angle_variation = 5  # Maximum variation in angle for each segment
segment_length_range = (2, 18)  # Range of segment lengths
dot_distance = 40
dot_size = 1
dot_color = '#CCCCCC'
line_colors = [
    '#FF5733', '#33B5FF', '#FFC300', '#0033CC', '#DAF7A6', 
    '#6B2E06', '#FF33FF', '#00FF00', '#900C3F', '#C6FF33', 
    '#581845', '#85FF33'
]
line_width = 4
rows = 2
cols = 3

dots = [(i * dot_distance, j * dot_distance) for j in range(rows) for i in range(cols)]

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

# Function to draw a line with segments
def draw_segmented_line(ax, start, end, color):
    # Calculate total distance
    total_distance = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
    num_segments = int(total_distance / segment_length_range[0])  # Approximate number of segments

    current_pos = np.array(start)
    direction = np.array(end) - np.array(start)
    direction = direction / np.linalg.norm(direction)  # Normalize direction

    points = [current_pos]

    for _ in range(num_segments):
        angle = np.deg2rad(random.uniform(-angle_variation, angle_variation))
        rotation_matrix = np.array([
            [np.cos(angle), -np.sin(angle)],
            [np.sin(angle), np.cos(angle)]
        ])
        segment_direction = rotation_matrix.dot(direction)
        segment_length = random.uniform(*segment_length_range)
        
        next_pos = current_pos + segment_direction * segment_length
        points.append(next_pos)
        
        current_pos = next_pos
        if np.linalg.norm(current_pos - np.array(end)) < segment_length_range[1]:
            break  # Stop if close enough to the end point
    
    points.append(end)
    
    points = np.array(points)
    x = points[:, 0]
    y = points[:, 1]
    
    cs = CubicSpline(range(len(x)), x)
    cs_y = CubicSpline(range(len(y)), y)
    
    t = np.linspace(0, len(x) - 1, 100)
    
    smooth_x = cs(t)
    smooth_y = cs_y(t)
    
    ax.plot(smooth_x, smooth_y, color=color, linewidth=line_width, solid_capstyle='round', solid_joinstyle='round')

# Function to draw dots and lines
def draw_grid(lines, img_index):
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    ax.set_axis_off()
    fig.patch.set_facecolor(background_color)

    # Draw dots
    for dot in dots:
        circle = patches.Circle(dot, radius=dot_size, color=dot_color)
        ax.add_patch(circle)

    # Draw lines
    for line in lines:
        start_dot = dots[line[0]]
        end_dot = dots[line[1]]
        color = random.choice(line_colors)
        draw_segmented_line(ax, start_dot, end_dot, color)

    padding = 10
    plt.xlim(-padding, (cols - 1) * dot_distance + padding)
    plt.ylim(-padding, (rows - 1) * dot_distance + padding)
    plt.gca().invert_yaxis()
    plt.savefig(f'images_grid11/grid_{img_index}.svg', format='svg', bbox_inches='tight', pad_inches=0)
    plt.close()

# Generate all possible lines
lines = list(itertools.combinations(range(len(dots)), 2))

# Generate all combinations of lines with 4 to 6 lines and save the first num_images valid images
img_index = 0
for r in range(4, 7):
    for line_combination in itertools.combinations(lines, r):
        if img_index >= num_images:
            break
        if lines_touch(line_combination):
            draw_grid(line_combination, img_index)
            img_index += 1

print("Images saved successfully.")