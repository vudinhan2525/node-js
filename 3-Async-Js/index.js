const fs = require('fs');
const superagent = require('superagent');
const readFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject('Read-file-failed');
            else resolve(data);
        });
    });
};
const writeFilePromise = (fileSave, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileSave, data, (err) => {
            if (err) reject('Write-file-failed');
            else resolve();
        });
    });
};
const getDogPic = async () => {
    try {
        const data = await readFilePromise('./dog.txt');
        console.log('Breed: ', data);
        const res1 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const all = await Promise.all([res1, res2, res3]);
        const imgs = all.map((element) => element.body.message);
        console.log(imgs);
        await writeFilePromise('result.txt', imgs.join('\n'));
    } catch (error) {
        throw error;
    }
    return '2.READY';
};
(async () => {
    try {
        console.log('1.Getting...');
        console.log(await getDogPic());
        console.log('3.Done');
    } catch (error) {
        console.log(error);
    }
})();
// console.log('1.Getting...');
// getDogPic()
//     .then((res) => {
//         console.log(res);
//         console.log('3.Done');
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// readFilePromise('./dog.txt')
//     .then((data) => {
//         console.log('Breed: ', data);
//         return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     })
//     .then((res) => {
//         return writeFilePromise('result.txt', res.body.message);
//     })
//     .then(() => {
//         console.log('Write-file succcess');
//     })
//     .catch((err) => {
//         console.log(err);
//     });
