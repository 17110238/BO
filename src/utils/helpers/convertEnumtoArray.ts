

export const convertEnumtoArray = (enumArray: any) => {
    let output = [];

    for (let key in enumArray) {
        output.push(enumArray[key]);    
    }

    return output

}