import { question } from "readline-sync";

let numPlayers = 2

interface Pokemon {
    name: string
    hp: number
    lvl: number
    skills: Skill[]
    speed: number
    baseatk: number
    basedef: number
    atk: number
    def: number
    atkCount: number
    defCount: number
    weakness: String[]
    resistance: String[]
    status: string
}

interface Skill {
    name: string
    numUses: number
    damage: number
    type: string
    atkadjustment: number
    defadjustment: number
    effect: string
}

let pokemon1: Pokemon = {
    name: "Charlizard",
    hp: 350,
    lvl: 70,
    skills: [
        {
            name: "Dragon Dance",
            numUses: 20,
            damage: 0,
            type: "Dragon",
            atkadjustment: 1,
            defadjustment: 0,
            effect: "None"
        },
        {
            name: "Fly",
            numUses: 15,
            damage: 90,
            type: "Flying",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "None"
        },
        {
            name: "Will-O-Wisp",
            numUses: 15,
            damage: 0,
            type: "Fire",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "Burned"
        },
        {
            name: "Fire Blast",
            numUses: 5,
            damage: 110,
            type: "Fire",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "None"
        },
    ],
    speed: 400,
    baseatk: 600,
    basedef: 550,
    atk: 0,
    def: 0,
    atkCount: 0,
    defCount: 0,
    weakness: ["Rock", "Electric", "Water"],
    resistance: ["Fighting", "Bug", "Grass", "Steel", "Fire"],
    status: "Normal"
}

let pokemon2: Pokemon = {
    name: "Pikachu",
    hp: 300,
    lvl: 70,
    skills: [
        {
            name: "Tail Whip",
            numUses: 40,
            damage: 0,
            type: "Normal",
            atkadjustment: 0,
            defadjustment: -1,
            effect: "None"
        },
        {
            name: "Iron Tail",
            numUses: 15,
            damage: 100,
            type: "Steel",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "None"
        },
        {
            name: "Thunder Wave",
            numUses: 20,
            damage: 0,
            type: "Electric",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "Paralysis"
        },
        {
            name: "Thunder",
            numUses: 15,
            damage: 110,
            type: "Electric",
            atkadjustment: 0,
            defadjustment: 0,
            effect: "None"
        },
    ],
    speed: 600,
    baseatk: 700,
    basedef: 450,
    atk: 0,
    def: 0,
    atkCount: 0,
    defCount: 0,
    weakness: ["Ground"],
    resistance: ["Flying", "Electric", "Steel"],
    status: "Normal"
}

let isPlayer1Turn: boolean = true

console.log("Player 2 sends out " + pokemon2.name)
console.log("HP : " + pokemon2.hp)
console.log("Level : " + pokemon2.lvl)

console.log("Player 1 sends out " + pokemon1.name)
console.log("HP : " + pokemon1.hp)
console.log("Level : " + pokemon1.lvl)

const displaySkills = (pokemon) => {
    console.log("-------------------------------------")
    console.log(`${pokemon.name}'s Skill List :`)
    for(let i = 0; i < pokemon.skills.length; i++){
        const skill = pokemon.skills[i];
        const num = i +1
        // console.log(num+"."+skill.name +", " + skill.type + ", Uses: " + skill.numUses+ ", Damage: " + skill.damage)
        console.log(`${num}) ${skill.name} - Types: ${skill.type}, PP: ${skill.numUses}, Power: ${skill.damage}`)
    }
}

const selectedAttack = (currentPokemon:Pokemon, targetPokemon:Pokemon): void => {
    console.log("-------------------------------------")
    const userInput = question("Please select an attack(number only): ");
    const selectedSkillIdx = parseInt(userInput) - 1
    const skill = currentPokemon.skills[selectedSkillIdx]

    if(currentPokemon.status == 'Paralysis'){
        const paralyze = Math.floor(Math.random() * 4);
        if(paralyze != 1){
            console.log(`${currentPokemon.name} used ${skill.name}!`)
            if(skill.atkadjustment != 0 || skill.defadjustment != 0){
                statAdjustment(currentPokemon,targetPokemon,skill)
            }else if(skill.effect != "None"){
                statEffect(targetPokemon,skill)
            }else{
                damageCalculation(currentPokemon,targetPokemon,skill)
            }
        }else{
            console.log(`${currentPokemon.name} is paralyzed! It can't move!`)
        }
    }else if(currentPokemon.status == "Sleep"){
        const sleep = Math.floor(Math.random() * 4);
        if(sleep != 1){
            console.log(`${currentPokemon.name} is awake!`)
            console.log(`${currentPokemon.name} used ${skill.name}!`)
            currentPokemon.status = "Normal"

            if(skill.atkadjustment != 0 || skill.defadjustment != 0){
                statAdjustment(currentPokemon,targetPokemon,skill)
            }else if(skill.effect != "None"){
                statEffect(targetPokemon,skill)
            }else{
                damageCalculation(currentPokemon,targetPokemon,skill)
            }
        }else{
            console.log(`${currentPokemon.name} is still sleeping!`)
        }
    }else if(currentPokemon.status == "Burned"){
        const burnDmg = Math.floor(1/8 * currentPokemon.hp)
        currentPokemon.hp -= burnDmg
        console.log(`${currentPokemon.name} hurt by its burn!`)
        if(targetPokemon.hp > 0){
            console.log(`${currentPokemon.name}'s HP reducded by ${burnDmg}, ${currentPokemon.hp} HP Remaining`)
        }else{
            console.log(`${currentPokemon.name} 's HP reducded by ${burnDmg}, 0 HP Remaining`)
        }

        console.log(`${currentPokemon.name} used ${skill.name}!`)

        if(skill.atkadjustment != 0 || skill.defadjustment != 0){
            statAdjustment(currentPokemon,targetPokemon,skill)
        }else if(skill.effect != "None"){
            statEffect(targetPokemon,skill)
        }else{
            damageCalculation(currentPokemon,targetPokemon,skill)
        }
    }else if(currentPokemon.status == "Poisioned"){
        const poisonDmg = Math.floor(1/8 * currentPokemon.hp)
        currentPokemon.hp -= poisonDmg
        console.log(`${currentPokemon.name} hurt by its burn!`)
        if(targetPokemon.hp > 0){
            console.log(`${currentPokemon.name}'s HP reducded by ${poisonDmg}, ${currentPokemon.hp} HP Remaining`)
        }else{
            console.log(`${currentPokemon.name} 's HP reducded by ${poisonDmg}, 0 HP Remaining`)
        }

        console.log(`${currentPokemon.name} used ${skill.name}!`)

        if(skill.atkadjustment != 0 || skill.defadjustment != 0){
            statAdjustment(currentPokemon,targetPokemon,skill)
        }else if(skill.effect != "None"){
            statEffect(targetPokemon,skill)
        }else{
            damageCalculation(currentPokemon,targetPokemon,skill)
        }
    }else{
        console.log(`${currentPokemon.name} used ${skill.name}!`)

        if(skill.atkadjustment != 0 || skill.defadjustment != 0){
            statAdjustment(currentPokemon,targetPokemon,skill)
        }else if(skill.effect != "None"){
            statEffect(targetPokemon,skill)
        }else{
            damageCalculation(currentPokemon,targetPokemon,skill)
        }
    } 
    //targetPokemon.hp -= skill.damage
    // console.log(`${currentPokemon.name} used ${skill.name}!`)
    // if(targetPokemon.hp < 0){
    //     console.log(`${targetPokemon.name} 's HP reducded by ${skill.damage}, 0 HP Remaining`)
    // }else{
    //     console.log(`${targetPokemon.name} 's HP reducded by ${skill.damage}, ${targetPokemon.hp} HP Remaining`)
    // }
}

const statEffect = (targetPokemon:Pokemon, skill:Skill): void => {
    if(targetPokemon.status == "Normal"){
        targetPokemon.status = skill.effect

        if(skill.effect == "Paralysis"){
            console.log(`${targetPokemon.name} is paralyzed! It may not attack!`)
        }else if(skill.effect == "Sleep"){
            console.log(`${targetPokemon.name} is fast asleep!`)
        }else if(skill.effect == "Burned"){
            console.log(`${targetPokemon.name} is burned!`)
        }else{
            console.log(`${targetPokemon.name} is poisoned!`)
        }
    }else{
        console.log(`${skill.name} has no effect now!`)
    }   
}

const damageCalculation = (currentPokemon:Pokemon, targetPokemon:Pokemon, skill:Skill): void => {
    const totaldmg = Math.floor(((currentPokemon.baseatk * ( 1 + currentPokemon.atkCount)) / (targetPokemon.basedef * ( 1 + targetPokemon.defCount))) * skill.damage)
    const finaldmg = elementCalculation(targetPokemon,skill,totaldmg)
    targetPokemon.hp -= finaldmg
    if(targetPokemon.hp < 0){
        console.log(`${targetPokemon.name}'s HP reducded by ${finaldmg}, 0 HP Remaining`)
    }else{
        console.log(`${targetPokemon.name}'s HP reducded by ${finaldmg}, ${targetPokemon.hp} HP Remaining`)
    }
}

const elementCalculation = (targetPokemon, skill, totaldmg) => {
    let elementdmg = 0
    for (let weakness of targetPokemon.weakness) {
        if(skill.type == weakness){
            elementdmg = Math.floor(totaldmg * 2)
            return (elementdmg)
        }else{

        }
    }

    for (let resistance of targetPokemon.resistance) {
        if(skill.type == resistance){
            elementdmg = Math.floor(totaldmg / 2)
            return (elementdmg)
        }else{

        }
    }
    return (totaldmg)
}

const statAdjustment = (currentPokemon:Pokemon, targetPokemon:Pokemon, skill:Skill): void => {
    if(skill.atkadjustment > 0 && currentPokemon.atkCount < 0.5){
        //currentPokemon.atk *= 1 + (skill.atkadjustment/10)
        //currentPokemon.atk = currentPokemon.baseatk * (skill.atkadjustment/10)
        currentPokemon.atkCount += 0.1
        console.log(`${currentPokemon.name}'s Attack Rose!`)
    }else if(skill.atkadjustment < 0 && targetPokemon.atkCount > -0.5){
        //targetPokemon.atk *= 1 - (skill.atkadjustment/10)
        targetPokemon.atkCount -= 0.1
        console.log(`${targetPokemon.name}'s Attack Fell!`)
    }else if(skill.defadjustment > 0 && currentPokemon.defCount < 0.5){
        currentPokemon.defCount += 0.1
        console.log(`${currentPokemon.name}'s Defense Rose!`)
    }else if(skill.defadjustment < 0 && targetPokemon.defCount > -0.5){
        targetPokemon.defCount -= 0.1
        console.log(`${targetPokemon.name}'s Defense Fell!`)
    }else{
        console.log(`${skill.name} has no effect now!`)
    }
}

// const randomAttack = (currentPokemon:Pokemon, targetPokemon:Pokemon): void => {
//     console.log("-------------------------------------")
//     const selectedSkillIdx = Math.floor(Math.random() * (currentPokemon.skills.length));
//     const skill = currentPokemon.skills[selectedSkillIdx]
//     damageCalculation(currentPokemon,targetPokemon,skill)
//     targetPokemon.hp -= skill.damage
//     console.log(`${currentPokemon.name} used ${skill.name}!`)
//     if(targetPokemon.hp < 0){
//         console.log(`${targetPokemon.name} 's HP reducded by ${skill.damage}, 0 HP Remaining`)
//     }else{
//         console.log(`${targetPokemon.name} 's HP reducded by ${skill.damage}, ${targetPokemon.hp} HP Remaining`)
//     }
// } 

if (pokemon1.speed > pokemon2.speed) {
    isPlayer1Turn = true;
    console.log(pokemon1.name + " goes first!")
} else {
    isPlayer1Turn = false;
    console.log(pokemon2.name + " goes first!")
}

while(pokemon2.hp > 0 && pokemon1.hp > 0) {
    if (isPlayer1Turn == true) {
        displaySkills(pokemon1)
        selectedAttack(pokemon1, pokemon2)
    }  else {
        displaySkills(pokemon2)
        selectedAttack(pokemon2, pokemon1)
        //randomAttack(pokemon2, pokemon1)
    }
    
    if (pokemon2.hp <= 0 ) {
        console.log(`GAME OVER, ${pokemon1.name} won!`)
    } else if (pokemon1.hp <= 0) {
        console.log(`GAME OVER, ${pokemon2.name} won!`)
    } else {
        isPlayer1Turn = !isPlayer1Turn
    }
}
