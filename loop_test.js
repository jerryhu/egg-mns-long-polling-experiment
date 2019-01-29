'use strict';

main();

async function main() {
  let open = false;

  setTimeout(function() {
    open = true;
  }, 1000);

  while (!open) {
    // await sleep(100);
    console.log('wait');
  }

  console.log('open sesame');
}

// async function sleep(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// }
