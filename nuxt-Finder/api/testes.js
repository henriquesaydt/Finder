const now = new Date(); // Data de hoje
const past = new Date('2021-10-30T00:00:00.000Z'); // Outra data no passado
const diff = Math.abs(now - past); // Subtrai uma data pela outra
const days = Math.round(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

// Mostra a diferença em dias
console.log(days);