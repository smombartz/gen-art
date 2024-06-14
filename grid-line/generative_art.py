# Source https://chatgpt.com/c/cbeeccc4-21da-47fb-9773-762628f40c2c

import os
import itertools
import random
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Create the directory to save images
os.makedirs('images', exist_ok=True)

# Define the grid and dot parameters
dot_distance = 40
dot_size = 1
dot_color = '#FFFFFF'
line_colors = [
    '#00202e', '#003f5c', '#2c4875', '#8a508f', '#bc5090', 
    '#ff6361', '#ff8531', '#ffa600', '#ffd380'
]
line_width = 8
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

# Function to draw dots and lines
def draw_grid(lines, img_index):
    fig, ax = plt.subplots()
    ax.set_aspect('equal')
    ax.set_axis_off()

    # Draw dots
    for dot in dots:
        circle = patches.Circle(dot, radius=dot_size, color=dot_color)
        ax.add_patch(circle)

    # Draw lines
    for line in lines:
        start_dot = dots[line[0]]
        end_dot = dots[line[1]]
        color = random.choice(line_colors)
        ax.plot([start_dot[0], end_dot[0]], [start_dot[1], end_dot[1]], color=color, linewidth=line_width, solid_capstyle='round')

    padding = 10
    plt.xlim(-padding, (cols - 1) * dot_distance + padding)
    plt.ylim(-padding, (rows - 1) * dot_distance + padding)
    plt.gca().invert_yaxis()
    plt.savefig(f'images/grid_{img_index}.svg', format='svg', bbox_inches='tight', pad_inches=0)
    plt.close()

# Generate all possible lines
lines = list(itertools.combinations(range(len(dots)), 2))

# Generate all combinations of lines with 4 to 6 lines and save the first 50 valid images
img_index = 0
for r in range(4, 7):
    for line_combination in itertools.combinations(lines, r):
        if img_index >= 500:
            break
        if lines_touch(line_combination):
            draw_grid(line_combination, img_index)
            img_index += 1

print("Images saved successfully.")
