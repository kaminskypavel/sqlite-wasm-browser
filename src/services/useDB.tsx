import {useEffect, useState} from "react"
import sql from "sql.js"

export function useDB(data?: ArrayBuffer | null) {
    const [engine, setEngine] = useState(null)
    const [db, setDB] = useState<sql.Database | null>(null)
    const [windowWatcher, setWindowWatcher] = useState(false);

    useEffect(() => {
        if (window) {
            console.log("Running in a browser, checking for loadSQL")

            const timer = setInterval(() => {
                console.log("Polling...");

                // @ts-ignore
                if (window.loadSQL) {
                    console.log("Clearing timer")
                    clearInterval(timer);
                    setWindowWatcher(true)
                }
            }, 500)
        }
    }, [])

    useEffect(() => {
        console.log("Looking for loadSQL")
        // @ts-ignore
        if (window.initSqlJs) {
            console.log("Should try initSQLJS")
            // @ts-ignore
            window.loadSQL().then((db) => {
                console.log("I have the database")
                setEngine(db)
            })
        }
        return () => { }
       // @ts-ignore
    }, [windowWatcher, window?.initSqlJs])

    useEffect(() => {
        if (engine && data) {
            console.log("Starting up the engine")

            // @ts-ignore
            setDB(new engine.Database(new Uint8Array(data)))
        }

        return () => { }
    }, [data, engine])

    return db
}

type Nullable<T> = T | null | undefined;

export function useDBQuery(db: Nullable<sql.Database>, query: string) {
    const [results, setResults] = useState<sql.QueryExecResult[] | null>(null)

    useEffect(() => {
        if (db) {
            console.log(`Running query ${query}`)
            const r = db.exec(query)
            console.log(r)

            setResults(r)
        }
    }, [db, query])

    return results;
}
