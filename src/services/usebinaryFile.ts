import {useEffect, useState} from "react";

export default function useBinaryFile(url: string) {
    const [data, setData] = useState<ArrayBuffer | null>(null)

    useEffect(() => {
        console.log(`Loading ${url}`)

        fetch(url)
            .then((res) => {
                res.arrayBuffer().then((data) => setData(data))
            })

        return () => {
            console.log("Unmounted binary file")
        }
    }, [url]);

    return data
}
