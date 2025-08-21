export async function getData() {
    try {
        const data = await fetch('./data.json');
        const response = await data.json();
        return response;
    } catch (error) {
        console.error('error fetching json', error)
    }
}
