const CryptoJS = require("crypto-js");

function hash(key) {
  // Sử dụng thuật toán băm SHA-256
  return CryptoJS.SHA256(key).toString();
}

function encrypt(secretKey, plaintext) {
  const salt = new Date();
  console.log("salt: ", salt.getSeconds());
  if (salt.getSeconds() % 3 === 0) {
    return CryptoJS.AES.encrypt(
      salt.toString().slice(0, 16).concat(plaintext).concat(salt.toString()),
      secretKey
    ).toString();
  } else {
    if (salt.getSeconds() % 3 === 1) {
      return CryptoJS.AES.encrypt(
        salt.toString().slice(17, 25).concat(plaintext).concat(salt.toString()),
        secretKey
      ).toString();
    } else {
      return CryptoJS.AES.encrypt(
        salt.toString().slice(27, 31).concat(plaintext).concat(salt.toString()),
        secretKey
      ).toString();
    }
  }
}

function decrypt(secretKey, cipherText) {
  const PlainText = CryptoJS.AES.decrypt(cipherText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  const length = PlainText.length;
  const time = new Date(PlainText.slice(-50));

  if (time.getSeconds() % 3 === 0) {
    return PlainText.slice(16, length - 50);
  } else {
    if (time.getSeconds() % 3 === 1) {
      return PlainText.slice(8, length - 50);
    } else {
      return PlainText.slice(4, length - 50);
    }
  }
}

// Hàm chuyển chuỗi thành giá trị nhị phân
function stringToBinary(string) {
  let binary = "";
  for (let i = 0; i < string.length; i++) {
    binary += string[i].charCodeAt(0).toString(2) + " ";
  }
  return binary.trim();
}

// Hàm chuyển giá trị nhị phân thành chuỗi
function binaryToString(binary) {
  const binaryArray = binary.split(" ");
  let string = "";
  for (let i = 0; i < binaryArray.length; i++) {
    const decimalValue = parseInt(binaryArray[i], 2);
    string += String.fromCharCode(decimalValue);
  }
  return string;
}

// function readFile


export { hash, encrypt, decrypt, stringToBinary, binaryToString };
