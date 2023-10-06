import { useState } from "react";
import { Link } from "react-router-dom";

import "../../App.css";
import { hash, encrypt, stringToBinary, binaryToString } from "../../tool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
function Encrypt() {
  const [type, setType] = useState("text");

  // state
  const [plainText, setPlainText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [bin, setBin] = useState("");
  const [key, setKey] = useState("");
  const [hide, setHide] = useState(true);

  //function
  const handleEncrypt = async () => {
    // if(type == 'text') {
    if (key.length > 0) {
      const hashTextHex = await hash(key);
      if (type === "text") {
        if (plainText.length > 0) {
          const text = await encrypt(hashTextHex, plainText);
          await setCipherText(text);
          await setBin(stringToBinary(text));
        } else {
          alert("Please Input the plaintext to encrypt");
        }
      } else {
        if (fileContent.length > 0) {
          const text = await encrypt(hashTextHex, fileContent);

          const blob = new Blob([text], { type: "text/plain; charset=utf-8" });

          // Tạo một URL đối tượng từ Blob
          const url = URL.createObjectURL(blob);

          // Tạo một thẻ <a> để tạo và tải tệp mới
          const a = document.createElement("a");
          a.href = url;
          a.download = `encrypt-${nameFile}`;
          a.textContent = "Tải xuống tệp đã xử lý";

          // Thêm thẻ <a> vào DOM để người dùng có thể tải xuống tệp
          document.body.appendChild(a);

          // Kích hoạt sự kiện nhấp chuột tự động trên thẻ <a>
          a.click();

          // Loại bỏ thẻ <a> sau khi người dùng tải xuống tệp
          document.body.removeChild(a);

          await setCipherText("The file content has been processed");
          await setBin(stringToBinary("The file content has been processed"));
        } else {
          alert("The file content is empty");
        }
      }
    } else {
      alert("Please Input the key");
      return;
    }
    // } else {
    //   alert("Handling encrypt file")
    // }
  };

  return (
    <>
      <h2 className="title">Welcome To Our Encryption Program</h2>
      <div className="content">
        <div className="side-bar">
          <Link to="/" className={`side-bar-name active`}>
            Encryption
          </Link>
          <Link to="/decrypt" className={`side-bar-name`}>
            Decryption
          </Link>
        </div>
        <div className="form">
          <div className="form-content">
            <div className="start">
              <select
                id="select"
                className="select"
                onChange={(e) => {
                  setPlainText("");
                  setFileContent("");
                  setType(e.target.value);
                }}
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
              <input
                id="input"
                type={type}
                className="input"
                value={plainText}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEncrypt();
                  }
                }}
                onChange={(e) => {
                  if (e.target.type === "text") {
                    setPlainText(e.target.value);
                  } else {
                    if (e.target.files[0]) {
                      setPlainText(e.target.value);
                      setNameFile(e.target.files[0].name);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFileContent(e.target.result);
                      };
                      reader.readAsText(e.target.files[0]);
                    } else {
                      setPlainText("");
                    }
                  }
                }}
              />
              <label htmlFor="key"></label>
              <div id="key" className="key">
                <input
                  className="key-input"
                  placeholder="Your Key to Encrypt"
                  value={key}
                  type={hide && "password"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEncrypt();
                    }
                  }}
                  onChange={(e) => setKey(e.target.value)}
                />
                <div
                  className="icon"
                  onClick={() => {
                    setHide((prev) => !prev);
                  }}
                >
                  {hide ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </div>
              </div>
              <button className="btn" onClick={() => handleEncrypt()}>
                Encrypt
              </button>
            </div>
            <div className="end">
              <label className="label">CipherText</label>
              <div id="text" className="text">
                <div className="utf">
                  Utf8: <strong>{cipherText}</strong>
                </div>
                <div className="bin">
                  Binary: <strong>{bin}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Encrypt;
