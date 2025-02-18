# Fonction pour créer le plateau de jeu
def create_board(rows, cols):
    return [[0] * cols for _ in range(rows)]

# Fonction pour afficher le plateau de jeu
def display_board(board):
    for row in board:
        print(' '.join(map(str, row)))
    print()

# Fonction pour placer un jeton dans une colonne
def drop_piece(board, col, piece):
    for row in range(rows - 1, -1, -1):
        if board[row][col] == 0:
            board[row][col] = piece
            return True
    return False

# Fonction pour vérifier s'il y a un gagnant
def winning_move(board, piece):
    # Vérification des lignes
    for r in range(rows):
        for c in range(cols - 3):
            if board[r][c] == piece and board[r][c + 1] == piece and board[r][c + 2] == piece and board[r][c + 3] == piece:
                return True

    # Vérification des colonnes
    for c in range(cols):
        for r in range(rows - 3):
            if board[r][c] == piece and board[r + 1][c] == piece and board[r + 2][c] == piece and board[r + 3][c] == piece:
                return True

    # Vérification des diagonales (/)
    for r in range(rows - 3):
        for c in range(cols - 3):
            if board[r][c] == piece and board[r + 1][c + 1] == piece and board[r + 2][c + 2] == piece and board[r + 3][c + 3] == piece:
                return True

    # Vérification des diagonales (\)
    for r in range(rows - 3):
        for c in range(3, cols):
            if board[r][c] == piece and board[r + 1][c - 1] == piece and board[r + 2][c - 2] == piece and board[r + 3][c - 3] == piece:
                return True

    return False

# Paramètres du jeu
rows = 6
cols = 7
player = 1
game_over = False

# Création du plateau de jeu
board = create_board(rows, cols)
display_board(board)

# Déroulement du jeu
while not game_over:
    # Demander au joueur de choisir une colonne
    col = int(input("Joueur {}, choisissez une colonne (0-{}): ".format(player, cols - 1)))

    # Placer le jeton dans la colonne choisie
    if drop_piece(board, col, player):
        # Vérifier s'il y a un gagnant
        if winning_move(board, player):
            print("Joueur {} a gagné !".format(player))
            game_over = True
        else:
            display_board(board)
            # Changer de joueur
            player = 1 if player == 2 else 2
    else:
        print("La colonne est pleine. Choisissez une autre colonne.")


