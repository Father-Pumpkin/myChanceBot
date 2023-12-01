module.exports = {
	name: 'coin',
	description: 'Flips a coin and awards points if you guess the result correctly',
	execute(message, args) {

		const rand = Math.random() * 2;
        console.log(rand);
        const result = rand >= 1 ? 'heads' : 'tails';
        console.log(result);
        if(result == args[0]) {
            message.channel.send("Congratulations! You got it correct.")
        }
        else {
            message.channel.send("Oh no, that guess wasn't correct. Better luck next time.")
        }
	},
};