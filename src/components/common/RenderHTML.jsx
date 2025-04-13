import parse from "html-react-parser";
import DOMPurify from "dompurify";

export const RenderHTML = ({ htmlString }) => {
  return parse(DOMPurify.sanitize(htmlString));
};
