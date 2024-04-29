import { useState, useRef, UIEventHandler, ChangeEventHandler } from "react";
import styled from "styled-components";
import { addresses } from "./addresses";
import { Glyph } from "./Glyph";
import { useOnnxWeb } from "./useOnnxWeb";
import "./App.css";

const TextBox = styled.div`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  font-family: "Courier New";
  font-size: 50px;
  letter-spacing: 25px;
  outline: none !important;
`;

const StyledGlyphArea = styled(TextBox)`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  background-color: black;
  overflow: hidden;
  color: white;
`;

const StyledTextInput = styled(TextBox)`
  background-color: transparent;
  resize: none;
  color: transparent;
  border: none;
  caret-color: white;
`;

const NonGlyph = styled("span")`
  position: relative;
  color: transparent;
  &:after {
    color: white;
    filter: blur(1px);
    position: absolute;
    left: 10px;
    content: attr(data-char);
  }
`;

function App() {
  const glyphAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");

  const { init } = useOnnxWeb("https://zackdavis.net/vgan_emnist.onnx");
  init();

  const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const val = e.currentTarget.value || "";
    setText(val);
  };

  // make sure text boxes are always aligned
  const handleScroll: UIEventHandler<HTMLTextAreaElement> = (e) => {
    if (glyphAreaRef.current) {
      glyphAreaRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const renderGlyphs = () =>
    text.split("").map((char, i) => {
      if (addresses[char]) {
        return <Glyph key={i} chars={char} />;
      } else if (/\s/g.test(char)) {
        return char;
      } else {
        return (
          <NonGlyph key={i} data-char={char}>
            {char}
          </NonGlyph>
        );
      }
    });

  return (
    <div className="App">
      <StyledGlyphArea ref={glyphAreaRef}>{renderGlyphs()}</StyledGlyphArea>

      <StyledTextInput
        as={"textarea"}
        ref={textAreaRef}
        value={text}
        onChange={handleTextAreaChange}
        onScroll={handleScroll}
        spellCheck={false}
      />
    </div>
  );
}

export default App;
