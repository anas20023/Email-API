const el = document.querySelector("#ct");

//const arr = ["Do You Know Me?", "How do You Know ?", "Let's Intoduce"];
const arr = [
  "Do You Know Me?",
  "How do You Know?",
  "Let's Introduce",
  "Who Are You?",
  "Where Are You From?",
  "What Do You Do?",
  "Can You Tell Me More?",
  "What's Your Name?",
  "How Old Are You?",
  "What's Your Favorite Hobby?",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
let sleepTime = 100;
let curPhraseIndex = 0;
const writeLoop = async () => {
  while (true) {
    let curWord = arr[curPhraseIndex];

    for (let i = 0; i < curWord.length; i++) {
      el.innerText = curWord.substring(0, i + 1);
      await sleep(sleepTime);
    }

    await sleep(sleepTime * 10);

    for (let i = curWord.length; i > 0; i--) {
      el.innerText = curWord.substring(0, i - 1);
      await sleep(sleepTime);
    }

    await sleep(sleepTime * 5);

    if (curPhraseIndex === arr.length - 1) {
      curPhraseIndex = 0;
    } else {
      curPhraseIndex++;
    }
  }
};

writeLoop();
