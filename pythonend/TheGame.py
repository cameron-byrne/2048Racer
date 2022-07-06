import numpy as np
import random as rand

# current bug: [0, 0, 0, 8] moved left will results in [0, 0, 0, 0]
# seems to only happen with the left movement

def main():
    board = create_empty_board()
    spawn_new_tile(board)
    spawn_new_tile(board)
    print(board)
    print("enter up, down, left, or right")

    while True:
        user_input = input()
        while user_input != "up" and user_input != "down" and user_input != "left" and user_input != "right":
            user_input = input()
        if user_input == "up":
            board = move_up(board)
        elif user_input == "down":
            board = move_down(board)
        elif user_input == "left":
            board = move_left(board)
        elif user_input == "right":
            board = move_right(board)

        spawn_new_tile(board)

        print("\n\n\n\n\n\n")
        print(board)

def move_up(board):
    new_board = create_empty_board()
    for col in range(board.shape[1]):
        #decrement when placement occurs
        current_placement_index = 0
        probe_index = 0
        current_num = board[probe_index, col]
        probe_index += 1
        while probe_index < board.shape[0]:
            probe_num = board[probe_index, col]
            # if a nontrivial match is found
            if current_num == probe_num and current_num != 0:
                new_board[current_placement_index, col] = current_num * 2
                current_placement_index += 1
                current_num = 0
            elif probe_index == board.shape[0] - 1 and current_num != 0:
                new_board[current_placement_index, col] = current_num
                current_placement_index += 1
                new_board[current_placement_index, col] = probe_num
            elif probe_index == board.shape[1] and current_num == 0:
                new_board[current_placement_index, col] = probe_num
            elif current_num != probe_num and current_num != 0 and probe_num != 0:
                new_board[current_placement_index, col] = current_num
                current_num = probe_num
                current_placement_index += 1
            elif probe_num != 0 and current_num == 0:
                current_num = probe_num
            probe_index += 1
    return new_board


def move_down(board):
    new_board = create_empty_board()
    for col in range(board.shape[1]):
        #decrement when placement occurs
        current_placement_index = board.shape[1] - 1
        probe_index = board.shape[1] - 1
        current_num = board[probe_index, col]
        probe_index -= 1
        while probe_index >= 0:
            probe_num = board[probe_index, col]
            # if a nontrivial match is found
            if current_num == probe_num and current_num != 0:
                new_board[current_placement_index, col] = current_num * 2
                current_placement_index -= 1
                current_num = 0
            elif probe_index == 0 and current_num != 0:
                new_board[current_placement_index, col] = current_num
                current_placement_index -= 1
                new_board[current_placement_index, col] = probe_num
            elif probe_index == 0 and current_num == 0:
                new_board[current_placement_index, col] = probe_num
            elif current_num != probe_num and current_num != 0 and probe_num != 0:
                new_board[current_placement_index, col] = current_num
                current_num = probe_num
                current_placement_index -= 1
            elif probe_num != 0 and current_num == 0:
                current_num = probe_num
            probe_index -= 1
    return new_board

def move_left(board):
    new_board = create_empty_board()
    for row in range(board.shape[1]):
        #decrement when placement occurs
        current_placement_index = 0
        probe_index = 0
        current_num = board[row, probe_index]
        probe_index += 1
        while probe_index < board.shape[0]:
            probe_num = board[row, probe_index]
            # if a nontrivial match is found
            if current_num == probe_num and current_num != 0:
                new_board[row, current_placement_index] = current_num * 2
                current_placement_index += 1
                current_num = 0
            elif probe_index == board.shape[0] - 1 and current_num != 0:
                new_board[row, current_placement_index] = current_num
                current_placement_index += 1
                new_board[row, current_placement_index] = probe_num
            elif probe_index == board.shape[1] and current_num == 0:
                new_board[row, current_placement_index] = probe_num
            elif current_num != probe_num and current_num != 0 and probe_num != 0:
                new_board[row, current_placement_index] = current_num
                current_num = probe_num
                current_placement_index += 1
            elif probe_num != 0 and current_num == 0:
                current_num = probe_num
            probe_index += 1
    return new_board

def move_right(board):
    new_board = create_empty_board()
    for row in range(board.shape[1]):
        # decrement when placement occurs
        current_placement_index = board.shape[1] - 1
        probe_index = board.shape[1] - 1
        current_num = board[row, probe_index]
        probe_index -= 1
        while probe_index >= 0:
            probe_num = board[row, probe_index]
            # if a nontrivial match is found
            if current_num == probe_num and current_num != 0:
                new_board[row, current_placement_index] = current_num * 2
                current_placement_index -= 1
                current_num = 0
            elif probe_index == 0 and current_num != 0:
                new_board[row, current_placement_index] = current_num
                current_placement_index -= 1
                new_board[row, current_placement_index] = probe_num
            elif probe_index == 0 and current_num == 0:
                new_board[row, current_placement_index] = probe_num
            elif current_num != probe_num and current_num != 0 and probe_num != 0:
                new_board[row, current_placement_index] = current_num
                current_num = probe_num
                current_placement_index -= 1
            elif probe_num != 0 and current_num == 0:
                current_num = probe_num
            probe_index -= 1
    return new_board



def create_empty_board():
    '''
    :return: Returns a new Empty board
    '''
    return np.array([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])

def spawn_new_tile(board):
    '''
    Takes in a board and spawns a new tile on it with probability of 10% for 4, 90% for 2
    The tile spawns in a random location that has a zero
    :param board: The board to modify
    :return: None
    '''
    total_zeroes = 0
    for row in range(board.shape[0]):
        for col in range(board.shape[1]):
            if board[row, col] == 0:
                total_zeroes += 1

    random_place = rand.randint(0, total_zeroes - 1)

    # pick the random number to generate
    rand_temp = rand.random()
    if rand_temp < .10:
        random_number_to_place = 4
    else:
        random_number_to_place = 2

    print(random_place)
    zero_counter = 0
    for row in range(board.shape[0]):
        for col in range(board.shape[1]):
            if board[row, col] == 0:
                if zero_counter == random_place:
                    board[row, col] = random_number_to_place
                zero_counter += 1

if __name__ == "__main__":
    main()
