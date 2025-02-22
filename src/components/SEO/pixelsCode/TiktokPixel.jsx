import { useEffect } from 'react';

function TiktokPixel({data}) {
    useEffect(() => {
        if(data){
            const script = document.createElement("script");
            script.textContent = data?.replace(/<script>/g, '')?.replace(/<\/script>/g, '')?.replace(/<script>/g, '');
            document.head.appendChild(script);
        }
    }, [data]);
    return null;
}

export default TiktokPixel
