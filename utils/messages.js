export const generateMessage = (text)=>{
    return {
        text,
        created: new Date().getTime()
    }
}
