import React from "react";
import { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState("text");
  const [encrypted, setEncrypted] = useState("");
  const [mode, setMode] = useState(null);
  const [key, setKey] = useState("");
  const [shift, setShift] = useState(0);

  useEffect(() => {
    if (mode) {
      encrypt(text);
    }
  }, [mode, key, shift]);

  function encrypt(text) {
    setText(text);
    let encrypted = text;
    if (mode == "base64") {
      encrypted = base64(text);
    }
    if (mode == "caesar") {
      encrypted = caesar(shift, text);
    }
    if (mode == "rot13") {
      encrypted = rot13(text);
    }
    if (mode == "vigenere") {
      encrypted = vigenere(key, text);
    }
    if (mode == "railfence") {
      encrypted = railfence(key, text);
    }

    setEncrypted(encrypted);
  }

  function base64(text) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    let result = "";

    for (let i = 0; i < text.length; i += 3) {
      let char1 = text.charCodeAt(i);
      let char2 = text.charCodeAt(i + 1);
      let char3 = text.charCodeAt(i + 2);

      let code1 = char1 >> 2;
      let code2 = ((char1 & 3) << 4) | (char2 >> 4);
      let code3 = ((char2 & 15) << 2) | (char3 >> 6);
      let code4 = char3 & 63;

      if (!char2) {
        code3 = code4 = 64;
      } else if (!char3) {
        code4 = 64;
      }

      result += chars[code1] + chars[code2] + chars[code3] + chars[code4];
    }

    return result;
  }

  function caesar(shift, text) {
    let result = "";
    if (typeof shift !== "number") {
      shift = parseInt(shift);
    }
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        code = ((code - 65 + shift) % 26) + 65;
      } else if (code >= 97 && code <= 122) {
        code = ((code - 97 + shift) % 26) + 97;
      }
      result += String.fromCharCode(code);
    }
    return result;
  }

  function rot13(text) {
    return caesar(13, text);
  }

  function vigenere(key, text) {
    let result = "";
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        code = ((code - 65 + key.charCodeAt(keyIndex) - 65) % 26) + 65;
        keyIndex = (keyIndex + 1) % key.length;
      } else if (code >= 97 && code <= 122) {
        code = ((code - 97 + key.charCodeAt(keyIndex) - 97) % 26) + 97;
        keyIndex = (keyIndex + 1) % key.length;
      }
      result += String.fromCharCode(code);
    }
    return result;
  }

  function railfence(rails, text) {
    if (typeof rails !== "number") {
      rails = parseInt(shift);
    }
    if (rails <= 1) return text;

    let rows = new Array(rails).fill("").map(() => "");

    let row = 0;
    let direction = 1;

    for (let char of text) {
      rows[row] += char;

      if (row === 0) {
        direction = 1;
      } else if (row === rails - 1) {
        direction = -1;
      }

      row += direction;
    }

    return rows.join("").replace(/ /g, "");
  }

  return (
    <div className="w-full min-h-screen px-10 flex flex-col justify-center items-start bgimage">
      <div>
        <h1 className="text-2xl font-bold mt-5">Input</h1>
        <input
          type="text"
          value={text}
          onChange={(e) => encrypt(e.target.value)}
          placeholder="Type something..."
        />
        <h1 className="text-2xl font-bold mt-5">Encrypted</h1>
        <p className="text-lg mt-2 min-h-5]:">{encrypted}</p>
        <h1 className="text-2xl font-bold mt-5">Key</h1>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Type something..."
        />
        <h1 className="text-2xl font-bold mt-5">Shift</h1>
        <input
          type="number"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold mt-5">Mode</h1>
        <select
          onChange={(e) => setMode(e.target.value)}
          className="text-lg mt-2"
        >
          <option value={null}>Select Mode</option>
          <option value="base64">Base64</option>
          <option value="caesar">Caesar (Shift)</option>
          <option value="rot13">Rot13</option>
          <option value="vigenere">Vigenere (Key)</option>
          <option value="railfence">Railfence (Shift)</option>
        </select>
      </div>
    </div>
  );
};

export default App;
