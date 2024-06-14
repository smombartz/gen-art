import turtle
import random

# Setup the turtle
t = turtle.Turtle()
t.speed(0)
t.hideturtle()
screen = turtle.Screen()
screen.setup(width=800, height=600)

# Coordinates of the 2 by 3 dot grid
dot_positions = [
    (-100, 100), (0, 100), (100, 100),
    (-100, 0), (0, 0), (100, 0)
]

def draw_dot(x, y):
    t.penup()
    t.goto(x, y)
    t.pendown()
    t.dot(10)

def draw_line(start, end):
    t.penup()
    t.goto(start)
    t.pendown()
    t.color("blue")
    
    for _ in range(random.randint(10, 30)):  # Number of segments in each line
        angle = random.randint(-30, 30)  # Random angle
        length = random.randint(10, 50)  # Random segment length
        
        # Calculate direction to endpoint
        direction = t.towards(end) + angle
        t.setheading(direction)
        
        # Check if the next segment overshoots the end point
        t.forward(length)
        if t.distance(end) < length:
            break

# Draw the dots
for pos in dot_positions:
    draw_dot(*pos)

# Define connections between dots (each tuple is a pair of indices from dot_positions)
connections = [
    (0, 1), (1, 2),  # Top row
    (3, 4), (4, 5),  # Bottom row
    (0, 3), (1, 4), (2, 5)  # Vertical lines
]

# Draw the lines
for start_idx, end_idx in connections:
    start = dot_positions[start_idx]
    end = dot_positions[end_idx]
    draw_line(start, end)

# Keep the window open until it is closed by the user
screen.mainloop()