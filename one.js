async function abcd(){
    const data = await fetch('https://jsonplaceholder.typicode.com/posts')
    const posts = await data.json()

    console.log(posts[0])
}

abcd();

console.log("hello");