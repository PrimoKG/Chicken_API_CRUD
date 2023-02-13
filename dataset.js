const { Chicken } = require("./Chicken");

const dataset = [
    new Chicken({name: "Francis", weight: 200}),
    new Chicken({name: "Samuel", birthday: new Date("2012-08-09"), weight: 450, steps: 2, isRunning: true}),
    new Chicken({name: "Jacob", birthday: new Date("2015-03-25"), weight: 32, steps: 4, isRunning: false})
]

module.exports = {dataset};