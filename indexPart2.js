const gridSize = 10;
let ships = [
    { name: 'Carrier', units: 5, CoordOfShip: [] },
    { name: 'Battleship', units: 4, CoordOfShip: [] },
    { name: 'Cruiser', units: 3, CoordOfShip: [] },
    { name: 'Submarine', units: 3, CoordOfShip: [] },
    { name: 'Destroyer', units: 2, CoordOfShip: [] }
];

let guessArr = [];
let fleetSizeVariable = 5;

// const rs = require('readline-sync');

const createGrid = () => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(alpha[i] + (j + 1));
        }
    }

    return grid;
};

const getRandomNum = () => {
    return Math.floor(Math.random() * gridSize);
};

const coinFlip = () => {
    return Math.floor(Math.random() * 2);
};

const placeShip = (size) => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let x, y, direction, overlap;

    do {
        overlap = false;
        x = getRandomNum();
        y = getRandomNum();
        direction = coinFlip(); // 0: horizontal, 1: vertical

        const newCoords = [];

        for (let i = 0; i < size; i++) {
            if (direction === 0) {
                y++;
            } else {
                x++;
            }

            const coord = alpha[x] + (y + 1);
            newCoords.push(coord);
        }

        // Check for overlap with existing ships
        for (const ship of ships) {
            if (ship.CoordOfShip.some((coord) => newCoords.includes(coord))) {
                overlap = true;
                break;
            }
        }
    } while (overlap || !isValidPlacement(x, y, direction, size));

    const firstCoord = alpha[x] + (y + 1);
    const CoordOfShip = [firstCoord];

    for (let i = 1; i < size; i++) {
        if (direction === 0) {
            y++;
        } else {
            x++;
        }

        const coord = alpha[x] + (y + 1);
        CoordOfShip.push(coord);
    }

    return CoordOfShip;
};
const isValidPlacement = (x, y, direction, size) => {
    if (direction === 0) {
        // Horizontal placement
        if (y + size <= gridSize) {
            return true;
        }
    } else {
        // Vertical placement
        if (x + size <= gridSize) {
            return true;
        }
    }
    return false;
};

const createShips = () => {
    ships.forEach((ship) => {
        const CoordOfShip = placeShip(ship.units);
        ship.CoordOfShip = CoordOfShip;
        console.log(`${ship.name} coordinates: ${ship.CoordOfShip.join(', ')}`);
    });

    console.log("Fleet of Ships:");
    ships.forEach((ship) => {
        console.log(`${ship.name}: ${ship.units}`);
    });
};
const checkIfShipIsHit = (guessed) => {
    for (const ship of ships) {
        if (ship.CoordOfShip.includes(guessed)) {
            console.log('You have hit a ship');

            // Decrement the units of the ship that was hit
            ship.units--;

            if (ship.units === 0) {
                console.log(`You have sunk the ${ship.name}!`);
                fleetSizeVariable--;
                console.log(`You have ${fleetSizeVariable} ships left to sink.`);
            } else {
                console.log(`You have hit a part of the ${ship.name} but it's not sunk yet.`);
            }

            return;
        }
    }
    console.log('You have missed');
};

const getUserInput = () => {
    let guessed = rs.question('Enter a location to strike: ');

    while (!isValidLocation(guessed) || guessArr.includes(guessed)) {
        if (!isValidLocation(guessed)) {
            console.log('Invalid location. Please enter a valid location.');
        } else if (guessArr.includes(guessed)) {
            console.log('You already shot there');
        }
        guessed = rs.question('Enter a location to strike: ');
    }

    guessArr.push(guessed);
    return guessed;
};

const isValidLocation = (location) => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const row = location.charAt(0).toUpperCase();
    const col = parseInt(location.substring(1));

    return alpha.includes(row) && !isNaN(col) && col >= 1 && col <= 10;
};

const playGame = () => {
    createShips();

    while (fleetSizeVariable > 0) {
        const guessed = getUserInput();
        checkIfShipIsHit(guessed);
    }

    console.log('Game Over');
};

const newGameLogic = () => {
    let playAgain = 'yes';
    while (playAgain.toLowerCase() === 'yes') {
        playGame();
        playAgain = rs.question('Do you want to play again? (yes/no): ').toLowerCase();
        while (playAgain !== 'yes' && playAgain !== 'no') {
            console.log('Invalid input. Please enter "yes" or "no".');
            playAgain = rs.question('Do you want to play again? (yes/no): ').toLowerCase();
        }
    }
};

newGameLogic();