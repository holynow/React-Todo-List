import { useAtom } from "jotai";
import { isDarkAtom } from "../atom";
import styled from "styled-components";

const ThemeButton = styled.button`
  margin-left: 20px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
`;

const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useAtom(isDarkAtom);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <ThemeButton onClick={toggleTheme}>
      {isDark ? "Light Mode" : "Dark Mode"}
    </ThemeButton>
  );
};

export default ThemeToggleButton;
