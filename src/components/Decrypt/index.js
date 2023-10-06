import { useState } from "react";
import { Link } from "react-router-dom";

import "../../App.css";

import { hash, decrypt } from "../../tool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Decrypt() {
  const [type, setType] = useState("text");

  //
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [key, setKey] = useState("");
  const [hide, setHide] = useState(true);

  //function
  const handleDecrypt = async () => {
    if (key.length > 0) {
      const hashTextHex = await hash(key);
      if (type === "text") {
        if (cipherText.length > 0) {
          const text = await decrypt(hashTextHex, cipherText);
          await setPlainText(text);
        } else {
          alert("Please Input the cipherText");
        }
      } else {
        if (fileContent.length > 0) {
          const text = await decrypt(hashTextHex, fileContent);
          console.log(text);
          const blob = new Blob([text], { type: "text/plain; charset=utf-8" });

          // Tạo một URL đối tượng từ Blob
          const url = URL.createObjectURL(blob);

          // Tạo một thẻ <a> để tạo và tải tệp mới
          const a = document.createElement("a");
          a.href = url;
          a.download = `decrypt.txt`;
          a.textContent = "Tải xuống tệp đã xử lý";

          // Thêm thẻ <a> vào DOM để người dùng có thể tải xuống tệp
          document.body.appendChild(a);

          // Kích hoạt sự kiện nhấp chuột tự động trên thẻ <a>
          a.click();

          // Loại bỏ thẻ <a> sau khi người dùng tải xuống tệp
          document.body.removeChild(a);

          await setPlainText("The file content has been processed");
        } else {
          alert("The file content is empty");
        }
      }
    } else {
      alert("Please Input the key");
      return;
    }
  };

  return (
    <>
      <h2 className="title">Welcome To Our Decryption Program</h2>
      <div className="content">
        <div className="side-bar">
          <Link to="/" className={`side-bar-name`}>
            Encryption
          </Link>
          <Link to="/decrypt" className={`side-bar-name active`}>
            Decryption
          </Link>
        </div>
        <div className="form">
          <div className="form-content active">
            <div className="start">
              <select
                id="select"
                className="select"
                onChange={(e) => {
                  setCipherText("");
                  setFileContent("");
                  setType(e.target.value);
                }}
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
              <input
                type={type}
                className="input"
                value={cipherText}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleDecrypt();
                  }
                }}
                onChange={(e) => {
                  if (e.target.type === "text") {
                    setCipherText(e.target.value);
                  } else {
                    if (e.target.files[0]) {
                      setCipherText(e.target.value);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFileContent(e.target.result);
                      };
                      reader.readAsText(e.target.files[0]);
                    } else {
                      setCipherText("");
                    }
                  }
                }}
              />
              <label htmlFor="key"></label>
              <div id="key" className="key">
                <input
                  className="key-input"
                  placeholder="Your Key to Decrypt"
                  value={key}
                  type={hide && "password"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleDecrypt();
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
              <button className="btn" onClick={handleDecrypt}>
                Decrypt
              </button>
            </div>
            <div className="end">
              <label className="label">PlainText</label>
              <div className="text">{plainText}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Decrypt;
