const body = document.body.getRootNode().body;
const colorValue = document.getElementById("color-value");
function changeColor(id) {
    if (id === "random") {
        let color = getRandomColor();
        body.style.backgroundColor = color;
        colorValue.innerHTML = color;
    } else {
        body.style.backgroundColor = id;
        colorValue.innerHTML = id;
    }


}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
async function copy() {
    console.log(colorValue)
    try {
        await navigator.clipboard.writeText(colorValue.innerText);

        alert('Content copied to clipboard');
    }
    catch (err) {
        console.error(err);
    }
}

