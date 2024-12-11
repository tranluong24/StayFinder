const num: number =5;
const str : string = "Hello World !"

type Person = {
    age: number,
    name: string
}

const huy:Person ={
    age:5,
    name: "huy"
}

const people: Array<Person> = []

people.push({
    age: 5,
    name:"hello"
})

for(const person of people){
    console.log(person.name);
}

enum PersonType{
    Student, Gamer, Coder
}
 
//any: k can quan tam type cua truong

function add(a:number,b:number): number{
    return a+b;
}

console.log(huy.age)