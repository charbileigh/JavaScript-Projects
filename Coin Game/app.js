let heads = 0;
let tails = 0;
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");


flipBtn.addEventListener("click", () => {
    let i = Math.floor(Math.random() * 2);
    console.log(i, "random number");
    coin.style.animation = "none";
    if (i) {
        console.log(i, "inside head");
        setTimeout(function () {
            coin.style.animation = "spin-heads 3s forwards";
        }, 100);
        heads++;
    } else {
        console.log(i, "inside tails");
        setTimeout(function () {
            coin.style.animation = "spin-tails 3s forwards";
        }, 100);
        tails++;
    }
    setTimeout(updateStats, 3000);
    disableButton();
});


function updateStats() {
    document.querySelector("#heads-count").textContent = `Heads: ${heads}`;
    document.querySelector("#tails-count").textContent = `Tails: ${tails}`;
}


function disableButton() {
    flipBtn.disabled = true;
    setTimeout(function () {
        flipBtn.disabled = false;
    }, 3000);
}


resetBtn.addEventListener("click", () => {
    coin.style.animation = "none";
    heads = 0;
    tails = 0;
    updateStats();
})