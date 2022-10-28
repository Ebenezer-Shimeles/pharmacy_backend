


export function generateVerficationCode(){
    let random = Math.random();
    
    random *= 10000;

    random = Math.ceil(random)

    return random;

}