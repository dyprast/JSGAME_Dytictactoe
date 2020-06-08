let $ = document.querySelector.bind(document),
    body = $('body');

function startGames() {
    $('.container').style.display = 'none';

    let moveText = document.createElement('div');
    moveText.classList.add('move');
    body.appendChild(moveText);

    let board = document.createElement('canvas');
    board.id = 'game-board';
    board.width = 465;
    board.height = 465;
    body.appendChild(board);

    let games = new Games(board);
    games.init();
}

function checkLocalStorage() {
    if (localStorage.getItem('move') != null) startGames();
}

$('#btn-play').addEventListener('click', startGames);

window.onload = checkLocalStorage();