class Chicken {
    constructor({name, birthday, weight, steps, isRunning}) {
        this.name = name;
        this.birthday = birthday || new Date();
        this.weight = weight;
        this.steps = steps || 0;
        this.isRunning = isRunning || false;
    }
}

module.exports = {Chicken};