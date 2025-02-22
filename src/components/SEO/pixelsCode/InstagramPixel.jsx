import { useEffect } from 'react';

function InstagramPixel({ data }) {
    useEffect(() => {
        if (data) {
            const noScript = data?.slice(data?.indexOf("<noscript>") + 10, data?.lastIndexOf("</noscript>"));
            const noscript = document.createElement("noscript");
            noscript.textContent = noScript;
            const scriptData = data?.slice(data?.indexOf("<script>") + 10, data?.lastIndexOf("</script>") -3);
            const script = document.createElement("script");
            script.textContent = scriptData;
            document.head.appendChild(script);
            document.head.appendChild(noscript);
        }
    }, [data]);
    return null;
}

export default InstagramPixel
