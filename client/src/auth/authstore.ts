let accessToken : string |null=null

export  function getAccessToken(){
    return accessToken
}
export function setAccessToken(token:string){
    accessToken=token
}
export default function clearAccessToken(){
    accessToken=null
}