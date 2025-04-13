import { useEffect } from "react";

const useFavicon = (iconUrl) => {
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");

    if (link) {
      link.href = iconUrl;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = iconUrl;
      document.head.appendChild(newLink);
    }
  }, [iconUrl]); // Effect will run whenever the iconUrl changes
};

export default useFavicon;
