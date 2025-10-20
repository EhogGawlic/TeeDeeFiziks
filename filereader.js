export async function readTextFile(filepath){
    const response = await fetch(filepath)
    if(!response.ok){
        throw new Error(`Failed to load file: ${filepath}, status: ${response.status}`)
    }
    return await response.text()
}