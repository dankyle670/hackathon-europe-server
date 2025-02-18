import random

DICE_FACE = 6
NB_CASES = 100

def generate_snakes_and_ladders():
    snakes = {}
    ladders = {}

    # Logic to generate snakes
    for _ in range(10):
        start = random.randint(2, NB_CASES - 1)
        end = random.randint(1, start - 1)
        snakes[start] = end

    # Logic to generate ladders
    for _ in range(9):
        start = random.randint(1, NB_CASES - 2)
        end = random.randint(start + 1, NB_CASES)
        ladders[start] = end

    return snakes, ladders

def get_dice_value():
    return random.randint(1, DICE_FACE)

def move_player(position, dice_value, snakes, ladders):
    new_position = position + dice_value

    if new_position in snakes:
        new_position = snakes[new_position]
    elif new_position in ladders:
        new_position = ladders[new_position]

    return new_position

def play_game():
    snakes, ladders = generate_snakes_and_ladders()
    player1_position = 0
    player2_position = 0
    turns = 0

    while player1_position < NB_CASES and player2_position < NB_CASES:
        dice_value = get_dice_value()
        player1_position = move_player(player1_position, dice_value, snakes, ladders)

        dice_value = get_dice_value()
        player2_position = move_player(player2_position, dice_value, snakes, ladders)

        turns += 1

    return turns

def main():
    game_version = input("Choisissez la version (rapide ou longue) : ").lower()

    if game_version == "rapide":
        average_turns = play_game()
    elif game_version == "longue":
        game_duration = int(input("Choisissez la durée du jeu en minutes (entre 10 et 30) : "))
        average_turns = play_game()  # Ajoutez ici la logique pour la version longue
    else:
        print("Version invalide. Veuillez choisir 'rapide' ou 'longue'.")

    print("Nombre moyen de tours :", average_turns)

if __name__ == "__main__":
    main()
